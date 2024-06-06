import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LocalDB from "../persistance/localdb";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Product } from "../model/Product";

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
  navigation: HomeScreenProps;
  route: HomeScreenRoute;
};

const Home: React.FC<HomeProps> = ({ navigation, route }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchData = async () => {
    try {
      LocalDB.init();
      const db = await LocalDB.connect();
      db.transaction(async tx => {
        tx.executeSql(
          'SELECT * FROM productos',
          [],
          (_,res) => {
            let prods: Product[] = [];
            for(let i = 0; i < res.rows.length; i++){
              prods.push(res.rows.item(i) as Product);
            }
            setProducts(prods);
          },
          error => console.error({error}),
        );
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView>
      <FlatList 
        data={products} 
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productItem} 
            onPress={() => navigation.push("ProductDetails", { product: item })}
          >
            <Text style={[styles.itemTitle, {color: 'black'}]}>{item.nombre}</Text>
            <Text style={[styles.itemDetails, {color: 'black'}]}>Precio: ${item.precio.toFixed(2)}</Text>
            <Text style={[styles.itemBadge, {color: 'black'}, item.currentStock < item.minStock ? styles.itemBadgeError : null]}>
              {item.currentStock}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()} 
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productItem: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 20,
  },
  itemDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemBadge: {
    fontSize: 24,
    color: 'green',
    alignSelf: 'center'
  },
  itemBadgeError: {
    color: 'red'
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Home;
