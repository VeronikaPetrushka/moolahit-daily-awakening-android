import { View, Image, Text, TouchableOpacity, TextInput, Alert } from "react-native"
import { logo, imagePlacholder } from "../MDAconstants/MDAimages";
import MDAintroinfo from "../MDAconstants/MDAintroinfo";
import { intro } from "../MDAconstants/MDAstyles";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

const MDAintro = () => {
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [userImage, setUserImage] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [user, setUser] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const stored = await AsyncStorage.getItem('MDA_USER');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setNickname(parsed.nickname);
                    setUserImage(parsed.image);
                    setUser(true);
                }
            } catch (e) {
                console.warn('Failed to load user');
            }
        };

        loadUser();
    }, []);

    const loadUserImage = async () => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });

            if (result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setUserImage(uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Image selection error');
        }
    };

    const saveUser = async () => {
        if (!nickname) {
            Alert.alert('Please enter a nickname');
            return;
        }

        try {
            const userData = {
            nickname,
            image: userImage,
            };

            await AsyncStorage.setItem('MDA_USER', JSON.stringify(userData));
            navigation.navigate('MDAchallenge');
        } catch (error) {
            Alert.alert('Error', 'Failed to save user');
        }
    };

    return (
        <View style={intro.container}>

            {
                index < 4 && (
                    <>
                        <Image source={logo} style={intro.logoImage} />

                        <Text style={intro.title}>{MDAintroinfo[index].title}</Text>

                        {
                            MDAintroinfo[index].text.map((t, idx) => (
                                <Text key={idx} style={intro.text}>{t}</Text>
                            ))
                        }

                        <TouchableOpacity
                            style={intro.button}
                            onPress={() =>
                                (user && index === 3) ?
                                    navigation.navigate('MDAchallenge')
                                    : setIndex((prev) => prev + 1)}
                        >
                            <Text style={intro.buttonText}>{MDAintroinfo[index].button}</Text>
                        </TouchableOpacity>
                    </>
                )
            }
            
            {
                (!user && index === 4) && (
                    <>
                            <TouchableOpacity
                                style={intro.imageUploader}
                                onPress={loadUserImage}
                            >
                                {
                                    !userImage ? (
                                            <Image source={imagePlacholder} style={intro.imagePlaceholder} />
                                        ) : (
                                            <Image source={{uri: userImage}} style={intro.userImage} />    
                                    )
                                }
                            </TouchableOpacity>

                            <Text style={intro.title}>Setup your profile:</Text>
                            
                            <TextInput
                                style={intro.nicknameInput}
                                value={nickname}
                                onChangeText={setNickname}
                                placeholder="Your nickname"
                                placeholderTextColor="#774200"
                            />

                            <TouchableOpacity
                                style={intro.button}
                                onPress={saveUser}
                            >
                                <Text style={intro.buttonText}>Save</Text>
                            </TouchableOpacity>
                    </>
                )
            }
            
        </View>
    )
};

export default MDAintro;