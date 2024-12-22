import React, { useState, useEffect } from "react";
import {
  useLazyFetchTasksQuery,
  useUpdateTaskStatusMutation,
} from "../redux/slices/tasksApiSlice";
import TaskTable from "../components/Tasks/TaskTable";
import { toast } from "react-hot-toast";
import TaskEditModal from "../components/Tasks/TaskEditModal";
import { useAuth } from "../contexts/AuthContext";

function Tasks() {
  const [fetchTasks, { data: tasks, isLoading, isError }] =
    useLazyFetchTasksQuery();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const { user } = useAuth();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const onEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const onComplete = async (task, isRevert = false) => {
    const status = isRevert
      ? "In Progress"
      : task.status === "Under Review" && ["Admin", "QA"].includes(user?.role)
      ? "Completed"
      : "Under Review";
    try {
      const response = await updateTaskStatus({
        id: task._id,
        status,
      }).unwrap();

      const successMessage = response?.message || "Task sent for review!";
      toast.success(successMessage);

      fetchTasks();
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.error || "Failed to update task status.";
      toast.error(errorMessage);
    }
  };

  const closeModal = () => {
    fetchTasks();
    setModalOpen(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) {
    return <div>Error fetching tasks.</div>;
  }

  return (
    <>
      <TaskTable
        data={tasks?.filter((task) => task.status !== "Completed")}
        onEdit={onEdit}
        onComplete={onComplete}
        isQA={user?.role === "QA"}
      />
      {selectedTask && (
        <TaskEditModal
          open={isModalOpen}
          onClose={closeModal}
          task={selectedTask}
          isAdmin={["Manager", "Admin"].includes(user?.role)}
        />
      )}
    </>
  );
}

export default Tasks;
