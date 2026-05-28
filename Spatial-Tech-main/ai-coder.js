/* ══════════════════════════════════════════════════════════
   AI CODE ASSISTANT — Groq API (Free, Fast, Unlimited)
   Spatial Tech | GIS & Remote Sensing Hub
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIG ─── */
const AI_KEY_STORAGE  = 'spatialtech_groq_key_admin'; // Admin-only key storage
const GROQ_API_URL    = 'https://api.groq.com/openai/v1/chat/completions';
const SESSION_KEY     = 'spatialtech_session';

/*
  ┌──────────────────────────────────────────────────────────┐
  │  GROQ FREE TIER MODELS (as of March 2026)                │
  │  Get your FREE key at: console.groq.com                  │
  │  Free: 30 req/min, 14,400 req/day, NO credit card        │
  ├──────────────────────────────────────────────────────────┤
  │  llama-3.3-70b-versatile  → Best coding quality          │
  │  llama-3.1-8b-instant     → Ultra-fast fallback          │
  │  mixtral-8x7b-32768       → Great for long code          │
  └──────────────────────────────────────────────────────────┘
*/
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

/* ─── ROLE HELPER ─── */
function _isAdmin() {
  try {
    const sess = JSON.parse(
      sessionStorage.getItem(SESSION_KEY) ||
      localStorage.getItem(SESSION_KEY) ||
      'null'
    );
    return sess && sess.role === 'admin';
  } catch (e) {
    return false;
  }
}

/* ─── SYSTEM PROMPT ─── */
const CODE_SYSTEM_PROMPT = `You are an expert AI Code Assistant that writes complete, accurate, production-ready code for any programming task. You specialize in:

- Python scripts (automation, GIS, data processing, ML, web scraping, APIs, file management)
- GIS & Remote Sensing (GDAL, Rasterio, GeoPandas, Google Earth Engine, QGIS scripting, Shapely)
- JavaScript / TypeScript (Node.js, web tools, APIs, automation, Leaflet maps)
- Bash / Shell scripting and CLI tools
- SQL / PostGIS spatial queries and database scripts
- R scripts for spatial and statistical analysis
- Data pipelines, batch automation, ETL workflows

RULES:
1. Always provide COMPLETE, immediately runnable code — never partial snippets
2. Include ALL necessary imports and dependencies at the top
3. Add clear inline comments explaining key sections
4. Include a "# Usage / How to Run" section at the bottom
5. Mention pip/npm/conda install commands for required packages
6. For GIS tasks, note coordinate systems and expected input formats
7. Use proper error handling (try/except, input validation)
8. Organize code with well-named functions and docstrings
9. Format ALL code in markdown code blocks with language tags (e.g. \`\`\`python)
10. If ambiguous, state your assumption and proceed

Be direct, technical, and thorough. Write code that WORKS without modification.`;

/* ─── OVERRIDE filterTools FOR AI-CODER TAB ─── */
(function patchFilterTools() {
  window.filterTools = function(lang, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const panel = document.getElementById('aiCoderPanel');
    const grid  = document.getElementById('toolsGrid');

    if (lang === 'ai-coder') {
      if (panel) panel.style.display = 'block';
      if (grid)  grid.style.display  = 'none';

      const isAdmin = _isAdmin();

      // Show/hide the API key toggle button based on role
      const keyToggleBtn = document.getElementById('apiKeyToggleBtn');
      if (keyToggleBtn) {
        keyToggleBtn.style.display = isAdmin ? '' : 'none';
      }

      const keyPanel = document.getElementById('aiKeyPanel');
      if (keyPanel) {
        if (!isAdmin) {
          // Regular users never see the key panel
          keyPanel.style.display = 'none';
        } else {
          const savedKey = localStorage.getItem(AI_KEY_STORAGE);
          keyPanel.style.display = savedKey ? 'none' : 'block';
          if (savedKey) {
            const inp = document.getElementById('geminiApiKeyInput');
            if (inp) inp.value = '●'.repeat(20); // mask for display
            _updateKeyBtnStatus(true);
          }
        }
      }

      // Update welcome message for non-admin users
      if (!isAdmin) {
        _updateWelcomeMessage();
      }

      return;
    }

    if (panel) panel.style.display = 'none';
    if (grid)  grid.style.display  = '';
    document.querySelectorAll('.tool-card').forEach(card => {
      card.classList.toggle('hidden', lang !== 'all' && card.dataset.lang !== lang);
    });
  };
})();

/* ─── UPDATE WELCOME MESSAGE FOR NON-ADMINS ─── */
function _updateWelcomeMessage() {
  const hasKey = !!localStorage.getItem(AI_KEY_STORAGE);
  if (hasKey) return; // Key is set, no need to change message

  // Replace hint about setting key with friendly ready message
  const messages = document.getElementById('aiCoderMessages');
  if (!messages) return;
  const lastMsg = messages.querySelector('.ai-coder-msg.bot:last-child .ai-coder-bubble p:last-child');
  if (lastMsg && lastMsg.textContent.includes('Set your free Groq API key')) {
    lastMsg.innerHTML = '✅ <em>AI Code Assistant is ready — just ask me anything!</em>';
  }
}

/* ─── API KEY ─── */
function toggleApiKeyPanel() {
  if (!_isAdmin()) return; // Security: only admin can toggle
  const panel = document.getElementById('aiKeyPanel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function saveApiKey() {
  // ── Security guard: only admin can save the API key ──
  if (!_isAdmin()) {
    _addMsg('🔒 **Access Denied.** Only the app administrator can configure the API key.', 'bot', true);
    return;
  }

  const input = document.getElementById('geminiApiKeyInput');
  const key   = input ? input.value.trim() : '';
  if (!key || key.startsWith('●')) {
    _addMsg('⚠️ Please paste a valid Groq API key. Get your **free** key at [console.groq.com](https://console.groq.com) — no credit card needed!', 'bot', true);
    return;
  }
  localStorage.setItem(AI_KEY_STORAGE, key);
  const keyPanel = document.getElementById('aiKeyPanel');
  if (keyPanel) keyPanel.style.display = 'none';
  _updateKeyBtnStatus(true);
  _addMsg('✅ **Groq API key saved!** Ready to write any code for you.\n\n**Try asking:**\n- *"Write a Python script to batch calculate NDVI for all TIF files in a folder"*\n- *"Create a complete GDAL pipeline to clip, reproject and compress rasters"*\n- *"Build a web scraper to download satellite data from a URL list"*', 'bot');
}

function _updateKeyBtnStatus(hasKey) {
  const btn = document.getElementById('apiKeyToggleBtn');
  if (!btn) return;
  btn.textContent     = hasKey ? '🔑 Change Key' : '🔑 API Key';
  btn.style.borderColor = hasKey ? 'rgba(74,222,128,0.5)' : '';
  btn.style.color       = hasKey ? '#4ade80' : '';
}

/* ─── CLEAR CHAT ─── */
function clearAiChat() {
  const msgs = document.getElementById('aiCoderMessages');
  if (!msgs) return;
  msgs.innerHTML = `
    <div class="ai-coder-msg bot">
      <div class="ai-coder-avatar">🤖</div>
      <div class="ai-coder-bubble">
        <p>Chat cleared! Ask me to write any code for you.</p>
      </div>
    </div>`;
}

/* ─── QUICK ASK ─── */
function aiQuickAsk(prompt) {
  const input = document.getElementById('aiCoderInput');
  if (input) { input.value = prompt; autoResizeAiCoder(input); }
  sendAiCoderMessage();
}

function handleAiCoderKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiCoderMessage(); }
}

function autoResizeAiCoder(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

/* ─── MESSAGES ─── */
function _addMsg(content, role = 'bot', isError = false) {
  const messages = document.getElementById('aiCoderMessages');
  if (!messages) return null;

  const wrap   = document.createElement('div');
  wrap.className = `ai-coder-msg ${role}`;

  const av = document.createElement('div');
  av.className   = 'ai-coder-avatar';
  av.textContent = role === 'bot' ? '🤖' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'ai-coder-bubble' + (isError ? ' ai-error-bubble' : '');

  if (role === 'bot') {
    bubble.innerHTML = _renderMd(content);
    setTimeout(() => _attachCopyBtns(bubble), 80);
  } else {
    bubble.textContent = content;
  }

  wrap.appendChild(av);
  wrap.appendChild(bubble);
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
  return wrap;
}

/* ─── MARKDOWN RENDERER ─── */
function _renderMd(text) {
  let out = text;

  // Fenced code blocks
  out = out.replace(/```(\w*)\n?([\s\S]*?)```/gm, (_, lang, code) => {
    const safe = code.trim()
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const badge = lang ? `<span class="ai-code-lang-badge">${lang}</span><br>` : '';
    const enc   = encodeURIComponent(code.trim());
    return `<div class="ai-code-block-wrap">${badge}<button class="ai-copy-btn" data-code="${enc}">📋 Copy</button><pre><code>${safe}</code></pre></div>`;
  });

  out = out.replace(/`([^`\n]+)`/g,    '<code>$1</code>');
  out = out.replace(/\*\*(.+?)\*\*/g,  '<strong>$1</strong>');
  out = out.replace(/\*(.+?)\*/g,      '<em>$1</em>');
  out = out.replace(/^#{1,3}\s+(.+)$/gm, '<strong style="display:block;color:#a78bfa;margin:0.6rem 0 0.2rem;font-size:1.02em">$1</strong>');

  // Tables
  let inTable = false;
  const parsed = out.split('\n').map(line => {
    if (/^\|.+\|$/.test(line)) {
      const cells = line.split('|').slice(1,-1);
      if (cells.every(c => /^[-:\s]+$/.test(c))) return '';
      if (!inTable) { inTable = true; return '<table><tr>' + cells.map(c=>`<th>${c.trim()}</th>`).join('') + '</tr>'; }
      return '<tr>' + cells.map(c=>`<td>${c.trim()}</td>`).join('') + '</tr>';
    }
    const close = inTable ? '</table>' : ''; inTable = false; return close + line;
  });
  if (inTable) parsed.push('</table>');
  out = parsed.join('\n');

  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  out = out.replace(/^[*\-]\s+(.+)$/gm, '<li>$1</li>');
  out = out.replace(/(\n?<li>[\s\S]*?<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
  out = out.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  out = '<p>' + out.replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br>') + '</p>';

  return out;
}

/* ─── COPY BUTTONS ─── */
function _attachCopyBtns(container) {
  container.querySelectorAll('.ai-copy-btn').forEach(btn => {
    btn.onclick = () => {
      const code = decodeURIComponent(btn.dataset.code || '');
      const done = () => {
        btn.textContent = '✅ Copied!'; btn.classList.add('copied');
        setTimeout(() => { btn.textContent = '📋 Copy'; btn.classList.remove('copied'); }, 2200);
      };
      navigator.clipboard.writeText(code).then(done).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = code; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta); done();
      });
    };
  });
}

/* ─── TYPING ─── */
function _showTyping(msg = '') {
  const messages = document.getElementById('aiCoderMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.id = 'aiTypingIndicator'; div.className = 'ai-coder-msg bot';
  div.innerHTML = `
    <div class="ai-coder-avatar">🤖</div>
    <div class="ai-coder-bubble" id="aiTypingBubble">
      ${msg
        ? `<p style="color:var(--text2);font-size:0.84em;">${msg}</p>`
        : '<div class="ai-typing-dots"><span></span><span></span><span></span></div>'}
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
function _updateTyping(msg) {
  const b = document.getElementById('aiTypingBubble');
  if (b) b.innerHTML = `<p style="color:var(--text2);font-size:0.84em;">${msg}</p>`;
}
function _hideTyping() { const el = document.getElementById('aiTypingIndicator'); if (el) el.remove(); }
function _setInputState(d) {
  const i = document.getElementById('aiCoderInput'), b = document.getElementById('aiCoderSendBtn');
  if (i) i.disabled = d; if (b) b.disabled = d;
}

/* ─── CALL GROQ ─── */
async function _callGroq(apiKey, model, messages) {
  return fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 8192,
    })
  });
}

/* ─── SEND MESSAGE ─── */
async function sendAiCoderMessage() {
  const input = document.getElementById('aiCoderInput');
  if (!input) return;
  const question = input.value.trim();
  if (!question) return;

  const apiKey = localStorage.getItem(AI_KEY_STORAGE);
  if (!apiKey) {
    // Non-admin users get a friendly message, admin users get the key panel
    if (_isAdmin()) {
      const kp = document.getElementById('aiKeyPanel');
      if (kp) kp.style.display = 'block';
      _addMsg('🔑 **API Key Required!**\n\nGet your FREE Groq key at [console.groq.com](https://console.groq.com) — no credit card, instant access.\n\nThen paste it using the **🔑 API Key** button above.', 'bot', true);
    } else {
      _addMsg('⚙️ **AI service is not configured yet.** Please contact the administrator to enable the AI Code Assistant.', 'bot', true);
    }
    return;
  }

  const langSel  = document.getElementById('aiLangSelect');
  const pref     = langSel ? langSel.value : 'any';
  const langHint = pref !== 'any' ? ` (Prefer ${pref} unless another language is clearly better.)` : '';

  input.value = ''; input.style.height = 'auto';
  _addMsg(question, 'user');
  _showTyping();
  _setInputState(true);

  const messages = [
    { role: 'system', content: CODE_SYSTEM_PROMPT },
    { role: 'user',   content: question + langHint }
  ];

  let succeeded = false;

  for (const model of GROQ_MODELS) {
    try {
      _updateTyping(`🔄 Generating with <strong>${model}</strong>…`);
      const res = await _callGroq(apiKey, model, messages);

      /* ── Invalid key ── */
      if (res.status === 401) {
        _hideTyping();
        localStorage.removeItem(AI_KEY_STORAGE);
        _updateKeyBtnStatus(false);
        if (_isAdmin()) {
          const kp = document.getElementById('aiKeyPanel');
          if (kp) kp.style.display = 'block';
          _addMsg('❌ **Invalid API Key.** Please get a new key from [console.groq.com](https://console.groq.com) and try again.', 'bot', true);
        } else {
          _addMsg('❌ **AI service configuration error.** Please contact the administrator.', 'bot', true);
        }
        succeeded = true; break;
      }

      /* ── Rate limited ── */
      if (res.status === 429) {
        _updateTyping(`⏳ <strong>${model}</strong> rate limit — waiting 8s…`);
        await new Promise(r => setTimeout(r, 8000));
        const res2 = await _callGroq(apiKey, model, messages);
        if (res2.ok) {
          const d2 = await res2.json();
          const t2 = d2?.choices?.[0]?.message?.content;
          if (t2) { _hideTyping(); _addMsg(t2, 'bot'); succeeded = true; break; }
        }
        continue; /* try next model */
      }

      /* ── Model not found ── */
      if (res.status === 404) { continue; }

      /* ── Other errors ── */
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`${model} error:`, err?.error?.message);
        continue;
      }

      /* ── Success ── */
      const data  = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) {
        _hideTyping();
        _addMsg(reply, 'bot');
        succeeded = true; break;
      }

    } catch (e) {
      console.warn(`${model} network error:`, e.message);
      if (model === GROQ_MODELS[GROQ_MODELS.length - 1]) {
        _hideTyping();
        _addMsg('🌐 **Network error.** Please check your internet connection.', 'bot', true);
        succeeded = true;
      }
    }
  }

  if (!succeeded) {
    _hideTyping();
    _addMsg(`⏳ **Temporarily rate limited.** Please wait 30 seconds and try again.\n\nGroq free tier: **30 requests/minute, 14,400/day** — very generous for normal use!`, 'bot', true);
  }

  _setInputState(false);
  const inp = document.getElementById('aiCoderInput');
  if (inp) inp.focus();
}

console.log('🤖 AI Code Assistant ready — Powered by Groq (Llama 3.3 70B) — FREE unlimited use');
