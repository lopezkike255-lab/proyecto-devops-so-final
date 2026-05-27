const express = require("express");
const os = require("os");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "devops_user",
  password: process.env.DB_PASSWORD || "devops_password",
  database: process.env.DB_NAME || "devops_db"
});

const formatBytes = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
};

const layout = (title, content) => `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: Arial, Helvetica, sans-serif;
        background: linear-gradient(135deg, #0f172a, #1e3a8a, #0f766e);
        color: #0f172a;
        min-height: 100vh;
      }

      .container {
        width: 92%;
        max-width: 1180px;
        margin: auto;
        padding: 35px 0;
      }

      .panel {
        background: rgba(255, 255, 255, 0.96);
        border-radius: 20px;
        padding: 45px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.20);
      }

      .center {
        text-align: center;
      }

      .badge {
        display: inline-block;
        background: #dbeafe;
        color: #1d4ed8;
        padding: 8px 18px;
        border-radius: 30px;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 18px;
      }

      h1 {
        font-size: 42px;
        margin-bottom: 12px;
        color: #0f172a;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 15px;
        color: #0f172a;
      }

      .subtitle {
        font-size: 20px;
        color: #475569;
        margin-bottom: 25px;
      }

      .description {
        max-width: 900px;
        margin: auto;
        font-size: 17px;
        line-height: 1.8;
        color: #334155;
      }

      .section-title {
        margin-top: 40px;
        margin-bottom: 18px;
        font-size: 26px;
        color: #ffffff;
        text-align: center;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 22px;
        margin-top: 25px;
      }

      .card {
        background: #ffffff;
        border-radius: 18px;
        padding: 25px;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        border-top: 6px solid #2563eb;
      }

      .card h3 {
        font-size: 21px;
        color: #1e293b;
        margin-bottom: 12px;
      }

      .card p {
        color: #475569;
        font-size: 15px;
        line-height: 1.7;
      }

      .status-box {
        margin-top: 35px;
        background: #ecfdf5;
        border: 1px solid #86efac;
        border-radius: 18px;
        padding: 25px;
        text-align: center;
      }

      .status-box h2 {
        color: #065f46;
        margin-bottom: 10px;
      }

      .status-box p {
        color: #047857;
        font-size: 16px;
        line-height: 1.7;
      }

      .warning-box {
        margin-top: 25px;
        background: #fffbeb;
        border: 1px solid #facc15;
        border-radius: 18px;
        padding: 22px;
        text-align: center;
      }

      .warning-box h2 {
        color: #92400e;
        margin-bottom: 10px;
      }

      .warning-box p {
        color: #92400e;
        font-size: 16px;
        line-height: 1.6;
      }

      .error-box {
        margin-top: 35px;
        background: #fef2f2;
        border: 1px solid #fca5a5;
        border-radius: 18px;
        padding: 25px;
        text-align: center;
      }

      .error-box h2 {
        color: #991b1b;
        margin-bottom: 10px;
      }

      .error-box p {
        color: #b91c1c;
        font-size: 16px;
        line-height: 1.7;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
        margin-top: 30px;
      }

      .info-item {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 20px;
        text-align: left;
      }

      .info-item span {
        display: block;
        color: #64748b;
        font-size: 14px;
        margin-bottom: 7px;
      }

      .info-item strong {
        color: #0f172a;
        font-size: 18px;
        word-break: break-word;
      }

      .table-wrapper {
        overflow-x: auto;
        margin-top: 30px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: #ffffff;
        border-radius: 14px;
        overflow: hidden;
      }

      th {
        background: #1e3a8a;
        color: white;
        padding: 15px;
        text-align: left;
      }

      td {
        padding: 15px;
        border-bottom: 1px solid #e2e8f0;
        color: #334155;
      }

      tr:last-child td {
        border-bottom: none;
      }

      .completed {
        display: inline-block;
        background: #dcfce7;
        color: #166534;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 13px;
      }

      .buttons {
        margin-top: 28px;
        display: flex;
        justify-content: center;
        gap: 15px;
        flex-wrap: wrap;
      }

      .button {
        text-decoration: none;
        padding: 13px 24px;
        border-radius: 10px;
        font-weight: bold;
        transition: 0.3s;
      }

      .primary {
        background: #2563eb;
        color: white;
      }

      .primary:hover {
        background: #1d4ed8;
      }

      .secondary {
        background: #e2e8f0;
        color: #0f172a;
      }

      .secondary:hover {
        background: #cbd5e1;
      }

      .footer {
        margin-top: 35px;
        text-align: center;
        color: #e2e8f0;
        font-size: 14px;
      }

      @media (max-width: 768px) {
        .panel {
          padding: 30px 20px;
        }

        h1 {
          font-size: 30px;
        }

        .subtitle {
          font-size: 17px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      ${content}

      <div class="footer">
        Autor: Jonathan Enrique López | Proyecto académico de Sistemas Operativos II
      </div>
    </div>
  </body>
  </html>
`;

app.get("/", (req, res) => {
  res.send(
    layout(
      "Proyecto DevOps - Sistemas Operativos II",
      `
      <div class="panel center">
        <div class="badge">Proyecto Final</div>

        <h1>Proyecto DevOps - Sistemas Operativos II</h1>

        <p class="subtitle">
          Infraestructura Cloud, Docker, Nginx y Automatización CI/CD
        </p>

        <p class="description">
          Este proyecto demuestra la implementación de una infraestructura DevOps en la nube,
          utilizando Google Cloud Platform, contenedores Docker, Nginx como reverse proxy,
          PostgreSQL como base de datos y GitHub Actions como herramienta de integración
          y despliegue continuo.
        </p>

        <div class="buttons">
          <a href="/health" class="button primary">Ver estado de la API</a>
          <a href="/api/tareas" class="button secondary">Ver tareas del proyecto</a>
          <a href="/monitor" class="button secondary">Ver monitoreo</a>
          <a href="/db" class="button secondary">Ver base de datos</a>
        </div>
      </div>

      <h2 class="section-title">Componentes Implementados</h2>

      <div class="cards">
        <div class="card">
          <h3>Aplicación Web</h3>
          <p>
            Aplicación desarrollada con Node.js y Express para demostrar el funcionamiento
            del servicio web desplegado dentro de la infraestructura DevOps.
          </p>
        </div>

        <div class="card">
          <h3>Docker</h3>
          <p>
            La aplicación fue contenerizada para garantizar portabilidad, consistencia
            y facilidad de despliegue en distintos entornos.
          </p>
        </div>

        <div class="card">
          <h3>Nginx / Reverse Proxy</h3>
          <p>
            Se implementó Nginx como punto de entrada principal del sistema,
            redirigiendo el tráfico HTTP desde el puerto 80 hacia la aplicación
            Node.js ejecutada en contenedores Docker.
          </p>
        </div>

        <div class="card">
          <h3>Google Cloud</h3>
          <p>
            Se utilizó una máquina virtual en Google Cloud Platform para alojar
            el entorno de ejecución del proyecto y exponer la aplicación mediante IP pública.
          </p>
        </div>

        <div class="card">
          <h3>GitHub Actions</h3>
          <p>
            Se configuró un pipeline CI/CD que automatiza la construcción,
            prueba y despliegue de la aplicación hacia la infraestructura cloud.
          </p>
        </div>

        <div class="card">
          <h3>Monitoreo</h3>
          <p>
            Se implementó una sección de monitoreo básico para verificar el estado,
            tiempo activo y consumo de memoria del servicio.
          </p>
        </div>

        <div class="card">
          <h3>Base de Datos</h3>
          <p>
            Se integró PostgreSQL como contenedor dentro de Docker Compose,
            permitiendo validar conectividad entre servicios.
          </p>
        </div>

        <div class="card">
          <h3>Seguridad Básica</h3>
          <p>
            Se aplicaron llaves SSH, GitHub Secrets y reglas de firewall para controlar
            accesos y proteger credenciales del despliegue.
          </p>
        </div>
      </div>

      <div class="status-box">
        <h2>Estado del Sistema</h2>
        <p>
          La aplicación se encuentra desplegada correctamente en Google Cloud.
          El tráfico ingresa mediante Nginx como reverse proxy y el pipeline CI/CD
          permite actualizar el sistema automáticamente desde GitHub Actions.
        </p>
      </div>
      `
    )
  );
});

app.get("/health", (req, res) => {
  res.send(
    layout(
      "Estado de la API",
      `
      <div class="panel center">
        <div class="badge">Health Check</div>

        <h1>Estado de la API</h1>

        <p class="subtitle">
          Verificación del servicio desplegado en contenedor Docker
        </p>

        <p class="description">
          Esta sección permite validar que la aplicación web se encuentra activa,
          respondiendo correctamente y ejecutándose dentro del entorno de despliegue configurado.
        </p>

        <div class="info-grid">
          <div class="info-item">
            <span>Estado</span>
            <strong>OK</strong>
          </div>

          <div class="info-item">
            <span>Servicio</span>
            <strong>API DevOps</strong>
          </div>

          <div class="info-item">
            <span>Entorno</span>
            <strong>Docker</strong>
          </div>

          <div class="info-item">
            <span>Entrada HTTP</span>
            <strong>Nginx Reverse Proxy</strong>
          </div>

          <div class="info-item">
            <span>Despliegue</span>
            <strong>Google Cloud</strong>
          </div>

          <div class="info-item">
            <span>Automatización</span>
            <strong>GitHub Actions</strong>
          </div>

          <div class="info-item">
            <span>Resultado</span>
            <strong>Funcionando</strong>
          </div>
        </div>

        <div class="status-box">
          <h2>Servicio Operativo</h2>
          <p>
            La API se encuentra funcionando correctamente y responde de forma estable
            desde la infraestructura cloud configurada para el proyecto.
          </p>
        </div>

        <div class="buttons">
          <a href="/" class="button primary">Regresar al inicio</a>
          <a href="/api/tareas" class="button secondary">Ver tareas</a>
          <a href="/monitor" class="button secondary">Ver monitoreo</a>
          <a href="/db" class="button secondary">Ver base de datos</a>
        </div>
      </div>
      `
    )
  );
});

app.get("/api/tareas", (req, res) => {
  const tareas = [
    {
      id: 1,
      tarea: "Crear aplicación web con Node.js y Express",
      estado: "Completado"
    },
    {
      id: 2,
      tarea: "Crear Dockerfile para contenerizar la aplicación",
      estado: "Completado"
    },
    {
      id: 3,
      tarea: "Configurar Docker Compose",
      estado: "Completado"
    },
    {
      id: 4,
      tarea: "Subir el código fuente a GitHub",
      estado: "Completado"
    },
    {
      id: 5,
      tarea: "Crear máquina virtual en Google Cloud",
      estado: "Completado"
    },
    {
      id: 6,
      tarea: "Configurar despliegue automático con GitHub Actions",
      estado: "Completado"
    },
    {
      id: 7,
      tarea: "Agregar monitoreo básico del servicio",
      estado: "Completado"
    },
    {
      id: 8,
      tarea: "Aplicar seguridad básica con SSH, Secrets y Firewall",
      estado: "Completado"
    },
    {
      id: 9,
      tarea: "Integrar base de datos PostgreSQL en Docker Compose",
      estado: "Completado"
    },
    {
      id: 10,
      tarea: "Implementar Nginx como reverse proxy para la aplicación",
      estado: "Completado"
    }
  ];

  const filas = tareas
    .map(
      (item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.tarea}</td>
        <td><span class="completed">${item.estado}</span></td>
      </tr>
    `
    )
    .join("");

  res.send(
    layout(
      "Tareas del Proyecto",
      `
      <div class="panel">
        <div class="center">
          <div class="badge">Seguimiento del Proyecto</div>

          <h1>Tareas del Proyecto</h1>

          <p class="subtitle">
            Control de actividades implementadas durante el desarrollo del proyecto DevOps
          </p>

          <p class="description">
            Esta sección muestra las tareas principales realizadas para completar la
            implementación de la aplicación, el despliegue en la nube, la automatización CI/CD,
            el monitoreo, la base de datos, Nginx y la seguridad básica.
          </p>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Actividad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filas}
            </tbody>
          </table>
        </div>

        <div class="status-box">
          <h2>Avance General</h2>
          <p>
            Todas las actividades principales del proyecto se encuentran completadas,
            incluyendo aplicación web, contenerización, repositorio GitHub,
            despliegue cloud, pipeline CI/CD, monitoreo, base de datos,
            Nginx como reverse proxy y seguridad básica.
          </p>
        </div>

        <div class="buttons">
          <a href="/" class="button primary">Regresar al inicio</a>
          <a href="/health" class="button secondary">Ver estado de la API</a>
          <a href="/monitor" class="button secondary">Ver monitoreo</a>
          <a href="/db" class="button secondary">Ver base de datos</a>
        </div>
      </div>
      `
    )
  );
});

app.get("/monitor", (req, res) => {
  const memoryUsage = process.memoryUsage();

  const monitorData = {
    estado: "Operativo",
    uptimeAplicacion: formatUptime(process.uptime()),
    uptimeServidor: formatUptime(os.uptime()),
    memoriaRSS: formatBytes(memoryUsage.rss),
    heapUsado: formatBytes(memoryUsage.heapUsed),
    heapTotal: formatBytes(memoryUsage.heapTotal),
    plataforma: os.platform(),
    arquitectura: os.arch(),
    hostname: os.hostname(),
    puerto: PORT,
    fechaRevision: new Date().toLocaleString("es-GT")
  };

  res.send(
    layout(
      "Monitoreo del Sistema",
      `
      <div class="panel center">
        <div class="badge">Monitoreo Básico</div>

        <h1>Monitoreo del Sistema</h1>

        <p class="subtitle">
          Supervisión básica del servicio desplegado en Google Cloud
        </p>

        <p class="description">
          Esta sección muestra métricas básicas del estado de la aplicación,
          consumo de memoria, tiempo activo y datos generales del entorno de ejecución.
        </p>

        <div class="info-grid">
          <div class="info-item">
            <span>Estado</span>
            <strong>${monitorData.estado}</strong>
          </div>

          <div class="info-item">
            <span>Tiempo activo de la aplicación</span>
            <strong>${monitorData.uptimeAplicacion}</strong>
          </div>

          <div class="info-item">
            <span>Tiempo activo del servidor</span>
            <strong>${monitorData.uptimeServidor}</strong>
          </div>

          <div class="info-item">
            <span>Memoria RSS</span>
            <strong>${monitorData.memoriaRSS}</strong>
          </div>

          <div class="info-item">
            <span>Heap usado</span>
            <strong>${monitorData.heapUsado}</strong>
          </div>

          <div class="info-item">
            <span>Heap total</span>
            <strong>${monitorData.heapTotal}</strong>
          </div>

          <div class="info-item">
            <span>Plataforma</span>
            <strong>${monitorData.plataforma}</strong>
          </div>

          <div class="info-item">
            <span>Arquitectura</span>
            <strong>${monitorData.arquitectura}</strong>
          </div>

          <div class="info-item">
            <span>Hostname</span>
            <strong>${monitorData.hostname}</strong>
          </div>

          <div class="info-item">
            <span>Puerto interno</span>
            <strong>${monitorData.puerto}</strong>
          </div>

          <div class="info-item">
            <span>Entrada pública</span>
            <strong>Puerto 80 mediante Nginx</strong>
          </div>

          <div class="info-item">
            <span>Última revisión</span>
            <strong>${monitorData.fechaRevision}</strong>
          </div>

          <div class="info-item">
            <span>Proveedor Cloud</span>
            <strong>Google Cloud</strong>
          </div>
        </div>

        <div class="status-box">
          <h2>Servicio Operativo</h2>
          <p>
            La aplicación se encuentra en ejecución y responde correctamente desde
            el entorno contenerizado desplegado en la nube.
          </p>
        </div>

        <div class="warning-box">
          <h2>Seguridad Básica Aplicada</h2>
          <p>
            El despliegue utiliza acceso SSH mediante llaves, GitHub Secrets para proteger
            credenciales, Nginx como punto de entrada HTTP y reglas de firewall para controlar
            el acceso a la máquina virtual.
          </p>
        </div>

        <div class="buttons">
          <a href="/" class="button primary">Regresar al inicio</a>
          <a href="/health" class="button secondary">Ver estado de la API</a>
          <a href="/api/tareas" class="button secondary">Ver tareas</a>
          <a href="/db" class="button secondary">Ver base de datos</a>
        </div>
      </div>
      `
    )
  );
});

app.get("/monitoreo", (req, res) => {
  res.redirect("/monitor");
});

app.get("/db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS fecha_servidor, current_database() AS base_datos, current_user AS usuario"
    );

    const dbData = result.rows[0];

    res.send(
      layout(
        "Estado de Base de Datos",
        `
        <div class="panel center">
          <div class="badge">PostgreSQL</div>

          <h1>Estado de Base de Datos</h1>

          <p class="subtitle">
            Validación de conectividad entre la aplicación y el contenedor PostgreSQL
          </p>

          <p class="description">
            Esta sección confirma que la aplicación Node.js puede comunicarse correctamente
            con el servicio de base de datos ejecutado dentro de Docker Compose.
          </p>

          <div class="info-grid">
            <div class="info-item">
              <span>Estado de conexión</span>
              <strong>Conectado</strong>
            </div>

            <div class="info-item">
              <span>Motor de base de datos</span>
              <strong>PostgreSQL</strong>
            </div>

            <div class="info-item">
              <span>Host interno</span>
              <strong>${process.env.DB_HOST || "db"}</strong>
            </div>

            <div class="info-item">
              <span>Puerto</span>
              <strong>${process.env.DB_PORT || "5432"}</strong>
            </div>

            <div class="info-item">
              <span>Base de datos</span>
              <strong>${dbData.base_datos}</strong>
            </div>

            <div class="info-item">
              <span>Usuario</span>
              <strong>${dbData.usuario}</strong>
            </div>

            <div class="info-item">
              <span>Fecha del servidor DB</span>
              <strong>${dbData.fecha_servidor}</strong>
            </div>

            <div class="info-item">
              <span>Contenedor</span>
              <strong>db-devops-so-final</strong>
            </div>
          </div>

          <div class="status-box">
            <h2>Base de Datos Operativa</h2>
            <p>
              La conexión con PostgreSQL fue establecida correctamente.
              Esto confirma la comunicación interna entre contenedores dentro de Docker Compose.
            </p>
          </div>

          <div class="buttons">
            <a href="/" class="button primary">Regresar al inicio</a>
            <a href="/health" class="button secondary">Ver estado de la API</a>
            <a href="/monitor" class="button secondary">Ver monitoreo</a>
            <a href="/api/tareas" class="button secondary">Ver tareas</a>
          </div>
        </div>
        `
      )
    );
  } catch (error) {
    res.send(
      layout(
        "Error de Base de Datos",
        `
        <div class="panel center">
          <div class="badge">PostgreSQL</div>

          <h1>Error de Conexión a Base de Datos</h1>

          <p class="subtitle">
            No se pudo establecer comunicación con el contenedor PostgreSQL.
          </p>

          <div class="error-box">
            <h2>Conexión fallida</h2>
            <p>
              Error detectado: ${error.message}
            </p>
          </div>

          <div class="buttons">
            <a href="/" class="button primary">Regresar al inicio</a>
            <a href="/monitor" class="button secondary">Ver monitoreo</a>
          </div>
        </div>
        `
      )
    );
  }
});

app.get("/database", (req, res) => {
  res.redirect("/db");
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en el puerto ${PORT}`);
});