import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Button, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App.tsx';
import { Product } from '../model/Product.ts';
import LocalDB from '../persistance/localdb';

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;
type ProductDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetails'>;

export type ProductDetailsParams = {
  product: Product;
};

type Props = {
  route: ProductDetailsRouteProp;
  navigation: ProductDetailsNavigationProp;
};

function ProductDetails({ route, navigation }: Props): React.JSX.Element {
  const { product } = route.params;
  const [loadedProduct, setLoadedProduct] = useState<Product | null>(null);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [egresos, setEgresos] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setLoadedProduct(product);
      fetchMovimientos(product.id);
    }, [product])
  );

  useEffect(() => {
    console.log("El valor de currentStock ha cambiado:", loadedProduct?.currentStock);
  }, [loadedProduct?.currentStock]);

  const fetchMovimientos = async (productId: number) => {
    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM ingresos WHERE productoId = ?',
          [product.id],
          (_, { rows }) => {
            let ingresosArray: any[] = [];
            for (let i = 0; i < rows.length; i++) {
              ingresosArray.push(rows.item(i));
            }
            setIngresos(ingresosArray);
          }
        );
        tx.executeSql(
          'SELECT * FROM egresos WHERE productoId = ?',
          [product.id],
          (_, { rows }) => {
            let egresosArray: any[] = [];
            for (let i = 0; i < rows.length; i++) {
              egresosArray.push(rows.item(i));
            }
            setEgresos(egresosArray);
          }
        );
      });
    } catch (error) {
      console.error("Error consultando movimientos:", error);
    }
  };

  const navigateToEntries = () => {
    navigation.navigate('Entries', { productId: product.id });
  };

  const navigateToExits = () => {
    navigation.navigate('Exits', { productId: product.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {loadedProduct && (
          <View style={styles.productContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>{loadedProduct.nombre}</Text>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.text}>{loadedProduct.precio}</Text>
            <Text style={styles.label}>Minimum Stock:</Text>
            <Text style={styles.text}>{loadedProduct.minStock}</Text>
            <Text style={styles.label}>Current Stock:</Text>
            <Text style={styles.text}>{loadedProduct.currentStock}</Text>
            <Text style={styles.label}>Maximum Stock:</Text>
            <Text style={styles.text}>{loadedProduct.maxStock}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Go to Entries" onPress={navigateToEntries} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Go to Exits" onPress={navigateToExits} />
            </View>
            <Text style={styles.label}>Ingresos:</Text>
            {ingresos.map((ingreso, index) => (
              <View key={index} style={styles.transactionItem}>
                <Text style={styles.transactionText}>ID: {ingreso.id}</Text>
                <Text style={styles.transactionText}>Cantidad: {ingreso.cantidad}</Text>
                <Text style={styles.transactionText}>Fecha: {ingreso.fecha}</Text>
              </View>
            ))}
            <Text style={styles.label}>Egresos:</Text>
            {egresos.map((egreso, index) => (
              <View key={index} style={styles.transactionItem}>
                <Text style={styles.transactionText}>ID: {egreso.id}</Text>
                <Text style={styles.transactionText}>Cantidad: {egreso.cantidad}</Text>
                <Text style={styles.transactionText}>Fecha: {egreso.fecha}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',  // Estilo añadido para hacer el texto negro
  },
  text: {
    color: 'black',  // Estilo añadido para hacer el texto negro
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  transactionItem: {
    marginBottom: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  transactionText: {
    fontSize: 14,
    color: 'black',  // Estilo añadido para hacer el texto negro
  },
});

export default ProductDetails;
