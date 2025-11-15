import { StyleSheet, View } from 'react-native';

const ScreenContainer = ({ children, centered = false, style }) => (
  <View
    style={[
      styles.container,
      centered && styles.centered,
      style, // allow screen-specific overrides
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25221f', // dark academia background
  },
  centered: {
    justifyContent: 'center',  // vertical centering
    alignItems: 'center',      // horizontal centering
  },
});

export default ScreenContainer;
