/**
 * Zustand store for state management
 */
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import * as api from './services/api';

interface FilterState {
  // Bill filters
  billFilterPeriod: 'month' | 'day' | 'all';
  selectedOrderNo: string | null;
  
  // Stock filters (Current tab)
  stockYearsSoldIn: number;
  stockNeedsRestock: boolean;
  stockSelectedCategoryIds: string[];
  stockSelectedProviderIds: string[];
  stockSelectedCountryNames: string[];
  
  // Stock filters (Discontinued tab)
  stockDiscontinuedYearsNotSold: number;
}

interface LoadingState {
  isBalancesLoading: boolean;
  isFuturePaymentsLoading: boolean;
  isDueBalanceLoading: boolean;
  isSpisaBilledLoading: boolean;
  isXerpBilledLoading: boolean;
  isBillsHistoryLoading: boolean;
  isBillsLoading: boolean;
  isBillItemsLoading: boolean;
  isStockLoading: boolean;
  isStockValueByCategoryLoading: boolean;
  isStockSnapshotsLoading: boolean;
  isStockDiscontinuedLoading: boolean;
  isStockDiscontinuedGroupedLoading: boolean;
  isStockCategoriesLoading: boolean;
  isStockProvidersLoading: boolean;
  isStockCountriesLoading: boolean;
}

interface ErrorState {
  balancesError: string | null;
  futurePaymentsError: string | null;
  dueBalanceError: string | null;
  spisaBilledError: string | null;
  xerpBilledError: string | null;
  billsHistoryError: string | null;
  billsError: string | null;
  billItemsError: string | null;
  stockError: string | null;
  stockValueByCategoryError: string | null;
  stockSnapshotsError: string | null;
  stockDiscontinuedError: string | null;
  stockDiscontinuedGroupedError: string | null;
  stockCategoriesError: string | null;
  stockProvidersError: string | null;
  stockCountriesError: string | null;
}

interface DataState {
  balances: api.BalanceItem[];
  futurePayments: api.FuturePaymentData | null;
  dueBalance: api.DueBalanceData | null;
  spisaBilledMonth: api.SpisaBilledAmountData | null;
  spisaBilledDay: api.SpisaBilledAmountData | null;
  xerpBilledMonth: api.XerpBilledAmountData | null;
  xerpBilledDay: api.XerpBilledAmountData | null;
  billsHistory: api.BillHistoryItem[];
  bills: api.BillItem[];
  billItems: api.BillLineItem[];
  stock: api.StockItem[];
  stockValueByCategory: api.StockValueByCategoryItem[];
  stockSnapshots: api.StockSnapshotItem[];
  stockDiscontinued: api.DiscontinuedStockItem[];
  stockDiscontinuedGrouped: api.DiscontinuedStockValueItem[];
  stockCategories: api.FilterOption[];
  stockProviders: api.FilterOption[];
  stockCountries: api.FilterOption[];
}

interface StoreActions {
  // Filter actions
  setBillFilterPeriod: (period: 'month' | 'day' | 'all') => void;
  setSelectedOrderNo: (orderNo: string | null) => void;
  setStockYearsSoldIn: (years: number) => void;
  setStockNeedsRestock: (needsRestock: boolean) => void;
  setStockSelectedCategoryIds: (categoryIds: string[]) => void;
  setStockSelectedProviderIds: (providerIds: string[]) => void;
  setStockSelectedCountryNames: (countryNames: string[]) => void;
  setStockDiscontinuedYearsNotSold: (years: number) => void;
  
  // Data fetch actions
  fetchBalances: () => Promise<void>;
  fetchFuturePayments: () => Promise<void>;
  fetchDueBalance: () => Promise<void>;
  fetchSpisaBilled: (period: 'month' | 'day') => Promise<void>;
  fetchXerpBilled: (period: 'month' | 'day') => Promise<void>;
  fetchBillsHistory: () => Promise<void>;
  fetchBills: () => Promise<void>;
  fetchBillItems: (orderNo: string) => Promise<void>;
  fetchStock: () => Promise<void>;
  fetchStockValueByCategory: () => Promise<void>;
  fetchStockSnapshots: () => Promise<void>;
  fetchStockDiscontinued: () => Promise<void>;
  fetchStockDiscontinuedGrouped: () => Promise<void>;
  fetchStockCategories: () => Promise<void>;
  fetchStockProviders: () => Promise<void>;
  fetchStockCountries: () => Promise<void>;
  
  // Combined fetch actions
  fetchAllDashboardData: () => Promise<void>;
  fetchAllAccountsReceivableData: () => Promise<void>;
  fetchAllInvoicesData: () => Promise<void>;
  fetchAllCurrentStockData: () => Promise<void>;
  fetchAllDiscontinuedStockData: () => Promise<void>;
}

interface Store extends FilterState, LoadingState, ErrorState, DataState, StoreActions {}

const useStore = create<Store>()(
  devtools(
    (set, get) => ({
      // Initial filter state
      billFilterPeriod: 'month',
      selectedOrderNo: null,
      stockYearsSoldIn: 2,
      stockNeedsRestock: false,
      stockSelectedCategoryIds: [],
      stockSelectedProviderIds: [],
      stockSelectedCountryNames: [],
      stockDiscontinuedYearsNotSold: 10,
      
      // Initial loading state
      isBalancesLoading: false,
      isFuturePaymentsLoading: false,
      isDueBalanceLoading: false,
      isSpisaBilledLoading: false,
      isXerpBilledLoading: false,
      isBillsHistoryLoading: false,
      isBillsLoading: false,
      isBillItemsLoading: false,
      isStockLoading: false,
      isStockValueByCategoryLoading: false,
      isStockSnapshotsLoading: false,
      isStockDiscontinuedLoading: false,
      isStockDiscontinuedGroupedLoading: false,
      isStockCategoriesLoading: false,
      isStockProvidersLoading: false,
      isStockCountriesLoading: false,
      
      // Initial error state
      balancesError: null,
      futurePaymentsError: null,
      dueBalanceError: null,
      spisaBilledError: null,
      xerpBilledError: null,
      billsHistoryError: null,
      billsError: null,
      billItemsError: null,
      stockError: null,
      stockValueByCategoryError: null,
      stockSnapshotsError: null,
      stockDiscontinuedError: null,
      stockDiscontinuedGroupedError: null,
      stockCategoriesError: null,
      stockProvidersError: null,
      stockCountriesError: null,
      
      // Initial data state
      balances: [],
      futurePayments: null,
      dueBalance: null,
      spisaBilledMonth: null,
      spisaBilledDay: null,
      xerpBilledMonth: null,
      xerpBilledDay: null,
      billsHistory: [],
      bills: [],
      billItems: [],
      stock: [],
      stockValueByCategory: [],
      stockSnapshots: [],
      stockDiscontinued: [],
      stockDiscontinuedGrouped: [],
      stockCategories: [],
      stockProviders: [],
      stockCountries: [],
      
      // Filter actions
      setBillFilterPeriod: (period) => set({ billFilterPeriod: period }),
      setSelectedOrderNo: (orderNo) => set({ selectedOrderNo: orderNo }),
      setStockYearsSoldIn: (years) => set({ stockYearsSoldIn: years }),
      setStockNeedsRestock: (needsRestock) => set({ stockNeedsRestock: needsRestock }),
      setStockSelectedCategoryIds: (categoryIds) => set({ stockSelectedCategoryIds: categoryIds }),
      setStockSelectedProviderIds: (providerIds) => set({ stockSelectedProviderIds: providerIds }),
      setStockSelectedCountryNames: (countryNames) => set({ stockSelectedCountryNames: countryNames }),
      setStockDiscontinuedYearsNotSold: (years) => set({ stockDiscontinuedYearsNotSold: years }),
      
      // Data fetch actions
      fetchBalances: async () => {
        set({ isBalancesLoading: true, balancesError: null });
        try {
          const balances = await api.fetchSpisaBalances();
          set({ balances, isBalancesLoading: false });
        } catch (error) {
          set({ 
            balancesError: error instanceof Error ? error.message : 'Failed to fetch balances', 
            isBalancesLoading: false 
          });
        }
      },
      
      fetchFuturePayments: async () => {
        set({ isFuturePaymentsLoading: true, futurePaymentsError: null });
        try {
          const futurePayments = await api.fetchSpisaFuturePayments();
          set({ futurePayments, isFuturePaymentsLoading: false });
        } catch (error) {
          set({ 
            futurePaymentsError: error instanceof Error ? error.message : 'Failed to fetch future payments', 
            isFuturePaymentsLoading: false 
          });
        }
      },
      
      fetchDueBalance: async () => {
        set({ isDueBalanceLoading: true, dueBalanceError: null });
        try {
          const dueBalance = await api.fetchSpisaDueBalance();
          set({ dueBalance, isDueBalanceLoading: false });
        } catch (error) {
          set({ 
            dueBalanceError: error instanceof Error ? error.message : 'Failed to fetch due balance', 
            isDueBalanceLoading: false 
          });
        }
      },
      
      fetchSpisaBilled: async (period) => {
        set({ isSpisaBilledLoading: true, spisaBilledError: null });
        try {
          const billed = await api.fetchSpisaBilled(period);
          if (period === 'month') {
            set({ spisaBilledMonth: billed, isSpisaBilledLoading: false });
          } else {
            set({ spisaBilledDay: billed, isSpisaBilledLoading: false });
          }
        } catch (error) {
          set({ 
            spisaBilledError: error instanceof Error ? error.message : 'Failed to fetch SPISA billed amount', 
            isSpisaBilledLoading: false 
          });
        }
      },
      
      fetchXerpBilled: async (period) => {
        set({ isXerpBilledLoading: true, xerpBilledError: null });
        try {
          const billed = await api.fetchXerpBilled(period);
          if (period === 'month') {
            set({ xerpBilledMonth: billed, isXerpBilledLoading: false });
          } else {
            set({ xerpBilledDay: billed, isXerpBilledLoading: false });
          }
        } catch (error) {
          set({ 
            xerpBilledError: error instanceof Error ? error.message : 'Failed to fetch xERP billed amount', 
            isXerpBilledLoading: false 
          });
        }
      },
      
      fetchBillsHistory: async () => {
        set({ isBillsHistoryLoading: true, billsHistoryError: null });
        try {
          const billsHistory = await api.fetchXerpBillsHistory();
          set({ billsHistory, isBillsHistoryLoading: false });
        } catch (error) {
          set({ 
            billsHistoryError: error instanceof Error ? error.message : 'Failed to fetch bills history', 
            isBillsHistoryLoading: false 
          });
        }
      },
      
      fetchBills: async () => {
        const { billFilterPeriod } = get();
        set({ isBillsLoading: true, billsError: null });
        try {
          const bills = await api.fetchXerpBills(billFilterPeriod);
          set({ bills, isBillsLoading: false });
        } catch (error) {
          set({ 
            billsError: error instanceof Error ? error.message : 'Failed to fetch bills', 
            isBillsLoading: false 
          });
        }
      },
      
      fetchBillItems: async (orderNo) => {
        set({ isBillItemsLoading: true, billItemsError: null });
        try {
          const billItems = await api.fetchXerpBillItems(orderNo);
          set({ billItems, selectedOrderNo: orderNo, isBillItemsLoading: false });
        } catch (error) {
          set({ 
            billItemsError: error instanceof Error ? error.message : 'Failed to fetch bill items', 
            isBillItemsLoading: false 
          });
        }
      },
      
      fetchStock: async () => {
        const { stockYearsSoldIn, stockNeedsRestock, stockSelectedCategoryIds, stockSelectedProviderIds, stockSelectedCountryNames } = get();
        set({ isStockLoading: true, stockError: null });
        try {
          const stock = await api.fetchSpisaStock({
            yearsSoldIn: stockYearsSoldIn,
            categoryIds: stockSelectedCategoryIds.length > 0 ? stockSelectedCategoryIds : undefined,
            providerIds: stockSelectedProviderIds.length > 0 ? stockSelectedProviderIds : undefined,
            countryNames: stockSelectedCountryNames.length > 0 ? stockSelectedCountryNames : undefined,
            needsRestock: stockNeedsRestock
          });
          set({ stock, isStockLoading: false });
        } catch (error) {
          set({ 
            stockError: error instanceof Error ? error.message : 'Failed to fetch stock', 
            isStockLoading: false 
          });
        }
      },
      
      fetchStockValueByCategory: async () => {
        const { stockYearsSoldIn } = get();
        set({ isStockValueByCategoryLoading: true, stockValueByCategoryError: null });
        try {
          const stockValueByCategory = await api.fetchSpisaStockValueByCategory(stockYearsSoldIn);
          set({ stockValueByCategory, isStockValueByCategoryLoading: false });
        } catch (error) {
          set({ 
            stockValueByCategoryError: error instanceof Error ? error.message : 'Failed to fetch stock value by category', 
            isStockValueByCategoryLoading: false 
          });
        }
      },
      
      fetchStockSnapshots: async () => {
        set({ isStockSnapshotsLoading: true, stockSnapshotsError: null });
        try {
          const stockSnapshots = await api.fetchSpisaStockSnapshots();
          set({ stockSnapshots, isStockSnapshotsLoading: false });
        } catch (error) {
          set({ 
            stockSnapshotsError: error instanceof Error ? error.message : 'Failed to fetch stock snapshots', 
            isStockSnapshotsLoading: false 
          });
        }
      },
      
      fetchStockDiscontinued: async () => {
        const { stockDiscontinuedYearsNotSold } = get();
        set({ isStockDiscontinuedLoading: true, stockDiscontinuedError: null });
        try {
          const stockDiscontinued = await api.fetchSpisaStockDiscontinued(stockDiscontinuedYearsNotSold);
          set({ stockDiscontinued, isStockDiscontinuedLoading: false });
        } catch (error) {
          set({ 
            stockDiscontinuedError: error instanceof Error ? error.message : 'Failed to fetch discontinued stock', 
            isStockDiscontinuedLoading: false 
          });
        }
      },
      
      fetchStockDiscontinuedGrouped: async () => {
        const { stockDiscontinuedYearsNotSold } = get();
        set({ isStockDiscontinuedGroupedLoading: true, stockDiscontinuedGroupedError: null });
        try {
          const stockDiscontinuedGrouped = await api.fetchSpisaStockDiscontinuedGrouped(stockDiscontinuedYearsNotSold);
          set({ stockDiscontinuedGrouped, isStockDiscontinuedGroupedLoading: false });
        } catch (error) {
          set({ 
            stockDiscontinuedGroupedError: error instanceof Error ? error.message : 'Failed to fetch grouped discontinued stock', 
            isStockDiscontinuedGroupedLoading: false 
          });
        }
      },
      
      fetchStockCategories: async () => {
        set({ isStockCategoriesLoading: true, stockCategoriesError: null });
        try {
          const stockCategories = await api.fetchStockCategories();
          set({ stockCategories, isStockCategoriesLoading: false });
        } catch (error) {
          set({ 
            stockCategoriesError: error instanceof Error ? error.message : 'Failed to fetch stock categories', 
            isStockCategoriesLoading: false 
          });
        }
      },
      
      fetchStockProviders: async () => {
        set({ isStockProvidersLoading: true, stockProvidersError: null });
        try {
          const stockProviders = await api.fetchStockProviders();
          set({ stockProviders, isStockProvidersLoading: false });
        } catch (error) {
          set({ 
            stockProvidersError: error instanceof Error ? error.message : 'Failed to fetch stock providers', 
            isStockProvidersLoading: false 
          });
        }
      },
      
      fetchStockCountries: async () => {
        set({ isStockCountriesLoading: true, stockCountriesError: null });
        try {
          const stockCountries = await api.fetchStockCountries();
          set({ stockCountries, isStockCountriesLoading: false });
        } catch (error) {
          set({ 
            stockCountriesError: error instanceof Error ? error.message : 'Failed to fetch stock countries', 
            isStockCountriesLoading: false 
          });
        }
      },
      
      // Combined fetch actions
      fetchAllDashboardData: async () => {
        const { 
          fetchBalances, 
          fetchFuturePayments, 
          fetchDueBalance, 
          fetchSpisaBilled, 
          fetchXerpBilled 
        } = get();
        
        // Execute all fetch operations in parallel
        await Promise.all([
          fetchBalances(),
          fetchFuturePayments(),
          fetchDueBalance(),
          fetchSpisaBilled('month'),
          fetchSpisaBilled('day'),
          fetchXerpBilled('month'),
          fetchXerpBilled('day')
        ]);
      },
      
      fetchAllAccountsReceivableData: async () => {
        const { fetchBalances } = get();
        await fetchBalances();
      },
      
      fetchAllInvoicesData: async () => {
        const { fetchBillsHistory, fetchBills } = get();
        await Promise.all([
          fetchBillsHistory(),
          fetchBills()
        ]);
      },
      
      fetchAllCurrentStockData: async () => {
        const { 
          fetchStock, 
          fetchStockValueByCategory, 
          fetchStockSnapshots,
          fetchStockCategories,
          fetchStockProviders,
          fetchStockCountries
        } = get();
        
        // Fetch filter options first
        await Promise.all([
          fetchStockCategories(),
          fetchStockProviders(),
          fetchStockCountries()
        ]);
        
        // Then fetch data
        await Promise.all([
          fetchStock(),
          fetchStockValueByCategory(),
          fetchStockSnapshots()
        ]);
      },
      
      fetchAllDiscontinuedStockData: async () => {
        const { fetchStockDiscontinued, fetchStockDiscontinuedGrouped } = get();
        await Promise.all([
          fetchStockDiscontinued(),
          fetchStockDiscontinuedGrouped()
        ]);
      }
    })
  )
);

export default useStore;
