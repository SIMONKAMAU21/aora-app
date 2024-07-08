import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const SearchPage = () => {
  const { query } = useLocalSearchParams();

  return (
    <SafeAreaView className="h-full text-white bg-primary px-4 item-center justify-center">
      <Text className='text-white text-lg'>{query}</Text>
      {/* <Text className='text-white'>
        hey
      </Text> */}
    </SafeAreaView>
  );
};

export default SearchPage;
