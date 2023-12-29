
const mongoose = require('mongoose');   

require('dotenv').config({path:'variables.env'}); 

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
        })
        console.log('db conectada')
    } catch (error) {
        console.log('error', error)
        process.exit(1) //Detener la app si no se pudo conectar a la base de datos  
    }
    
}


module.exports = conectarDB