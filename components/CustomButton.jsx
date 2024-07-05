import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
  tittle,
  handlePress,
  isLoading,
  containerStyles,
  textStyles,
}) => {
  return (
    <TouchableOpacity
      className={`bg-secondary ${containerStyles} justify-center items-center rounded-xl min-h-[42px]`}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text className={`text-primary font-pbold text-lg ${textStyles}`}>
        {tittle}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
