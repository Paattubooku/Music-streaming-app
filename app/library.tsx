import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LoginModal from "../components/LoginModal";

const LibraryScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        // Show Library Content if logged in
        <Text style={styles.text}>Welcome to Your Library</Text>
      ) : (
        // Show Login Button if not logged in
        <TouchableOpacity style={styles.loginButton} onPress={() => setShowLoginModal(true)}>
          <Text style={styles.loginText}>Login to access your Library</Text>
        </TouchableOpacity>
      )}

      {/* Login Modal */}
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true); // Mark user as logged in
          setShowLoginModal(false); // Close modal
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  loginButton: {
    backgroundColor: "#FF0436",
    padding: 12,
    borderRadius: 8,
  },
  loginText: {
    color: "white",
    fontSize: 16,
  },
});

export default LibraryScreen;
