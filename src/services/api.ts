/**
 * API Services
 * Real API implementations connecting to the backend server
 */

// Base API URL
const API_URL = 'http://localhost:5000';

// Helper function for making API requests
async function fetchAPI<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  // Build query string
  const queryString = Object.keys(params).length > 0
    ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : '';
  
  // Make the actual request
  try {
    const response = await fetch(`${API_URL}${endpoint}${queryString}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// --- SPISA Data Types & API Implementations ---
export interface BalanceItem {
  name: string;
  balance: string; // Formatted as currency
  due: string;     // Formatted as currency
  type: 0 | 1;     // 0 for debt (highlighted rows), 1 for credit/payment
}
export const fetchSpisaBalances = async (): Promise<BalanceItem[]> => {
  return fetchAPI<BalanceItem[]>('/api/accounts/balances');
};

export interface FuturePaymentData {
  PaymentAmount30?: number;
  PaymentAmount60?: number;
  PaymentAmount90?: number;
}
export const fetchSpisaFuturePayments = async (): Promise<FuturePaymentData> => {
  return fetchAPI<FuturePaymentData>('/api/accounts/future-payments');
};

export interface DueBalanceData {
  Due: number;
}
export const fetchSpisaDueBalance = async (): Promise<DueBalanceData> => {
  return fetchAPI<DueBalanceData>('/api/accounts/due-balance');
};

export interface SpisaBilledAmountData {
  InvoiceAmount: number;
}
export const fetchSpisaBilled = async (period: 'month' | 'day'): Promise<SpisaBilledAmountData> => {
  return fetchAPI<SpisaBilledAmountData>('/api/invoices/spisa-billed', { period });
};

// --- xERP Data Types & API Implementations ---
export interface XerpBilledAmountData {
  BilledMonthly?: number; // For month
  BilledToday?: number;   // For day
}
export const fetchXerpBilled = async (period: 'month' | 'day'): Promise<XerpBilledAmountData> => {
  return fetchAPI<XerpBilledAmountData>('/api/invoices/xerp-billed', { period });
};

export interface BillHistoryItem {
  MonthYear: string; // ISO Date string e.g., "2024-05-01T00:00:00Z" 
  Amount: number;
}
export const fetchXerpBillsHistory = async (): Promise<BillHistoryItem[]> => {
  return fetchAPI<BillHistoryItem[]>('/api/invoices/history');
};

export interface BillItem {
  date: string;      // Formatted date
  customer: string;  // Customer name
  invoice: string;   // Invoice number
  amount: string;    // Formatted amount
}
export const fetchXerpBills = async (filterPeriod: 'month' | 'day' | 'all'): Promise<BillItem[]> => {
  return fetchAPI<BillItem[]>('/api/invoices/bills', { period: filterPeriod });
};

export interface BillLineItem {
  stk_code: string;
  description: string;
  qty_sent: number;
}
export const fetchXerpBillItems = async (orderNo: string): Promise<BillLineItem[]> => {
  return fetchAPI<BillLineItem[]>(`/api/invoices/bill-items/${orderNo}`);
};

// --- Stock Related Data Types & API Implementations ---
export interface StockItem {
  code: string;
  description: string;
  stock: string;
  sold: string;
  cost: string;
  date: string;
  status: string;
}
export const fetchSpisaStock = async (filters: {
  yearsSoldIn: number;
  categoryIds?: string[]; // Assuming multiselect returns array of strings/numbers
  providerIds?: string[];
  countryNames?: string[];
  needsRestock?: boolean;
}): Promise<StockItem[]> => {
  return fetchAPI<StockItem[]>('/api/stock/items', filters);
};

export interface StockValueByCategoryItem {
  category: string;
  stock_value: number;
}
export const fetchSpisaStockValueByCategory = async (yearsSoldIn: number): Promise<StockValueByCategoryItem[]> => {
  return fetchAPI<StockValueByCategoryItem[]>('/api/stock/value-by-category', { yearsSoldIn });
};

export interface StockSnapshotItem {
  Date: string; // ISO Date string
  StockValue: number;
}
export const fetchSpisaStockSnapshots = async (): Promise<StockSnapshotItem[]> => {
  return fetchAPI<StockSnapshotItem[]>('/api/stock/snapshots');
};

export interface DiscontinuedStockItem {
  code: string;
  description: string;
  stock: string;
  category: string;
  lastSale: string;
  value: string;
}
export const fetchSpisaStockDiscontinued = async (yearsNotSold: number): Promise<DiscontinuedStockItem[]> => {
  return fetchAPI<DiscontinuedStockItem[]>('/api/stock/discontinued', { yearsNotSold });
};

export interface DiscontinuedStockValueItem {
  category: string;
  stock_value: number;
}
export const fetchSpisaStockDiscontinuedGrouped = async (yearsNotSold: number): Promise<DiscontinuedStockValueItem[]> => {
  return fetchAPI<DiscontinuedStockValueItem[]>('/api/stock/discontinued-grouped', { yearsNotSold });
};

// --- Utility Types for Filter Options ---
export interface FilterOption {
  id: string;
  name: string;
}

export const fetchStockCategories = async (): Promise<FilterOption[]> => {
  return fetchAPI<FilterOption[]>('/api/filters/categories');
};

export const fetchStockProviders = async (): Promise<FilterOption[]> => {
  return fetchAPI<FilterOption[]>('/api/filters/providers');
};

export const fetchStockCountries = async (): Promise<FilterOption[]> => {
  return fetchAPI<FilterOption[]>('/api/filters/countries');
};
