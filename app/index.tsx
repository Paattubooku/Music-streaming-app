import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchData } from "../redux/apiSlice";
import { AppDispatch, RootState } from "../redux/store"; // ✅ Import types

// Define types
interface Station {
  id: string;
  title: string;
  source: string;
  image: string;
}

interface SectionData {
  key: string;
  stations: Station[];
}

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Correctly typed dispatch
  const { launchData, loading, error } = useSelector(
    (state: RootState) => state.launch
  );

  useEffect(() => {
    if (!launchData) {
      dispatch(fetchLaunchData()); // ✅ Dispatch action correctly
    }
  }, [dispatch, launchData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size={"large"} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // Convert launchData object into an array
  const launchDataArray: SectionData[] = Object.entries(launchData || {}).map(
    ([key, stations]) => ({
      key,
      stations: stations as Station[], // ✅ Explicitly cast to avoid type errors
    })
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={launchDataArray}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{item.key}</Text>
              <FlatList
                data={item.stations}
                keyExtractor={(station) => station.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: station }) => (
                  <View style={styles.cardContainer}>
                    <View style={styles.card}>
                      <Image
                        source={{ uri: station.image?.replace('150x150.jpg', '500x500.jpg') }}
                        style={styles.stationImage}
                      />
                    </View>
                    {/* ✅ Title Below Card & Restricted to One Line */}
                    <Text
                      style={styles.stationName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {station.title}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingTop: 15,
    marginBottom: 60,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  section: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  cardContainer: {
    alignItems: "center", // ✅ Center title below the card
    marginRight: 12,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  stationImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#222",
  },
  stationName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    maxWidth: 160, // ✅ Ensures text stays within card width
    textAlign: "center",
  },
  stationSource: {
    color: "#aaa",
    fontSize: 14,
  },
});
