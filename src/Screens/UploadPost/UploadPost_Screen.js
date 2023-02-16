import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

//hooks
import React, { useEffect, useLayoutEffect, useState } from "react";

//style for this docuument.
import { styles } from "./Style";

//importing database related libarary.
import { db, storage } from "../../db/firebaseConfig";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

//image and document picker library.
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

//library to display image perfectly.
import FitImage from "react-native-fit-image";

//custome component.
import MyButton from "../../Components/MyButton";
import { Colors } from "../../Assets/Colors/Colors";
import DocumentView from "../../Components/DocumentView";

//responsiv library.
import { moderateScale } from "react-native-size-matters";

const UploadPost_Screen = ({ navigation }) => {
  //if user select image, then information or properties(URL,name,type) will be stored in image useState variable.
  const [image, setImage] = useState("");

  //if user select any file, then information or properties(URL,name,type) will be stored in file useState variable.
  const [fileResult, setFileResult] = useState(null);

  //caption of the post will be stored in caption useState variable.
  const [caption, setCaption] = useState(null);

  //creating reference for firebase storage.
  const [filename, setFileName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  //dbUpload is an utility function, which upload image,file or video to firebase storage.
  const dbUpload = async (image, caption) => {
    if (!image || !caption) {
      Alert.alert("Warning!!", "You have to give both file and caption");
      return 0;
    }

    //convert any file to blob file code is below.
    let result = await fetch(image);
    const blobImage = await result.blob();

    //extractiong file name from the url.
    setFileName(image.substring(image.lastIndexOf("/") + 1));

    const metadata = { contentType: " image/png" };

    //upload files to firebase code is below.
    const storageRef = ref(storage, "post/" + filename);
    setIsLoading(true);
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if ((snapshot.bytesTransferred / snapshot.totalBytes) * 100 == 100) {
          setIsLoading(false);
          Alert.alert(
            "Successfully completed",
            "your file :" + filename + " is successfully uploaded",
            [
              {
                text: "ok",
                onPress: () => navigation.navigate("Home_Screen"),
                style: "cancel",
              },
            ]
          );
        }
        console.log(
          "Upload is " +
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100 +
            "% done"
        );
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        Alert.alert(
          "Failed to upload",
          "uploading task generated an error beacuse of some reasone"
        );
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const docRef = addDoc(collection(db, "post"), {
            imageURL: downloadURL,
            caption: caption,
            likes: [""],
            dislikes: [""],
            comments: [""],
          }).then(() => {
            setImage(null);
            setCaption(null);
          });
        });
      }
    );
  };

  //pickDoc is a function, which open file picker for user.
  const pickDoc = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: [
        "application/pdf" /*pdf*/,
        "application/msword" /*doc*/,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" /*docs*/,
      ],
    })
      .then((result) => {
        if (!(result?.type == "cancel")) {
          setFileResult(result);
          console.log(result);
        }
      })
      .catch((e) => console.log(e));
  };

  //pickImage is a function, which open image picker for user.
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    }).then((result) => {
      if (!result?.canceled) {
        setImage(result.assets[0].uri);
        console.log(result.assets[0].uri);
        console.log(filename);
      }
    });
  };

  //pickVideo is function, which open video picker for user.
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
    }).then((result) => {
      if (!result?.canceled) {
        setImage(result.assets[0].uri);
      }
    });
  };

  return isLoading ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <Text>
        uplaoding done: {progress}% {"\t"}
      </Text>
      <ActivityIndicator size="large" color={Colors.primaryColor200} />
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <Text style={styles.subheading}>Preview :</Text>
      <View
        style={[
          styles.preview,
          !image && {
            height: 200,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {/*if user select image then image will be displayed as preview otherwise file.*/}
        {image ? (
          <FitImage source={{ uri: image }} resizeMode="cover" />
        ) : fileResult ? (
          <DocumentView
            type={fileResult.mimeType}
            name={fileResult.name}
            size={fileResult.size}
          />
        ) : (
          <Text>No preview available.</Text>
        )}
      </View>

      {/* if image or file is selected then dont need to display options */}
      {!image && !fileResult && (
        <>
          <Text style={styles.subheading}>
            Select one of the following option :
          </Text>

          <TouchableOpacity
            style={styles.selectionbox}
            onPress={() => pickImage()}
          >
            <View style={styles.box}>
              <FitImage
                source={require("../../Assets/Icons/Add-Image-icon.png")}
                resizeMode="cover"
                style={styles.icon}
              />

              <Text style={styles.boxtext}>Image</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionbox}
            onPress={() => pickDoc()}
          >
            <View style={styles.box}>
              <FitImage
                source={require("../../Assets/Icons/File-icon.png")}
                resizeMode="cover"
                style={styles.icon}
              />
              <Text style={styles.boxtext}>Pdf, World, PPT or Code file</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionbox}
            onPress={() => pickVideo()}
          >
            <View style={styles.box}>
              <FitImage
                source={require("../../Assets/Icons/Video-icon.png")}
                resizeMode="cover"
                style={styles.icon}
              />
              <Text style={styles.boxtext}>Video</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.captioncontainer}>
        <Text style={styles.subheading}>Enter caption :</Text>
        <TextInput
          style={styles.caption}
          placeholder="Caption..."
          multiline
          numberOfLines={5}
          onChangeText={(value) => {
            setCaption(value);
          }}
          value={caption}
        />
      </View>

      <MyButton
        title="Upload"
        iconName="push-outline"
        iconSize={moderateScale(20)}
        iconColor={Colors.primaryColor10}
        style={styles.btn}
        fontStyle={styles.fontstyle}
        onPress={() => dbUpload(image, caption)}
      />

      {(image || fileResult) && (
        <MyButton
          title="Remove"
          style={styles.btn}
          fontStyle={styles.fontstyle}
          onPress={() => {
            setFileResult(null);
            setImage(null);
            setCaption("");
          }}
        />
      )}
    </ScrollView>
  );
};

export default UploadPost_Screen;
