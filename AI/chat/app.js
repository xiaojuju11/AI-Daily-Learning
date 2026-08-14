/* ==========================================
   DeepSeek 风格多模态 AI 聊天助手 — 核心逻辑
   ========================================== */

// ---------- 常量 ----------
const API_ENDPOINT = 'https://api.siliconflow.cn/v1/chat/completions';
const DEFAULT_MODEL = 'Qwen/Qwen3.6-27B';

// ---------- 全局状态 ----------
const state = {
  apiKey: '',
  conversations: [],      // [{ id, title, messages, createdAt }]
  currentConvId: null,
  isGenerating: false,
  abortController: null,
  settings: {
    model: DEFAULT_MODEL,
    temperature: 0.7,
    maxTokens: 4096,
    thinkingMode: false,
    darkMode: true,
  },
  pendingImages: [],      // [{ base64, file }] 待发送图片
  convToDelete: null,     // 待删除对话 ID
};

// ---------- DOM 引用 ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  sidebar: $('#sidebar'),
  conversationList: $('#conversationList'),
  main: $('#main'),
  welcomeScreen: $('#welcomeScreen'),
  chatArea: $('#chatArea'),
  messagesContainer: $('#messagesContainer'),
  messageInput: $('#messageInput'),
  btnSend: $('#btnSend'),
  btnStop: $('#btnStop'),
  btnUpload: $('#btnUpload'),
  fileInput: $('#fileInput'),
  imagePreviewBar: $('#imagePreviewBar'),
  inputArea: $('#inputArea'),
  settingsModal: $('#settingsModal'),
  apiKeyModal: $('#apiKeyModal'),
  confirmModal: $('#confirmModal'),
  toastContainer: $('#toastContainer'),
};

// ---------- 初始化 ----------
function init() {
  loadFromStorage();
  applyTheme();
  applySettings();
  renderConversationList();
  bindEvents();

  if (!state.apiKey) {
    showApiKeyModal();
  } else {
    // 默认创建或打开一个对话
    if (state.conversations.length === 0) {
      createNewConversation(false);
    }
    switchConversation(state.currentConvId || state.conversations[0].id);
  }
}

// ---------- localStorage ----------
function loadFromStorage() {
  try {
    const apiKey = localStorage.getItem('sf_api_key');
    const conversations = localStorage.getItem('sf_conversations');
    const currentConvId = localStorage.getItem('sf_current_conv');
    const settings = localStorage.getItem('sf_settings');

    if (apiKey) state.apiKey = apiKey;
    if (conversations) state.conversations = JSON.parse(conversations);
    if (currentConvId) state.currentConvId = currentConvId;
    if (settings) state.settings = { ...state.settings, ...JSON.parse(settings) };
    if (state.settings.darkMode === undefined) state.settings.darkMode = true;
    if (state.settings.thinkingMode === undefined) state.settings.thinkingMode = false;
  } catch (e) {
    console.error('加载数据失败:', e);
  }
}

function saveToStorage() {
  try {
    if (state.apiKey) localStorage.setItem('sf_api_key', state.apiKey);
    localStorage.setItem('sf_conversations', JSON.stringify(state.conversations));
    localStorage.setItem('sf_current_conv', state.currentConvId || '');
    localStorage.setItem('sf_settings', JSON.stringify(state.settings));
  } catch (e) {
    console.error('保存数据失败:', e);
  }
}

// ---------- 主题 ----------
function applyTheme() {
  document.body.classList.toggle('light', !state.settings.darkMode);
}

// ---------- 事件绑定 ----------
function bindEvents() {
  // 新建对话
  $('#btnNewChat').addEventListener('click', () => createNewConversation());

  // 发送消息
  dom.btnSend.addEventListener('click', () => sendMessage());
  dom.messageInput.addEventListener('keydown', handleInputKeydown);
  dom.messageInput.addEventListener('input', autoResizeTextarea);

  // 停止生成
  dom.btnStop.addEventListener('click', stopGeneration);

  // 图片上传
  dom.btnUpload.addEventListener('click', () => dom.fileInput.click());
  dom.fileInput.addEventListener('change', handleFileSelect);
  dom.messageInput.addEventListener('paste', handlePaste);
  dom.messageInput.addEventListener('dragover', (e) => e.preventDefault());
  dom.messageInput.addEventListener('drop', handleDrop);

  // 设置弹窗
  $('#btnSettings').addEventListener('click', openSettings);
  $('#btnCloseSettings').addEventListener('click', closeSettings);
  $('#btnSaveSettings').addEventListener('click', saveSettings);
  $('#btnResetSettings').addEventListener('click', resetSettings);

  // API Key 弹窗
  $('#btnConfirmApiKey').addEventListener('click', confirmApiKey);

  // 确认删除弹窗
  $('#btnCancelDelete').addEventListener('click', closeConfirmModal);
  $('#btnConfirmDelete').addEventListener('click', confirmDeleteConversation);
  $('#btnCloseConfirm').addEventListener('click', closeConfirmModal);

  // 侧边栏折叠（移动端）
  $('#btnToggleSidebar').addEventListener('click', toggleSidebar);

  // 设置面板实时预览
  $('#temperature').addEventListener('input', (e) => {
    $('#tempValue').textContent = e.target.value;
  });
  $('#maxTokens').addEventListener('input', (e) => {
    $('#tokensValue').textContent = e.target.value;
  });

  // 点击弹窗遮罩关闭
  dom.settingsModal.addEventListener('click', (e) => {
    if (e.target === dom.settingsModal) closeSettings();
  });
  dom.confirmModal.addEventListener('click', (e) => {
    if (e.target === dom.confirmModal) closeConfirmModal();
  });

  // 欢迎页建议卡片
  $$('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt;
      dom.messageInput.value = prompt;
      dom.messageInput.focus();
      sendMessage();
    });
  });
}

// ---------- 对话管理 ----------
function createNewConversation(switchTo = true) {
  const conv = {
    id: generateId(),
    title: '新对话',
    messages: [],
    createdAt: Date.now(),
  };
  state.conversations.unshift(conv);
  saveToStorage();
  renderConversationList();

  if (switchTo) {
    switchConversation(conv.id);
  }
}

function switchConversation(convId) {
  state.currentConvId = convId;

  // 查找对话
  const conv = state.conversations.find(c => c.id === convId);
  if (!conv) {
    // 对话不存在，回退
    if (state.conversations.length > 0) {
      state.currentConvId = state.conversations[0].id;
    } else {
      createNewConversation();
      return;
    }
  }

  saveToStorage();
  renderConversationList();
  renderMessages();

  // 显示/隐藏欢迎页
  const conv2 = getCurrentConv();
  if (conv2 && conv2.messages.length > 0) {
    dom.welcomeScreen.style.display = 'none';
    dom.chatArea.style.display = 'flex';
  } else {
    dom.welcomeScreen.style.display = 'flex';
    dom.chatArea.style.display = 'none';
  }

  dom.messageInput.focus();
}

function getCurrentConv() {
  return state.conversations.find(c => c.id === state.currentConvId);
}

function deleteConversation(convId) {
  state.conversations = state.conversations.filter(c => c.id !== convId);
  if (state.currentConvId === convId) {
    state.currentConvId = state.conversations[0]?.id || null;
  }
  saveToStorage();
  renderConversationList();

  if (!state.currentConvId) {
    createNewConversation();
    return;
  }

  const conv = getCurrentConv();
  if (conv && conv.messages.length > 0) {
    dom.welcomeScreen.style.display = 'none';
    dom.chatArea.style.display = 'flex';
    renderMessages();
  } else {
    dom.welcomeScreen.style.display = 'flex';
    dom.chatArea.style.display = 'none';
    dom.messagesContainer.innerHTML = '';
  }
}

function updateConversationTitle(convId, title) {
  const conv = state.conversations.find(c => c.id === convId);
  if (conv) {
    conv.title = title.length > 30 ? title.substring(0, 30) + '...' : title;
    saveToStorage();
    renderConversationList();
  }
}

function generateId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

// ---------- 渲染侧边栏对话列表 ----------
function renderConversationList() {
  dom.conversationList.innerHTML = state.conversations.length === 0
    ? '<div class="empty-state"><div class="empty-state-icon">💬</div><div>暂无对话</div></div>'
    : state.conversations.map(conv => `
      <div class="conversation-item ${conv.id === state.currentConvId ? 'active' : ''}"
           data-conv-id="${conv.id}">
        <span class="conv-title" title="${escapeHtml(conv.title)}">${escapeHtml(conv.title)}</span>
        <button class="btn-delete-conv" data-action="delete" data-conv-id="${conv.id}" title="删除对话">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');

  // 绑定事件
  dom.conversationList.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn && btn.dataset.action === 'delete') {
        e.stopPropagation();
        state.convToDelete = btn.dataset.convId;
        showConfirmModal();
        return;
      }
      switchConversation(item.dataset.convId);
    });
  });
}

// ---------- 渲染消息 ----------
function renderMessages() {
  const conv = getCurrentConv();
  if (!conv || conv.messages.length === 0) {
    dom.messagesContainer.innerHTML = '';
    return;
  }

  dom.messagesContainer.innerHTML = `<div class="messages-inner">${conv.messages.map(msg => renderMessageHTML(msg)).join('')}</div>`;
  scrollToBottom();
  highlightAllCode();
}

function renderMessageHTML(msg) {
  const roleClass = msg.role === 'user' ? 'user' : 'assistant';
  const avatar = msg.role === 'user' ? '👤' : '🤖';
  const imagesHtml = msg.images?.length
    ? `<div class="message-images">${msg.images.map(img => `<img src="${img}" alt="上传图片">`).join('')}</div>`
    : '';

  let contentHtml = '';
  if (msg.role === 'assistant') {
    contentHtml = renderMarkdown(msg.content);
  } else {
    contentHtml = escapeHtml(msg.content);
  }

  return `
    <div class="message ${roleClass}">
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        ${imagesHtml}
        <div class="message-text">${contentHtml}</div>
      </div>
    </div>
  `;
}

// ---------- Markdown 渲染 ----------
function renderMarkdown(text) {
  if (typeof marked === 'undefined') return escapeHtml(text);

  // 自定义渲染器：处理代码块
  const renderer = new marked.Renderer();
  renderer.code = function({ text, lang }) {
    const langDisplay = lang || 'code';
    const escapedCode = escapeHtml(text);
    const langClass = lang ? `language-${lang}` : '';
    const copyId = 'copy_' + Math.random().toString(36).substring(2, 8);
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span>${langDisplay}</span>
          <button class="btn-copy" data-copy-id="${copyId}" onclick="copyCode(this)" title="复制代码">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
            复制
          </button>
        </div>
        <pre><code class="${langClass}" id="${copyId}">${escapedCode}</code></pre>
      </div>`;
  };

  try {
    return marked.parse(text, { renderer, breaks: true, gfm: true });
  } catch (e) {
    return escapeHtml(text);
  }
}

function highlightAllCode() {
  if (typeof hljs === 'undefined') return;
  document.querySelectorAll('.message-content pre code').forEach(block => {
    hljs.highlightElement(block);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- 发送消息 ----------
async function sendMessage() {
  if (state.isGenerating) return;

  const text = dom.messageInput.value.trim();
  const images = [...state.pendingImages];
  if (!text && images.length === 0) return;
  if (!state.apiKey) { showApiKeyModal(); return; }

  // 确保有对话
  let conv = getCurrentConv();
  if (!conv) {
    createNewConversation();
    conv = getCurrentConv();
  }

  // 构建用户消息
  const userMsg = {
    role: 'user',
    content: text,
    images: images.map(img => img.base64),
    timestamp: Date.now(),
  };

  // 添加用户消息
  conv.messages.push(userMsg);
  clearInput();
  dom.welcomeScreen.style.display = 'none';
  dom.chatArea.style.display = 'flex';

  // 更新对话标题（用第一条用户消息）
  if (conv.title === '新对话' || conv.messages.filter(m => m.role === 'user').length === 1) {
    updateConversationTitle(conv.id, text || '图片对话');
  }

  renderMessages();

  // 创建 AI 回复占位
  const assistantMsg = {
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
  };
  conv.messages.push(assistantMsg);
  saveToStorage();

  // 渲染 AI 占位消息
  appendAssistantPlaceholder();
  scrollToBottom();

  // 设置生成状态
  state.isGenerating = true;
  dom.btnSend.style.display = 'none';
  dom.btnStop.style.display = 'flex';
  dom.messageInput.disabled = true;

  // 构建 API 请求
  const messages = buildApiMessages(conv, assistantMsg);

  state.abortController = new AbortController();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.apiKey}`,
      },
      body: JSON.stringify({
        model: state.settings.model,
        messages,
        temperature: state.settings.temperature,
        max_tokens: state.settings.maxTokens,
        stream: true,
        ...(state.settings.thinkingMode ? { thinking: true } : {}),
      }),
      signal: state.abortController.signal,
    });

    if (!response.ok) {
      const err = await response.text();
      let errMsg = `API 错误 ${response.status}`;
      try {
        const errJson = JSON.parse(err);
        errMsg = errJson.error?.message || errJson.message || errMsg;
      } catch (_) {}
      throw new Error(errMsg);
    }

    // 读取 SSE 流
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta;
          if (delta?.content) {
            assistantMsg.content += delta.content;
            updateAssistantContent(assistantMsg.content, false);
          }
          // 处理 reasoning_content（thinking 模式）
          if (delta?.reasoning_content) {
            assistantMsg.reasoning = (assistantMsg.reasoning || '') + delta.reasoning_content;
          }
        } catch (_) {}
      }
    }

    updateAssistantContent(assistantMsg.content, true);
    assistantMsg.timestamp = Date.now();
    saveToStorage();
    highlightAllCode();
  } catch (err) {
    if (err.name === 'AbortError') {
      // 用户主动停止
      if (assistantMsg.content) {
        assistantMsg.content += '\n\n*[已停止生成]*';
      } else {
        assistantMsg.content = '*[已停止生成]*';
      }
      updateAssistantContent(assistantMsg.content, true);
      saveToStorage();
    } else {
      // 错误处理
      assistantMsg.content = `❌ **错误**: ${err.message}`;
      updateAssistantContent(assistantMsg.content, true);
      saveToStorage();
      showToast(err.message, 'error');
    }
  } finally {
    state.isGenerating = false;
    state.abortController = null;
    dom.btnSend.style.display = 'flex';
    dom.btnStop.style.display = 'none';
    dom.messageInput.disabled = false;
    dom.messageInput.focus();
  }
}

function buildApiMessages(conv, upToMsg) {
  const messages = [];

  // 系统提示
  messages.push({
    role: 'system',
    content: '你是一个有用的AI助手，可以理解用户上传的图片内容。请用中文回复。回答时可以使用 Markdown 格式，包括代码块、表格等。',
  });

  // 历史消息（跳过当前的 AI 回复）
  for (const msg of conv.messages) {
    if (msg === upToMsg) break;

    if (msg.role === 'user') {
      const content = [];
      if (msg.images?.length) {
        for (const img of msg.images) {
          content.push({
            type: 'image_url',
            image_url: { url: img, detail: 'high' },
          });
        }
      }
      if (msg.content) {
        content.push({ type: 'text', text: msg.content });
      }
      messages.push({ role: 'user', content: content.length === 1 && content[0].type === 'text' ? msg.content : content });
    } else if (msg.role === 'assistant' && msg.content) {
      messages.push({ role: 'assistant', content: msg.content });
    }
  }

  return messages;
}

// ---------- AI 回复 DOM 操作 ----------
function appendAssistantPlaceholder() {
  const inner = dom.messagesContainer.querySelector('.messages-inner');
  if (!inner) {
    dom.messagesContainer.innerHTML = '<div class="messages-inner"></div>';
  }
  const messagesInner = dom.messagesContainer.querySelector('.messages-inner');
  const div = document.createElement('div');
  div.className = 'message assistant';
  div.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <div class="message-text typing-cursor"></div>
    </div>
  `;
  messagesInner.appendChild(div);
  scrollToBottom();
}

function updateAssistantContent(content, finished) {
  const messages = dom.messagesContainer.querySelectorAll('.message.assistant');
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg) return;

  const textDiv = lastMsg.querySelector('.message-text');
  if (textDiv) {
    textDiv.innerHTML = renderMarkdown(content);
    if (!finished) {
      textDiv.classList.add('typing-cursor');
    } else {
      textDiv.classList.remove('typing-cursor');
    }
  }
  scrollToBottom();
}

// ---------- 停止生成 ----------
function stopGeneration() {
  if (state.abortController) {
    state.abortController.abort();
  }
}

// ---------- 图片处理 ----------
function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    addPendingImage(file);
  }
  e.target.value = '';
}

function handlePaste(e) {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault();
      addPendingImage(item.getAsFile());
    }
  }
}

function handleDrop(e) {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    addPendingImage(file);
  }
}

function addPendingImage(file) {
  if (state.pendingImages.length >= 5) {
    showToast('最多上传 5 张图片', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    state.pendingImages.push({
      file,
      base64: reader.result,
    });
    renderImagePreviews();
  };
  reader.readAsDataURL(file);
}

function removePendingImage(index) {
  state.pendingImages.splice(index, 1);
  renderImagePreviews();
}

function renderImagePreviews() {
  if (state.pendingImages.length === 0) {
    dom.imagePreviewBar.innerHTML = '';
    return;
  }

  dom.imagePreviewBar.innerHTML = state.pendingImages.map((img, i) => `
    <div class="image-preview-item">
      <img src="${img.base64}" alt="预览">
      <button class="btn-remove-image" onclick="removePendingImage(${i})" title="移除">✕</button>
    </div>
  `).join('');
}

function clearInput() {
  dom.messageInput.value = '';
  state.pendingImages = [];
  dom.imagePreviewBar.innerHTML = '';
  dom.messageInput.style.height = 'auto';
}

// ---------- 输入框辅助 ----------
function handleInputKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResizeTextarea() {
  const el = dom.messageInput;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

// ---------- 设置面板 ----------
function openSettings() {
  // 同步状态到表单
  $('#apiKey').value = state.apiKey;
  $('#modelSelect').value = state.settings.model;
  $('#temperature').value = state.settings.temperature;
  $('#tempValue').textContent = state.settings.temperature;
  $('#maxTokens').value = state.settings.maxTokens;
  $('#tokensValue').textContent = state.settings.maxTokens;
  $('#thinkingMode').checked = state.settings.thinkingMode;
  $('#darkMode').checked = state.settings.darkMode;

  dom.settingsModal.style.display = 'flex';
}

function closeSettings() {
  dom.settingsModal.style.display = 'none';
}

function saveSettings() {
  state.apiKey = $('#apiKey').value.trim();
  state.settings.model = $('#modelSelect').value;
  state.settings.temperature = parseFloat($('#temperature').value);
  state.settings.maxTokens = parseInt($('#maxTokens').value);
  state.settings.thinkingMode = $('#thinkingMode').checked;
  state.settings.darkMode = $('#darkMode').checked;

  saveToStorage();
  applyTheme();
  closeSettings();
  showToast('设置已保存 ✓', 'success');
}

function resetSettings() {
  state.apiKey = '';
  state.settings = {
    model: DEFAULT_MODEL,
    temperature: 0.7,
    maxTokens: 4096,
    thinkingMode: false,
    darkMode: true,
  };
  saveToStorage();
  applyTheme();
  // 更新表单
  openSettings();
  showToast('已恢复默认设置', 'info');
}

function applySettings() {
  // 同步设置到表单（用于初始化时不影响 DOM）
}

// ---------- API Key 弹窗 ----------
function showApiKeyModal() {
  dom.apiKeyModal.style.display = 'flex';
  $('#apiKeyWelcome').focus();
}

function confirmApiKey() {
  const key = $('#apiKeyWelcome').value.trim();
  if (!key) {
    showToast('请输入 API Key', 'error');
    return;
  }
  state.apiKey = key;
  saveToStorage();
  dom.apiKeyModal.style.display = 'none';
  showToast('API Key 已保存 ✓', 'success');

  if (state.conversations.length === 0) {
    createNewConversation(false);
  }
  switchConversation(state.currentConvId || state.conversations[0].id);
}

// ---------- 确认删除弹窗 ----------
function showConfirmModal() {
  dom.confirmModal.style.display = 'flex';
}

function closeConfirmModal() {
  dom.confirmModal.style.display = 'none';
  state.convToDelete = null;
}

function confirmDeleteConversation() {
  if (state.convToDelete) {
    deleteConversation(state.convToDelete);
    state.convToDelete = null;
  }
  dom.confirmModal.style.display = 'none';
}

// ---------- 辅助功能 ----------
function toggleSidebar() {
  dom.sidebar.classList.toggle('collapsed');
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
  });
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 复制代码块（全局函数）
window.copyCode = function(btn) {
  const copyId = btn.dataset.copyId;
  const codeBlock = document.getElementById(copyId);
  if (!codeBlock) return;

  const text = codeBlock.textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      已复制
    `;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        复制
      `;
    }, 2000);
  }).catch(() => {
    showToast('复制失败', 'error');
  });
};

// 将 removePendingImage 挂到全局（内联 onclick 需要）
window.removePendingImage = removePendingImage;

// ---------- 启动 ----------
document.addEventListener('DOMContentLoaded', init);
