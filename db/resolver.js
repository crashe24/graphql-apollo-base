const Usuario = require('../models/Usuario');   
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');

const bcryptjs = require('bcryptjs');
require('dotenv').config({path: 'variables.env'});
const jwt = require('jsonwebtoken'); //npm i jsonwebtoken



const crearToken = (usuario, secret, expiresIn) => {
    const {id, email, nombre, apellido} = usuario;
    return jwt.sign({id, email, nombre, apellido}, secret, {expiresIn});

}
//Resolcer
const resolvers = {
    Query: {
        obtenerUsuario: (_,{ token }) => {
            const usuario = jwt.verify(token, process.env.SECRETA);
            return usuario;
        
        },
        obtenerProductos: async () => {
                try {
                    const productos = await Producto.find({});
                    return productos;
        
                } catch (error) {
                    console.log('error', error)            
                }
            },
        obtenerProducto: async (_, {id}) => {
                try {
                        // revisar si el producto existe 
                        const producto = await Producto.findById(id);
                        if (!producto) {
                            throw new Error('Producto no encontrado')
                        }
                        
                        return producto;
        
                     } catch (error) {
                        console.log('error', error)            
                
                     }
             },
        obtenerClientes: async () => {
                try {
                    const clientes = await Cliente.find()
                    return clientes 

                } catch (error) {
                    console.log('error', error)
                }
          },
        obtenerClientesVendedor: async(_, {}, ctx) =>{
            try {
                //ctx.usuario.id
                console.log('ctx.usuario', ctx.usuario)
                const clientes = await Cliente.find({vendedor: ctx.usuario.id.toString()})
                return clientes 

            } catch (error) {
                console.log('error', error)
            }
          
          },
          obtenerCliente: async (_, {id}, ctx) => {
            try {
                const cliente = await Cliente.findById(id)
                if (!cliente) {
                    throw new Error('Cliente no encontrado')
                }
                if (cliente.vendedor.toString() !== ctx.usuario.id) {
                    throw new Error('No tienes las credenciales')
                }
                return cliente 

            } catch (error) {
                console.log('error', error)
            }
          
          
          },
          obtenerPedidos: async () => {
            try {
                const pedidos = await Pedido.find()
                return pedidos 

            } catch (error) {
                console.log('error', error)
            }
         },
         obtenerPedidosVendedor: async (_, {}, ctx) => {
            try {
                const pedidos = await Pedido.find({ vendedor: ctx.usuario.id })
                return pedidos
            } catch (error) {
                console.log('error', error)
            }
         },
         obtenerPedido: async (_, {id}, ctx) => {
            try {
                const pedido = await Pedido.findById(id)
                if (!pedido) {
                    throw new Error('Pedido no encontrado')
                }
                if (pedido.vendedor.toString() !== ctx.usuario.id) {
                    throw new Error('No tienes las credenciales')
                }
                return pedido 

            } catch (error) {
                console.log('error', error)
            }
         
         },
         obtenerPedidosEstado: async (_,{estado}, ctx) =>{
            try {
                const pedidos = await Pedido.find({vendedor: ctx.usuario.id, estado})
                return pedidos
            } catch (error) {
                console.log('error', error)
            }
         

         }, 
         mejoresClientes: async () => {
            const clientes = await Pedido.aggregate([
                {$match: {estado: "COMPLETADO"}},
                {$group: {
                    _id: "$cliente",
                    total: {$sum: "$total"}
                }},
                {$lookup: {
                    from: 'clientes',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'cliente'
                }},
                {$limit: 10},
                {$sort: {total: -1}}
            ])
            return clientes
         
         },
         mejoresVendedores: async () => {
            const vendedores = await Pedido.aggregate([
                {$match: {estado: "COMPLETADO"}},
                {$group: {
                    _id: "$vendedor",
                    total: {$sum: "$total"}
                }},
                {$lookup: {
                    from: 'usuarios',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vendedor'
                }},
                {$limit: 3},
                {$sort: {total: -1}}
            ])
            return vendedores
         
         
         },
         buscarProducto: async (_, {texto}) => {
            const productos = await Producto.find({$text: {$search: texto}})
            return productos
         
         
         
         }

        }, 
       
        
    Mutation: {
        nuevoUsuario: async (_, {input}) => {
            // validaciones
            const {email, password} = input
            const existeUsuario = await Usuario.findOne({email});
            console.log('existeUsuario', existeUsuario)
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado')
            }
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            try {
                const usuarioRef = new Usuario(input);
                usuarioRef.save();
                return usuarioRef
            } catch (error) {
                console.log('error', error)
            }
        },
        autenticarUsuario: async (_, {input}) => {
            const {email, password} = input
            const existeUsuario = await Usuario.findOne({email});
            if (!existeUsuario) {
                throw new Error('El usuario no existe')
            }
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if (!passwordCorrecto) {
                throw new Error('Password Incorrecto')
            }
            // creat token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
            
        },
        nuevoProducto: async (_, {input}) => {
            try {
                const productoRef = new Producto(input);
                const resultado = await productoRef.save();
                return resultado;
            } catch (error) {
                console.log('error', error)
            }
            
            
        
        },
        actualizarProducto: async (_, {id, input}) => {
            try {
               // const producto = await Producto.findByIdAndUpdate(id, input, {new: true});
               let producto = await Producto.findById(id);
                if (!producto) {
                    throw new Error('Producto no encontrado')
                }
                producto = await Producto.findOneAndUpdate({_id:id}, input, {new:true});
                    
                return producto;
            } catch (error) {
                console.log('error', error)
            }
        
        
        },
        eliminarProducto: async (_, {id}) => {
            try {
                let producto = await Producto.findById(id);
                if (!producto) {
                    throw new Error('Producto no encontrado')
                }
                await Producto.findOneAndDelete({_id:id});
                return "Producto Eliminado";
            } catch (error) {
                console.log('error', error)
            }
        },
        nuevoCliente: async (_, {input}, ctx) => {
            try {
             //   console.log('ctx', ctx)
                const {email} = input;
                const existeCliente = await Cliente.findOne({email});
                if (existeCliente) {
                    throw new Error('El cliente ya esta registrado')
                } 
                const clienteRef = new Cliente(input);
                clienteRef.vendedor = ctx.usuario.id//'6576123e743c9b3fe4f58db5'
                const resultado = await clienteRef.save();
                return resultado;
            } catch (error) {
                console.log('error', error)
            }
        },
       actualizarCliente: async (_, {id, input}, ctx) => {
            // verificar si el cliente existe
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                    throw new Error('Cliente no encontrado')    
            }
            // verificar si el vendedor es quien edita
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales')
            }
            // guardar el cliente
            cliente = await Cliente.findOneAndUpdate({_id:id}, input, {new:true});
            return cliente
       },
       eliminarCliente: async (_, {id}, ctx) => {
            // verificar si el cliente existe
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                    throw new Error('Cliente no encontrado')    
            }
            // verificar si el vendedor es quien edita
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales')
            }
            // guardar el cliente
            await Cliente.findOneAndDelete({_id:id});
            return "Cliente Eliminado"
       },
        nuevoPedido: async (_, {input}, ctx) => {
            const {cliente} = input;
            // verificar si el cliente existe
            let clienteExiste = await Cliente.findById(cliente);
            if (!clienteExiste) {
                    throw new Error('Cliente no encontrado')    
            }
            // verificar si el vendedor es quien edita
           // console.log('clienteExiste.vendedor.toString()', clienteExiste.vendedor.toString())
           // console.log('clienteExiste.vendedor.toString()',ctx.usuario.id)

            if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales')
            }
            // verificar stock
            for await (const articulo of input.pedido) {
                const {id } = articulo
                const producto= await Producto.findById(id);    
                if (articulo.cantidad > producto.existencia) {
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`)    
                } else {
                    // actualizar la cantidad a lo disponible
                    producto.existencia = producto.existencia - articulo.cantidad
                    await producto.save()
                }

            }
            
            // guardar el cliente
            const nuevoPedido = new Pedido(input);
            // asignar el vendedor
            nuevoPedido.vendedor = ctx.usuario.id;
            // guardar en la base de datos
            const resultado = await nuevoPedido.save();
            return resultado;
        },
        actualizarPedido: async (_, {id, input}, ctx) => {

            const { cliente } = input;  
            // verificar si el pedido existe
            let pedido = await Pedido.findById(id);
            if (!pedido) {
                    throw new Error('Pedido no encontrado')    
            }

            // verificar si el cliente existe
            const existeCliente = await Cliente.findById(cliente);  
            if ( !existeCliente ) {
                throw new Error('El cliente no existe')    
            }

            if (existeCliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales')
            
            }
           
            // verificar stock
            if (input.pedido) {
                for await (const articulo of input.pedido) {
                    const {id } = articulo
                    const producto= await Producto.findById(id);    
                    if (articulo.cantidad > producto.existencia) {
                        throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`)    
                    } else {
                        // actualizar la cantidad a lo disponible
                        producto.existencia = producto.existencia - articulo.cantidad
                        await producto.save()
                    }
                 
                }
            }

            // guardar el pedido
            const resultado = await Pedido.findOneAndUpdate({_id:id}, input, {new:true});
            return resultado
       
        },
        eliminarPedido: async (_, {id}, ctx) => {
            // verificar si el pedido existe
            let pedido = await Pedido.findById(id);
            if (!pedido) {
                    throw new Error('Pedido no encontrado')    
            }
            // verificar si el vendedor es quien edita
            if (pedido.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales')
            }
            // guardar el pedido
            await Pedido.findOneAndDelete({_id:id});
            return "Pedido Eliminado"
       
        
        }

    }
}

module.exports = resolvers;