import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../constants'

const index = () => {
  return (
   <SafeAreaView className="bg-primary h-full">
<ScrollView contentContainerStyle={{height:"100%"}}>
<View className="justify-center w-full h-full items-center px-4">
<Image
source={images.logo}
/>
</View>
</ScrollView>
   </SafeAreaView>
  )
}

export default index