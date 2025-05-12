import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  TextInput,
  ViewStyle 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../constants/theme';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterSectionProps {
  title?: string;
  options: FilterOption[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  loading?: boolean;
  multiSelect?: boolean;
  collapsible?: boolean;
  style?: ViewStyle;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedIds,
  onSelectionChange,
  loading = false,
  multiSelect = true,
  collapsible = true,
  style
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Filter options based on search text
  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const toggleOption = (id: string) => {
    if (multiSelect) {
      // Toggle option in multi-select mode
      const updatedSelection = selectedIds.includes(id)
        ? selectedIds.filter(selectedId => selectedId !== id)
        : [...selectedIds, id];
      
      onSelectionChange(updatedSelection);
    } else {
      // In single select mode, just select the clicked option
      onSelectionChange([id]);
    }
  };
  
  const toggleCollapsed = () => {
    if (collapsible) {
      setCollapsed(!collapsed);
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      {title && (
        <TouchableOpacity
          style={styles.header}
          onPress={toggleCollapsed}
          disabled={!collapsible}
        >
          <Text style={styles.headerText}>{title}</Text>
          {collapsible && (
            <Icon
              name={collapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
              size={24}
              color={theme.colors.dark}
            />
          )}
        </TouchableOpacity>
      )}
      
      {!collapsed && (
        <>
          {options.length > 5 && (
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              value={searchText}
              onChangeText={setSearchText}
            />
          )}
          
          {loading ? (
            <Text style={styles.loadingText}>Cargando opciones...</Text>
          ) : (
            <ScrollView style={styles.optionsContainer} nestedScrollEnabled>
              {filteredOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionRow}
                  onPress={() => toggleOption(option.id)}
                >
                  <Text style={styles.optionText}>{option.name}</Text>
                  
                  {multiSelect ? (
                    <Icon
                      name={selectedIds.includes(option.id) ? 'check-box' : 'check-box-outline-blank'}
                      size={20}
                      color={selectedIds.includes(option.id) ? theme.colors.primary : theme.colors.gray}
                    />
                  ) : (
                    <Icon
                      name={selectedIds.includes(option.id) ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={20}
                      color={selectedIds.includes(option.id) ? theme.colors.primary : theme.colors.gray}
                    />
                  )}
                </TouchableOpacity>
              ))}
              
              {filteredOptions.length === 0 && (
                <Text style={styles.emptyText}>No se encontraron coincidencias</Text>
              )}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

interface SwitchFilterProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
}

export const SwitchFilter: React.FC<SwitchFilterProps> = ({
  label,
  value,
  onValueChange,
  style
}) => {
  return (
    <View style={[styles.switchContainer, style]}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.lightGray, true: theme.colors.primary }}
        thumbColor={value ? theme.colors.white : theme.colors.white}
      />
    </View>
  );
};

interface NumberSelectionFilterProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  style?: ViewStyle;
}

export const NumberSelectionFilter: React.FC<NumberSelectionFilterProps> = ({
  label,
  value,
  onValueChange,
  minValue = 0,
  maxValue = 100,
  step = 1,
  style
}) => {
  const increment = () => {
    if (value + step <= maxValue) {
      onValueChange(value + step);
    }
  };
  
  const decrement = () => {
    if (value - step >= minValue) {
      onValueChange(value - step);
    }
  };
  
  return (
    <View style={[styles.numberFilterContainer, style]}>
      <Text style={styles.numberFilterLabel}>{label}</Text>
      
      <View style={styles.numberControlsContainer}>
        <TouchableOpacity
          onPress={decrement}
          style={[styles.numberButton, value <= minValue && styles.numberButtonDisabled]}
          disabled={value <= minValue}
        >
          <Icon name="remove" size={20} color={theme.colors.dark} />
        </TouchableOpacity>
        
        <Text style={styles.numberValue}>{value}</Text>
        
        <TouchableOpacity
          onPress={increment}
          style={[styles.numberButton, value >= maxValue && styles.numberButtonDisabled]}
          disabled={value >= maxValue}
        >
          <Icon name="add" size={20} color={theme.colors.dark} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.small
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.light,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  headerText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium as any,
    color: theme.colors.dark,
  },
  searchInput: {
    margin: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    fontSize: theme.typography.fontSizes.sm,
  },
  optionsContainer: {
    maxHeight: 200,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark,
  },
  loadingText: {
    padding: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.gray,
    fontSize: theme.typography.fontSizes.sm,
  },
  emptyText: {
    padding: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.gray,
    fontSize: theme.typography.fontSizes.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small
  },
  switchLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dark,
  },
  numberFilterContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small
  },
  numberFilterLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm,
  },
  numberControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButton: {
    width: 30,
    height: 30,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  numberButtonDisabled: {
    opacity: 0.5,
  },
  numberValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold as any,
    paddingHorizontal: theme.spacing.md,
  }
});

export default FilterSection;
