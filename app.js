const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h1>Proyecto DevOps - Sistemas Operativos II</h1>
    <p>Aplicacion web desplegada en contenedores Docker.</p>
    <p>Infraestructura cloud con CI/CD.</p>
    <p>Pipeline CI/CD actualizado y desplegado desde GitHub Actions.</p>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    servicio: "API DevOps",
    mensaje: "Aplicacion funcionando correctamente",
    entorno: "Docker"
  });
});

app.get("/api/tareas", (req, res) => {
  res.json([
    {
      id: 1,
      tarea: "Crear aplicacion web",
      estado: "Completado"
    },
    {
      id: 2,
      tarea: "Contenerizar con Docker",
      estado: "Completado"
    },
    {
      id: 3,
      tarea: "Subir codigo a GitHub",
      estado: "Completado"
    },
    {
      id: 4,
      tarea: "Desplegar en Google Cloud",
      estado: "Completado"
    },
    {
      id: 5,
      tarea: "Implementar pipeline CI/CD con GitHub Actions",
      estado: "En proceso"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en el puerto ${PORT}`);
});