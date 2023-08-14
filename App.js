import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigator from "./src/navigation";

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="auto" />
      <Navigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});