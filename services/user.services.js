const User = require('../model/User');

module.exports = {
  findAll: async () => {
    const users = await User.find().sort({ updateAt: -1 });
    return users;
  },

  findOne: async (id) => {
    const user = await User.findById(id);
    return user;
  },

  findEmail: async (email) => {
    const user = await User.findById({ email });
    return user;
  },

  update: async (id, payload = {}) => {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true }
    );
    return user;
  },

  remove: async (id) => {
    const user =  User.findOneAndRemove({ _id: id });
    return user;
  },

  create: async (payload = {}) => {
    const user = new User(payload)
    await user.save();

    return {
      first_name,
      last_name,
      email
    }
  }
}