import { View, StyleSheet, StatusBar } from "react-native";
import MiniPlayer from "../components/Player";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../typs/navigation";
import HomeScreen from "./index";
import LibraryScreen from "./library";
import SearchScreen from "./search";
import SongDetailsScreen from "../app/details/[id]";
import { MaterialIcons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

// ✅ Stack for Home
const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SongDetails" component={SongDetailsScreen} />
    </Stack.Navigator>
  );
};

// ✅ Stack for Library
const LibraryStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
      <Stack.Screen name="SongDetails" component={SongDetailsScreen} />
    </Stack.Navigator>
  );
};

// ✅ Stack for Search
const SearchStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="SongDetails" component={SongDetailsScreen} />
    </Stack.Navigator>
  );
};

// ✅ Bottom Tabs (Now using Stack Navigators instead of Direct Screens)
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: "#FF0436",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack} // 🔥 Home has its own Stack
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home-filled" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryStack} // 🔥 Library has its own Stack
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack} // 🔥 Search has its own Stack
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ✅ Root Stack (Wraps Everything)
const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default function Layout() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />

        {/* ✅ Root Stack (Manages Navigation) */}
        <RootStack />

        {/* ✅ Fixed MiniPlayer (Always Visible) */}
        <View style={styles.playerContainer}>
          <MiniPlayer />
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  tabBarStyle: {
    backgroundColor: "black",
    borderTopWidth: 0,
    height: 85,
    paddingBottom: 15,
    paddingTop: 10,
  },
  playerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    padding: 10,
    zIndex: 10,
  },
});
