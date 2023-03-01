import { ScrollView, View, Text } from "react-native";
import PostView from "../../Components/PostView";
import Stories from "../../Components/Stories";

//auth libary
import { auth } from "../../db/firebaseConfig";
import react, { useLayoutEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Home_Screen = () => {
  const [user, setUser] = useState(null);
  const [orgId, setOrgId] = useState(null);

  useLayoutEffect(() => {
    const init = async () => {
      try {
        setUser(auth.currentUser);
        setOrgId(await AsyncStorage.getItem("ordId"));
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, []);
  return (
    <>
      <Text>{orgId}</Text>
      <PostView />
    </>
  );
};

export default Home_Screen;
