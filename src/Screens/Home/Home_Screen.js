import { ScrollView, View } from "react-native";
import PostView from "../../Components/PostView";
import Stories from "../../Components/Stories";
const Home_Screen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stories />
      <PostView />
    </View>
  );
};

export default Home_Screen;
