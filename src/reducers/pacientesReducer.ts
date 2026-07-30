import { Paciente } from "@/models/Paciente";

export type PacienteAction =
  | { type: "CARGAR"; payload: Paciente[] }
  | { type: "CREAR"; payload: Paciente }
  | { type: "ACTUALIZAR"; payload: Paciente }
  | { type: "ELIMINAR"; payload: string };

// El reducer concentra las operaciones del CRUD y evita mezclar esta lógica con las pantallas.
export function pacientesReducer(state: Paciente[], action: PacienteAction): Paciente[] {
  switch (action.type) {
    case "CARGAR":
      return action.payload;
    case "CREAR":
      return [action.payload, ...state];
    case "ACTUALIZAR":
      return state.map((paciente) =>
        paciente.id === action.payload.id ? action.payload : paciente,
      );
    case "ELIMINAR":
      return state.filter((paciente) => paciente.id !== action.payload);
    default:
      return state;
  }
}
