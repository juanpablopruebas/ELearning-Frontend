import { indexApi } from "./indexApi";

export const layoutApi = indexApi.injectEndpoints({
  endpoints: (builder) => ({
    getLayout: builder.query({
      query: (type) => ({
        url: `/get-layout/${type}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    editLayout: builder.mutation({
      query: ({ type, image, title, subTitle, faq, categories }) => ({
        url: '/update-layout',
        method: "PUT",
        body: {
          type,
          image,
          title,
          subTitle,
          faq,
          categories,
        },
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: "throw",
});

export const { useGetLayoutQuery, useEditLayoutMutation } = layoutApi;
