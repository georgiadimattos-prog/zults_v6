// App.js
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screens
import MainScreen from "./components/screens/mainscreen/MainScreen";
import SettingsScreen from "./components/screens/settings/SettingsScreen";
import AddToWalletScreen from "./components/screens/wallet/AddToWalletScreen";
import ActivitiesScreen from "./components/screens/activities/ActivitiesScreen";

// Get Rezults flow
import GetRezults_SelectProviderScreen from "./components/screens/getrezults/GetRezults_SelectProviderScreen";
import GetRezults_PasteLinkScreen from "./components/screens/getrezults/GetRezults_PasteLinkScreen";
import GetRezults_LoadingScreen from "./components/screens/getrezults/GetRezults_LoadingScreen";
import GetRezults_HowToFindLinkScreen from "./components/screens/getrezults/GetRezults_HowToFindLinkScreen";
import AddRezultsCardScreen from "./components/screens/getrezults/AddRezultsCardScreen";
import PolicyScreen from "./components/screens/getrezults/PolicyScreen";
import ProvidersListScreen from "./components/screens/getrezults/ProvidersListScreen";

// Share flow
import ShareScreen from "./components/screens/share/ShareScreen";
import ReviewSMSRequest from "./components/screens/share/sms/ReviewSMSRequest";
import SMSRequestSent from "./components/screens/share/sms/SMSRequestSent";
import LinkScreenShareSheet from "./components/screens/share/link/LinkScreen_ShareSheet";
import LinkScreenSuccess from "./components/screens/share/link/LinkScreen_Success";

// Chat + Rezults
import UserChatScreen from "./components/screens/usersearch/UserChatScreen";
import RezultsScreen from "./components/screens/RezultsScreen";
import RezultsTooltipDemo from "./components/screens/rezults/RezultsTooltipDemo"; // ✅ Demo tutorial

// Intro
import IntroVideoScreen from "./components/screens/intro/IntroVideoScreen";

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
          initialRouteName="IntroVideo" // ✅ Start with video
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          {/* Intro Video */}
          <Stack.Screen
            name="IntroVideo"
            component={IntroVideoScreen}
            options={{ animation: "fade" }}
          />

          {/* Main */}
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{ animation: "fade" }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="AddToWallet"
            component={AddToWalletScreen}
            options={{
              presentation: "transparentModal",
              animation: "fade",
              headerShown: false,
            }}
          />

          {/* Activities */}
          <Stack.Screen name="Activities" component={ActivitiesScreen} />

          {/* Get Rezults Flow */}
          <Stack.Screen
            name="GetRezultsSelectProvider"
            component={GetRezults_SelectProviderScreen}
          />
          <Stack.Screen
            name="ProvidersList"
            component={ProvidersListScreen}
          />
          <Stack.Screen
            name="GetRezultsPasteLink"
            component={GetRezults_PasteLinkScreen}
          />
          <Stack.Screen
            name="GetRezultsLoading"
            component={GetRezults_LoadingScreen}
          />
          <Stack.Screen
            name="GetRezultsHowToFindLink"
            component={GetRezults_HowToFindLinkScreen}
          />
          <Stack.Screen
            name="AddRezultsCard"
            component={AddRezultsCardScreen}
          />
          <Stack.Screen name="PolicyScreen" component={PolicyScreen} />

          {/* Share */}
          <Stack.Screen name="Share" component={ShareScreen} />
          <Stack.Screen name="ReviewSMSRequest" component={ReviewSMSRequest} />
          <Stack.Screen name="SMSRequestSent" component={SMSRequestSent} />
          <Stack.Screen name="LinkShareSheet" component={LinkScreenShareSheet} />
          <Stack.Screen name="LinkSuccess" component={LinkScreenSuccess} />

          {/* Chat + Rezults */}
          <Stack.Screen name="UserChat" component={UserChatScreen} />
          <Stack.Screen name="Rezults" component={RezultsScreen} />

          {/* Demo tutorial for Rez */}
          <Stack.Screen
            name="RezultsTooltipDemo"
            component={RezultsTooltipDemo}
            options={{
              headerShown: false, // set true if you want default back nav
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}