import 'react-native-random-uuid'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Index from "./app/index.tsx"

export default function App() {
  return <Index />
  // return (
  //   <View style={styles.container}>
  //     <Text>Open up App.tsx to start working on your app! Yeah!</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
