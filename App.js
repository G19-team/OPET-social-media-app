import { StyleSheet, View, Image, Platform } from "react-native";
import { StatusBar } from "react-native";
import { Colors } from "./src/Assets/Colors/Colors";
import { registerRootComponent } from "expo";

import StackNav from "./src/Navigation/StackNav";
import UploadPost_Screen from "./src/Screens/UploadPost/UploadPost_Screen";

function App() {
  return (
    <View style={styles.container}>
      <StackNav />
      <StatusBar backgroundColor={Colors.primaryColor500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: Platform.OS === "web" ? 450 : 0,
    marginVertical: Platform.OS === "web" ? 10 : 0,
  },
});

registerRootComponent(App);

export default App;
