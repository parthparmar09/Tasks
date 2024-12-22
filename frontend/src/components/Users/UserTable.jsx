import React from "react";
import MUIDataTable from "mui-datatables";
import { Button, Box } from "@mui/material";
import { toast } from "react-hot-toast";
import { Edit, Delete, Add } from "@mui/icons-material"; // For download icon
import { useNavigate } from "react-router-dom";
import { ButtonGroup } from "@mui/material";

const UserTable = ({ usersData }) => {
  const navigate = useNavigate();

  const handleEdit = (userId) => {
    toast.success("Coming soon!");
  };

  const handleDelete = (userId) => {
    console.log("Deleting user with ID:", userId);
    toast.success("User deleted successfully!");
  };

  const columns = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "role", label: "Role" },
    {
      name: "action",
      label: "Action",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const userId = tableMeta.rowData[0];
          return (
            <ButtonGroup>
              <Button
                onClick={() => handleEdit(userId)}
                color="primary"
                variant="outlined"
                size="small"
                startIcon={<Edit />}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(userId)}
                color="error"
                variant="outlined"
                size="small"
                endIcon={<Delete />}
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
            </ButtonGroup>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    responsive: "standard",
    selectableRows: "none",
    customToolbar: () => (
      <Button
        size="small"
        variant="contained"
        color="primary"
        endIcon={<Add />}
        sx={{ ml: 1 }}
      >
        Add User
      </Button>
    ),
  };

  return (
    <MUIDataTable
      title="Our Team"
      data={usersData}
      columns={columns}
      options={options}
    />
  );
};

export default UserTable;
