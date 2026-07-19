import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const projectRoot = process.cwd();
const sourceDirectory = path.join(
  projectRoot,
  'public',
  'assets',
  'images',
  'pokemon-games',
  'source',
);
const outputDirectory = path.dirname(sourceDirectory);
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const webpQuality = 84;
const maximumWidth = 700;

await mkdir(sourceDirectory, { recursive: true });
await mkdir(outputDirectory, { recursive: true });

const entries = await readdir(sourceDirectory, { withFileTypes: true });
const sourceFiles = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
  .sort((left, right) => left.localeCompare(right));

if (sourceFiles.length === 0) {
  console.log('[covers] No hay imágenes para convertir.');
  console.log(`[covers] Agrega archivos JPG, JPEG, PNG o WebP en: ${sourceDirectory}`);
  process.exit(0);
}

let convertedCount = 0;
let skippedCount = 0;

for (const sourceFileName of sourceFiles) {
  const extension = path.extname(sourceFileName);
  const baseName = path.basename(sourceFileName, extension).toLowerCase();
  const sourcePath = path.join(sourceDirectory, sourceFileName);
  const outputPath = path.join(outputDirectory, `${baseName}.webp`);

  const [sourceStats, outputStats] = await Promise.all([
    stat(sourcePath),
    stat(outputPath).catch(() => null),
  ]);

  if (outputStats && outputStats.mtimeMs >= sourceStats.mtimeMs) {
    skippedCount += 1;
    continue;
  }

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: maximumWidth,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({
      quality: webpQuality,
      effort: 5,
      smartSubsample: true,
    })
    .toFile(outputPath);

  convertedCount += 1;
  console.log(`[covers] ${sourceFileName} -> ${baseName}.webp`);
}

console.log(
  `[covers] Proceso completado: ${convertedCount} convertida(s), ${skippedCount} sin cambios.`,
);
