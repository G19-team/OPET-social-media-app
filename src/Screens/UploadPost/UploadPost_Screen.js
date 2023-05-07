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
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth } from "../../db/firebaseConfig";

import AsyncStorage from "@react-native-async-storage/async-storage";
//image , video and document picker library.
import * as ImagePicker from "expo-image-picker";
import * as ExpoDocumentPicker from "expo-document-picker";
import { Video, AVPlaybackStatus } from "expo-av";

//library to display image perfectly.
import FitImage from "react-native-fit-image";

//custome component.
import MyButton from "../../Components/MyButton";
import { Colors } from "../../Assets/Colors/Colors";
import DocumentView from "../../Components/DocumentView";

//responsiv library.
import { moderateScale } from "react-native-size-matters";
import alert from "../../Utills/alert";

const UploadPost_Screen = ({ navigation }) => {
  //if user select image, then information or properties(URL,name,type) will be stored in image useState variable.
  const [image, setImage] = useState(null);

  const [video, setVideo] = useState(null);

  //if user select any file, then information or properties(URL,name,type) will be stored in file useState variable.
  const [fileResult, setFileResult] = useState(null);

  //caption of the post will be stored in caption useState variable.
  const [caption, setCaption] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [user, setUser] = useState(null);

  const [orgId, setOrgId] = useState(null);

  useLayoutEffect(() => {
    const init = async () => {
      try {
        setUser(auth.currentUser);
        const id = await AsyncStorage.getItem("orgId")
          .then((id) => setOrgId(id))
          .catch((e) => console.log(e));
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, []);

  //dbUploadFiles is an utility function, which only upload description.
  const dbUpload = async (caption) => {
    const userRef = doc(db, "organization", orgId, "users", user.uid);
    let userData = {};
    await getDoc(userRef).then((doc) => {
      userData = doc.data();
    });
    const docRef = await setDoc(
      doc(
        db,
        "organization",
        orgId,
        "users",
        user.uid,
        "posts",
        Date.now().toString()
      ),
      {
        orgId: orgId,
        userId: user.uid,
        userimage: userData.UserImage,
        username: userData.Firstname + " " + userData.Lastname,
        URL: null,
        fileType: null,
        fileName: null,
        likes: [],
        dislikes: [],
        suggestions: [],
        caption: caption,
        createdAt: serverTimestamp(),
      }
    ).then(() => {
      alert("Successfully completed", "your file is successfully uploaded", [
        {
          text: "ok",
          onPress: () => navigation.navigate("Home_Screen"),
          style: "cancel",
        },
      ]);
      setImage(null);
      setFileResult(null);
      setVideo(null);
      setCaption(null);
    });
  };

  //dbUploadFiles is an utility function, which upload image,file or video to firebase storage.
  const dbUploadFiles = async (file, caption, fileType, fileName) => {
    //convert any file to blob file code is below.
    let result = await fetch(file).catch((er) => console.log(er));
    const blobFile = await result.blob();

    //upload files to firebase code is below.
    const storageRef = ref(storage, "post/" + fileName);

    setIsLoading(true);
    const uploadTask = uploadBytesResumable(storageRef, blobFile);

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
            "your file is successfully uploaded",
            [
              {
                text: "ok",
                onPress: () => navigation.navigate("Home_Screen"),
                style: "cancel",
              },
            ]
          );
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        // Alert.alert(
        //   "Failed to upload",
        //   "uploading task generated an error beacuse of some reasone"
        // );
        alert(
          "Failed to upload",
          "uploading task generated an error beacuse of some reasone"
        );
        setIsLoading(false);
        setImage(null);
        setFileResult(null);
        setVideo(null);
        setCaption(null);
      },
      () => {
        const userRef = doc(db, "organization", orgId, "users", user.uid);
        let userData = {};
        getDoc(userRef).then((doc) => {
          userData = doc.data();
        });

        // console.log(doc.data().Firstname);

        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const docRef = await setDoc(
            doc(
              db,
              "organization",
              orgId,
              "users",
              user.uid,
              "posts",
              Date.now().toString()
            ),
            {
              orgId: orgId,
              userId: user.uid,
              userimage: userData.UserImage,
              username: userData.Firstname + " " + userData.Lastname,
              URL: downloadURL,
              fileType: fileType,
              fileName: fileName,
              likes: [],
              dislikes: [],
              suggestions: [],
              caption: caption,
              createdAt: serverTimestamp(),
            }
          ).then(() => {
            setImage(null);
            setFileResult(null);
            setVideo(null);
            setCaption(null);
          });
        });
      }
    );
  };

  //pickDoc is a function, which open file picker for user.
  const pickDoc = async () => {
    let result = await ExpoDocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",
        "application/x-httpd-php",
        "text/javascript",
        "text/html",
        "text/css",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/xml",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/x-c",
      ],
    })
      .then((result) => {
        if (!result?.canceled) {
          console.log(result);
          setFileResult(result);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //pickImage is a function, which open image picker for user.
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    }).then((result) => {
      if (!result?.canceled) {
        setImage(result.assets[0]);
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
        setVideo(result.assets[0]);
      }
    });
  };

  const checkFileType = (image, fileResult, video) => {
    if (!image && !caption) {
      alert("Warning!", "Please provide content for upload.");
      return 0;
    }
    if (image) {
      dbUploadFiles(
        image.uri,
        caption,
        "image/" + image.type,
        image.uri.substring(image.uri.lastIndexOf("/") + 1)
      );
    } else if (fileResult) {
      dbUploadFiles(
        fileResult.uri,
        caption,
        "document/" + fileResult.mimeType.toString(),
        fileResult.name
      );
    } else if (video) {
      dbUploadFiles(
        video.uri,
        caption,
        "video/" + video.type,
        video.uri.substring(video.uri.lastIndexOf("/") + 1)
      );
    } else {
      dbUpload(caption);
    }
  };

  return isLoading ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>
          uplaoding done: {progress.toFixed()}% {"\t"}
        </Text>
        <ActivityIndicator size="large" color={Colors.primaryColor200} />
      </View>
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
        {image && <FitImage source={{ uri: image.uri }} resizeMode="cover" />}
        {fileResult && (
          <DocumentView
            type={fileResult.mimeType}
            name={fileResult.name}
            size={fileResult.size}
          />
        )}
        {video && (
          <Video
            // ref={video}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            source={{
              uri: video.uri,
            }}
            useNativeControls
            isLooping
          />
        )}
        {!image && !fileResult && !video && <Text>No preview available.</Text>}
      </View>

      {/* if image or file is selected then don't need to display options */}
      {!image && !fileResult && !video && (
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
        onPress={() => checkFileType(image, fileResult, video)}
      />

      {(image || fileResult || video || caption) && (
        <MyButton
          title="Remove"
          style={styles.btn}
          fontStyle={styles.fontstyle}
          onPress={() => {
            setFileResult(null);
            setImage(null);
            setVideo(null);
            setCaption("");
          }}
        />
      )}
    </ScrollView>
  );
};

export default UploadPost_Screen;
