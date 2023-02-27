import React, { useState, useEffect } from "react";
import { View, Linking, Button } from "react-native";

// import { WebView } from "react-native-webview";

import * as OpenAnything from "react-native-openanything";

const DocumentViewer_screen = ({ route }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileName, setFileName] = useState(null);

  const data = route.params;

  useEffect(() => {
    const fetchFileUrl = async () => {
      console.log(data.url);
      setFileName(data.fileName);
      setFileUrl(data.url);
    };
    fetchFileUrl();
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      {/* <WebView source={{ uri: "http://drive.google.com/viewerng/viewer?embedded=true&url=" + "https://firebasestorage.googleapis.com/v0/b/realtime-chat-46f4c.appspot.com/o/documents%2Fbf307aa5-79ae-4532-8128-ee394537b357.pdf?alt=media&token=2d0c5329-4717-4adc-9418-6614913e5bfa"}} style={{ flex: 1 }} javaScriptEnabled={true}/> */}
      <Button title="Open PDF" onPress={() => OpenAnything.Pdf(fileUrl)} />
      <Button title="Ope" onPress={() => OpenAnything.Text("+919898374059","hello ")} />
    </View>
  );
};

export default DocumentViewer_screen;
