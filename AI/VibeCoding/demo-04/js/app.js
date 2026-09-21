/* ==========================================================================
   campusTasks — 校园任务管理器
   --------------------------------------------------------------------------
   分区导航：
     §0 常量与枚举        §1 全局状态         §2 DOM 引用
     §3 工具层            §4 存储层           §5 领域层
     §6 渲染层            §7 交互层           §8 启动

   架构纪律（单向数据流）：
     用户操作 → 改 state → commit()（保存 + 重渲染）
     渲染层只读 state、只写 DOM，绝不修改数据。
   ========================================================================== */
(function () {
  'use strict';

  /* ========================================================================
     §0 常量与枚举
     ======================================================================== */

  var STORAGE_KEY = 'campusTasks:v1';
  var CORRUPT_KEY = 'campusTasks:v1:corrupt';
  var SCHEMA_VERSION = 1;

  var TYPES = ['作业', '实验', '考试', '活动', '其他'];
  var PRIORITIES = ['高', '中', '低'];
  var STATUS_ORDER = ['todo', 'doing', 'done'];
  var STATUS_LABEL = { todo: '待办', doing: '进行中', done: '已完成' };
  var UNCLASSIFIED = '未分类';

  var BOARD_COLUMNS = [
    { status: 'todo',  name: '待办' },
    { status: 'doing', name: '进行中' },
    { status: 'done',  name: '已完成' }
  ];

  /* 四档时间状态：颜色 + 符号 + 文字三重表达，颜色不是唯一线索（NFR-06）
     另加一档 done：已完成的任务不应再被标成「已逾期」 */
  var TIME_META = {
    overdue: { icon: '⚠', cls: 'ts-overdue' },
    today:   { icon: '●', cls: 'ts-today' },
    soon:    { icon: '◔', cls: 'ts-soon' },
    normal:  { icon: '○', cls: 'ts-normal' },
    none:    { icon: '–', cls: 'ts-none' },
    done:    { icon: '✓', cls: 'ts-done' }
  };

  /* 图标统一用内联 SVG：文字字形在不同系统下渲染差异大（✎ 曾细到看不见） */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var ICON_PATHS = {
    edit:   ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z'],
    remove: ['M18 6 6 18', 'M6 6l12 12'],
    prev:   ['M15 18l-6-6 6-6'],
    next:   ['M9 18l6-6-6-6']
  };

  var TOAST_MS = 3200;

  /* ========================================================================
     §1 全局状态
     ======================================================================== */

  var state = {
    tasks: [],
    view: 'list',                                   // list | group | board
    filters: { course: 'all', type: 'all', status: 'unfinished' },
    keyword: '',
    editingId: null,
    confirmAction: null
  };

  /* §2 DOM 引用 */
  var dom = {};

  /* ========================================================================
     §3 工具层
     ======================================================================== */

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function genId() {
    return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* 统一的建元素入口：文本一律走 textContent，杜绝 XSS */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function svgIcon(name) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    (ICON_PATHS[name] || []).forEach(function (d) {
      var p = document.createElementNS(SVG_NS, 'path');
      p.setAttribute('d', d);
      svg.appendChild(p);
    });
    return svg;
  }

  /* 周一为一周之首 */
  function startOfWeek(d) {
    var s = startOfDay(d);
    var dow = (s.getDay() + 6) % 7;
    s.setDate(s.getDate() - dow);
    return s;
  }

  /* 'YYYY-MM-DDTHH:mm' 按本地时间解析（不带时区后缀，ES 规范即按本地处理） */
  function parseDue(v) {
    if (!v || typeof v !== 'string') return null;
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  /* 与今天的自然日差：正数=已过去，0=今天，负数=还剩几天 */
  function dayDiffFrom(dueAt, now) {
    var due = parseDue(dueAt);
    if (!due) return null;
    var base = startOfDay(now || new Date()).getTime();
    return Math.round((base - startOfDay(due).getTime()) / 86400000);
  }

  /* 四档时间状态判定（AC-04）。按自然日而非毫秒差，
     保证「今天上午看今晚 23:59 截止」显示「今天到期」而不是「还有 0 天」。 */
  function getTimeStatus(dueAt, now) {
    var diff = dayDiffFrom(dueAt, now);
    if (diff === null) return 'none';
    if (diff > 0) return 'overdue';
    if (diff === 0) return 'today';
    if (diff >= -3) return 'soon';
    return 'normal';
  }

  function formatDueLabel(dueAt, now) {
    var diff = dayDiffFrom(dueAt, now);
    if (diff === null) return '无期限';
    if (diff > 0) return '已逾期 ' + diff + ' 天';
    if (diff === 0) return '今天到期';
    return '还有 ' + (-diff) + ' 天';
  }

  /* 手写格式化，不依赖 toLocaleDateString 的隐式 locale（避免环境差异） */
  function formatDateTime(d) {
    if (!d || isNaN(d.getTime())) return '';
    var now = new Date();
    var year = d.getFullYear() === now.getFullYear() ? '' : d.getFullYear() + '年';
    return year + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' +
           pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  /* Date → <input type="datetime-local"> 需要的值 */
  function toLocalInputValue(d) {
    if (!d || isNaN(d.getTime())) return '';
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) +
           'T' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  function todayStamp() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function courseKeyOf(task) {
    var c = (task.course || '').trim();
    return c || UNCLASSIFIED;
  }

  /* 「未分类」固定排最后，其余按中文拼音序 */
  function compareCourseName(a, b) {
    if (a === UNCLASSIFIED) return 1;
    if (b === UNCLASSIFIED) return -1;
    return a.localeCompare(b, 'zh');
  }

  /* ========================================================================
     §4 存储层
     ======================================================================== */

  function loadTasks() {
    var raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      toast('无法读取本地存储：' + e.message + '。本次改动将不会被保存。', 'error');
      return [];
    }
    if (!raw) return [];

    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.tasks)) {
        throw new Error('数据结构不正确');
      }
      return parsed.tasks.map(normalizeTask);
    } catch (e) {
      /* 损坏数据先备份原文，绝不静默丢弃 */
      backupCorrupt(raw);
      toast('本地数据已损坏（' + e.message + '），原文已备份到 ' + CORRUPT_KEY + '，现以空列表启动。', 'error');
      return [];
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: SCHEMA_VERSION,
        tasks: state.tasks
      }));
      return true;
    } catch (e) {
      toast('数据保存失败：' + e.message + '（可能是浏览器隐私模式或存储空间已满）', 'error');
      return false;
    }
  }

  function backupCorrupt(raw) {
    try { window.localStorage.setItem(CORRUPT_KEY, raw); } catch (e) { /* 备份失败不阻断启动 */ }
  }

  function buildExport() {
    return JSON.stringify({
      version: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      tasks: state.tasks
    }, null, 2);
  }

  /* 导入校验分两档：
       结构性错误（顶层/tasks/title）→ 整体拒绝，绝不半途写入；
       可选字段缺失或类型不对        → 补默认值，宽容放行。 */
  function parseImport(text) {
    var parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error('文件不是合法的 JSON，请确认选择的是 campusTasks 导出的备份文件。');
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('文件结构不正确：顶层应为一个对象。');
    }
    if (!Array.isArray(parsed.tasks)) {
      throw new Error('文件结构不正确：缺少 tasks 数组。');
    }

    var out = [];
    var seen = {};
    for (var i = 0; i < parsed.tasks.length; i++) {
      var raw = parsed.tasks[i];
      var where = '第 ' + (i + 1) + ' 条任务';
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        throw new Error(where + '格式不正确：应为对象。');
      }
      if (typeof raw.title !== 'string' || !raw.title.trim()) {
        throw new Error(where + '缺少有效标题（title 必须是非空字符串）。');
      }
      var task = normalizeTask(raw);
      if (seen[task.id]) task.id = genId();   // id 重复则重新生成，避免互相覆盖
      seen[task.id] = true;
      out.push(task);
    }
    return out;
  }

  /* ========================================================================
     §5 领域层（只改 state，不碰 DOM、不负责保存）
     ======================================================================== */

  function findTask(id) {
    for (var i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) return state.tasks[i];
    }
    return null;
  }

  /* 把任意来源的数据规整成合法任务对象（加载与导入共用） */
  function normalizeTask(raw) {
    raw = raw || {};
    var task = {
      id: typeof raw.id === 'string' && raw.id ? raw.id : genId(),
      title: typeof raw.title === 'string' ? raw.title.trim() : '',
      course: typeof raw.course === 'string' ? raw.course.trim() : '',
      type: TYPES.indexOf(raw.type) >= 0 ? raw.type : '其他',
      dueAt: typeof raw.dueAt === 'string' && raw.dueAt ? raw.dueAt : null,
      priority: PRIORITIES.indexOf(raw.priority) >= 0 ? raw.priority : '中',
      status: STATUS_ORDER.indexOf(raw.status) >= 0 ? raw.status : 'todo',
      note: typeof raw.note === 'string' ? raw.note.trim() : '',
      createdAt: typeof raw.createdAt === 'string' && raw.createdAt ? raw.createdAt : new Date().toISOString(),
      completedAt: typeof raw.completedAt === 'string' && raw.completedAt ? raw.completedAt : null
    };
    syncCompletedAt(task);
    return task;
  }

  /* status 与 completedAt 必须始终一致 */
  function syncCompletedAt(task) {
    if (task.status === 'done') {
      if (!task.completedAt) task.completedAt = new Date().toISOString();
    } else {
      task.completedAt = null;
    }
  }

  function createTask(data) {
    var task = normalizeTask({
      id: genId(),
      title: data.title,
      course: data.course,
      type: data.type,
      dueAt: data.dueAt || null,
      priority: data.priority,
      status: data.status,
      note: data.note,
      createdAt: new Date().toISOString(),
      completedAt: null
    });
    state.tasks.push(task);
    return task;
  }

  /* 编辑：id 与 createdAt 保持不变 */
  function updateTask(id, data) {
    var task = findTask(id);
    if (!task) return null;
    task.title = String(data.title || '').trim();
    task.course = String(data.course || '').trim();
    task.type = TYPES.indexOf(data.type) >= 0 ? data.type : task.type;
    task.dueAt = data.dueAt || null;
    task.priority = PRIORITIES.indexOf(data.priority) >= 0 ? data.priority : task.priority;
    task.note = String(data.note || '').trim();
    if (STATUS_ORDER.indexOf(data.status) >= 0) task.status = data.status;
    syncCompletedAt(task);
    return task;
  }

  function removeTask(id) {
    var before = state.tasks.length;
    state.tasks = state.tasks.filter(function (t) { return t.id !== id; });
    return state.tasks.length < before;
  }

  function setTaskStatus(id, status) {
    var task = findTask(id);
    if (!task || STATUS_ORDER.indexOf(status) < 0) return null;
    task.status = status;
    syncCompletedAt(task);
    return task;
  }

  function toggleDone(id) {
    var task = findTask(id);
    if (!task) return;
    setTaskStatus(id, task.status === 'done' ? 'todo' : 'done');
  }

  /* dueAt 升序；无期限的一律排最后（AC-05） */
  function sortTasks(list) {
    return list.slice().sort(function (a, b) {
      var ad = parseDue(a.dueAt);
      var bd = parseDue(b.dueAt);
      if (!ad && !bd) return 0;
      if (!ad) return 1;
      if (!bd) return -1;
      return ad.getTime() - bd.getTime();
    });
  }

  /* 已完成列：最近完成的排最前 */
  function sortDoneTasks(list) {
    return list.slice().sort(function (a, b) {
      var ac = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      var bc = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return bc - ac;
    });
  }

  function matchStatus(task, filter) {
    if (filter === 'all') return true;
    if (filter === 'unfinished') return task.status !== 'done';
    return task.status === filter;
  }

  /* 筛选统一入口，渲染前一次性应用（AC-08） */
  function visibleTasks(opts) {
    opts = opts || {};
    var f = state.filters;
    var kw = state.keyword.trim().toLowerCase();

    return state.tasks.filter(function (t) {
      if (f.course !== 'all' && courseKeyOf(t) !== f.course) return false;
      if (f.type !== 'all' && t.type !== f.type) return false;
      if (!opts.ignoreStatus && !matchStatus(t, f.status)) return false;
      if (kw) {
        var hay = (t.title + ' ' + t.note).toLowerCase();
        if (hay.indexOf(kw) === -1) return false;
      }
      return true;
    });
  }

  /* 概览统计：全局口径，不受筛选影响（AC-11） */
  function computeStats(now) {
    now = now || new Date();
    var weekStart = startOfWeek(now).getTime();
    var out = { todo: 0, today: 0, overdue: 0, weekDone: 0 };

    state.tasks.forEach(function (t) {
      if (t.status !== 'done') {
        out.todo += 1;
        var ts = getTimeStatus(t.dueAt, now);
        if (ts === 'today') out.today += 1;
        if (ts === 'overdue') out.overdue += 1;
      } else if (t.completedAt) {
        var c = new Date(t.completedAt);
        if (!isNaN(c.getTime()) && c.getTime() >= weekStart) out.weekDone += 1;
      }
    });
    return out;
  }

  /* 数据变更后的唯一出口：保存 → 刷新依赖数据的控件 → 重渲染 */
  function commit() {
    saveTasks();
    renderCourseOptions();
    renderCourseDatalist();
    renderAll();
  }

  /* ========================================================================
     §6 渲染层（只读 state、只写 DOM）
     ======================================================================== */

  function renderAll() {
    renderStats();
    syncControls();
    renderView();
  }

  function renderView() {
    if (state.view === 'list') renderList();
    else if (state.view === 'group') renderGroup();
    else renderBoard();
  }

  function renderStats() {
    var s = computeStats();
    dom.statTodo.textContent = String(s.todo);
    dom.statToday.textContent = String(s.today);
    dom.statOverdue.textContent = String(s.overdue);
    dom.statWeekDone.textContent = String(s.weekDone);
  }

  /* 视图 tab、视图容器、筛选控件的显示状态 */
  function syncControls() {
    Array.prototype.forEach.call(dom.tabs, function (tab) {
      var on = tab.getAttribute('data-view') === state.view;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    dom.viewList.classList.toggle('is-active', state.view === 'list');
    dom.viewGroup.classList.toggle('is-active', state.view === 'group');
    dom.viewBoard.classList.toggle('is-active', state.view === 'board');

    dom.filterCourse.value = state.filters.course;
    dom.filterType.value = state.filters.type;
    dom.filterStatus.value = state.filters.status;

    /* 看板本身就是按状态分列的，再叠一层状态筛选会自相矛盾 */
    dom.fieldFilterStatus.hidden = (state.view === 'board');
  }

  /* 课程筛选下拉：从现有任务归纳，保留当前选中项 */
  function renderCourseOptions() {
    var select = dom.filterCourse;
    var names = collectCourseNames();
    clear(select);
    select.appendChild(new Option('全部课程', 'all'));
    names.forEach(function (n) { select.appendChild(new Option(n, n)); });

    var wanted = state.filters.course;
    var valid = names.indexOf(wanted) >= 0;
    select.value = valid ? wanted : 'all';
    state.filters.course = select.value;
  }

  function renderCourseDatalist() {
    var list = dom.courseList;
    clear(list);
    collectCourseNames().forEach(function (n) {
      list.appendChild(new Option(n, n));
    });
  }

  function collectCourseNames() {
    var names = [];
    state.tasks.forEach(function (t) {
      var k = courseKeyOf(t);
      if (names.indexOf(k) === -1) names.push(k);
    });
    return names.sort(compareCourseName);
  }

  function buildEmpty() {
    var hasAny = state.tasks.length > 0;
    var box = el('div', 'empty');
    box.appendChild(el('div', 'empty-icon', hasAny ? '🔍' : '📚'));
    box.appendChild(el('div', 'empty-title', hasAny ? '没有符合条件的任务' : '还没有任务'));
    box.appendChild(el('div', 'empty-desc', hasAny
      ? '试着放宽筛选条件，或清空搜索关键词。'
      : '把作业、实验、考试都记进来，打开页面就知道今天要交什么。'));
    if (!hasAny) {
      var btn = el('button', 'btn btn-primary', '创建第一条任务');
      btn.type = 'button';
      btn.addEventListener('click', function () { openTaskDialog(null); });
      box.appendChild(btn);
    }
    return box;
  }

  function buildTimeBadge(timeStatus, dueAt, now) {
    var meta = TIME_META[timeStatus];
    var badge = el('span', 'badge-time ' + meta.cls);
    badge.appendChild(el('span', 'badge-icon', meta.icon));
    badge.appendChild(el('span', null,
      timeStatus === 'done' ? '已完成' : formatDueLabel(dueAt, now)));
    return badge;
  }

  function buildIconBtn(extraCls, iconName, label, handler) {
    var btn = el('button', 'btn-icon ' + extraCls);
    btn.type = 'button';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.appendChild(svgIcon(iconName));
    btn.addEventListener('click', handler);
    return btn;
  }

  function buildMoveBtn(taskId, targetIdx, iconName) {
    var target = STATUS_ORDER[targetIdx];
    var btn = el('button', 'btn-move');
    btn.type = 'button';
    btn.appendChild(svgIcon(iconName));
    if (!target) {
      btn.disabled = true;
      btn.tabIndex = -1;
      btn.setAttribute('aria-hidden', 'true');
    } else {
      var label = '移到「' + STATUS_LABEL[target] + '」';
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.addEventListener('click', function () { moveStatus(taskId, target); });
    }
    return btn;
  }

  function buildTaskCard(task, opts) {
    opts = opts || {};
    var now = new Date();
    var isDone = task.status === 'done';
    /* 已完成的任务不再按截止时间标红——它已经完成了，标「已逾期」是误导 */
    var timeStatus = isDone ? 'done' : getTimeStatus(task.dueAt, now);

    var card = el('div', 'task ' + TIME_META[timeStatus].cls + (isDone ? ' is-done' : '') +
      (opts.compact ? ' is-compact' : ''));
    card.setAttribute('data-id', task.id);

    /* 完成勾选 */
    var check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'task-check';
    check.checked = isDone;
    check.setAttribute('aria-label',
      (isDone ? '取消完成「' : '标记完成「') + task.title + '」');
    check.addEventListener('change', function () { toggleDone(task.id); });
    card.appendChild(check);

    /* 主体 */
    var main = el('div', 'task-main');
    var line1 = el('div', 'task-line1');
    line1.appendChild(el('span', 'task-title', task.title));
    line1.appendChild(buildTimeBadge(timeStatus, task.dueAt, now));
    main.appendChild(line1);

    var line2 = el('div', 'task-line2');
    if (task.course) line2.appendChild(el('span', 'tag tag-course', task.course));
    line2.appendChild(el('span', 'tag', task.type));
    line2.appendChild(el('span', 'tag tag-pri-' + task.priority, '优先级 ' + task.priority));
    /* 看板列窄，紧凑卡片省掉完整时间与状态文字（列本身就是状态） */
    if (!opts.compact) {
      var due = parseDue(task.dueAt);
      if (due) line2.appendChild(el('span', 'task-when', formatDateTime(due)));
      line2.appendChild(el('span', 'task-when', STATUS_LABEL[task.status]));
    }
    main.appendChild(line2);

    if (!opts.compact && task.note) main.appendChild(el('div', 'task-note', task.note));
    card.appendChild(main);

    /* 操作区 */
    var actions = el('div', 'task-actions');
    if (opts.moves) {
      var idx = STATUS_ORDER.indexOf(task.status);
      actions.appendChild(buildMoveBtn(task.id, idx - 1, 'prev'));
      actions.appendChild(buildMoveBtn(task.id, idx + 1, 'next'));
    }
    actions.appendChild(buildIconBtn('', 'edit', '编辑「' + task.title + '」', function () {
      openTaskDialog(task.id);
    }));
    actions.appendChild(buildIconBtn('is-danger', 'remove', '删除「' + task.title + '」', function () {
      requestDelete(task.id);
    }));
    card.appendChild(actions);

    /* 拖拽为桌面增强；键盘与移动端走 ‹ › 按钮 */
    if (opts.moves) {
      card.setAttribute('draggable', 'true');
      card.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      });
    }

    return card;
  }

  function renderList() {
    var box = dom.viewList;
    clear(box);
    var list = sortTasks(visibleTasks());
    if (!list.length) { box.appendChild(buildEmpty()); return; }

    var wrap = el('div', 'task-list');
    list.forEach(function (t) { wrap.appendChild(buildTaskCard(t, {})); });
    box.appendChild(wrap);
  }

  function renderGroup() {
    var box = dom.viewGroup;
    clear(box);
    var list = sortTasks(visibleTasks());
    if (!list.length) { box.appendChild(buildEmpty()); return; }

    /* list 已按 dueAt 升序，顺序入组即可保证组内有序 */
    var groups = {};
    list.forEach(function (t) {
      var key = courseKeyOf(t);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    Object.keys(groups).sort(compareCourseName).forEach(function (name) {
      var section = el('section', 'group');
      var head = el('div', 'group-head');
      head.appendChild(el('h3', 'group-name', name));
      head.appendChild(el('span', 'group-count', groups[name].length + ' 条'));
      section.appendChild(head);

      var body = el('div', 'task-list');
      groups[name].forEach(function (t) { body.appendChild(buildTaskCard(t, {})); });
      section.appendChild(body);
      box.appendChild(section);
    });
  }

  function renderBoard() {
    var box = dom.viewBoard;
    clear(box);

    /* 看板忽略状态筛选，三列始终完整呈现 */
    var items = visibleTasks({ ignoreStatus: true });
    if (!items.length) { box.appendChild(buildEmpty()); return; }

    var board = el('div', 'board');
    BOARD_COLUMNS.forEach(function (col) {
      var column = el('section', 'board-col');
      column.setAttribute('data-status', col.status);

      var mine = items.filter(function (t) { return t.status === col.status; });

      var head = el('div', 'board-head');
      head.appendChild(el('span', null, col.name));
      head.appendChild(el('span', 'board-count', String(mine.length)));
      column.appendChild(head);

      var body = el('div', 'board-body');
      var ordered = col.status === 'done' ? sortDoneTasks(mine) : sortTasks(mine);
      if (!ordered.length) {
        body.appendChild(el('div', 'board-empty', '暂无任务'));
      } else {
        ordered.forEach(function (t) {
          body.appendChild(buildTaskCard(t, { moves: true, compact: true }));
        });
      }
      column.appendChild(body);

      /* 拖拽落点 */
      column.addEventListener('dragover', function (e) {
        e.preventDefault();
        column.classList.add('is-dropover');
      });
      column.addEventListener('dragleave', function () {
        column.classList.remove('is-dropover');
      });
      column.addEventListener('drop', function (e) {
        e.preventDefault();
        column.classList.remove('is-dropover');
        var id = e.dataTransfer.getData('text/plain');
        if (id) moveStatus(id, col.status);
      });

      board.appendChild(column);
    });
    box.appendChild(board);
  }

  /* ========================================================================
     §7 交互层
     ======================================================================== */

  var toastTimer = null;

  function toast(message, type) {
    var node = dom.toast;
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }

    node.textContent = message;
    node.className = 'toast' + (type ? ' is-' + type : '');
    node.hidden = false;
    void node.offsetWidth;                  // 强制重排，让过渡生效
    node.classList.add('is-show');

    toastTimer = setTimeout(function () {
      node.classList.remove('is-show');
      toastTimer = setTimeout(function () { node.hidden = true; }, 240);
    }, TOAST_MS);
  }

  function askConfirm(opts) {
    dom.dlgConfirmTitle.textContent = opts.title || '确认';
    dom.dlgConfirmMsg.textContent = opts.message || '';
    dom.btnConfirmOk.textContent = opts.okText || '确定';
    state.confirmAction = opts.onOk || null;
    dom.dlgConfirm.showModal();
  }

  function closeConfirm() {
    state.confirmAction = null;
    dom.dlgConfirm.close();
  }

  function showTitleError(message) {
    dom.errTitle.textContent = message;
    dom.errTitle.hidden = false;
    dom.fTitle.setAttribute('aria-invalid', 'true');
  }

  function hideTitleError() {
    dom.errTitle.textContent = '';
    dom.errTitle.hidden = true;
    dom.fTitle.removeAttribute('aria-invalid');
  }

  function openTaskDialog(id) {
    state.editingId = id || null;
    var task = id ? findTask(id) : null;

    dom.dlgTaskTitle.textContent = task ? '编辑任务' : '新建任务';
    dom.fTitle.value = task ? task.title : '';
    dom.fCourse.value = task ? task.course : '';
    dom.fType.value = task ? task.type : '作业';
    dom.fDue.value = task && task.dueAt ? toLocalInputValue(parseDue(task.dueAt)) : '';
    dom.fPriority.value = task ? task.priority : '中';
    dom.fStatus.value = task ? task.status : 'todo';
    dom.fNote.value = task ? task.note : '';

    hideTitleError();
    renderCourseDatalist();
    dom.dlgTask.showModal();
    dom.fTitle.focus();
  }

  function onSubmitTask(e) {
    e.preventDefault();

    var title = dom.fTitle.value.trim();
    if (!title) {
      showTitleError('请填写任务标题。');
      dom.fTitle.focus();
      return;
    }
    hideTitleError();

    var data = {
      title: title,
      course: dom.fCourse.value,
      type: dom.fType.value,
      dueAt: dom.fDue.value || null,
      priority: dom.fPriority.value,
      status: dom.fStatus.value,
      note: dom.fNote.value
    };

    var editing = state.editingId;
    state.editingId = null;
    dom.dlgTask.close();

    if (editing) {
      updateTask(editing, data);
      commit();
      toast('已保存修改', 'success');
    } else {
      createTask(data);
      commit();
      toast('已创建任务', 'success');
    }
  }

  function requestDelete(id) {
    var task = findTask(id);
    if (!task) return;
    askConfirm({
      title: '删除任务',
      message: '确定删除「' + task.title + '」吗？此操作不可撤销。',
      okText: '删除',
      onOk: function () {
        removeTask(id);
        commit();
        toast('已删除', 'success');
      }
    });
  }

  function moveStatus(id, status) {
    if (!setTaskStatus(id, status)) return;
    commit();
  }

  function toggleDone(id) {
    var task = findTask(id);
    if (!task) return;
    setTaskStatus(id, task.status === 'done' ? 'todo' : 'done');
    commit();
  }

  function doExport() {
    try {
      var blob = new Blob([buildExport()], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'campusTasks-backup-' + todayStamp() + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('已导出 ' + state.tasks.length + ' 条任务', 'success');
    } catch (e) {
      toast('导出失败：' + e.message, 'error');
    }
  }

  function onImportFile(e) {
    var input = e.target;
    var file = input.files && input.files[0];
    if (!file) return;

    var reader = new FileReader();

    reader.onload = function () {
      var tasks;
      try {
        tasks = parseImport(String(reader.result));
      } catch (err) {
        input.value = '';
        toast('导入失败：' + err.message + '（现有数据未改动）', 'error');
        return;
      }
      input.value = '';

      askConfirm({
        title: '导入备份',
        message: '将用文件中的 ' + tasks.length + ' 条任务覆盖当前的 ' +
                 state.tasks.length + ' 条任务。确定继续吗？',
        okText: '覆盖导入',
        onOk: function () {
          state.tasks = tasks;
          commit();
          toast('已导入 ' + tasks.length + ' 条任务', 'success');
        }
      });
    };

    reader.onerror = function () {
      input.value = '';
      toast('读取文件失败，请重试。', 'error');
    };

    reader.readAsText(file);
  }

  /* ========================================================================
     §8 启动
     ======================================================================== */

  function cacheDom() {
    dom.tabs = document.querySelectorAll('#view-tabs .tab');

    dom.viewList = document.getElementById('view-list');
    dom.viewGroup = document.getElementById('view-group');
    dom.viewBoard = document.getElementById('view-board');

    dom.statTodo = document.getElementById('stat-todo');
    dom.statToday = document.getElementById('stat-today');
    dom.statOverdue = document.getElementById('stat-overdue');
    dom.statWeekDone = document.getElementById('stat-weekdone');

    dom.filterCourse = document.getElementById('filter-course');
    dom.filterType = document.getElementById('filter-type');
    dom.filterStatus = document.getElementById('filter-status');
    dom.fieldFilterStatus = document.getElementById('field-filter-status');
    dom.searchKeyword = document.getElementById('search-keyword');

    dom.btnNew = document.getElementById('btn-new-task');
    dom.btnImport = document.getElementById('btn-import');
    dom.btnExport = document.getElementById('btn-export');
    dom.fileImport = document.getElementById('file-import');

    dom.dlgTask = document.getElementById('dlg-task');
    dom.dlgTaskTitle = document.getElementById('dlg-task-title');
    dom.formTask = document.getElementById('form-task');
    dom.fTitle = document.getElementById('f-title');
    dom.fCourse = document.getElementById('f-course');
    dom.fType = document.getElementById('f-type');
    dom.fDue = document.getElementById('f-due');
    dom.fPriority = document.getElementById('f-priority');
    dom.fStatus = document.getElementById('f-status');
    dom.fNote = document.getElementById('f-note');
    dom.errTitle = document.getElementById('err-title');
    dom.courseList = document.getElementById('course-list');
    dom.btnCancelTask = document.getElementById('btn-cancel-task');

    dom.dlgConfirm = document.getElementById('dlg-confirm');
    dom.dlgConfirmTitle = document.getElementById('dlg-confirm-title');
    dom.dlgConfirmMsg = document.getElementById('dlg-confirm-msg');
    dom.btnConfirmOk = document.getElementById('btn-confirm-ok');
    dom.btnConfirmCancel = document.getElementById('btn-confirm-cancel');

    dom.toast = document.getElementById('toast');
  }

  function fillStaticOptions() {
    TYPES.forEach(function (t) { dom.fType.appendChild(new Option(t, t)); });
    TYPES.forEach(function (t) { dom.filterType.appendChild(new Option(t, t)); });
    PRIORITIES.forEach(function (p) { dom.fPriority.appendChild(new Option(p, p)); });
    STATUS_ORDER.forEach(function (s) { dom.fStatus.appendChild(new Option(STATUS_LABEL[s], s)); });
  }

  function bindEvents() {
    dom.btnNew.addEventListener('click', function () { openTaskDialog(null); });
    dom.formTask.addEventListener('submit', onSubmitTask);
    dom.btnCancelTask.addEventListener('click', function () { dom.dlgTask.close(); });
    dom.dlgTask.addEventListener('close', function () {
      state.editingId = null;
      hideTitleError();
    });

    Array.prototype.forEach.call(dom.tabs, function (tab) {
      tab.addEventListener('click', function () {
        state.view = tab.getAttribute('data-view');
        renderAll();
      });
    });

    dom.filterCourse.addEventListener('change', function () {
      state.filters.course = dom.filterCourse.value;
      renderAll();
    });
    dom.filterType.addEventListener('change', function () {
      state.filters.type = dom.filterType.value;
      renderAll();
    });
    dom.filterStatus.addEventListener('change', function () {
      state.filters.status = dom.filterStatus.value;
      renderAll();
    });
    dom.searchKeyword.addEventListener('input', function () {
      state.keyword = dom.searchKeyword.value;
      renderAll();
    });

    dom.btnExport.addEventListener('click', doExport);
    dom.btnImport.addEventListener('click', function () { dom.fileImport.click(); });
    dom.fileImport.addEventListener('change', onImportFile);

    dom.btnConfirmOk.addEventListener('click', function () {
      var action = state.confirmAction;
      closeConfirm();
      if (typeof action === 'function') action();
    });
    dom.btnConfirmCancel.addEventListener('click', closeConfirm);
  }

  function init() {
    cacheDom();
    fillStaticOptions();
    bindEvents();

    state.tasks = loadTasks();
    renderCourseOptions();
    renderCourseDatalist();
    renderAll();
  }

  /* ---------------------------------------------------------------------
     对外暴露：供调试与自动化验收使用（window.CT）
     --------------------------------------------------------------------- */
  window.CT = {
    state: state,
    Utils: {
      genId: genId,
      startOfDay: startOfDay,
      startOfWeek: startOfWeek,
      parseDue: parseDue,
      dayDiffFrom: dayDiffFrom,
      getTimeStatus: getTimeStatus,
      formatDueLabel: formatDueLabel,
      formatDateTime: formatDateTime,
      toLocalInputValue: toLocalInputValue,
      courseKeyOf: courseKeyOf
    },
    Store: {
      STORAGE_KEY: STORAGE_KEY,
      CORRUPT_KEY: CORRUPT_KEY,
      loadTasks: loadTasks,
      saveTasks: saveTasks,
      buildExport: buildExport,
      parseImport: parseImport
    },
    Domain: {
      findTask: findTask,
      normalizeTask: normalizeTask,
      createTask: createTask,
      updateTask: updateTask,
      removeTask: removeTask,
      setTaskStatus: setTaskStatus,
      toggleDone: toggleDone,
      moveStatus: moveStatus,
      sortTasks: sortTasks,
      sortDoneTasks: sortDoneTasks,
      visibleTasks: visibleTasks,
      computeStats: computeStats
    },
    renderAll: renderAll,
    commit: commit,
    toast: toast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
