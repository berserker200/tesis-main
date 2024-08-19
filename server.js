const express = require('express'); // Importa el módulo Express para crear el servidor web
const mysql = require('mysql2/promise'); // Importa el módulo mysql2 con soporte para promesas para manejar la base de datos MySQL
require('dotenv').config(); // Importa dotenv para manejar variables de entorno

const app = express(); // Crea una instancia de la aplicación Express
const port = process.env.PORT || 3306; // Define el puerto en el que el servidor escuchará las solicitudes

const pool = mysql.createPool({ // Crea un pool de conexiones a la base de datos MySQL
    host: process.env.DB_HOST || 'localhost', // Host donde se encuentra la base de datos
    user: process.env.DB_USER || 'root', // Usuario de la base de datos
    password: process.env.DB_PASSWORD || '12345', // Contraseña del usuario de la base de datos
    database: process.env.DB_NAME || 'chatbot' // Nombre de la base de datos a la que se conectará
});

app.use(express.json()); // Middleware de Express para parsear cuerpos de solicitud JSON

app.post('/api/save', async (req, res) => { // Define una ruta POST en '/api/save' para guardar datos en la base de datos
    const { llave, valor, llave_user  } = req.body;
    if (!llave || !valor || !llave_user) { // Verifica que tanto 'key' como 'value' estén presentes
        return res.status(400).send('Both key and value are required');
    }

    try {
        const connection = await pool.getConnection(); // Obtiene una conexión del pool
        // Ejecuta una consulta para insertar datos en la tabla 'storage'
        const [results] = await connection.execute('INSERT INTO reg_chatbot (llave, valor, llave_user) VALUES (?, ?, ?)', [llave, valor, llave_user]);
        connection.release(); // Libera la conexión de vuelta al pool

        if (results.affectedRows === 1) { // Verifica si se insertó exactamente una fila
            res.status(200).send('Data saved successfully'); // Responde con un estado 200 y un mensaje de éxito
        } else {
            res.status(500).send('Error saving data'); // Responde con un estado 500 y un mensaje de error si no se insertó ninguna fila
        }
      
    } catch (error) {
        console.error('Error connecting to the database:', error); // Imprime el error en la consola
        res.status(500).send('Database connection error'); // Responde con un estado 500 y un mensaje de error de conexión a la base de datos
        
    }

});

app.listen(port, () => { // Hace que el servidor escuche en el puerto especificado
    console.log(`Server is running on http://localhost:${port}`); // Imprime un mensaje en la consola indicando que el servidor está en ejecución
});


