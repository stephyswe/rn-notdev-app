import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Button, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "@aws-amplify/datastore";
import { Auth, Storage } from "aws-amplify";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

import { Post } from "../models";

const base64ToUint8Array = (base64) => {
  return new Uint8Array(Buffer.from(base64, 'base64'));
};

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const user = Auth.currentAuthenticatedUser();


  const onPost = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const newPost = {
      description: description,
      numberOfLikes: 0,
      numberOfShares: 0,
      postUserId: user.attributes.sub,
      _version: 1,
    };

    if (image) {
      newPost.image = await uploadFile(image);
    }

    await DataStore.save(new Post(newPost));

    setDescription("");
    setImage("");

    navigation.goBack();
  };

  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const key = `${uuidv4()}.png`;
      await Storage.put(key, blob, {
        contentType: "image/png",
      });

      return key;

    } catch (err) {
      console.log("Error uploading file:", err);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { marginBottom: insets.bottom }]}
      contentContainerStyle={{ flex: 1 }}
    //keyboardVerticalOffset={150}
    >
      <Text>Create Post Screen</Text>

      <View style={styles.header}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <Text style={styles.name}>{user.name}</Text>
        <Entypo
          onPress={pickImage}
          name="images"
          size={24}
          color="limegreen"
          style={styles.icon}
        />
      </View>

      <TextInput
        placeholder="What's on your mind?"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.buttonContainer}>
        <Button onPress={onPost} title="Post" disabled={!description} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    paddingTop: 30,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: "500",
  },
  input: {
    marginBottom: "auto",
  },
  buttonContainer: {
    marginTop: "auto",
  },
  icon: {
    marginLeft: "auto",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
});

export default CreatePostScreen;