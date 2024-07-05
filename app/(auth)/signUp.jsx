import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import Inputs from "../../components/InputFields";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";

const signUp = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const submit = async () => {
        if (!form.username || !form.password || !form.email) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setSubmitting(true);
        try {
            await createUser(form.email, form.password, form.username);
            router.replace('/Home');
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full h-[95vh] my-6 px-4">
                    <Image
                        source={images.logo}
                        className="w-[115px] h-[35px]"
                        resizeMode="contain"
                    />
                    <Text className="text-white text-2xl font-pbold mt-20">Sign up</Text>
                    <Inputs
                        label="Username"
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-7"
                    />
                    <Inputs
                        label="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    <Inputs
                        label="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-9"
                        secureTextEntry
                    />
                    <CustomButton
                        title="Sign up"
                        containerStyles="mt-7"
                        loading={submitting}
                        handlePress={submit}
                    />
                    <View className='justify-center gap-2 pt-5 flex-row'>
                        <Text className='text-gray-100 text-xl'>
                            Already have an account?
                        </Text>
                        <Link href='/signIn' className="text-secondary text-lg">Login</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default signUp;
