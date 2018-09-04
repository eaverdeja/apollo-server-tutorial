import uuidv4 from 'uuid/v4'

export default {
  Query: {
    users: (parent, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
    me: (parent, args, { me }) => me,
    messages: (parent, args, { models }) => Object.values(models.messages),
    message: (parent, { id }, { models }) => models.messages[id]
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4()
      const message = {
        id,
        text,
        userId: me.id
      }

      models.messages[id] = message
      models.users[me.id].messageIds.push(id)

      return message
    },
    updateMessage: (parent, { id, text }, { models }) => {
      const { [id]: message } = models.messages

      if (!message) {
        return message
      }

      const updatedMessage = {
        ...message,
        text
      }
      models.messages[updatedMessage.id] = updatedMessage

      return updatedMessage
    },
    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages

      if (!message) {
        return false
      }

      models.messages = otherMessages

      return true
    }
  },

  User: {
    username: user => user.username,
    messages: (user, args, { models }) =>
      user.messageIds
        .filter(id => models.messages[id] !== undefined)
        .map(id => models.messages[id])
  },

  Message: {
    user: (message, args, { models }) => models.users[message.userId]
  }
}
