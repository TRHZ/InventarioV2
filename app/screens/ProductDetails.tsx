import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Product } from '../model/Product';
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
  const [cantidadEntrada, setCantidadEntrada] = useState('');
  const [cantidadSalida, setCantidadSalida] = useState('');

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
          [productId],
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
          [productId],
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

  const handleEntry = async () => {
    const quantity = parseInt(cantidadEntrada);
    if (isNaN(quantity) || quantity <= 0) {
      console.error('La cantidad debe ser un número positivo.');
      return;
    }

    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE productos SET currentStock = currentStock + ? WHERE id = ?',
          [quantity, product.id],
          () => {
            console.log('Cantidad agregada correctamente al producto.');

            tx.executeSql(
              'INSERT INTO ingresos (productoId, cantidad) VALUES (?, ?)',
              [product.id, quantity],
              () => {
                console.log('Registro de ingreso insertado correctamente');
                setLoadedProduct(prev => prev ? { ...prev, currentStock: prev.currentStock + quantity } : prev);
                setCantidadEntrada('');
                fetchMovimientos(product.id);
              },
              error => console.error('Error al insertar registro de ingreso:', error)
            );
          },
          error => console.error({ error })
        );
      });
    } catch (error) {
      console.error("Error agregando cantidad al producto:", error);
    }
  };

  const handleExit = async () => {
    const quantity = parseInt(cantidadSalida);
    if (isNaN(quantity) || quantity <= 0) {
      console.error('La cantidad debe ser un número positivo.');
      return;
    }

    if (loadedProduct && quantity > loadedProduct.currentStock) {
      console.error('No se puede restar más de lo que hay en el stock.');
      return;
    }

    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE productos SET currentStock = currentStock - ? WHERE id = ?',
          [quantity, product.id],
          () => {
            console.log('Cantidad restada correctamente del producto.');

            tx.executeSql(
              'INSERT INTO egresos (productoId, cantidad) VALUES (?, ?)',
              [product.id, quantity],
              () => {
                console.log('Registro de egreso insertado correctamente');
                setLoadedProduct(prev => prev ? { ...prev, currentStock: prev.currentStock - quantity } : prev);
                setCantidadSalida('');
                fetchMovimientos(product.id);
              },
              error => console.error('Error al insertar registro de egreso:', error)
            );
          },
          error => console.error({ error })
        );
      });
    } catch (error) {
      console.error("Error restando cantidad del producto:", error);
    }
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cantidad a agregar:</Text>
              <TextInput
                style={styles.input}
                value={cantidadEntrada}
                onChangeText={setCantidadEntrada}
                keyboardType="numeric"
                placeholder="Ingrese la cantidad"
                placeholderTextColor="gray"
              />
              <Button title="Agregar Cantidad" onPress={handleEntry} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cantidad a restar:</Text>
              <TextInput
                style={styles.input}
                value={cantidadSalida}
                onChangeText={setCantidadSalida}
                keyboardType="numeric"
                placeholder="Ingrese la cantidad"
                placeholderTextColor="gray"
              />
              <Button title="Restar Cantidad" onPress={handleExit} />
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
  inputContainer: {
    marginVertical: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: 'black',  // Estilo añadido para hacer el texto negro
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

