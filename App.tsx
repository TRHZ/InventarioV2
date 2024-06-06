import { NavigationContainer, NavigationProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import ProductDetails, { ProductDetailsParams } from './app/screens/ProductDetails';
import ProductAdd from './app/screens/ProductAdd';
import Exits from './app/screens/Exits';
import Entries from './app/screens/Entries';
import { Button } from 'react-native';

export type StackNavigator = NavigationProp<RootStackParamList>;
const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ProductDetails: ProductDetailsParams;
  ProductAdd: undefined;
  Exits: undefined;
  Entries: undefined;
}

function HomeHeader(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return <Button title='Agregar' onPress={() => navigation.navigate('ProductAdd')} />;
}

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor:'#ffff00'},
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{
            headerRight: HomeHeader,
          }}
        />
        <Stack.Screen name="ProductDetails" component={ProductDetails}/>
        <Stack.Screen name="ProductAdd" component={ProductAdd}/>
        <Stack.Screen name="Exits" component={Exits}/>
        <Stack.Screen name="Entries" component={Entries}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;