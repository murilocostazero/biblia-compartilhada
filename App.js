import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Home,
  ChooseBook,
  ChooseVerse,
  Share,
  Favorites,
  Search,
  DailyVerse
} from './src/pages';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          options={{ headerShown: false }}
          name='Home'
          component={Home} />

        <Stack.Screen
          options={{ headerShown: false }}
          name='ChooseBook'
          component={ChooseBook} />

        <Stack.Screen
          options={{ headerShown: false }}
          name='ChooseVerse'
          component={ChooseVerse} />

        <Stack.Screen
          options={{ headerShown: false }}
          name='Share'
          component={Share} />

        <Stack.Screen
          options={{ headerShown: false }}
          name='Favorites'
          component={Favorites} />

        <Stack.Screen
          options={{ headerShown: false }}
          name='Search'
          component={Search} />

        <Stack.Screen
          options={{ headerShown: false }}
          name='DailyVerse'
          component={DailyVerse} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}