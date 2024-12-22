const Task = require("../models/Task");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const { createEmptyDocument } = require("../services/documents");

const createTask = async (req, res) => {
  const { title, description, client, deadline, assignedTo } = req.body;

  if (!title || !description || !client || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const assignedUser = assignedTo ? await User.findById(assignedTo) : null;

  if (assignedTo && !assignedUser) {
    return res.status(404).json({ message: "Assigned user not found" });
  }

  const newTask = new Task({
    title,
    description,
    client,
    deadline,
    assignedBy: req.user._id,
    assignedTo: assignedTo || null,
    status: "Pending",
  });

  newTask.document = await createEmptyDocument(newTask);
  await newTask.save();

  res.status(201).json(newTask);
};

const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const { _id, role } = req.user;

  const task = await Task.findById(taskId).populate("client assignedTo");
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (
    (role === "Employee" &&
      task.assignedTo._id.toString() !== _id.toString()) ||
    (role === "QA" && task.status !== "Under Review")
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized to update this task" });
  }

  task.status = status;
  await task.save();

  // If QA marks task as completed, send email/WhatsApp notification
  if (["QA", "Admin"].includes(role) && status === "Completed") {
    // await notifyClient(task);
    return res.json({
      message: "Task completed, Document sent to the client",
    });
  }

  res.json({ message: "Task status updated", task });
};

const assignTask = async (req, res) => {
  const { taskId } = req.params;
  const { assignTo } = req.body;
  const { _id } = req.user;

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.assignedTo = assignTo;
  task.assignedBy = _id;
  task.status = "In Progress";
  await task.save();

  res.json({ message: "Task assigned", task });
};

const getTasks = async (req, res) => {
  let tasks;
  const role = req.user.role;
  let query = {};

  if (role === "Employee") {
    query = { assignedTo: req.user._id };
  } else if (role === "QA") {
    query = { status: "Under Review" };
  }

  tasks = await Task.find(query).populate("assignedTo assignedBy");

  res.json(tasks);
};

const updateDocument = async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;
  const role = req.user.role;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (
    (role === "Employee" &&
      task.assignedTo._id.toString() !== req.user._id.toString()) ||
    (role === "QA" && task.status !== "Under Review")
  ) {
    return res.status(403).json({ message: "Update restricted" });
  }

  const filePath = path.join(__dirname, `../${task.document.url}`);
  fs.writeFileSync(filePath, content);

  res.status(200).json({ message: "Document updated", task });
};

const attachTaskInfo = async (req, res, next) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  req.task = task;
  next();
};

const uploadDocument = async (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ message: "No document uploaded" });
  }

  const documentUrl = `/documents/${uploadedFile.filename}`;

  const task = await Task.findByIdAndUpdate(req.params.taskId, {
    document: documentUrl,
  });

  res.status(200).json({
    message: "Document uploaded successfully",
    documentUrl,
  });
};
module.exports = {
  createTask,
  updateTaskStatus,
  assignTask,
  getTasks,
  updateDocument,
  attachTaskInfo,
  uploadDocument,
};
