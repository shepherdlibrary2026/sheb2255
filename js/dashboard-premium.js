document.addEventListener("DOMContentLoaded", async () => {
  await protectDashboard();
  renderPremiumDashboard();
  await loadDashboard();
});

async function protectDashboard() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "login.html";
  }
}

function renderPremiumDashboard() {
  document.getElementById("app").innerHTML = `
    <style>
      .layout{display:grid;grid-template-columns:290px 1fr;min-height:100vh}
      .sidebar{background:#020617;color:white;padding:28px;position:sticky;top:0;height:100vh}
      .brand{font-size:24px;font-weight:900;color:#fde68a;margin-bottom:35px}
      .nav a{display:block;color:#cbd5e1;text-decoration:none;padding:14px 16px;border-radius:14px;margin-bottom:8px;font-weight:800}
      .nav a:hover,.nav a.active{background:#1e3a8a;color:white}
      .upgrade{background:linear-gradient(135deg,#1e3a8a,#312e81);padding:22px;border-radius:22px;margin-top:30px}
      .upgrade h3{color:#fde68a;margin-bottom:8px}
      .upgrade p{color:#dbeafe;font-size:14px;margin-bottom:15px}
      .upgrade button{background:white;color:#1e3a8a;border:0;padding:12px 18px;border-radius:999px;font-weight:900}

      .main{padding:30px}
      .topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
      .topbar h1{font-size:34px}
      .topbar p{color:#64748b}
      .profile{background:white;border:1px solid #e2e8f0;border-radius:999px;padding:10px 18px;display:flex;gap:12px;align-items:center}
      .avatar{width:42px;height:42px;border-radius:50%;background:#1e3a8a;color:white;display:flex;align-items:center;justify-content:center;font-weight:900}

      .hero-card{background:linear-gradient(135deg,#0f172a,#1e3a8a,#312e81);color:white;border-radius:30px;padding:34px;margin-bottom:26px;display:grid;grid-template-columns:1.3fr .7fr;gap:24px;align-items:center;box-shadow:0 25px 60px rgba(30,58,138,.25)}
      .hero-card h2{font-size:36px;margin-bottom:12px}
      .hero-card p{color:#dbeafe;margin-bottom:22px}
      .hero-card button{border:0;background:#f59e0b;color:#111827;padding:14px 22px;border-radius:999px;font-weight:900}
      .verse-box{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:24px;border-radius:22px}
      .verse-box p{color:#fff;font-style:italic}

      .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:18px;margin-bottom:26px}
      .stat{background:white;border:1px solid #e2e8f0;border-radius:24px;padding:24px;box-shadow:0 10px 30px rgba(15,23,42,.05)}
      .stat small{color:#64748b;font-weight:800}
      .stat h2{font-size:36px;color:#1e3a8a;margin-top:8px}
      .stat span{color:#16a34a;font-weight:800;font-size:13px}

      .grid{display:grid;grid-template-columns:1.2fr .8fr;gap:24px}
      .card{background:white;border:1px solid #e2e8f0;border-radius:26px;padding:28px;box-shadow:0 10px 30px rgba(15,23,42,.05)}
      .card h2{margin-bottom:8px}
      .muted{color:#64748b;margin-bottom:18px}
      input,textarea,select{width:100%;padding:14px;border:1px solid #cbd5e1;border-radius:14px;margin:8px 0 14px;font-size:15px}
      textarea{min-height:110px}
      .primary{border:0;background:#1e3a8a;color:white;padding:14px 22px;border-radius:999px;font-weight:900}
      .secondary{border:0;background:#e0e7ff;color:#1e3a8a;padding:13px 18px;border-radius:999px;font-weight:900}
      .tool-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-top:16px}
      .tool{background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:18px;font-weight:900;color:#1e3a8a}
      .item{padding:16px;border-bottom:1px solid #e2e8f0}
      .item h4{margin-bottom:5px}
      .item p{color:#64748b;font-size:14px}
      .two{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:24px}

      @media(max-width:950px){
        .layout{grid-template-columns:1fr}
        .sidebar{display:none}
        .hero-card,.grid,.two{grid-template-columns:1fr}
        .topbar{display:block}
        .profile{margin-top:15px;width:max-content}
      }
    </style>

    <div class="layout">
      <aside class="sidebar">
        <div class="brand">📖 Shepherd Library</div>

        <div class="nav">
          <a class="active" href="#">🏠 Dashboard</a>
          <a href="#">📖 Bible Reader</a>
          <a href="#">🤖 AI Bible Assistant</a>
          <a href="#">📝 Sermon Builder</a>
          <a href="#">🙏 Prayer Journal</a>
          <a href="#">📚 Study Notes</a>
          <a href="#">⭐ Bookmarks</a>
          <a href="media.html">🎥 Media & Presentation Builder</a>
          <a href="account.html">⚙️ Account Settings</a>
          <a href="research.html">📚 Christian Research Library</a>
          <a href="podcast-teaching-notes.html">🎙️ Podcast & Teaching Notes</a>
          <a href="bible-reader.html">📖 Bible Reader</a>
          <a href="prayer-journal.html">Prayer Journal</a>
          <a href="sermon-builder.html">📝 AI Sermon Builder</a>
        </div>

        <div class="upgrade">
          <h3>Upgrade to Pastor</h3>
          <p>Unlock advanced sermon tools, unlimited study notes, and AI ministry resources.</p>
          <button onclick="window.location.href='pricing.html'">Upgrade</button>
        </div>

        <br>
        <button class="secondary" onclick="logout()">Logout</button>
      </aside>

      <main class="main">
        <div class="topbar">
          <div>
            <h1>Welcome back, <span id="firstName">Pastor</span></h1>
            <p>Your ministry study workspace is ready.</p>
          </div>

          <div class="profile">
            <div class="avatar" id="avatar">S</div>
            <div>
              <strong id="profileName">Shepherd User</strong>
              <p id="profilePlan">Free Plan</p>
            </div>
          </div>
        </div>

        <section class="hero-card">
          <div>
            <h2>Prepare, study, pray, and lead with clarity.</h2>
            <p>Use your AI-powered ministry dashboard to build sermons, organize Bible notes, save prayers, and prepare teaching resources.</p>
            <button onclick="document.getElementById('sermonTitle').focus()">Create Sermon</button>
          </div>

          <div class="verse-box">
            <h3>Verse of the Day</h3>
            <br>
            <p>“Study to shew thyself approved unto God...”</p>
            <strong>2 Timothy 2:15</strong>
          </div>
        </section>

        <section class="stats">
          <div class="stat">
            <small>Sermons Created</small>
            <h2 id="sermonCount">0</h2>
            <span>Ready for preaching</span>
          </div>

          <div class="stat">
            <small>Prayer Entries</small>
            <h2 id="prayerCount">0</h2>
            <span>Spiritual growth</span>
          </div>

          <div class="stat">
            <small>Study Notes</small>
            <h2 id="noteCount">0</h2>
            <span>Personal library</span>
          </div>

          <div class="stat">
            <small>Current Plan</small>
            <h2 id="planName">Free</h2>
            <span>Upgrade anytime</span>
          </div>
        </section>

        <section class="grid">
          <div class="card">
            <h2>📝 Advanced Sermon Builder</h2>
            <p class="muted">Save sermon ideas, scriptures, outlines, and preaching notes.</p>

            <input id="sermonTitle" placeholder="Sermon Title">
            <input id="sermonScripture" placeholder="Scripture Reference">
            <select id="sermonType">
              <option value="">Select Sermon Type</option>
              <option>Expository</option>
              <option>Topical</option>
              <option>Evangelistic</option>
              <option>Teaching</option>
              <option>Youth Message</option>
            </select>
            <textarea id="sermonNotes" placeholder="Sermon outline, main points, illustrations, application..."></textarea>

            <button class="primary" onclick="saveSermon()">Save Sermon</button>
            <button class="secondary" onclick="clearSermonForm()">Clear</button>

            <br><br>
            <h3>Recent Sermons</h3>
            <div id="sermonList"></div>
          </div>

          <div>
            <div class="card">
              <h2>🙏 Prayer Journal</h2>
              <p class="muted">Write and save personal or ministry prayers.</p>

              <input id="prayerTitle" placeholder="Prayer Title">
              <textarea id="prayerContent" placeholder="Write your prayer request or testimony..."></textarea>

              <button class="primary" onclick="savePrayer()">Save Prayer</button>

              <br><br>
              <h3>Recent Prayers</h3>
              <div id="prayerList"></div>
            </div>

            <div class="card" style="margin-top:24px;">
              <h2>⚡ Quick Ministry Tools</h2>
              <div class="tool-grid">
                <div class="tool">📖 Bible Reader</div>
                <div class="tool">🤖 Ask AI</div>
                <div class="tool">📚 Study Note</div>
                <div class="tool">⭐ Bookmarks</div>
                <div class="tool">⛪ Church Lesson</div>
                <div class="tool">🎤 Sermon Series</div>
              </div>
            </div>
          </div>
        </section>

        <section class="two">
          <div class="card">
            <h2>📚 Study Notes</h2>
            <p class="muted">Create Bible study notes and teaching ideas.</p>
            <input id="noteTitle" placeholder="Study Note Title">
            <textarea id="noteContent" placeholder="Write your Bible study notes..."></textarea>
            <button class="primary" onclick="saveNote()">Save Note</button>
            <div id="noteList"></div>
          </div>

          <div class="card">
            <h2>🚀 Recommended Next Steps</h2>
            <div class="item">
              <h4>Complete Your Profile</h4>
              <p>Add your church, role, and ministry information.</p>
            </div>
            <div class="item">
              <h4>Create Your First Sermon Series</h4>
              <p>Build a multi-week sermon plan for your church.</p>
            </div>
            <div class="item">
              <h4>Upgrade for AI Tools</h4>
              <p>Unlock advanced Bible research and sermon generation.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

async function loadDashboard() {
  const user = await getCurrentUser();
  if (!user) return;

  const profile = await loadUserProfile();

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email ||
    "Shepherd User";

  const first = name.split(" ")[0];

  document.getElementById("firstName").textContent = first;
  document.getElementById("profileName").textContent = name;
  document.getElementById("avatar").textContent = first.charAt(0).toUpperCase();

  const plan = profile?.plan || "Free";
  document.getElementById("profilePlan").textContent = plan + " Plan";
  document.getElementById("planName").textContent = plan;

  await loadSermons();
  await loadPrayers();
  await loadNotes();
}

async function saveSermon() {
  const user = await getCurrentUser();

  const title = document.getElementById("sermonTitle").value;
  const scripture = document.getElementById("sermonScripture").value;
  const notes = document.getElementById("sermonNotes").value;

  if (!title) return alert("Please enter a sermon title.");

  const { error } = await supabaseClient.from("sermons").insert({
    user_id: user.id,
    title,
    scripture,
    notes
  });

  if (error) return alert(error.message);

  clearSermonForm();
  await loadSermons();
}

function clearSermonForm() {
  document.getElementById("sermonTitle").value = "";
  document.getElementById("sermonScripture").value = "";
  document.getElementById("sermonNotes").value = "";
}

async function loadSermons() {
  const { data, error } = await supabaseClient
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return console.error(error.message);

  document.getElementById("sermonCount").textContent = data.length;

  document.getElementById("sermonList").innerHTML = data.slice(0,5).map(item => `
    <div class="item">
      <h4>${item.title}</h4>
      <p>${item.scripture || "No scripture added"}</p>
    </div>
  `).join("");
}

async function savePrayer() {
  const user = await getCurrentUser();

  const title = document.getElementById("prayerTitle").value;
  const content = document.getElementById("prayerContent").value;

  if (!title) return alert("Please enter a prayer title.");

  const { error } = await supabaseClient.from("prayer_entries").insert({
    user_id: user.id,
    title,
    content
  });

  if (error) return alert(error.message);

  document.getElementById("prayerTitle").value = "";
  document.getElementById("prayerContent").value = "";

  await loadPrayers();
}

async function loadPrayers() {
  const { data, error } = await supabaseClient
    .from("prayer_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return console.error(error.message);

  document.getElementById("prayerCount").textContent = data.length;

  document.getElementById("prayerList").innerHTML = data.slice(0,4).map(item => `
    <div class="item">
      <h4>${item.title}</h4>
      <p>${item.content || "No details added"}</p>
    </div>
  `).join("");
}

async function saveNote() {
  const user = await getCurrentUser();

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  if (!title) return alert("Please enter a note title.");

  const { error } = await supabaseClient.from("study_notes").insert({
    user_id: user.id,
    title,
    content
  });

  if (error) return alert(error.message);

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  await loadNotes();
}

async function loadNotes() {
  const { data, error } = await supabaseClient
    .from("study_notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return console.error(error.message);

  document.getElementById("noteCount").textContent = data.length;

  document.getElementById("noteList").innerHTML = data.slice(0,4).map(item => `
    <div class="item">
      <h4>${item.title}</h4>
      <p>${item.content || "No content added"}</p>
    </div>
  `).join("");
}
