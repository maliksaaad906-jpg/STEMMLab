import { Text, View } from "react-native";

import { auth, db } from "../../src/firebase/firebaseConfig";

export default function HomeScreen() {
  console.log(auth);
  console.log(db);

  return (
    <View
      style={{
        flex: 1,
        borderColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Firebase Connected ✅</Text>
    </View>
  );
}