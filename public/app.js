const $ = (id) => document.getElementById(id);
const authView = $("auth-view");
const appView = $("app-view");
let isRegister = false;
let currentUser = null;

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

function showMessage(id, message, success = false) {
  const el = $(id);
  el.textContent = message;
  el.style.color = success ? "#27845c" : "#c04455";
}

function setAuthMode(register) {
  isRegister = register;
  $("auth-title").textContent = register ? "Create your account" : "Welcome back";
  $("auth-submit").textContent = register ? "Create account" : "Sign in";
  $("name-field").classList.toggle("hidden", !register);
  $("name").required = register;
  $("password").autocomplete = register ? "new-password" : "current-password";
  $("switch-text").textContent = register ? "Already have an account?" : "New here?";
  $("switch-mode").textContent = register ? "Sign in" : "Create an account";
  showMessage("auth-message", "");
}

$("switch-mode").addEventListener("click", () => setAuthMode(!isRegister));

$("auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = {
    email: $("email").value.trim(),
    password: $("password").value
  };
  if (isRegister) body.name = $("name").value.trim();
  try {
    const data = await api(`/api/auth/${isRegister ? "register" : "login"}`, {
      method: "POST", body: JSON.stringify(body)
    });
    currentUser = data.user;
    $("auth-form").reset();
    await showApp();
  } catch (error) {
    showMessage("auth-message", error.message);
  }
});

async function showApp() {
  authView.classList.add("hidden");
  appView.classList.remove("hidden");
  $("welcome-text").textContent = `Signed in as ${currentUser.name} · ${currentUser.email}`;
  await loadNotes();
}

async function loadNotes() {
  try {
    const { notes } = await api("/api/notes");
    $("notes-list").replaceChildren();
    $("note-count").textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
    $("empty-state").classList.toggle("hidden", notes.length !== 0);
    notes.forEach(renderNote);
  } catch (error) {
    showMessage("note-message", error.message);
  }
}

function renderNote(note) {
  const card = document.createElement("article");
  card.className = "note-card";
  const title = document.createElement("h3");
  title.textContent = note.title;
  const content = document.createElement("p");
  content.textContent = note.content;
  const date = document.createElement("div");
  date.className = "note-meta";
  date.textContent = `Updated ${new Date(note.updatedAt).toLocaleString()}`;
  const actions = document.createElement("div");
  actions.className = "note-actions";
  const edit = document.createElement("button");
  edit.className = "secondary";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => {
    $("note-id").value = note._id;
    $("note-title").value = note.title;
    $("note-content").value = note.content;
    $("editor-heading").textContent = "Edit note";
    $("save-note").textContent = "Update note";
    $("cancel-edit").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const remove = document.createElement("button");
  remove.className = "delete";
  remove.textContent = "Delete";
  remove.addEventListener("click", async () => {
    if (!confirm("Delete this note?")) return;
    try { await api(`/api/notes/${note._id}`, { method: "DELETE" }); await loadNotes(); }
    catch (error) { showMessage("note-message", error.message); }
  });
  actions.append(edit, remove);
  card.append(title, content, date, actions);
  $("notes-list").append(card);
}

function resetEditor() {
  $("note-form").reset();
  $("note-id").value = "";
  $("editor-heading").textContent = "Create a note";
  $("save-note").textContent = "Save note";
  $("cancel-edit").classList.add("hidden");
}

$("note-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = $("note-id").value;
  const body = { title: $("note-title").value.trim(), content: $("note-content").value.trim() };
  try {
    await api(id ? `/api/notes/${id}` : "/api/notes", {
      method: id ? "PUT" : "POST", body: JSON.stringify(body)
    });
    resetEditor();
    showMessage("note-message", "Note saved successfully", true);
    await loadNotes();
  } catch (error) { showMessage("note-message", error.message); }
});

$("cancel-edit").addEventListener("click", resetEditor);

$("logout").addEventListener("click", async () => {
  try { await api("/api/auth/logout", { method: "POST" }); } catch (_error) {}
  currentUser = null;
  appView.classList.add("hidden");
  authView.classList.remove("hidden");
  setAuthMode(false);
});

(async function init() {
  try {
    const data = await api("/api/auth/me");
    currentUser = data.user;
    await showApp();
  } catch (_error) {
    authView.classList.remove("hidden");
    appView.classList.add("hidden");
  }
})();