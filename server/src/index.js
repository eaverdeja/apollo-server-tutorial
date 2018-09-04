import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import uuidv4 from 'uuid/v4'

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

  type Mutation {
    createMessage(text: String!): Message!
    updateMessage(id: ID!, text: String!): Message!
    deleteMessage(id: ID!): Boolean!
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

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4()
      const message = {
        id,
        text,
        userId: me.id
      }

      messages[id] = message
      users[me.id].messageIds.push(id)

      return message
    },
    updateMessage: (parent, { id, text }) => {
      const { [id]: message } = messages

      if (!message) {
        return message
      }

      const updatedMessage = {
        ...message,
        text
      }
      messages[updatedMessage.id] = updatedMessage

      return updatedMessage
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages

      if (!message) {
        return false
      }

      messages = otherMessages

      return true
    }
  },

  User: {
    username: user => user.username,
    messages: user =>
      user.messageIds
        .filter(id => messages[id] !== undefined)
        .map(id => messages[id])
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
  },
  playground: {
    settings: {
      'editor.cursorShape': 'line'
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 8000 }, () => {
  console.log('This is Apollo Server on http://localhost:8000/graphql !!!')
})
