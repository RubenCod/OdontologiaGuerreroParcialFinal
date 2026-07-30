import { PacienteFormData, PacienteFormErrors } from "@/models/Paciente";

export const validarCorreo = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validarPassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 12;
};

export const validarPaciente = (form: PacienteFormData): PacienteFormErrors => {
  const errores: PacienteFormErrors = {};
  const nombre = form.pacienteNombre.trim();
  const edad = Number(form.edad);
  const telefono = form.telefono.trim();
  const descripcion = form.descripcion.trim();

  if (!nombre) {
    errores.pacienteNombre = "El nombre del paciente es obligatorio";
  } else if (nombre.length < 3 || nombre.length > 50) {
    errores.pacienteNombre = "El nombre debe tener entre 3 y 50 caracteres";
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(nombre)) {
    errores.pacienteNombre = "El nombre solo debe contener letras";
  }

  if (!form.edad.trim()) {
    errores.edad = "La edad es obligatoria";
  } else if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
    errores.edad = "Ingresa una edad válida entre 1 y 120 años";
  }

  if (!telefono) {
    errores.telefono = "El teléfono es obligatorio";
  } else if (!/^9\d{8}$/.test(telefono)) {
    errores.telefono = "El teléfono debe tener 9 dígitos y comenzar con 9";
  }

  if (!descripcion) {
    errores.descripcion = "La descripción es obligatoria";
  } else if (descripcion.length < 10 || descripcion.length > 250) {
    errores.descripcion = "La descripción debe tener entre 10 y 250 caracteres";
  }

  return errores;
};
