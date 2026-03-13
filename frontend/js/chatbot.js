/* ArogyaBot Chat Widget — MULTI-MODE (Floating & Embedded)
   Floating medical AI assistant for general pages.
   Embedded layout box for the main dashboard.
*/

(function () {
  const SESSION_ID = "doc_" + (localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id || "anon"
    : "anon");

  let isOpen = false;
  let messageCount = 0;
  
  // Detect if there's an embedded target on the page
  const embeddedTarget = document.getElementById("arogyabot-embedded-target");
  const isEmbedded = !!embeddedTarget;

  /* ─── Inject HTML ─── */
  const chatHTML = `
  <div id="arogyabot-fab" onclick="ArogyaBot.toggle()" title="ArogyaBot — Medical AI Assistant" style="${isEmbedded ? 'display:none;' : ''}">
    <div class="arogyabot-fab-inner">
      <i class="ri-robot-2-fill" id="arogyabot-fab-icon"></i>
      <div class="arogyabot-ripple"></div>
    </div>
    <span id="arogyabot-unread" class="arogyabot-unread" style="display:none;">1</span>
  </div>

  <div id="arogyabot-panel" class="arogyabot-panel ${isEmbedded ? 'embedded' : ''}" style="${isEmbedded ? 'display:flex;' : 'display:none;'}">
    <!-- Header (Hidden in embedded if redundant, but user asked for "box before map" so we'll keep a mini header) -->
    <div class="arogyabot-header" style="${isEmbedded ? 'display:none;' : ''}">
      <div class="arogyabot-header-left">
        <div class="arogyabot-avatar"><i class="ri-robot-2-line"></i></div>
        <div>
          <div class="arogyabot-name">ArogyaBot</div>
          <div class="arogyabot-status"><span class="arogyabot-dot"></span>Medical Intelligence</div>
        </div>
      </div>
      <div class="arogyabot-header-right">
        <button title="Refresh" onclick="ArogyaBot.clearChat()"><i class="ri-refresh-line"></i></button>
        <button title="Hide" onclick="ArogyaBot.close()"><i class="ri-subtract-line"></i></button>
      </div>
    </div>

    <!-- Messages Container -->
    <div class="arogyabot-messages" id="arogyabot-messages">
      <div class="arogyabot-msg bot">
        <div class="arogyabot-bubble">
          <div class="arogyabot-welcome">
            <span class="arogyabot-wave">👋</span>
            <h3>Welcome, Doctor</h3>
            <p>I am <strong>ArogyaBot</strong>, your clinical co-pilot. I am currently connected to your <strong>Patient Database</strong> and latest <strong>Medical Research</strong>.</p>
          </div>
          <div class="arogyabot-capabilities">
            <span><i class="ri-database-2-line"></i> Real-time DB</span>
            <span><i class="ri-flask-line"></i> Research</span>
            <span><i class="ri-capsule-line"></i> Rx Check</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggestions (Glassmorphic) -->
    <div class="arogyabot-suggestions" id="arogyabot-suggestions">
      <button onclick="ArogyaBot.send('Breakdown my patient list by blood group.')">
        <i class="ri-drop-line"></i> Blood Group Analysis
      </button>
      <button onclick="ArogyaBot.send('Summarize recent symptoms across all patients.')">
        <i class="ri-pulse-line"></i> Clinical Trends
      </button>
      <button onclick="ArogyaBot.send('Analyze the current patient context.')">
        <i class="ri-user-search-line"></i> Focused Analysis
      </button>
    </div>

    <!-- Input Area -->
    <div class="arogyabot-input-wrapper">
      <div class="arogyabot-input-row">
        <textarea
          id="arogyabot-input"
          class="arogyabot-input"
          placeholder="Ask anything about patients or research..."
          rows="1"
          onkeydown="ArogyaBot.handleKey(event)"
          oninput="ArogyaBot.autoResize(this)"
        ></textarea>
        <button class="arogyabot-send" onclick="ArogyaBot.sendFromInput()" id="arogyabot-send-btn">
          <i class="ri-send-plane-2-fill"></i>
        </button>
      </div>
      <div class="arogyabot-footer">Clinical utility only. Verify all AI suggestions.</div>
    </div>
  </div>
  `;

  /* ─── Inject Premium CSS ─── */
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

    :root {
      --arogyabot-gold: #e8820c;
      --arogyabot-gold-light: #ff9d2e;
      --arogyabot-dark: #181311;
      --arogyabot-cream: #fcfaf6;
      --arogyabot-white: #ffffff;
      --arogyabot-text: #1b1714;
      --arogyabot-muted: #9c938b;
      --arogyabot-shadow: 0 12px 48px rgba(24, 18, 12, 0.15);
    }

    /* Floating FAB Styles */
    #arogyabot-fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9999;
      width: 64px;
      height: 64px;
      cursor: pointer;
      user-select: none;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .arogyabot-fab-inner {
      width: 100%; height: 100%; border-radius: 22px;
      background: linear-gradient(135deg, var(--arogyabot-gold) 0%, #d47400 100%);
      color: var(--arogyabot-white); display: flex; align-items: center; justify-content: center;
      font-size: 28px; box-shadow: 0 10px 30px rgba(232, 130, 12, 0.4);
      position: relative; overflow: hidden;
    }
    .arogyabot-ripple {
      position: absolute; width: 100%; height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      animation: arogyaRipple 3s infinite;
    }
    @keyframes arogyaRipple { 0% { transform: scale(0.5); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }

    .arogyabot-unread {
      position: absolute; top: -5px; right: -5px; width: 22px; height: 22px;
      border-radius: 50%; background: #ff4b4b; color: #fff; font-size: 11px;
      font-weight: 800; display: flex; align-items: center; justify-content: center;
      border: 3px solid var(--arogyabot-white); box-shadow: 0 4px 10px rgba(255, 75, 75, 0.3);
    }

    /* Main Panel Styles */
    .arogyabot-panel {
      position: fixed;
      bottom: 110px;
      right: 32px;
      z-index: 9998;
      width: 420px;
      height: 640px;
      border-radius: 35px;
      background: var(--arogyabot-white);
      display: flex;
      flex-direction: column;
      box-shadow: var(--arogyabot-shadow);
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      transform-origin: bottom right;
      animation: arogyaPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* EMBEDDED MODE OVERRIDES */
    .arogyabot-panel.embedded {
      position: static;
      width: 100%;
      height: 100%;
      border-radius: 0;
      box-shadow: none;
      animation: none;
    }

    @keyframes arogyaPop {
      0% { opacity: 0; transform: scale(0.5) translateY(100px); }
      70% { transform: scale(1.05) translateY(-5px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    .arogyabot-header {
      padding: 24px 28px; background: var(--arogyabot-dark);
      display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    }
    .arogyabot-header-left { display: flex; align-items: center; gap: 14px; }
    .arogyabot-avatar {
      width: 46px; height: 46px; border-radius: 14px;
      background: linear-gradient(135deg, var(--arogyabot-gold) 0%, #d47400 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; color: var(--arogyabot-white);
    }
    .arogyabot-name { font-family: 'Sora', sans-serif; font-weight: 700; color: #fff; font-size: 18px; }
    .arogyabot-status { color: rgba(255,255,255,0.5); font-size: 11px; display: flex; align-items: center; gap: 6px; }
    .arogyabot-dot { width: 8px; height: 8px; border-radius: 50%; background: #50e3c2; box-shadow: 0 0 8px #50e3c2; }

    .arogyabot-header-right { display: flex; gap: 10px; }
    .arogyabot-header-right button {
      background: rgba(255,255,255,0.08); border: none; color: #fff;
      width: 36px; height: 36px; border-radius: 12px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    .arogyabot-header-right button:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }

    .arogyabot-messages {
      flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column;
      gap: 20px; background: var(--arogyabot-cream);
    }
    .arogyabot-messages::-webkit-scrollbar { width: 4px; }
    .arogyabot-messages::-webkit-scrollbar-thumb { background: rgba(24, 18, 12, 0.05); border-radius: 10px; }

    .arogyabot-msg { display: flex; flex-direction: column; gap: 6px; animation: msgFade 0.4s ease-out both; }
    @keyframes msgFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .arogyabot-msg.bot { align-items: flex-start; }
    .arogyabot-msg.user { align-items: flex-end; }

    .arogyabot-bubble {
      max-width: 85%; padding: 14px 18px; border-radius: 20px;
      font-size: 14.5px; line-height: 1.6; font-weight: 500;
    }
    .arogyabot-msg.bot .arogyabot-bubble {
      background: var(--arogyabot-white); color: var(--arogyabot-text);
      border-bottom-left-radius: 4px; box-shadow: 0 4px 15px rgba(24,18,12,0.04);
      border: 1px solid rgba(232, 130, 12, 0.1);
    }
    .arogyabot-msg.user .arogyabot-bubble {
      background: var(--arogyabot-gold); color: var(--arogyabot-white);
      border-bottom-right-radius: 4px; box-shadow: 0 4px 15px rgba(232, 130, 12, 0.2);
    }

    .arogyabot-welcome h3 { font-family: 'Sora', sans-serif; font-size: 18px; margin: 10px 0 6px; color: var(--arogyabot-gold); }
    .arogyabot-welcome p { font-size: 13px; color: var(--arogyabot-muted); line-height: 1.5; }
    .arogyabot-capabilities { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
    .arogyabot-capabilities span {
      background: rgba(232,130,12,0.06); padding: 4px 10px; border-radius: 8px;
      font-size: 10px; font-weight: 700; color: var(--arogyabot-gold); text-transform: uppercase;
    }

    .arogyabot-suggestions {
      display: flex; flex-direction: row; gap: 10px; padding: 16px 24px;
      background: rgba(255,255,255,0.7); backdrop-filter: blur(10px);
      border-top: 1px solid rgba(24,18,12,0.05); flex-shrink: 0; overflow-x: auto;
    }
    .arogyabot-suggestions::-webkit-scrollbar { display: none; }
    .arogyabot-suggestions button {
      background: var(--arogyabot-white); border: 1px solid rgba(24,18,12,0.08);
      color: var(--arogyabot-text); border-radius: 14px; padding: 10px 16px;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
      white-space: nowrap; display: flex; align-items: center; gap: 8px;
    }
    .arogyabot-suggestions button:hover { border-color: var(--arogyabot-gold); transform: translateY(-2px); }

    .arogyabot-input-wrapper {
      padding: 16px 24px 20px; background: var(--arogyabot-white);
      border-top: 1px solid rgba(24, 18, 12, 0.05); flex-shrink: 0;
    }
    .arogyabot-input-row {
      display: flex; align-items: center; gap: 12px; background: #fdfcfb;
      border: 2px solid #f2f0ed; border-radius: 18px; padding: 6px 6px 6px 16px;
    }
    .arogyabot-input-row:focus-within { border-color: var(--arogyabot-gold); }
    .arogyabot-input { flex: 1; border: none; background: transparent; padding: 10px 0; font-size: 14px; outline: none; resize: none; max-height: 80px; }
    .arogyabot-send {
      width: 40px; height: 40px; border-radius: 12px; background: var(--arogyabot-dark);
      border: none; color: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .arogyabot-send:hover { background: var(--arogyabot-gold); }
    
    .arogyabot-footer { text-align: center; color: var(--arogyabot-muted); font-size: 10px; margin-top: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }

    .arogyabot-dot-pulse { display: flex; gap: 4px; padding: 10px 0; }
    .arogyabot-dot-pulse span { width: 6px; height: 6px; border-radius: 50%; background: var(--arogyabot-gold); animation: arogyaDotPulse 1.4s infinite ease-in-out both; }
    .arogyabot-dot-pulse span:nth-child(1) { animation-delay: -0.32s; }
    .arogyabot-dot-pulse span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes arogyaDotPulse { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
  `;
  document.head.appendChild(style);

  /* ─── Inject Into Target ─── */
  const container = isEmbedded ? embeddedTarget : document.body;
  const wrapper = document.createElement("div");
  if (isEmbedded) {
    wrapper.style.height = "100%";
    embeddedTarget.innerHTML = ""; // Clear loader
  }
  wrapper.innerHTML = chatHTML;
  container.appendChild(wrapper);

  /* ─── Clinical Logic ─── */
  function formatMsg(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>")
      .replace(/^• /gm, "&#8226; ")
      .replace(/^\- /gm, "&#8226; ");
  }

  function appendMsg(text, role) {
    const list = document.getElementById("arogyabot-messages");
    if (!list) return;
    const div = document.createElement("div");
    div.className = `arogyabot-msg ${role}`;
    const bubble = document.createElement("div");
    bubble.className = "arogyabot-bubble";

    if (role === "bot") bubble.innerHTML = formatMsg(text);
    else bubble.textContent = text;

    const time = document.createElement("div");
    time.className = "arogyabot-time";
    time.style.fontSize = "10px";
    time.style.color = "var(--arogyabot-muted)";
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    div.appendChild(bubble);
    div.appendChild(time);
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  }

  window.ArogyaBot = {
    toggle() { if (!isEmbedded) isOpen ? this.close() : this.open(); },
    open() {
      isOpen = true;
      document.getElementById("arogyabot-panel").style.display = "flex";
      document.getElementById("arogyabot-unread").style.display = "none";
      document.getElementById("arogyabot-fab").style.transform = "rotate(90deg) scale(0.9)";
      document.getElementById("arogyabot-input").focus();
    },
    close() {
      isOpen = false;
      document.getElementById("arogyabot-panel").style.display = "none";
      document.getElementById("arogyabot-fab").style.transform = "none";
    },
    async send(text) {
      if (!text || !text.trim()) return;
      if (messageCount === 0) document.getElementById("arogyabot-suggestions").style.display = "none";
      messageCount++;
      appendMsg(text, "user");
      
      const list = document.getElementById("arogyabot-messages");
      const typing = document.createElement("div");
      typing.id = "arogyabot-typing";
      typing.className = "arogyabot-msg bot";
      typing.innerHTML = `<div class="arogyabot-bubble" style="padding:10px 18px;"><div class="arogyabot-dot-pulse"><span></span><span></span><span></span></div></div>`;
      list.appendChild(typing);
      list.scrollTop = list.scrollHeight;

      try {
        const res = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            message: text,
            session_id: SESSION_ID,
            patient_context: (typeof aiDataPayload !== 'undefined') ? JSON.stringify(aiDataPayload) : "",
          }),
        });
        const data = await res.json();
        typing.remove();
        appendMsg(data.reply || "Engine timeout.", "bot");
      } catch (err) {
        typing.remove();
        appendMsg("⚠ Check AI Server.", "bot");
      }
    },
    sendFromInput() {
      const input = document.getElementById("arogyabot-input");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      input.style.height = "auto";
      this.send(text);
    },
    handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.sendFromInput(); } },
    autoResize(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; },
    async clearChat() {
      try { await fetch(`http://localhost:5000/api/chat/${SESSION_ID}`, { method: "DELETE" }); } catch (_) {}
      document.getElementById("arogyabot-messages").innerHTML = "";
      messageCount = 0;
      document.getElementById("arogyabot-suggestions").style.display = "flex";
      appendMsg("Context reset.", "bot");
    }
  };

  if (!isEmbedded) setTimeout(() => { if (!isOpen) document.getElementById("arogyabot-unread").style.display = "flex"; }, 5000);
})();
