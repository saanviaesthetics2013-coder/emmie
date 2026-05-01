const boot = document.getElementById("boot");
const bootFill = document.getElementById("bootFill");
const bootText = document.getElementById("bootText");

const tabs = document.getElementById("tabs");
const appContent = document.getElementById("appContent");
const mainTitle = document.getElementById("mainTitle");

const emyBubble = document.getElementById("emyBubble");

let activeApp = null;
let openTabs = {};

function emy(text) {
  if (!emyBubble) return;
  emyBubble.innerText = text;
}

/* CLOCK */
function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  clock.innerText = new Date().toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
setInterval(updateClock, 1000);
updateClock();

/* BOOT */
window.onload = () => {
  let p = 0;
  const messages = [
    "Checking UI modules...",
    "Loading glass interface...",
    "Preparing apps...",
    "Starting Emmy system...",
    "Launching NeuraLib OS..."
  ];

  let i = 0;

  const timer = setInterval(() => {
    p += 20;
    bootFill.style.width = p + "%";
    bootText.innerText = messages[i] || "Loading...";
    i++;

    if (p >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        boot.style.display = "none";
        emy("Hi, I'm Emmy — your guide. Open apps from the dock.");
      }, 700);
    }
  }, 600);
};

/* MAIN WINDOW CONTROLS */
function closeMainWindow() {
  document.getElementById("mainWindow").style.display = "none";
  emy("Main panel closed.");
}

function minimizeMainWindow() {
  document.getElementById("mainWindow").style.opacity = "0.2";
  emy("Panel minimized.");
}

function maximizeMainWindow() {
  const win = document.getElementById("mainWindow");

  if (win.dataset.max === "true") {
    win.style.width = "min(950px, 92%)";
    win.style.height = "520px";
    win.style.top = "70px";
    win.dataset.max = "false";
    emy("Panel restored.");
  } else {
    win.style.width = "96%";
    win.style.height = "78%";
    win.style.top = "55px";
    win.dataset.max = "true";
    emy("Panel maximized.");
  }
}

/* TABS SYSTEM */
function renderTabs() {
  tabs.innerHTML = "";

  Object.keys(openTabs).forEach(appId => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.innerText = openTabs[appId].title;

    if (activeApp === appId) tab.classList.add("active");

    tab.onclick = () => switchTab(appId);
    tabs.appendChild(tab);
  });
}

function switchTab(appId) {
  activeApp = appId;
  mainTitle.innerText = openTabs[appId].title;
  appContent.innerHTML = openTabs[appId].html;

  if (openTabs[appId].onLoad) {
    openTabs[appId].onLoad();
  }

  renderTabs();
}

/* APPS */
function openApp(appId) {
  document.getElementById("mainWindow").style.display = "block";
  document.getElementById("mainWindow").style.opacity = "1";

  if (openTabs[appId]) {
    switchTab(appId);
    return;
  }

  if (appId === "ency") {
    openTabs[appId] = { title: "Encyclopedia", html: encyclopediaHTML(), onLoad: null };
    emy("Search anything here.");
  }

  if (appId === "crafts") {
    openTabs[appId] = { title: "Craft Studio", html: craftsHTML(), onLoad: null };
    emy("Choose a craft to see steps.");
  }

  if (appId === "paint") {
    openTabs[appId] = { title: "Paint", html: paintHTML(), onLoad: setupPaint };
    emy("Paint something beautiful.");
  }

  if (appId === "notes") {
    openTabs[appId] = { title: "Notes", html: notesHTML(), onLoad: setupNotes };
    emy("Your notes auto-save.");
  }

  if (appId === "worldclock") {
    openTabs[appId] = { title: "World Clock", html: worldClockHTML(), onLoad: setupWorldClock };
    emy("Select a country to view time.");
  }

  if (appId === "voice") {
    openTabs[appId] = { title: "Voice Detector", html: voiceHTML(), onLoad: null };
    emy("This app can listen to your voice.");
  }

  if (appId === "fakenews") {
    openTabs[appId] = { title: "Fake News Detector", html: fakeNewsHTML(), onLoad: null };
    emy("Paste a headline to analyze it.");
  }

  if (appId === "credits") {
    openTabs[appId] = { title: "Credits", html: creditsHTML(), onLoad: null };
    emy("Thank you for exploring NeuraLib OS.");
  }

  switchTab(appId);
}

/* ENCYCLOPEDIA (WIKIPEDIA API) */
function encyclopediaHTML() {
  return `
    <h2>Encyclopedia</h2>
    <p style="opacity:0.8;margin-top:6px;">Search online using Wikipedia API.</p>

    <div class="card">
      <input id="wikiInput" placeholder="Type something (plastic, moon, ocean...)" />
      <button style="margin-top:12px;" onclick="wikiSearch()">Search</button>
      <div id="wikiResult" style="margin-top:14px;opacity:0.9;">Waiting...</div>
    </div>
  `;
}

async function wikiSearch() {
  const input = document.getElementById("wikiInput").value.trim();
  const result = document.getElementById("wikiResult");

  if (!input) {
    result.innerText = "Type something first.";
    emy("Please type a topic.");
    return;
  }

  result.innerText = "Searching...";

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.type && data.type.includes("not_found")) {
      result.innerHTML = `No results found for "<b>${input}</b>".`;
      emy("No results found.");
      return;
    }

    result.innerHTML = `
      <h3>${data.title}</h3>
      <p style="margin-top:10px;line-height:1.6;">${data.extract}</p>
      <p style="margin-top:14px;opacity:0.7;font-size:12px;">
        Source: Wikipedia API
      </p>
    `;

    emy("Search complete.");

  } catch (err) {
    result.innerText = "Error loading data (maybe blocked by browser).";
    emy("Something went wrong.");
  }
}

/* CRAFTS */
const craftsDB = [
  {
    title: "Paper Butterfly",
    difficulty: "Easy",
    steps: [
      "Fold paper in half.",
      "Draw wing shape.",
      "Cut carefully.",
      "Open and decorate.",
      "Add thread to hang."
    ]
  },
  {
    title: "Paper Plane",
    difficulty: "Easy",
    steps: [
      "Fold in half lengthwise.",
      "Fold corners inward.",
      "Fold nose again.",
      "Fold plane in half.",
      "Fold wings and fly."
    ]
  },
  {
    title: "Origami Heart",
    difficulty: "Medium",
    steps: [
      "Fold paper diagonally.",
      "Fold corners to center.",
      "Shape the heart top.",
      "Flatten carefully.",
      "Decorate if needed."
    ]
  }
];

function craftsHTML() {
  return `
    <h2>Craft Studio</h2>
    <p style="opacity:0.8;margin-top:6px;">Tap a craft to see full steps.</p>

    <div class="grid">
      ${craftsDB.map((c, i) => `
        <div class="grid-item" onclick="openCraft(${i})">
          <h3>${c.title}</h3>
          <p style="opacity:0.75;margin-top:6px;">Difficulty: ${c.difficulty}</p>
        </div>
      `).join("")}
    </div>

    <div id="craftDetail" class="card" style="display:none;"></div>
  `;
}

function openCraft(i) {
  const craft = craftsDB[i];
  const box = document.getElementById("craftDetail");

  box.style.display = "block";
  box.innerHTML = `
    <h3>${craft.title}</h3>
    <ol style="margin-top:12px;padding-left:20px;line-height:1.8;">
      ${craft.steps.map(s => `<li>${s}</li>`).join("")}
    </ol>
  `;

  emy("Craft opened.");
}

/* PAINT */
function paintHTML() {
  return `
    <h2>Paint</h2>
    <p style="opacity:0.8;margin-top:6px;">A mini drawing app.</p>

    <div class="card">
      <label style="font-size:12px;opacity:0.7;">Brush Color</label>
      <input type="color" id="paintColor" value="#7fd6d2" />

      <label style="font-size:12px;opacity:0.7;margin-top:10px;display:block;">Brush Size</label>
      <input type="range" id="paintSize" min="2" max="30" value="7" />

      <div style="display:flex;gap:10px;margin-top:12px;">
        <button onclick="paintClear()">Clear</button>
        <button onclick="paintSave()">Save</button>
      </div>
    </div>

    <canvas id="paintCanvas" width="800" height="320"
      style="margin-top:14px;border-radius:18px;background:white;width:100%;"></canvas>
  `;
}

let painting = false;

function setupPaint() {
  const canvas = document.getElementById("paintCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.onmousedown = () => painting = true;
  canvas.onmouseup = () => painting = false;
  canvas.onmouseleave = () => painting = false;

  canvas.onmousemove = (e) => {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = document.getElementById("paintColor").value;
    const size = document.getElementById("paintSize").value;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  };
}

function paintClear() {
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  emy("Canvas cleared.");
}

function paintSave() {
  const canvas = document.getElementById("paintCanvas");
  const link = document.createElement("a");
  link.download = "neuralib-art.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  emy("Saved your artwork.");
}

/* NOTES */
function notesHTML() {
  return `
    <h2>Notes</h2>
    <p style="opacity:0.8;margin-top:6px;">Saved automatically.</p>

    <div class="card">
      <textarea id="notesBox" style="height:260px;" placeholder="Write your notes..."></textarea>
    </div>
  `;
}

function setupNotes() {
  const box = document.getElementById("notesBox");
  if (!box) return;

  box.value = localStorage.getItem("neuralib_notes") || "";

  box.oninput = () => {
    localStorage.setItem("neuralib_notes", box.value);
  };
}

/* WORLD CLOCK */
function worldClockHTML() {
  return `
    <h2>World Clock</h2>
    <p style="opacity:0.8;margin-top:6px;">Choose a country.</p>

    <div class="card">
      <select id="tzSelect">
        <option value="Asia/Kolkata">India</option>
        <option value="America/New_York">USA (New York)</option>
        <option value="America/Los_Angeles">USA (California)</option>
        <option value="Europe/Paris">France</option>
        <option value="Europe/Rome">Italy</option>
        <option value="Europe/London">UK</option>
        <option value="Asia/Tokyo">Japan</option>
        <option value="Australia/Sydney">Australia</option>
      </select>

      <div style="margin-top:18px;">
        <div style="opacity:0.7;font-size:12px;">Live Time</div>
        <div id="worldTime" style="font-size:38px;font-weight:950;margin-top:6px;">--:--</div>
      </div>
    </div>
  `;
}

function setupWorldClock() {
  const select = document.getElementById("tzSelect");
  const display = document.getElementById("worldTime");

  function tick() {
    display.innerText = new Date().toLocaleTimeString("en-US", {
      timeZone: select.value
    });
  }

  tick();
  setInterval(tick, 1000);
}

/* VOICE DETECTOR */
function voiceHTML() {
  return `
    <h2>Voice Detector</h2>
    <p style="opacity:0.8;margin-top:6px;">Uses Speech Recognition API.</p>

    <div class="card">
      <button onclick="startVoice()">Start Listening</button>
      <button style="margin-top:10px;" onclick="stopVoice()">Stop</button>

      <div style="margin-top:14px;">
        <b>Detected Speech:</b>
        <div id="voiceText" style="margin-top:10px;opacity:0.9;">---</div>
      </div>
    </div>
  `;
}

let recognition = null;

function startVoice() {
  const box = document.getElementById("voiceText");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    box.innerText = "Not supported in this browser.";
    emy("Voice recognition not supported.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;

  recognition.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    box.innerText = text;
    emy("Voice detected.");
  };

  recognition.start();
  emy("Listening...");
}

function stopVoice() {
  if (recognition) recognition.stop();
  emy("Stopped listening.");
}

/* FAKE NEWS */
function fakeNewsHTML() {
  return `
    <h2>Fake News Detector</h2>
    <p style="opacity:0.8;margin-top:6px;">Gives a trust score.</p>

    <div class="card">
      <textarea id="newsInput" style="height:140px;" placeholder="Paste a headline or paragraph..."></textarea>
      <button style="margin-top:12px;" onclick="analyzeNews()">Analyze</button>
      <div id="newsResult" style="margin-top:14px;">---</div>
    </div>
  `;
}

function analyzeNews() {
  const input = document.getElementById("newsInput").value.toLowerCase();
  const out = document.getElementById("newsResult");

  if (!input.trim()) {
    out.innerText = "Paste a headline first.";
    emy("Paste something first.");
    return;
  }

  const clickbait = ["shocking", "unbelievable", "secret", "you won't believe", "viral", "breaking", "miracle"];
  const emotion = ["fear", "panic", "destroy", "danger", "threat", "hate", "evil"];

  let score = 100;
  let signals = [];

  clickbait.forEach(w => {
    if (input.includes(w)) {
      score -= 12;
      signals.push("Clickbait keyword: " + w);
    }
  });

  emotion.forEach(w => {
    if (input.includes(w)) {
      score -= 8;
      signals.push("Emotional trigger: " + w);
    }
  });

  if (input.includes("!!!")) {
    score -= 15;
    signals.push("Too many exclamation marks.");
  }

  if (input.length < 45) {
    score -= 10;
    signals.push("Too short (possible manipulation).");
  }

  if (score < 0) score = 0;

  let status = "Trusted";
  if (score < 70) status = "Suspicious";
  if (score < 45) status = "Highly Suspicious";

  out.innerHTML = `
    <h3>Trust Score: ${score}/100</h3>
    <p style="margin-top:8px;"><b>Status:</b> ${status}</p>

    <div style="margin-top:12px;">
      <b>Signals:</b>
      <ul style="margin-top:10px;padding-left:18px;line-height:1.7;">
        ${signals.length ? signals.map(s => `<li>${s}</li>`).join("") : "<li>No suspicious patterns detected.</li>"}
      </ul>
    </div>
  `;

  emy("Analysis complete.");
}

/* CREDITS */
function creditsHTML() {
  return `
    <div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
      <div style="font-size:28px;font-weight:950;letter-spacing:2px;
        background:linear-gradient(90deg,var(--cyan),var(--rose),var(--purple));
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;">
        Created by Saanvi
      </div>

      <div style="margin-top:14px;opacity:0.7;font-size:13px;">
        NeuraLib OS • WebOS Pro v6
      </div>
    </div>
  `;
}
