/* ==========================================================================
   NEON-100 SYSTEMS PACK v1.0  •  Cyber-Meow 2077 — Flying Drift
   ตำแหน่งติดตั้ง: ภายใน async function init() ท้ายสุด ก่อนบรรทัด
   requestAnimationFrame(frame);  (ต้องเห็นตัวแปร game / scene / camera / state)
   ห้ามวางนอก init() เพราะจะเข้าถึงตัวแปรของเกมไม่ได้
   ========================================================================== */
(() => {
  if (window.__NEON100__) return;
  window.__NEON100__ = true;

  /* ───────── 0) CONFIG ───────── */
  const SAVE_KEY = "cyber-meow-2077-neon100-v1";
  const KEYMAP = {
    panel: "Backquote", help: "Backslash", cinema: "BracketRight", graph: "BracketLeft",
    emp: "Digit1", guard: "Digit2", shield: "Digit3", burst: "Digit4", frenzy: "Digit5",
    warp: "Digit6", ghost: "Digit7", magnet: "Digit8", nitro: "Digit9"
  };
  const MAX_CHARGE = 100, MAX_LV = 50;
  const DEFAULT_OFF = [24, 28, 69, 87, 99];

  const CATS = ["ความก้าวหน้า", "คะแนน & คอมโบ", "การขับขี่", "สกิลกดใช้", "เศรษฐกิจ",
    "ภารกิจ & ชาเลนจ์", "โลก & บรรยากาศ", "กล้อง & เอฟเฟกต์จอ", "เสียง & ฟีดแบ็ก", "อำนวยความสะดวก"];
  const NAMES = [
    "XP & เลเวล", "Prestige (รีเซ็ตรับโบนัสถาวร)", "โบนัสล็อกอินรายวัน", "ระบบ Achievement", "สถิติตลอดชีพ",
    "กระเป๋า Neon Credits", "Skill Points & เพิร์ค", "ฉายาตามเลเวล", "ประวัติ 10 รอบล่าสุด", "รางวัลระยะสะสมทุก 10k",
    "Combo Multiplier", "คะแนนลอยฟ้า (Airtime)", "Drift Chain", "Speed Streak", "โบนัสเวลาบิน",
    "โบนัสราง Magnet", "No-Hit Streak", "ตัวเลขคะแนนลอย", "สถิติคะแนนสูงสุด", "เกรดจบรอบ S–D",
    "Perfect Launch", "ชาร์จบูสต์ฟื้นฟูเอง", "Boost Efficiency", "Overheat บูสต์ (โหมดท้าทาย)", "Slipstream Window",
    "Perfect Drift +ชาร์จ", "Sky-High โบนัสบินสูง", "Speed Limiter (Comfort)", "Emergency Shield ชีวิตสุดท้าย", "Lucky Cat ชุบชีวิต",
    "EMP Pulse [1]", "Nine-Lives Guard [2]", "Shield Overcharge [3]", "Coin Burst [4]", "Score Frenzy x2 [5]",
    "Warp Dash [6]", "Ghost Mode [7]", "Coin Magnet [8]", "Nitro Canister [9]", "แถบคูลดาวน์สกิล",
    "ร้านอัปเกรด", "อัปเกรด: Boost Efficiency", "อัปเกรด: พลังโล่", "อัปเกรด: ตัวคูณเหรียญ", "ธนาคาร & ดอกเบี้ย",
    "กล่องเสบียงรายวัน", "Bounty Contracts", "แปลงเหรียญเป็นเครดิต", "โบนัสสุดสัปดาห์ x1.5", "ประวัติธุรกรรม",
    "Daily Challenges", "Weekly Challenge", "เป้าหมายประจำรอบ", "Checkpoint ทุก 1,000", "Milestone ทุก 5,000",
    "Ghost Split เทียบสถิติ", "Survival Tier", "Pure Driver (ไม่ใช้บูสต์)", "Coin Hunt", "Run Streak",
    "วงจรกลางวัน/กลางคืน", "หิ่งห้อยนีออน", "ป้ายโฮโลแกรม", "แสงออโรร่า", "ดาวตก",
    "โดรนลาดตระเวน", "ไฟสปอตไลต์", "Speed Lines", "หิมะนีออน", "ฟ้าแลบ",
    "กล้องสั่นเมื่อชน", "FOV Kick ตอนบูสต์", "Chromatic Edge", "Vignette ตามความเร็ว", "Cinematic Letterbox []]",
    "กล้องเอียงตอนดริฟต์", "แฟลชแดงเมื่อชน", "แฟลชทองเมื่อเลเวลอัป", "ขอบเรืองแสงตามคอมโบ", "ชีพจรเตือนชีวิตต่ำ",
    "เสียงเอฟเฟกต์สังเคราะห์", "เสียงติ๊กคอมโบ", "เสียงเตือนชีวิตต่ำ", "เสียง Achievement", "สั่น (มือถือ)",
    "สั่นจอยเกม", "ผู้บรรยายเสียง (TTS)", "Event Feed", "คิวแจ้งเตือน", "สรุปผลจบรอบ",
    "แผงควบคุมระบบ [`]", "Auto-Save", "Export/Import เซฟ", "Performance Guard", "เตือนพักสายตา 45 นาที",
    "กราฟความเร็ว [[]", "มาตรระยะสะสม", "หน้าช่วยเหลือ [\\]", "Debug Monitor", "ซ่อน HUD นอกการแข่ง"
  ];

  /* ───────── 1) SAVE ───────── */
  const DEF = () => ({
    v: 1, xp: 0, level: 1, prestige: 0, credits: 0, skillPts: 0,
    skills: { xp: 0, combo: 0, cool: 0, score: 0 },
    upg: { charge: 0, shield: 0, coin: 0, regen: 0, luck: 0 },
    ach: {}, enabled: {}, log: [], history: [],
    stats: { runs: 0, dist: 0, coins: 0, drift: 0, air: 0, flight: 0, rail: 0, hits: 0, boostT: 0,
      topSpeed: 0, playT: 0, bestScore: 0, bestDist: 0, maxCombo: 1, abilities: 0, revives: 0 },
    daily: { date: "", streak: 0, last: "", crate: "", ch: [] },
    weekly: { week: "", dist: 0, done: false },
    bank: 0, best: { splits: [] }, distReward: 0, runStreak: 0
  });
  const merge = (a, b) => {
    for (const k in b) {
      const x = a[k], y = b[k];
      if (y && typeof y === "object" && !Array.isArray(y) && x && typeof x === "object" && !Array.isArray(x)) merge(x, y);
      else a[k] = y;
    }
    return a;
  };
  let S = DEF();
  try { const raw = localStorage.getItem(SAVE_KEY); if (raw) S = merge(DEF(), JSON.parse(raw)); } catch {}
  DEFAULT_OFF.forEach(id => { if (!(id in S.enabled)) S.enabled[id] = false; });
  const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch {} };

  /* ───────── 2) UTILS ───────── */
  const on = id => S.enabled[id] !== false;
  const $id = id => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = n => Math.floor(n || 0).toLocaleString();
  const dkey = d => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  const weekKey = () => {
    const d = new Date(), t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return t.getUTCFullYear() + "-W" + Math.ceil(((t - y) / 864e5 + 1) / 7);
  };
  const isWeekend = () => [0, 6].includes(new Date().getDay());
  const seeded = str => {
    let h = 2166136261 >>> 0;
    for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    return () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return (h % 100000) / 100000; };
  };
  const NX = { hudT: 0, hist: [], graph: true, cinema: false, lowPerf: false, lowT: 0, hiT: 0,
    starNext: 6, starLife: 0, starV: new THREE.Vector3(), boltNext: 30, bolt: 0,
    session: 0, breakNext: 2700, saveT: 0, flashV: 0, fxCache: {}, bq: [], bT: 0, lbH: "" };
  let R = null;
  const CD = {};

  /* ───────── 3) CSS + DOM ───────── */
  const css = document.createElement("style");
  css.textContent = `
#nx-root{position:fixed;inset:0;pointer-events:none;z-index:9000;font-family:system-ui,sans-serif;color:#eaffff}
#nx-fx>div{position:absolute;inset:0;opacity:0;transition:opacity .15s}
#nx-speedlines{background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,0) 0deg 3deg,rgba(160,240,255,.2) 3deg 3.6deg);-webkit-mask:radial-gradient(circle,transparent 32%,#000 75%);mask:radial-gradient(circle,transparent 32%,#000 75%)}
#nx-vignette{background:radial-gradient(ellipse at center,transparent 50%,rgba(10,0,30,.85) 100%)}
#nx-chroma{box-shadow:inset 14px 0 40px rgba(255,0,180,.55),inset -14px 0 40px rgba(0,240,255,.55)}
#nx-glow{box-shadow:inset 0 0 70px var(--nxg,#0ff)}
#nx-pulse{box-shadow:inset 0 0 130px rgba(255,0,40,.85)}
#nx-flash{background:#fff}
#nx-fx .nx-lb{opacity:1;background:#000;height:0;inset:auto 0;transition:height .4s}
#nx-fx #nx-lb-top{top:0} #nx-fx #nx-lb-bot{bottom:0}
#nx-card{position:absolute;left:12px;top:34%;width:190px;padding:8px 10px;border-radius:12px;background:rgba(12,4,30,.55);border:1px solid rgba(0,255,255,.35);backdrop-filter:blur(4px);font-size:12px}
.nx-row{display:flex;justify-content:space-between;align-items:center;gap:6px;margin:2px 0}
.nx-row.big{font-size:14px}
.nx-bar{height:6px;background:rgba(255,255,255,.12);border-radius:4px;overflow:hidden;margin:3px 0}
.nx-bar.thin{height:3px}
.nx-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#0ff,#f0f)}
.nx-bar.hot i{background:linear-gradient(90deg,#ffb000,#ff2040)}
#nx-combo{color:#ff6bff;text-shadow:0 0 8px #f0f}
#nx-obj,#nx-bounty{font-size:11px;opacity:.92;margin-top:4px;line-height:1.35}
#nx-bounty{color:#ffd166}
#nx-graph{display:block;margin-top:4px;width:100%;height:32px}
#nx-abil{position:absolute;right:12px;top:30%;display:grid;grid-template-columns:repeat(3,54px);gap:6px;pointer-events:auto}
.nx-ab{position:relative;height:54px;border-radius:10px;border:1px solid rgba(0,255,255,.5);background:rgba(12,4,30,.6);color:#fff;font-size:10px;cursor:pointer;overflow:hidden;padding:0}
.nx-ab b{display:block;font-size:17px}
.nx-ab .cd{position:absolute;left:0;right:0;bottom:0;background:rgba(255,0,140,.45);height:0;pointer-events:none}
.nx-ab.off{opacity:.25}
#nx-feed{position:absolute;right:12px;top:calc(30% + 190px);width:220px;font-size:11px;text-align:right}
#nx-feed div{background:rgba(12,4,30,.55);margin:2px 0;padding:2px 6px;border-radius:6px;animation:nxf 4s forwards}
@keyframes nxf{0%{opacity:0;transform:translateX(20px)}10%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0}}
#nx-banner{position:absolute;left:50%;top:16%;transform:translateX(-50%) scale(.9);padding:8px 18px;border-radius:12px;background:rgba(20,0,40,.8);border:1px solid #f0f;font-weight:800;letter-spacing:.05em;opacity:0;transition:.25s;white-space:nowrap}
#nx-banner.show{opacity:1;transform:translateX(-50%) scale(1)}
#nx-pops{position:absolute;inset:0}
#nx-pops span{position:absolute;font-weight:900;color:#fff;animation:nxp 1.2s ease-out forwards;white-space:nowrap}
@keyframes nxp{from{opacity:1;transform:translate(-50%,0) scale(1.2)}to{opacity:0;transform:translate(-50%,-70px) scale(.9)}}
#nx-debug{position:absolute;left:12px;bottom:12px;margin:0;font-size:10px;background:rgba(0,0,0,.65);padding:6px;border-radius:8px;display:none;max-width:260px;white-space:pre-wrap}
.nx-modal{position:fixed;inset:5% 8%;background:rgba(10,2,26,.95);border:1px solid #0ff;border-radius:16px;padding:16px;overflow:auto;pointer-events:auto;display:none;z-index:9500;font-size:13px}
.nx-modal.show{display:block}
.nx-modal h2{margin:0 0 8px;color:#0ff}
.nx-modal h3{margin:12px 0 6px;color:#ff6bff}
.nx-tabs button,.nx-btn{background:#1b0b3a;color:#eaffff;border:1px solid #0ff7;border-radius:8px;padding:5px 10px;margin:2px;cursor:pointer}
.nx-btn:disabled{opacity:.35;cursor:not-allowed}
.nx-tabs button.act{background:#0ff;color:#000}
.nx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px}
.nx-grid label{display:flex;gap:6px;align-items:center;justify-content:space-between;background:#ffffff0d;padding:4px 6px;border-radius:6px}
.nx-close{float:right}
#nx-root.hidden #nx-hud{display:none}`;
  document.head.appendChild(css);

  const root = document.createElement("div");
  root.id = "nx-root";
  root.innerHTML = `
<div id="nx-fx"><div id="nx-speedlines"></div><div id="nx-vignette"></div><div id="nx-chroma"></div>
<div id="nx-glow"></div><div id="nx-pulse"></div><div id="nx-flash"></div>
<div id="nx-lb-top" class="nx-lb"></div><div id="nx-lb-bot" class="nx-lb"></div></div>
<div id="nx-hud">
  <div id="nx-card">
    <div class="nx-row"><b id="nx-lv"></b><span id="nx-title"></span></div>
    <div class="nx-bar"><i id="nx-xp"></i></div>
    <div class="nx-row"><span>💳 <b id="nx-cr">0</b></span><span id="nx-odo"></span></div>
    <div class="nx-row big"><span>STYLE <b id="nx-sc">0</b></span><b id="nx-combo"></b></div>
    <div class="nx-bar thin"><i id="nx-ct"></i></div>
    <div id="nx-heat" class="nx-bar thin hot"><i></i></div>
    <div id="nx-obj"></div><div id="nx-bounty"></div>
    <canvas id="nx-graph" width="160" height="40"></canvas>
  </div>
  <div id="nx-abil"></div><div id="nx-feed"></div><div id="nx-banner"></div>
  <div id="nx-pops"></div><pre id="nx-debug"></pre>
</div>
<div id="nx-panel" class="nx-modal"></div>
<div id="nx-summary" class="nx-modal"></div>
<div id="nx-help" class="nx-modal"></div>`;
  document.body.appendChild(root);

  /* ───────── 4) FEEDBACK (#18 #81-89) ───────── */
  let AC = null;
  const ensureAC = () => {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch {} }
    if (AC && AC.state === "suspended") AC.resume();
  };
  addEventListener("pointerdown", ensureAC);
  addEventListener("keydown", ensureAC);
  function tone(f = 440, d = .12, type = "square", v = .05, slide = 0, delay = 0) {
    if (!on(81) || !AC) return;
    const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02);
  }
  const chime = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, "triangle", .06, 0, i * .08));
  const buzz = p => { if (on(85) && navigator.vibrate) try { navigator.vibrate(p); } catch {} };
  const rumble = (ms = 200, s = .6, w = .3) => {
    if (!on(86)) return;
    for (const gp of (navigator.getGamepads?.() || []))
      gp?.vibrationActuator?.playEffect?.("dual-rumble", { duration: ms, strongMagnitude: s, weakMagnitude: w })?.catch?.(() => {});
  };
  const say = txt => {
    if (!on(87) || !window.speechSynthesis) return;
    try { const u = new SpeechSynthesisUtterance(txt); u.rate = 1.1; u.pitch = 1.2; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch {}
  };
  function showBanner(msg, color) {
    const b = $id("nx-banner"); b.textContent = msg; b.style.borderColor = color; b.style.color = color;
    b.classList.add("show"); NX.bT = 1.6;
  }
  function banner(msg, color = "#ff3df2") {
    if (on(89)) { if (NX.bq.length < 6) NX.bq.push([msg, color]); } else showBanner(msg, color);
  }
  function feed(msg) {
    if (!on(88)) return;
    const f = $id("nx-feed"), d = document.createElement("div");
    d.textContent = msg; f.prepend(d);
    while (f.children.length > 6) f.lastChild.remove();
    setTimeout(() => d.remove(), 4000);
  }
  function pop(text, color = "#00f0ff") {
    if (!on(18)) return;
    const s = document.createElement("span");
    s.textContent = text; s.style.left = (42 + Math.random() * 16) + "%"; s.style.top = (52 + Math.random() * 10) + "%";
    s.style.textShadow = `0 0 10px ${color},0 0 2px #000`;
    const box = $id("nx-pops");
    while (box.children.length >= 12) box.firstChild.remove();   // hard cap
    box.appendChild(s); setTimeout(() => s.remove(), 1200);
  }
  function flash(color, str) { $id("nx-flash").style.background = color; NX.flashV = Math.max(NX.flashV, str); }

  /* ───────── 5) PROGRESSION (#1-10) ───────── */
  const need = l => Math.floor(120 * Math.pow(l, 1.4));
  const TITLES = [[1, "Kitten"], [3, "Alley Cat"], [6, "Street Purr-er"], [10, "Neon Prowler"], [15, "Drift Tomcat"],
    [22, "Chrome Tiger"], [30, "Cyber Lion"], [40, "Night-City Panther"], [50, "Legend of 2077"]];
  const title = () => { let t = TITLES[0][1]; for (const [l, n] of TITLES) if (S.level >= l) t = n; return (S.prestige ? `P${S.prestige} ` : "") + t; };
  function ledger(n, why) {
    if (!on(50)) return;
    S.log.unshift(`${new Date().toLocaleTimeString()}  ${n >= 0 ? "+" : ""}${Math.round(n)}  ${why}`);
    S.log.length = Math.min(S.log.length, 40);
  }
  function addCredits(n, why) {
    if (!on(6) || !n) return;
    if (on(49) && isWeekend() && n > 0) n *= 1.5;
    n = Math.round(n); S.credits += n; ledger(n, why);
    if (R) R.credits += n;
  }
  function addXP(n) {
    if (!on(1) || n <= 0) return;
    n *= (1 + S.prestige * .1) * (1 + S.skills.xp * .05);
    S.xp += n; if (R) R.xp += n;
    while (S.level < MAX_LV && S.xp >= need(S.level)) {
      S.xp -= need(S.level); S.level++;
      if (on(7)) S.skillPts++;
      addCredits(50 * S.level, "Level up");
      banner(`⭐ LEVEL UP! LV ${S.level}`, "#ffd166");
      feed(`⭐ เลเวล ${S.level} — ${title()}`);
      if (on(78)) flash("#ffd166", .6);
      [660, 880, 1320].forEach((f, i) => tone(f, .15, "triangle", .06, 0, i * .07));
      say(`Level ${S.level}`);
    }
    if (S.level >= MAX_LV) S.xp = Math.min(S.xp, need(MAX_LV));
  }
  const ACH = [
    ["first", "ก้าวแรกแห่งนีออน", "ลงแข่งครั้งแรก", () => S.stats.runs >= 1],
    ["runs10", "ขาประจำ", "ลงแข่ง 10 รอบ", () => S.stats.runs >= 10],
    ["runs50", "แมวไม่หลับ", "ลงแข่ง 50 รอบ", () => S.stats.runs >= 50],
    ["d10k", "นักเดินทาง", "ระยะสะสม 10,000", () => S.stats.dist >= 1e4],
    ["d100k", "ข้ามเมือง", "ระยะสะสม 100,000", () => S.stats.dist >= 1e5],
    ["c100", "กระปุกแมว", "เหรียญสะสม 100", () => S.stats.coins >= 100],
    ["c1000", "เศรษฐีนีออน", "เหรียญสะสม 1,000", () => S.stats.coins >= 1000],
    ["dr60", "ราชาดริฟต์", "ดริฟต์สะสม 60 วิ", () => S.stats.drift >= 60],
    ["dr600", "ยางไหม้", "ดริฟต์สะสม 600 วิ", () => S.stats.drift >= 600],
    ["air30", "แมวบินได้", "ลอยฟ้าสะสม 30 วิ", () => S.stats.air >= 30],
    ["fly300", "นักบินฟ้า", "บินสะสม 300 วิ", () => S.stats.flight >= 300],
    ["lv5", "มือใหม่ไฟแรง", "ถึงเลเวล 5", () => S.level >= 5],
    ["lv20", "มือโปร", "ถึงเลเวล 20", () => S.level >= 20],
    ["lv50", "ตำนาน", "ถึงเลเวล 50", () => S.level >= 50],
    ["pres", "เกิดใหม่", "Prestige ครั้งแรก", () => S.prestige >= 1],
    ["cx5", "คอมโบมาสเตอร์", "คอมโบ x5", () => S.stats.maxCombo >= 5],
    ["cx8", "คอมโบเทพ", "คอมโบ x8", () => S.stats.maxCombo >= 8],
    ["s50k", "สไตล์จัดเต็ม", "Style 50,000 ในรอบเดียว", () => S.stats.bestScore >= 5e4],
    ["nohit", "ไร้รอยขีดข่วน", "ไม่ชนติดต่อกัน 120 วิ", () => R && R.noHitMax >= 120],
    ["abil50", "นักใช้สกิล", "ใช้สกิล 50 ครั้ง", () => S.stats.abilities >= 50],
    ["rev", "เก้าชีวิตของจริง", "Lucky Cat ชุบชีวิต", () => S.stats.revives >= 1],
    ["rich", "กระเป๋าหนัก", "มี 10,000 เครดิต", () => S.credits >= 1e4]
  ];
  function checkAch() {
    if (!on(4)) return;
    for (const [k, n, d, f] of ACH) {
      if (S.ach[k] || !f()) continue;
      S.ach[k] = Date.now();
      banner(`🏆 ${n}`, "#7CFFB2"); feed(`🏆 ${n} — ${d}`);
      if (on(84)) chime();
      addCredits(150, "Achievement"); addXP(100);
    }
  }

  /* ───────── 6) MISSIONS (#51-60) ───────── */
  const DPOOL = [
    { k: "dist", n: "วิ่งสะสม {g}", g: [5000, 10000, 20000] },
    { k: "drift", n: "ดริฟต์สะสม {g} วิ", g: [20, 40, 80] },
    { k: "coins", n: "เก็บเหรียญ {g}", g: [30, 60, 120] },
    { k: "air", n: "ลอยฟ้าสะสม {g} วิ", g: [5, 12, 25] },
    { k: "flight", n: "บินสะสม {g} วิ", g: [30, 60, 120] },
    { k: "combo", n: "ทำคอมโบถึง x{g}", g: [3, 4, 6], max: true },
    { k: "score", n: "Style {g} ในรอบเดียว", g: [10000, 25000, 50000], max: true },
    { k: "runs", n: "ลงแข่ง {g} รอบ", g: [3, 5, 8] }
  ];
  const OPOOL = [["dist", "วิ่ง 3,000", 3000], ["drift", "ดริฟต์ 10 วิ", 10], ["coins", "เก็บ 15 เหรียญ", 15],
    ["air", "ลอยฟ้า 3 วิ", 3], ["combo", "คอมโบ x3", 3], ["nohit", "ไม่ชน 60 วิ", 60],
    ["abil", "ใช้สกิล 3 ครั้ง", 3], ["flight", "บิน 20 วิ", 20]];
  const BPOOL = [{ k: "drift", n: "ดริฟต์ 4 วิ", g: 4 }, { k: "air", n: "ลอยฟ้า 1.5 วิ", g: 1.5 },
    { k: "coins", n: "เก็บ 8 เหรียญ", g: 8 }, { k: "streak", n: "ความเร็วสูง 5 วิ", g: 5 },
    { k: "abil", n: "ใช้สกิล 2 ครั้ง", g: 2 }];
  function genDaily() {
    const d = dkey(new Date());
    if (S.daily.date === d && S.daily.ch.length) return;
    const rnd = seeded("neon" + d), pool = DPOOL.slice(), ch = [];
    while (ch.length < 3 && pool.length) {
      const p = pool.splice(Math.floor(rnd() * pool.length), 1)[0];
      const g = p.g[Math.floor(rnd() * p.g.length)];
      ch.push({ k: p.k, n: p.n.replace("{g}", fmt(g)), g, p: 0, done: false, max: !!p.max });
    }
    S.daily.date = d; S.daily.ch = ch;
  }
  function weeklyReset() { const w = weekKey(); if (S.weekly.week !== w) S.weekly = { week: w, dist: 0, done: false }; }
  function dprog(k, v) {
    if (!on(51)) return;
    for (const c of S.daily.ch) {
      if (c.done || c.k !== k) continue;
      c.p = c.max ? Math.max(c.p, v) : c.p + v;
      if (c.p >= c.g) { c.done = true; banner(`✅ Daily: ${c.n}`, "#7CFFB2"); feed("✅ ภารกิจรายวันสำเร็จ +300"); addCredits(300, "Daily"); addXP(250); }
    }
  }
  const rv = k => !R ? 0 : ({ dist: R.dist, drift: R.driftTot + R.driftCur, coins: R.coinsGot, air: R.airTot,
    combo: R.maxCombo, nohit: R.noHitMax, abil: R.abil, flight: R.flight, streak: R.streakTot })[k] || 0;
  const pickObjs = () => OPOOL.slice().sort(() => Math.random() - .5).slice(0, 3).map(([k, n, g]) => ({ k, n, g, done: false }));

  /* ───────── 7) SCORE & COMBO (#11-20) ───────── */
  function bump(a) {
    if (!on(11) || !R) return;
    R.combo = Math.min(8, R.combo + a);
    R.comboT = 2.5 + S.skills.combo * .3;
    R.maxCombo = Math.max(R.maxCombo, R.combo);
    S.stats.maxCombo = Math.max(S.stats.maxCombo, R.combo);
    dprog("combo", R.combo);
    const step = Math.floor(R.combo * 2);
    if (step > R.comboStep) { R.comboStep = step; if (on(82)) tone(260 + R.combo * 80, .06, "square", .03); }
  }
  function addScore(base, label, color) {
    if (!R) return;
    const m = (on(11) ? R.combo : 1) * (R.frenzy > 0 ? 2 : 1) * (1 + S.prestige * .05) * (1 + S.skills.score * .04);
    R.score += base * m;
    if (label) pop(`${label} ×${m.toFixed(1)}`, color);
  }
  const grade = s => s >= 60000 ? "S" : s >= 30000 ? "A" : s >= 12000 ? "B" : s >= 4000 ? "C" : "D";

  /* ───────── 8) ABILITIES (#31-40) ───────── */
  const inv = t => { game.invincible = Math.max(game.invincible || 0, t); };
  const ABIL = [
    { id: 31, key: "emp", icon: "⚡", n: "EMP", cd: 25, use() { inv(1.5); NX.empT = .7; } },
    { id: 32, key: "guard", icon: "🐾", n: "Guard", cd: 60, use() { R.guard = 1; } },
    { id: 33, key: "shield", icon: "🛡", n: "Shield", cd: 40, use() { game.shield = Math.max(game.shield || 0, 5 + S.upg.shield * 1.5); } },
    { id: 34, key: "burst", icon: "🪙", n: "Burst", cd: 45, use() { game.coins = (game.coins || 0) + 10 + Math.floor(S.level / 2); } },
    { id: 35, key: "frenzy", icon: "✖2", n: "Frenzy", cd: 60, use() { R.frenzy = 10; } },
    { id: 36, key: "warp", icon: "🌀", n: "Warp", cd: 30, use() { game.distance = (game.distance || 0) + 40; inv(1); } },
    { id: 37, key: "ghost", icon: "👻", n: "Ghost", cd: 50, use() { R.ghost = 4; inv(4); } },
    { id: 38, key: "magnet", icon: "🧲", n: "Magnet", cd: 40, use() { R.magnet = 8; } },
    { id: 39, key: "nitro", icon: "🔥", n: "Nitro", cd: 45, use() { game.charge = MAX_CHARGE; } }
  ];
  function useAbility(a) {
    if (!a || !on(a.id) || state !== "race" || !R || R.ended) return;
    if (CD[a.key] > 0) { pop(`${a.n} ${Math.ceil(CD[a.key])}s`, "#888"); return; }
    a.use();
    CD[a.key] = a.cd * (1 - S.skills.cool * .04);
    R.abil++; S.stats.abilities++;
    addScore(100, `${a.icon} ${a.n}`, "#00f0ff");
    tone(500, .15, "square", .05, 500); rumble(120, .3, .6);
    feed(`${a.icon} ใช้ ${a.n}`);
  }
  let ghostMats = null;
  function setGhost(v) {
    const grp = typeof player !== "undefined" ? player?.group : null;
    if (v && !ghostMats && grp) {
      ghostMats = [];
      grp.traverse(o => {
        if (!o.material) return;
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
          ghostMats.push([m, m.transparent, m.opacity]);
          m.transparent = true; m.opacity = Math.min(m.opacity, .35); m.needsUpdate = true;
        });
      });
    } else if (!v && ghostMats) {
      ghostMats.forEach(([m, t, o]) => { m.transparent = t; m.opacity = o; m.needsUpdate = true; });
      ghostMats = null;
    }
  }

  /* ───────── 9) 3D WORLD FX (#61-70 + EMP) ───────── */
  const ADD = THREE.AdditiveBlending;
  const rig = new THREE.Group(); rig.name = "nx-rig"; scene.add(rig);
  const hemi = new THREE.HemisphereLight(0x9b6bff, 0x001a24, 0); scene.add(hemi);
  function pts(n, size, color, fill) {
    const g = new THREE.BufferGeometry(), a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) fill(a, i * 3);
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ size, color, transparent: true, opacity: .9, depthWrite: false, blending: ADD, fog: false }));
    p.frustumCulled = false; rig.add(p); return p;
  }
  const ff = pts(140, .35, 0xfff07a, (a, i) => { a[i] = (Math.random() - .5) * 60; a[i + 1] = -2 + Math.random() * 14; a[i + 2] = -120 + Math.random() * 130; });
  const snow = pts(420, .25, 0xbfefff, (a, i) => { a[i] = (Math.random() - .5) * 80; a[i + 1] = Math.random() * 30; a[i + 2] = -150 + Math.random() * 160; });

  function textSprite(txt, color) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 96;
    const x = c.getContext("2d");
    if (x) {   // no 2D canvas (very old / locked-down browsers): leave the sprite blank
      x.font = "bold 60px system-ui,sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
      x.shadowColor = color; x.shadowBlur = 18; x.fillStyle = color; x.fillText(txt, 128, 50);
      x.strokeStyle = color; x.lineWidth = 3; x.strokeRect(6, 6, 244, 84);
    }
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: ADD, fog: false }));
    s.scale.set(12, 4.5, 1); return s;
  }
  function respawnHolo(s, init) {
    const side = Math.random() < .5 ? -1 : 1;
    s.position.set(side * (16 + Math.random() * 18), 3 + Math.random() * 12, init ? -30 - Math.random() * 220 : -230 - Math.random() * 40);
  }
  const holo = ["MEOW", "2077", "NEON", "PURR", "NIP", "DRIFT"].map((t, i) => {
    const s = textSprite(t, ["#ff3df2", "#00f0ff", "#ffd166", "#7CFFB2", "#ff6b6b", "#9b8cff"][i]);
    respawnHolo(s, true); rig.add(s); return s;
  });

  const ac = document.createElement("canvas"); ac.width = 512; ac.height = 128;
  const ax = ac.getContext("2d");
  if (ax) {
    const gr = ax.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(.5, "rgba(255,255,255,.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    ax.fillStyle = gr; ax.fillRect(0, 0, 512, 128); ax.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 60; i++) { ax.fillStyle = `rgba(0,0,0,${Math.random() * .6})`; ax.fillRect(Math.random() * 512, 0, 2 + Math.random() * 10, 128); }
  }
  const aur = new THREE.Mesh(new THREE.PlaneGeometry(700, 110), new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(ac), transparent: true, opacity: .3, depthWrite: false, blending: ADD, side: THREE.DoubleSide, fog: false }));
  aur.position.set(0, 90, -400); rig.add(aur);

  const star = new THREE.Mesh(new THREE.BoxGeometry(.25, .25, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, blending: ADD, fog: false }));
  star.visible = false; rig.add(star);
  const ZAXIS = new THREE.Vector3(0, 0, 1);

  const dGeo = new THREE.BoxGeometry(1.4, .35, 1.4);
  function respawnDrone(d, init) {
    const s = Math.random() < .5 ? -1 : 1;
    d.position.set(s * (6 + Math.random() * 22), 0, init ? -40 - Math.random() * 220 : -260 - Math.random() * 40);
    d.userData.y = 6 + Math.random() * 14;
  }
  const drones = Array.from({ length: 8 }, () => {
    const d = new THREE.Mesh(dGeo, new THREE.MeshBasicMaterial({ color: 0xff00ff, fog: false }));
    respawnDrone(d, true); rig.add(d); return d;
  });

  const beamGeo = new THREE.ConeGeometry(14, 150, 24, 1, true);
  beamGeo.rotateX(Math.PI); beamGeo.translate(0, 75, 0);
  const beams = [0x00f0ff, 0xff3df2].map((c, i) => {
    const m = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .07, depthWrite: false, blending: ADD, side: THREE.DoubleSide, fog: false }));
    m.position.set(i ? 70 : -70, -4, -210); rig.add(m); return m;
  });

  const emp = new THREE.Mesh(new THREE.RingGeometry(.8, 1.2, 48), new THREE.MeshBasicMaterial({
    color: 0x00f0ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: ADD }));
  emp.rotation.x = -Math.PI / 2; emp.visible = false; scene.add(emp);
  NX.empT = 0;

  const _f = new THREE.Vector3();
  function world(dt, t) {
    const racing = state === "race" && R && !R.ended;
    rig.visible = !!racing;
    hemi.intensity = racing && on(61) ? .06 + .28 * (.5 + .5 * Math.sin(t * 2 * Math.PI / 150)) : 0;
    if (on(61)) hemi.color.setHSL(.72 + .12 * Math.sin(t * .05), .7, .6);
    if (NX.empT > 0) {
      NX.empT -= dt; const p = 1 - NX.empT / .7; emp.visible = true;
      const grp = typeof player !== "undefined" ? player?.group : null;
      if (grp) grp.getWorldPosition(emp.position);
      emp.position.y += .3; emp.scale.setScalar(1 + p * 18); emp.material.opacity = (1 - p) * .9;
    } else emp.visible = false;
    if (!racing) return;

    camera.getWorldDirection(_f); _f.y = 0;
    if (_f.lengthSq() < 1e-6) _f.set(0, 0, -1);
    _f.normalize();
    rig.position.set(camera.position.x, camera.position.y - 4, camera.position.z);
    rig.rotation.set(0, Math.atan2(-_f.x, -_f.z), 0);
    const mv = (10 + R.sn * 150) * dt, lp = NX.lowPerf;

    ff.visible = on(62) && !lp;
    if (ff.visible) {
      const a = ff.geometry.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) {
        a[i + 2] += mv * .9; a[i] += Math.sin(t * 2 + i) * .02; a[i + 1] += Math.cos(t * 1.7 + i) * .015;
        if (a[i + 2] > 10) { a[i + 2] = -120; a[i] = (Math.random() - .5) * 60; a[i + 1] = -2 + Math.random() * 14; }
      }
      ff.geometry.attributes.position.needsUpdate = true;
    }
    holo.forEach(s => {
      s.visible = on(63) && !lp; s.position.z += mv;
      if (s.position.z > 15) respawnHolo(s, false);
      s.material.opacity = Math.random() < .02 ? .25 : .9;
    });
    aur.visible = on(64) && !lp;
    if (aur.visible) { aur.material.color.setHSL((t * .015) % 1, .85, .6); aur.material.opacity = .22 + .1 * Math.sin(t * .7); }

    star.visible = false;
    if (on(65)) {
      NX.starNext -= dt;
      if (NX.starNext <= 0 && NX.starLife <= 0) {
        NX.starLife = 1.1; NX.starNext = 5 + Math.random() * 10;
        star.position.set(-150 + Math.random() * 300, 60 + Math.random() * 40, -260 + Math.random() * 80);
        NX.starV.set((Math.random() < .5 ? -1 : 1) * 110, -35, 50);
        star.quaternion.setFromUnitVectors(ZAXIS, NX.starV.clone().normalize());
      }
      if (NX.starLife > 0) {
        NX.starLife -= dt; star.visible = true;
        star.position.addScaledVector(NX.starV, dt); star.material.opacity = clamp(NX.starLife, 0, 1);
      }
    }
    drones.forEach((d, i) => {
      d.visible = on(66) && !lp; d.position.z += mv * .6;
      d.position.y = d.userData.y + Math.sin(t * 2 + i) * .6; d.rotation.y += dt * 2;
      if (d.position.z > 15) respawnDrone(d, false);
      d.material.color.setHSL((t * .2 + i * .1) % 1, 1, Math.sin(t * 6 + i) > .6 ? .75 : .5);
    });
    beams.forEach((b, i) => {
      b.visible = on(67) && !lp;
      b.rotation.z = Math.sin(t * .45 + i * 2) * .4; b.rotation.x = -.15 + Math.sin(t * .3 + i) * .1;
    });
    snow.visible = on(69) && !lp;
    if (snow.visible) {
      const a = snow.geometry.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) {
        a[i + 1] -= dt * (2.5 + (i % 7) * .3); a[i + 2] += mv; a[i] += Math.sin(t + i) * .01;
        if (a[i + 1] < -4 || a[i + 2] > 10) { a[i] = (Math.random() - .5) * 80; a[i + 1] = 4 + Math.random() * 28; a[i + 2] = -150 + Math.random() * 40; }
      }
      snow.geometry.attributes.position.needsUpdate = true;
    }
    if (on(70)) {
      NX.boltNext -= dt;
      if (NX.boltNext <= 0) { NX.boltNext = 25 + Math.random() * 35; flash("#dfe8ff", .55); NX.bolt = .18; setTimeout(() => tone(55, .7, "sawtooth", .05, -20), 250); }
    }
    if (NX.bolt > 0) { NX.bolt -= dt; hemi.intensity += 1.2; }
  }

  /* ───────── 10) SCREEN FX (#68 #73-80) ───────── */
  function setOp(id, v) {
    v = Math.round(clamp(v, 0, 1) * 100) / 100;
    if (NX.fxCache[id] !== v) { NX.fxCache[id] = v; $id(id).style.opacity = v; }
  }
  function fx(dt, t) {
    const racing = state === "race" && R && !R.ended, sn = racing ? R.sn : 0;
    setOp("nx-speedlines", on(68) && racing ? clamp((sn - .55) * 2.4, 0, 1) * (game.boosting ? 1 : .55) : 0);
    setOp("nx-vignette", on(74) && racing ? .12 + sn * .45 : 0);
    setOp("nx-chroma", on(73) && racing && (R.frenzy > 0 || (game.boosting && sn > .8)) ? .85 : 0);
    if (on(79) && racing && R.combo >= 2) {
      setOp("nx-glow", clamp((R.combo - 1) / 6, 0, 1) * .75);
      $id("nx-glow").style.setProperty("--nxg", `hsl(${(180 + R.combo * 25) % 360} 100% 60%)`);
    } else setOp("nx-glow", 0);
    setOp("nx-pulse", on(80) && racing && game.lives <= 2 ? Math.pow(Math.max(0, Math.sin(t * 7)), 6) * .8 : 0);
    NX.flashV = Math.max(0, NX.flashV - dt * 2.2); setOp("nx-flash", NX.flashV);
    const lb = on(75) && NX.cinema ? "11vh" : "0";
    if (NX.lbH !== lb) { NX.lbH = lb; $id("nx-lb-top").style.height = lb; $id("nx-lb-bot").style.height = lb; }
  }

  /* ───────── 11) CAMERA (#71 #72 #76) ───────── */
  let camSaved = null;
  function applyCam() {
    if (state !== "race" || !R || R.ended) return;
    const shake = on(71) ? R.shake : 0;
    R.fovK += ((on(72) && game.boosting ? 1 : 0) - R.fovK) * .1;
    const roll = on(76) && game.drifting ? clamp(-(game.lateralVelocity || 0) * .02, -.12, .12) : 0;
    R.roll += (roll - R.roll) * .1;
    if (shake <= 0 && R.fovK < .01 && Math.abs(R.roll) < .001) return;
    camSaved = { p: camera.position.clone(), q: camera.quaternion.clone(), f: camera.fov };
    if (shake > 0) { camera.position.x += (Math.random() - .5) * shake * 1.2; camera.position.y += (Math.random() - .5) * shake; }
    if (R.fovK > .01) { camera.fov = camSaved.f + R.fovK * 9; camera.updateProjectionMatrix(); }
    if (Math.abs(R.roll) > .001) camera.rotateZ(R.roll);
  }
  function restoreCam() {
    if (!camSaved) return;
    camera.position.copy(camSaved.p); camera.quaternion.copy(camSaved.q);
    if (camera.fov !== camSaved.f) { camera.fov = camSaved.f; camera.updateProjectionMatrix(); }
    camSaved = null;
  }

  /* ───────── 12) RUN LIFECYCLE ───────── */
  function newRun() {
    genDaily(); weeklyReset();
    $id("nx-summary").classList.remove("show");
    R = { g: game, d0: game.distance || 0, lastD: game.distance || 0, t: 0, secT: 0, dist: 0, sn: 0, peak: 0,
      score: 0, combo: 1, comboT: 0, maxCombo: 1, comboStep: 2,
      lastCoins: game.coins || 0, coinsGot: 0, lastLives: game.lives, hits: 0,
      noHit: 0, noHitMax: 0, noHitTick: 0, airCur: 0, airTot: 0, driftCur: 0, driftTot: 0,
      streakCur: 0, streakTot: 0, streakTick: 0, flight: 0, flightTick: 0, skyTick: 0, rail: 0, railTick: 0,
      pureAcc: 0, heat: 0, slip: 0, slipNext: 10 + Math.random() * 10, slipTick: 0,
      frenzy: 0, ghost: 0, magnet: 0, magAcc: 0, guard: 0, emergency: false, launch: false,
      abil: 0, xp: 0, credits: 0, xpDist: 0, cpNext: 1000, splits: [], msNext: 5000, surv: 0,
      coinHunt: false, objs: pickObjs(), bounty: null, bountyNext: 60, bankT: 0,
      shake: 0, fovK: 0, roll: 0, beepT: 0, ended: false };
    ABIL.forEach(a => CD[a.key] = 0);
    feed("🏁 เริ่มรอบใหม่ — ขอให้สนุกนะเหมียว!");
  }
  function onHit() {
    R.hits++; S.stats.hits++; R.noHit = 0; R.combo = 1; R.comboT = 0; R.comboStep = 2;
    if (on(71)) R.shake = .45;
    if (on(77)) flash("#ff0030", .45);
    buzz([60, 40, 60]); rumble(250, .9, .5); tone(160, .25, "sawtooth", .07, -100);
    if (R.guard && game.lives > 0) {
      R.guard = 0; game.lives += 1; banner("🐾 GUARD! ป้องกันชีวิตไว้ได้", "#7CFFB2");
    } else if (on(30) && game.lives > 0 && !game.ended && Math.random() < .09 + S.upg.luck * .02) {
      game.lives += 1; S.stats.revives++; banner("🍀 LUCKY CAT! ได้ชีวิตคืน", "#7CFFB2"); say("Lucky cat");
    }
    if (on(29) && game.lives === 1 && !R.emergency) { R.emergency = true; inv(3); banner("⚠ EMERGENCY SHIELD", "#ff6b6b"); }
  }
  function tickRace(dt) {
    const g = game; R.t += dt; R.secT += dt;
    const sp = Math.abs(g.speed || 0);
    R.peak = Math.max(R.peak, sp); S.stats.topSpeed = Math.max(S.stats.topSpeed, sp);
    R.sn = clamp(sp / Math.max(S.stats.topSpeed, 1), 0, 1);

    // distance / weekly / milestone / checkpoint
    const dist = Math.max(0, (g.distance || 0) - R.d0), dd = clamp(dist - R.dist, 0, 200); R.dist = dist;
    S.stats.dist += dd; if (on(52)) S.weekly.dist += dd; dprog("dist", dd);
    R.xpDist += dd; if (R.xpDist >= 25) { addXP(Math.floor(R.xpDist / 25)); R.xpDist %= 25; }
    if (on(55) && R.dist >= R.msNext) { banner(`🎉 ${fmt(R.msNext)}!`, "#00f0ff"); addXP(100); say(`${R.msNext} meters`); R.msNext += 5000; }
    if (on(54) && R.dist >= R.cpNext) {
      const i = R.splits.length; R.splits.push(R.t);
      let msg = `CP ${i + 1} • ${R.t.toFixed(1)}s`; const b = S.best.splits[i];
      if (on(56) && b) { const d = R.t - b; msg += ` (${d <= 0 ? "−" : "+"}${Math.abs(d).toFixed(1)})`; }
      feed("🏁 " + msg); pop(msg, b && R.t <= b ? "#7CFFB2" : "#ffffff"); addScore(150); R.cpNext += 1000;
    }

    // coins & lives
    const coins = g.coins || 0;
    if (coins > R.lastCoins) { const n = coins - R.lastCoins; R.coinsGot += n; S.stats.coins += n; dprog("coins", n); addXP(2 * n); addScore(25 * n); bump(.05 * n); }
    R.lastCoins = coins;
    if (g.lives < R.lastLives) onHit(); else if (g.lives > R.lastLives) feed("💖 +1 ชีวิต");
    R.lastLives = g.lives;

    // #12 airtime
    if ((g.jumpHeight || 0) > .15 && g.mode === "ground") R.airCur += dt;
    else if (R.airCur > 0) {
      if (R.airCur > .35) {
        R.airTot += R.airCur; S.stats.air += R.airCur; dprog("air", R.airCur);
        if (on(12)) { addScore(R.airCur * 250, `AIR ${R.airCur.toFixed(1)}s`, "#9b8cff"); bump(.2); }
      }
      R.airCur = 0;
    }
    // #13 drift chain + #26 perfect drift
    if (g.drifting) R.driftCur += dt;
    else if (R.driftCur > 0) {
      const t = R.driftCur; R.driftTot += t; S.stats.drift += t; dprog("drift", t);
      if (on(13) && t > .6) { addScore(t * 180, `DRIFT ${t.toFixed(1)}s`, "#ff3df2"); bump(.15 + t * .05); }
      if (on(26) && t >= 1.2 && t <= 2.6) { g.charge = Math.min(MAX_CHARGE, (g.charge || 0) + 15); pop("PERFECT DRIFT +15⚡", "#7CFFB2"); tone(880, .1, "triangle", .05, 400); }
      R.driftCur = 0;
    }
    // #14 speed streak
    if (R.t > 8 && R.sn > .85) {
      R.streakCur += dt; R.streakTot += dt;
      if (on(14)) { R.streakTick += dt; if (R.streakTick >= 1) { R.streakTick -= 1; addScore(60); if (R.streakCur > 3) bump(.05); } }
    } else { R.streakCur = 0; R.streakTick = 0; }
    // #15 flight / #27 sky-high
    if (g.mode === "flight") {
      R.flight += dt; S.stats.flight += dt; dprog("flight", dt);
      R.flightTick += dt; if (R.flightTick >= 5) { R.flightTick -= 5; if (on(15)) addScore(300, "FLIGHT +300", "#00f0ff"); }
      if (on(27) && (g.altitude || 0) > 14) { R.skyTick += dt; if (R.skyTick >= 1) { R.skyTick -= 1; addScore(40); } }
    }
    // #16 magnet rail
    if (g.mode === "magnet") {
      R.rail += dt; S.stats.rail += dt; R.railTick += dt;
      if (R.railTick >= 5) { R.railTick -= 5; if (on(16)) { addScore(300, "RAIL +300", "#ffd166"); bump(.1); } }
    }
    // #17 no-hit
    R.noHit += dt; R.noHitMax = Math.max(R.noHitMax, R.noHit); R.noHitTick += dt;
    if (R.noHitTick >= 30) { R.noHitTick = 0; if (on(17) && R.noHit >= 30) { addScore(500, "NO-HIT 30s", "#7CFFB2"); bump(.2); } }
    // combo decay
    if (R.comboT > 0) { R.comboT -= dt; if (R.comboT <= 0) { if (R.combo >= 2) feed(`คอมโบจบที่ x${R.combo.toFixed(1)}`); R.combo = 1; R.comboStep = 2; } }

    // boost / charge (#22 #23 #24 #25 #58)
    if (g.boosting) {
      S.stats.boostT += dt; R.pureAcc = 0;
      if (on(23) && S.upg.charge > 0) g.charge = Math.min(MAX_CHARGE, (g.charge || 0) + dt * S.upg.charge * .8);
    } else {
      if (on(22)) g.charge = Math.min(MAX_CHARGE, (g.charge || 0) + dt * (.5 + S.upg.regen * .35));
      R.pureAcc += dt;
      if (on(58) && R.pureAcc >= 60) { R.pureAcc = 0; addScore(300, "PURE DRIVER", "#7CFFB2"); addCredits(50, "Pure Driver"); }
    }
    if (on(24)) {
      R.heat = g.boosting ? R.heat + dt * 14 : Math.max(0, R.heat - dt * 20);
      if (R.heat >= 100) { R.heat = 0; g.charge = Math.max(0, (g.charge || 0) - 35); banner("🔥 OVERHEAT! ชาร์จ −35", "#ff6b6b"); tone(120, .4, "sawtooth", .06, -60); }
    }
    if (on(25)) {
      R.slipNext -= dt;
      if (R.slipNext <= 0 && R.slip <= 0) { R.slip = 4; R.slipNext = 12 + Math.random() * 12; banner("💨 SLIPSTREAM!", "#00f0ff"); }
      if (R.slip > 0) {
        R.slip -= dt; g.charge = Math.min(MAX_CHARGE, (g.charge || 0) + dt * 8);
        if (g.boosting) { R.slipTick += dt; if (R.slipTick >= .5) { R.slipTick = 0; addScore(80); } }
      }
    }
    // #21 perfect launch
    if (on(21) && !R.launch && R.t >= 2) {
      R.launch = true;
      if (R.sn >= .3) { addScore(400, "PERFECT LAUNCH", "#ffd166"); inv(1.5); g.charge = Math.min(MAX_CHARGE, (g.charge || 0) + 15); }
    }
    // #28 limiter
    if (on(28)) { const lim = S.stats.topSpeed * .8; if (lim > 0 && g.speed > lim) g.speed = lim; }

    // ability timers
    for (const k in CD) CD[k] = Math.max(0, CD[k] - dt);
    R.frenzy = Math.max(0, R.frenzy - dt);
    R.ghost = Math.max(0, R.ghost - dt); setGhost(R.ghost > 0 && on(37));
    if (R.magnet > 0) {
      R.magnet -= dt; R.magAcc += dt * 2.5 * (1 + S.upg.coin * .1);
      while (R.magAcc >= 1) { R.magAcc--; g.coins = (g.coins || 0) + 1; }
    }
    R.shake = Math.max(0, R.shake - dt * 1.2);
    // #83 low-life beep
    if (on(83) && g.lives <= 2) { R.beepT -= dt; if (R.beepT <= 0) { R.beepT = 1.2; tone(920, .07, "sine", .035); } }

    if (R.secT >= 1) { R.secT -= 1; perSecond(); }
  }
  function perSecond() {
    if (on(53)) for (const o of R.objs) if (!o.done && rv(o.k) >= o.g) { o.done = true; addCredits(100, "เป้าหมายรอบ"); addXP(80); banner(`✅ ${o.n}`, "#7CFFB2"); }
    if (on(47)) {
      if (!R.bounty) {
        if (--R.bountyNext <= 0) {
          const b = BPOOL[Math.floor(Math.random() * BPOOL.length)];
          R.bounty = { ...b, base: rv(b.k), left: 40 }; banner(`🎯 BOUNTY: ${b.n} ใน 40 วิ`, "#ffd166");
        }
      } else {
        R.bounty.left--;
        if (rv(R.bounty.k) - R.bounty.base >= R.bounty.g) { addCredits(150, "Bounty"); addXP(120); banner("💰 BOUNTY สำเร็จ +150", "#7CFFB2"); R.bounty = null; R.bountyNext = 90; }
        else if (R.bounty.left <= 0) { feed("⌛ Bounty หมดเวลา"); R.bounty = null; R.bountyNext = 90; }
      }
    }
    const SV = [[60, 50], [120, 100], [300, 250], [600, 500]];
    if (on(57) && R.surv < SV.length && R.t >= SV[R.surv][0]) { const [s, c] = SV[R.surv++]; addCredits(c, "Survival"); banner(`🛡 รอด ${s / 60} นาที! +${c}`, "#00f0ff"); }
    if (on(59) && !R.coinHunt && R.coinsGot >= 25) { R.coinHunt = true; addCredits(120, "Coin Hunt"); banner("🪙 COIN HUNT สำเร็จ +120", "#ffd166"); }
    if (on(52) && !S.weekly.done && S.weekly.dist >= 1e5) { S.weekly.done = true; addCredits(3000, "Weekly"); addXP(1500); banner("🗓 WEEKLY สำเร็จ! +3000", "#ffd166"); }
    const k = Math.floor(S.stats.dist / 1e4);
    if (on(10) && k > S.distReward) { S.distReward = k; addCredits(500, "ระยะสะสม"); feed(`🛣 ระยะสะสมครบ ${k * 10}k! +500`); }
    if (on(45) && S.bank > 0 && ++R.bankT >= 60) {
      R.bankT = 0; const i = Math.min(250, Math.floor(S.bank * .01));
      if (i > 0) { S.bank += i; ledger(i, "ดอกเบี้ยธนาคาร"); feed(`🏦 ดอกเบี้ย +${i}`); }
    }
    checkAch();
  }
  function endRun() {
    if (!R || R.ended) return;
    R.ended = true; setGhost(false);
    S.stats.runs++; S.stats.playT += R.t;
    dprog("runs", 1); dprog("score", R.score);
    if (on(48)) addCredits(R.coinsGot * (1 + .25 * S.upg.coin), "แปลงเหรียญ");
    addCredits(R.score / 200, "Style Score");
    if (on(60)) S.runStreak = R.dist >= 2000 ? S.runStreak + 1 : 0;
    const mul = on(60) ? Math.min(1 + .1 * S.runStreak, 2) : 1;
    addXP(R.score / 100 * mul);
    const newBest = R.score > S.stats.bestScore;
    S.stats.bestScore = Math.max(S.stats.bestScore, R.score);
    S.stats.bestDist = Math.max(S.stats.bestDist, R.dist);
    if (newBest && on(19) && R.score > 0) banner(`🏅 NEW BEST STYLE ${fmt(R.score)}`, "#ffd166");
    R.splits.forEach((s, i) => { if (!S.best.splits[i] || s < S.best.splits[i]) S.best.splits[i] = s; });
    if (on(9)) {
      S.history.unshift({ d: new Date().toLocaleString(), g: grade(R.score), s: Math.round(R.score), dist: Math.round(R.dist), t: R.t.toFixed(0) });
      S.history.length = Math.min(S.history.length, 10);
    }
    checkAch(); save();
    if (on(90)) showSummary(newBest, mul);
  }
  function showSummary(newBest, mul) {
    const g = on(20) ? grade(R.score) : "-";
    const col = { S: "#ffd166", A: "#7CFFB2", B: "#00f0ff", C: "#9b8cff", D: "#aaa" }[g] || "#fff";
    const el = $id("nx-summary");
    el.innerHTML = `<button class="nx-btn nx-close" data-act="close">✕ ปิด</button>
<h2>สรุปผลรอบ • เกรด <span style="font-size:40px;color:${col}">${g}</span></h2>
<div class="nx-grid">
<label>✨ Style Score <b>${fmt(R.score)}${newBest ? " 🏅" : ""}</b></label>
<label>🛣 ระยะทาง <b>${fmt(R.dist)}</b></label>
<label>⏱ เวลา <b>${R.t.toFixed(1)}s</b></label>
<label>🪙 เหรียญ <b>${R.coinsGot}</b></label>
<label>🌀 ดริฟต์ <b>${R.driftTot.toFixed(1)}s</b></label>
<label>🪽 ลอยฟ้า <b>${R.airTot.toFixed(1)}s</b></label>
<label>🔗 คอมโบสูงสุด <b>x${R.maxCombo.toFixed(1)}</b></label>
<label>💥 ชน <b>${R.hits}</b></label>
<label>⭐ XP <b>+${fmt(R.xp)}${mul > 1 ? ` (x${mul.toFixed(1)})` : ""}</b></label>
<label>💳 เครดิต <b>+${fmt(R.credits)}</b></label>
</div>`;
    el.classList.add("show");
  }

  /* ───────── 13) HUD (#40 #96 #97 #99 #100) ───────── */
  function buildAbil() {
    const el = $id("nx-abil");
    el.innerHTML = ABIL.map((a, i) => `<button class="nx-ab" data-ab="${i}"><b>${a.icon}</b>${i + 1} ${a.n}<div class="cd"></div></button>`).join("");
    el.addEventListener("click", e => { const b = e.target.closest("[data-ab]"); if (b) useAbility(ABIL[+b.dataset.ab]); });
  }
  function hud(dt) {
    const racing = state === "race" && R && !R.ended;
    root.classList.toggle("hidden", on(100) && !racing);
    NX.hudT -= dt; if (NX.hudT > 0) return; NX.hudT = .1;
    $id("nx-lv").textContent = on(1) ? `LV ${S.level}` : "";
    $id("nx-title").textContent = on(8) ? title() : "";
    $id("nx-xp").style.width = on(1) ? (S.level >= MAX_LV ? 100 : clamp(S.xp / need(S.level) * 100, 0, 100)) + "%" : "0%";
    $id("nx-cr").textContent = fmt(S.credits);
    $id("nx-odo").textContent = on(97) ? "🛣 " + (S.stats.dist >= 1000 ? (S.stats.dist / 1000).toFixed(1) + "k" : fmt(S.stats.dist)) : "";
    $id("nx-sc").textContent = R ? fmt(R.score) : "0";
    $id("nx-combo").textContent = R && on(11) ? "x" + R.combo.toFixed(1) + (R.frenzy > 0 ? " ✖2" : "") : "";
    $id("nx-ct").style.width = R && on(11) ? clamp(R.comboT / (2.5 + S.skills.combo * .3) * 100, 0, 100) + "%" : "0%";
    const heat = $id("nx-heat"); heat.style.display = on(24) ? "block" : "none";
    if (R) heat.firstElementChild.style.width = R.heat + "%";
    $id("nx-obj").innerHTML = R && on(53) ? R.objs.map(o => `${o.done ? "✅" : "▫️"} ${o.n}`).join("<br>") : "";
    $id("nx-bounty").textContent = R && R.bounty && on(47)
      ? `🎯 ${R.bounty.n} (${Math.max(0, R.bounty.left)}s) ${Math.min(rv(R.bounty.k) - R.bounty.base, R.bounty.g).toFixed(1)}/${R.bounty.g}` : "";
    const bar = $id("nx-abil"); bar.style.display = on(40) && racing ? "grid" : "none";
    [...bar.children].forEach((b, i) => {
      const a = ABIL[i]; b.classList.toggle("off", !on(a.id));
      b.lastElementChild.style.height = (CD[a.key] > 0 ? CD[a.key] / a.cd * 100 : 0) + "%";
    });
    const gc = $id("nx-graph"), showG = on(96) && NX.graph;
    gc.style.display = showG ? "block" : "none";
    if (showG && racing) {
      NX.hist.push(R.sn); if (NX.hist.length > 80) NX.hist.shift();
      const x = gc.getContext("2d");
      if (x) {
        x.clearRect(0, 0, 160, 40);
        x.strokeStyle = "#0ff"; x.lineWidth = 1.5; x.beginPath();
        NX.hist.forEach((v, i) => { const px = i * 2, py = 38 - v * 36; i ? x.lineTo(px, py) : x.moveTo(px, py); });
        x.stroke();
      }
    }
    const dbg = $id("nx-debug"); dbg.style.display = on(99) ? "block" : "none";
    if (on(99)) dbg.textContent = JSON.stringify({
      state, speed: +(game.speed || 0).toFixed(1), dist: Math.round(game.distance || 0), mode: game.mode,
      lives: game.lives, charge: Math.round(game.charge || 0), coins: game.coins,
      inv: Number(game.invincible || 0).toFixed(2), shield: game.shield,
      fps: typeof displayedFPS !== "undefined" ? displayedFPS : "?", lowPerf: NX.lowPerf, hooked
    }, null, 1);
  }

  /* ───────── 14) PANEL (#41-46 #50 #91 #93) ───────── */
  const UPG = [["charge", "Boost Efficiency", 42], ["shield", "พลังโล่", 43], ["coin", "ตัวคูณเหรียญ", 44],
    ["regen", "ฟื้นฟูชาร์จ", 22], ["luck", "โชค Lucky Cat", 30]];
  const SKL = [["xp", "XP +5%/pt"], ["combo", "คอมโบนานขึ้น +0.3s/pt"], ["cool", "คูลดาวน์ −4%/pt"], ["score", "Style +4%/pt"]];
  const upCost = l => Math.round(250 * Math.pow(l + 1, 1.6));
  let tab = "systems";
  function renderPanel() {
    const p = $id("nx-panel");
    const tabs = [["systems", "🧩 ระบบ 100"], ["shop", "🛒 ร้าน & สกิล"], ["missions", "🎯 ภารกิจ"], ["ach", "🏆 ความสำเร็จ"], ["stats", "📊 สถิติ"], ["save", "💾 เซฟ"]];
    let h = `<button class="nx-btn nx-close" data-act="close">✕ ปิด</button>
<h2>NEON-100 • ${title()} • LV ${S.level}</h2>
<div class="nx-tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" class="${tab === k ? "act" : ""}">${n}</button>`).join("")}</div>`;
    if (tab === "systems") {
      h += `<p><button class="nx-btn" data-act="allon">เปิดทั้งหมด</button><button class="nx-btn" data-act="alloff">ปิดทั้งหมด</button></p>`;
      CATS.forEach((c, ci) => {
        h += `<h3>${ci + 1}. ${c}</h3><div class="nx-grid">`;
        for (let i = ci * 10 + 1; i <= ci * 10 + 10; i++)
          h += `<label><span>#${i} ${NAMES[i - 1]}</span><input type="checkbox" data-sys="${i}" ${on(i) ? "checked" : ""} ${i === 91 ? "disabled" : ""}></label>`;
        h += "</div>";
      });
    } else if (tab === "shop") {
      h += `<p>💳 เครดิต <b>${fmt(S.credits)}</b> • 🏦 ธนาคาร <b>${fmt(S.bank)}</b> • ⭐ Skill Points <b>${S.skillPts}</b>${isWeekend() && on(49) ? " • 🎉 โบนัสสุดสัปดาห์ x1.5" : ""}</p>`;
      if (on(41)) {
        h += "<h3>อัปเกรด</h3><div class='nx-grid'>";
        for (const [k, n, sid] of UPG) {
          const l = S.upg[k], c = upCost(l);
          h += `<label><span>${n} Lv ${l}/10</span><button class="nx-btn" data-buy="${k}" ${!on(sid) || l >= 10 || S.credits < c ? "disabled" : ""}>${l >= 10 ? "MAX" : fmt(c) + " 💳"}</button></label>`;
        }
        h += "</div>";
      }
      if (on(7)) {
        h += "<h3>สกิลเพิร์ค</h3><div class='nx-grid'>";
        for (const [k, n] of SKL) h += `<label><span>${n} (${S.skills[k]}/10)</span><button class="nx-btn" data-skill="${k}" ${S.skillPts < 1 || S.skills[k] >= 10 ? "disabled" : ""}>+1</button></label>`;
        h += "</div>";
      }
      if (on(45)) h += `<h3>ธนาคาร (ดอกเบี้ย 1%/นาทีที่แข่ง สูงสุด 250)</h3>
<button class="nx-btn" data-act="dep">ฝาก 500</button><button class="nx-btn" data-act="depall">ฝากทั้งหมด</button><button class="nx-btn" data-act="wd">ถอน 500</button><button class="nx-btn" data-act="wdall">ถอนทั้งหมด</button>`;
      if (on(46)) h += `<h3>กล่องเสบียงรายวัน</h3><button class="nx-btn" data-act="crate" ${S.daily.crate === dkey(new Date()) ? "disabled" : ""}>📦 เปิดกล่อง</button>`;
      if (on(2)) h += `<h3>Prestige</h3><button class="nx-btn" data-act="prestige" ${S.level < MAX_LV || S.prestige >= 99 ? "disabled" : ""}>🌟 Prestige (ต้อง LV ${MAX_LV})</button> <small>รีเซ็ตเลเวล รับ XP +10% และ Style +5% ถาวรต่อระดับ</small>`;
      if (on(50)) h += `<h3>ประวัติธุรกรรม</h3><pre style="font-size:11px;white-space:pre-wrap">${S.log.join("\n") || "-"}</pre>`;
    } else if (tab === "missions") {
      h += `<h3>📅 Daily Challenges</h3>` + (on(51) ? S.daily.ch.map(c => `<div>${c.done ? "✅" : "▫️"} ${c.n} — ${c.max ? (+c.p).toFixed(1) : fmt(Math.min(c.p, c.g))}/${fmt(c.g)}</div>`).join("") : "<i>ปิดอยู่</i>");
      h += `<p>🔥 Login streak: ${S.daily.streak} วัน • 🔁 Run streak: ${S.runStreak}</p>`;
      h += `<h3>🗓 Weekly</h3>` + (on(52)
        ? `<div>${S.weekly.done ? "✅" : "▫️"} วิ่งสะสมในสัปดาห์นี้ ${fmt(S.weekly.dist)}/${fmt(1e5)}</div>`
        : "<i>ปิดอยู่</i>");
      h += `<h3>🎯 เป้าหมายรอบนี้</h3>` + (on(53)
        ? (R ? R.objs.map(o => `<div>${o.done ? "✅" : "▫️"} ${o.n}</div>`).join("") : "<i>เริ่มรอบเพื่อรับเป้าหมาย</i>")
        : "<i>ปิดอยู่</i>");
      h += `<h3>🏁 Checkpoint ที่ดีที่สุด</h3>` + (on(54) && S.best.splits.length
        ? `<div>${S.best.splits.slice(0, 12).map((s, i) => `CP${i + 1}: ${s.toFixed(1)}s`).join(" • ")}</div>`
        : "<i>ยังไม่มีสถิติ</i>");
    } else if (tab === "ach") {
      const got = Object.keys(S.ach).length;
      h += `<p>🏆 ปลดล็อก <b>${got}/${ACH.length}</b>${on(4) ? "" : " (ระบบปิดอยู่)"}</p><div class="nx-grid">`;
      for (const [k, n, d] of ACH) {
        const ok = !!S.ach[k];
        h += `<label style="opacity:${ok ? 1 : .5}"><span>${ok ? "🏆" : "🔒"} <b>${n}</b><br><small>${d}</small></span></label>`;
      }
      h += "</div>";
    } else if (tab === "stats") {
      const st = S.stats;
      const row = (n, v) => `<label><span>${n}</span><b>${v}</b></label>`;
      h += `<div class="nx-grid">
${row("รอบที่ลงแข่ง", fmt(st.runs))}${row("ระยะสะสม", fmt(st.dist))}${row("เหรียญสะสม", fmt(st.coins))}
${row("ดริฟต์สะสม", st.drift.toFixed(0) + "s")}${row("ลอยฟ้าสะสม", st.air.toFixed(0) + "s")}${row("บินสะสม", st.flight.toFixed(0) + "s")}
${row("บนรางแม่เหล็ก", st.rail.toFixed(0) + "s")}${row("ชนสะสม", fmt(st.hits))}${row("ใช้บูสต์", st.boostT.toFixed(0) + "s")}
${row("ความเร็วสูงสุด", st.topSpeed.toFixed(0))}${row("เวลาเล่นรวม", (st.playT / 60).toFixed(1) + " นาที")}${row("Style สูงสุด", fmt(st.bestScore))}
${row("ระยะไกลสุด", fmt(st.bestDist))}${row("คอมโบสูงสุด", "x" + st.maxCombo.toFixed(1))}${row("ใช้สกิล", fmt(st.abilities))}
${row("ชุบชีวิต (Lucky Cat)", fmt(st.revives))}${row("Run streak", S.runStreak)}${row("Login streak", S.daily.streak + " วัน")}
</div>`;
      h += `<h3>ประวัติ 10 รอบล่าสุด</h3>` + (on(9) && S.history.length
        ? `<table style="width:100%;font-size:12px"><tr><th>เวลา</th><th>เกรด</th><th>Style</th><th>ระยะ</th><th>วินาที</th></tr>${S.history.map(r =>
          `<tr><td>${r.d}</td><td>${r.g}</td><td>${fmt(r.s)}</td><td>${fmt(r.dist)}</td><td>${r.t}</td></tr>`).join("")}</table>`
        : "<i>ยังไม่มีประวัติ</i>");
    } else if (tab === "save") {
      h += `<h3>เซฟของ NEON-100</h3>
<p><small>แยกจากเซฟหลักของเกม ไม่กระทบเครดิต/โรงรถเดิม</small></p>
<button class="nx-btn" data-act="export" ${on(92) ? "" : "disabled"}>⬇ Export</button>
<button class="nx-btn" data-act="import" ${on(92) ? "" : "disabled"}>⬆ Import</button>
<button class="nx-btn" data-act="reset">🗑 รีเซ็ตทั้งหมด</button>
<textarea id="nx-io" rows="6" style="width:100%;margin-top:8px;background:#0a0420;color:#eaffff;border:1px solid #0ff7;border-radius:8px;font-size:11px" placeholder="วางข้อความเซฟที่นี่แล้วกด Import"></textarea>
<p id="nx-io-msg" style="min-height:1.2em"></p>
<h3>ตั้งค่า</h3>
<label><input type="checkbox" data-opt="graph" ${NX.graph ? "checked" : ""}> แสดงกราฟความเร็ว</label>
<label><input type="checkbox" data-opt="cinema" ${NX.cinema ? "checked" : ""}> โหมด Letterbox</label>`;
    }
    p.innerHTML = h;
  }

  /* ───────── 14b) PANEL CONTROLS ───────── */
  const modal = id => $id(id);
  const closeModals = () => ["nx-panel", "nx-summary", "nx-help"].forEach(id => modal(id).classList.remove("show"));
  function openPanel() {
    const p = modal("nx-panel");
    if (p.classList.contains("show")) { p.classList.remove("show"); return; }
    renderPanel(); p.classList.add("show");
  }
  function renderHelp() {
    const k = c => c.replace("Backquote", "`").replace("Backslash", "\\").replace("BracketLeft", "[")
      .replace("BracketRight", "]").replace("Digit", "");
    const el = modal("nx-help");
    el.innerHTML = `<button class="nx-btn nx-close" data-act="close">✕ ปิด</button>
<h2>NEON-100 • วิธีใช้</h2>
<div class="nx-grid">
<label><span>เปิด/ปิดแผงควบคุม</span><b>${k(KEYMAP.panel)}</b></label>
<label><span>หน้านี้</span><b>${k(KEYMAP.help)}</b></label>
<label><span>Letterbox</span><b>${k(KEYMAP.cinema)}</b></label>
<label><span>กราฟความเร็ว</span><b>${k(KEYMAP.graph)}</b></label>
${ABIL.map((a, i) => `<label><span>${a.icon} ${a.n} (คูลดาวน์ ${a.cd}s)</span><b>${i + 1}</b></label>`).join("")}
</div>
<p>คะแนน Style ได้จากดริฟต์ ลอยฟ้า บิน รางแม่เหล็ก และการเก็บเหรียญ ยิ่งต่อคอมโบนานตัวคูณยิ่งสูง (สูงสุด x8) ชนแล้วคอมโบจะรีเซ็ต</p>
<p>ระบบทั้ง 100 เปิด/ปิดแยกได้ในแผงควบคุม ระบบที่ปิดโดยปริยาย: #24 Overheat, #28 Speed Limiter, #69 หิมะนีออน, #87 เสียงพากย์, #99 Debug</p>
<p>ใช้ร่วมกับ OVERDRIVE PACK ได้ ปุ่มไม่ซ้ำกัน แต่เครดิตและคะแนนจะได้จากทั้งสองระบบ</p>`;
  }

  function exportSave() { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
  function importSave(text) {
    let obj;
    try { obj = JSON.parse(decodeURIComponent(escape(atob(text.trim())))); }
    catch { try { obj = JSON.parse(text.trim()); } catch { throw new Error("รูปแบบไม่ถูกต้อง"); } }
    if (!obj || typeof obj !== "object" || obj.v !== 1 || typeof obj.stats !== "object") throw new Error("ไม่ใช่ไฟล์เซฟ NEON-100");
    const next = merge(DEF(), obj);
    // sanity clamps so a hand-edited save cannot break the UI
    next.level = clamp(Math.floor(+next.level) || 1, 1, MAX_LV);
    next.xp = Math.max(0, +next.xp || 0);
    next.credits = clamp(Math.floor(+next.credits) || 0, 0, 1e9);
    next.bank = clamp(Math.floor(+next.bank) || 0, 0, 1e9);
    next.skillPts = clamp(Math.floor(+next.skillPts) || 0, 0, 999);
    next.prestige = clamp(Math.floor(+next.prestige) || 0, 0, 99);
    for (const k in next.upg) next.upg[k] = clamp(Math.floor(+next.upg[k]) || 0, 0, 10);
    for (const k in next.skills) next.skills[k] = clamp(Math.floor(+next.skills[k]) || 0, 0, 10);
    if (!Array.isArray(next.log)) next.log = [];
    if (!Array.isArray(next.history)) next.history = [];
    if (!Array.isArray(next.daily.ch)) next.daily.ch = [];
    S = next; save();
  }

  function doAction(act) {
    const bal = (n, why) => { S.credits += n; ledger(n, why); };
    switch (act) {
      case "close": closeModals(); return;
      case "allon": for (let i = 1; i <= 100; i++) S.enabled[i] = true; break;
      case "alloff": for (let i = 1; i <= 100; i++) S.enabled[i] = i === 91 ? true : false; break;
      case "dep": { const n = Math.min(500, S.credits); if (n > 0) { S.credits -= n; S.bank += n; ledger(-n, "ฝากธนาคาร"); } break; }
      case "depall": { const n = S.credits; if (n > 0) { S.credits = 0; S.bank += n; ledger(-n, "ฝากธนาคาร"); } break; }
      case "wd": { const n = Math.min(500, S.bank); if (n > 0) { S.bank -= n; bal(n, "ถอนธนาคาร"); } break; }
      case "wdall": { const n = S.bank; if (n > 0) { S.bank = 0; bal(n, "ถอนธนาคาร"); } break; }
      case "crate": {
        const d = dkey(new Date());
        if (!on(46) || S.daily.crate === d) break;
        S.daily.crate = d;
        const c = 200 + Math.floor(Math.random() * 300) + S.level * 10;
        addCredits(c, "กล่องเสบียง"); addXP(150);
        if (Math.random() < .3) S.skillPts++;
        banner(`📦 กล่องเสบียง +${c}`, "#ffd166"); chime();
        break;
      }
      case "prestige":
        if (!on(2) || S.level < MAX_LV || S.prestige >= 99) break;
        if (!confirm("Prestige จะรีเซ็ตเลเวลและ XP กลับเป็น 1 แต่ได้โบนัสถาวร ยืนยัน?")) break;
        S.prestige++; S.level = 1; S.xp = 0; S.skillPts += 2;
        banner(`🌟 PRESTIGE ${S.prestige}!`, "#ffd166"); chime(); checkAch();
        break;
      case "export": {
        const io = $id("nx-io"); if (io) { io.value = exportSave(); io.select(); }
        const m = $id("nx-io-msg"); if (m) m.textContent = "คัดลอกข้อความด้านบนเก็บไว้";
        return;
      }
      case "import": {
        const io = $id("nx-io"), m = $id("nx-io-msg");
        try {
          importSave(io.value); renderPanel();
          const m2 = $id("nx-io-msg"); if (m2) m2.textContent = "✅ นำเข้าเซฟแล้ว";
        } catch (err) { if (m) m.textContent = "❌ " + err.message; }
        return;
      }
      case "reset":
        if (!confirm("ลบข้อมูล NEON-100 ทั้งหมด (เลเวล เครดิต สถิติ)? ย้อนกลับไม่ได้")) return;
        S = DEF(); DEFAULT_OFF.forEach(id => { S.enabled[id] = false; }); save();
        break;
      default: return;
    }
    save(); renderPanel();
  }

  $id("nx-panel").addEventListener("click", e => {
    const t = e.target.closest("button,input"); if (!t) return;
    if (t.dataset.tab) { tab = t.dataset.tab; renderPanel(); return; }
    if (t.dataset.act) { doAction(t.dataset.act); return; }
    if (t.dataset.buy) {
      const k = t.dataset.buy, l = S.upg[k], c = upCost(l);
      if (l < 10 && S.credits >= c) { S.credits -= c; S.upg[k]++; ledger(-c, "อัปเกรด " + k); save(); renderPanel(); tone(700, .1, "triangle", .05, 300); }
      return;
    }
    if (t.dataset.skill) {
      const k = t.dataset.skill;
      if (S.skillPts > 0 && S.skills[k] < 10) { S.skillPts--; S.skills[k]++; save(); renderPanel(); }
      return;
    }
    if (t.dataset.sys) {
      const id = +t.dataset.sys;
      if (id === 91) { t.checked = true; return; }   // the panel itself cannot be turned off
      S.enabled[id] = t.checked; save();
      return;
    }
    if (t.dataset.opt) {
      if (t.dataset.opt === "graph") NX.graph = t.checked;
      if (t.dataset.opt === "cinema") NX.cinema = t.checked;
    }
  });
  for (const id of ["nx-summary", "nx-help"]) {
    $id(id).addEventListener("click", e => { if (e.target.closest("[data-act='close']")) closeModals(); });
  }
  buildAbil();

  /* ───────── 15) KEYBOARD ───────── */
  const typing = e => {
    const t = e.target;
    return t instanceof HTMLElement && (t.matches("input:not([type=checkbox]), textarea, select") || t.isContentEditable);
  };
  addEventListener("keydown", e => {
    if (e.repeat || typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    const c = e.code;
    if (c === KEYMAP.panel) { e.preventDefault(); openPanel(); return; }
    if (c === KEYMAP.help) { e.preventDefault(); const h = modal("nx-help"); renderHelp(); h.classList.toggle("show"); return; }
    if (c === "Escape") { closeModals(); return; }
    if (state !== "race") return;
    if (c === KEYMAP.cinema && on(75)) { e.preventDefault(); NX.cinema = !NX.cinema; return; }
    if (c === KEYMAP.graph && on(96)) { e.preventDefault(); NX.graph = !NX.graph; return; }
    const i = ABIL.findIndex(a => KEYMAP[a.key] === c);
    if (i >= 0 && on(40)) { e.preventDefault(); useAbility(ABIL[i]); }
  });

  /* ───────── 16) WIRING INTO THE GAME ───────── */
  // Wrappers (same pattern as other packs) so nothing in the game is rewritten.
  let hooked = false, lastGame = null, lastState = null, lastT = performance.now(), clock = 0;

  const loginBonus = () => {
    const today = dkey(new Date());
    if (S.daily.last === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    S.daily.streak = S.daily.last === dkey(y) ? S.daily.streak + 1 : 1;
    S.daily.last = today;
    if (!on(3)) return;
    const c = 100 + Math.min(S.daily.streak, 7) * 50;
    addCredits(c, "โบนัสล็อกอิน");
    setTimeout(() => banner(`🎁 ล็อกอินวันที่ ${S.daily.streak} +${c}`, "#ffd166"), 1200);
  };

  // Detect run start/end by watching `game` identity and `state` (works even if
  // startRace/finishRace are wrapped by other packs, as OVERDRIVE does).
  function sync(dt) {
    const racing = state === "race";
    if (racing && game !== lastGame) {
      if (R && !R.ended) endRun();          // a run that was abandoned
      newRun(); lastGame = game;
    }
    if (!racing && R && !R.ended && (state === "result" || state === "menu" || state === "garage" || game.ended)) {
      endRun();
    }
    if (state !== lastState) {
      lastState = state;
      if (state !== "race" && state !== "pause" && state !== "photo") closeModals_if_needed();
    }
    if (racing && R && !R.ended) tickRace(dt);
  }
  function closeModals_if_needed() { modal("nx-summary").classList.contains("show") && state === "race" && closeModals(); }

  // Pause the pack's own timers while the game is paused (state === "pause")
  function perFrame() {
    const now = performance.now();
    const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
    clock += dt;

    try {
      sync(state === "race" ? dt : 0);
      world(dt, clock);
      fx(dt, clock);
      hud(dt);

      // banner queue (#89)
      if (NX.bT > 0) { NX.bT -= dt; if (NX.bT <= 0) $id("nx-banner").classList.remove("show"); }
      if (on(89) && NX.bT <= 0 && NX.bq.length) { const [m, c] = NX.bq.shift(); showBanner(m, c); }

      // #92 auto-save every 30 s
      NX.saveT += dt; if (NX.saveT >= 30) { NX.saveT = 0; if (on(92)) save(); }

      // #95 eye-break reminder (only counts racing time)
      if (state === "race") {
        NX.session += dt;
        if (on(95) && NX.session >= NX.breakNext) { NX.breakNext += 2700; banner("😺 เล่นมา 45 นาทีแล้ว พักสายตาหน่อยนะ", "#7CFFB2"); }
      }

      // #94 performance guard: drop heavy 3D effects if FPS stays low
      if (on(94) && typeof displayedFPS === "number" && state === "race") {
        if (displayedFPS < 28) { NX.lowT += dt; NX.hiT = 0; } else if (displayedFPS > 50) { NX.hiT += dt; NX.lowT = 0; }
        if (!NX.lowPerf && NX.lowT > 4) { NX.lowPerf = true; feed("⚙ Performance Guard: ลดเอฟเฟกต์ 3D"); }
        if (NX.lowPerf && NX.hiT > 12) { NX.lowPerf = false; NX.hiT = 0; }
      } else if (!on(94)) NX.lowPerf = false;
    } catch (err) {
      // A bug in this pack must never stop the game loop.
      if (!perFrame.warned) { perFrame.warned = true; console.warn("NEON-100 error (pack keeps running):", err); }
    }
  }

  // Preferred hook: wrap drawScene so camera shake is applied right before the
  // draw call and removed right after (applyCam / restoreCam contract).
  if (typeof drawScene === "function") {
    const origDraw = drawScene;
    let lastFrameStamp = -1;
    drawScene = function () {
      let applied = false;
      try {
        // drawScene is also called by the snapshot button; advance the pack's
        // simulation at most once per animation frame.
        const stamp = performance.now();
        if (stamp - lastFrameStamp > 4) { lastFrameStamp = stamp; perFrame(); }
        applyCam(); applied = true;
      } catch (err) { console.warn("NEON-100 camera", err); }
      try { return origDraw.apply(this, arguments); }
      finally { if (applied) { try { restoreCam(); } catch {} } }
    };
    hooked = true;
  } else {
    // Fallback: own rAF loop (no camera shake ordering guarantee)
    const loop = () => { perFrame(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    hooked = "raf";
  }

  addEventListener("beforeunload", () => { try { if (R && !R.ended) endRun(); save(); } catch {} });
  addEventListener("pagehide", () => { try { save(); } catch {} });

  loginBonus(); save();
  window.NEON100 = { version: "1.0", state: () => S, run: () => R, hooked: () => hooked, save, open: openPanel };
  console.info("NEON-100 loaded • hooked via", hooked === true ? "drawScene" : hooked);
})();
