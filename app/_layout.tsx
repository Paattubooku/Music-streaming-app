import { View, StyleSheet, StatusBar } from "react-native";
import MiniPlayer from "../components/Player";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./index";
import LibraryScreen from "./library";
import SearchScreen from "./search";
import { MaterialIcons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { store } from "../redux/store"; // Make sure the path is correct

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        {/* Status Bar - Ensures the top bar is black */}
        <StatusBar backgroundColor="black" barStyle="light-content" />

        {/* Main Content with Tabs */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBarStyle, // Use styles for tabBar
            tabBarActiveTintColor: "#FF0436",
            tabBarInactiveTintColor: "gray",
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="home-filled" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Library"
            component={LibraryScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="library-music" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="search" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>

        {/* Fixed Player Module */}
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
    height: 85, // Taller tab bar
    paddingBottom: 15,
    paddingTop: 10,
    marginTop:60
  },
  tabBarLabel: {
    fontSize: 12, // Smaller text like Apple Music
    fontWeight: "500",
    marginTop: -5, // Adjust spacing
  },
  playerContainer: {
    position: "absolute",
    bottom: 0, // Places MiniPlayer above tab bar
    left: 0,
    right: 0,
  },
});
