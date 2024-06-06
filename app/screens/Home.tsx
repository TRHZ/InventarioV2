import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
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
    <SafeAreaView style={styles.container}>
      <FlatList 
        data={products} 
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productItem} 
            onPress={() => navigation.push("ProductDetails", { product: item })}
          >
            <View style={styles.productInfo}>
              <Text style={styles.itemTitle}>{item.nombre}</Text>
              <Text style={styles.itemDetails}>Precio: ${item.precio.toFixed(2)}</Text>
            </View>
            <Text style={[styles.itemBadge, item.currentStock < item.minStock ? styles.itemBadgeError : null]}>
              Stock: {item.currentStock}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()} 
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', // Asegura que el color del texto sea negro
  },
  itemDetails: {
    fontSize: 14,
    opacity: 0.7,
    color: 'black', // Asegura que el color del texto sea negro
  },
  itemBadge: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: 'black', // Asegura que el color del texto sea negro
  },
  itemBadgeError: {
    backgroundColor: 'red',
    color: 'white',
  },
});

export default Home;
