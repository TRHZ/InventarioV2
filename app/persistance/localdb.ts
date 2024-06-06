import SQLite from 'react-native-sqlite-storage';

export default class LocalDB {
  static connect() {
    return SQLite.openDatabase({name: 'inventario'});
  }

  static async init() {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS productos (
          id            INTEGER       PRIMARY KEY   AUTOINCREMENT,
          nombre        VARCHAR(64)   NOT NULL,
          precio        DECIMAL(10,2) NOT NULL      DEFAULT '0.0',
          minStock      INTEGER       NOT NULL      DEFAULT 0,
          currentStock  INTEGER       NOT NULL      DEFAULT 0,
          maxStock      INTEGER       NOT NULL      DEFAULT 0
        );`,
        [],
        () => console.log('Created table Productos'),
        error => console.error({error}),
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS movimientos (
          id_movimiento INTEGER     PRIMARY KEY   AUTOINCREMENT,
          id_producto   INTEGER     NOT NULL,
          fecha_hora    DATETIME    NOT NULL,
          cantidad      INTEGER     NOT NULL
        );`,
        [],
        () => console.log('Created table Movimientos'),
        error => console.error({error}),
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ingresos  (
          id          INTEGER       PRIMARY KEY AUTOINCREMENT,
          productoId  INTEGER,
          cantidad    INTEGER,
          fecha       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (productoId)  REFERENCES productos(id)
        )`,
        
        [],
        () => console.log('Created table Ingresos'),
        error => console.error(error),
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS egresos  (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          productoId  INTEGER,
          cantidad    INTEGER,
          fecha       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (productoId) REFERENCES productos(id)
        )`,
        [],
        () => console.log('Created table Egresos'),
        error => console.error(error),
      );
    });
  }
}
