// Yo administro en un solo lugar el estado, limpieza y validación del formulario.
import { useEffect, useState } from "react";

import {
  PacienteFormData,
  PacienteFormErrors,
  PacienteLocal,
} from "@/domain/models/PacienteLocal";
import { validarPaciente } from "@/presentation/utils/validations";

const formularioInicial: PacienteFormData = {
  dni: "",
  pacienteNombre: "",
  edad: "",
  telefono: "",
  tratamiento: "CONSULTA",
  sesiones: "1",
  precio: "",
  prioridad: "MEDIA",
  descripcion: "",
  estado: "PENDIENTE",
};

function convertirPacienteAFormulario(
  paciente: PacienteLocal,
): PacienteFormData {
  return {
    dni: paciente.dni ?? "",
    pacienteNombre: paciente.pacienteNombre,
    edad: String(paciente.edad),
    telefono: paciente.telefono,
    tratamiento: paciente.tratamiento,
    sesiones: String(paciente.sesiones),
    precio: String(paciente.precio),
    prioridad: paciente.prioridad,
    descripcion: paciente.descripcion,
    estado: paciente.estado,
  };
}

export function usePacienteForm(paciente?: PacienteLocal | null) {
  const [form, setForm] = useState<PacienteFormData>(formularioInicial);
  const [errors, setErrors] = useState<PacienteFormErrors>({});

  useEffect(() => {
    // Yo cargo los datos en el formulario cuando SQLite devuelve el registro solicitado.
    if (paciente) setForm(convertirPacienteAFormulario(paciente));
  }, [paciente]);

  const actualizarCampo = <K extends keyof PacienteFormData>(
    campo: K,
    valor: PacienteFormData[K],
  ) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setErrors((actual) => ({ ...actual, [campo]: undefined }));
  };

  const validarFormulario = () => {
    const nuevosErrores = validarPaciente(form);
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  return {
    form,
    errors,
    setErrors,
    actualizarCampo,
    validarFormulario,
  };
}
