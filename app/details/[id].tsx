import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "@/typs/navigation";
// import Icon from "react-native-vector-icons/Feather";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;


const SongDetailsScreen = () => {
    const route = useRoute<SongDetailsRouteProp>();
    const navigation = useNavigation();
    const { songId, title, image } = route.params;
    console.log(songId)

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={14} color="gray" />
            </TouchableOpacity>

            <Image source={{ uri: image }} style={styles.albumArt} />
            <Text style={styles.songTitle}>{title}</Text>
            {/* <Text style={styles.songArtist}>{artist}</Text> */}
            {/* <Text style={styles.songDescription}>{description}</Text> */}

            <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={24} color="gray" />
                <Text style={styles.playText}>Play Song</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000", padding: 20, alignItems: "center" },
    backButton: { position: "absolute", top: 50, left: 20, padding: 10 },
    albumArt: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
    songTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center" },
    songArtist: { fontSize: 16, color: "#bbb", textAlign: "center", marginBottom: 10 },
    songDescription: { fontSize: 14, color: "#ccc", textAlign: "center", marginBottom: 20 },
    playButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1DB954", padding: 15, borderRadius: 10 },
    playText: { fontSize: 16, color: "#fff", marginLeft: 10 },
});

export default SongDetailsScreen;
