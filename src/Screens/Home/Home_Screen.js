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

  return (
    <>
      <PostView />
    </>
  );
};

export default Home_Screen;
