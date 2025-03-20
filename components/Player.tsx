import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, StatusBar } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";

const MiniPlayer = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    // Shared values for animation
    const width = useSharedValue(350);
    const height = useSharedValue(60);
    const opacity = useSharedValue(1);

    // Animated styles for MiniPlayer
    const animatedMiniPlayer = useAnimatedStyle(() => ({
        width: width.value,
        height: height.value,
        opacity: opacity.value,
    }));

    // Function to open modal & shrink MiniPlayer
    const openModal = () => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(setModalVisible)(true); // Open modal after animation completes
        });
        width.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.exp) });
        height.value = withTiming(60, { duration: 200, easing: Easing.out(Easing.exp) });
    };

    // Function to close modal & restore MiniPlayer
    const closeModal = () => {
        opacity.value = withTiming(1, { duration: 100 }, () => {
            runOnJS(setModalVisible)(false); // Close modal after animation
        });
        width.value = withTiming(350, { duration: 400, easing: Easing.in(Easing.exp) });
        height.value = withTiming(60, { duration: 400, easing: Easing.in(Easing.exp) });
        
    };

    // Gesture to close modal on swipe down
    const swipeDownGesture = Gesture.Pan()
        .onEnd((event) => {
            if (event.translationY > 50) {
                runOnJS(closeModal)();
            }
        });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Mini Player with Animation */}
            <Animated.View style={[styles.miniPlayer, animatedMiniPlayer]}>
                <TouchableOpacity style={styles.miniPlayerContent} onPress={openModal}>
                    <Image
                        source={{ uri: "https://via.placeholder.com/50" }} // Replace with actual song image
                        style={styles.songImage}
                    />
                    <Text style={styles.songTitle}>Song Title</Text>
                    <TouchableOpacity>
                        <View style={styles.playButton}>
                            <Text style={{ color: "#fff", fontSize: 24 }}>▶</Text>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Animated.View>

            {/* Full Screen Player Modal */}
            {isModalVisible && (
                <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                    <GestureDetector gesture={swipeDownGesture}>
                        <View style={styles.fullPlayer}>
                            <StatusBar hidden={true} />
                            <Text style={styles.fullPlayerText}>Full Player</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </GestureDetector>
                </Modal>
            )}
        </GestureHandlerRootView>
    );
};

export default MiniPlayer;

const styles = StyleSheet.create({
    miniPlayer: {
        position: "absolute",
        bottom: 82,
        backgroundColor: "#111",
        borderRadius: 10,
        overflow: "hidden",
        alignSelf: "center",
    },
    miniPlayerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    songImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
    },
    songTitle: {
        color: "#fff",
        flex: 1,
        marginLeft: 10,
    },
    playButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    fullPlayer: {
        flex: 1,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
    },
    fullPlayerText: {
        color: "#fff",
        fontSize: 24,
    },
    closeButton: {
        color: "red",
        marginTop: 20,
        fontSize: 18,
    },
});
