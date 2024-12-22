const express = require("express");
const {
  createTask,
  updateTaskStatus,
  assignTask,
  getTasks,
  updateDocument,
  uploadDocument,
  attachTaskInfo,
} = require("../controllers/taskController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, authorizeRoles("Admin", "Manager"), createTask);

router.put("/:taskId/status", protect, updateTaskStatus);
router.put("/:taskId/doc", protect, updateDocument);
router.put(
  "/:taskId/document",
  protect,
  attachTaskInfo,
  upload.single("document"),
  uploadDocument
);
router.put(
  "/:taskId/assign",
  protect,
  authorizeRoles("Admin", "Manager"),
  assignTask
);

module.exports = router;
