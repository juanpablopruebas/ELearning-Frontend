import { indexApi } from "./indexApi";

export const authApi = indexApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "/get-all-courses",
        method: "GET",
        credentials: "include",
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/delete-course/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    getCourses: builder.query({
      query: () => ({
        url: "/get-courses",
        method: "GET",
        credentials: "include",
      }),
    }),
    getCoursesByUser: builder.query({
      query: () => ({
        url: "/get-courses-by-user",
        method: "GET",
        credentials: "include",
      }),
    }),
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `/get-course/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `/get-course-content/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    addQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: `add-question`,
        method: "POST",
        body: { question, courseId, contentId },
        credentials: "include",
      }),
    }),
    addAnswer: builder.mutation({
      query: ({ answer, contentId, courseId, questionId }) => ({
        url: `add-answer`,
        method: "POST",
        body: { answer, contentId, courseId, questionId },
        credentials: "include",
      }),
    }),
    addReview: builder.mutation({
      query: ({ courseId, rating, review }) => ({
        url: `add-review/${courseId}`,
        method: "POST",
        body: { rating, review },
        credentials: "include",
      }),
    }),
    addReplyToReview: builder.mutation({
      query: ({ comment, courseId, reviewId }) => ({
        url: `add-reply`,
        method: "POST",
        body: { comment, courseId, reviewId },
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: "throw",
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetCoursesByUserQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddQuestionMutation,
  useAddAnswerMutation,
  useAddReviewMutation,
  useAddReplyToReviewMutation,
} = authApi;
