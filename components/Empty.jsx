import { View, Text, Image } from 'react-native'
import React from 'react'
import{images} from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const Empty = ({title,subtitle}) => {
  return (
    <View className='jistify-center items-center px-4 w-full h-full'>
        <Image
        source={images.empty}
        className='w-[273px] h-[215px]'
        resizeMode='contain'
        />
      <Text className='text-white text-xl '>{title}</Text>
      <Text className='text-white font-pregular mt-3'>{subtitle}</Text>
      <CustomButton
      title='create video'
      containerStyles='w-full mt-10'
      handlePress={()=> router.push('/create')}
      />
    </View>
  )
}

export default Empty