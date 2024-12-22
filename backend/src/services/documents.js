const { Document, Packer } = require("docx");
const fs = require("fs");
const path = require("path");

const createEmptyDocument = async (task) => {
  try {
    const docName = `${task.client.name}_${Date.now()}.docx`;
    // Create a new empty document with metadata
    const doc = new Document({
      creator: "Your App Name", // Add the creator
      title: `Task ${task.client.name} Document`, // Add a title
      description: "An empty document for task", // Add a description
      sections: [],
    });

    // Define the file path
    const filePath = path.join(__dirname, `../../documents/${docName}`);

    // Generate the document buffer
    const buffer = await Packer.toBuffer(doc);

    // Write the buffer to the file
    fs.writeFileSync(filePath, buffer);

    // Return the file path (relative URL for the client)
    return `/documents/${docName}`;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create the document.");
  }
};
module.exports = { createEmptyDocument };
