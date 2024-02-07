const AppController = require('./app.controller');
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require('./users/user.controller');

/** ------------------------------------------------------
 *  ---------------------------------------
 *  Export Controllers to rest of the app
 * ---------------------------------------
 ------------------------------------------------------* */
module.exports = {
  AppController,
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
