   /**
 * System constants, categories, and realistic default mock dataset for Gaming Lounge POS.
 */

export const DEVICE_TYPES = {
  ps5: { label: 'PlayStation 5', icon: 'Gamepad2', color: '#00E676' },
  ps4: { label: 'PlayStation 4', icon: 'Gamepad', color: '#38BDF8' },
  pc: { label: 'PC Gaming', icon: 'Monitor', color: '#A855F7' },
  vip: { label: 'VIP Lounge', icon: 'Tv', color: '#F59E0B' },
  billiards: { label: 'بلياردو / سنوكر', icon: 'CircleDot', color: '#EC4899' },
};

export const SESSION_MODES = {
  single: { label: 'فردي', factor: 1, badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  multi: { label: 'زوجي', factor: 1.4, badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  vip: { label: 'VIP خاص', factor: 2, badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

export const MENU_CATEGORIES = [
  { id: 'all', name: 'الكل', icon: 'LayoutGrid' },
  { id: 'hot_drinks', name: 'مشروبات ساخنة', icon: 'Coffee' },
  { id: 'cold_drinks', name: 'مشروبات باردة', icon: 'CupSoda' },
  { id: 'snacks', name: 'سناكس وتسالي', icon: 'Cookie' },
  { id: 'meals', name: 'وجبات وسندوتشات', icon: 'Utensils' },
  { id: 'shisha', name: 'شيشة ومعسل', icon: 'Flame' },
];

export const PAYMENT_METHODS = {
  cash: { label: 'كاش / نقدي', icon: 'Banknote', color: 'text-emerald-400' },
  card: { label: 'بطاقة بنكية / فيزا', icon: 'CreditCard', color: 'text-violet-400' },
  wallet: { label: 'محفظة إلكترونية (فودافون كاش / إنستاباي)', icon: 'Smartphone', color: 'text-cyan-400' },
};

export const INITIAL_SETTINGS = {
  loungeName: 'VIP Gaming Lounge',
  loungeTagline: 'صالة ألعاب وبلايستيشن وكافيه',
  address: 'العنوان بالتفصيل',
  phone: '01000000000',
  currency: 'ج.م',
  taxRate: 0, // 0% default (can be toggled)
  serviceFeeRate: 0, // 0%
  receiptFooterNote: 'شكراً لزيارتكم! نرجو لكم قضاء وقت ممتع دائماً.',
  enableSoundAlerts: true,
  warningCountdownMinutes: 5,
  startingCashDefault: 500,
  defaultPin: '1234',
};

export const INITIAL_STAFF = [
  { id: 'staff-1', name: 'المدير العام', role: 'مدير الصالة', pin: '1234', active: true },
  { id: 'staff-2', name: 'كاشير 1', role: 'كاشير رئيسي', pin: '0000', active: false },
];

export const INITIAL_DEVICES = [
  {
    id: 'dev-1',
    name: 'PS5 - غرفة VIP 1',
    type: 'ps5',
    screenSize: '65 بوصة 4K 120Hz',
    rates: { single: 50, multi: 75, vip: 110 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-2',
    name: 'PS5 - جهاز 2',
    type: 'ps5',
    screenSize: '55 بوصة 4K OLED',
    rates: { single: 45, multi: 65, vip: 90 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-3',
    name: 'PS5 - جهاز 3',
    type: 'ps5',
    screenSize: '55 بوصة 4K OLED',
    rates: { single: 45, multi: 65, vip: 90 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-4',
    name: 'PS4 Pro - جهاز 4',
    type: 'ps4',
    screenSize: '50 بوصة Full HD',
    rates: { single: 30, multi: 45, vip: 70 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-5',
    name: 'PS4 Pro - جهاز 5',
    type: 'ps4',
    screenSize: '50 بوصة Full HD',
    rates: { single: 30, multi: 45, vip: 70 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-6',
    name: 'PC Gaming Rig 1 (RTX 4080)',
    type: 'pc',
    screenSize: 'شاشة 240Hz 27 بوصة',
    rates: { single: 40, multi: 40, vip: 60 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-7',
    name: 'PC Gaming Rig 2 (RTX 4080)',
    type: 'pc',
    screenSize: 'شاشة 240Hz 27 بوصة',
    rates: { single: 40, multi: 40, vip: 60 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-8',
    name: 'طاولة بلياردو فرنساوى 1',
    type: 'billiards',
    screenSize: 'طاولة احترافية 9 قدم',
    rates: { single: 60, multi: 60, vip: 80 },
    status: 'available',
    activeSession: null,
  },
  {
    id: 'dev-9',
    name: 'غرفة VIP Master (PlayStation 5)',
    type: 'vip',
    screenSize: 'شاشة مسرح 75 بوصة + ساوند بار ساوند سيستم',
    rates: { single: 70, multi: 95, vip: 130 },
    status: 'available',
    activeSession: null,
  },
];

export const INITIAL_INVENTORY = [
  { id: 'item-1', name: 'شاي أسود تركي ع الفحم', category: 'hot_drinks', price: 15, cost: 4, stock: 50, minStock: 10 },
  { id: 'item-2', name: 'قهوة تركي بن محوج', category: 'hot_drinks', price: 25, cost: 9, stock: 40, minStock: 10 },
  { id: 'item-3', name: 'اسبريسو دوبل إيطالي', category: 'hot_drinks', price: 35, cost: 12, stock: 35, minStock: 10 },
  { id: 'item-4', name: 'لاتيه فانيلا ساخن', category: 'hot_drinks', price: 40, cost: 15, stock: 30, minStock: 10 },
  { id: 'item-5', name: 'كابتشينو برغوة كريمية', category: 'hot_drinks', price: 40, cost: 15, stock: 30, minStock: 10 },
  { id: 'item-6', name: 'بيبسي كانز مثلج', category: 'cold_drinks', price: 20, cost: 13, stock: 50, minStock: 15 },
  { id: 'item-7', name: 'سبرايت كانز ليمون', category: 'cold_drinks', price: 20, cost: 13, stock: 40, minStock: 15 },
  { id: 'item-8', name: 'ريد بول منشط طاقة', category: 'cold_drinks', price: 55, cost: 42, stock: 25, minStock: 10 },
  { id: 'item-9', name: 'آيس كراميل ماكياتو', category: 'cold_drinks', price: 45, cost: 18, stock: 25, minStock: 10 },
  { id: 'item-10', name: 'عصير مانجو طبيعي فريش', category: 'cold_drinks', price: 35, cost: 16, stock: 25, minStock: 10 },
  { id: 'item-11', name: 'مياه معدنية صغيرة', category: 'cold_drinks', price: 10, cost: 4, stock: 100, minStock: 25 },
  { id: 'item-12', name: 'شيبسي تايجر عائلي', category: 'snacks', price: 20, cost: 14, stock: 30, minStock: 10 },
  { id: 'item-13', name: 'دوريتوس جبنة ناتشو', category: 'snacks', price: 25, cost: 18, stock: 30, minStock: 10 },
  { id: 'item-14', name: 'شوكولاتة كادبوري ديري ميلك', category: 'snacks', price: 30, cost: 22, stock: 30, minStock: 10 },
  { id: 'item-15', name: 'إندومي سوبر جامبو بالخضار', category: 'meals', price: 25, cost: 12, stock: 40, minStock: 10 },
  { id: 'item-16', name: 'ساندوتش برجر سوبر لارج', category: 'meals', price: 70, cost: 38, stock: 20, minStock: 5 },
  { id: 'item-17', name: 'توست ميكس جبن محمص', category: 'meals', price: 45, cost: 20, stock: 20, minStock: 5 },
  { id: 'item-18', name: 'شيشة تفاحتين فاخر', category: 'shisha', price: 50, cost: 15, stock: 40, minStock: 10 },
  { id: 'item-19', name: 'شيشة عنب نعناع مثلجة', category: 'shisha', price: 55, cost: 18, stock: 40, minStock: 10 },
];

export const INITIAL_INVOICES = [];

export const INITIAL_EXPENSES = [];

export const INITIAL_SHIFT = {
  id: 'shift-1',
  shiftNumber: 1,
  cashierName: 'المدير العام',
  startTime: new Date().toISOString(),
  startingCash: 500,
  status: 'active', // active or closed
};
