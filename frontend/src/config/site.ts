/**
 * ═══════════════════════════════════════════════════════════
 *  NeuroMundo S.A.S — Configuración del frontend
 *  Valores por defecto: se usan cuando la API no responde.
 *  El contenido editable real vive en la BD de la API
 *  (/admin/contenido y /admin/parametros).
 * ═══════════════════════════════════════════════════════════
 */

export const siteConfig = {
  name: 'NeuroMundo S.A.S',
  shortName: 'NeuroMundo',
  slogan: '¡Un mundo de soluciones!',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573052743878',
  whatsappDisplay: '+57 305 274 3878',
  phone: '573008006572',
  phoneDisplay: '+57 300 800 6572',
  emails: ['gerencianeuromundo@gmail.com', 'conderamirojose@gmail.com'],
  country: 'Colombia',
  manager: { name: 'Ramiro José Conde Hernández', role: 'Gerente · Abogado' },
  navLinks: [
    { href: '/', label: 'Inicio' },
    { href: '/portafolio', label: 'Portafolio' },
    { href: '#servicios', label: 'Servicios' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ],
  stats: [
    { value: '9', label: 'Líneas de servicio' },
    { value: '90%', label: 'Insumos importados de EE. UU.' },
    { value: '24h', label: 'Atención asistencial permanente' },
    { value: '100%', label: 'Alineado a normativa ADRES' },
  ],
};

/** Contenido por defecto (espejo de la BD; la API lo sobrescribe). */
export const DEFAULT_CONTENT: Record<string, string> = {
  hero_eyebrow: '¡Un mundo de soluciones!',
  hero_title_1: 'Salud, tecnología y',
  hero_title_highlight: 'soluciones',
  hero_title_2: 'para tu IPS',
  hero_subtitle:
    'Suministro médico especializado, tercerización de facturación y radicación ante ADRES, SOAT, ARL y EPS, y asesoría integral para instituciones de salud en Colombia.',
  history_title: 'Nuestra historia',
  history_text:
    'NeuroMundo S.A.S nació con un propósito claro: acercar a las instituciones de salud colombianas un portafolio integral que combine insumos médicos de la más alta calidad con soluciones administrativas que optimicen su gestión financiera.',
  mission_title: 'Misión',
  mission_text:
    'Proveer a las instituciones de salud insumos médicos y soluciones administrativas que optimicen su operación y sostenibilidad financiera, con estándares internacionales de calidad y seguridad clínica.',
  vision_title: 'Visión',
  vision_text:
    'Ser en 2028 el aliado estratégico líder del sector salud en Colombia, reconocido por la excelencia en el suministro, la innovación tecnológica y la recuperación eficiente de cartera.',
  values_title: 'Nuestros valores',
  values_text: 'Confianza, calidad, oportunidad, transparencia y compromiso con la vida.',
  contact_title: 'Un mundo de soluciones para tu IPS',
  contact_text:
    'Cuéntanos qué línea de servicio necesitas — suministro, facturación, radicación, capacitación o asesoría — y diseñamos una propuesta a la medida de tu institución.',
  portfolio_title: 'Portafolio de Servicios',
  portfolio_subtitle:
    'Suministro médico especializado, tercerización de facturación y radicación ante ADRES, SOAT, ARL y EPS, y asesoría integral para instituciones de salud en Colombia.',
};

export interface PortfolioService {
  id: string;
  num: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  longDescription?: string;
  benefits?: string[];
  process?: string[];
  ctaLabel?: string;
}

/** Contenido editable de la vista pública /portafolio. */
export const DEFAULT_PORTFOLIO: PortfolioService[] = [
  { id: 'suministros-maos', num: '01', title: 'Suministro de materiales de osteosíntesis y prótesis', category: 'Cadena de suministro', description: 'Procedimientos ortopédicos, maxilofacial, cabeza y columna.', details: ['Provisión oportuna de material de osteosíntesis y dispositivos médicos.', 'Stock de emergencia en consignación para atender cirugías de urgencia.', 'Calidades y fabricantes según especificación técnica, origen y marca.', 'Tarifas flexibles ajustadas al pagador y a los plazos de pago.'] },
  { id: 'suministros-uci', num: '02', title: 'Suministro de dispositivos e insumos para UCI y hospitalización', category: 'Cadena de suministro', description: 'Dispositivos especializados con inventario en consignación. El 90% importado de EE. UU.', details: ['Portafolio de marcas líderes con estándares internacionales de fabricación y seguridad clínica.', 'Flujo constante de insumos para evitar interrupciones en la atención crítica.', 'Gestión de stock crítico y reposición eficiente en las bodegas de la institución.', 'Precios concertados según importación, volumen de consumo y plazos de pago.'] },
  { id: 'facturacion-soat', num: '03', title: 'Facturación y prefacturación de servicios médicos SOAT y ADRES a distancia', category: 'Facturación remota', description: 'Liquidación, diligenciamiento de FURIPS 1 y 2, INFOPOL y normativa vigente.', details: ['Facturación y auditoría administrativa de servicios médicos a distancia.', 'Diligenciamiento y revisión de formularios FURIPS 1, FURIPS 2 e INFOPOL.', 'Informes de gestión, soporte técnico y acompañamiento al equipo de la IPS.', 'Aplicación de normativa vigente para reducir devoluciones y glosas.'] },
  { id: 'facturacion-arl', num: '04', title: 'Facturación y prefacturación de servicios médicos ARL y EPS a distancia', category: 'Facturación remota', description: 'Convenios por PGP, evento y cápita, con informes semanales y capacitación virtual.', details: ['Facturación y auditoría administrativa enfocada en convenios PGP, evento y cápita.', 'Informes semanales con avances, hallazgos y recomendaciones.', 'Capacitación virtual al área de admisiones.', 'Asesoría en acuerdos bilaterales, prevención de glosas y pagos oportunos.'] },
  { id: 'radicacion-adres', num: '05', title: 'Radicación y auditoría administrativa de cuentas médicas ADRES a distancia', category: 'Radicación remota', description: 'Sistema propio de validación automática de CUPS, CUMS, MAOS y alertas tempranas de glosas.', details: ['Validación documental y administrativa antes de la radicación.', 'Revisión de CUPS, CUMS, MAOS y requisitos del proceso.', 'Alertas tempranas para prevenir devoluciones y glosas.', 'Seguimiento del estado de las cuentas e informes de resultados.'] },
  { id: 'recuperacion-cartera', num: '06', title: 'Radicación, auditoría médica-administrativa y recuperación de cuentas médicas ADRES', category: 'Recuperación de cartera', description: 'Auditoría, corrección, defensa y recuperación de cartera ADRES con incentivo por resultado.', details: ['Radicación oportuna y auditoría médico-administrativa preventiva y correctiva.', 'Elaboración y envío de respuestas a glosas.', 'Seguimiento activo ante ADRES e informe mensual de recuperación.', 'Gestión de carteras históricas y estrategias personalizadas de recuperación.'] },
  { id: 'capacitacion', num: '07', title: 'Capacitación en normatividad de servicios médicos y eficiencia de procesos', category: 'Formación', description: 'Facturación en salud, gestión financiera e IA aplicada para equipos de IPS.', details: ['Capacitación en facturación, auditoría y normatividad de servicios médicos.', 'Formación en eficiencia de procesos y gestión financiera.', 'Aplicación práctica de inteligencia artificial para equipos de IPS.', 'Materiales y recomendaciones orientados a la mejora continua.'] },
  { id: 'asesoria', num: '08', title: 'Asesoría en contratación de servicios médicos, PGP, cápita, paquetes y eventos', category: 'Consultoría estratégica', description: 'Gestión integral de proyectos contractuales, glosas y sostenibilidad financiera.', details: ['Acompañamiento desde la planeación hasta el cierre de proyectos.', 'Análisis técnico-financiero de modelos PGP, cápita, evento y paquetes.', 'Asesoría estratégica en eficiencia operativa y sostenibilidad financiera.', 'Apoyo en gestión de glosas, cumplimiento normativo y toma de decisiones.'] },
  { id: 'asistencial', num: '09', title: 'Servicios asistenciales profesionales', category: 'Atención clínica', description: 'Urgencias 24h, hospitalización, consulta externa y neurocirugía especializada.', details: ['Servicios profesionales en medicina general y diferentes especialidades.', 'Énfasis en neurociencia y neurocirugía.', 'Atención permanente en las distintas áreas hospitalarias.', 'Urgencias 24 horas, hospitalización y consulta externa especializada.'] },
];

export function getPortfolio(content: Record<string, string>): PortfolioService[] {
  try {
    const parsed = JSON.parse(content.portfolio_services ?? 'null') as PortfolioService[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PORTFOLIO;
  } catch {
    return DEFAULT_PORTFOLIO;
  }
}

/** Parámetros por defecto (espejo de la BD). */
export const DEFAULT_PARAMETERS: Record<string, string> = {
  'company.name': 'NeuroMundo S.A.S',
  'company.slogan': '¡Un mundo de soluciones!',
  'company.nit': '',
  'company.address': '',
  'company.city': 'Colombia',
  'company.phone': '+57 300 800 6572',
  'company.whatsapp': '573052743878',
  'company.email': 'gerencianeuromundo@gmail.com',
  'company.email2': 'conderamirojose@gmail.com',
  'quote.currency': 'COP',
};

/** Servicios (estructura fija de la empresa). */
export interface Service {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export const services: Service[] = [
  {
    id: 'suministros-maos', num: '01',
    title: 'Materiales de osteosíntesis y prótesis',
    description: 'Placas, tornillos y sistemas de fijación para ortopedia, maxilofacial, cabeza y columna.',
    icon: 'bone', category: 'Cadena de suministro',
  },
  {
    id: 'suministros-uci', num: '02',
    title: 'Insumos para UCI y hospitalización',
    description: 'Dispositivos especializados con inventario en consignación. El 90% importado de EE. UU.',
    icon: 'activity', category: 'Cadena de suministro',
  },
  {
    id: 'facturacion-soat', num: '03',
    title: 'Facturación remota SOAT y ADRES',
    description: 'Liquidación, diligenciamiento de FURIPS 1 y 2, INFOPOL y normativa vigente a distancia.',
    icon: 'fileText', category: 'Facturación remota',
  },
  {
    id: 'facturacion-arl', num: '04',
    title: 'Facturación remota ARL y EPS',
    description: 'Convenios por PGP, evento y cápita, con informes semanales y capacitación virtual gratuita.',
    icon: 'receipt', category: 'Facturación remota',
  },
  {
    id: 'radicacion-adres', num: '05',
    title: 'Radicación y auditoría ADRES',
    description: 'Sistema propio de validación automática de CUPS, CUMS, MAOS y alertas tempranas de glosas.',
    icon: 'radar', category: 'Radicación remota',
  },
  {
    id: 'recuperacion-cartera', num: '06',
    title: 'Recuperación de cuentas médicas',
    description: 'Auditoría, corrección, defensa y recuperación de cartera ADRES con incentivo por resultado.',
    icon: 'wallet', category: 'Recuperación de cartera',
  },
  {
    id: 'capacitacion', num: '07',
    title: 'Capacitación en normatividad y eficiencia',
    description: 'Facturación en salud, gestión financiera e IA aplicada para equipos de IPS.',
    icon: 'graduation', category: 'Formación',
  },
  {
    id: 'asesoria', num: '08',
    title: 'Asesoría en contratación PGP, cápita y eventos',
    description: 'Gestión integral de proyectos contractuales, glosas y sostenibilidad financiera.',
    icon: 'briefcase', category: 'Consultoría estratégica',
  },
  {
    id: 'asistencial', num: '09',
    title: 'Servicios asistenciales profesionales',
    description: 'Urgencias 24h, hospitalización, consulta externa y neurocirugía especializada.',
    icon: 'stethoscope', category: 'Atención clínica',
  },
];

/** Catálogo de respaldo (se muestra si la API no tiene ítems aún). */
export const FALLBACK_PRODUCTS = [
  { reference: 'MAOS-1001', name: 'Placas y tornillos de osteosíntesis', category: 'Ortopedia', description: 'Sistemas de placa y tornillo para fijación interna en trauma y maxilofacial.', emoji: '🦴' },
  { reference: 'ESP-2002', name: 'Sistemas de fijación espinal', category: 'Columna', description: 'Tornillos pediculares y barras para estabilización de columna vertebral.', emoji: '🩻' },
  { reference: 'PRT-3003', name: 'Prótesis articulares', category: 'Implantes', description: 'Prótesis de cadera, rodilla y hombro, importadas de EE. UU.', emoji: '🦿' },
  { reference: 'NEU-4004', name: 'Kits de neurocirugía', category: 'Neurocirugía', description: 'Insumos para procedimientos de neurociencia y cirugía de cabeza y columna.', emoji: '🧠' },
  { reference: 'UCI-5005', name: 'Circuitos y filtros de ventilación', category: 'UCI', description: 'Circuitos, filtros HME y humidificadores para ventilación mecánica.', emoji: '🫁' },
  { reference: 'UCI-6006', name: 'Sensores y monitoreo hemodinámico', category: 'UCI', description: 'Sensores de presión invasiva y kits de monitoreo continuo de paciente crítico.', emoji: '📊' },
  { reference: 'QOF-7007', name: 'Mallas y suturas quirúrgicas', category: 'Quirófano', description: 'Mallas sintéticas reabsorbibles y no reabsorbibles, suturas de alta calidad.', emoji: '🧵' },
  { reference: 'HOS-8008', name: 'Descartables hospitalarios', category: 'Hospitalización', description: 'Sondas, cánulas, guantes y consumibles con flujo constante.', emoji: '🧪' },
];

export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hola NeuroMundo S.A.S 👋 Estoy interesado en sus servicios. ¿Podrían brindarme más información?';

export const formServiceOptions = [
  'Materiales de osteosíntesis y prótesis',
  'Insumos para UCI y hospitalización',
  'Facturación remota SOAT / ADRES',
  'Facturación remota ARL / EPS',
  'Radicación y auditoría ADRES',
  'Recuperación de cuentas médicas',
  'Capacitación',
  'Asesoría en contratación',
  'Servicios asistenciales',
  'Otro / No sé aún',
];

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
};

export const QUOTE_STATUS_TONES: Record<string, string> = {
  borrador: 'bg-slate-100 text-slate-600',
  enviada: 'bg-sky-100 text-sky-700',
  aceptada: 'bg-emerald-100 text-emerald-700',
  rechazada: 'bg-rose-100 text-rose-700',
};

