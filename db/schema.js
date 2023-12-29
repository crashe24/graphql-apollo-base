const { gql } = require('apollo-server')

// siempre se requiere un type y un resolver
// Schema 
const typeDefs = gql`
        type Usuario {   
            id: ID 
            nombre: String
            apellido: String
            email: String
            creado: String

        }
        type Token {
            token:String
        }

        type Producto {
            id: ID
            nombre: String
            existencia: Int
            precio: Float
            creado: String
        }
        type Cliente {
            id: ID
            nombre: String
            apellido: String
            empresa: String
            email: String
            telefono: String
            vendedor: ID
        }
        type Pedido {
            id: ID
            pedido: [PedidoGrupo]
            total: Float
            cliente: ID
            vendedor: ID
            estado: Enum_EstadoPedido
        }
        type PedidoGrupo {
            id: ID
            cantidad: Int
        }
        type TopCliente {
            total: Float
            cliente: [Cliente]
        }
        type TopVendedor {
            total: Float
            vendedor: [Usuario]
        }
        input UsuarioInput {
            nombre: String!
            apellido: String!
            email: String!
            password: String!
        }
        input AutenticarInput {
            email: String!
            password: String!
        }

        input ProductoInput {
            nombre: String!
            existencia: Int!
            precio: Float!
        }
        input ClienteInput {
            nombre: String!
            apellido: String!
            empresa: String!
            email: String!
            telefono: String
        }
        input PedidoProductoInput {
             id: ID
             cantidad: Int!
        }
        input PedidoInput {
            pedido: [PedidoProductoInput]
            total: Float!
            cliente: ID!
            estado: Enum_EstadoPedido!

        }
        enum Enum_EstadoPedido {
            PENDIENTE
            COMPLETADO
            CANCELADO
        }
        type Query {    
            #usuarios
            obtenerUsuario(token:String!): Usuario
            #productos
            obtenerProductos: [Producto]
            obtenerProducto(id: ID!): Producto
            #clientes
            obtenerClientes: [Cliente]
            obtenerClientesVendedor: [Cliente]
            obtenerCliente(id: ID!): Cliente
            #pedidos
            obtenerPedidos: [Pedido]
            obtenerPedidosVendedor: [Pedido]
            obtenerPedido(id: ID!): Pedido
            obtenerPedidosEstado(estado: String!): [Pedido]

            #busquedas avanzadas
            mejoresClientes: [TopCliente]
            mejoresVendedores: [TopVendedor]
            buscarProducto(texto: String!): [Producto]
        }
        type Mutation {
            # usuarios
            nuevoUsuario(input: UsuarioInput): Usuario
            autenticarUsuario(input: AutenticarInput): Token

            #productos
            nuevoProducto(input: ProductoInput): Producto
            actualizarProducto(id: ID!, input: ProductoInput): Producto
            eliminarProducto(id:ID!): String
            #cliente
            nuevoCliente(input: ClienteInput): Cliente
            actualizarCliente(id: ID!, input: ClienteInput): Cliente
            eliminarCliente(id:ID!): String
            # Pedidos
            nuevoPedido(input: PedidoInput): Pedido
            actualizarPedido(id: ID!, input: PedidoInput!): Pedido
            eliminarPedido(id:ID!): String


        }
`

module.exports = typeDefs;