import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import Inputs from "../../components/InputFields";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { signIn,getAllUsers } from "../../lib/appwrite";

const Signin = () => {
  const [form, setForm] = useState({
    password: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.password || !form.email) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      // set it as global state...
      router.replace('/Home');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
    // getAllUsers()
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
          <Text className="text-white text-2xl font-pbold mt-20">Sign in</Text>
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
            title="Sign in"
            containerStyles="mt-7"
            loading={loading}
            handlePress={submit}
          />
          <View className='justify-center gap-2 pt-5 flex-row'>
            <Text className='text-gray-100 text-xl'>
              Don't have an account?
            </Text>
            <Link href='/signUp' className="text-secondary text-lg">Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
