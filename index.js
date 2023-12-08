
const {ApolloServer} = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolver')

//servidor 
const server = new ApolloServer({
    typeDefs,resolvers,
})

// arrancar el servidor
server.listen().then(({url}) => {
    console.log(`Servidor listo en ${url}`)
}
)