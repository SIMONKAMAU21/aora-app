import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import Inputs from "../../components/InputFields";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";

const SignUp = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: ""
    });
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const validateForm = () => {
        let valid = true;
        let newErrors = { username: "", password: "", confirmPassword: "", email: "" };

        if (!form.username) {
            newErrors.username = "Username is required";
            valid = false;
        }
        if (!form.email) {
            newErrors.email = "Email is required";
            valid = false;
        }
        if (!form.password) {
            newErrors.password = "Password is required";
            valid = false;
        }
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const submit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await createUser(form.email, form.password, form.username); // Only `password` is sent here
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
                    {errors.username ? (
                        <Text className="text-red-500 mt-2">{errors.username}</Text>
                    ) : null}
                    <Inputs
                        label="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    {errors.email ? (
                        <Text className="text-red-500 mt-2">{errors.email}</Text>
                    ) : null}
                    <Inputs
                        label="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-9"
                        secureTextEntry
                    />
                    {errors.password ? (
                        <Text className="text-red-500 mt-2">{errors.password}</Text>
                    ) : null}
                    <Inputs
                        label="Confirm Password"
                        value={form.confirmPassword}
                        handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                        otherStyles="mt-9"
                        secureTextEntry
                    />
                    {errors.confirmPassword ? (
                        <Text className="text-red-500 mt-2">{errors.confirmPassword}</Text>
                    ) : null}
                    <CustomButton
                        title={submitting ? "Submitting...." : "Sign up"}
                        containerStyles="mt-7"
                        isLoading={submitting}
                        handlePress={submit}
                        disabled={submitting}
                        textStyles='text-black font-pbold'
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

export default SignUp;
