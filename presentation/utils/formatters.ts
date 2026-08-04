// Yo reúno aquí los formatos que se reutilizan en distintas pantallas.
export function formatearCodigoPaciente(id: number) {
  return `PAC-${String(id).padStart(3, "0")}`;
}

export function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatearPrecio(precio: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(precio);
}
