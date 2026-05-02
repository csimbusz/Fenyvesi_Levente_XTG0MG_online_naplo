const API_URL = "http://localhost:3000/api/notes";

const noteForm = document.getElementById("note-form");
const noteIdInput = document.getElementById("note-id");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notes-list");
const message = document.getElementById("message");
const formTitle = document.getElementById("form-title");
const cancelEditButton = document.getElementById("cancel-edit");

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;

  setTimeout(() => {
    message.textContent = "";
    message.className = "";
  }, 3000);
}

async function loadNotes() {
  try {
    const response = await fetch(API_URL);
    const notes = await response.json();

    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = '<p class="empty-state">Még nincs egy jegyzet sem.</p>';
      return;
    }

    notes.forEach((note) => {
      const noteCard = document.createElement("article");
      noteCard.className = "note-card";

      const updatedDate = new Date(note.updatedAt).toLocaleString("hu-HU");

      noteCard.innerHTML = `
        <h3>${escapeHtml(note.title)}</h3>
        <p>${escapeHtml(note.content)}</p>
        <div class="note-meta">Utoljára módosítva: ${updatedDate}</div>
        <button type="button" data-id="${note.id}">Szerkesztés</button>
      `;

      noteCard.querySelector("button").addEventListener("click", () => {
        startEdit(note);
      });

      notesList.appendChild(noteCard);
    });
  } catch (error) {
    showMessage("Nem sikerült betölteni a jegyzeteket.", "error");
  }
}

async function saveNote(event) {
  event.preventDefault();

  const id = noteIdInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (title.length < 3 || content.length < 3) {
    showMessage("A címnek és a tartalomnak legalább 3 karakteresnek kell lennie.", "error");
    return;
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.error || "Hiba történt a mentés során.", "error");
      return;
    }

    resetForm();
    await loadNotes();

    showMessage(id ? "Jegyzet sikeresen módosítva." : "Jegyzet sikeresen létrehozva.", "success");
  } catch (error) {
    showMessage("Nem sikerült kapcsolódni a szerverhez.", "error");
  }
}

function startEdit(note) {
  noteIdInput.value = note.id;
  titleInput.value = note.title;
  contentInput.value = note.content;
  formTitle.textContent = "Jegyzet szerkesztése";
  cancelEditButton.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  noteIdInput.value = "";
  titleInput.value = "";
  contentInput.value = "";
  formTitle.textContent = "Új jegyzet";
  cancelEditButton.classList.add("hidden");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

noteForm.addEventListener("submit", saveNote);
cancelEditButton.addEventListener("click", resetForm);

loadNotes();