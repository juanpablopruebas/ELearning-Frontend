"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/api/courseApi";
import { Loader } from "@/components/layout/Loader";
import { format } from "timeago.js";
import { Box, Modal } from "@mui/material";
import toast from "react-hot-toast";
import Link from "next/link";
import { Course } from "@/types";

export const AllCourses = () => {
  const { theme, systemTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");

  const { isLoading, data, isSuccess, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [
    deleteCourse,
    { error: deleteCourseError, isSuccess: deleteCourseIsSuccess },
  ] = useDeleteCourseMutation({});

  useEffect(() => {
    if (deleteCourseIsSuccess) {
      refetch();
      toast.success("Course deleted successfully");
      setOpen(false);
      setCourseId("");
    }
    if (deleteCourseError) {
      if ("data" in deleteCourseError) {
        const errorMessage = (deleteCourseError.data as { message?: string })
          .message;
        toast.error(errorMessage);
      } else if ("error" in deleteCourseError) {
        toast.error(deleteCourseError.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [deleteCourseIsSuccess, deleteCourseError, refetch]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "title", headerName: "Course Title", flex: 1, minWidth: 150 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5, minWidth: 150 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/admin/edit-course/${params.row.id}`}
          className="text-center"
        >
          <Button className="w-8">
            <AiOutlineEdit size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <div className="text-center">
          <Button
            className="w-8"
            onClick={() => {
              setOpen(true);
              setCourseId(params.row.id);
              setCourseName(params.row.title);
            }}
          >
            <AiOutlineDelete size={20} />
          </Button>
        </div>
      ),
    },
  ];

  const rows = isSuccess
    ? data.courses.map((course: Course) => ({
        id: course._id,
        title: course.name,
        ratings: course.ratings,
        purchased: course.purchased,
        created_at: format(course.createdAt),
      }))
    : [];

  const handleDelete = () => {
    deleteCourse(courseId);
  };

  return (
    <div className="grid bg-gray-100 dark:bg-zinc-800 rounded-md p-6">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h5 className="text-xl font-bold mb-4">All Courses</h5>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              overflow: "scroll",
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-sortIcon": {
                color:
                  theme === "system"
                    ? systemTheme === "dark"
                      ? "#fff"
                      : "#000"
                    : theme === "dark"
                    ? "#fff"
                    : "#000",
              },
              "& .MuiDataGrid-row": {
                color:
                  theme === "system"
                    ? systemTheme === "dark"
                      ? "#fff"
                      : "#000"
                    : theme === "dark"
                    ? "#fff"
                    : "#000",
              },
              "& .MuiDataGrid-row--borderBottom": {
                color:
                  theme === "system"
                    ? systemTheme === "dark"
                      ? "#fff"
                      : "#000"
                    : theme === "dark"
                    ? "#fff"
                    : "#000",
                backgroundColor:
                  theme === "system"
                    ? systemTheme === "dark"
                      ? "#18181b !important"
                      : "#fff !important"
                    : theme === "dark"
                    ? "#18181b !important"
                    : "#fff !important",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none !important",
              },
              "& .MuiSvgIcon-root": {
                color:
                  theme === "system"
                    ? systemTheme === "dark"
                      ? "#fff"
                      : "#000"
                    : theme === "dark"
                    ? "#fff"
                    : "#000",
              },
              "& .MuiTablePagination-root": {
                color:
                  theme === "system"
                    ? systemTheme === "dark"
                      ? "#fff"
                      : "#000"
                    : theme === "dark"
                    ? "#fff"
                    : "#000",
              },
            }}
          >
            <DataGrid
              //  checkboxSelection
              rows={rows}
              columns={columns}
            />
          </Box>
        </>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Are you sure you want to delete <b>{courseName}</b> course?
          </h2>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
