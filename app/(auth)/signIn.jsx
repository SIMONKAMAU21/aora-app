import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, ToastAndroid } from "react-native";
import { images } from "../../constants";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import Inputs from "../../components/InputFields";
import { useGlobalContext } from "../../authContext";

const Signin = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "simonkamau7466@gmail.com",
    password: "12345689",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      ToastAndroid.show('successfully logged in ',ToastAndroid.SHORT)
      router.replace("/Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to Aora
          </Text>

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
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton
            title={loading ? "sign in ...." :"Sign In"}
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={loading}
            disabled={loading}
            textStyles='text-black font-pbold'
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/signUp"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
