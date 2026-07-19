# Pokédex avanzada — upgrade integrado

## Fase 1: detalle avanzado
- Datos de especie, generación, color, género, hábitat, captura y crecimiento.
- Selector de artwork oficial, shiny, HOME, Showdown y sprites clásicos.
- Reproductor del grito.
- Formas y variedades relacionadas.

## Fase 2: información competitiva
- Estadísticas base.
- Debilidades, resistencias e inmunidades combinadas por tipo.
- Habilidades normales y ocultas con descripción.
- Movimientos con búsqueda, método y nivel.

## Fase 3: evolución y procedencia
- Árbol de evolución ramificado.
- Condiciones de evolución.
- Juegos registrados.
- Lugares de encuentro y probabilidad máxima.

## Verificación
El proyecto fue validado con `npm run build`.

## Conversión automática de carátulas a WebP

Las imágenes originales deben colocarse en:

```text
public/assets/images/pokemon-games/source/
```

Formatos admitidos: JPG, JPEG, PNG y WebP.

La conversión se ejecuta automáticamente antes de iniciar el servidor o compilar:

```bash
npm start
npm run build
```

También puede ejecutarse manualmente:

```bash
npm run convert:covers
```

El script normaliza los nombres a minúsculas, limita el ancho máximo a 700 px, elimina metadatos de orientación y genera WebP optimizado con calidad 84.
