// Yo administro el estado y las validaciones del formulario de registro de doctores.
import { useState } from "react";

import { DoctorFormData, DoctorFormErrors } from "@/domain/models/Doctor";
import { validarDoctor } from "@/presentation/utils/validations";

const formularioInicial: DoctorFormData = {
  dni: "",
  nombres: "",
  apellidos: "",
  colegiatura: "",
  especialidad: "",
  email: "",
  password: "",
  confirmarPassword: "",
};

export function useDoctorForm() {
  const [form, setForm] = useState<DoctorFormData>(formularioInicial);
  const [errors, setErrors] = useState<DoctorFormErrors>({});

  const actualizarCampo = <K extends keyof DoctorFormData>(
    campo: K,
    valor: DoctorFormData[K],
  ) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setErrors((actual) => ({
      ...actual,
      [campo]: undefined,
      general: undefined,
    }));
  };

  const validarFormulario = () => {
    // Yo muestro todos los errores de una sola vez para facilitar la corrección.
    const nuevosErrores = validarDoctor(form);
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  return { form, errors, setErrors, actualizarCampo, validarFormulario };
}
