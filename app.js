// Importamos las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

// Configuración de la conexión a la base de datos
const pool = new Pool({
  host: '172.16.10.21',
  database: 'Encuesta',
  user: 'postgres',
  password: 'postgres',
  port: 5445
});

// Configuramos el servidor Express
const app = express();
const port = 7898;

// Middleware para procesar datos JSON y formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal que devuelve el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para manejar la sumisión del formulario
app.post('/submit', async (req, res) => {
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
    suggestions
  } = req.body;

  try {
    // Insertamos los datos en la base de datos
    await pool.query(
      `INSERT INTO surveys (name, id, email, phone, date, route, human_aux, human_agents, human_drivers, info_aux, info_agents, info_drivers, service_experience, suggestions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [name, id, email, phone, date, route, human_aux, human_agents, human_drivers, info_aux, info_agents, info_drivers, service_experience, suggestions]
    );
    res.send('Gracias por completar la encuesta. ¡Tus respuestas han sido registradas!');
  } catch (error) {
    console.error('Error al insertar datos:', error);
    res.status(500).send('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
  }
});

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});