import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Amplify } from "aws-amplify";
import { withAuthenticator } from 'aws-amplify-react-native';

import Navigator from "./src/navigation";
import awsconfig from "./src/aws-exports";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
  // weird fix
  if (!Symbol.asyncIterator) {
    Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
  }
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

export default withAuthenticator(App);