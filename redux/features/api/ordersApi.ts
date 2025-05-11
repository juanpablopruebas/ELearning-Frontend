import { userUpdatedCourses } from "../slice/authSlice";
import { indexApi } from "./indexApi";

export const ordersApi = indexApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: "get-all-orders",
        method: "GET",
        credentials: "include",
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        method: "POST",
        body: {
          courseId,
          payment_info,
        },
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userUpdatedCourses({
              userCourses: result.data.userCourses,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getStripePublishableKey: builder.query({
      query: () => ({
        url: "payment/stripe-key",
        method: "GET",
        credentials: "include",
      }),
    }),
    createPaymentIntent: builder.mutation({
      query: (amount) => ({
        url: "create-payment",
        method: "POST",
        body: { amount },
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: "throw",
});

export const {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useGetStripePublishableKeyQuery,
  useCreatePaymentIntentMutation,
} = ordersApi;
