import { userUpdatedRole } from "../slice/authSlice";
import { indexApi } from "./indexApi";

export const userApi = indexApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: ({ avatar }) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include",
      }),
    }),
    editProfile: builder.mutation({
      query: ({ name }) => ({
        url: "update-user",
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/get-all-users",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: "/update-user-role",
        method: "PUT",
        body: { id, role },
        credentials: "include",
      }),
    }),
    updateMyselfUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: "/update-user-role",
        method: "PUT",
        body: { id, role },
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userUpdatedRole({
              role: result.data.user.role,
            }) //Missing el token
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete-user/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: "throw",
});

export const {
  useUpdateAvatarMutation,
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useUpdateMyselfUserRoleMutation,
} = userApi;
