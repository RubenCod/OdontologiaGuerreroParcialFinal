export type EstadoAtencion = "PENDIENTE" | "EN_ATENCION" | "FINALIZADO";

export type PrioridadAtencion = "BAJA" | "MEDIA" | "ALTA";

export type TipoTratamiento =
  | "CONSULTA"
  | "LIMPIEZA"
  | "ORTODONCIA"
  | "ENDODONCIA"
  | "EXTRACCION"
  | "BLANQUEAMIENTO";

export interface Paciente {
  id: string;
  pacienteNombre: string;
  edad: string;
  telefono: string;
  tratamiento: TipoTratamiento;
  prioridad: PrioridadAtencion;
  descripcion: string;
  estado: EstadoAtencion;
  fechaRegistro: string;
}

// Se separan los datos del formulario de los campos que genera la aplicación.
export type PacienteFormData = Omit<Paciente, "id" | "fechaRegistro">;

export interface PacienteFormErrors {
  pacienteNombre?: string;
  edad?: string;
  telefono?: string;
  descripcion?: string;
}
