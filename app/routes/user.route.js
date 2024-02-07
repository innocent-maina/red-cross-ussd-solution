const router = require('express').Router();
const {
  getAllUsers, getSingleUser, createUser, updateUser, deleteUser,
} = require('../controllers/index');

router.get('', getAllUsers);
router.post('', createUser);
router.get('/:id', getSingleUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
