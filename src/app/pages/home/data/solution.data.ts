import { Solution } from '../../../models/solution.model';

export const SOLUTIONS: Solution[] = [
  {
    title: 'Académicos',
    description:
      'Accede al perfil y horario de todos los académicos del departamento, datos de contacto, entre otros.',
    imageUrl: 'assets/img/academicos.png', // Se usa una imagen generada en CardComponent
    linkUrl: '/academicos',
  },
  {
    title: 'Distribución de salas',
    description:
      'Consulta la ubicación de las salas de clases, laboratorios y reuniones, del departamento de mécanica',
    imageUrl: 'assets/img/salas.png', // Se usa una imagen generada en CardComponent
    linkUrl: '/salas',
  },
  {
    title: 'Funcionarios',
    description:
      'Directorio completo para ubicar personal administrativo, auxiliares, secretaría y con respectivas funciones.',
    imageUrl: 'assets/img/administrativo.png', // Se usa una imagen generada en CardComponent
    linkUrl: '/funcionarios',
  },
];
