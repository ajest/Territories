import React from 'react';
import { View } from 'react-native';
import Map from '../components/Map';
import LayoutHeader from '../components/layout/LayoutHeader';
// import useAsyncStorage from '@rnhooks/async-storage';
// import * as firebase from 'firebase';

// const territories = ['Almagro', 'Balvanera', 'Belgrane'];
// const STORAGE_KEY = '@territories';

export default function HomeScreen({ navigation }) {
  // const [storageItem, updateStorageItem, clearStorageItem] = useAsyncStorage(
  //   STORAGE_KEY
  // );

  // updateStorageItem(JSON.stringify(territories));

  return (
    <View>
      <LayoutHeader navigation={navigation} />
      <Map />
    </View>
  );
}
