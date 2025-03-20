import React, { useState } from "react";
import {
    Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Keyboard
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = isRegister
        ? "https://mserver-pi.vercel.app/register"
        : "https://mserver-pi.vercel.app/login";

    const handleAuth = async () => {
        Keyboard.dismiss();
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsRegister(false);
                setUsername("");
                setPassword("");
                if (!isRegister) {
                    await AsyncStorage.setItem("authToken", data.token); // Save token
                    onLoginSuccess();
                    onClose();
                }
                else {
                    alert(data.message)
                }
                console.log(await AsyncStorage.getItem("authToken"))
            } else {
                Alert.alert("Error", data.error || "Authentication failed!");
            }
        } catch (error: any) {
            console.log("error", error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Close Button (X) */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <AntDesign name="close" size={24} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
                        <Text style={styles.toggleText}>
                            {isRegister ? "Already have an account? Login" : "New here? Register"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    modalContent: {
        width: 320,
        padding: 20,
        backgroundColor: "#121212",
        borderRadius: 10,
        alignItems: "center",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 8,
        zIndex: 10, 
    },    
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 5,
        marginBottom: 12,
        color: "white",
        backgroundColor: "#222",
    },
    button: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    toggleText: {
        marginTop: 15,
        color: "red",
        fontSize: 14,
    },
});

export default LoginModal;
