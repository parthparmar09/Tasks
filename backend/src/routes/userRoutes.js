const express = require("express");
const {
  loginUser,
  registerUser,
  fetchUser,
  fetchUsers,
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", protect, fetchUser);
router.get("/", protect, authorizeRoles("Admin", "Manager"), fetchUsers);
router.post("/login", loginUser);
router.post("/register", protect, authorizeRoles("Admin"), registerUser);

module.exports = router;
