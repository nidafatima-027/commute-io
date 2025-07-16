import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Sun, Moon, Type, Eye, Palette, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DisplaySettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoTheme, setAutoTheme] = useState(true);
  const [fontSize, setFontSize] = useState('Medium');
  const [highContrast, setHighContrast] = useState(false);
  const [accentColor, setAccentColor] = useState('Default');

  const handleBack = () => {
    router.push('/(tabs)/setting');
  };

  const fontSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  const accentColors = [
    { name: 'Default', color: '#4ECDC4' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Orange', color: '#F59E0B' },
  ];

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Display Settings',
      'Are you sure you want to reset all display settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setDarkMode(false);
            setAutoTheme(true);
            setFontSize('Medium');
            setHighContrast(false);
            setAccentColor('Default');
          },
        },
      ]
    );
  };

  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'Small': return 14;
      case 'Medium': return 16;
      case 'Large': return 18;
      case 'Extra Large': return 20;
      default: return 16;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Display Settings</Text>
          <TouchableOpacity onPress={resetToDefaults}>
            <RotateCcw size={24} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Theme Settings */}
          <Text style={styles.sectionTitle}>Theme</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Sun size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Auto Theme</Text>
              <Text style={styles.itemSubtitle}>Follow system theme</Text>
            </View>
            <Switch 
              value={autoTheme} 
              onValueChange={setAutoTheme}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {!autoTheme && (
            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <Moon size={24} color="#2d3748" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>Dark Mode</Text>
                <Text style={styles.itemSubtitle}>Use dark theme</Text>
              </View>
              <Switch 
                value={darkMode} 
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
                thumbColor="#ffffff"
              />
            </View>
          )}

          {/* Text & Display */}
          <Text style={styles.sectionTitle}>Text & Display</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Type size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Font Size</Text>
              <Text style={styles.itemSubtitle}>Adjust text size</Text>
            </View>
            <Text style={styles.currentValue}>{fontSize}</Text>
          </View>

          {/* Font Size Options */}
          <View style={styles.optionsContainer}>
            {fontSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  fontSize === size && styles.selectedOption
                ]}
                onPress={() => setFontSize(size)}
              >
                <Text style={[
                  styles.optionText,
                  { fontSize: getFontSizeValue(size) },
                  fontSize === size && styles.selectedOptionText
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Preview */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Text style={[styles.previewText, { fontSize: getFontSizeValue(fontSize) }]}>
              This is how text will appear in the app
            </Text>
          </View>

          {/* Accessibility */}
          <Text style={styles.sectionTitle}>Accessibility</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Eye size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>High Contrast</Text>
              <Text style={styles.itemSubtitle}>Improve text readability</Text>
            </View>
            <Switch 
              value={highContrast} 
              onValueChange={setHighContrast}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Color Scheme */}
          <Text style={styles.sectionTitle}>Color Scheme</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Palette size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Accent Color</Text>
              <Text style={styles.itemSubtitle}>Choose app accent color</Text>
            </View>
            <Text style={styles.currentValue}>{accentColor}</Text>
          </View>

          {/* Color Options */}
          <View style={styles.colorOptionsContainer}>
            {accentColors.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.color },
                  accentColor === color.name && styles.selectedColorOption
                ]}
                onPress={() => setAccentColor(color.name)}
              >
                {accentColor === color.name && (
                  <Text style={styles.colorCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
    marginTop: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  currentValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  previewContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  previewText: {
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#2d3748',
  },
  colorCheckmark: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
});