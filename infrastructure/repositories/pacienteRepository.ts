// Yo concentro en este repositorio todas las consultas SQL del CRUD local de pacientes.
import { SQLiteDatabase } from "expo-sqlite";

import {
  GuardarPacienteDto,
  PacienteLocal,
} from "@/domain/models/PacienteLocal";

const CAMPOS = `
  id, COALESCE(dni, '') AS dni, pacienteNombre, edad, telefono,
  tratamiento, sesiones, precio, prioridad, descripcion, estado,
  COALESCE(doctorUid, '') AS doctorUid,
  COALESCE(doctorEmail, '') AS doctorEmail,
  fechaRegistro
`;

export const pacienteRepository = {
  async listar(db: SQLiteDatabase): Promise<PacienteLocal[]> {
    console.log("[SQL SELECT] Yo listo los pacientes guardados");
    return db.getAllAsync<PacienteLocal>(`
      SELECT ${CAMPOS}
      FROM pacientes
      ORDER BY id DESC;
    `);
  },

  async obtenerPorId(
    db: SQLiteDatabase,
    id: number,
  ): Promise<PacienteLocal | null> {
    console.log("[SQL SELECT] Yo busco un paciente", { id });
    return db.getFirstAsync<PacienteLocal>(
      `SELECT ${CAMPOS} FROM pacientes WHERE id = ?;`,
      [id],
    );
  },

  async dniExiste(
    db: SQLiteDatabase,
    dni: string,
    idExcluir?: number,
  ): Promise<boolean> {
    // Yo verifico el DNI y excluyo el registro actual cuando se está editando.
    const resultado = idExcluir
      ? await db.getFirstAsync<{ total: number }>(
          "SELECT COUNT(*) AS total FROM pacientes WHERE dni = ? AND id <> ?;",
          [dni.trim(), idExcluir],
        )
      : await db.getFirstAsync<{ total: number }>(
          "SELECT COUNT(*) AS total FROM pacientes WHERE dni = ?;",
          [dni.trim()],
        );

    return (resultado?.total ?? 0) > 0;
  },

  async nombreTelefonoExiste(
    db: SQLiteDatabase,
    pacienteNombre: string,
    telefono: string,
    idExcluir?: number,
  ): Promise<boolean> {
    // Yo detecto una posible repetición cuando coinciden nombre completo y teléfono.
    const nombre = pacienteNombre.trim().replace(/\s+/g, " ");
    const resultado = idExcluir
      ? await db.getFirstAsync<{ total: number }>(
          `SELECT COUNT(*) AS total
           FROM pacientes
           WHERE LOWER(TRIM(pacienteNombre)) = LOWER(?)
             AND telefono = ?
             AND id <> ?;`,
          [nombre, telefono.trim(), idExcluir],
        )
      : await db.getFirstAsync<{ total: number }>(
          `SELECT COUNT(*) AS total
           FROM pacientes
           WHERE LOWER(TRIM(pacienteNombre)) = LOWER(?)
             AND telefono = ?;`,
          [nombre, telefono.trim()],
        );

    return (resultado?.total ?? 0) > 0;
  },

  async crear(
    db: SQLiteDatabase,
    dto: GuardarPacienteDto,
    doctorUid: string,
    doctorEmail: string,
  ): Promise<number> {
    console.log("[SQL INSERT] Yo registro una atención", {
      dni: dto.dni,
      doctorUid,
    });

    const resultado = await db.runAsync(
      `INSERT INTO pacientes
        (dni, pacienteNombre, edad, telefono, tratamiento, sesiones, precio,
         prioridad, descripcion, estado, doctorUid, doctorEmail, fechaRegistro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        dto.dni,
        dto.pacienteNombre,
        dto.edad,
        dto.telefono,
        dto.tratamiento,
        dto.sesiones,
        dto.precio,
        dto.prioridad,
        dto.descripcion,
        dto.estado,
        doctorUid,
        doctorEmail,
        new Date().toISOString(),
      ],
    );

    return resultado.lastInsertRowId;
  },

  async actualizar(
    db: SQLiteDatabase,
    id: number,
    dto: GuardarPacienteDto,
  ): Promise<void> {
    console.log("[SQL UPDATE] Yo actualizo una atención", { id });

    await db.runAsync(
      `UPDATE pacientes
       SET dni = ?, pacienteNombre = ?, edad = ?, telefono = ?, tratamiento = ?,
           sesiones = ?, precio = ?, prioridad = ?, descripcion = ?, estado = ?
       WHERE id = ?;`,
      [
        dto.dni,
        dto.pacienteNombre,
        dto.edad,
        dto.telefono,
        dto.tratamiento,
        dto.sesiones,
        dto.precio,
        dto.prioridad,
        dto.descripcion,
        dto.estado,
        id,
      ],
    );
  },

  async eliminar(db: SQLiteDatabase, id: number): Promise<void> {
    console.log("[SQL DELETE] Yo elimino una atención", { id });

    const resultado = await db.runAsync("DELETE FROM pacientes WHERE id = ?;", [
      id,
    ]);

    // Yo confirmo que SQLite haya eliminado realmente el registro solicitado.
    if (resultado.changes === 0) {
      throw new Error("El paciente ya no existe o no pudo ser eliminado.");
    }
  },
};
