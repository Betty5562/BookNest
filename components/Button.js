import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = ({ title, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#bfa760',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#f5f0e1',
    fontFamily: 'serif',
    fontSize: 16,
  },
});

export default Button;
