require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = process.env.PORT || 7898;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "172.16.10.21",
  database: process.env.DB_NAME || "Encuesta",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5445,
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal que devuelve el formulario HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para manejar la sumisión del formulario
app.post("/submit", async (req, res) => {
  try {
    const {
      name,
      id,
      email,
      phone,
      date,
      route,
      human_aux,
      human_agents,
      human_drivers,
      info_aux,
      info_agents,
      info_drivers,
      service_experience,
      suggestions,
    } = req.body;

    if (!name || !id || !email || !phone || !date || !route) {
      return res
        .status(400)
        .json({ error: "Todos los campos obligatorios deben estar llenos." });
    }

    await pool.query(
      `INSERT INTO surveys (name, id, email, phone, date, route, 
        human_aux, human_agents, human_drivers, 
        info_aux, info_agents, info_drivers, 
        service_experience, suggestions)
       VALUES ($1, $2, $3, $4, $5, $6, 
        $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        name,
        id,
        email,
        phone,
        date,
        route,
        human_aux,
        human_agents,
        human_drivers,
        info_aux,
        info_agents,
        info_drivers,
        service_experience,
        suggestions,
      ]
    );

    res.json({
      message:
        "Gracias por completar la encuesta. ¡Tus respuestas han sido registradas!",
    });
  } catch (error) {
    console.error("Error al insertar datos:", error);
    res
      .status(500)
      .json({
        error:
          "Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.",
      });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
