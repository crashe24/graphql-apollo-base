
const {ApolloServer} = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolver')
const conectarDB = require('./config/db')
const jwt = require('jsonwebtoken')
//conectar a la base de datos
conectarDB()
//servidor 
const server = new ApolloServer({
    typeDefs,resolvers,context:({req}) => {
       // console.log( req.headers['authorization'] ) 
       const token = req.headers['authorization'] || ''
       if (token) {
           try {
            const usuario = jwt.verify(token, process.env.SECRETA)
            return { usuario }
           } catch (error) {
            console.log('hubo un error: ', error) 
           }
       }
    }
})

// arrancar el servidor
server.listen().then(({url}) => {
    console.log(`Servidor listo en ${url}`)
}
)