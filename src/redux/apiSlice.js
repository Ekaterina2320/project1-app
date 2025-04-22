// apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
    prepareHeaders: (headers, { getState }) => {
      // Добавляем авторизацию
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Feedbacks', 'Users'],
  endpoints: (builder) => ({
    // Feedbacks endpoints
    getFeedbacks: builder.query({
      query: () => '/feedbacks',
      providesTags: (result = [], error) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Feedbacks', id })),
              { type: 'Feedbacks', id: 'LIST' },
            ]
          : [{ type: 'Feedbacks', id: 'LIST' }],
    }),
    addFeedback: builder.mutation({
      query: (feedback) => ({
        url: '/feedbacks',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: [{ type: 'Feedbacks', id: 'LIST' }],
    }),
    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/feedbacks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Feedbacks', id }],
    }),
    blockFeedback: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/feedbacks/${id}`,
        method: 'PATCH',
        body: { isBlocked },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Feedbacks', id }],
    }),

    // Users endpoints
    getUsers: builder.query({
      query: () => '/users',
      providesTags: (result = [], error) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users', id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, newRole }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: { role: newRole },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Users', id: userId }],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'Users', id: userId }],
    }),
    blockUser: builder.mutation({
      query: ({ userId, isBlocked }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: { isBlocked },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Users', id: userId }],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useAddFeedbackMutation,
  useDeleteFeedbackMutation,
  useBlockFeedbackMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useBlockUserMutation,
} = apiSlice;