import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface SongOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    song: {
        title: string;
        type: string;
        image: string;
    };
}

const SongOptionsModal: React.FC<SongOptionsModalProps> = ({ visible, onClose, song }) => {
    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles.container}>
                {/* <BlurView blurType="dark" blurAmount={300} /> */}

                <View style={styles.modalContent}>
                    {/* Song Details */}
                    <Image source={{ uri: song.image }} style={styles.albumArt} />
                    <Text style={styles.songTitle}>{song.title}</Text>
                    <Text style={styles.songArtist}>{song.type}</Text>

                    {/* Options List */}
                    <TouchableOpacity style={styles.optionButton}>
                    <Ionicons name="play" size={24} color="gray" />
                        <Text style={[styles.optionText, { color: 'red',fontWeight:'bold' }]}>Play Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                    <Ionicons name="heart" size={24} color="red" />
                        <Text style={styles.optionText}>Save to Library</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                    <MaterialIcons name="library-music" size={24} color="gray" />
                        <Text style={styles.optionText}>Add to Playlist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                    <MaterialIcons name="skip-next" size={24} color="gray" />
                        <Text style={styles.optionText}>Play Next</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                    <MaterialIcons name="queue" size={24} color="gray" />
                        <Text style={styles.optionText}>Add to Queue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                    <MaterialIcons name="music-note" size={24} color="gray" />
                        <Text style={styles.optionText}>Song Details</Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        position:'relative',
        width: '95%',
        backgroundColor: '#222',
        borderRadius: 15,
        padding: 20,
        paddingTop:75,
        alignItems: 'center',
    },
    albumArt: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 10,
        position: "absolute",
        bottom: 420, // ✅ Adjusted to be above the tabs
        alignItems: "center",
    },
    songTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    songArtist: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
        marginBottom: 10,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        width: '100%',
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 15,
    },
    cancelButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 10,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SongOptionsModal;
