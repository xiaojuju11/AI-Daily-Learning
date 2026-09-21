/**
 * CampusTask — 校园任务管理
 * 纯原生 JavaScript + localStorage，无任何第三方依赖。
 *
 * 模块通过 IIFE 封装，除 DOM 事件外不向 window 暴露任何变量。
 */
(function () {
  'use strict';

  /* ==========================================================================
   * 1. 常量
   * ========================================================================== */

  /** localStorage 键名，带版本号便于以后做数据迁移 */
  const STORAGE_KEY = 'campustask.tasks.v1';

  /** 优先级定义：value 存入数据，label 用于展示，rank 用于排序 */
  const PRIORITY = {
    high:   { value: 'high',   label: '高', rank: 0 },
    medium: { value: 'medium', label: '中', rank: 1 },
    low:    { value: 'low',    label: '低', rank: 2 }
  };
  const DEFAULT_PRIORITY = 'medium';

  /** 状态筛选值 */
  const STATUS_ALL = 'all';
  const COURSE_ALL = 'all';

  /** 表单里的候选项，用户也可以自由输入（配合 datalist） */
  const COURSE_PRESETS = ['软件工程', '高等数学', '数据结构', '大学英语', '操作系统', '计算机网络'];
  const CATEGORY_PRESETS = ['课程作业', '考试复习', '小组项目', '实验报告', '阅读资料', '竞赛活动', '其他'];

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  /** 内联 SVG 图标 */
  const ICONS = {
    check: '<svg class="check-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    calendar: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style="width:13px;height:13px"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>',
    edit: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>'
  };

  /* ==========================================================================
   * 2. 应用状态（全部收敛在这里，不散落全局变量）
   * ========================================================================== */

  const state = {
    /** @type {Array<Object>} 任务列表，唯一的真实数据源 */
    tasks: [],
    /** 当前筛选条件 */
    filter: { course: COURSE_ALL, status: STATUS_ALL },
    /** 正在编辑的任务 id，null 表示新建 */
    editingId: null,
    /** 待删除的任务 id */
    deletingId: null,
    /** 打开弹窗前的焦点元素，关闭后还原 */
    lastFocused: null
  };

  /** DOM 引用缓存 */
  const dom = {};

  /* ==========================================================================
   * 3. 工具函数
   * ========================================================================== */

  /** 生成一个足够唯一的任务 id */
  function createId() {
    return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  /** 转义用户输入，避免 innerHTML 注入 */
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function toText(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  /** 是否为 YYYY-MM-DD 格式 */
  function isDateString(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  /** 把 YYYY-MM-DD 解析为「本地时区」的 Date，避免 new Date(str) 的 UTC 偏移问题 */
  function parseLocalDate(dateStr) {
    const parts = dateStr.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  /** 今天零点 */
  function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /** 距离截止日期还有几天（负数代表已逾期） */
  function daysUntil(dateStr) {
    return Math.round((parseLocalDate(dateStr) - startOfToday()) / MS_PER_DAY);
  }

  /**
   * 把截止日期格式化为「人话」
   * @returns {{text: string, tone: 'overdue'|'today'|'soon'|'normal'}}
   */
  function formatDueDate(dateStr) {
    const diff = daysUntil(dateStr);
    if (diff < 0)  return { text: '已逾期 ' + Math.abs(diff) + ' 天', tone: 'overdue' };
    if (diff === 0) return { text: '今天截止', tone: 'today' };
    if (diff === 1) return { text: '明天截止', tone: 'soon' };
    if (diff <= 3)  return { text: diff + ' 天后截止', tone: 'soon' };

    const date = parseLocalDate(dateStr);
    return { text: (date.getMonth() + 1) + ' 月 ' + date.getDate() + ' 日截止', tone: 'normal' };
  }

  /* ==========================================================================
   * 4. 数据层：统一结构 + localStorage 读写
   * ========================================================================== */

  /**
   * 把任意来源的对象归一化成统一的任务结构。
   * 字段缺失或类型不对时回退到默认值，保证渲染层拿到的数据永远可靠。
   * @returns {Object|null} 标题为空时返回 null，调用方负责过滤
   */
  function normalizeTask(raw) {
    if (!raw || typeof raw !== 'object') return null;

    const title = toText(raw.title);
    if (!title) return null;

    const now = new Date().toISOString();
    const completed = raw.completed === true;

    return {
      id: toText(raw.id) || createId(),
      title: title,
      course: toText(raw.course),
      category: toText(raw.category),
      dueDate: isDateString(raw.dueDate) ? raw.dueDate : '',
      priority: PRIORITY[raw.priority] ? raw.priority : DEFAULT_PRIORITY,
      completed: completed,
      createdAt: toText(raw.createdAt) || now,
      updatedAt: toText(raw.updatedAt) || now,
      completedAt: completed ? (toText(raw.completedAt) || now) : null
    };
  }

  /** 从 localStorage 读取任务；数据损坏时降级为空数组而不是崩溃 */
  function loadTasks() {
    let raw = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      console.warn('[CampusTask] 无法访问 localStorage：', err);
      return [];
    }
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('数据不是数组');
      return parsed.map(normalizeTask).filter(Boolean);
    } catch (err) {
      console.warn('[CampusTask] 本地数据解析失败，已忽略：', err);
      return [];
    }
  }

  /** 写入 localStorage（隐私模式下可能抛错，做兜底提示） */
  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
      return true;
    } catch (err) {
      console.warn('[CampusTask] 保存失败：', err);
      window.alert('保存失败：浏览器存储不可用（可能是隐私模式或空间已满）。');
      return false;
    }
  }

  /* ==========================================================================
   * 5. 业务操作
   * ========================================================================== */

  /** 新增任务 */
  function addTask(values) {
    const now = new Date().toISOString();
    const task = normalizeTask({
      id: createId(),
      title: values.title,
      course: values.course,
      category: values.category,
      dueDate: values.dueDate,
      priority: values.priority,
      completed: false,
      createdAt: now,
      updatedAt: now
    });
    if (!task) return;
    state.tasks.unshift(task);
    saveTasks();
    render();
  }

  /** 更新任务（保留完成状态与创建时间） */
  function updateTask(id, values) {
    const index = state.tasks.findIndex(function (t) { return t.id === id; });
    if (index === -1) return;

    const updated = normalizeTask(Object.assign({}, state.tasks[index], values, {
      updatedAt: new Date().toISOString()
    }));
    if (!updated) return;

    state.tasks[index] = updated;
    saveTasks();
    render();
  }

  /** 删除任务 */
  function deleteTask(id) {
    const before = state.tasks.length;
    state.tasks = state.tasks.filter(function (t) { return t.id !== id; });
    if (state.tasks.length === before) return;
    saveTasks();
    render();
  }

  /** 切换完成状态 */
  function toggleTask(id, completed) {
    const task = state.tasks.find(function (t) { return t.id === id; });
    if (!task || task.completed === completed) return;

    task.completed = completed;
    task.completedAt = completed ? new Date().toISOString() : null;
    task.updatedAt = new Date().toISOString();
    saveTasks();
    render();
  }

  /* ==========================================================================
   * 6. 派生数据：筛选与排序
   * ========================================================================== */

  /** 收集所有出现过的课程名（去重 + 中文排序） */
  function collectCourses() {
    const seen = {};
    state.tasks.forEach(function (t) {
      if (t.course) seen[t.course] = true;
    });
    return Object.keys(seen).sort(function (a, b) { return a.localeCompare(b, 'zh'); });
  }

  /**
   * 排序规则：
   *   1. 未完成在前，已完成沉底
   *   2. 未完成：截止日期近的在前（没有日期的排最后），同日期按优先级
   *   3. 已完成：最近完成的在前
   */
  function compareTasks(a, b) {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    if (a.completed) {
      return (b.completedAt || '').localeCompare(a.completedAt || '');
    }

    if (a.dueDate !== b.dueDate) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate < b.dueDate ? -1 : 1;
    }

    const byPriority = PRIORITY[a.priority].rank - PRIORITY[b.priority].rank;
    if (byPriority !== 0) return byPriority;

    return (a.createdAt || '').localeCompare(b.createdAt || '');
  }

  /** 按当前筛选条件取出可见任务（课程 + 状态为「与」关系），并排好序 */
  function getVisibleTasks() {
    const course = state.filter.course;
    const status = state.filter.status;

    return state.tasks
      .filter(function (t) {
        return course === COURSE_ALL || t.course === course;
      })
      .filter(function (t) {
        if (status === STATUS_ALL) return true;
        return status === 'completed' ? t.completed : !t.completed;
      })
      .sort(compareTasks);
  }

  function isFiltering() {
    return state.filter.course !== COURSE_ALL || state.filter.status !== STATUS_ALL;
  }

  /* ==========================================================================
   * 7. 渲染
   * ========================================================================== */

  function render() {
    renderStats();
    renderCourseFilter(); // 可能把已失效的课程筛选重置为「全部」
    const visible = getVisibleTasks();
    renderTaskList(visible);
    renderToolbar(visible);
    renderDatalists();
  }

  /** 概览卡片：数字 + 高亮当前状态筛选 */
  function renderStats() {
    const total = state.tasks.length;
    const done = state.tasks.filter(function (t) { return t.completed; }).length;

    dom.statAll.textContent = total;
    dom.statActive.textContent = total - done;
    dom.statCompleted.textContent = done;

    dom.statButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.status === state.filter.status));
    });
  }

  /** 课程下拉框：选项由现有任务动态生成 */
  function renderCourseFilter() {
    const courses = collectCourses();

    // 被筛掉的课程如果已经不存在了（改名/删除），自动回到「全部」
    if (state.filter.course !== COURSE_ALL && courses.indexOf(state.filter.course) === -1) {
      state.filter.course = COURSE_ALL;
    }

    const select = dom.filterCourse;
    select.innerHTML = '';
    select.appendChild(createOption('全部课程', COURSE_ALL));
    courses.forEach(function (course) {
      select.appendChild(createOption(course, course));
    });
    select.value = state.filter.course;
  }

  /** 表单里的候选课程 / 分类 */
  function renderDatalists() {
    const courses = uniqueList(COURSE_PRESETS.concat(collectCourses()));
    const categories = uniqueList(CATEGORY_PRESETS.concat(state.tasks.map(function (t) {
      return t.category;
    })));

    fillDatalist(dom.courseOptions, courses);
    fillDatalist(dom.categoryOptions, categories);
  }

  function renderToolbar(visible) {
    const total = state.tasks.length;
    dom.toolbarHint.textContent = isFiltering()
      ? '筛选出 ' + visible.length + ' / ' + total + ' 个任务'
      : '共 ' + total + ' 个任务';
    dom.clearFilters.hidden = !isFiltering();
  }

  /** 任务列表 + 两种空状态互斥展示 */
  function renderTaskList(visible) {
    const hasAnyTask = state.tasks.length > 0;
    const noMatch = hasAnyTask && visible.length === 0;

    dom.emptyNone.hidden = hasAnyTask;
    dom.emptyNoMatch.hidden = !noMatch;

    dom.list.innerHTML = '';
    if (!hasAnyTask || noMatch) return;

    visible.forEach(function (task) {
      dom.list.appendChild(createTaskCard(task));
    });
  }

  /** 构建单张任务卡片 */
  function createTaskCard(task) {
    const li = document.createElement('li');
    li.className = 'task-card' + (task.completed ? ' is-done' : '');
    li.dataset.id = task.id;
    li.dataset.priority = task.priority;

    const due = task.dueDate ? formatDueDate(task.dueDate) : null;

    const metaParts = [];
    if (task.course) metaParts.push('<span class="tag tag-course">' + escapeHtml(task.course) + '</span>');
    if (task.category) metaParts.push('<span class="tag">' + escapeHtml(task.category) + '</span>');
    if (due) {
      metaParts.push(
        '<span class="due' + (due.tone === 'normal' ? '' : ' is-' + due.tone) + '">' +
          ICONS.calendar + escapeHtml(due.text) +
        '</span>'
      );
    }
    if (task.completed) metaParts.push('<span class="tag tag-done">已完成</span>');

    li.innerHTML =
      '<div class="task-main">' +
        '<label class="check">' +
          '<input type="checkbox" data-action="toggle"' + (task.completed ? ' checked' : '') +
            ' aria-label="将「' + escapeHtml(task.title) + '」标记为' + (task.completed ? '未完成' : '已完成') + '">' +
          '<span class="check-box" aria-hidden="true">' + ICONS.check + '</span>' +
        '</label>' +
        '<div class="task-body">' +
          '<h3 class="task-title">' + escapeHtml(task.title) + '</h3>' +
          '<div class="task-meta">' + metaParts.join('') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="task-side">' +
        '<span class="pill pill-' + task.priority + '">' + PRIORITY[task.priority].label + '</span>' +
        '<div class="task-actions">' +
          '<button class="icon-btn" type="button" data-action="edit" title="编辑" aria-label="编辑任务">' + ICONS.edit + '</button>' +
          '<button class="icon-btn icon-btn-danger" type="button" data-action="delete" title="删除" aria-label="删除任务">' + ICONS.trash + '</button>' +
        '</div>' +
      '</div>';

    return li;
  }

  /* --- 渲染用的小工具 --- */
  function createOption(text, value) {
    const option = document.createElement('option');
    option.textContent = text;
    option.value = value;
    return option;
  }

  function uniqueList(list) {
    const seen = {};
    const result = [];
    list.forEach(function (item) {
      const value = toText(item);
      if (value && !seen[value]) {
        seen[value] = true;
        result.push(value);
      }
    });
    return result;
  }

  function fillDatalist(datalist, values) {
    datalist.innerHTML = '';
    values.forEach(function (value) {
      datalist.appendChild(createOption(value, value));
    });
  }

  /* ==========================================================================
   * 8. 弹窗
   * ========================================================================== */

  function openModal(modal) {
    state.lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    modal.hidden = true;
    if (!document.querySelector('.modal:not([hidden])')) {
      document.body.classList.remove('modal-open');
    }
    restoreFocus();
  }

  /**
   * 把焦点还给打开弹窗前的元素。
   * 两种情况会退回「新建任务」按钮，避免焦点无声地掉到 body 上：
   *   1. 原元素已不在文档里（所在任务卡刚被删除或重渲染）
   *   2. 原元素本来就是 body / html —— 它们同样「可聚焦」，
   *      对它们调用 focus() 等于什么都没做
   */
  function restoreFocus() {
    const target = state.lastFocused;
    state.lastFocused = null;

    const restorable = target &&
      target !== document.body &&
      target !== document.documentElement &&
      target.isConnected &&
      typeof target.focus === 'function';

    if (restorable) {
      target.focus();
      return;
    }
    if (dom.newTaskBtn) dom.newTaskBtn.focus();
  }

  function closeTopModal() {
    const open = document.querySelector('.modal:not([hidden])');
    if (open) closeModal(open);
  }

  /** 打开新建 / 编辑任务弹窗；传 id 表示编辑 */
  function openTaskModal(id) {
    const task = id ? state.tasks.find(function (t) { return t.id === id; }) : null;

    state.editingId = task ? task.id : null;
    dom.form.reset(); // 先复位，radio 回到 HTML 里的默认值（中）
    clearTitleError();

    if (task) {
      dom.modalTitle.textContent = '编辑任务';
      dom.saveBtn.textContent = '保存修改';
      dom.inputTitle.value = task.title;
      dom.inputCourse.value = task.course;
      dom.inputCategory.value = task.category;
      dom.inputDue.value = task.dueDate;
      setPriority(task.priority);
    } else {
      dom.modalTitle.textContent = '新建任务';
      dom.saveBtn.textContent = '保存任务';
      setPriority(DEFAULT_PRIORITY);
    }

    openModal(dom.taskModal);
    dom.inputTitle.focus();
  }

  /** 打开删除确认弹窗 */
  function openConfirm(id) {
    const task = state.tasks.find(function (t) { return t.id === id; });
    if (!task) return;

    state.deletingId = id;
    dom.confirmText.innerHTML =
      '确定要删除任务「<strong>' + escapeHtml(task.title) + '</strong>」吗？此操作无法撤销。';

    openModal(dom.confirmModal);
    dom.confirmPanel.focus();
  }

  /* ==========================================================================
   * 9. 表单读写与校验
   * ========================================================================== */

  function setPriority(value) {
    const input = dom.form.querySelector('input[name="priority"][value="' + value + '"]');
    if (input) input.checked = true;
  }

  function getPriority() {
    const checked = dom.form.querySelector('input[name="priority"]:checked');
    return checked ? checked.value : DEFAULT_PRIORITY;
  }

  function readForm() {
    return {
      title: toText(dom.inputTitle.value),
      course: toText(dom.inputCourse.value),
      category: toText(dom.inputCategory.value),
      dueDate: isDateString(dom.inputDue.value) ? dom.inputDue.value : '',
      priority: getPriority()
    };
  }

  function showTitleError() {
    dom.titleRow.classList.add('has-error');
    dom.titleError.hidden = false;
    dom.inputTitle.focus();
  }

  function clearTitleError() {
    dom.titleRow.classList.remove('has-error');
    dom.titleError.hidden = true;
  }

  /* ==========================================================================
   * 10. 事件绑定
   * ========================================================================== */

  function cacheDom() {
    dom.list = document.getElementById('task-list');
    dom.emptyNone = document.getElementById('empty-none');
    dom.emptyNoMatch = document.getElementById('empty-no-match');
    dom.toolbarHint = document.getElementById('toolbar-hint');
    dom.clearFilters = document.getElementById('btn-clear-filters');
    dom.clearFilters2 = document.getElementById('btn-clear-filters-2');
    dom.filterCourse = document.getElementById('filter-course');
    dom.statAll = document.getElementById('stat-all');
    dom.statActive = document.getElementById('stat-active');
    dom.statCompleted = document.getElementById('stat-completed');
    dom.statButtons = Array.prototype.slice.call(document.querySelectorAll('.stat'));

    dom.taskModal = document.getElementById('task-modal');
    dom.modalTitle = document.getElementById('task-modal-title');
    dom.form = document.getElementById('task-form');
    dom.inputTitle = document.getElementById('task-title');
    dom.titleRow = dom.inputTitle.closest('.form-row');
    dom.titleError = document.getElementById('title-error');
    dom.inputCourse = document.getElementById('task-course');
    dom.inputCategory = document.getElementById('task-category');
    dom.inputDue = document.getElementById('task-due');
    dom.saveBtn = document.getElementById('btn-save-task');
    dom.courseOptions = document.getElementById('course-options');
    dom.categoryOptions = document.getElementById('category-options');

    dom.confirmModal = document.getElementById('confirm-modal');
    dom.confirmPanel = dom.confirmModal.querySelector('.modal-panel');
    dom.confirmText = document.getElementById('confirm-desc');
    dom.confirmDelete = document.getElementById('btn-confirm-delete');

    dom.newTaskBtn = document.getElementById('btn-new-task');
    dom.emptyCta = document.querySelector('[data-open-task-modal]');
  }

  function bindEvents() {
    // —— 新建任务 ——
    dom.newTaskBtn.addEventListener('click', function () { openTaskModal(null); });
    if (dom.emptyCta) {
      dom.emptyCta.addEventListener('click', function () { openTaskModal(null); });
    }

    // —— 状态筛选（概览卡片）——
    dom.statButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.filter.status = btn.dataset.status;
        render();
      });
    });

    // —— 课程筛选 ——
    dom.filterCourse.addEventListener('change', function () {
      state.filter.course = dom.filterCourse.value;
      render();
    });

    // —— 清除筛选 ——
    function clearFilters() {
      state.filter.course = COURSE_ALL;
      state.filter.status = STATUS_ALL;
      render();
    }
    dom.clearFilters.addEventListener('click', clearFilters);
    dom.clearFilters2.addEventListener('click', clearFilters);

    // —— 任务列表：按钮点击（编辑 / 删除），事件委托 ——
    dom.list.addEventListener('click', function (event) {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const card = button.closest('.task-card');
      if (!card) return;

      if (button.dataset.action === 'edit') openTaskModal(card.dataset.id);
      if (button.dataset.action === 'delete') openConfirm(card.dataset.id);
    });

    // —— 任务列表：勾选完成 ——
    dom.list.addEventListener('change', function (event) {
      const input = event.target.closest('input[data-action="toggle"]');
      if (!input) return;

      const card = input.closest('.task-card');
      if (card) toggleTask(card.dataset.id, input.checked);
    });

    // —— 表单提交 ——
    dom.form.addEventListener('submit', function (event) {
      event.preventDefault();

      const values = readForm();
      if (!values.title) {
        showTitleError();
        return;
      }

      if (state.editingId) {
        updateTask(state.editingId, values);
      } else {
        addTask(values);
      }
      state.editingId = null;
      closeModal(dom.taskModal);
    });

    dom.inputTitle.addEventListener('input', clearTitleError);

    // —— 确认删除 ——
    dom.confirmDelete.addEventListener('click', function () {
      const id = state.deletingId;
      state.deletingId = null;
      // 先删除再关闭：这样 restoreFocus 能识别出原焦点元素已被移除，
      // 从而把焦点交给「新建任务」而不是失焦到 body
      deleteTask(id);
      closeModal(dom.confirmModal);
    });

    // —— 通用关闭：背景遮罩、取消按钮、右上角叉号 ——
    document.addEventListener('click', function (event) {
      const closer = event.target.closest('[data-close]');
      if (!closer) return;
      const modal = closer.closest('.modal');
      if (modal) closeModal(modal);
    });

    // —— Esc 关闭最上层弹窗 ——
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeTopModal();
    });
  }

  /* ==========================================================================
   * 11. 启动
   * ========================================================================== */

  function init() {
    cacheDom();
    state.tasks = loadTasks();
    bindEvents();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
