import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTopSearch } from "@/redux/apiSlice";
import SongOptionsModal from "@/components/SongOptionsModal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/typs/navigation";

// Define types for the search item
interface SearchItem {
  id: string;
  title: string;
  type: string;
  image: string;
  perma_url: string;
}

type NavigationProp = StackNavigationProp<RootStackParamList, "SongDetails">;

export default function SearchScreen() {
  const [showAllTrending, setShowAllTrending] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const openModal = (song: any) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  const dispatch = useDispatch<AppDispatch>();
  const { topSearchData, loading, error } = useSelector(
    (state: RootState) => state.launch
  );

  useEffect(() => {
    if (!topSearchData) {
      dispatch(fetchTopSearch());
    }
  }, [dispatch, topSearchData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size={"large"} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  const clearSearchHistory = () => {
    // setSearchHistory([]);
  };

  const clearSearchInput = () => {
    setSearchText("");
  };
  const navigation = useNavigation<NavigationProp>();

  console.log(navigation.getState().routes); // ✅ Check available routes
  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom:70}}>
        {/* Search Header */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          placeholder="Artists, Songs, Lyrics and More"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearchInput}>
            <AntDesign name="closecircle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Search History */}
        {/* <View style={styles.recentContainer}>
          <View style={styles.header}>
            <Text style={styles.recentTitle}>Recently Searched</Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {topSearchData && topSearchData.length > 0 ? (
            topSearchData.map((item: SearchItem) => (
              <TouchableOpacity
                key={item.id}
                style={styles.searchItem}
                onPress={() => console.log(`Opening: ${item.perma_url}`)}
              >
                <Image source={{ uri: item.image }} style={styles.albumArt} />
                <View style={styles.textContainer}>
                  <Text style={styles.albumTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.albumSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
                <AntDesign name="right" size={14} color="gray" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No recent searches</Text>
          )}
        </View> */}

        {/* Trending */}
        <View style={styles.recentContainer}>
          <View style={styles.header}>
            <Text style={styles.recentTitle}>Trending</Text>
            {topSearchData && topSearchData.length > 3 && (
              <TouchableOpacity onPress={() => setShowAllTrending(!showAllTrending)}>
                <Text style={styles.clearText}>{showAllTrending ? "Collapse" : "See All"}</Text>
              </TouchableOpacity>
            )}
          </View>

          {topSearchData && topSearchData.length > 0 ? (
            (showAllTrending ? topSearchData : topSearchData.slice(0, 3)).map((item: SearchItem) => (
              <TouchableOpacity
                key={item.id}
                style={styles.searchItem}
                onPress={() => {
                  navigation.navigate("SongDetails", {
                    songId: item.id,
                    title: item.title,
                    image: item.image,
                  })
                }}
              >
                <Image source={{ uri: item.image }} style={styles.albumArt} />
                <View style={styles.textContainer}>
                  <Text style={styles.albumTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.albumSubtitle} numberOfLines={1}>
                    {item.type}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => openModal(item)}>
                  {item.type === "song"
                    ? <MaterialCommunityIcons name="dots-horizontal" size={20} color="gray" />
                    : <AntDesign name="right" size={14} color="gray" />
                  }
                </TouchableOpacity>

              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No recent searches</Text>
          )}
        </View>
      </ScrollView>
      </View>
      {selectedSong && (
        <SongOptionsModal visible={modalVisible} onClose={() => setModalVisible(false)} song={selectedSong} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 40,
    // marginBottom:60
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },

  // Recently Searched Styles
  recentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom:70
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recentTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearText: {
    color: "red",
    fontSize: 16,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "gray",
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  albumTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  albumSubtitle: {
    color: "gray",
    fontSize: 14,
    marginTop: 3,
  },
  emptyMessage: {
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
