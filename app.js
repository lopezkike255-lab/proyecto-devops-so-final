const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Proyecto DevOps - Sistemas Operativos II</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
        }

        body {
          background: linear-gradient(135deg, #0f172a, #1e3a8a, #0f766e);
          min-height: 100vh;
          color: #1f2937;
        }

        .container {
          width: 90%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .hero {
          background: rgba(255, 255, 255, 0.96);
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
          text-align: center;
        }

        .badge {
          display: inline-block;
          background: #dbeafe;
          color: #1d4ed8;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 42px;
          color: #0f172a;
          margin-bottom: 15px;
        }

        .subtitle {
          font-size: 20px;
          color: #475569;
          margin-bottom: 30px;
        }

        .description {
          font-size: 17px;
          line-height: 1.8;
          color: #334155;
          max-width: 850px;
          margin: 0 auto 35px auto;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 25px 20px;
          text-align: left;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
        }

        .card h3 {
          color: #0f172a;
          margin-bottom: 10px;
          font-size: 20px;
        }

        .card p {
          color: #475569;
          font-size: 15px;
          line-height: 1.6;
        }

        .status-section {
          margin-top: 35px;
          padding: 20px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 14px;
        }

        .status-title {
          color: #065f46;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .status-text {
          color: #047857;
          font-size: 16px;
          line-height: 1.6;
        }

        .footer {
          margin-top: 35px;
          font-size: 14px;
          color: #64748b;
        }

        .btn-group {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .btn {
          text-decoration: none;
          padding: 12px 22px;
          border-radius: 10px;
          font-weight: bold;
          transition: 0.3s ease;
          display: inline-block;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #0f172a;
        }

        .btn-secondary:hover {
          background: #cbd5e1;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 30px;
          }

          .subtitle {
            font-size: 18px;
          }

          .hero {
            padding: 35px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="hero">
          <div class="badge">Proyecto Final</div>
          <h1>Proyecto DevOps - Sistemas Operativos II</h1>
          <p class="subtitle">Infraestructura Cloud, Contenedores Docker y Automatización CI/CD</p>

          <p class="description">
            Bienvenido al proyecto final desarrollado para el curso de <strong>Sistemas Operativos II</strong>.
            Esta aplicación demuestra la implementación de una solución web moderna desplegada en
            <strong>contenedores Docker</strong>, alojada en <strong>Google Cloud</strong> y automatizada mediante
            un pipeline de <strong>Integración y Despliegue Continuo (CI/CD)</strong> con <strong>GitHub Actions</strong>.
          </p>

          <div class="grid">
            <div class="card">
              <h3>Aplicación Web</h3>
              <p>
                Desarrollo de una aplicación Node.js con Express, diseñada para validar el funcionamiento
                de la arquitectura propuesta.
              </p>
            </div>

            <div class="card">
              <h3>Docker</h3>
              <p>
                Contenerización del sistema para garantizar portabilidad, consistencia y facilidad
                de despliegue en distintos entornos.
              </p>
            </div>

            <div class="card">
              <h3>Google Cloud</h3>
              <p>
                Implementación de la infraestructura en una máquina virtual de Google Cloud Platform,
                asegurando disponibilidad y acceso remoto.
              </p>
            </div>

            <div class="card">
              <h3>GitHub Actions</h3>
              <p>
                Automatización del proceso de integración, prueba y despliegue continuo para mantener
                el sistema actualizado de forma eficiente.
              </p>
            </div>
          </div>

          <div class="status-section">
            <div class="status-title">Estado del sistema</div>
            <div class="status-text">
              La aplicación se encuentra desplegada y operativa correctamente.
              El pipeline CI/CD ha sido configurado y ejecutado exitosamente desde GitHub Actions.
            </div>
          </div>

          <div class="btn-group">
            <a href="/health" class="btn btn-primary">Ver estado de la API</a>
            <a href="/api/tareas" class="btn btn-secondary">Ver tareas del proyecto</a>
          </div>

          <div class="footer">
            Autor: Jonathan Enrique López | Proyecto académico de DevOps
          </div>
        </div>
      </div>
    </body>
    </html>
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
      estado: "Completado"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(\`Servidor ejecutandose en el puerto \${PORT}\`);
});