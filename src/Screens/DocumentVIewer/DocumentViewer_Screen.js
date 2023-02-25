import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { WebView } from "react-native-webview";
const MyComponent = ({ route }) => {
  const [fileUrl, setFileUrl] = useState(null);

  const data = route.params;

  useEffect(() => {
    const fetchFileUrl = async () => {
      setFileUrl(data.url);
    };
    fetchFileUrl();
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${fileUrl}`,
        //   uri: fileUrl,
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default MyComponent;
