// Yo defino el perfil profesional que se guarda en Firestore y los datos del formulario de registro.
export type DoctorPerfil = {
  uid: string;
  dni: string;
  nombres: string;
  apellidos: string;
  colegiatura: string;
  especialidad: string;
  email: string;
  fechaRegistro: string;
};

export type RegistrarDoctorDto = Omit<DoctorPerfil, "uid" | "fechaRegistro"> & {
  password: string;
};

export type DoctorFormData = RegistrarDoctorDto & {
  confirmarPassword: string;
};

export type DoctorFormErrors = Partial<
  Record<keyof DoctorFormData | "general", string>
>;
