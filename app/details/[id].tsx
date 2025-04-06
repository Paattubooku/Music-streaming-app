import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/typs/navigation";
import { BlurView } from "expo-blur";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetails,
  updateCurrentlyPlayingTrack,
  clearDetailsData,
  fetchSingleAlbumDetails,
  fetchSingleSongDetails,
  fetchOtherDetails,
} from "../../redux/apiSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { decode } from "html-entities";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

const MusicScreen = () => {
  const route = useRoute<SongDetailsRouteProp>();
  const navigation = useNavigation();
  const { songId, type } = route.params;

  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { Details } = useSelector((state: RootState) => state.launch);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasProcessed = useRef(false);

  const secondsToTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    let timeString = '';

    if (hours > 0) {
      timeString += `${hours < 10 ? '0' : ''}${hours}:`;
    }
    timeString += `${minutes < 10 ? '0' : ''}${minutes}`;

    return timeString;
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 10);
  };

  useEffect(() => {
    dispatch(fetchDetails({ id: songId, type }));
    return () => {
      dispatch(clearDetailsData())
      hasProcessed.current = false;
    }
  }, [type, songId, dispatch]);

  useEffect(() => {
    if (Details && !hasProcessed.current) {
      hasProcessed.current = true;
      const sortedAlbumArray = Object.entries(Details.modules || {}).sort(([, a]: any, [, b]: any) => {
        return (a?.position ?? 999) - (b?.position ?? 999);
      });

      const sortedAlbums = Object.fromEntries(sortedAlbumArray);

      if (!Array.isArray(Details.list)) {
        if (Details?.more_info?.album_url) {
          const albumId = Details.more_info.album_url.split('/').pop();
          if (albumId) {
            dispatch(fetchSingleAlbumDetails({ id: albumId }));
          }
        } else {
          Details?.more_info?.contents?.split(',').forEach((data: string) => {
            dispatch(fetchSingleSongDetails({ id: data }));
          });
        }
      }

      Object.keys(sortedAlbums).forEach((key) => {
        if (key !== 'artists' && key !== 'list') {
          console.log("KEYS", key)
          const item = sortedAlbums[key];
          console.log("item", item)
          if (item?.title && item?.source && item?.source_params) {
            dispatch(
              fetchOtherDetails({
                title: item.title,
                source: item.source,
                data: new URLSearchParams(item.source_params).toString(),
              })
            );
          }
        }
      });
    }
  }, [dispatch, Details]);


  const handleTrackPress = (track: any) => {
    dispatch(updateCurrentlyPlayingTrack(track));
    setIsPlaying(true);
  };

  const renderTrack: ListRenderItem<any> = ({ item, index }) => (
    <TouchableOpacity style={styles.trackItem} onPress={() => handleTrackPress(item)}>
      <View style={styles.indexContainer}>
        <Text style={styles.index}>{index + 1}</Text>
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{decode(item.title)}</Text>
        <Text numberOfLines={1} style={styles.trackSubtitle}>{decode(item.subtitle)}</Text>
      </View>
      <TouchableOpacity style={styles.trackIcon}>
        <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!Details) return null;

  console.log("Details", Details)
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {isScrolled ? (
          <BlurView intensity={100} tint="dark" style={styles.headerBlur} />
        ) : (
          <View style={styles.headerBlack} />
        )}

        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={23} color="red" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="add" size={23} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialCommunityIcons name="dots-horizontal" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          source={{ uri: Details?.image?.replace("150x150.jpg", "500x500.jpg") }}
          style={styles.albumArt}
        />
        <Text style={styles.title}>{decode(Details.title)}</Text>
        <Text style={styles.artists}>{decode(Details.subtitle)}</Text>
        <Text style={styles.meta}>
          {Details.language
            ? `${Details.language[0].toUpperCase()}${Details.language.slice(1)} • ${Details.year}`
            : `${Details.year}`}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={18} color="red" />
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shuffleButton}>
            <Ionicons name="shuffle" size={18} color="red" />
            <Text style={styles.buttonText}>Shuffle</Text>
          </TouchableOpacity>
        </View>

        {/* Song List */}
        <FlatList
          data={Details?.list || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTrack}
          scrollEnabled={false}
        />

        {Details.type === "album" ? <><Text style={{ color: "gray",marginTop: 20, marginBottom: 10, alignSelf: "flex-start" }}>{Details?.list && formatDate(Details?.list[0].more_info.release_date)}</Text>
          <Text style={{ color: "gray", marginBottom: 10,  alignSelf: "flex-start" }}>
            {Details?.more_info && Details?.more_info.song_count} Songs, {Details?.list && secondsToTime(Details?.list.map((data) => +data.more_info.duration).reduce((accumulator, currentValue) => accumulator + currentValue, 0))} Minutes
          </Text>
          <Text style={{ color: "gray", marginBottom: 10, alignSelf: "flex-start" }}>{Details?.more_info && Details?.more_info.copyright_text}</Text>
          {Details.hasOwnProperty("You Might Like") && Details["You Might Like"].length > 0 && (
            <>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10, marginTop: 20, alignSelf: "flex-start" }}>
                You Might Like
              </Text>

              <FlatList
                data={Details["You Might Like"]}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      marginRight: 12,
                      alignItems: "center",
                      width: 140,
                    }}
                    onPress={() => {
                      navigation.navigate("SongDetails", {
                        songId: item?.perma_url.split('/').pop() || "",
                        type: item.type,
                        title: item.title,
                        image: item.image,
                      })
                    }}
                  >
                    <Image
                      source={{ uri: item.image?.replace("150x150.jpg", "500x500.jpg") }}
                      style={{ width: 140, height: 140, borderRadius: 8 }}
                    />
                    <Text
                      style={{ color: "white", marginTop: 5, textAlign: "center", fontWeight: "bold", }}
                      numberOfLines={1}
                    >
                      {decode(item.title)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
          {Details.hasOwnProperty("Currently Trending Albums") && Details["Currently Trending Albums"].length > 0 && (
            <>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10, marginTop: 20, alignSelf: "flex-start" }}>
                Currently Trending Albums
              </Text>

              <FlatList
                data={Details["Currently Trending Albums"]}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      marginRight: 12,
                      alignItems: "center",
                      width: 140,
                    }}
                    onPress={() => {
                      navigation.navigate("SongDetails", {
                        songId: item?.perma_url.split('/').pop() || "",
                        type: item.type,
                        title: item.title,
                        image: item.image,
                      })
                    }}
                  >
                    <Image
                      source={{ uri: item.image?.replace("150x150.jpg", "500x500.jpg") }}
                      style={{ width: 140, height: 140, borderRadius: 8 }}
                    />
                    <Text
                      style={{ color: "white", marginTop: 5, textAlign: "center", fontWeight: "bold", }}
                      numberOfLines={1}
                    >
                      {decode(item.title)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
          {Details.hasOwnProperty("Top Albums from Same Year") && Details["Top Albums from Same Year"].length > 0 && (
            <>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10, marginTop: 20, alignSelf: "flex-start" }}>
                Top Albums from Same Year
              </Text>

              <FlatList
                data={Details["Top Albums from Same Year"]}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      marginRight: 12,
                      alignItems: "center",
                      width: 140,
                    }}
                    onPress={() => {
                      navigation.navigate("SongDetails", {
                        songId: item?.perma_url.split('/').pop() || "",
                        type: item.type,
                        title: item.title,
                        image: item.image,
                      })
                    }}
                  >
                    <Image
                      source={{ uri: item.image?.replace("150x150.jpg", "500x500.jpg") }}
                      style={{ width: 140, height: 140, borderRadius: 8 }}
                    />
                    <Text
                      style={{ color: "white", marginTop: 5, textAlign: "center", fontWeight: "bold", }}
                      numberOfLines={1}
                    >
                      {decode(item.title)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}</> : ""}

      </ScrollView>
    </View>
  );
};

const HEADER_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // paddingHorizontal: 20
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  headerBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBlack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  headerRight: {
    flexDirection: "row",
    gap: 6,
  },
  headerButton: {
    padding: 5,
    backgroundColor: "#202121",
    borderRadius: 25,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 10,
    paddingBottom: 100,
    alignItems: "center",
    paddingHorizontal:20
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 10,
    marginTop: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  artists: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  meta: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  playButton: {
    flex:1,
    flexDirection: "row",
    backgroundColor: "#202121",
    justifyContent:"center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  shuffleButton: {
    flex:1,
    flexDirection: "row",
    justifyContent:"center",
    backgroundColor: "#202121",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "red",
    marginLeft: 8,
    fontSize: 16,
    fontWeight:"600"
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    width: "100%",
  },
  indexContainer: {
    width: 25,
    alignItems: "center",
    marginRight: 15,
  },
  index: {
    color: "#aaa",
    fontSize: 14,
  },
  trackInfo: {
    // flex: 1,
    width: "80%"
  },
  trackTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 1
  },
  trackSubtitle: {
    color: "gray",
    fontSize: 13,
  },
  trackIcon: {
    paddingLeft: 5,
    // marginVertical:-10
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

export default MusicScreen;


// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../redux/store'; // Adjust this path
// import {
//   fetchDetails,
//   updateCurrentlyPlayingTrack,
//   updateAudioQueue,
// } from '../../redux/apiSlice';
// import { Ionicons } from '@expo/vector-icons';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { RootStackParamList } from '@/typs/navigation';

// type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

// const MusicScreen = () => {
//   const route = useRoute<SongDetailsRouteProp>();
//   const dispatch = useDispatch<AppDispatch>();
//   const { songId, type, title, image } = route.params;
//   const { Details, currentlyPlayingTrack, AudioQueue, loading, error } = useSelector(
//     (state: RootState) => state.launch
//   );

// const [isPlaying, setIsPlaying] = useState(false);

//   // useEffect(() => {
//   //   dispatch(fetchDetails({ id: songId, type: type }));
//   // }, [dispatch]);


//   useEffect(() => {
//     if (!Details) {
//       dispatch(fetchDetails({ id: songId, type: type }));
//     }
//   }, [dispatch, Details]);

//   useEffect(() => {
//     if (Details?.songs) {
//       dispatch(updateAudioQueue(Details.songs));
//       dispatch(updateCurrentlyPlayingTrack(Details.songs[0]));
//     }
//   }, [Details]);

// const handleTrackPress = (track: any) => {
//   dispatch(updateCurrentlyPlayingTrack(track));
//   setIsPlaying(true);
// };

//   const togglePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

// const renderTrack = ({ item, index }: any) => (
//   <TouchableOpacity style={styles.trackItem} onPress={() => handleTrackPress(item)}>
//     <View style={styles.indexContainer}>
//       <Text style={styles.index}>{index + 1}</Text>
//     </View>
//     <View style={styles.trackInfo}>
//       <Text style={styles.trackTitle}>{item.title}</Text>
//       <Text style={styles.trackSubtitle}>{item.subtitle}</Text>
//     </View>
//     <TouchableOpacity>
//       <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
//     </TouchableOpacity>
//   </TouchableOpacity>
// );

//   if (loading) return <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 100 }} />;
//   if (error) return <Text style={styles.errorText}>{error}</Text>;
//   console.log("data", Details)
//   return (
//     <View style={styles.container}>
//       {/* Player Bar */}
//       {Details && (
//         <View style={styles.playerContainer}>
//           <Image
//             source={{ uri: Details.image || '' }}
//             style={styles.playerImage}
//           />
//           <View style={styles.playerInfo}>
//             <Text style={styles.trackTitle}>{Details.title}</Text>
//             <Text style={styles.trackSubtitle}>{Details.subtitle}</Text>
//           </View>
//           <TouchableOpacity onPress={togglePlayPause}>
//             <Ionicons
//               name={isPlaying ? 'pause-circle' : 'play-circle'}
//               size={48}
//               color="#1DB954"
//             />
//           </TouchableOpacity>
//         </View>
//       )}

// {/* Songs List */}
// <FlatList
//   data={Details?.list}
//   keyExtractor={(item) => item.id}
//   renderItem={renderTrack}
//   contentContainerStyle={{ paddingBottom: 100 }}
// />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0D0D0D',
//     paddingTop: 50,
//     paddingHorizontal: 16,
//   },
//   playerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 20,
//   },
// index: {
//   color: "#aaa",
//   fontSize: 14,
// },
// indexContainer: {
//   width: 25,
//   alignItems: "stretch",
//   justifyContent:'flex-start'
// },
//   playerImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   playerInfo: {
//     flex: 1,
//   },
// trackTitle: {
//   color: 'white',
//   fontSize: 16,
//   fontWeight: 'bold',
// },
// trackSubtitle: {
//   color: 'gray',
//   fontSize: 13,
// },
// trackItem: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   paddingVertical: 10,
//   borderBottomColor: '#333',
//   borderBottomWidth: 1,
// },
//   trackImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   trackInfo: {
//     flex: 1,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 100,
//     fontSize: 16,
//   },
// });


// export default MusicScreen;


