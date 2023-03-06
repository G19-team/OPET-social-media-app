import { ScrollView, View, Text } from "react-native";
import PostView from "../../Components/PostView";
import Stories from "../../Components/Stories";

//auth library
import { auth, db } from "../../db/firebaseConfig";
import react, { useLayoutEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Home_Screen = () => {
  const [user, setUser] = useState(null);
  const [orgId, setOrgId] = useState(null);

  useLayoutEffect(() => {
    const init = async () => {
      try {
        setUser(auth.currentUser.uid);

        const id = await AsyncStorage.getItem("orgId")
          .then((id) => setOrgId(id))
          .catch((e) => console.log(e));
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, []);

  // Check if a document exists
  // const checkDocumentExists = async (collectionName, documentId) => {
  //   const nodeRef = doc(db, collectionName, documentId);

  //   getDoc(nodeRef)
  //     .then((docSnapshot) => {
  //       if (docSnapshot.exists()) {
  //         // The node exists
  //         const nodeData = docSnapshot.data();
  //         if (nodeData.orgemail === "info@abcinc.com") {
  //           // The node contains the desired username
  //           console.log(`Node ${nodeId} contains username `);
  //         } else {
  //           // The node does not contain the desired username
  //           console.log(`Node ${nodeId} does not contain username `);
  //         }
  //       } else {
  //         // The node does not exist
  //         console.log(`Node ${nodeId} does not exist`);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(`Error getting node ${nodeId}: ${error}`);
  //     });
  // };

  // Call the function to check if a document exists
  // checkDocumentExists("organization", orgId.toString());

  return (
    <>
      <PostView />
    </>
  );
};

export default Home_Screen;
