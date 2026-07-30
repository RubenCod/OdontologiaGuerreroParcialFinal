import { createContext, PropsWithChildren, useContext, useEffect, useReducer } from "react";

import { Paciente, PacienteFormData } from "@/models/Paciente";
import { pacientesReducer } from "@/reducers/pacientesReducer";
import { PACIENTES_INICIALES } from "@/utils/constants";

interface PacientesContextValue {
  pacientes: Paciente[];
  agregarPaciente: (datos: PacienteFormData) => Paciente;
  actualizarPaciente: (id: string, datos: PacienteFormData) => boolean;
  eliminarPaciente: (id: string) => void;
  buscarPaciente: (id: string) => Paciente | undefined;
}

const PacientesContext = createContext<PacientesContextValue | undefined>(undefined);

export function PacientesProvider({ children }: PropsWithChildren) {
  const [pacientes, dispatch] = useReducer(pacientesReducer, []);

  // Al iniciar la aplicación se simula la carga de datos desde un servicio.
  useEffect(() => {
    dispatch({ type: "CARGAR", payload: PACIENTES_INICIALES });
  }, []);

  const agregarPaciente = (datos: PacienteFormData): Paciente => {

    // Buscar el último código existente para continuar la numeración
    const ultimoNumero = pacientes.reduce(
      (max, paciente) => {
        const numero = parseInt(
          paciente.id.replace("PAC-", ""),
          10
        );

        return numero > max ? numero : max;
      },
      0
    );


    const nuevoPaciente: Paciente = {
      ...datos,

      // Genera códigos consecutivos:
      // PAC-001, PAC-002, PAC-003, PAC-004...
      id: `PAC-${String(ultimoNumero + 1).padStart(3, "0")}`,

      fechaRegistro: new Date().toISOString(),
    };


    dispatch({ 
      type: "CREAR", 
      payload: nuevoPaciente 
    });

    return nuevoPaciente;
  };


  const actualizarPaciente = (id: string, datos: PacienteFormData): boolean => {
    const actual = pacientes.find((paciente) => paciente.id === id);

    if (!actual) return false;

    dispatch({
      type: "ACTUALIZAR",
      payload: { ...actual, ...datos },
    });

    return true;
  };


  const eliminarPaciente = (id: string) => {
    dispatch({ 
      type: "ELIMINAR", 
      payload: id 
    });
  };


  const buscarPaciente = (id: string) => 
    pacientes.find((paciente) => paciente.id === id);


  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        agregarPaciente,
        actualizarPaciente,
        eliminarPaciente,
        buscarPaciente
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
}


export function usePacientes() {
  const context = useContext(PacientesContext);

  if (!context) {
    throw new Error(
      "usePacientes debe utilizarse dentro de PacientesProvider"
    );
  }

  return context;
}