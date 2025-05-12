import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import theme from '../constants/theme';

export type IconLibrary = 'FontAwesome' | 'FontAwesome5' | 'MaterialIcons';

interface KpiCardProps {
  title: string;
  primaryValue: string;
  primaryValueColor: string;
  secondaryValue?: string;
  secondaryValueColor?: string;
  iconName: string;
  iconLibrary: IconLibrary;
  iconColor: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  primaryValue,
  primaryValueColor,
  secondaryValue,
  secondaryValueColor = theme.colors.neutral,
  iconName,
  iconLibrary,
  iconColor,
  onPress,
  style
}) => {
  // Render the appropriate icon based on the library prop
  const renderIcon = () => {
    const iconSize = 24;
    
    switch (iconLibrary) {
      case 'FontAwesome':
        return <Icon name={iconName} size={iconSize} color={iconColor} />;
      case 'FontAwesome5':
        return <IconFA5 name={iconName} size={iconSize} color={iconColor} />;
      case 'MaterialIcons':
        return <MaterialIcon name={iconName} size={iconSize} color={iconColor} />;
      default:
        return <Icon name={iconName} size={iconSize} color={iconColor} />;
    }
  };
  
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        
        <Text 
          style={[styles.primaryValue, { color: primaryValueColor }]} 
          numberOfLines={1}
        >
          {primaryValue}
        </Text>
        
        {secondaryValue && (
          <Text 
            style={[styles.secondaryValue, { color: secondaryValueColor }]} 
            numberOfLines={1}
          >
            {secondaryValue}
          </Text>
        )}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
    overflow: 'hidden',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.gray,
    marginBottom: theme.spacing.xs,
  },
  primaryValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    marginBottom: theme.spacing.xs,
  },
  secondaryValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.regular as any,
  }
});

export default KpiCard;
