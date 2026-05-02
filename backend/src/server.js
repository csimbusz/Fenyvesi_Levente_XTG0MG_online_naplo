const express = require("express");
const cors = require("cors");
const prisma = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Online napló API működik",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json(notes);
  } catch (error) {
    console.error("Hiba a jegyzetek lekérésekor:", error);
    res.status(500).json({
      error: "Szerverhiba történt a jegyzetek lekérésekor.",
    });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "A cím és a tartalom megadása kötelező.",
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        error: "A címnek legalább 3 karakter hosszúnak kell lennie.",
      });
    }

    if (content.trim().length < 3) {
      return res.status(400).json({
        error: "A tartalomnak legalább 3 karakter hosszúnak kell lennie.",
      });
    }

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Hiba a jegyzet létrehozásakor:", error);
    res.status(500).json({
      error: "Szerverhiba történt a jegyzet létrehozásakor.",
    });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Érvénytelen jegyzet azonosító.",
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        error: "A cím és a tartalom megadása kötelező.",
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        error: "A címnek legalább 3 karakter hosszúnak kell lennie.",
      });
    }

    if (content.trim().length < 3) {
      return res.status(400).json({
        error: "A tartalomnak legalább 3 karakter hosszúnak kell lennie.",
      });
    }

    const existingNote = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!existingNote) {
      return res.status(404).json({
        error: "A megadott jegyzet nem található.",
      });
    }

    const updatedNote = await prisma.note.update({
      where: {
        id,
      },
      data: {
        title: title.trim(),
        content: content.trim(),
      },
    });

    res.json(updatedNote);
  } catch (error) {
    console.error("Hiba a jegyzet módosításakor:", error);
    res.status(500).json({
      error: "Szerverhiba történt a jegyzet módosításakor.",
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;