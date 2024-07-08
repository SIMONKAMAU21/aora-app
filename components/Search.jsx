import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { router, usePathname } from 'expo-router';

const Search = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false)
  const pathName = usePathname();

  const handleSearch = () => {
    if (query === '') {
      return Alert.alert('Oops', 'Please enter something');
    }
    if (pathName.startsWith('/Search')) {
      setLoading(true)
      router.setParams({ query });
      setTimeout(() => {
        setQuery('');
      }, 100); 
      setLoading(false)
    } else {
      router.push(`/Search/${query}`);
      setTimeout(() => {
        setQuery('');
      }, 100); 
    }
  };

  return (
   <View className='items-center'>
     <Searchbar
      value={query}
      onChangeText={(text) => setQuery(text)}
      placeholder="Type to search...."
      onSubmitEditing={handleSearch}
    />
    {loading && (
      <ActivityIndicator size={"large"} color='red'/>
    )}
   </View>
  );
};

export default Search;
