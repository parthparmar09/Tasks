import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  Input,
} from "@mui/material";
import { CloudUpload, Download } from "@mui/icons-material";
import {
  useAssignTaskMutation,
  useUpdateDocumentMutation,
  useUploadDocumentMutation,
} from "../../redux/slices/tasksApiSlice";
import { useLazyFetchUsersQuery } from "../../redux/slices/userApiSlice";
import toast from "react-hot-toast";
import DocumentEditor from "./DocumentEditor";

const TaskEditModal = ({ open, onClose, task, isAdmin }) => {
  const [taskDetails, setTaskDetails] = useState(task);
  const [selectedUser, setSelectedUser] = useState(task.assignedTo._id);
  const [fetchUsers, { data: users }] = useLazyFetchUsersQuery();
  const [assignTask] = useAssignTaskMutation();
  const [uploadDocument] = useUploadDocumentMutation();

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskDetails(task);
      fetchUsers();
    }
  }, [task, fetchUsers]);

  useEffect(() => {
    console.log(
      selectedUser,
      users?.filter((user) => user._id === selectedUser)
    );
  }, [selectedUser]);

  const handleSave = async (docContent = null) => {
    try {
      if (
        isAdmin &&
        task.assignedTo?._id &&
        selectedUser !== task.assignedTo._id
      ) {
        await assignTask({
          id: task._id,
          assignTo: selectedUser,
        }).unwrap();
      }

      // Success message
      toast.success("Task updated!");
      onClose();
    } catch (error) {
      // Handle errors
      toast.error("Failed to update task.");
      console.error("Error during save operation:", error);
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await uploadDocument({
        id: task._id,
        document: formData,
      }).unwrap();

      toast.success("Document uploaded!");
      setTaskDetails((prev) => ({
        ...prev,
        document: response.documentUrl,
      }));
    } catch (error) {
      toast.error("Failed to upload document.");
      console.error("Error uploading document:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          <strong>Deadline:</strong>{" "}
          {new Date(taskDetails?.deadline).toLocaleString()}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Status:</strong> {taskDetails?.status || "Unknown"}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Assigned To:</strong>{" "}
          {isAdmin ? (
            <Select
              fullWidth
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users?.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          ) : (
            taskDetails?.assignedTo?.name || "N/A"
          )}
        </Typography>

        <Box sx={{ my: 1 }}>
          <Typography
            variant="subtitle1"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <strong>Document:</strong>
            {taskDetails?.document ? (
              <Typography variant="body2" component="span">
                {taskDetails.document.split("/").pop()}
              </Typography>
            ) : (
              <Typography variant="body2" component="span">
                No document attached.
              </Typography>
            )}
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mt={1}>
            {/* Download Button */}
            {taskDetails?.document && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download />}
                href={`${import.meta.env.VITE_API_BASE_URL}${
                  taskDetails.document
                }`}
                target="_blank"
              >
                Download
              </Button>
            )}

            {/* Upload Button */}
            <label htmlFor="upload-button">
              <Input
                id="upload-button"
                type="file"
                sx={{ display: "none" }}
                onChange={handleDocumentUpload}
                inputProps={{ accept: ".doc,.docx,.pdf" }}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CloudUpload />}
                component="span"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </label>
          </Box>
        </Box>

        <Box sx={{ my: 1 }}>
          <Typography variant="subtitle1">
            <strong>Edit Document:</strong>
          </Typography>
          <DocumentEditor
            documentUrl={
              import.meta.env.VITE_API_BASE_URL + taskDetails.document
            }
            onSave={handleSave}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditModal;
