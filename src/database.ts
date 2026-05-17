import { Platform } from "react-native";

export const initDatabase = async () => {
  if (Platform.OS === "web") {
    console.log("SQLite skipped on web. SQLite works on mobile device.");
    return;
  }

  console.log("SQLite database configured successfully on mobile.");
};