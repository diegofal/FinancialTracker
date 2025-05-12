import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Platform, 
  Dimensions, 
  TextStyle, 
  ViewStyle 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../constants/theme';

// Determine if the device is in landscape mode
const isLandscape = () => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

export interface ColumnConfig<T> {
  title: string;
  key: keyof T | string;
  width?: number | string;
  render?: (item: T) => React.ReactNode;
  style?: TextStyle;
  headerStyle?: TextStyle;
}

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowPress?: (item: T) => void;
  keyExtractor: (item: T) => string;
  highlightedRow?: (item: T) => boolean;
  highlightStyle?: ViewStyle;
  emptyMessage?: string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  rowStyle?: ViewStyle;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  enablePagination?: boolean;
  pageSize?: number;
}

function CustomTable<T>({
  data,
  columns,
  onRowPress,
  keyExtractor,
  highlightedRow,
  highlightStyle,
  emptyMessage = 'No hay datos disponibles',
  style,
  headerStyle,
  rowStyle,
  loading = false,
  error = null,
  onRetry,
  enablePagination = false,
  pageSize = 10
}: CustomTableProps<T>) {
  const [page, setPage] = useState(0);
  
  // Handle pagination if enabled
  const paginatedData = enablePagination
    ? data.slice(page * pageSize, (page + 1) * pageSize)
    : data;
  
  const totalPages = enablePagination ? Math.ceil(data.length / pageSize) : 1;
  
  const goToNextPage = () => {
    if (page + 1 < totalPages) {
      setPage(page + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  
  // Render table header
  const renderHeader = () => (
    <View style={[styles.headerRow, headerStyle]}>
      {columns.map((column, index) => (
        <Text
          key={`header-${index}`}
          style={[
            styles.headerCell,
            { width: column.width || 'auto' },
            column.headerStyle
          ]}
          numberOfLines={1}
        >
          {column.title}
        </Text>
      ))}
    </View>
  );
  
  // Render a single row
  const renderRow = (item: T) => {
    const isHighlighted = highlightedRow ? highlightedRow(item) : false;
    
    return (
      <TouchableOpacity
        style={[
          styles.row,
          rowStyle,
          isHighlighted && [styles.highlightedRow, highlightStyle]
        ]}
        onPress={() => onRowPress && onRowPress(item)}
        disabled={!onRowPress}
      >
        {columns.map((column, index) => (
          <View
            key={`cell-${index}`}
            style={[
              styles.cell,
              { width: column.width || 'auto' }
            ]}
          >
            {column.render ? (
              column.render(item)
            ) : (
              <Text 
                style={[styles.cellText, column.style]}
                numberOfLines={1}
              >
                {getCellValue(item, column.key as keyof T)}
              </Text>
            )}
          </View>
        ))}
      </TouchableOpacity>
    );
  };
  
  // Extract value for a cell
  const getCellValue = (item: T, key: keyof T): string => {
    const value = item[key];
    if (value === null || value === undefined) return '';
    return String(value);
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (!enablePagination || data.length <= pageSize) {
      return null;
    }
    
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, page === 0 && styles.paginationButtonDisabled]}
          onPress={goToPrevPage}
          disabled={page === 0}
        >
          <Icon name="chevron-left" size={24} color={page === 0 ? theme.colors.lightGray : theme.colors.dark} />
        </TouchableOpacity>
        
        <Text style={styles.paginationText}>
          {`${page + 1} de ${totalPages}`}
        </Text>
        
        <TouchableOpacity
          style={[styles.paginationButton, page + 1 >= totalPages && styles.paginationButtonDisabled]}
          onPress={goToNextPage}
          disabled={page + 1 >= totalPages}
        >
          <Icon name="chevron-right" size={24} color={page + 1 >= totalPages ? theme.colors.lightGray : theme.colors.dark} />
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  };
  
  // Render table footer with record count
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.resultCount}>
        {`${data.length} resultados`}
      </Text>
      {renderPagination()}
    </View>
  );
  
  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      
      <FlatList
        data={paginatedData}
        renderItem={({ item }) => renderRow(item)}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyState}
        scrollEnabled={true}
      />
      
      {data.length > 0 && renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  headerCell: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.dark,
    paddingHorizontal: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  highlightedRow: {
    backgroundColor: '#ffeaef', // Light red background for highlighted rows
  },
  cell: {
    paddingHorizontal: theme.spacing.xs,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.sm,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  resultCount: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.gray,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationButton: {
    padding: theme.spacing.xs,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark,
    marginHorizontal: theme.spacing.sm,
  }
});

export default CustomTable;
