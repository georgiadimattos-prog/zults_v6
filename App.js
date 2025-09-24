import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Main Screens
import MainScreen from "./components/screens/mainscreen/MainScreen";
import SettingsScreen from "./components/screens/settings/SettingsScreen";

// Activities
import ActivitiesScreen from "./components/screens/activities/ActivitiesScreen";

// Get Rezults Screens
import GetRezultsScreen from "./components/screens/getrezults/GetRezultsScreen";
import GetRezults_SelectProviderScreen from "./components/screens/getrezults/GetRezults_SelectProviderScreen";
import GetRezults_PasteLinkScreen from "./components/screens/getrezults/GetRezults_PasteLinkScreen";
import GetRezults_LoadingScreen from "./components/screens/getrezults/GetRezults_LoadingScreen";
import GetRezults_ConfirmScreen from "./components/screens/getrezults/GetRezults_ConfirmScreen";
import GetRezults_HowToFindLinkScreen from "./components/screens/getrezults/GetRezults_HowToFindLinkScreen";
import AddRezultsCardScreen from "./components/screens/getrezults/AddRezultsCardScreen";

// Share Screens
import ShareScreen from "./components/screens/share/ShareScreen";
import SMSRequestSent from "./components/screens/share/sms/SMSRequestSent";
import ReviewSMSRequest from "./components/screens/share/sms/ReviewSMSRequest";
import LinkScreenShareSheet from "./components/screens/share/link/LinkScreen_ShareSheet";
import LinkScreenSuccess from "./components/screens/share/link/LinkScreen_Success";
import LinkScreenOffline from "./components/screens/share/link/LinkScreen_Offline";

// Chat + Rezults
import UserChatScreen from "./components/screens/usersearch/UserChatScreen";
import RezultsScreen from "./components/screens/RezultsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "ZultsDiatype-Regular": require("./assets/fonts/ZultsDiatype-Regular.otf"),
    "ZultsDiatype-Bold": require("./assets/fonts/ZultsDiatype-Bold.otf"),
    "ZultsDiatype-Italic": require("./assets/fonts/ZultsDiatype-RegularItalic.otf"),
    "ZultsDiatype-BoldItalic": require("./assets/fonts/ZultsDiatype-BoldItalic.otf"),
    "ZultsDiatype-Medium": require("./assets/fonts/ZultsDiatype-Medium.otf"),
    "ZultsDiatype-MediumItalic": require("./assets/fonts/ZultsDiatype-MediumItalic.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainScreen"
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          {/* Main Wrapper Screen */}
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />

          {/* Activities */}
          <Stack.Screen name="Activities" component={ActivitiesScreen} />

          {/* Get Rezults Flow */}
          <Stack.Screen name="GetRezults" component={GetRezultsScreen} />
          <Stack.Screen
            name="GetRezultsProvider"
            component={GetRezults_SelectProviderScreen}
          />
          <Stack.Screen
            name="GetRezultsLinkInput"
            component={GetRezults_PasteLinkScreen}
          />
          <Stack.Screen
            name="GetRezultsLoading"
            component={GetRezults_LoadingScreen}
          />
          <Stack.Screen
            name="GetRezultsConfirm"
            component={GetRezults_ConfirmScreen}
          />
          <Stack.Screen
            name="GetRezultsHowToFindLink"
            component={GetRezults_HowToFindLinkScreen}
          />
          <Stack.Screen
            name="AddRezultsCard"
            component={AddRezultsCardScreen}
          />

          {/* Share Screens */}
          <Stack.Screen name="Share" component={ShareScreen} />
          <Stack.Screen name="SMSRequestSent" component={SMSRequestSent} />
          <Stack.Screen name="ReviewSMS" component={ReviewSMSRequest} />
          <Stack.Screen
            name="LinkShareSheet"
            component={LinkScreenShareSheet}
          />
          <Stack.Screen name="LinkSuccess" component={LinkScreenSuccess} />
          <Stack.Screen name="LinkOffline" component={LinkScreenOffline} />

          {/* Chat + Rezults */}
          <Stack.Screen name="UserChat" component={UserChatScreen} />
          <Stack.Screen name="Rezults" component={RezultsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
