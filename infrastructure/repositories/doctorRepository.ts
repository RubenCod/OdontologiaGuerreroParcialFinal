// Yo concentro en este repositorio las consultas SQL relacionadas con doctores y credenciales locales.
import { SQLiteDatabase } from "expo-sqlite";

import { CrearDoctorDto, DoctorLocal } from "@/domain/models/DoctorLocal";

export const doctorRepository = {
  async autenticar(
    db: SQLiteDatabase,
    email: string,
    password: string,
  ): Promise<DoctorLocal | null> {
    console.log("[SQL SELECT] Yo valido las credenciales locales del doctor");

    return db.getFirstAsync<DoctorLocal>(
      `SELECT id, COALESCE(dni, '') AS dni, nombres, apellidos, colegiatura,
              especialidad, email, password, fechaRegistro
       FROM doctores
       WHERE LOWER(email) = LOWER(?) AND password = ?
       LIMIT 1;`,
      [email.trim(), password],
    );
  },

  async dniExiste(db: SQLiteDatabase, dni: string): Promise<boolean> {
    // Yo uso el DNI como identificador personal para impedir cuentas duplicadas.
    const resultado = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM doctores WHERE dni = ?;",
      [dni.trim()],
    );

    return (resultado?.total ?? 0) > 0;
  },

  async correoExiste(db: SQLiteDatabase, email: string): Promise<boolean> {
    // Yo verifico el correo antes de crear una cuenta para mostrar un mensaje comprensible.
    const resultado = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM doctores WHERE LOWER(email) = LOWER(?);",
      [email.trim()],
    );

    return (resultado?.total ?? 0) > 0;
  },

  async colegiaturaExiste(
    db: SQLiteDatabase,
    colegiatura: string,
  ): Promise<boolean> {
    // Yo evito registrar dos doctores con el mismo número de colegiatura.
    const resultado = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM doctores WHERE UPPER(colegiatura) = UPPER(?);",
      [colegiatura.trim()],
    );

    return (resultado?.total ?? 0) > 0;
  },

  async crear(db: SQLiteDatabase, dto: CrearDoctorDto): Promise<number> {
    console.log("[SQL INSERT] Yo registro un nuevo doctor", {
      dni: dto.dni,
      email: dto.email,
      colegiatura: dto.colegiatura,
    });

    const resultado = await db.runAsync(
      `INSERT INTO doctores
        (dni, nombres, apellidos, colegiatura, especialidad, email, password, fechaRegistro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        dto.dni.trim(),
        dto.nombres.trim(),
        dto.apellidos.trim(),
        dto.colegiatura.trim().toUpperCase(),
        dto.especialidad.trim(),
        dto.email.trim().toLowerCase(),
        dto.password,
        new Date().toISOString(),
      ],
    );

    return resultado.lastInsertRowId;
  },
};
