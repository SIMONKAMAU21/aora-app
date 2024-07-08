import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
    const {Query} = useLocalSearchParams()
  return (
    <View>
      <Text>Search</Text>
    </View>
  )
}

export default Search