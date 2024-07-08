import { View, Text } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper'

const Inputs = ({ label, placeholder, value, handleChangeText, otherStyles, secureTextEntry, ...props }) => {
  return (
    <View className={`text-white ${otherStyles}`}>
      <Text className='text-white mt-4'>{label}</Text>
      <View style={{ marginTop:8 }}>
        <TextInput
          label={label}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          mode='outlined'
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </View>
    </View>
  )
}

export default Inputs
