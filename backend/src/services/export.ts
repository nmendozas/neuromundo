import ExcelJS from 'exceljs';
import { formatCOP, formatDate, formatQty } from '../lib/money';
import { createPdfBuffer } from '../lib/pdf';
import type { QuoteRow, QuoteItemRow } from '../db/repos/quotes';
import type { ItemRow } from '../db/repos/items';

const NAVY = '#17223A';
const GOLD = '#C9A15C';

/** Genera el PDF de una cotización (pdfmake, letter, tabla y totales). */
export function buildQuotePdf(
  quote: QuoteRow,
  items: QuoteItemRow[],
  company: Record<string, string>,
): Promise<Buffer> {
  const base = quote.subtotal - quote.discount;
  const ivaLabel = base > 0 ? `${Math.round((quote.iva / base) * 100)}%` : 'IVA';

  const tableBody = items.map((it, i) => [
    String(i + 1),
    it.reference,
    it.name,
    it.unit,
    formatQty(it.quantity),
    formatCOP(it.unit_price),
    formatCOP(it.total),
  ]);

  const docDefinition: unknown = {
    pageSize: 'LETTER',
    pageMargins: [40, 50, 40, 62],
    header: () => ({
      columns: [
        { text: company['company.name'] ?? 'NeuroMundo S.A.S', fontSize: 8, color: '#888888' },
        { text: `Cotización ${quote.number}`, fontSize: 8, color: '#888888', alignment: 'right' },
      ],
      margin: [40, 14, 40, 0],
    }),
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: company['quote.footer_note'] ?? '', fontSize: 7, color: '#999999', alignment: 'left' },
        { text: `Página ${currentPage} de ${pageCount}`, fontSize: 7, color: '#999999', alignment: 'right' },
      ],
      margin: [40, 10, 40, 0],
    }),
    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: company['company.name'] ?? 'NeuroMundo S.A.S', fontSize: 20, bold: true, color: NAVY },
              company['company.slogan']
                ? { text: company['company.slogan'], fontSize: 10, color: GOLD, margin: [0, 2, 0, 6] }
                : {},
              company['company.nit']
                ? { text: `NIT: ${company['company.nit']}`, fontSize: 9, color: '#555555' }
                : {},
              {
                text: [company['company.address'], company['company.city']].filter(Boolean).join(', '),
                fontSize: 9,
                color: '#555555',
              },
              { text: company['company.phone'] ?? '', fontSize: 9, color: '#555555' },
            ],
          },
          {
            width: 'auto',
            stack: [
              { text: `COTIZACIÓN ${quote.number}`, fontSize: 16, bold: true, alignment: 'right', color: NAVY },
              { text: `Fecha: ${formatDate(quote.created_at)}`, alignment: 'right', fontSize: 9, margin: [0, 6, 0, 0] },
              { text: `Válida por: ${quote.valid_days} días`, alignment: 'right', fontSize: 9 },
              { text: `Estado: ${quote.status}`, alignment: 'right', fontSize: 9, color: GOLD },
            ],
          },
        ],
        margin: [0, 0, 0, 18],
      },
      { text: 'DATOS DEL CLIENTE', fontSize: 10, bold: true, color: NAVY, margin: [0, 6, 0, 6] },
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            ['Nombre', 'Empresa', 'NIT', 'Contacto'],
            [
              quote.client_name,
              quote.client_company,
              quote.client_nit,
              [quote.client_email, quote.client_phone].filter(Boolean).join(' · '),
            ],
          ],
        },
        margin: [0, 0, 0, 14],
      },
      { text: 'DETALLE DE LA COTIZACIÓN', fontSize: 10, bold: true, color: NAVY, margin: [0, 6, 0, 6] },
      {
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 0,
          hLineColor: () => '#DCE7F3',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
        table: {
          headerRows: 1,
          widths: ['4%', '13%', '42%', '7%', '8%', '13%', '13%'],
          body: [
            [
              { text: '#', bold: true },
              { text: 'Referencia', bold: true },
              { text: 'Descripción', bold: true },
              { text: 'Und', bold: true },
              { text: 'Cant.', bold: true },
              { text: 'Valor unit.', bold: true, alignment: 'right' },
              { text: 'Total', bold: true, alignment: 'right' },
            ],
            ...tableBody,
          ],
        },
        margin: [0, 0, 0, 14],
      },
      {
        columns: [
          {
            width: '*',
            stack: quote.notes
              ? [
                  { text: 'Notas', fontSize: 9, bold: true, color: '#555555' },
                  { text: quote.notes, fontSize: 9, color: '#555555', margin: [0, 2, 0, 0] },
                ]
              : [],
          },
          {
            width: 'auto',
            layout: 'noBorders',
            table: {
              widths: [130, 100],
              body: [
                [{ text: 'Subtotal', fontSize: 9 }, { text: formatCOP(quote.subtotal), fontSize: 9, alignment: 'right' }],
                [{ text: 'Descuento', fontSize: 9 }, { text: `- ${formatCOP(quote.discount)}`, fontSize: 9, alignment: 'right' }],
                [{ text: `IVA (${ivaLabel})`, fontSize: 9 }, { text: formatCOP(quote.iva), fontSize: 9, alignment: 'right' }],
                [
                  { text: 'TOTAL', fontSize: 12, bold: true, color: NAVY },
                  { text: `${formatCOP(quote.total)} ${quote.currency}`, fontSize: 12, bold: true, color: GOLD, alignment: 'right' },
                ],
              ],
            },
          },
        ],
        margin: [0, 4, 0, 30],
      },
      { text: 'FIRMAS', fontSize: 9, bold: true, color: NAVY, margin: [0, 10, 0, 8] },
      {
        columns: [
          {
            width: '*',
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1, lineColor: '#999999' }] },
              { text: 'Cliente · Firma y sello', fontSize: 8, color: '#555555', margin: [0, 4, 0, 0] },
            ],
          },
          {
            width: '*',
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1, lineColor: '#999999' }] },
              { text: company['company.name'] ?? 'NeuroMundo S.A.S', fontSize: 8, color: '#555555', margin: [0, 4, 0, 0] },
            ],
          },
        ],
      },
    ],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: '#1E2839' },
  };

  return createPdfBuffer(docDefinition);
}

/** Genera el Excel de una cotización con formato profesional (exceljs). */
export async function buildQuoteExcel(
  quote: QuoteRow,
  items: QuoteItemRow[],
  company: Record<string, string>,
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Cotización');

  ws.columns = [
    { width: 6 },
    { width: 16 },
    { width: 40 },
    { width: 10 },
    { width: 10 },
    { width: 16 },
    { width: 16 },
  ];
  ws.getRow(1).height = 26;

  ws.mergeCells('A1:G1');
  const title = ws.getCell('A1');
  title.value = `${company['company.name'] ?? 'NeuroMundo S.A.S'} — Cotización ${quote.number}`;
  title.font = { size: 16, bold: true, color: { argb: 'FF0C1F3B' } };

  ws.mergeCells('A3:G3');
  ws.getCell('A3').value = 'DATOS DEL CLIENTE';
  ws.getCell('A3').font = { bold: true, color: { argb: 'FF0C1F3B' } };

  const clientInfo: Array<[string, string]> = [
    ['Nombre', quote.client_name],
    ['Empresa', quote.client_company],
    ['NIT', quote.client_nit],
    ['Correo', quote.client_email],
    ['Teléfono', quote.client_phone],
  ];
  clientInfo.forEach(([label, value], i) => {
    const row = 4 + i;
    ws.getCell(`A${row}`).value = label;
    ws.getCell(`A${row}`).font = { bold: true };
    ws.mergeCells(`B${row}:G${row}`);
    ws.getCell(`B${row}`).value = value;
  });

  // Tabla de ítems
  const headerRow = 10;
  const headers = ['#', 'Referencia', 'Descripción', 'Und', 'Cantidad', 'Valor unit.', 'Total'];
  headers.forEach((h, i) => {
    const cell = ws.getCell(headerRow, i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C1F3B' } };
  });

  items.forEach((it, i) => {
    const row = headerRow + 1 + i;
    ws.getCell(row, 1).value = i + 1;
    ws.getCell(row, 2).value = it.reference;
    ws.getCell(row, 3).value = it.name;
    ws.getCell(row, 4).value = it.unit;
    ws.getCell(row, 5).value = it.quantity;
    ws.getCell(row, 6).value = it.unit_price;
    ws.getCell(row, 7).value = it.total;
    ws.getCell(row, 6).numFmt = '#,##0';
    ws.getCell(row, 7).numFmt = '#,##0';
  });

  const totalRow = headerRow + items.length + 2;
  const totals: Array<[string, number]> = [
    ['Subtotal', quote.subtotal],
    ['Descuento', -quote.discount],
    ['IVA', quote.iva],
    ['TOTAL', quote.total],
  ];
  totals.forEach(([label, value], i) => {
    const row = totalRow + i;
    ws.getCell(row, 6).value = label;
    ws.getCell(row, 6).font = i === totals.length - 1 ? { bold: true } : {};
    ws.getCell(row, 7).value = value;
    ws.getCell(row, 7).numFmt = '#,##0';
    ws.getCell(row, 7).font = i === totals.length - 1 ? { bold: true, color: { argb: 'FF0E8A71' } } : {};
  });

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/** Exporta el catálogo de ítems a Excel. */
export async function buildItemsExcel(items: ItemRow[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Catálogo');

  ws.columns = [
    { width: 16 },
    { width: 30 },
    { width: 18 },
    { width: 45 },
    { width: 10 },
    { width: 14 },
    { width: 14 },
  ];

  const headers = ['Referencia', 'Nombre', 'Categoría', 'Descripción', 'Unidad', 'Costo', 'Venta'];
  headers.forEach((h, i) => {
    const cell = ws.getCell(1, i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C1F3B' } };
  });

  items.forEach((it, i) => {
    const row = 2 + i;
    ws.getCell(row, 1).value = it.reference;
    ws.getCell(row, 2).value = it.name;
    ws.getCell(row, 3).value = it.category;
    ws.getCell(row, 4).value = it.description;
    ws.getCell(row, 5).value = it.unit;
    ws.getCell(row, 6).value = it.cost_price;
    ws.getCell(row, 7).value = it.sale_price;
    ws.getCell(row, 6).numFmt = '#,##0';
    ws.getCell(row, 7).numFmt = '#,##0';
  });

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/** Plantilla descargable para importar ítems desde una hoja de cálculo. */
export async function buildItemsTemplate(): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Importar ítems');

  ws.columns = [
    { width: 16 },
    { width: 30 },
    { width: 18 },
    { width: 45 },
    { width: 10 },
    { width: 14 },
    { width: 14 },
    { width: 8 }, { width: 32 }, { width: 32 }, { width: 32 }, { width: 32 }, { width: 32 },
  ];

  const headers = ['Referencia', 'Nombre', 'Categoría', 'Descripción', 'Unidad', 'Costo', 'Venta', 'Emoji', 'Imagen 1 (principal)', 'Imagen 2', 'Imagen 3', 'Imagen 4', 'Imagen 5'];
  headers.forEach((h, i) => {
    const cell = ws.getCell(1, i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C1F3B' } };
  });

  const example = [
    ['MAOS-9001', 'Placa de osteosíntesis 3.5 mm', 'Ortopedia', 'Placa de titanio para fijación de fracturas', 'unidad', 320000, 450000, '🦴', '', '', '', '', ''],
    ['UCI-9002', 'Circuito de ventilación adulto', 'UCI', 'Circuito respiratorio con filtro HME', 'unidad', 24000, 38000, '🫁', '', '', '', '', ''],
  ];
  example.forEach((row, i) => {
    const r = 2 + i;
    row.forEach((value, j) => {
      ws.getCell(r, j + 1).value = value;
    });
  });

  // (La fila 1 es el encabezado; los ejemplos se reemplazan por los ítems reales.)
  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}


