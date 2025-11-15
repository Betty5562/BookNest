import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native';
import { darkAcademia } from '../utils/theme'; // optional

const TextInput = ({ error, ...props }) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <RNTextInput
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor={darkAcademia.muted}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: darkAcademia.border,
    padding: 12,
    borderRadius: 8,
    color: darkAcademia.text,
    fontFamily: darkAcademia.font,
  },
  error: {
    color: '#ff6b6b',
    marginTop: 4,
  },
});

export default TextInput;
