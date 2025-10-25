export interface Academic {
  id: number;
  nombre: string;
  oficina: string;
  fotoPerfil: string; // ruta a la imagen de perfil
  oficinaImagen?: string; // ruta a la imagen de la oficina
  horarioImagen?: string; // ruta a la imagen de horario
  departamento?: string;
  email?: string;
  rol?: string; // e.g. "academico"
}
