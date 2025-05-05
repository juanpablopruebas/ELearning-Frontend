"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Loader } from "@/components/layout/Loader";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/api/userApi";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import { Box, Modal } from "@mui/material";
import { User } from "@/types";
import { RefreshCcw } from "lucide-react";
import { useSelector } from "react-redux";
import { IRootState } from "@/redux/store";

type AllUsersType = {
  isTeam?: boolean;
};

export const AllUsers = ({ isTeam = false }: AllUsersType) => {
  const { user } = useSelector((state: IRootState) => state.auth);
  const { theme } = useTheme();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [openUpdateRoleModal, setOpenUpdateRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const isCurrentUser = userId === user?._id;

  const { isLoading, data, isSuccess, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [updateUserRole, { error: updateError, isSuccess: updateSuccess }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { error: deleteError, isSuccess: deleteSuccess }] =
    useDeleteUserMutation();

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      toast.success("User role updated successfully");
      resetState();
    }
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = (updateError.data as { message?: string }).message;
        toast.error(errorMessage);
      } else if ("error" in updateError) {
        toast.error(updateError.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [updateSuccess, updateError, refetch]);

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      toast.success("User deleted successfully");
      resetState();
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = (deleteError.data as { message?: string }).message;
        toast.error(errorMessage);
      } else if ("error" in deleteError) {
        toast.error(deleteError.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [deleteSuccess, deleteError, refetch]);

  const resetState = () => {
    setUserId("");
    setUserName("");
    setNewRole("user");
    setOpenUpdateRoleModal(false);
    setOpenDeleteModal(false);
  };

  const handleUserUpdateRole = () => {
    if (user?._id === "test@test.com") {
      toast.error(`You can't demote this user`);
    }
    updateUserRole({ id: userId, role: newRole });
  };

  const handleDelete = () => {
    if (user?._id === "test@test.com") {
      toast.error(`You can't delete this user`);
    }
    if (isCurrentUser) {
      toast.error(`You can't delete yourself`);
      return;
    }
    deleteUser(userId);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.8, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 0.6, minWidth: 150 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center">
          <div className="w-12">{params.row.role}</div>
          <Button
            onClick={() => {
              setUserId(params.row.id);
              setUserName(params.row.name);
              setNewRole(params.row.role === "admin" ? "user" : "admin");
              setOpenUpdateRoleModal(true);
            }}
          >
            <RefreshCcw size={20} />
          </Button>
        </div>
      ),
    },
    {
      field: "courses",
      headerName: "Purchased Courses",
      flex: 0.5,
      minWidth: 150,
    },
    { field: "created_at", headerName: "Joined At", flex: 0.6, minWidth: 150 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      minWidth: 60,
      renderCell: (params: GridRenderCellParams) => (
        <div className="text-center">
          <Button
            variant="destructive"
            className="w-8"
            onClick={() => {
              setUserId(params.row.id);
              setOpenDeleteModal(true);
            }}
            title={
              params.row.id === user?._id ? "You can't delete yourself" : ""
            }
          >
            <AiOutlineDelete size={20} />
          </Button>
        </div>
      ),
    },
  ];

  const rows = isSuccess
    ? data.users
        .filter((user: User) => (isTeam ? user.role === "admin" : true))
        .map((user: User) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          courses: user.courses?.length || 0,
          created_at: format(user.createdAt),
        }))
    : [];

  return (
    <div className="grid bg-gray-100 dark:bg-zinc-800 rounded-md p-6">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h5 className="text-xl font-bold mb-4">All Users</h5>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              overflow: "scroll",
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row--borderBottom": {
                color: theme === "dark" ? "#fff" : "#000",
                backgroundColor:
                  theme === "dark" ? "#18181b !important" : "#fff !important",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none !important",
              },
              "& .MuiSvgIcon-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
            }}
          >
            <DataGrid
              // checkboxSelection
              rows={rows}
              columns={columns}
            />
          </Box>
        </>
      )}
      <Modal
        open={openUpdateRoleModal}
        onClose={() => setOpenUpdateRoleModal(false)}
      >
        <div className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-xl">
          {isCurrentUser ? (
            <h2 className="text-lg font-semibold mb-4 text-center">
              You can&apos;t demote yourself from admin.
            </h2>
          ) : (
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to set{" "}
              <span className="font-bold">{userName}</span> as{" "}
              <span className="capitalize">{newRole}</span>?
            </h2>
          )}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={resetState}>
              Cancel
            </Button>
            {!isCurrentUser && (
              <Button onClick={handleUserUpdateRole}>Confirm</Button>
            )}
          </div>
        </div>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-center">
            {isCurrentUser
              ? "You can't delete your own account."
              : "Are you sure you want to delete this user?"}
          </h2>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={resetState}>
              Cancel
            </Button>
            {!isCurrentUser && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
