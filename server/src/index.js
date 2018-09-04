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

        messages: [Message!]!
        message(id: ID!): Message!
    }

    type User {
        id: ID!
        username: String!
        messages: [Message!]
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }
`

let users = {
    1: {
        id: '1',
        username: 'Eduardo Verdeja',
        messageIds: ['1']
    },
    2: {
        id: '2',
        username: 'Dave Davids',
        messageIds: ['2']
    }
}

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1'
    },
    2: {
        id: '2',
        text: 'Bye Cruel World',
        userId: '2'
    }
}

const resolvers = {
    Query: {
        users: () => Object.values(users),
        user: (parent, { id }) => users[id],
        me: (parent, args, { me }) => me,
        messages: () => Object.values(messages),
        message: (parent, { id }) => messages[id]
    },

    User: {
        username: user => user.username,
        messages: user => {
            return Object.values(messages)
                .filter(message => message.userId === user.id)
        }
    },

    Message: {
        user: message => users[message.userId]
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1]
    }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 8000 }, () => {
    console.log('This is Apollo Server on http://localhost:8000/graphql !!!')
})
