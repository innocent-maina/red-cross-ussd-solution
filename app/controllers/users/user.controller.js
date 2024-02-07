/* eslint-disable no-underscore-dangle */
const { User } = require('../../models');

module.exports = {
  /**
   * GET /api/v1/users
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json({
        success: true,
        message: 'Successfully retrieved all users',
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: error,
      });
    }
  },

  /**
   * POST /api/v1/users
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  createUser: async (userData) => {
    try {
      const user = await User.create(userData);
      if (user._id !== '') {
        return {
          success: true,
          message: 'Successfully created the user',
          data: user,
        };
      }
      return {
        success: true,
        message: 'Successfully created the user',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: error,
      };
    }
  },

  /**
   * GET  by phoneNumber
   *
   * @param user;s phone number
   * @returns {Promise<*>}
   */
  getSingleUser: async (userPhoneNumber) => {
    try {
      const user = await User.findOne({ phoneNumber: userPhoneNumber });
      if (!user) {
        return {
          success: true,
          message: 'User not found',
          data: null,
        };
      }
      return {
        success: true,
        message: 'Successfully retrieved the user',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: error,
      };
    }
  },

  /**
   * PUT /api/v1/users/:id
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  updateUser: async (userPhoneNumber, updateBody) => {
    try {
      const user = await User.findOneAndUpdate(
        { phoneNumber: userPhoneNumber },
        {
          $set: {
            name: updateBody.name,
            currentLocation: updateBody.currentLocation,
            phoneNumber: updateBody.phoneNumber,
            emergencyContact: updateBody.emergencyContact,
            language: updateBody.language,
          },
        },
        { new: true },
      );
      if (!user) {
        return {
          success: true,
          message: 'User not found',
          data: null,
        };
      }
      return {
        success: true,
        message: 'Successfully updated the user',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: error,
      };
    }
  },

  /**
   * DELETE /api/v1/users/:id
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Successfully deleted the user',
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: error,
      });
    }
  },
};
