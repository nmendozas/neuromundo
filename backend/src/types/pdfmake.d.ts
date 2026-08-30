/** Tipados mínimos para pdfmake (el paquete no publica tipos). */

declare module 'pdfmake' {
  class PdfPrinter {
    constructor(fontDescriptors: Record<string, unknown>);
    createPdfKitDocument(docDefinition: unknown): NodeJS.ReadWriteStream;
  }
  export default PdfPrinter;
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfs: Record<string, string>;
  export default vfs;
}
