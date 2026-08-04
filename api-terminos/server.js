// Yo creo una API REST sencilla para consultar los términos y condiciones
// de atención de Odontología Guerrero mediante una petición GET.
const http = require("http");

const PORT = Number(process.env.PORT || 3000);

const terminos = [
  {
    id: 1,
    titulo: "Registro de información del paciente",
    contenido:
      "El paciente debe proporcionar información verdadera, completa y actualizada sobre sus datos personales, antecedentes médicos, alergias, medicamentos y condiciones de salud que puedan influir en su atención odontológica.",
  },
  {
    id: 2,
    titulo: "Evaluación y plan de tratamiento",
    contenido:
      "Todo tratamiento será definido después de una evaluación odontológica. El diagnóstico, la duración, el número de sesiones y el costo pueden variar según la condición clínica y la evolución del paciente.",
  },
  {
    id: 3,
    titulo: "Consentimiento informado",
    contenido:
      "Antes de iniciar un procedimiento, el odontólogo explicará al paciente el tratamiento recomendado, sus beneficios, posibles riesgos, alternativas y cuidados posteriores. El paciente podrá realizar las consultas que considere necesarias antes de aceptar el procedimiento.",
  },
  {
    id: 4,
    titulo: "Privacidad y confidencialidad",
    contenido:
      "La información personal y clínica del paciente será utilizada únicamente para la gestión de su atención odontológica. El personal autorizado deberá mantener la confidencialidad de los datos registrados.",
  },
  {
    id: 5,
    titulo: "Citas y puntualidad",
    contenido:
      "El paciente debe asistir puntualmente a sus citas. Cuando no pueda acudir, deberá comunicarlo con anticipación para permitir la reprogramación y evitar retrasos en la continuidad de su tratamiento.",
  },
  {
    id: 6,
    titulo: "Presupuestos y pagos",
    contenido:
      "Los costos serán informados antes de iniciar el tratamiento. Los procedimientos adicionales que resulten necesarios deberán ser comunicados al paciente antes de su realización, salvo situaciones de urgencia debidamente justificadas.",
  },
  {
    id: 7,
    titulo: "Indicaciones y cuidados posteriores",
    contenido:
      "El paciente es responsable de seguir las indicaciones proporcionadas por el odontólogo, asistir a sus controles y comunicar oportunamente cualquier molestia, reacción adversa o cambio relacionado con el tratamiento.",
  },
  {
    id: 8,
    titulo: "Resultados del tratamiento",
    contenido:
      "Los resultados pueden variar según el diagnóstico, la respuesta del organismo, los hábitos de higiene, la asistencia a controles y el cumplimiento de las indicaciones profesionales. No se garantizan resultados idénticos para todos los pacientes.",
  },
  {
    id: 9,
    titulo: "Atención de menores de edad",
    contenido:
      "La atención de pacientes menores de edad deberá realizarse con la autorización y participación de su padre, madre o representante legal, según corresponda.",
  },
  {
    id: 10,
    titulo: "Emergencias odontológicas",
    contenido:
      "La aplicación permite gestionar información y tratamientos, pero no sustituye un servicio de emergencia. Ante dolor intenso, sangrado persistente, inflamación severa, dificultad para respirar o una reacción alérgica, el paciente debe buscar atención inmediata.",
  },
];

function enviarJson(response, statusCode, body) {
  // Yo centralizo las respuestas para mantener el mismo formato JSON.
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  response.end(JSON.stringify(body));
}

const server = http.createServer((request, response) => {
  console.log(`[API] ${request.method} ${request.url}`);

  if (
    request.method === "GET" &&
    request.url === "/api/terminos-condiciones"
  ) {
    // Yo devuelvo los términos y condiciones ordenados de la odontología.
    enviarJson(response, 200, {
      success: true,
      message: "Términos y condiciones cargados correctamente.",
      documento: {
        nombre: "Términos y condiciones de Odontología Guerrero",
        fechaActualizacion: "2026-08-03",
      },
      terminos,
    });

    return;
  }

  // Yo informo cuando la ruta solicitada no existe.
  enviarJson(response, 404, {
    success: false,
    message: "El recurso solicitado no está disponible.",
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `API disponible en http://localhost:${PORT}/api/terminos-condiciones`,
  );
});