import { EstadoAtencion, Paciente, PrioridadAtencion, TipoTratamiento } from "@/models/Paciente";
import { Usuario } from "@/models/Usuario";

export const USUARIOS: Usuario[] = [
  { id: "1", nombre: "Ruben Zuñiga", email: "ruben@gmail.com", password: "123456" },
  { id: "2", nombre: "Santiago Rosado", email: "santiago@gmail.com", password: "123456" },
];

export const TRATAMIENTOS: TipoTratamiento[] = [
  "CONSULTA",
  "LIMPIEZA",
  "ORTODONCIA",
  "ENDODONCIA",
  "EXTRACCION",
  "BLANQUEAMIENTO",
  
];

export const PRIORIDADES: PrioridadAtencion[] = ["BAJA", "MEDIA", "ALTA"];
export const ESTADOS: EstadoAtencion[] = ["PENDIENTE", "EN_ATENCION", "FINALIZADO"];

// Estos registros simulan la carga inicial de información sin usar base de datos.
export const PACIENTES_INICIALES: Paciente[] = [
  {
    id: "PAC-001",
    pacienteNombre: "Jose Torrealva",
    edad: "30",
    telefono: "987654321",
    tratamiento: "ENDODONCIA",
    prioridad: "ALTA",
    descripcion: "Presenta dolor intenso y sensibilidad persistente en una pieza dental.",
    estado: "PENDIENTE",
    fechaRegistro: "2026-07-04T09:30:00.000Z",
  },
  {
    id: "PAC-002",
    pacienteNombre: "Carlos Mendoza",
    edad: "34",
    telefono: "956123478",
    tratamiento: "ORTODONCIA",
    prioridad: "MEDIA",
    descripcion: "Control de brackets y evaluación del avance del tratamiento de ortodoncia.",
    estado: "EN_ATENCION",
    fechaRegistro: "2026-07-03T15:15:00.000Z",
  },
  {
    id: "PAC-003",
    pacienteNombre: "Gloria Torres",
    edad: "22",
    telefono: "912345678",
    tratamiento: "LIMPIEZA",
    prioridad: "BAJA",
    descripcion: "Limpieza dental preventiva y revisión general de encías.",
    estado: "FINALIZADO",
    fechaRegistro: "2026-07-02T11:00:00.000Z",
  },
];
