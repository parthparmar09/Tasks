const faker = require("faker");
const Task = require("../models/Task");
const { default: mongoose } = require("mongoose");
const { createEmptyDocument } = require("./documents");

const adminAndManagerIds = [
  "67641a598847eb6f37e3aa0b",
  "67650564fea078f88231737b",
  "67650570fea078f88231737f",
];

const employeeIds = [
  "676505a4fea078f882317387",
  "676505affea078f88231738b",
  "676505b9fea078f88231738f",
];

const generateDeadline = (status) => {
  const now = new Date();
  const range = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (status === "Pending" || status === "In Progress") {
    // Random deadline within 24 hours before or after the current date
    const offset = faker.datatype.number({ min: -range, max: range });
    return new Date(now.getTime() + offset);
  } else {
    // Generate a random date between two fixed dates
    const start = new Date("2024-12-01T00:00:00.000Z").getTime();
    const end = new Date("2024-12-31T00:00:00.000Z").getTime();
    const randomTime = faker.datatype.number({ min: start, max: end });
    return new Date(randomTime);
  }
};

// Function to generate and save tasks
const generateAndSaveDummyTasks = async (count) => {
  const tasks = [];

  for (let i = 0; i < count; i++) {
    const assignedBy =
      adminAndManagerIds[Math.floor(Math.random() * adminAndManagerIds.length)];
    const assignedTo =
      employeeIds[Math.floor(Math.random() * employeeIds.length)];
    const statuses = ["Pending", "In Progress", "Under Review", "Completed"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const deadline = generateDeadline(status);

    const task = new Task({
      client: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
      },
      status,
      assignedBy: assignedBy,
      assignedTo: assignedTo,
      deadline,
      document: `http://example.com/documents/${faker.datatype.uuid()}.docx`,
    });

    task.document = await createEmptyDocument(task);

    tasks.push(task);
  }

  try {
    const savedTasks = await Task.insertMany(tasks);
    console.log(`${savedTasks.length} tasks have been saved to the database.`);
  } catch (err) {
    console.error("Error saving tasks to the database:", err);
  }
};

module.exports = generateAndSaveDummyTasks;
