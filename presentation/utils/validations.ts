// Yo valido los datos antes de enviarlos a los repositorios SQLite.
import {
  CrearDoctorDto,
  DoctorFormData,
  DoctorFormErrors,
} from "@/domain/models/DoctorLocal";
import {
  GuardarPacienteDto,
  PacienteFormData,
  PacienteFormErrors,
} from "@/domain/models/PacienteLocal";

export function validarCorreo(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarPassword(password: string) {
  return password.length >= 6 && password.length <= 20;
}

export function validarDni(dni: string) {
  // Yo aplico la validación básica usada en el proyecto: exactamente ocho dígitos.
  return /^\d{8}$/.test(dni.trim());
}

export function validarDoctor(form: DoctorFormData): DoctorFormErrors {
  const errores: DoctorFormErrors = {};
  const nombres = form.nombres.trim();
  const apellidos = form.apellidos.trim();
  const colegiatura = form.colegiatura.trim();
  const especialidad = form.especialidad.trim();

  if (!validarDni(form.dni)) {
    errores.dni = "El DNI debe contener exactamente 8 dígitos.";
  }

  if (!nombres) errores.nombres = "Los nombres son obligatorios.";
  else if (nombres.length < 2 || nombres.length > 40) {
    errores.nombres = "Ingresa entre 2 y 40 caracteres.";
  }

  if (!apellidos) errores.apellidos = "Los apellidos son obligatorios.";
  else if (apellidos.length < 2 || apellidos.length > 50) {
    errores.apellidos = "Ingresa entre 2 y 50 caracteres.";
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(`${nombres}${apellidos}`)) {
    errores.general = "Los nombres y apellidos solo deben contener letras.";
  }

  if (!colegiatura) errores.colegiatura = "La colegiatura es obligatoria.";
  else if (!/^[A-Za-z0-9-]{5,20}$/.test(colegiatura)) {
    errores.colegiatura = "Usa entre 5 y 20 letras, números o guiones.";
  }

  if (!especialidad) errores.especialidad = "La especialidad es obligatoria.";
  else if (especialidad.length < 3 || especialidad.length > 60) {
    errores.especialidad = "Ingresa entre 3 y 60 caracteres.";
  }

  if (!form.email.trim()) errores.email = "El correo es obligatorio.";
  else if (!validarCorreo(form.email)) {
    errores.email = "Ingresa un correo electrónico válido.";
  }

  if (!form.password) errores.password = "La contraseña es obligatoria.";
  else if (!validarPassword(form.password)) {
    errores.password = "Usa una contraseña de 6 a 20 caracteres.";
  }

  if (!form.confirmarPassword) {
    errores.confirmarPassword = "Confirma la contraseña.";
  } else if (form.password !== form.confirmarPassword) {
    errores.confirmarPassword = "Las contraseñas no coinciden.";
  }

  return errores;
}

export function convertirDoctorADto(form: DoctorFormData): CrearDoctorDto {
  // Yo retiro la confirmación porque SQLite solo necesita almacenar la contraseña elegida.
  return {
    dni: form.dni.trim(),
    nombres: form.nombres.trim().replace(/\s+/g, " "),
    apellidos: form.apellidos.trim().replace(/\s+/g, " "),
    colegiatura: form.colegiatura.trim().toUpperCase(),
    especialidad: form.especialidad.trim().replace(/\s+/g, " "),
    email: form.email.trim().toLowerCase(),
    password: form.password,
  };
}

export function validarPaciente(form: PacienteFormData): PacienteFormErrors {
  const errores: PacienteFormErrors = {};
  const nombre = form.pacienteNombre.trim();
  const edad = Number(form.edad);
  const sesiones = Number(form.sesiones);
  const precio = Number(form.precio);
  const descripcion = form.descripcion.trim();

  if (!validarDni(form.dni)) {
    errores.dni = "El DNI debe contener exactamente 8 dígitos.";
  }

  if (!nombre)
    errores.pacienteNombre = "El nombre del paciente es obligatorio.";
  else if (nombre.length < 3 || nombre.length > 60) {
    errores.pacienteNombre = "El nombre debe tener entre 3 y 60 caracteres.";
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(nombre)) {
    errores.pacienteNombre = "El nombre solo debe contener letras.";
  }

  if (!form.edad.trim()) errores.edad = "La edad es obligatoria.";
  else if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
    errores.edad = "Ingresa una edad válida entre 1 y 120 años.";
  }

  if (!/^9\d{8}$/.test(form.telefono.trim())) {
    errores.telefono = "El teléfono debe tener 9 dígitos y comenzar con 9.";
  }

  if (!form.sesiones.trim())
    errores.sesiones = "La cantidad de sesiones es obligatoria.";
  else if (!Number.isInteger(sesiones) || sesiones < 1 || sesiones > 99) {
    errores.sesiones = "Las sesiones deben ser un número entre 1 y 99.";
  }

  if (!form.precio.trim()) errores.precio = "El precio es obligatorio.";
  else if (!Number.isFinite(precio) || precio < 0 || precio > 100000) {
    errores.precio = "Ingresa un precio válido.";
  }

  if (!descripcion)
    errores.descripcion = "La descripción clínica es obligatoria.";
  else if (descripcion.length < 10 || descripcion.length > 300) {
    errores.descripcion =
      "La descripción debe tener entre 10 y 300 caracteres.";
  }

  return errores;
}

export function convertirFormularioADto(
  form: PacienteFormData,
): GuardarPacienteDto {
  // Yo convierto y normalizo los datos únicamente después de validar el formulario.
  return {
    dni: form.dni.trim(),
    pacienteNombre: form.pacienteNombre.trim().replace(/\s+/g, " "),
    edad: Number(form.edad),
    telefono: form.telefono.trim(),
    tratamiento: form.tratamiento,
    sesiones: Number(form.sesiones),
    precio: Number(form.precio),
    prioridad: form.prioridad,
    descripcion: form.descripcion.trim(),
    estado: form.estado,
  };
}
