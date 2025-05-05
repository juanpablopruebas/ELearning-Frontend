"use client";

import { Loader } from "@/components/layout/Loader";
import { useGetAllCoursesQuery } from "@/redux/features/api/courseApi";
import { useGetAllOrdersQuery } from "@/redux/features/api/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/api/userApi";
import { Course, Order, User } from "@/types";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";

interface InvoiceRow extends Order {
  id: string;
  userName?: string;
  userEmail?: string;
  title?: string;
  price?: string;
}

type AllInvoicesType = {
  isDashboard?: boolean;
};

export const AllInvoices = ({ isDashboard = false }: AllInvoicesType) => {
  const { theme } = useTheme();
  const { data: ordersData, isLoading, isSuccess } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});
  const [orderData, setOrderData] = useState<InvoiceRow[]>([]);

  useEffect(() => {
    if (isSuccess && ordersData?.orders) {
      const mappedData: InvoiceRow[] = ordersData.orders.map((order: Order) => {
        const user = usersData?.users.find((u: User) => u._id === order.userId);
        const course = coursesData?.courses.find(
          (c: Course) => c._id === order.courseId
        );
        return {
          ...order,
          id: order._id,
          userName: user?.name || "N/A",
          userEmail: user?.email || "N/A",
          title: course?.name || "N/A",
          price: course ? `$${course.price}` : "N/A",
        };
      });
      setOrderData(mappedData);
    }
  }, [ordersData, usersData, coursesData, isSuccess]);

  const mailRender = (params: GridRenderCellParams) => (
    <a
      href={`mailto:${params.row.userEmail}`}
      className="flex h-full items-center justify-center"
    >
      <AiOutlineMail size={20} />
    </a>
  );

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      { field: "id", headerName: "ID", flex: 0.3 },
      {
        field: "userName",
        headerName: "Name",
        flex: isDashboard ? 0.6 : 0.5,
      },
    ];

    if (!isDashboard) {
      baseColumns.push(
        { field: "userEmail", headerName: "Email", flex: 1 },
        { field: "title", headerName: "Course Title", flex: 1 }
      );
    }

    baseColumns.push({ field: "price", headerName: "Price", flex: 0.5 });

    if (isDashboard) {
      baseColumns.push({
        field: "createdAt",
        headerName: "Created At",
        flex: 0.5,
      });
    } else {
      baseColumns.push({
        field: "action",
        headerName: "Contact",
        flex: 0.2,
        renderCell: mailRender,
      });
    }
    return baseColumns;
  }, [isDashboard]);

  return (
    <div className="grid rounded-md p-6">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h5 className="text-2xl font-bold mb-4">Recent Transactions</h5>
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
              rows={orderData}
              columns={columns}
            />
          </Box>
        </>
      )}
    </div>
  );
};
