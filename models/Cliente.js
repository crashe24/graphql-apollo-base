const mongoose = require('mongoose');

const ClienteSchena = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    empresa: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefono: {
        type: String,
        trim: true
        
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'  // Referencia a la tabla Usuario.js  // Referencia a la tabla Usuario.js  // Referencia a la tabla Usuario.js  // Referencia a la tabla Usuario.js  // Referencia a la tabla Usuario    
    }

})

module.exports = mongoose.model('Cliente', ClienteSchena) 