import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '~/lib/color';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export default function SearchBar({ placeholder, value, onChangeText, onClear }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <Search size={18} color={colors.palette.gray['500']} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.palette.gray['500']}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          clearButtonMode="never" // We'll use our own clear button
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <View style={styles.clearButtonInner}>
              <X size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.palette.gray['100'],
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchContainerFocused: {
    backgroundColor: colors.palette.gray['200'],
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.palette.gray['900'],
  },
  clearButton: {
    marginLeft: 6,
  },
  clearButtonInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.palette.gray['400'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
