const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Under Review", "Completed"],
      default: "Pending",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deadline: {
      type: Date,
      required: true,
    },
    document: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
