/* ============================================================
   学习任务 · TaskFlow
   原生 JS 单页应用 —— 数据保存在 localStorage
   ============================================================ */

(() => {
  'use strict';

  const STORE_KEY = 'taskflow.tasks.v1';
  const THEME_KEY = 'taskflow.theme';
  const SEED_KEY  = 'taskflow.seeded';
  const DAY = 86400000;
  const RING_C = 2 * Math.PI * 36;   // 进度环周长（r=36）

  const PRIORITY = {
    high: { label: '高', weight: 0 },
    mid:  { label: '中', weight: 1 },
    low:  { label: '低', weight: 2 },
  };

  const SUBJECT_HUES = [212, 262, 330, 12, 32, 152, 190, 285];

  /* ── 状态 ─────────────────────────────────────────── */

  const state = {
    tasks: [],
    filter: 'all',
    query: '',
    sort: 'smart',
    editingId: null,
    lastDeleted: null,
  };

  const $ = (sel) => document.querySelector(sel);

  const el = {
    list:       $('#list'),
    composer:   $('#composer'),
    newTitle:   $('#newTitle'),
    newSubject: $('#newSubject'),
    newPriority:$('#newPriority'),
    newDue:     $('#newDue'),
    filters:    $('#filters'),
    search:     $('#search'),
    sort:       $('#sort'),
    themeBtn:   $('#themeBtn'),
    todayLabel: $('#todayLabel'),
    ringFill:   $('#ringFill'),
    ringPct:    $('#ringPct'),
    statActive: $('#statActive'),
    statDone:   $('#statDone'),
    statToday:  $('#statToday'),
    statOverdue:$('#statOverdue'),
    clearDone:  $('#clearDone'),
    toast:      $('#toast'),
    toastMsg:   $('#toastMsg'),
    toastUndo:  $('#toastUndo'),
    live:       $('#live'),
    modal:      $('#editModal'),
    editForm:   $('#editForm'),
    editTitle:  $('#editTitle'),
    editSubject:$('#editSubject'),
    editPriority:$('#editPriority'),
    editDue:    $('#editDue'),
    editNote:   $('#editNote'),
    editDelete: $('#editDelete'),
    editCancel: $('#editCancel'),
    editClose:  $('#editClose'),
  };

  /* ── 工具函数 ─────────────────────────────────────── */

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  /** due 距今天的天数：负数=逾期，0=今天，1=明天 … */
  const dayDiff = (due) =>
    Math.round((startOfDay(due) - startOfDay(new Date())) / DAY);

  /** 'YYYY-MM-DDTHH:mm'（datetime-local 的本地时间格式） */
  const toLocalInput = (date) => {
    const p = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}` +
           `T${p(date.getHours())}:${p(date.getMinutes())}`;
  };

  const dueStringToDate = (s) => (s ? new Date(s) : null);
  const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());

  const subjectHue = (name) => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return SUBJECT_HUES[h % SUBJECT_HUES.length];
  };

  const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  /** 返回 { text, tone, icon } —— tone ∈ '' | overdue | today | soon */
  function describeDue(due) {
    const d = dueStringToDate(due);
    if (!isValidDate(d)) return null;

    const diff = dayDiff(d);
    const hasTime = !(d.getHours() === 23 && d.getMinutes() === 59);
    const time = hasTime
      ? ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      : '';

    if (diff < 0) {
      return { text: `逾期 ${-diff} 天`, tone: 'due-overdue', icon: 'alert' };
    }
    if (diff === 0) return { text: `今天${time}`, tone: 'due-today', icon: 'clock' };
    if (diff === 1) return { text: `明天${time}`, tone: 'due-soon',  icon: 'clock' };
    if (diff === 2) return { text: `后天${time}`, tone: 'due-soon',  icon: 'clock' };
    if (diff < 7)   return { text: `${WEEKDAYS[d.getDay()]}${time}`, tone: 'due-soon', icon: 'clock' };

    return {
      text: `${d.getMonth() + 1}月${d.getDate()}日${time}`,
      tone: '',
      icon: 'clock',
    };
  }

  const ICONS = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5M12 16.5v.01"/><circle cx="12" cy="12" r="9"/></svg>',
    flag:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 5h11l-1.6 3.5L16 12H5"/></svg>',
    edit:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 6.5 17.5 9.5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V5h5v2M6.5 7l.8 12.1A1.5 1.5 0 0 0 8.8 20.5h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
  };

  /* ── 持久化 ───────────────────────────────────────── */

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(isValidTask);
      }
    } catch (err) {
      console.warn('[TaskFlow] 读取本地数据失败：', err);
    }
    return null;
  }

  const isValidTask = (t) =>
    t && typeof t === 'object' && typeof t.id === 'string' && typeof t.title === 'string';

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.tasks));
    } catch (err) {
      console.warn('[TaskFlow] 保存失败（可能是存储已满）：', err);
    }
  }

  /** 首次打开时放几条示例任务，让界面不至于空荡荡 */
  function seedIfEmpty() {
    if (localStorage.getItem(SEED_KEY)) return;
    const at = (days, h = 23, m = 59) => {
      const d = startOfDay(new Date());
      d.setDate(d.getDate() + days);
      d.setHours(h, m, 0, 0);
      return toLocalInput(d);
    };
    const now = Date.now();

    state.tasks = [
      { id: uid(), title: '背诵《劝学》全文并默写', subject: '语文', priority: 'mid',
        due: at(0, 20, 0), note: '', done: false, createdAt: now - 5000, completedAt: null },
      { id: uid(), title: '数学卷子 P32–P35 错题订正', subject: '数学', priority: 'high',
        due: at(0, 22, 0), note: '重点看第 18 题，辅助线没想出来', done: false, createdAt: now - 4000, completedAt: null },
      { id: uid(), title: '英语 Unit 5 单词默写', subject: '英语', priority: 'mid',
        due: at(1, 19, 30), note: '', done: false, createdAt: now - 3000, completedAt: null },
      { id: uid(), title: '物理实验报告：测量小灯泡电阻', subject: '物理', priority: 'high',
        due: at(3), note: '数据表在实验本最后一页', done: false, createdAt: now - 2000, completedAt: null },
      { id: uid(), title: '整理本周历史笔记', subject: '历史', priority: 'low',
        due: at(5), note: '', done: false, createdAt: now - 1000, completedAt: null },
      { id: uid(), title: '预习下周的生物课本第三章', subject: '生物', priority: 'low',
        due: '', note: '', done: true, createdAt: now - 6000, completedAt: now - 900 },
    ];

    save();
    localStorage.setItem(SEED_KEY, '1');
  }

  /* ── 主题 ─────────────────────────────────────────── */

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* 忽略 */ }
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch { /* 忽略 */ }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  /* ── 过滤 / 排序 ──────────────────────────────────── */

  const isOverdue = (t) => {
    if (t.done || !t.due) return false;
    const d = dueStringToDate(t.due);
    return isValidDate(d) && dayDiff(d) < 0;
  };

  const isToday = (t) => {
    if (t.done || !t.due) return false;
    const d = dueStringToDate(t.due);
    return isValidDate(d) && dayDiff(d) === 0;
  };

  /** 按当前筛选 + 搜索得到可见任务 */
  function visibleTasks() {
    const q = state.query.trim().toLowerCase();
    let list = state.tasks;

    switch (state.filter) {
      case 'today':
        list = list.filter((t) => !t.done && (isToday(t) || isOverdue(t)));
        break;
      case 'upcoming':
        list = list.filter((t) => !t.done);
        break;
      case 'overdue':
        list = list.filter(isOverdue);
        break;
      case 'done':
        list = list.filter((t) => t.done);
        break;
      default:
        break;
    }

    if (q) {
      list = list.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        (t.subject || '').toLowerCase().includes(q) ||
        (t.note || '').toLowerCase().includes(q));
    }

    return sortTasks(list);
  }

  function sortTasks(list) {
    const byDue = (a, b) => {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;          // 无截止日期排最后
      if (!b.due) return -1;
      return new Date(a.due) - new Date(b.due);
    };
    const byPriority = (a, b) =>
      (PRIORITY[a.priority]?.weight ?? 1) - (PRIORITY[b.priority]?.weight ?? 1);
    const byCreated = (a, b) => (b.createdAt || 0) - (a.createdAt || 0);

    // 都没有截止日期时按创建时间倒序：刚添加的任务排在该组最前面，
    // 否则新建的无日期任务会沉到列表末尾，让人以为没添加成功。
    const byDueThen = (a, b) => {
      if (!a.due && !b.due) return byCreated(a, b) || byPriority(a, b);
      return byDue(a, b) || byPriority(a, b) || byCreated(a, b);
    };

    const arr = [...list];

    switch (state.sort) {
      case 'due':
        arr.sort(byDueThen);
        break;
      case 'priority':
        arr.sort((a, b) => byPriority(a, b) || byDueThen(a, b));
        break;
      case 'created':
        arr.sort(byCreated);
        break;
      default: // smart：未完成在前 → 逾期优先 → 截止时间 → 优先级
        arr.sort((a, b) => {
          if (a.done !== b.done) return a.done ? 1 : -1;
          if (a.done) return (b.completedAt || 0) - (a.completedAt || 0);
          const aOver = isOverdue(a), bOver = isOverdue(b);
          if (aOver !== bOver) return aOver ? -1 : 1;
          return byDueThen(a, b);
        });
    }
    return arr;
  }

  /* ── 分组 ─────────────────────────────────────────── */

  const GROUPS = [
    { key: 'overdue',  title: '已逾期',   tone: 'danger' },
    { key: 'today',    title: '今天',     tone: 'warn'   },
    { key: 'tomorrow', title: '明天',     tone: 'accent' },
    { key: 'week',     title: '本周内',   tone: 'accent' },
    { key: 'later',    title: '更晚',     tone: ''       },
    { key: 'someday',  title: '未定日期', tone: ''       },
    { key: 'done',     title: '已完成',   tone: 'ok'     },
  ];

  function groupOf(task) {
    if (task.done) return 'done';
    if (!task.due) return 'someday';
    const d = dueStringToDate(task.due);
    if (!isValidDate(d)) return 'someday';
    const diff = dayDiff(d);
    if (diff < 0) return 'overdue';
    if (diff === 0) return 'today';
    if (diff === 1) return 'tomorrow';
    if (diff < 7) return 'week';
    return 'later';
  }

  /* ── 渲染 ─────────────────────────────────────────── */

  /** @param {{animate?: boolean}} [opts] 仅在筛选/搜索/排序变化时播放入场动画 */
  function render(opts = {}) {
    renderTodayLabel();
    renderStats();
    renderList(!!opts.animate);
    renderFilterCounts();
  }

  function renderTodayLabel() {
    const now = new Date();
    el.todayLabel.textContent =
      `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · ${WEEKDAYS[now.getDay()]}`;
  }

  function renderStats() {
    const total    = state.tasks.length;
    const done     = state.tasks.filter((t) => t.done).length;
    const active   = total - done;
    const todayCnt = state.tasks.filter((t) => !t.done && (isToday(t) || isOverdue(t))).length;
    const overdue  = state.tasks.filter(isOverdue).length;

    el.statActive.textContent  = active;
    el.statDone.textContent    = done;
    el.statToday.textContent   = todayCnt;
    el.statOverdue.textContent = overdue;

    const pct = total ? Math.round((done / total) * 100) : 0;
    el.ringPct.textContent = pct + '%';
    el.ringFill.style.strokeDashoffset = String(RING_C * (1 - pct / 100));
  }

  function renderFilterCounts() {
    const counts = {
      all:      state.tasks.length,
      today:    state.tasks.filter((t) => !t.done && (isToday(t) || isOverdue(t))).length,
      upcoming: state.tasks.filter((t) => !t.done).length,
      overdue:  state.tasks.filter(isOverdue).length,
      done:     state.tasks.filter((t) => t.done).length,
    };
    el.filters.querySelectorAll('.chip').forEach((chip) => {
      const key = chip.dataset.filter;
      chip.setAttribute('aria-selected', String(key === state.filter));
      chip.querySelector('i').textContent = counts[key] || '';
    });
  }

  function taskHTML(t) {
    const due = describeDue(t.due);
    const pri = PRIORITY[t.priority] || PRIORITY.mid;
    const overdue = isOverdue(t);

    const subjectTag = t.subject
      ? `<span class="tag subject" style="--hue: hsl(${subjectHue(t.subject)} 72% 55%)">${esc(t.subject)}</span>`
      : '';

    const dueTag = due
      ? `<span class="tag ${due.tone}">${ICONS[due.icon]}${esc(due.text)}</span>`
      : '';

    const priTag = `<span class="tag pri-${t.priority in PRIORITY ? t.priority : 'mid'}">${ICONS.flag}${pri.label}</span>`;

    const noteTag = t.note
      ? `<p class="task-note">${esc(t.note)}</p>`
      : '';

    const priClass = t.priority in PRIORITY ? t.priority : 'mid';

    return `
      <article class="task pri-${priClass}${t.done ? ' done' : ''}${overdue ? ' overdue' : ''}" data-id="${t.id}">
        <button class="check" type="button" data-act="toggle"
                aria-label="${t.done ? '标记为未完成' : '标记为已完成'}"
                aria-pressed="${t.done}">${ICONS.check}</button>

        <div class="task-body">
          <h3 class="task-title">${esc(t.title)}</h3>
          ${noteTag}
          <div class="task-meta">${subjectTag}${dueTag}${priTag}</div>
        </div>

        <div class="task-actions">
          <button class="act" type="button" data-act="edit" title="编辑" aria-label="编辑任务">${ICONS.edit}</button>
          <button class="act del" type="button" data-act="delete" title="删除" aria-label="删除任务">${ICONS.trash}</button>
        </div>
      </article>`;
  }

  const EMPTY_STATES = {
    all:      { title: '还没有任务',     text: '在上面的输入框里写下第一项学习任务吧。' },
    today:    { title: '今天很轻松',     text: '没有今天到期的任务，可以提前做点后面的。' },
    upcoming: { title: '全部完成 🎉',    text: '进行中的任务已经清空，休息一下。' },
    overdue:  { title: '没有逾期任务',   text: '节奏保持得不错。' },
    done:     { title: '还没有已完成',   text: '完成一项任务后，它会出现在这里。' },
  };

  function emptyHTML() {
    const q = state.query.trim();
    const base = EMPTY_STATES[state.filter] || EMPTY_STATES.all;

    const svg = `
      <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="42" stroke="currentColor" stroke-opacity=".16" stroke-width="2" stroke-dasharray="5 7"/>
        <rect x="36" y="30" width="48" height="60" rx="9" stroke="currentColor" stroke-opacity=".38" stroke-width="2.4"/>
        <path d="M47 47h26M47 58h26M47 69h15" stroke="currentColor" stroke-opacity=".28" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="82" cy="82" r="16" fill="var(--accent)"/>
        <path d="m75.5 82 4.5 4.5 8.5-9" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    const title = q ? `没有找到「${esc(q)}」` : base.title;
    const text  = q ? '换个关键词试试，或者清空搜索框。' : base.text;

    return `
      <div class="empty">
        ${svg}
        <h3>${title}</h3>
        <p>${text}</p>
      </div>`;
  }

  function renderList(animate = false) {
    // 勾选 / 删除时不要重放整列表的入场动画，否则每次操作整屏都在抖
    el.list.classList.toggle('no-anim', !animate);

    const tasks = visibleTasks();

    if (!tasks.length) {
      el.list.innerHTML = emptyHTML();
      return;
    }

    // 单组筛选时不再分组，直接平铺
    if (state.filter === 'done' || state.filter === 'overdue') {
      const key = state.filter === 'done' ? 'done' : 'overdue';
      const meta = GROUPS.find((g) => g.key === key);
      el.list.innerHTML = `
        <section class="group" data-tone="${meta.tone}">
          ${groupHead(meta.title, tasks.length, meta.tone)}
          ${tasks.map(taskHTML).join('')}
        </section>`;
      return;
    }

    const buckets = new Map(GROUPS.map((g) => [g.key, []]));
    tasks.forEach((t) => buckets.get(groupOf(t))?.push(t));

    const html = GROUPS
      .filter((g) => buckets.get(g.key).length)
      .map((g) => {
        const items = buckets.get(g.key);
        return `
          <section class="group" data-tone="${g.tone}">
            ${groupHead(g.title, items.length, g.tone)}
            ${items.map(taskHTML).join('')}
          </section>`;
      })
      .join('');

    el.list.innerHTML = html;
  }

  const groupHead = (title, count, tone) => `
    <div class="group-head">
      <h2><span class="group-dot"></span>${title}</h2>
      <span class="group-count">${count}</span>
      <span class="group-line"></span>
    </div>`;

  /* ── 操作 ─────────────────────────────────────────── */

  function addTask() {
    const title = el.newTitle.value.trim();
    if (!title) {
      el.newTitle.focus();
      return;
    }

    const id = uid();

    state.tasks.unshift({
      id,
      title,
      subject: el.newSubject.value.trim(),
      priority: el.newPriority.value,
      due: el.newDue.value || '',
      note: '',
      done: false,
      createdAt: Date.now(),
      completedAt: null,
    });

    save();

    // 保留科目与优先级，方便连续录入
    el.newTitle.value = '';
    el.newDue.value = '';
    el.newTitle.focus();
    render();
    highlightTask(id);
    announce(`已添加任务 ${title}`);
  }

  /** 新任务可能在长列表下方，闪一下并滚入视野，避免"点了没反应"的错觉 */
  function highlightTask(id) {
    const card = el.list.querySelector(`.task[data-id="${id}"]`);
    if (!card) return;

    card.classList.add('flash');
    card.addEventListener('animationend', () => card.classList.remove('flash'), { once: true });

    const box = card.getBoundingClientRect();
    const offscreen = box.top < 0 || box.bottom > window.innerHeight;
    if (offscreen) card.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function toggleTask(id) {
    const t = state.tasks.find((x) => x.id === id);
    if (!t) return;
    t.done = !t.done;
    t.completedAt = t.done ? Date.now() : null;
    save();
    render();
    announce(`${t.title} 已标记为${t.done ? '完成' : '未完成'}`);
  }

  function deleteTask(id) {
    const index = state.tasks.findIndex((x) => x.id === id);
    if (index < 0) return;

    state.lastDeleted = { task: state.tasks[index], index };
    state.tasks.splice(index, 1);
    save();
    render();

    showToast(`已删除「${truncate(state.lastDeleted.task.title, 14)}」`, true);
    announce(`已删除任务 ${state.lastDeleted.task.title}`);
  }

  function undoDelete() {
    if (!state.lastDeleted) return;
    const { task, index } = state.lastDeleted;
    state.tasks.splice(Math.min(index, state.tasks.length), 0, task);
    state.lastDeleted = null;
    save();
    render();
    hideToast();
  }

  function clearCompleted() {
    const count = state.tasks.filter((t) => t.done).length;
    if (!count) {
      showToast('没有已完成的任务', false);
      return;
    }
    if (!confirm(`确定要清除 ${count} 项已完成的任务吗？此操作不可撤销。`)) return;

    state.tasks = state.tasks.filter((t) => !t.done);
    save();
    render();
    showToast(`已清除 ${count} 项任务`, false);
  }

  const truncate = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

  /* ── 编辑弹窗 ─────────────────────────────────────── */

  function openEdit(id) {
    const t = state.tasks.find((x) => x.id === id);
    if (!t) return;

    state.editingId = id;
    el.editTitle.value    = t.title;
    el.editSubject.value  = t.subject || '';
    el.editPriority.value = t.priority in PRIORITY ? t.priority : 'mid';
    el.editDue.value      = t.due || '';
    el.editNote.value     = t.note || '';

    el.modal.showModal();
    el.editTitle.focus();
    el.editTitle.select();
  }

  function saveEdit() {
    const t = state.tasks.find((x) => x.id === state.editingId);
    if (!t) return;

    const title = el.editTitle.value.trim();
    if (!title) {
      el.editTitle.focus();
      return;
    }

    t.title    = title;
    t.subject  = el.editSubject.value.trim();
    t.priority = el.editPriority.value;
    t.due      = el.editDue.value || '';
    t.note     = el.editNote.value.trim();

    save();
    render();
    closeEdit();
  }

  function closeEdit() {
    state.editingId = null;
    el.modal.close();
  }

  /** 只播报状态变化，避免屏幕阅读器朗读整个列表 */
  function announce(msg) {
    el.live.textContent = '';
    // 强制重排，保证连续两次相同文案也能被朗读
    requestAnimationFrame(() => { el.live.textContent = msg; });
  }

  /* ── Toast（带撤销）───────────────────────────────── */

  let toastTimer = null;

  function showToast(msg, undoable) {
    el.toastMsg.textContent = msg;
    el.toastUndo.hidden = !undoable;
    el.toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, undoable ? 6000 : 2400);
  }

  function hideToast() {
    el.toast.classList.remove('show');
    clearTimeout(toastTimer);
  }

  /* ── 事件绑定 ─────────────────────────────────────── */

  function bindEvents() {
    // 新建
    el.composer.addEventListener('submit', (e) => {
      e.preventDefault();
      addTask();
    });

    // 快捷截止时间
    document.querySelectorAll('[data-quick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const offset = Number(btn.dataset.quick);
        if (offset < 0) {
          el.newDue.value = '';
          return;
        }
        const d = startOfDay(new Date());
        d.setDate(d.getDate() + offset);
        d.setHours(23, 59, 0, 0);
        el.newDue.value = toLocalInput(d);
      });
    });

    // 列表操作（事件委托）
    el.list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const id = btn.closest('.task')?.dataset.id;
      if (!id) return;

      switch (btn.dataset.act) {
        case 'toggle': toggleTask(id); break;
        case 'edit':   openEdit(id);   break;
        case 'delete': deleteTask(id); break;
      }
    });

    // 筛选
    el.filters.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-filter]');
      if (!chip) return;
      state.filter = chip.dataset.filter;
      render({ animate: true });
    });

    // 搜索（防抖）
    let searchTimer = null;
    el.search.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.query = el.search.value;
        renderList(true);
      }, 140);
    });

    // 排序
    el.sort.addEventListener('change', () => {
      state.sort = el.sort.value;
      renderList(true);
    });

    // 主题
    el.themeBtn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });

    // 清除已完成
    el.clearDone.addEventListener('click', clearCompleted);

    // 撤销
    el.toastUndo.addEventListener('click', undoDelete);

    // 弹窗
    el.editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveEdit();
    });
    el.editCancel.addEventListener('click', closeEdit);
    el.editClose.addEventListener('click', closeEdit);
    el.editDelete.addEventListener('click', () => {
      const id = state.editingId;
      closeEdit();
      if (id) deleteTask(id);
    });
    // 回车提交（textarea 除外）
    el.editForm.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        saveEdit();
      }
    });

    // 快捷键
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        el.search.focus();
      } else if (e.key === 'n' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        el.newTitle.focus();
      } else if (e.key === 'Escape' && e.target === el.search && el.search.value) {
        el.search.value = '';
        state.query = '';
        renderList(true);
      }
    });

    // 跨标签页同步
    window.addEventListener('storage', (e) => {
      if (e.key !== STORE_KEY) return;
      const next = load();
      if (next) {
        state.tasks = next;
        render({ animate: true });
      }
    });

    // 每分钟刷新相对时间；跨过零点时整表重算分组
    let currentDay = startOfDay(new Date()).getTime();
    setInterval(() => {
      const today = startOfDay(new Date()).getTime();
      if (today !== currentDay) {
        currentDay = today;
        render({ animate: true });
      } else {
        renderTodayLabel();
        renderStats();
      }
    }, 60000);
  }

  /* ── 启动 ─────────────────────────────────────────── */

  function init() {
    initTheme();

    const stored = load();
    if (stored) {
      state.tasks = stored;
    } else {
      seedIfEmpty();
    }

    bindEvents();
    render({ animate: true });
  }

  init();
})();
