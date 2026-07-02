// ===============================
// Premium Dashboard UI
// The Shepherd's Library
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  await protectDashboard();
  renderDashboard();
  await loadDashboardData();
});

async function protectDashboard() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "login.html";
  }
}

function renderDashboard() {
  document.getElementById("app").innerHTML = `
    <div class="dashboard">

      <aside class="sidebar">
        <div class="logo">📖 Shepherd</div>

        <div class="nav-item active">🏠 Dashboard</div>
        <div class="nav-item">📖 Bible Reader</div>
        <div class="nav-item">🤖 AI Assistant</div>
        <div class="nav-item">📝 Sermon Builder</div>
        <div class="nav-item">🙏 Prayer Journal</div>
        <div class="nav-item">📚 Study Notes</div>
        <div class="nav-item">⭐ Bookmarks</div>
        <div class="nav-item">⚙️ Settings</div>

        <br><br>
        <button onclick="logout()">Logout</button>
      </aside>

      <main class="main">
        <div class="topbar">
          <div>
            <h1>Welcome back, <span id="userName">Pastor</span></h1>
            <p>Continue your Bible study, sermon preparation, and prayer journey.</p>
          </div>

          <div class="profile">
            <div class="avatar" id="avatar">S</div>
            <div>
              <strong id="profileName">Shepherd User</strong>
              <p id="profilePlan">Free Plan</p>
            </div>
          </div>
        </div>

        <section class="grid">
          <div class="card">
            <h3>Sermons Created</h3>
            <strong id="sermonCount">0</strong>
          </div>

          <div class="card">
            <h3>Prayer Entries</h3>
            <strong id="prayerCount">0</strong>
          </div>

          <div class="card">
            <h3>Study Notes</h3>
            <strong id="noteCount">0</strong>
          </div>

          <div class="card">
            <h3>Current Plan</h3>
            <strong id="planName">Free</strong>
          </div>
        </section>

        <section class="content-grid">
          <div class="card">
            <h2>📝 Quick Sermon Builder</h2>
            <p>Create and save a sermon idea quickly.</p>

            <input id="sermonTitle" placeholder="Sermon Title">
            <input id="sermonScripture" placeholder="Scripture Reference">
            <textarea id="sermonNotes" placeholder="Write sermon notes..."></textarea>

            <button onclick="saveSermon()">Save Sermon</button>

            <br><br>
            <h3>Recent Sermons</h3>
            <div id="sermonList"></div>
          </div>

          <div>
            <div class="card">
              <h2>🙏 Prayer Journal</h2>

              <input id="prayerTitle" placeholder="Prayer Title">
              <textarea id="prayerContent" placeholder="Write your prayer..."></textarea>

              <button onclick="savePrayer()">Save Prayer</button>

              <br><br>
              <h3>Recent Prayers</h3>
              <div id="prayerList"></div>
            </div>

            <br>

            <div class="card">
              <h2>Quick Actions</h2>

              <div class="quick-actions">
                <div class="action">📖 Open Bible Reader</div>
                <div class="action">🤖 Ask AI Bible Assistant</div>
                <div class="action">📚 Create Study Note</div>
                <div class="action">⭐ View Bookmarks</div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  `;
}

async function loadDashboardData() {
  const user = await getCurrentUser();

  if (!user) return;

  const profile = await loadUserProfile();

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email ||
    "Pastor";

  document.getElementById("userName").textContent = name.split(" ")[0];
  document.getElementById("profileName").textContent = name;
  document.getElementById("avatar").textContent = name.charAt(0).toUpperCase();

  const plan = profile?.plan || "Free";
  document.getElementById("profilePlan").textContent = plan + " Plan";
  document.getElementById("planName").textContent = plan;

  await loadSermons();
  await loadPrayers();
}

async function saveSermon() {
  const user = await getCurrentUser();

  const title = document.getElementById("sermonTitle").value;
  const scripture = document.getElementById("sermonScripture").value;
  const notes = document.getElementById("sermonNotes").value;

  if (!title) {
    alert("Please enter a sermon title.");
    return;
  }

  const { error } = await supabaseClient
    .from("sermons")
    .insert({
      user_id: user.id,
      title,
      scripture,
      notes
    });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("sermonTitle").value = "";
  document.getElementById("sermonScripture").value = "";
  document.getElementById("sermonNotes").value = "";

  await loadSermons();
}

async function loadSermons() {
  const { data, error } = await supabaseClient
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return;
  }

  document.getElementById("sermonCount").textContent = data.length;

  const sermonList = document.getElementById("sermonList");
  sermonList.innerHTML = "";

  data.slice(0, 5).forEach((sermon) => {
    sermonList.innerHTML += `
      <div class="list-item">
        <h4>${sermon.title}</h4>
        <p>${sermon.scripture || "No scripture added"}</p>
      </div>
    `;
  });
}

async function savePrayer() {
  const user = await getCurrentUser();

  const title = document.getElementById("prayerTitle").value;
  const content = document.getElementById("prayerContent").value;

  if (!title) {
    alert("Please enter a prayer title.");
    return;
  }

  const { error } = await supabaseClient
    .from("prayer_entries")
    .insert({
      user_id: user.id,
      title,
      content
    });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("prayerTitle").value = "";
  document.getElementById("prayerContent").value = "";

  await loadPrayers();
}

async function loadPrayers() {
  const { data, error } = await supabaseClient
    .from("prayer_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return;
  }

  document.getElementById("prayerCount").textContent = data.length;

  const prayerList = document.getElementById("prayerList");
  prayerList.innerHTML = "";

  data.slice(0, 5).forEach((prayer) => {
    prayerList.innerHTML += `
      <div class="list-item">
        <h4>${prayer.title}</h4>
        <p>${prayer.content || "No details added"}</p>
      </div>
    `;
  });
}
