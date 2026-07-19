import { ChangeDetectionStrategy, Component } from '@angular/core';

interface AcademicDetail {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
}

interface ProjectSpecification {
  readonly label: string;
  readonly value: string;
}

interface Institution {
  readonly acronym: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly imageClass: string;
}

interface TimelineStep {
  readonly title: string;
  readonly description: string;
}

interface ProjectFeature {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly certificateVerificationUrl =
    'https://certificados.itla.edu.do/certificate/validar-certificado/dcz_E0uTdde2wxWD4_jEa_9cw9BazEehRgN9tsvPYlhA8JSorw49rZ-uzdK438GpyZ9xSWfdtx8Kw_6wbLEc09uioMAYuYyTsxhoOr84RDbgeULfB16creMWqiIEc4nqWHIOWdRmcdaO3a7IBsWldw';

  protected readonly academicDetails: readonly AcademicDetail[] = [
    { label: 'Participante', value: 'Francis Jairo Matías Rosario' },
    { label: 'Matrícula', value: '2015-2984' },
    { label: 'Período académico', value: '2020-T2' },
    { label: 'Diplomado', value: 'Programación Web con Angular – MESCyT' },
    {
      label: 'Programa de becas',
      value: 'BecaSoft',
      description: 'Programa de diplomados orientado a la formación en desarrollo de software.',
    },
    { label: 'Docente', value: 'Pedro Joaquín Sosa Abreu' },
  ];

  protected readonly specifications: readonly ProjectSpecification[] = [
    { label: 'Versión', value: '2.0' },
    { label: 'Framework', value: 'Angular 21' },
    { label: 'Lenguaje', value: 'TypeScript' },
    { label: 'Arquitectura', value: 'Standalone Components' },
    { label: 'Estado', value: 'Estable' },
    { label: 'Edición', value: 'Academic Edition' },
  ];

  protected readonly institutions: readonly Institution[] = [
    {
      acronym: 'ITLA',
      name: 'Instituto Tecnológico de Las Américas',
      description: 'Institución académica responsable de impartir el diplomado y acompañar la formación técnica.',
      image: '/assets/images/institutions/itla.png',
      imageClass: 'institution-card__logo--itla',
    },
    {
      acronym: 'MESCyT',
      name: 'Ministerio de Educación Superior, Ciencia y Tecnología',
      description: 'Entidad gubernamental vinculada al programa de becas para la formación tecnológica especializada.',
      image: '/assets/images/institutions/mescyt.png',
      imageClass: 'institution-card__logo--mescyt',
    },
    {
      acronym: 'República Digital',
      name: 'Iniciativa República Digital',
      description: 'Iniciativa nacional que impulsó programas de capacitación y desarrollo de competencias digitales.',
      image: '/assets/images/institutions/republica-digital.png',
      imageClass: 'institution-card__logo--republica-digital',
    },
  ];

  protected readonly timeline: readonly TimelineStep[] = [
    { title: 'República Digital', description: 'Impulso a la transformación y formación digital.' },
    { title: 'BecaSoft', description: 'Programa de becas para diplomados en desarrollo de software.' },
    { title: 'MESCyT', description: 'Respaldo institucional del programa formativo.' },
    { title: 'ITLA', description: 'Impartición académica del diplomado.' },
    { title: 'Diplomado Angular', description: 'Formación especializada en desarrollo web.' },
    { title: 'Angular Studio 2.0', description: 'Evolución hacia una aplicación de portafolio profesional.' },
  ];

  protected readonly technologies: readonly string[] = [
    'Angular 21',
    'TypeScript',
    'Signals',
    'RxJS',
    'SCSS',
    'Firebase',
    'REST APIs',
    'PokéAPI',
    'Node.js',
    'Sharp',
    'Git',
    'GitHub',
  ];

  protected readonly architecturePrinciples: readonly string[] = [
    'Standalone Components',
    'Lazy Loading',
    'Route Guards',
    'Angular Signals',
    'Servicios especializados',
    'Persistencia local',
    'Firebase Authentication',
    'Diseño responsivo',
  ];

  protected readonly projectFeatures: readonly ProjectFeature[] = [
    { title: 'Dashboard', description: 'Resumen de actividad, accesos rápidos e indicadores principales.' },
    { title: 'API Playground', description: 'Espacio para consumir y presentar información de APIs REST.' },
    { title: 'Pokédex avanzada', description: 'Regiones, formas, evoluciones, movimientos, encuentros y videojuegos.' },
    { title: 'Colecciones Pokémon', description: 'Favoritos, comparador y equipos de hasta seis Pokémon.' },
    { title: 'CRUD Lab', description: 'Creación, consulta, edición, búsqueda y eliminación de registros.' },
    { title: 'Developer Tools', description: 'Utilidades para JSON, Base64, UUID y contraseñas seguras.' },
    { title: 'Perfil y configuración', description: 'Datos del usuario, temas visuales y preferencias.' },
    { title: 'Autenticación', description: 'Registro, acceso y recuperación de contraseña mediante Firebase.' },
  ];
}