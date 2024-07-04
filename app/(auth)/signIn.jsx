import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import Inputs from "../../components/InputFields";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";

const signIn = () => {
  const [form, setForm] = useState({
    password:"",
    Email:""
  })
  const [loading ,setLoading]= useState(false)
  const submit = () => {

  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full h-[95vh] my-6 px-4  ">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-pbold mt-20">Sign in</Text>
          <Inputs
          label="Email"
          placeholder=""
          value={form.Email}
          handleChangeText={(e)=>setForm({...form,Email:e})}
          otherStyles="mt-7"
          keyboardType="email-address"
          
          />
          <Inputs
          label="password"
          value={form.password}
          handleChangeText={(e)=>setForm({...form,password:e})}
          otherStyles="mt-9"
          secureTextEntry
          
          />
          <CustomButton
          tittle={"Sign in"}
          containerStyles={"mt-7"}
          loading={loading}
          handlePress={submit}
          />
          <View className='justify-center gap-2 pt-5 flex-row'>
            <Text className='text-gray-100 text-xl'>
              Don't have an account ?
            </Text>
            <Link href={'/signUp'} className="text-secondary text-lg">Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
