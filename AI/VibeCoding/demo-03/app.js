/* ==========================================================================
   CampusTask · 校园任务管理器
   纯前端实现：无框架、无构建、无网络请求，数据保存在浏览器 localStorage。
   约定见 docs/architecture.md：用户输入一律用 textContent 渲染，禁止 innerHTML 拼接。
   ========================================================================== */

'use strict';

/* ==================== 常量 ==================== */

const STORAGE_KEYS = {
  tasks: 'campustask.tasks',
  courses: 'campustask.courses',
};

const CATEGORIES = [
  { id: 'homework', label: '作业' },
  { id: 'exam', label: '考试' },
  { id: 'lab', label: '实验' },
  { id: 'club', label: '社团' },
  { id: 'personal', label: '个人' },
  { id: 'other', label: '其他' },
];

const PRIORITIES = [
  { id: 'high', label: '高' },
  { id: 'medium', label: '中' },
  { id: 'low', label: '低' },
];

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const CATEGORY_LABEL = {};
CATEGORIES.forEach(function (item) { CATEGORY_LABEL[item.id] = item.label; });

const PRIORITY_LABEL = {};
PRIORITIES.forEach(function (item) { PRIORITY_LABEL[item.id] = item.label; });

const CATEGORY_IDS = new Set(CATEGORIES.map(function (item) { return item.id; }));
const PRIORITY_IDS = new Set(PRIORITIES.map(function (item) { return item.id; }));

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

const DEFAULT_FILTERS = {
  courseId: 'all',
  category: 'all',
  status: 'all',
  priority: 'all',
  q: '',
};

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_SLOT_MINUTES = 90;

/* ==================== 状态 ==================== */

const state = {
  tasks: [],
  courses: [],
  filters: Object.assign({}, DEFAULT_FILTERS),
  sort: 'due',
  view: 'tasks',
};

let storageAvailable = true;

/* ==================== 基础工具 ==================== */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function uid() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** 以周一为一周起点，返回本周日 23:59:59.999 */
function endOfWeek(value) {
  const date = startOfDay(value);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() + (6 - offset));
  date.setHours(23, 59, 59, 999);
  return date;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

/** ISO 字符串 → <input type="date"> 的 YYYY-MM-DD（按本地时区） */
function dateInputValue(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
}

/** YYYY-MM-DD → 当天 23:59:59.999 的 ISO 字符串 */
function isoFromDateInput(value) {
  if (!value) return null;
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999).toISOString();
}

function formatDue(date) {
  const now = new Date();
  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / 86400000);
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === -1) return '昨天';
  if (date.getFullYear() === now.getFullYear()) {
    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
  }
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}

function toMinutes(hhmm) {
  const parts = String(hhmm || '').split(':').map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return 0;
  return parts[0] * 60 + parts[1];
}

function toHHMM(minutes) {
  const clamped = Math.max(0, Math.min(MINUTES_PER_DAY - 1, Math.round(minutes)));
  return pad2(Math.floor(clamped / 60)) + ':' + pad2(clamped % 60);
}

/* ==================== 持久化 ==================== */

function probeStorage() {
  try {
    const key = 'campustask.probe';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

function readStore(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    storageAvailable = false;
    return null;
  }
}

function writeStore(key, value) {
  if (!storageAvailable) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    storageAvailable = false;
    showStorageWarning();
    return false;
  }
}

function saveState() {
  writeStore(STORAGE_KEYS.tasks, state.tasks);
  writeStore(STORAGE_KEYS.courses, state.courses);
}

function showStorageWarning() {
  const banner = document.getElementById('storage-warning');
  if (!banner) return;
  banner.textContent = '当前浏览器无法使用本地存储（可能处于隐私模式），本次修改在关闭页面后不会保留。';
  banner.hidden = false;
}

/* ==================== 数据规范化 ==================== */

function normalizeSlot(raw) {
  const slot = raw && typeof raw === 'object' ? raw : {};
  const day = Number(slot.day);
  if (!Number.isInteger(day) || day < 1 || day > 7) return null;
  const start = /^\d{2}:\d{2}$/.test(slot.start) ? slot.start : '08:00';
  const end = /^\d{2}:\d{2}$/.test(slot.end) ? slot.end : '09:40';
  return { day: day, start: start, end: end };
}

function normalizeCourse(raw) {
  const course = raw && typeof raw === 'object' ? raw : {};
  const schedule = Array.isArray(course.schedule)
    ? course.schedule.map(normalizeSlot).filter(Boolean)
    : [];
  return {
    id: typeof course.id === 'string' && course.id ? course.id : uid(),
    name: typeof course.name === 'string' && course.name.trim() ? course.name.trim() : '未命名课程',
    teacher: typeof course.teacher === 'string' ? course.teacher : '',
    location: typeof course.location === 'string' ? course.location : '',
    schedule: schedule,
  };
}

function normalizeTask(raw) {
  const task = raw && typeof raw === 'object' ? raw : {};
  const nowIso = new Date().toISOString();
  return {
    id: typeof task.id === 'string' && task.id ? task.id : uid(),
    title: typeof task.title === 'string' && task.title.trim() ? task.title.trim() : '未命名任务',
    courseId: typeof task.courseId === 'string' && task.courseId ? task.courseId : null,
    category: CATEGORY_IDS.has(task.category) ? task.category : 'other',
    due: typeof task.due === 'string' && !Number.isNaN(new Date(task.due).getTime()) ? task.due : null,
    priority: PRIORITY_IDS.has(task.priority) ? task.priority : 'medium',
    location: typeof task.location === 'string' ? task.location : '',
    note: typeof task.note === 'string' ? task.note : '',
    done: Boolean(task.done),
    createdAt: typeof task.createdAt === 'string' ? task.createdAt : nowIso,
    updatedAt: typeof task.updatedAt === 'string' ? task.updatedAt : nowIso,
  };
}

function loadFromStorage() {
  const storedCourses = readStore(STORAGE_KEYS.courses);
  state.courses = (storedCourses || []).map(normalizeCourse);

  const courseIds = new Set(state.courses.map(function (course) { return course.id; }));
  const storedTasks = readStore(STORAGE_KEYS.tasks);
  state.tasks = (storedTasks || []).map(normalizeTask).map(function (task) {
    if (task.courseId && !courseIds.has(task.courseId)) {
      return Object.assign({}, task, { courseId: null });
    }
    return task;
  });
}

/* ==================== 渲染：外壳 ==================== */

function render() {
  renderTabs();
  renderStats();
  renderFilters();
  renderTaskList();
  renderSchedule();
  renderCourseList();
  renderViews();
}

function renderTabs() {
  document.querySelectorAll('.tab').forEach(function (tab) {
    const active = tab.dataset.view === state.view;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function renderViews() {
  ['tasks', 'schedule', 'courses'].forEach(function (view) {
    const section = document.getElementById('view-' + view);
    if (section) section.hidden = state.view !== view;
  });
}

/* ==================== 渲染：概览 ==================== */

function computeStats() {
  const now = new Date();
  const todayStart = startOfDay(now).getTime();
  const weekEnd = endOfWeek(now).getTime();
  const result = { today: 0, week: 0, overdue: 0, active: 0 };

  state.tasks.forEach(function (task) {
    if (task.done) return;
    result.active += 1;
    if (!task.due) return;
    const due = new Date(task.due);
    if (due.getTime() < todayStart) {
      result.overdue += 1;
      return;
    }
    if (due.getTime() <= weekEnd) {
      result.week += 1;
      if (sameDay(due, now)) result.today += 1;
    }
  });

  return result;
}

function renderStats() {
  const box = document.getElementById('stats');
  box.textContent = '';

  const stats = computeStats();
  const items = [
    { label: '今日到期', value: stats.today, cls: 'is-today' },
    { label: '本周到期', value: stats.week, cls: '' },
    { label: '已逾期', value: stats.overdue, cls: stats.overdue > 0 ? 'is-alert' : '' },
    { label: '未完成', value: stats.active, cls: '' },
  ];

  items.forEach(function (item) {
    const card = el('div', 'stat ' + item.cls);
    card.appendChild(el('div', 'stat-value', item.value));
    card.appendChild(el('div', 'stat-label', item.label));
    box.appendChild(card);
  });
}

/* ==================== 渲染：筛选栏 ==================== */

/** 重建 select 的选项并设置当前值；值非法时回退到第一项，返回最终生效值 */
function setOptions(select, options, value) {
  select.textContent = '';
  options.forEach(function (option) {
    const node = el('option', null, option.label);
    node.value = option.value;
    select.appendChild(node);
  });
  select.value = value;
  if (select.value !== value) select.value = options[0].value;
  return select.value;
}

function renderFilters() {
  state.filters.courseId = setOptions(
    document.getElementById('filter-course'),
    [{ value: 'all', label: '全部课程' }, { value: 'none', label: '未指定课程' }]
      .concat(state.courses.map(function (course) {
        return { value: course.id, label: course.name };
      })),
    state.filters.courseId
  );

  state.filters.category = setOptions(
    document.getElementById('filter-category'),
    [{ value: 'all', label: '全部分类' }].concat(CATEGORIES.map(function (item) {
      return { value: item.id, label: item.label };
    })),
    state.filters.category
  );

  state.filters.priority = setOptions(
    document.getElementById('filter-priority'),
    [{ value: 'all', label: '全部优先级' }].concat(PRIORITIES.map(function (item) {
      return { value: item.id, label: item.label + '优先级' };
    })),
    state.filters.priority
  );

  const statusSelect = document.getElementById('filter-status');
  statusSelect.value = state.filters.status;
  if (statusSelect.value !== state.filters.status) {
    statusSelect.value = 'all';
    state.filters.status = 'all';
  }

  const sortSelect = document.getElementById('sort-select');
  sortSelect.value = state.sort;
  if (sortSelect.value !== state.sort) {
    sortSelect.value = 'due';
    state.sort = 'due';
  }

  const search = document.getElementById('search-input');
  if (search.value !== state.filters.q) search.value = state.filters.q;
}

/* ==================== 渲染：任务 ==================== */

function visibleTasks() {
  const filters = state.filters;
  const keyword = filters.q.trim().toLowerCase();

  return state.tasks.filter(function (task) {
    if (filters.courseId === 'none') {
      if (task.courseId) return false;
    } else if (filters.courseId !== 'all' && task.courseId !== filters.courseId) {
      return false;
    }
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.status === 'active' && task.done) return false;
    if (filters.status === 'done' && !task.done) return false;
    if (keyword && task.title.toLowerCase().indexOf(keyword) === -1) return false;
    return true;
  });
}

function dueValue(task) {
  return task.due ? new Date(task.due).getTime() : Infinity;
}

function compareDue(a, b) {
  const av = dueValue(a);
  const bv = dueValue(b);
  if (av === bv) return 0;
  return av - bv;
}

function sortTasks(list, key) {
  const arr = list.slice();

  if (key === 'priority') {
    arr.sort(function (a, b) {
      const diff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (diff !== 0) return diff;
      return compareDue(a, b);
    });
  } else if (key === 'created') {
    arr.sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } else {
    arr.sort(function (a, b) {
      const diff = compareDue(a, b);
      if (diff !== 0) return diff;
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    });
  }

  return arr;
}

function buildDueChip(task) {
  if (!task.due) return el('span', 'chip chip-muted', '无截止日期');

  const due = new Date(task.due);
  const now = new Date();
  let className = 'chip chip-due';
  let text = formatDue(due);

  if (!task.done && due.getTime() < startOfDay(now).getTime()) {
    className += ' is-overdue';
    text = '已逾期 · ' + text;
  } else if (!task.done && sameDay(due, now)) {
    className += ' is-today';
  }

  return el('span', className, text);
}

function buildTaskItem(task) {
  const item = el('li', 'task' + (task.done ? ' is-done' : ''));
  item.dataset.id = task.id;

  const checkWrap = el('label', 'task-check');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.dataset.action = 'toggle-task';
  checkbox.setAttribute('aria-label', (task.done ? '取消完成：' : '标记完成：') + task.title);
  checkWrap.appendChild(checkbox);
  item.appendChild(checkWrap);

  const body = el('div', 'task-body');
  body.appendChild(el('div', 'task-title', task.title));

  const meta = el('div', 'task-meta');
  const course = state.courses.find(function (item2) { return item2.id === task.courseId; });
  if (course) meta.appendChild(el('span', 'chip chip-course', course.name));
  meta.appendChild(el('span', 'chip', CATEGORY_LABEL[task.category]));
  meta.appendChild(buildDueChip(task));
  meta.appendChild(el('span', 'chip chip-prio-' + task.priority, PRIORITY_LABEL[task.priority] + '优先级'));
  body.appendChild(meta);

  if (task.location) body.appendChild(el('p', 'task-note', '地点：' + task.location));
  if (task.note) body.appendChild(el('p', 'task-note', task.note));

  item.appendChild(body);

  const actions = el('div', 'task-actions');
  const editBtn = el('button', 'btn btn-icon', '编辑');
  editBtn.type = 'button';
  editBtn.dataset.action = 'edit-task';
  editBtn.setAttribute('aria-label', '编辑：' + task.title);

  const deleteBtn = el('button', 'btn btn-icon danger', '删除');
  deleteBtn.type = 'button';
  deleteBtn.dataset.action = 'delete-task';
  deleteBtn.setAttribute('aria-label', '删除：' + task.title);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  item.appendChild(actions);

  return item;
}

function buildTaskSection(title, tasks, emptyText) {
  const section = el('section', 'task-section');

  const head = el('div', 'task-section-head');
  head.appendChild(el('h2', 'task-section-title', title));
  head.appendChild(el('span', 'task-count', tasks.length));
  section.appendChild(head);

  if (!tasks.length) {
    section.appendChild(el('p', 'empty', emptyText));
    return section;
  }

  const list = el('ul', 'task-list');
  tasks.forEach(function (task) { list.appendChild(buildTaskItem(task)); });
  section.appendChild(list);

  return section;
}

function renderTaskList() {
  const container = document.getElementById('task-list');
  container.textContent = '';

  const visible = visibleTasks();
  const pending = sortTasks(visible.filter(function (task) { return !task.done; }), state.sort);
  const finished = sortTasks(visible.filter(function (task) { return task.done; }), 'created');

  if (state.filters.status !== 'done') {
    container.appendChild(buildTaskSection('待办', pending, '没有符合条件的待办任务。'));
  }
  if (state.filters.status !== 'active') {
    container.appendChild(buildTaskSection('已完成', finished, '还没有已完成的任务。'));
  }
}

/* ==================== 渲染：周课表 ==================== */

function renderSchedule() {
  const wrap = document.getElementById('schedule-wrap');
  wrap.textContent = '';

  const slots = [];
  state.courses.forEach(function (course) {
    course.schedule.forEach(function (slot) {
      slots.push({ course: course, slot: slot });
    });
  });

  if (!slots.length) {
    wrap.appendChild(el('p', 'empty', '还没有课程安排。先到「课程管理」添加课程和上课时间。'));
    return;
  }

  let minStart = MINUTES_PER_DAY;
  let maxEnd = 0;
  slots.forEach(function (entry) {
    minStart = Math.min(minStart, toMinutes(entry.slot.start));
    maxEnd = Math.max(maxEnd, toMinutes(entry.slot.end));
  });

  const startHour = Math.floor(minStart / 60);
  const endHour = Math.max(Math.ceil(maxEnd / 60), startHour + 1);
  const rowCount = endHour - startHour;

  const grid = el('div', 'schedule-grid');

  const times = el('div', 'schedule-times');
  times.appendChild(el('div', 'schedule-times-head'));
  for (let i = 0; i < rowCount; i += 1) {
    times.appendChild(el('div', 'schedule-hour', pad2(startHour + i) + ':00'));
  }
  grid.appendChild(times);

  const days = el('div', 'schedule-days');
  const heads = el('div', 'schedule-day-heads');
  WEEKDAYS.forEach(function (label) {
    heads.appendChild(el('div', 'schedule-day', label));
  });
  days.appendChild(heads);

  const body = el('div', 'schedule-body');
  body.style.setProperty('--rows', String(rowCount));
  days.appendChild(body);
  grid.appendChild(days);
  wrap.appendChild(grid);

  // 课程块用绝对定位按分钟精确换算：百分比定位对任意时间都成立，
  // 不像 grid 行号那样必须是整数。
  const offset = startHour * 60;
  const totalMinutes = rowCount * 60;
  const columnWidth = 100 / 7;

  slots.forEach(function (entry) {
    const start = toMinutes(entry.slot.start);
    const end = Math.max(toMinutes(entry.slot.end), start);

    const block = el('div', 'schedule-slot');
    block.style.top = 'calc(' + ((start - offset) / totalMinutes * 100) + '% + 1px)';
    block.style.height = 'calc(' + ((end - start) / totalMinutes * 100) + '% - 2px)';
    block.style.left = 'calc(' + ((entry.slot.day - 1) * columnWidth) + '% + 2px)';
    block.style.width = 'calc(' + columnWidth + '% - 4px)';

    block.appendChild(el('div', 'schedule-slot-name', entry.course.name));
    block.appendChild(el('div', 'schedule-slot-meta', entry.slot.start + '–' + entry.slot.end));
    if (entry.course.location) {
      block.appendChild(el('div', 'schedule-slot-meta', entry.course.location));
    }
    body.appendChild(block);
  });
}

/* ==================== 渲染：课程 ==================== */

function buildCourseCard(course) {
  const card = el('article', 'course-card');
  card.dataset.id = course.id;

  const head = el('div', 'course-head');
  head.appendChild(el('h3', 'course-name', course.name));

  const actions = el('div', 'course-actions');
  const editBtn = el('button', 'btn btn-icon', '编辑');
  editBtn.type = 'button';
  editBtn.dataset.action = 'edit-course';
  editBtn.setAttribute('aria-label', '编辑课程：' + course.name);

  const deleteBtn = el('button', 'btn btn-icon danger', '删除');
  deleteBtn.type = 'button';
  deleteBtn.dataset.action = 'delete-course';
  deleteBtn.setAttribute('aria-label', '删除课程：' + course.name);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  head.appendChild(actions);
  card.appendChild(head);

  const pendingCount = state.tasks.filter(function (task) {
    return task.courseId === course.id && !task.done;
  }).length;

  const meta = el('div', 'course-meta');
  if (course.teacher) meta.appendChild(el('span', null, '教师：' + course.teacher));
  if (course.location) meta.appendChild(el('span', null, '地点：' + course.location));
  meta.appendChild(el('span', null, '未完成任务：' + pendingCount));
  card.appendChild(meta);

  if (course.schedule.length) {
    const slots = el('div', 'course-slots');
    course.schedule.forEach(function (slot) {
      slots.appendChild(el('span', 'chip', WEEKDAYS[slot.day - 1] + ' ' + slot.start + '–' + slot.end));
    });
    card.appendChild(slots);
  } else {
    card.appendChild(el('p', 'course-note', '未设置上课时间'));
  }

  return card;
}

function renderCourseList() {
  const container = document.getElementById('course-list');
  container.textContent = '';

  if (!state.courses.length) {
    container.appendChild(el('p', 'empty', '还没有课程。点「新增课程」添加课程和上课时间。'));
    return;
  }

  state.courses.forEach(function (course) {
    container.appendChild(buildCourseCard(course));
  });
}

/* ==================== 任务弹窗 ==================== */

function populateTaskFormOptions() {
  setOptions(
    document.getElementById('task-category'),
    CATEGORIES.map(function (item) { return { value: item.id, label: item.label }; }),
    'homework'
  );
  setOptions(
    document.getElementById('task-priority'),
    PRIORITIES.map(function (item) { return { value: item.id, label: item.label }; }),
    'medium'
  );
}

function populateCourseSelect(selectedValue) {
  return setOptions(
    document.getElementById('task-course'),
    [{ value: '', label: '未指定课程' }].concat(state.courses.map(function (course) {
      return { value: course.id, label: course.name };
    })),
    selectedValue || ''
  );
}

function openTaskDialog(taskId) {
  const dialog = document.getElementById('task-dialog');
  const form = document.getElementById('task-form');
  form.reset();
  // form.reset() 不会清除上次提交留下的自定义校验错误，必须显式清空，
  // 否则用户改好标题后表单会永久无法提交。
  form.elements.title.setCustomValidity('');

  populateTaskFormOptions();
  populateCourseSelect('');

  const task = taskId ? state.tasks.find(function (item) { return item.id === taskId; }) : null;

  document.getElementById('task-dialog-title').textContent = task ? '编辑任务' : '新建任务';
  form.elements.id.value = task ? task.id : '';

  if (task) {
    form.elements.title.value = task.title;
    populateCourseSelect(task.courseId || '');
    form.elements.category.value = task.category;
    form.elements.due.value = task.due ? dateInputValue(task.due) : '';
    form.elements.priority.value = task.priority;
    form.elements.location.value = task.location;
    form.elements.note.value = task.note;
  }

  dialog.showModal();
  form.elements.title.focus();
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const title = form.elements.title.value.trim();
  if (!title) {
    form.elements.title.setCustomValidity('请输入任务标题');
    form.elements.title.reportValidity();
    return;
  }
  form.elements.title.setCustomValidity('');

  const nowIso = new Date().toISOString();
  const payload = {
    title: title,
    courseId: form.elements.courseId.value || null,
    category: form.elements.category.value,
    due: isoFromDateInput(form.elements.due.value),
    priority: form.elements.priority.value,
    location: form.elements.location.value.trim(),
    note: form.elements.note.value.trim(),
    updatedAt: nowIso,
  };

  const id = form.elements.id.value;
  const existing = id ? state.tasks.find(function (item) { return item.id === id; }) : null;

  if (existing) {
    Object.assign(existing, payload);
  } else {
    state.tasks.push({
      id: uid(),
      title: payload.title,
      courseId: payload.courseId,
      category: payload.category,
      due: payload.due,
      priority: payload.priority,
      location: payload.location,
      note: payload.note,
      done: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }

  saveState();
  document.getElementById('task-dialog').close();
  render();
}

function toggleTask(taskId) {
  const task = state.tasks.find(function (item) { return item.id === taskId; });
  if (!task) return;
  task.done = !task.done;
  task.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function deleteTask(taskId) {
  const task = state.tasks.find(function (item) { return item.id === taskId; });
  if (!task) return;
  if (!window.confirm('删除任务「' + task.title + '」？此操作不可撤销。')) return;

  state.tasks = state.tasks.filter(function (item) { return item.id !== taskId; });
  saveState();
  render();
}

/* ==================== 课程弹窗 ==================== */

function addScheduleRow(container, slot) {
  const row = el('div', 'schedule-row');

  const daySelect = el('select', 'input');
  daySelect.setAttribute('aria-label', '星期');
  WEEKDAYS.forEach(function (label, index) {
    const option = el('option', null, label);
    option.value = String(index + 1);
    daySelect.appendChild(option);
  });
  daySelect.value = String(slot && slot.day ? slot.day : 1);

  const startInput = document.createElement('input');
  startInput.type = 'time';
  startInput.className = 'input';
  startInput.setAttribute('aria-label', '开始时间');
  startInput.value = slot && slot.start ? slot.start : '08:00';

  const endInput = document.createElement('input');
  endInput.type = 'time';
  endInput.className = 'input';
  endInput.setAttribute('aria-label', '结束时间');
  endInput.value = slot && slot.end ? slot.end : '09:40';

  const removeBtn = el('button', 'btn btn-icon danger', '×');
  removeBtn.type = 'button';
  removeBtn.dataset.action = 'remove-schedule-row';
  removeBtn.setAttribute('aria-label', '删除该时间段');

  row.appendChild(daySelect);
  row.appendChild(startInput);
  row.appendChild(endInput);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

function openCourseDialog(courseId) {
  const dialog = document.getElementById('course-dialog');
  const form = document.getElementById('course-form');
  form.reset();
  form.elements.courseName.setCustomValidity('');

  const rows = document.getElementById('schedule-rows');
  rows.textContent = '';

  const course = courseId ? state.courses.find(function (item) { return item.id === courseId; }) : null;

  document.getElementById('course-dialog-title').textContent = course ? '编辑课程' : '新增课程';
  form.elements.id.value = course ? course.id : '';

  if (course) {
    form.elements.courseName.value = course.name;
    form.elements.teacher.value = course.teacher;
    form.elements.location.value = course.location;
    course.schedule.forEach(function (slot) { addScheduleRow(rows, slot); });
  }

  if (!rows.children.length) addScheduleRow(rows, null);

  dialog.showModal();
  form.elements.courseName.focus();
}

function readScheduleRows(container) {
  const slots = [];
  container.querySelectorAll('.schedule-row').forEach(function (row) {
    const controls = row.querySelectorAll('select, input');
    if (controls.length < 3) return;

    const day = Number(controls[0].value);
    const start = controls[1].value;
    const end = controls[2].value;
    if (!day || !start || !end) return;

    let startMinutes = toMinutes(start);
    let endMinutes = toMinutes(end);
    if (endMinutes <= startMinutes) {
      endMinutes = Math.min(startMinutes + DEFAULT_SLOT_MINUTES, MINUTES_PER_DAY - 1);
    }

    slots.push({ day: day, start: toHHMM(startMinutes), end: toHHMM(endMinutes) });
  });
  return slots;
}

function handleCourseSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const name = form.elements.courseName.value.trim();
  if (!name) {
    form.elements.courseName.setCustomValidity('请输入课程名');
    form.elements.courseName.reportValidity();
    return;
  }
  form.elements.courseName.setCustomValidity('');

  const payload = {
    name: name,
    teacher: form.elements.teacher.value.trim(),
    location: form.elements.location.value.trim(),
    schedule: readScheduleRows(document.getElementById('schedule-rows')),
  };

  const id = form.elements.id.value;
  const existing = id ? state.courses.find(function (item) { return item.id === id; }) : null;

  if (existing) {
    Object.assign(existing, payload);
  } else {
    state.courses.push({ id: uid(), name: payload.name, teacher: payload.teacher, location: payload.location, schedule: payload.schedule });
  }

  saveState();
  document.getElementById('course-dialog').close();
  render();
}

function deleteCourse(courseId) {
  const course = state.courses.find(function (item) { return item.id === courseId; });
  if (!course) return;

  const affected = state.tasks.filter(function (task) { return task.courseId === courseId; }).length;
  const extra = affected ? '\n该课程下的 ' + affected + ' 个任务将变为「未指定课程」。' : '';
  if (!window.confirm('删除课程「' + course.name + '」？' + extra)) return;

  const nowIso = new Date().toISOString();
  state.courses = state.courses.filter(function (item) { return item.id !== courseId; });
  state.tasks = state.tasks.map(function (task) {
    if (task.courseId !== courseId) return task;
    return Object.assign({}, task, { courseId: null, updatedAt: nowIso });
  });

  saveState();
  render();
}

/* ==================== 事件 ==================== */

function handleClick(event) {
  const dialog = event.target.closest('dialog');
  if (dialog && event.target === dialog) {
    dialog.close();
    return;
  }

  const tab = event.target.closest('.tab');
  if (tab) {
    state.view = tab.dataset.view;
    render();
    return;
  }

  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const owner = actionEl.closest('[data-id]');
  const id = owner ? owner.dataset.id : null;

  switch (action) {
    case 'new-task':
      openTaskDialog(null);
      break;
    case 'edit-task':
      openTaskDialog(id);
      break;
    case 'delete-task':
      deleteTask(id);
      break;
    case 'new-course':
      openCourseDialog(null);
      break;
    case 'edit-course':
      openCourseDialog(id);
      break;
    case 'delete-course':
      deleteCourse(id);
      break;
    case 'add-schedule-row':
      addScheduleRow(document.getElementById('schedule-rows'), null);
      break;
    case 'remove-schedule-row': {
      const row = actionEl.closest('.schedule-row');
      if (row) row.remove();
      break;
    }
    case 'close-dialog': {
      const target = actionEl.closest('dialog');
      if (target) target.close();
      break;
    }
    case 'reset-filters':
      state.filters = Object.assign({}, DEFAULT_FILTERS);
      state.sort = 'due';
      render();
      break;
    default:
      break;
  }
}

function handleChange(event) {
  const target = event.target;

  if (target.dataset && target.dataset.action === 'toggle-task') {
    const owner = target.closest('[data-id]');
    if (owner) toggleTask(owner.dataset.id);
    return;
  }

  switch (target.id) {
    case 'filter-course':
      state.filters.courseId = target.value;
      break;
    case 'filter-category':
      state.filters.category = target.value;
      break;
    case 'filter-status':
      state.filters.status = target.value;
      break;
    case 'filter-priority':
      state.filters.priority = target.value;
      break;
    case 'sort-select':
      state.sort = target.value;
      break;
    default:
      return;
  }

  render();
}

function handleInput(event) {
  const target = event.target;

  // 用户开始修正时立即解除自定义校验错误，避免表单被锁死
  if (target.id === 'task-title' || target.id === 'course-name') {
    target.setCustomValidity('');
    return;
  }

  if (target.id !== 'search-input') return;
  state.filters.q = target.value;
  renderTaskList();
}

/* ==================== 初始化 ==================== */

function init() {
  storageAvailable = probeStorage();
  if (storageAvailable) loadFromStorage();

  populateTaskFormOptions();

  document.addEventListener('click', handleClick);
  document.addEventListener('change', handleChange);
  document.addEventListener('input', handleInput);
  document.getElementById('task-form').addEventListener('submit', handleTaskSubmit);
  document.getElementById('course-form').addEventListener('submit', handleCourseSubmit);

  if (!storageAvailable) showStorageWarning();

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
