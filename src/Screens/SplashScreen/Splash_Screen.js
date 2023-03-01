import { View, Text, Image } from "react-native";
import React from "react";

export default function Splash_Screen() {
  return (
    <View>
      <Image
        source={require("../../Assets/Img/logo.png")}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
