<div align="center">

<img src="public/images/angular-studio-logo.png" alt="Logo de Angular Studio" width="180" />

# Angular Studio

### Development Workspace · Academic Edition

Aplicación web moderna construida con **Angular 21**, nacida como proyecto académico y evolucionada hasta convertirse en una plataforma técnica de portafolio.

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Authentication%20%26%20Hosting-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/Estado-Estable-success)](#estado-del-proyecto)
[![License](https://img.shields.io/badge/Licencia-Académica-blue)](#licencia)

</div>

---

## Descripción

**Angular Studio** es una plataforma de aprendizaje, experimentación y demostración técnica desarrollada con una arquitectura basada en componentes standalone.

El proyecto reúne autenticación, consumo de APIs REST, herramientas para desarrolladores, gestión CRUD, preferencias de usuario, calculadora, panel administrativo y una experiencia avanzada inspirada en el universo Pokémon.

Su objetivo es demostrar competencias prácticas en:

- Desarrollo frontend moderno con Angular.
- Arquitectura modular y separación de responsabilidades.
- Integración con servicios externos.
- Gestión de estado con Signals y RxJS.
- Diseño responsivo.
- Autenticación con Firebase.
- Construcción y preparación para producción.

## Demo

La aplicación está preparada para publicarse mediante Firebase Hosting:

**https://angular-studio-2b6c3.web.app**

> El despliegue público permanece pendiente. El proyecto compila correctamente y genera la salida de producción en `dist/AngularStudio/browser`.

## Tecnologías

<p align="center">
  <img src="https://skillicons.dev/icons?i=angular,typescript,html,css,scss,firebase,nodejs,git,github,vscode" alt="Tecnologías utilizadas en Angular Studio" />
</p>

- Angular 21.
- TypeScript 5.9.
- Angular Signals.
- RxJS 7.8.
- Reactive Forms.
- SCSS.
- Firebase Authentication.
- Firebase Hosting.
- REST APIs.
- PokéAPI.
- Vitest.
- Node.js.
- Sharp.
- Git y GitHub.

## Funcionalidades principales

### Experiencia general

- Página de inicio responsiva.
- Navegación adaptable para escritorio, tabletas y dispositivos móviles.
- Dashboard con resumen de actividad y accesos rápidos.
- Perfil de usuario y configuración de preferencias.
- Soporte para temas y personalización visual.
- Lazy loading de funcionalidades.
- Protección de rutas mediante guards.

### Autenticación

- Registro de usuarios.
- Inicio de sesión.
- Recuperación de contraseña.
- Integración con Firebase Authentication.

### API Playground

- Exploración y consumo de APIs REST.
- Pokémon Explorer con información detallada.
- Regiones, formas, evoluciones, movimientos y encuentros.
- Gestión de favoritos.
- Comparación de Pokémon.
- Creación de equipos.

### Herramientas y laboratorios

- CRUD Lab con persistencia local.
- Calculadora.
- Formateador y validador JSON.
- Conversión Base64.
- Generador de UUID.
- Generador de contraseñas seguras.
- Conversión automatizada de imágenes JPG y PNG a WebP.

### Contexto académico

- Página `Acerca de` con información del diplomado.
- Presentación del certificado académico.
- Datos históricos del proyecto original.

## Arquitectura

El proyecto utiliza una estructura modular orientada a mantenibilidad, escalabilidad y separación de responsabilidades:

```text
src/app/
├── core/
│   ├── guards/
│   ├── services/
│   └── utils/
├── features/
│   ├── about/
│   ├── api-playground/
│   ├── auth/
│   ├── calculator/
│   ├── crud-lab/
│   ├── dashboard/
│   ├── developer-tools/
│   ├── home/
│   ├── profile/
│   └── settings/
├── layout/
├── shared/
└── app.routes.ts
```

### Principios aplicados

- Standalone Components.
- Lazy Loading.
- Route Guards.
- Angular Signals.
- Servicios especializados.
- Componentes reutilizables.
- Separación de responsabilidades.
- Persistencia local.
- Diseño responsivo.
- Clean Code.
- DRY.
- KISS.

## Requisitos

- Node.js 22 LTS.
- npm 10 o superior.
- Angular CLI 21.
- Cuenta de Firebase para autenticación y despliegue.

## Instalación

```bash
git clone https://github.com/Jairo0811/AngularStudio.git
cd AngularStudio
npm install
npm start
```

Abre la aplicación en:

```text
http://localhost:4200
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera el build optimizado de producción. |
| `npm run watch` | Compila en modo desarrollo y observa cambios. |
| `npm test` | Ejecuta las pruebas con Vitest. |
| `npm run convert:covers` | Convierte las carátulas compatibles a WebP. |

Los scripts `prestart` y `prebuild` ejecutan automáticamente la conversión de carátulas antes de iniciar o compilar el proyecto.

## Compilación para producción

```bash
npm run build
```

La salida optimizada se genera en:

```text
dist/AngularStudio/browser
```

## Pruebas

```bash
npm test
```

El proyecto utiliza **Vitest** como framework de pruebas.

## Despliegue en Firebase Hosting

El archivo `firebase.json` debe apuntar a la salida generada por Angular:

```json
{
  "hosting": {
    "public": "dist/AngularStudio/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

Comandos de despliegue:

```bash
npm run build
firebase use angular-studio-2b6c3
firebase deploy --only hosting
```

## Contexto académico

| Dato | Información |
|---|---|
| Participante | Francis Jairo Matías Rosario |
| Matrícula | 2015-2984 |
| Diplomado | Programación Web con Angular |
| Programa | BecaSoft |
| Período académico | 2020-T2 |
| Docente | Pedro Joaquín Sosa Abreu |
| Institución | Instituto Tecnológico de Las Américas (ITLA) |
| Entidades vinculadas | MESCyT y República Digital |
| Fecha del certificado | 8 de septiembre de 2020 |

Angular Studio comenzó como un proyecto académico y posteriormente fue reconstruido con Angular moderno, componentes standalone, Firebase y una arquitectura orientada a portafolio profesional.

## Evolución de Angular Studio 2.0

La versión 2.0 incorpora:

- Migración a Angular 21.
- Arquitectura standalone.
- Pokédex avanzada.
- Comparador, favoritos, filtros y equipos Pokémon.
- CRUD Lab con persistencia local.
- Herramientas para desarrolladores.
- Perfil de usuario y configuración de tema.
- Optimización y conversión automática de imágenes.
- Dashboard con métricas y accesos rápidos.
- Preparación para Firebase Hosting.

## Estado del proyecto

**Versión:** 2.0.0  
**Estado:** Estable  
**Edición:** Academic Edition

El proyecto compila correctamente para producción. El despliegue público en Firebase Hosting permanece pendiente debido a una incidencia temporal durante la carga de archivos.

## Roadmap

- [x] Arquitectura standalone.
- [x] Lazy loading.
- [x] Routing moderno.
- [x] Formularios reactivos.
- [x] Autenticación con Firebase.
- [x] Consumo de APIs REST.
- [x] Signals y RxJS.
- [x] Componentes reutilizables.
- [x] Diseño responsivo.
- [x] Build de producción.
- [ ] Incrementar la cobertura de pruebas.
- [ ] Optimizar los presupuestos de estilos SCSS.
- [ ] Mejorar accesibilidad y navegación por teclado.
- [ ] Automatizar CI/CD con GitHub Actions.
- [ ] Completar el despliegue público.
- [ ] Incorporar métricas y monitoreo del frontend.

## Autor

**Francis Jairo Matías Rosario**  
Tecnólogo en Desarrollo de Software · Estudiante de Ingeniería de Software

- GitHub: [@Jairo0811](https://github.com/Jairo0811)
- Proyecto académico evolucionado para portafolio profesional.

## Licencia

Proyecto desarrollado con fines académicos, educativos y de portafolio profesional.

---

<div align="center">

**Angular Studio v2.0**  
Del aprendizaje académico a una aplicación profesional.

</div>
