import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Animated,
} from "react-native";
import { colors, typography } from "../../../theme";
import arrowRight from "../../../assets/images/navbar-arrow-right.png";
import tomas from "../../../assets/images/TomasB.png";
import melany from "../../../assets/images/melany.png";
import madman from "../../../assets/images/madman.png";
import goodguy from "../../../assets/images/goodguy.png";
import zultsImage from "../../../assets/images/zults.png";
import SearchBar from "../../ui/SearchBar";
import ScreenWrapper from "../../ui/ScreenWrapper";
import { NavbarBackRightText } from "../../ui/Navbar";
import SMSTab from "./tabs/SMSTab";
import LinkTab from "./tabs/LinkTab";
import { useInvite } from "../../ui/useInvite";

export default function ShareScreen({ navigation }) {
  const { sendInvite } = useInvite();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("Users");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const takeoverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: searchFocused && activeTab === "Users" ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(takeoverAnim, {
        toValue: searchFocused && activeTab === "Users" ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [searchFocused, activeTab]);

  const users = [
    { id: "zults-demo", name: "Rez", image: zultsImage, isBot: true },
    { id: "demo1", name: "Melany", image: melany, isVerified: true },
    { id: "demo2", name: "Demo2", image: tomas },
    { id: "demo3", name: "Demo3", image: madman },
    { id: "demo4", name: "Demo4", image: goodguy },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const NAVBAR_HEIGHT = 30;

  const handleUserPress = (user) => {
    navigation.navigate("UserChat", { user });
  };

  const renderTabContent = () => {
    if (activeTab === "Users") {
      const listToShow = search.trim().length === 0 ? users : filteredUsers;

      return (
        <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
          {listToShow.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userRow}
              onPress={() => handleUserPress(user)}
            >
              <Image source={user.image} style={styles.avatar} />
              <Text
                style={styles.username}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.name}
              </Text>
            </TouchableOpacity>
          ))}

          {search.trim().length > 0 && listToShow.length === 0 && (
            <Text
              style={[typography.bodyMedium, styles.emptyText]}
            >
              No users found
            </Text>
          )}
        </ScrollView>
      );
    }

    if (activeTab === "SMS") return <SMSTab navigation={navigation} />;
    if (activeTab === "Link") return <LinkTab />;
    return null;
  };

  const subtitleCopy =
    activeTab === "Users"
      ? "Send or request Rezults with users."
      : activeTab === "Link"
      ? "Someone without the app can view it."
      : "Anonymous SMS nudge to get tested.";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.surface1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper topPadding={0}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background.surface1} />

          <NavbarBackRightText
            rightText={searchFocused && activeTab === "Users" ? "Cancel" : "Invite"}
            onRightPress={() => {
              if (searchFocused && activeTab === "Users") {
                setSearch("");
                setSearchFocused(false);
                Keyboard.dismiss();
              } else {
                sendInvite();
              }
            }}
          />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* ─── Page title + subtitle ─── */}
<View style={styles.headerBlock}>
  <Text
    style={typography.largeTitleMedium}
  >
    Share
  </Text>

  <Text
    style={[typography.bodyRegular, styles.subtitle]}
  >
    Send or request Rezults with users.
  </Text>
</View>

              {/* Tabs */}
              <View style={styles.tabsContainer}>
                {["Users", "Link", "SMS"].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={activeTab === tab ? styles.tabActive : styles.tabInactive}
                    onPress={() => {
                      setActiveTab(tab);
                      setSearch("");
                      setSearchFocused(false);
                    }}
                  >
                    <Text
                      style={
                        activeTab === tab
                          ? styles.tabActiveText
                          : styles.tabInactiveText
                      }
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Search + Content */}
              {activeTab === "Users" && (
                <View style={styles.content}>
                  <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    onCancel={() => {
                      setSearch("");
                      setSearchFocused(false);
                    }}
                    onFocus={() => setSearchFocused(true)}
                  />
                </View>
              )}

              {renderTabContent()}
            </Animated.View>
          </ScrollView>

          {/* Search Takeover */}
          {activeTab === "Users" && (
            <Animated.View
              style={[
                styles.takeoverContainer,
                { opacity: takeoverAnim, top: NAVBAR_HEIGHT },
              ]}
            >
              <View style={styles.takeoverContent}>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  onCancel={() => {
                    setSearch("");
                    setSearchFocused(false);
                  }}
                  onFocus={() => setSearchFocused(true)}
                />
                {renderTabContent()}
              </View>
            </Animated.View>
          )}
        </ScreenWrapper>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  headerBlock: {
  marginTop: 32,
  marginBottom: 24, // ✅ spacing before content
},
  headerTitle: {
    color: colors.foreground.default,
    marginBottom: 6,
  },
  subtitle: {
  marginTop: 8, // ✅ Apple rhythm
  color: colors.foreground.soft,
},
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.surface2,
    borderRadius: 18,
    padding: 4,
    marginTop: 8,
    marginBottom: 16,
    minHeight: 36,
  },
  tabActive: {
    flex: 1,
    backgroundColor: colors.foreground.default,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  tabInactive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  tabActiveText: {
    ...typography.bodyMedium,
    color: colors.background.surface1,
  },
  tabInactiveText: {
    ...typography.bodyMedium,
    color: colors.foreground.soft,
  },
  content: {
    marginBottom: 12,
  },
  userList: {
    marginTop: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomColor: colors.background.surface2,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  username: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.foreground.default,
    includeFontPadding: false,
  },
  emptyText: {
    textAlign: "center",
    color: colors.foreground.soft,
    marginTop: 24,
  },
  takeoverContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  takeoverContent: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40,
  },
});
