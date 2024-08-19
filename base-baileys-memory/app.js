const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot'); // Importa las funciones necesarias para crear el bot de WhatsApp
const BaileysProvider = require('@bot-whatsapp/provider/baileys'); // Importa el proveedor de Baileys para WhatsApp
const MockAdapter = require('@bot-whatsapp/database/mock'); // Importa un adaptador de base de datos mock
const axios = require('axios'); // Importa Axios para hacer solicitudes HTTP

// Función de delay para simular respuesta
const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); // Crea una promesa que se resuelve después de un tiempo específico

// Importa el API
const api = require('./src/index');

const moment = require('moment');

var ahora = Date.now();

let url = 'http://localhost:9000/api';

// Función para manejar la bienvenida y capturar el nombre del usuario
const flowBienvenida = addKeyword(['hola', 'Hola', 'Buenas', 'buenas', 'Buenos dias', 'buenos dias', 'Buenas','buenas'], { sensitive: false }) // Define el flujo de bienvenida que se activa con cualquier mensaje
    .addAnswer("Hola, soy *TechBot* 🤖. Soy experto en los procesos de admisión del Instituto Superior Tecnológico Loja.") // Mensaje inicial de bienvenida
    .addAnswer("Necesitamos que nos ayudes ingresando tus datos") 
    .addAnswer("Cual es su nombre?", { capture: true }, async (ctx, { flowDynamic }) => { // Pregunta por el nombre del usuario y captura la respuesta
        const nombre = ctx.body; // Obtiene el nombre del mensaje del usuario
        ctx.nombre = nombre; // Guarda el nombre en el contexto del usuario
        console.log(moment(ahora).format('YYYY-MM-DD HH:mm:ss'));
        try {
            const response = await axios.post('http://localhost:9000/api', { llave: nombre, valor: '1 nombre', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el nombre a la API para guardarlo
            console.log(response.status);
            if (response.status === 200) { // Si la respuesta es exitosa
                await flowDynamic(`Mucho gusto, ${nombre}, encantado de conocerte. ¿Ingresa tu correo electrónico?`); // Responde con un mensaje de confirmación y pregunta por el correo
               
            }else{
                await flowDynamic('Hubo un problema al guardar tu nombre en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
            } 
        } catch (error) {
            console.error('Error al conectar con el API:', error); // Imprime el error en la consola
           
        }
    })
    
    .addAnswer("¿Cuál es tu correo electronico?",{ capture: true }, async (ctx, { flowDynamic }) => { // Captura la respuesta del usuario para el correo electrónico
        const correo = ctx.body; // Obtiene el correo del mensaje del usuario
        ctx.correo = correo; // Guarda el correo en el contexto del usuario
        console.log(correo);
        console.log(moment(ahora).format('YYYY-MM-DD HH:mm:ss'));
        try {
            
            const response = await axios.post('http://localhost:9000/api', { llave: correo, valor: '2 correo', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el correo a la API para guardarlo
            console.log(response.status);
            if (response.status === 200) { // Si la respuesta es exitosa
                await flowDynamic(`Gracias por proporcionar tu correo electrónico. ¿Cuál es tu Número de WhatsApp?`); // Responde con un mensaje de confirmación y pregunta por el número de WhatsApp
            } else {
                await flowDynamic('Hubo un problema al guardar tu correo electrónico en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
            }
        } catch (error) {
            console.error('Error al conectar o guardar en la base de datos:', error); // Imprime el error en la consola
        }
    })

    .addAnswer("¿Cuál es tu número?",{ capture: true }, async (ctx, { flowDynamic }) => { // Captura la respuesta del usuario para el número de WhatsApp
        const numero = ctx.body; // Obtiene el número del mensaje del usuario
        ctx.número = numero; // Guarda el número en el contexto del usuario
        console.log(numero);
        console.log(moment(ahora).format('YYYY-MM-DD HH:mm:ss'));

        try {
            const response = await axios.post('http://localhost:9000/api', { llave: numero, valor: '3 numero', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
            console.log(response.status);
            if (response.status === 200) { // Si la respuesta es exitosa
                await flowDynamic(`Gracias por proporcionar tu Número de WhatsApp`); // Responde con un mensaje de confirmación
                await Lista(flowDynamic, ctx); // Llama a la función Lista para mostrar las opciones de preguntas
            } else {
                await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
            }
        } catch (error) {
            console.error('Error al conectar o guardar en la base de datos:', error); // Imprime el error en la consola
        }
    });

// Función para manejar la lista a la afirmación 

const Lista = async (flowDynamic) => {
    const messages = [
        { body: "Ingresa el número de la pregunta y te daremos respuesta:" },
        { body: "1. ¿Cómo puedo ingresar al Instituto Superior Tecnológico Loja?" },
        { body: "2. ¿Qué carreras oferta el Instituto Superior Tecnológico Loja?" },
        { body: "3. ¿Cuál es el costo para estudiar en el Instituto Superior Tecnológico Loja?" },
        { body: "4. ¿Qué modalidad tienen las tecnologías?" },
        { body: "5. ¿Cuáles son los horarios de las tecnologías del Instituto Superior Tecnológico Loja?" },
        { body: "6. ¿Qué duración tienen las carreras tecnológicas?" },
        { body: "7. ¿Dónde está ubicado el Instituto Superior Tecnológico Loja?" },
        { body: "8. ¿Cómo contactar a docentes o autoridades?" },
        { body: "9. ¿Qué título se obtiene al estudiar nuestras tecnologías?" },
    ]; // Define las opciones de preguntas que se presentarán al usuario

    for (const message of messages) {
        await delay(100); // Espera 500 milisegundos antes de enviar el siguiente mensaje
        await flowDynamic([message]); // Envía el mensaje al usuario

    }
};

const flowPregunta_Uno = addKeyword(['1'], { sensitive: true })
.addAnswer("Para ingresar el Instituto de seguir los siguientes pasos descritos en la imagen:", null, async (ctx, { flowDynamic }) => {
    const messages = [
        { body: "Enlace", media: "https://i.ibb.co/zhxCfRN/pasos.jpg " },

    ];

    const response = await axios.post('http://localhost:9000/api', { llave: '1 ¿Cómo puedo ingresar al Instituto Superior Tecnológico Loja?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
    console.log(response.status);
    if (response.status === 200) { // Si la respuesta es exitosa
    
    } else {
        await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
    }

    for (const message of messages) {
        await delay(100);  // Espera 200 milisegundos antes de enviar el siguiente mensaje
        await flowDynamic([message]);
    }
});

const flowPregunta_Dos = addKeyword(['2'], { sensitive: true })
    .addAnswer("El Instituto Superior Tecnológico Loja ofrece cuenta con 6 carreras", null, async (ctx, { flowDynamic }) => {
        const messages = [
        { body: "Si te interesa una de las carreras puedes hacer clic en el enlace para obtener más información sobre la carrera de tu interés" },
        { body: ".📠. Contabilidad: https://tecnologicoloja.edu.ec/contabilidad/" },
        { body: ".🥗. Procesamiento de Alimentos: https://tecnologicoloja.edu.ec/alimentos/" },
        { body: ".💻. Desarrollo de Software: https://tecnologicoloja.edu.ec/software/" },
        { body: ".🚗. Mecánica Automotriz: https://tecnologicoloja.edu.ec/automotriz/" },
        { body: ".⚡. Electricidad: https://tecnologicoloja.edu.ec/electricidad/" },
        { body: ".👩‍👧‍👦. Desarrollo Infantil: https://tecnologicoloja.edu.ec/infantil/" },
        ];
        
    const response = await axios.post('http://localhost:9000/api', { llave: '2 ¿Qué carreras oferta el Instituto Superior Tecnológico Loja?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
    console.log(response.status);
    if (response.status === 200) { // Si la respuesta es exitosa

    } else {
        await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
    }

        for (const message of messages) {
            await delay(100);  // Espera 200 milisegundos antes de enviar el siguiente mensaje
            await flowDynamic([message]);
        }
    });


const flowPregunta_Tres = addKeyword(['3'], { sensitive: true })
   .addAnswer("El Instituto Superior Tecnológico Loja es una institución totalmente gratuita", null, async (ctx, { flowDynamic }) => {
        const messages = [
            { body: "Por que, el Instituto Superior Tecnológico Loja es público." },
        ]; // Define los mensajes que se enviarán para la pregunta 3
        const response = await axios.post('http://localhost:9000/api', { llave: '3 ¿Cuál es el costo para estudiar en el Instituto Superior Tecnológico Loja?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
        console.log(response.status);
        if (response.status === 200) { // Si la respuesta es exitosa
    
        } else {
            await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
        }
        for (const message of messages) {
            await delay(100); // Espera 1500 milisegundos antes de enviar el siguiente mensaje
            await flowDynamic([message]); // Envía el mensaje al usuario
        }
   });

const flowPregunta_Cuatro = addKeyword(['4'], { sensitive: true })
   .addAnswer("Las tecnologías del Instituto se ofrecen en modalidad presencial, con diferentes jornadas:", null, async (ctx, { flowDynamic }) => {
        const messages = [
            { body: "Jornada Matutina:" },
            { body: "1. Contabilidad" },
            { body: "Jornada Vespertina:" },
            { body: "2. Procesamiento de Alimentos" },
            { body: "3. Desarrollo de Software" },
            { body: "4. Desarrollo Infantil" },
            { body: "5. Mecánica Automotriz"},
            { body: "6. Electricidad" },

        ]; // Define los mensajes que se enviarán para la pregunta 4
        const response = await axios.post('http://localhost:9000/api', { llave: '4 ¿Qué modalidad tienen las tecnologías?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
        console.log(response.status);
        if (response.status === 200) { // Si la respuesta es exitosa

        } else {
            await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
        }
        for (const message of messages) {
            await delay(100); // Espera 1500 milisegundos antes de enviar el siguiente mensaje
            await flowDynamic([message]); // Envía el mensaje al usuario
        } 
    });


const flowPregunta_Cinco = addKeyword(['5'], { sensitive: true })
   .addAnswer("Los horarios de las carreras son los siguientes:", null, async (ctx, { flowDynamic }) => {
        const messages = [
        { body: "Jornada Matutina:" },
        { body: "1. Contabilidad: 8:00 AM - 13:00 PM" },
        { body: "Jornada Vespertina:" },
        { body: "2. Mecánica Automotriz: 14:00 PM - 19:00 PM" },
        { body: "3. Electricidad: 14:00 PM - 19:00 PM" },
        { body: "4. Procesamiento de Alimentos: 14:00 PM - 19:00 PM" },
        { body: "5. Desarrollo de Software: 14:00 PM - 19:00 PM" },
        { body: "6. Desarrollo Infantil: 14:00 PM - 19:00 PM" },
        ]; // Define los mensajes que se enviarán para la pregunta 4

        const response = await axios.post('http://localhost:9000/api', { llave: '5 ¿Cuáles son los horarios de las tecnologías del Instituto Superior Tecnológico Loja?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
        console.log(response.status);
        if (response.status === 200) { // Si la respuesta es exitosa
        
        } else {
            await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
        }

        for (const message of messages) {
            await delay(100); // Espera 1500 milisegundos antes de enviar el siguiente mensaje
            await flowDynamic([message]); // Envía el mensaje al usuario
        } 
    });


const flowPregunta_Seis = addKeyword(['6'], { sensitive: true })
   .addAnswer("Las carreras tecnológicas tienen una duración es la siguente:", null, async (ctx, { flowDynamic }) => {
        const messages = [
            { body: "1. Contabilidad: 2 años" },
            { body: "2. Procesamiento de Alimentos: 2 años" },
            { body: "3. Desarrollo de Software: 2 años" },
            { body: "4. Mecánica Automotriz: 2 años" },
            { body: "5. Electricidad: 2 años" },
            { body: "6. Desarrollo Infantil: 2 años"},
        ]; // Define los mensajes que se enviarán para la pregunta 6

        const response = await axios.post('http://localhost:9000/api', { llave: '6 ¿Qué duración tienen las carreras tecnológicas?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
        console.log(response.status);
        if (response.status === 200) { // Si la respuesta es exitosa
          
        } else {
            await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
        }

        for (const message of messages) {
            await delay(100); // Espera 1500 milisegundos antes de enviar el siguiente mensaje
            await flowDynamic([message]); // Envía el mensaje al usuario
        }
    });  

const flowPregunta_Siete = addKeyword(['7'], { sensitive: true })
.addAnswer("El Instituto Superior Tecnológico Loja se encuentra ubicado en frente a la puerta lateral de Cafrilosa.", null, async (ctx, { flowDynamic }) => {
     const messages = [
         { body: "Ubicación en Loja: https://n9.cl/2hjax" },

     ]; // Define los mensajes que se enviarán para la pregunta 4

     const response = await axios.post('http://localhost:9000/api', { llave: '7 ¿Dónde está ubicado el Instituto Superior Tecnológico Loja?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
     console.log(response.status);
     if (response.status === 200) { // Si la respuesta es exitosa
        
     } else {
         await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
     }

     for (const message of messages) {
         await delay(100); // Espera 1500 milisegundos antes de enviar el siguiente mensaje
         await flowDynamic([message]); // Envía el mensaje al usuario
     } 
 });

const flowPregunta_Ocho = addKeyword(['8'], { sensitive: true })
   .addAnswer("Puedes contactar a docentes o autoridades a través de los siguientes medios:", null, async (ctx, { flowDynamic }) => {
    const messages = [
        { body: "Correo electrónico: secretaria@tecnologicoloja.edu.ec" },
        { body: "Puede seguirnos en nuestras redes sociales para que esté al tanto de los talleres y cursos que se ofertan a lo largo del ciclo" },
        { body: "Facebook: https://www.facebook.com/tecnologicoloja" },
        { body: "Instagram: https://www.instagram.com/tecnologicoloja" },
        { body: "Twitter: https://twitter.com/tecnologicoloja" },
        { body: "Enlace de la pagina web del Instituto: https://tecnologicoloja.edu.ec/" },
        { body: "Numero de WhatsApp de Admisiones: 0967871631" },
    ];// Define los mensajes que se enviarán para la pregunta 9

    const response = await axios.post('http://localhost:9000/api', { llave: '8 ¿Cómo contactar a docentes o autoridades?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
    console.log(response.status);
    if (response.status === 200) { // Si la respuesta es exitosa
        
    } else {
        await flowDynamic('Hubo un problema al guardar tu respuesta en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
    }

        for (const message of messages) {
            await delay(100); // Espera 1500 milisegundos antes de enviar el siguiente mensaje
            await flowDynamic([message]); // Envía el mensaje al usuario
        } 
    });

const flowPregunta_Nueve = addKeyword(['9'], { sensitive: true })
   .addAnswer("Al culminar tu carrera, obtendrás un título de tercer nivel reconocido por SENESCYT.", null, async (ctx, { flowDynamic }) => {
        // Define los mensajes que se enviarán para la pregunta 4
        const messages = [
            { body: "Esperamos que te haya servido esta información" },
 
        ];

        const response = await axios.post('http://localhost:9000/api', { llave: '9 ¿Qué título se obtiene al estudiar nuestras tecnologías?', valor: '4 pregunta', llave_user: moment(ahora).format('YYYY-MM-DD HH:mm:ss')}); // Envía el número a la API para guardarlo
        console.log(response.status);
        if (response.status === 200) { // Si la respuesta es exitosa
        } else {
            await flowDynamic('Hubo un problema al guardar tu número en la base de datos. Por favor, intenta de nuevo.'); // Maneja el error en caso de fallo
        }

        for (const message of messages) {
            await delay(100); // Espera 1500 milisegundos antes de enviar el siguiente mensaje
            await flowDynamic([message]); // Envía el mensaje al usuario
        } 
    });

// Función principal que inicia el bot
const main = async () => {
    const adapterFlow = createFlow([flowBienvenida,flowPregunta_Uno,flowPregunta_Dos,flowPregunta_Tres,flowPregunta_Cuatro,
        flowPregunta_Cinco,flowPregunta_Seis,flowPregunta_Siete,flowPregunta_Ocho,flowPregunta_Nueve]); // Crea el flujo del bot con el flujo de bienvenida
    const adapterProvider = createProvider(BaileysProvider); // Crea el proveedor de Baileys para WhatsApp
    const adapterDB = new MockAdapter(); // Crea el adaptador de base de datos mock

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    },

    {
        globalState: {
        encendido: true,
        }
      }
    ); // Crea el bot con el flujo, proveedor y base de datos especificados

    //QRPortalWeb(); // Inicia el portal web para mostrar el código QR
};

main().catch(error => { // Ejecuta la función principal y maneja cualquier error inesperado
    console.error('Error inesperado:', error); // Imprime el error en la consola
});