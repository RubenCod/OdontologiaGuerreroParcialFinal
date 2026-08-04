// Yo modelo la respuesta profesional que recibo desde el endpoint GET de términos y condiciones.
export type Termino = {
  id: number;
  codigo: string;
  titulo: string;
  contenido: string;
};

export type DocumentoLegal = {
  nombre: string;
  version: string;
  fechaActualizacion: string;
  responsable: string;
};

export type TerminosResponse = {
  success: boolean;
  message: string;
  documento: DocumentoLegal;
  terminos: Termino[];
};
