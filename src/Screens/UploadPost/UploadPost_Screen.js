import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";

//hooks
import React, { useState } from "react";

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
  const [image, setImage] = useState(null);

  //if user select any file, then information or properties(URL,name,type) will be stored in file useState variable.
  const [fileResult, setFileResult] = useState(null);

  //caption of the post will be stored in caption useState variable.
  const [caption, setCaption] = useState(null);

  //creating reference for firebase storage.

  //dbUpload is an utility function, which upload image,file or video to firebase storage.
  const dbUpload = async (image, caption) => {
    if (!image || !caption) {
      Alert.alert("are you mad or what!");
      return 0;
    }
    const file_name = image.substring(image.lastIndexOf("/") + 1);
    console.log(file_name);

    //convert any file to blob file code is below.
    let result = await fetch(image);
    const blobImage = await result.blob();

    const metadata = { contentType: " image/png" };

    //upload files to firebase code is below.
    const storageRef = ref(storage, "post/");
    const docRef = ref(storageRef, file_name);
    const uploadTask = uploadBytesResumable(docRef, blobImage, metadata);
    const imageURL = getDownloadURL(uploadTask.snapshot.ref).then(
      (downloadURL) => {
        const docRef = addDoc(collection(db, "post"), {
          imageURL: downloadURL,
          caption: caption,
        }).then(() => {
          Alert.alert("your file is uploaded");
          navigation.navigate("Home_Screen");
          setImage(null);
          setCaption(null);
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

  return (
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
