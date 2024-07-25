import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

const CustomButton = ({
  title,
  handlePress,
  isLoading,
  containerStyles,
  textStyles,
  disabled
}) => {
  return (
   <>
    <Button
    mode="contained"
    className={`bg-secondary text-primary ${containerStyles} ${textStyles} justify-center items-center rounded-xl min-h-[42px]`}
    onPress={handlePress}
    activeOpacity={0.7}
    disabled={disabled}
    loading={isLoading}
    >
      <Text className={`${textStyles}`}>      {title}
      </Text>
    </Button>
    </>
    
  );
};

export default CustomButton;
