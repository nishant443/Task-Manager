const User = require('../models/User');

const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id name email isAdmin');
    res.json(users);
  } catch (err) {
    console.error('listUsers error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listUsers };