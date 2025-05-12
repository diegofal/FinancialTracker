/**
 * API Services
 * Mock implementations of API calls with realistic delays
 */

// --- Helper for Mock Delay ---
const mockApiDelay = (duration: number = 1000) => new Promise(resolve => setTimeout(resolve, duration));

// --- SPISA Data Types & Mocks ---
export interface BalanceItem {
  Name: string;
  Amount: number; // Saldo
  Due: number;    // Saldo Vencido
  Type: 0 | 1;    // 0 for debt (highlighted rows), 1 for credit/payment
}
export const fetchSpisaBalances = async (): Promise<BalanceItem[]> => {
  await mockApiDelay();
  return [
    { Name: "INDUSTRIAL DAX", Amount: 2321899.15, Due: 2321899.15, Type: 0 },
    { Name: "BRICOD CONTADO", Amount: 2977776.20, Due: 2295247.96, Type: 0 },
    { Name: "INDUSTRIAL CONVER", Amount: 45618.91, Due: 45618.91, Type: 0 },
    { Name: "CANOGIDER", Amount: 2292897.10, Due: 0, Type: 1 },
    { Name: "FERNANDEZ", Amount: 252110.03, Due: 0, Type: 1 },
    { Name: "BREND", Amount: 66652.41, Due: 0, Type: 1 },
    { Name: "BRICAVAL", Amount: 488488.09, Due: 0, Type: 1 },
    { Name: "CONTIVAL", Amount: 145222.41, Due: 0, Type: 1 },
    { Name: "VILLAR", Amount: 51687.57, Due: 0, Type: 1 },
    { Name: "CHAMAN", Amount: 1006926.62, Due: 0, Type: 1 },
    { Name: "PAZ LUCAS", Amount: 2806590.19, Due: 0, Type: 1 },
    { Name: "PRONSUR", Amount: 2209707.32, Due: 0, Type: 1 },
    { Name: "TUBOS RENARD", Amount: 742876.00, Due: 0, Type: 1 },
    { Name: "NELSON", Amount: 284463.28, Due: 0, Type: 1 },
    { Name: "JENKIN", Amount: 231559.20, Due: 0, Type: 1 },
    { Name: "VALVULAS Y BRIDAS", Amount: 794674.88, Due: 0, Type: 1 },
    { Name: "Renaci", Amount: 271945.95, Due: 0, Type: 1 },
    { Name: "BRIDAS DAR", Amount: 586299.85, Due: 0, Type: 1 },
    { Name: "FERNANDEZ", Amount: 252110.03, Due: 0, Type: 1 }
  ];
};

export interface FuturePaymentData {
  PaymentAmount: number[];
}
export const fetchSpisaFuturePayments = async (): Promise<FuturePaymentData> => {
  await mockApiDelay();
  return { PaymentAmount: [5895980.53] };
};

export interface DueBalanceData {
  Due: number[];
}
export const fetchSpisaDueBalance = async (): Promise<DueBalanceData> => {
  await mockApiDelay();
  return { Due: [4662863.008] };
};

export interface SpisaBilledAmountData {
  InvoiceAmount: number;
}
export const fetchSpisaBilled = async (period: 'month' | 'day'): Promise<SpisaBilledAmountData> => {
  await mockApiDelay();
  if (period === 'month') return { InvoiceAmount: 2544409.84 };
  return { InvoiceAmount: 0 }; // Example for 'day'
};

// --- xERP Data Types & Mocks ---
export interface XerpBilledAmountData {
  BilledMonthly?: number; // For month
  BilledToday?: number;   // For day
}
export const fetchXerpBilled = async (period: 'month' | 'day'): Promise<XerpBilledAmountData> => {
  await mockApiDelay();
  if (period === 'month') return { BilledMonthly: 16018545.554 };
  return { BilledToday: 0 }; // Example for 'day'
};

export interface BillHistoryItem {
  MonthYear: string; // ISO Date string e.g., "2024-05-01T00:00:00Z" 
  Amount: number;
}
export const fetchXerpBillsHistory = async (): Promise<BillHistoryItem[]> => {
  await mockApiDelay();
  return [
    { MonthYear: "2023-05-01T00:00:00Z", Amount: 52000000 },
    { MonthYear: "2023-06-01T00:00:00Z", Amount: 103000000 },
    { MonthYear: "2023-07-01T00:00:00Z", Amount: 75000000 },
    { MonthYear: "2023-08-01T00:00:00Z", Amount: 48000000 },
    { MonthYear: "2023-09-01T00:00:00Z", Amount: 50000000 },
    { MonthYear: "2023-10-01T00:00:00Z", Amount: 56000000 },
    { MonthYear: "2023-11-01T00:00:00Z", Amount: 48000000 },
    { MonthYear: "2023-12-01T00:00:00Z", Amount: 42000000 },
    { MonthYear: "2024-01-01T00:00:00Z", Amount: 55000000 },
    { MonthYear: "2024-02-01T00:00:00Z", Amount: 45000000 },
    { MonthYear: "2024-03-01T00:00:00Z", Amount: 35000000 },
    { MonthYear: "2024-04-01T00:00:00Z", Amount: 30000000 },
    { MonthYear: "2024-05-01T00:00:00Z", Amount: 25000000 }
  ];
};

export interface BillItem {
  order_no: string;
  invoiceDate: string; // ISO Date string
  customerName: string;
  Type: number;
  invoiceNumber: string;
  IdCliente: string;
  totalAmount: number;
}
export const fetchXerpBills = async (filterPeriod: 'month' | 'day' | 'all'): Promise<BillItem[]> => {
  await mockApiDelay(1500);
  if (filterPeriod === 'day') {
    return []; // No bills today example
  } else if (filterPeriod === 'all') {
    return [];
  }
  
  return [
    { order_no: "123", invoiceDate: new Date().toISOString(), customerName: "Cliente Ejemplo SA", Type: 10, invoiceNumber: "FC-A001-00012345", IdCliente: "CUST001", totalAmount: 121000 },
    { order_no: "124", invoiceDate: new Date().toISOString(), customerName: "Distribuidora Industrial", Type: 10, invoiceNumber: "FC-A001-00012346", IdCliente: "CUST002", totalAmount: 345200 },
    { order_no: "125", invoiceDate: new Date().toISOString(), customerName: "Bridas Argentinas", Type: 10, invoiceNumber: "FC-A001-00012347", IdCliente: "CUST003", totalAmount: 188650 },
    { order_no: "126", invoiceDate: new Date().toISOString(), customerName: "Metalúrgica del Sur", Type: 10, invoiceNumber: "FC-A001-00012348", IdCliente: "CUST004", totalAmount: 475900 },
    { order_no: "127", invoiceDate: new Date().toISOString(), customerName: "Accesorios Industriales", Type: 10, invoiceNumber: "FC-A001-00012349", IdCliente: "CUST005", totalAmount: 96320 }
  ];
};

export interface BillLineItem {
  stk_code: string;
  description: string;
  qty_sent: number;
}
export const fetchXerpBillItems = async (orderNo: string): Promise<BillLineItem[]> => {
  await mockApiDelay();
  if (!orderNo) return [];
  
  return [
    { stk_code: "TR12X6", description: "Tee de Reducción STD 1/2x3/4", qty_sent: 5 },
    { stk_code: "BSS15014", description: "Bridas S-150 SORF de 1/4", qty_sent: 10 },
    { stk_code: "BSS3006", description: "Bridas S-300 SORF de 6", qty_sent: 2 },
    { stk_code: "ES/BX3/4", description: "Espárragos R"7 de 3/4" Cabeza Hexagonal", qty_sent: 20 }
  ];
};

// --- Stock Related Data Types & Mocks (SPISA) ---
export interface StockItem {
  idArticulo: number;
  Codigo: string;
  descripcion: string;
  cantidad_en_stock: number;
  cantidad_vendida_en_periodo: number;
  costo_de_oportunidad: number;
  ultima_compra: string; // ISO Date string
  estado: 'Necesita Reposicion' | 'OK' | 'Stock Optimo' | 'Bajo Stock';
  IdCategoria: number;
  CategoriaName?: string; // For display
  ProveedorName?: string;
  PaisProveedorName?: string;
}
export const fetchSpisaStock = async (filters: {
  yearsSoldIn: number;
  categoryIds?: string[]; // Assuming multiselect returns array of strings/numbers
  providerIds?: string[];
  countryNames?: string[];
  needsRestock?: boolean;
}): Promise<StockItem[]> => {
  await mockApiDelay(2000);
  
  // Generate a decent amount of stock items to showcase the interface
  const stockItems: StockItem[] = [
    { idArticulo: 1, Codigo: "TR12X6", descripcion: "Tee de Reducción STD 1/2x3/4", cantidad_en_stock: 0, cantidad_vendida_en_periodo: 5, costo_de_oportunidad: 7687, ultima_compra: "2023-08-30T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 1, CategoriaName: "Bridas", ProveedorName: "Qingdao", PaisProveedorName: "China" },
    { idArticulo: 2, Codigo: "BSS15014", descripcion: "Bridas S-150 SORF de 1/4", cantidad_en_stock: 23, cantidad_vendida_en_periodo: 39, costo_de_oportunidad: 6707.04, ultima_compra: "2025-03-25T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 1, CategoriaName: "Bridas", ProveedorName: "Qingdao", PaisProveedorName: "China" },
    { idArticulo: 3, Codigo: "BSS3006", descripcion: "Bridas S-300 SORF de 6", cantidad_en_stock: 9, cantidad_vendida_en_periodo: 42, costo_de_oportunidad: 5383.19, ultima_compra: "2024-12-13T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 1, CategoriaName: "Bridas", ProveedorName: "Citzen", PaisProveedorName: "India" },
    { idArticulo: 4, Codigo: "ES/BX3/4", descripcion: "Espárragos R"7 de 3/4" Cabeza Hexagonal", cantidad_en_stock: 29, cantidad_vendida_en_periodo: 2004, costo_de_oportunidad: 4917.75, ultima_compra: "2025-02-10T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 2, CategoriaName: "Accesorios", ProveedorName: "Rajvier", PaisProveedorName: "India" },
    { idArticulo: 5, Codigo: "E3/4X7", descripcion: "Espárragos R"7 de 3/4"", cantidad_en_stock: 119, cantidad_vendida_en_periodo: 1200, costo_de_oportunidad: 4853.69, ultima_compra: "2025-05-09T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 2, CategoriaName: "Accesorios", ProveedorName: "Qingdao", PaisProveedorName: "China" },
    { idArticulo: 6, Codigo: "BW3300ST", descripcion: "Brida W/N/RF 3-300 STD", cantidad_en_stock: 11, cantidad_vendida_en_periodo: 17, costo_de_oportunidad: 4777.44, ultima_compra: "2024-06-25T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 1, CategoriaName: "Bridas", ProveedorName: "Citzen", PaisProveedorName: "China" },
    { idArticulo: 7, Codigo: "TS3X2", descripcion: "Tee de Reducción STD 3x2", cantidad_en_stock: 31, cantidad_vendida_en_periodo: 99, costo_de_oportunidad: 4088.84, ultima_compra: "2025-01-30T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 3, CategoriaName: "Accesorio Forjado", ProveedorName: "Rajvier", PaisProveedorName: "India" },
    { idArticulo: 8, Codigo: "BS6008", descripcion: "Bridas S-600 SORF de 8", cantidad_en_stock: 2, cantidad_vendida_en_periodo: 9, costo_de_oportunidad: 3931.41, ultima_compra: "2024-02-16T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 1, CategoriaName: "Bridas", ProveedorName: "Qingdao", PaisProveedorName: "China" },
    { idArticulo: 9, Codigo: "ES/BX1/2", descripcion: "Espárragos R"7 de 5/8"", cantidad_en_stock: 0, cantidad_vendida_en_periodo: 1231, costo_de_oportunidad: 2705.31, ultima_compra: "2024-01-04T00:00:00Z", estado: "Necesita Reposicion", IdCategoria: 2, CategoriaName: "Accesorios", ProveedorName: "Citzen", PaisProveedorName: "India" },
    // Additional items to represent other categories
    { idArticulo: 10, Codigo: "CG600", descripcion: "Casquete Grande 600mm", cantidad_en_stock: 5, cantidad_vendida_en_periodo: 12, costo_de_oportunidad: 8200.00, ultima_compra: "2024-03-15T00:00:00Z", estado: "Bajo Stock", IdCategoria: 4, CategoriaName: "Casquetes Grandes", ProveedorName: "Qingdao", PaisProveedorName: "China" },
    { idArticulo: 11, Codigo: "OTR001", descripcion: "Componente Misceláneo", cantidad_en_stock: 15, cantidad_vendida_en_periodo: 8, costo_de_oportunidad: 1800.00, ultima_compra: "2024-04-10T00:00:00Z", estado: "Stock Optimo", IdCategoria: 5, CategoriaName: "Otros", ProveedorName: "Rajvier", PaisProveedorName: "India" }
  ];
  
  // Apply filters if they exist
  let filteredItems = [...stockItems];
  
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    filteredItems = filteredItems.filter(item => 
      filters.categoryIds?.includes(item.IdCategoria.toString())
    );
  }
  
  if (filters.providerIds && filters.providerIds.length > 0) {
    filteredItems = filteredItems.filter(item => 
      filters.providerIds?.includes(item.ProveedorName || '')
    );
  }
  
  if (filters.countryNames && filters.countryNames.length > 0) {
    filteredItems = filteredItems.filter(item => 
      filters.countryNames?.includes(item.PaisProveedorName || '')
    );
  }
  
  if (filters.needsRestock) {
    filteredItems = filteredItems.filter(item => 
      item.estado === 'Necesita Reposicion'
    );
  }
  
  return filteredItems;
};

export interface StockValueByCategoryItem {
  category: string;
  stock_value: number;
}
export const fetchSpisaStockValueByCategory = async (yearsSoldIn: number): Promise<StockValueByCategoryItem[]> => {
  await mockApiDelay();
  return [
    { category: "Bridas", stock_value: 12500000 }, // 46.6%
    { category: "Accesorios", stock_value: 7300000 }, // 27.2%
    { category: "Accesorio Forjado", stock_value: 3500000 }, // 13.3%
    { category: "Casquetes Grandes", stock_value: 2350000 }, // 8.77%
    { category: "Otros", stock_value: 900000 }, // 3.33%
  ];
};

export interface StockSnapshotItem {
  Date: string; // ISO Date string
  StockValue: number;
}
export const fetchSpisaStockSnapshots = async (): Promise<StockSnapshotItem[]> => {
  await mockApiDelay();
  return [
    { Date: "2023-01-01T00:00:00Z", StockValue: 9000000 },
    { Date: "2023-02-01T00:00:00Z", StockValue: 9500000 },
    { Date: "2023-03-01T00:00:00Z", StockValue: 10500000 },
    { Date: "2023-04-01T00:00:00Z", StockValue: 11000000 },
    { Date: "2023-05-01T00:00:00Z", StockValue: 11500000 },
    { Date: "2023-06-01T00:00:00Z", StockValue: 12000000 },
    { Date: "2023-07-01T00:00:00Z", StockValue: 11800000 },
    { Date: "2023-08-01T00:00:00Z", StockValue: 10500000 },
    { Date: "2023-09-01T00:00:00Z", StockValue: 8500000 },
    { Date: "2023-10-01T00:00:00Z", StockValue: 9000000 },
    { Date: "2023-11-01T00:00:00Z", StockValue: 10500000 },
    { Date: "2023-12-01T00:00:00Z", StockValue: 11000000 },
    { Date: "2024-01-01T00:00:00Z", StockValue: 11500000 },
    { Date: "2024-02-01T00:00:00Z", StockValue: 12000000 },
    { Date: "2024-03-01T00:00:00Z", StockValue: 13000000 },
    { Date: "2024-04-01T00:00:00Z", StockValue: 12800000 },
    { Date: "2024-05-01T00:00:00Z", StockValue: 13500000 }
  ];
};

export interface DiscontinuedStockItem {
  descripcion: string;
  cantidad: number;
  categoria: string;
  codigo: string;
  ultima_venta: string;
  valor_estimado: number;
}
export const fetchSpisaStockDiscontinued = async (yearsNotSold: number): Promise<DiscontinuedStockItem[]> => {
  await mockApiDelay();
  return [
    { descripcion: "Brida S-150 SORF 1/2", cantidad: 15, categoria: "Bridas", codigo: "BS15012", ultima_venta: "2020-05-10T00:00:00Z", valor_estimado: 25000 },
    { descripcion: "Espárrago B7 de 5/8 x 4", cantidad: 50, categoria: "Accesorios", codigo: "EB7-5/8X4", ultima_venta: "2019-11-22T00:00:00Z", valor_estimado: 15000 },
    { descripcion: "Tee de Reducción STD 2x1", cantidad: 8, categoria: "Accesorio Forjado", codigo: "TR2X1", ultima_venta: "2021-02-15T00:00:00Z", valor_estimado: 12000 },
    { descripcion: "Brida W/N/RF 2-300 STD", cantidad: 12, categoria: "Bridas", codigo: "BW2300ST", ultima_venta: "2020-08-03T00:00:00Z", valor_estimado: 36000 },
    { descripcion: "Casquete 300mm", cantidad: 3, categoria: "Casquetes Grandes", codigo: "CG300", ultima_venta: "2019-07-14T00:00:00Z", valor_estimado: 45000 },
    { descripcion: "Válvula de Retención 2"", cantidad: 4, categoria: "Otros", codigo: "VR2", ultima_venta: "2020-12-01T00:00:00Z", valor_estimado: 28000 },
    { descripcion: "Brida S-300 SORF de 3", cantidad: 6, categoria: "Bridas", codigo: "BS3003", ultima_venta: "2019-09-25T00:00:00Z", valor_estimado: 18000 },
    { descripcion: "Espárrago B7 de 3/4 x 6", cantidad: 30, categoria: "Accesorios", codigo: "EB7-3/4X6", ultima_venta: "2020-03-18T00:00:00Z", valor_estimado: 22000 }
  ];
};

export interface DiscontinuedStockValueItem {
  category: string;
  stock_value: number;
}
export const fetchSpisaStockDiscontinuedGrouped = async (yearsNotSold: number): Promise<DiscontinuedStockValueItem[]> => {
  await mockApiDelay();
  return [
    { category: "Bridas", stock_value: 79000 },
    { category: "Accesorios", stock_value: 37000 },
    { category: "Accesorio Forjado", stock_value: 12000 },
    { category: "Casquetes Grandes", stock_value: 45000 },
    { category: "Otros", stock_value: 28000 }
  ];
};

// --- Utility Types for Filter Options ---
export interface FilterOption {
  id: string;
  name: string;
}

export const fetchStockCategories = async (): Promise<FilterOption[]> => {
  await mockApiDelay(800);
  return [
    { id: "1", name: "Bridas" },
    { id: "2", name: "Accesorios" },
    { id: "3", name: "Accesorio Forjado" },
    { id: "4", name: "Casquetes Grandes" },
    { id: "5", name: "Otros" }
  ];
};

export const fetchStockProviders = async (): Promise<FilterOption[]> => {
  await mockApiDelay(800);
  return [
    { id: "Qingdao", name: "Qingdao" },
    { id: "Citzen", name: "Citzen" },
    { id: "Rajvier", name: "Rajvier" }
  ];
};

export const fetchStockCountries = async (): Promise<FilterOption[]> => {
  await mockApiDelay(800);
  return [
    { id: "China", name: "China" },
    { id: "India", name: "India" }
  ];
};
