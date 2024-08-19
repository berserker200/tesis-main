const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000; // Define el puerto en el que el servidor escuchará las solicitudes
require('dotenv').config(); // Importa dotenv para manejar variables de entorno

/*app.get('/', (req, res) => {
  res.send('Hola Mundo desde mi primera API en Node.js!');
});*/

app.use(bodyParser.json());

const pool = mysql.createPool({ // Crea un pool de conexiones a la base de datos MySQL
  host: 'localhost',      // Dirección del servidor de MySQL
  port: 3306,             // Puerto del servidor de MySQL
  user: 'root',           // Nombre de usuario para la conexión
  password: '12345',      // Contraseña del usuario
  database: 'chatbot'     // Base de datos a la que se conectará
});

app.use(express.json()); // Middleware de Express para parsear cuerpos de solicitud JSON

/*app.get('/', (req, res) => {
  res.send('Hola Mundo desde mi primera API en Node.js!');
});*/

//Routes
app.use(require('./routes/index'));

app.post('/src', async (req, res) => { // Define una ruta POST en '/api/save' para guardar datos en la base de datos
  const { llave, valor  } = req.body;
  //const { nombre, correo, numero } = req.body; // Extrae 'key' y 'value' del cuerpo de la solicitud

  if (!llave || !valor) { // Verifica que tanto 'key' como 'value' estén presentes
      return res.status(400).send('Both key and value are required');
  }
  

  try {
    const connection = await pool.getConnection(); // Obtiene una conexión del pool
} catch (error) {
    console.error('Error connecting to the database:', error); // Imprime el error en la consola
    res.status(500).send('Database connection error'); // Responde con un estado 500 y un mensaje de error de conexión a la base de datos
}

  try {
      const [results] = await connection.execute('INSERT INTO reg_chatbot (llave, valor) VALUES (?, ?)', [llave, valor]);// Ejecuta una consulta para insertar datos en la tabla 'storage'
      /*const [results] = await connection.execute('INSERT INTO users (nombre, correo, numero) VALUES (?, ?, ?)', [nombre, correo, numero]); */
      connection.release(); // Libera la conexión de vuelta al pool

      if (results.affectedRows === 1) { // Verifica si se insertó exactamente una fila
          res.status(200).send('Data saved successfully'); // Responde con un estado 200 y un mensaje de éxito
      } else {
          res.status(500).send('Error saving data'); // Responde con un estado 500 y un mensaje de error si no se insertó ninguna fila
      }
      /*if (result.affectedRows === 1) {
              res.status(200).json({ message: 'User data saved successfully' });
       } else {
              res.status(500).json({ message: 'Error saving user data' });
      }*/
  } catch (error) {
      console.error('Error al insertar en a la tabla reg_chatbot:', error); // Imprime el error en la consola
      res.status(500).send('Database connection error'); // Responde con un estado 500 y un mensaje de error de conexión a la base de datos
      /*console.error('Database error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ message: 'Email or phone number already exists' });
      } else {
          res.status(500).json({ message: 'Database error' });
      }*/
  }

});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});