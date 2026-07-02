async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user;
}

async function savePrayer() {
  const user = await getUser();

  const title = document.getElementById("prayerTitle").value;
  const content = document.getElementById("prayerContent").value;

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

  loadPrayers();
}

async function loadPrayers() {
  const { data, error } = await supabaseClient
    .from("prayer_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  const prayerList = document.getElementById("prayerList");
  prayerList.innerHTML = "";

  data.forEach((prayer) => {
    prayerList.innerHTML += `
      <div>
        <h3>${prayer.title}</h3>
        <p>${prayer.content}</p>
        <button onclick="deletePrayer('${prayer.id}')">Delete</button>
      </div>
      <hr>
    `;
  });
}

async function deletePrayer(id) {
  const { error } = await supabaseClient
    .from("prayer_entries")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadPrayers();
}

async function saveSermon() {
  const user = await getUser();

  const title = document.getElementById("sermonTitle").value;
  const scripture = document.getElementById("sermonScripture").value;
  const notes = document.getElementById("sermonNotes").value;

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

  loadSermons();
}

async function loadSermons() {
  const { data, error } = await supabaseClient
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  const sermonList = document.getElementById("sermonList");
  sermonList.innerHTML = "";

  data.forEach((sermon) => {
    sermonList.innerHTML += `
      <div>
        <h3>${sermon.title}</h3>
        <p><strong>Scripture:</strong> ${sermon.scripture}</p>
        <p>${sermon.notes}</p>
        <button onclick="deleteSermon('${sermon.id}')">Delete</button>
      </div>
      <hr>
    `;
  });
}

async function deleteSermon(id) {
  const { error } = await supabaseClient
    .from("sermons")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadSermons();
}

loadPrayers();
loadSermons();
