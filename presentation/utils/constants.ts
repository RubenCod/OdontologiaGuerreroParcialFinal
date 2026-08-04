// Yo centralizo las opciones y etiquetas visibles de los formularios.
import {
  EstadoAtencion,
  PrioridadAtencion,
  TipoTratamiento,
} from "@/domain/models/PacienteLocal";


export const TRATAMIENTOS: TipoTratamiento[] = [
  "CONSULTA",
  "LIMPIEZA",
  "ORTODONCIA",
  "ENDODONCIA",
  "EXTRACCION",
  "BLANQUEAMIENTO",
];

export const PRIORIDADES: PrioridadAtencion[] = ["BAJA", "MEDIA", "ALTA"];

export const ESTADOS: EstadoAtencion[] = [
  "PENDIENTE",
  "EN_PROCESO",
  "FINALIZADO",
  "CANCELADO",
];

export const ETIQUETAS_ESTADO: Record<EstadoAtencion, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export const ETIQUETAS_TRATAMIENTO: Record<TipoTratamiento, string> = {
  CONSULTA: "Consulta",
  LIMPIEZA: "Limpieza",
  ORTODONCIA: "Ortodoncia",
  ENDODONCIA: "Endodoncia",
  EXTRACCION: "Extracción",
  BLANQUEAMIENTO: "Blanqueamiento",
};
