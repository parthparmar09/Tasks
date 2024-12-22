import React, { useEffect, useState } from "react";
import { useLazyFetchUsersQuery } from "../redux/slices/userApiSlice";
import UserTable from "../components/Users/UserTable";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [fetchUsers, { data: users, isLoading, isError }] =
    useLazyFetchUsersQuery();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (users) {
      setUsersData(users);
    }
  }, [users]);

  return <UserTable usersData={usersData} />;
};

export default Users;
