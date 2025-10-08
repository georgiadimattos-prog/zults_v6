// zults_v7/App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserChatScreen from "./components/screens/usersearch/UserChatScreen";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.home}>
      <Text style={styles.title}>🧠 Zults Chat Test</Text>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate("Chat")}
      >
        <Text style={styles.chatText}>Open Demo Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={UserChatScreen}
          options={{
            title: "Demo Chat",
            headerStyle: { backgroundColor: "#0B0014" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "600" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 40,
  },
  chatButton: {
    backgroundColor: "#7B2CBF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#9D4EDD",
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  chatText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
