# Carátulas originales de Pokémon

Coloca aquí las carátulas originales en cualquiera de estos formatos:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

El nombre del archivo debe coincidir con la clave usada por la Pokédex. Ejemplos:

```text
red.jpg
blue.png
omega-ruby.jpeg
legends-arceus.png
fallback.png
```

Ejecuta:

```bash
npm run convert:covers
```

También se ejecuta automáticamente antes de `npm start` y `npm run build`.

Los archivos convertidos se generan en la carpeta superior con extensión `.webp`.
No edites manualmente los `.webp` generados: reemplaza la imagen original y vuelve a ejecutar la conversión.
