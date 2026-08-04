// Yo defino el modelo principal que representa una atención odontológica guardada en SQLite.
export type EstadoAtencion =
  "PENDIENTE" | "EN_PROCESO" | "FINALIZADO" | "CANCELADO";

export type PrioridadAtencion = "BAJA" | "MEDIA" | "ALTA";

export type TipoTratamiento =
  | "CONSULTA"
  | "LIMPIEZA"
  | "ORTODONCIA"
  | "ENDODONCIA"
  | "EXTRACCION"
  | "BLANQUEAMIENTO";

export type PacienteLocal = {
  id: number;
  dni: string;
  pacienteNombre: string;
  edad: number;
  telefono: string;
  tratamiento: TipoTratamiento;
  sesiones: number;
  precio: number;
  prioridad: PrioridadAtencion;
  descripcion: string;
  estado: EstadoAtencion;
  fechaRegistro: string;
};

// Yo separo los datos editables de los campos generados automáticamente por SQLite.
export type GuardarPacienteDto = Omit<PacienteLocal, "id" | "fechaRegistro">;

// Yo uso cadenas en el formulario para controlar correctamente los TextInput.
export type PacienteFormData = {
  dni: string;
  pacienteNombre: string;
  edad: string;
  telefono: string;
  tratamiento: TipoTratamiento;
  sesiones: string;
  precio: string;
  prioridad: PrioridadAtencion;
  descripcion: string;
  estado: EstadoAtencion;
};

export type PacienteFormErrors = Partial<
  Record<keyof PacienteFormData, string>
>;
