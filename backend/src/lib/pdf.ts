import fs from 'node:fs';
import path from 'node:path';
import PdfPrinter from 'pdfmake';
import vfs from 'pdfmake/build/vfs_fonts';

/**
 * Fuentes Roboto para pdfmake.
 * En Node, pdfmake necesita los .ttf en disco: los extraemos una sola vez
 * desde el vfs (base64) incluido en el paquete pdfmake.
 */
interface Printer {
  createPdfKitDocument(docDefinition: unknown): NodeJS.ReadWriteStream;
}

let cachedPrinter: Printer | null = null;

function getPrinter(): Printer {
  if (cachedPrinter) return cachedPrinter;

  const dir = path.join(process.cwd(), '.fonts');
  fs.mkdirSync(dir, { recursive: true });

  const files: Record<string, string> = {};
  for (const [name, base64] of Object.entries(vfs)) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, Buffer.from(base64, 'base64'));
    }
    files[name] = file;
  }

  cachedPrinter = new PdfPrinter({
    Roboto: {
      normal: files['Roboto-Regular.ttf'],
      bold: files['Roboto-Medium.ttf'],
      italics: files['Roboto-Italic.ttf'],
      bolditalics: files['Roboto-MediumItalic.ttf'],
    },
  }) as unknown as Printer;

  return cachedPrinter;
}

/** Genera el Buffer de un PDF a partir de un docDefinition de pdfmake. */
export function createPdfBuffer(docDefinition: unknown): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const pdfDoc = getPrinter().createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}
