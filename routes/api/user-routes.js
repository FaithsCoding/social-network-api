const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/user-controller");

// route for endpoint /api/users
router.route("/").get(getAllUser).post(createUser);

// router for endpoint /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

// route for endpoint /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
