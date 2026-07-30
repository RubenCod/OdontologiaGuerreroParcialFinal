import { useState } from "react";

import {
  Paciente,
  PacienteFormData,
  PacienteFormErrors,
  PrioridadAtencion,
  EstadoAtencion,
  TipoTratamiento,
} from "@/models/Paciente";
import { validarPaciente } from "@/utils/validations";

const formularioInicial: PacienteFormData = {
  pacienteNombre: "",
  edad: "",
  telefono: "",
  tratamiento: "CONSULTA",
  prioridad: "MEDIA",
  descripcion: "",
  estado: "PENDIENTE",
};

export function usePacienteForm(paciente?: Paciente) {
  const [form, setForm] = useState<PacienteFormData>(paciente ?? formularioInicial);
  const [errors, setErrors] = useState<PacienteFormErrors>({});

  const actualizarCampo = <K extends keyof PacienteFormData>(campo: K, valor: PacienteFormData[K]) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    if (campo in errors) setErrors((actual) => ({ ...actual, [campo]: undefined }));
  };

  const setPacienteNombre = (valor: string) => actualizarCampo("pacienteNombre", valor);
  const setEdad = (valor: string) => actualizarCampo("edad", valor.replace(/\D/g, ""));
  const setTelefono = (valor: string) => actualizarCampo("telefono", valor.replace(/\D/g, ""));
  const setTratamiento = (valor: TipoTratamiento) => actualizarCampo("tratamiento", valor);
  const setPrioridad = (valor: PrioridadAtencion) => actualizarCampo("prioridad", valor);
  const setDescripcion = (valor: string) => actualizarCampo("descripcion", valor);
  const setEstado = (valor: EstadoAtencion) => actualizarCampo("estado", valor);

  const validarFormulario = (): boolean => {
    const nuevosErrores = validarPaciente(form);
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  return {
    form,
    errors,
    setPacienteNombre,
    setEdad,
    setTelefono,
    setTratamiento,
    setPrioridad,
    setDescripcion,
    setEstado,
    validarFormulario,
  };
}
