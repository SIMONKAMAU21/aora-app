import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import { router, usePathname } from 'expo-router';

const Search = () => {
  const [query, setQuery] = useState('');
  const pathName = usePathname();

  const handleSearch = () => {
    if (query === '') {
      return Alert.alert('Oops', 'Please enter something');
    }
    if (pathName.startsWith('/Search')) {
      router.setParams({ query });
    } else {
      router.push(`/Search/${query}`);
    }
  };

  return (
    <Searchbar
      value={query}
      onChangeText={(text) => setQuery(text)} 
      placeholder="Type to search...."
      onSubmitEditing={handleSearch} 
    />
  );
};

export default Search;
