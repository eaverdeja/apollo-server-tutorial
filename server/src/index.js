import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express()
app.use(cors())

const schema = gql`
    type Query {
        users: [User!]
        me: User
        user(id: ID!): User
    }

    type User {
        id: ID!
        username: String!
    }
`

let users = {
    1: {
        id: '1',
        username: 'Eduardo Verdeja'
    },
    2: {
        id: '2',
        username: 'Dave Davids'
    }
}

const me = users[1]

const resolvers = {
    Query: {
        users: () => Object.values(users),
        user: (parent, { id }) => users[id],
        me: () => me,
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 8000 }, () => {
    console.log('This is Apollo Server on http://localhost:8000/graphql !!!')
})
