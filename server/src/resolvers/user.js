export default {
  Query: {
    users: (parent, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
    me: (parent, args, { me }) => me
  },

  User: {
    username: user => user.username,
    messages: (user, args, { models }) =>
      user.messageIds
        .filter(id => models.messages[id] !== undefined)
        .map(id => models.messages[id])
  }
}
