import React from "react";
import MUIDataTable from "mui-datatables";
import { Button } from "@mui/material";
import { ButtonGroup } from "@mui/material";
import { Edit, Check } from "@mui/icons-material";

const TaskTable = ({ data, onEdit, onComplete, isQA }) => {
  const columns = [
    {
      name: "client.name",
      label: "Client's Name",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? value : "N/A";
        },
      },
    },
    {
      name: "assignedTo.name",
      label: "Assigned User",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? value : "N/A";
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          const statusStyles = {
            Pending: { color: "orange", fontWeight: "bold" },
            "In Progress": { color: "purple", fontWeight: "bold" },
            "Under Review": { color: "blue", fontWeight: "bold" },
            Completed: { color: "green", fontWeight: "bold" },
          };
          return (
            <span style={statusStyles[value] || { color: "black" }}>
              {value}
            </span>
          );
        },
      },
    },
    {
      name: "deadline",
      label: "Deadline",
      options: {
        filter: false,
        customBodyRender: (value) => {
          const deadlineDate = new Date(value);
          const currentDate = new Date();
          const diff = deadlineDate - currentDate;

          // Determine if close to deadline or missed
          const isClose = diff <= 2 * 24 * 60 * 60 * 1000; // Close to deadline: 2 days
          const isMissed = diff < 0;

          // Row color styling based on deadline
          const rowStyle = {
            backgroundColor: isMissed
              ? "rgba(255, 0, 0, 0.1)"
              : isClose
              ? "rgba(255, 165, 0, 0.3)"
              : "transparent",
            borderRadius: "10px",
            padding: "5px",
          };

          return (
            <div style={rowStyle}>
              <span
                style={{
                  color: isMissed ? "red" : isClose ? "orange" : "black",
                  fontWeight: isMissed || isClose ? "bold" : "normal",
                }}
              >
                {deadlineDate.toDateString()}{" "}
                {deadlineDate.toLocaleTimeString()}
              </span>
            </div>
          );
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => (
          <ButtonGroup>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => onEdit(data[dataIndex])}
              startIcon={<Edit />}
            >
              Edit
            </Button>
            {isQA && (
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => onComplete(data[dataIndex], true)}
              >
                Revert
              </Button>
            )}
            <Button
              variant="outlined"
              color="success"
              size="small"
              onClick={() => onComplete(data[dataIndex])}
              endIcon={<Check />}
            >
              Complete
            </Button>
          </ButtonGroup>
        ),
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    rowsPerPage: 50,
    tableBodyMaxHeight: "65vh",
    enableNestedDataAccess: ".",
  };

  return (
    <MUIDataTable
      title="Task Management"
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default TaskTable;
