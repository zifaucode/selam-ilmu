/**
 * Selam Ilmu — Script Kompresi Gambar Otomatis
 * 
 * Script ini memindai folder public/images/uploads/ dan mengompres
 * semua gambar (JPEG, PNG, WEBP) menggunakan format WebP.
 * 
 * Fitur:
 * - Konversi ke WebP (format modern, ukuran ~85% lebih kecil)
 * - Resize otomatis jika lebar > 1200px
 * - Kualitas 80% (optimal: kecil tapi tetap jernih)
 * - Menghapus file asli setelah kompresi berhasil
 * - Update referensi di file markdown secara otomatis
 * - Skip file yang sudah dikompresi sebelumnya
 * 
 * Penggunaan: node scripts/compress-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, unlink, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename, relative } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const UPLOADS_DIR = join(ROOT, 'public', 'images', 'uploads');
const CONTENT_DIR = join(ROOT, 'src', 'content');

const MAX_WIDTH = 1200;
const QUALITY = 80;
const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'];

// ANSI colors for terminal output
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

/**
 * Recursively get all files in a directory
 */
async function getFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Update image references in all markdown content files
 * e.g., /images/uploads/aristoteles.PNG → /images/uploads/aristoteles.webp
 */
async function updateMarkdownRefs(oldName, newName) {
  const mdFiles = await getFiles(CONTENT_DIR);
  let updatedCount = 0;

  for (const mdFile of mdFiles) {
    if (extname(mdFile).toLowerCase() !== '.md') continue;

    const content = await readFile(mdFile, 'utf-8');
    // Match the old filename with any extension, case-insensitive
    const oldBasename = basename(oldName);
    const escapedName = oldBasename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedName, 'gi');

    if (regex.test(content)) {
      const updated = content.replace(regex, basename(newName));
      await writeFile(mdFile, updated, 'utf-8');
      updatedCount++;
    }
  }

  return updatedCount;
}

/**
 * Compress a single image file to WebP
 */
async function compressImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath, extname(filePath));
  const webpPath = join(dirname(filePath), `${name}.webp`);

  // Skip if already WebP
  if (ext === '.webp') {
    return { skipped: true, reason: 'sudah WebP' };
  }

  // Skip if not a supported format
  if (!SUPPORTED_EXTS.includes(ext)) {
    return { skipped: true, reason: 'format tidak didukung' };
  }

  // Skip if WebP version already exists
  if (existsSync(webpPath)) {
    return { skipped: true, reason: 'versi WebP sudah ada' };
  }

  const originalStat = await stat(filePath);
  const originalSize = originalStat.size;

  try {
    // Read image metadata
    const metadata = await sharp(filePath).metadata();
    
    // Build sharp pipeline
    let pipeline = sharp(filePath);

    // Resize if wider than MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Convert to WebP
    await pipeline
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const newStat = await stat(webpPath);
    const newSize = newStat.size;
    const savedPercent = ((1 - newSize / originalSize) * 100).toFixed(1);

    // Update markdown references
    const refsUpdated = await updateMarkdownRefs(
      basename(filePath),
      basename(webpPath)
    );

    // Delete original file after successful conversion
    await unlink(filePath);

    return {
      skipped: false,
      originalSize,
      newSize,
      savedPercent,
      refsUpdated,
      webpPath: basename(webpPath),
    };
  } catch (err) {
    return { skipped: true, reason: `error: ${err.message}` };
  }
}

/**
 * Main entry point
 */
async function main() {
  console.log('');
  console.log(c.bold('📸 Selam Ilmu — Kompresi Gambar Otomatis'));
  console.log(c.dim('─'.repeat(50)));

  if (!existsSync(UPLOADS_DIR)) {
    console.log(c.yellow('⚠ Folder uploads tidak ditemukan, lewati.'));
    return;
  }

  const files = await getFiles(UPLOADS_DIR);
  const imageFiles = files.filter((f) =>
    SUPPORTED_EXTS.includes(extname(f).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log(c.green('✓ Semua gambar sudah teroptimasi. Tidak ada yang perlu dikompres.'));
    console.log('');
    return;
  }

  console.log(`  Ditemukan ${c.cyan(imageFiles.length)} gambar untuk dikompres...\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let compressed = 0;

  for (const file of imageFiles) {
    const relPath = relative(ROOT, file);
    const result = await compressImage(file);

    if (result.skipped) {
      console.log(`  ${c.dim('⊘')} ${c.dim(relPath)} ${c.dim(`(${result.reason})`)}`);
    } else {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      compressed++;
      console.log(
        `  ${c.green('✓')} ${relPath} → ${c.cyan(result.webpPath)}` +
        `  ${c.dim(formatBytes(result.originalSize))} → ${c.green(formatBytes(result.newSize))}` +
        `  ${c.yellow(`-${result.savedPercent}%`)}` +
        (result.refsUpdated > 0 ? `  ${c.cyan(`(${result.refsUpdated} markdown diperbarui)`)}` : '')
      );
    }
  }

  console.log('');
  console.log(c.dim('─'.repeat(50)));
  if (compressed > 0) {
    const totalSaved = totalOriginal - totalNew;
    const totalPercent = ((1 - totalNew / totalOriginal) * 100).toFixed(1);
    console.log(
      c.bold(`  📊 ${compressed} gambar dikompres`) +
      `  |  Hemat: ${c.green(formatBytes(totalSaved))} (${c.yellow(`-${totalPercent}%`)})`
    );
  } else {
    console.log(c.green('  ✓ Tidak ada gambar baru yang perlu dikompres.'));
  }
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
