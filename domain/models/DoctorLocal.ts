// Yo defino el modelo local de los doctores que podrán crear sus credenciales e ingresar a la aplicación.
export type DoctorLocal = {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  colegiatura: string;
  especialidad: string;
  email: string;
  password: string;
  fechaRegistro: string;
};

export type CrearDoctorDto = Omit<DoctorLocal, "id" | "fechaRegistro">;

export type DoctorFormData = CrearDoctorDto & {
  confirmarPassword: string;
};

export type DoctorFormErrors = Partial<
  Record<keyof DoctorFormData | "general", string>
>;
