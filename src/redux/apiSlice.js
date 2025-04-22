import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  // Определяем уникальный путь для редьюсера в хранилище Redux
  reducerPath: 'api',

  // Базовый запрос с настройками для всех эндпоинтов
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001', // Базовый URL API
    prepareHeaders: (headers, { getState }) => {
      // Добавляем авторизационный токен в заголовки
      const token = getState().auth.token; // Получаем токен из состояния Redux
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Устанавливаем токен в заголовке Authorization
      }
      return headers;
    },
  }),

  // Определяем типы тегов для кэширования данных
  tagTypes: ['Feedbacks', 'Users'],

  // Определяем эндпоинты API
  endpoints: (builder) => ({
    // Эндпоинты для работы с отзывами (Feedbacks)
    getFeedbacks: builder.query({
      query: () => '/feedbacks', // Запрос для получения всех отзывов
      providesTags: (result = [], error) =>
        result
          ? [
              // Создаем теги для каждого отзыва и общего списка
              ...result.map(({ id }) => ({ type: 'Feedbacks', id })),
              { type: 'Feedbacks', id: 'LIST' },
            ]
          : [{ type: 'Feedbacks', id: 'LIST' }], // Если результат пустой, создаем только тег для списка
    }),
    addFeedback: builder.mutation({
      query: (feedback) => ({
        url: '/feedbacks', // URL для добавления нового отзыва
        method: 'POST', // HTTP метод
        body: feedback, // Тело запроса с данными отзыва
      }),
      invalidatesTags: [{ type: 'Feedbacks', id: 'LIST' }], // Инвалидируем тег для списка отзывов
    }),
    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/feedbacks/${id}`, // URL для удаления отзыва по ID
        method: 'DELETE', // HTTP метод
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Feedbacks', id }], // Инвалидируем тег для конкретного отзыва
    }),
    blockFeedback: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/feedbacks/${id}`, // URL для блокировки отзыва
        method: 'PATCH', // HTTP метод
        body: { isBlocked }, // Тело запроса с флагом блокировки
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Feedbacks', id }], // Инвалидируем тег для конкретного отзыва
    }),

    // Эндпоинты для работы с пользователями (Users)
    getUsers: builder.query({
      query: () => '/users', // Запрос для получения всех пользователей
      providesTags: (result = [], error) =>
        result
          ? [
              // Создаем теги для каждого пользователя и общего списка
              ...result.map(({ id }) => ({ type: 'Users', id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }], // Если результат пустой, создаем только тег для списка
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, newRole }) => ({
        url: `/users/${userId}`, // URL для обновления роли пользователя
        method: 'PUT', // HTTP метод
        body: { role: newRole }, // Тело запроса с новой ролью
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Users', id: userId }], // Инвалидируем тег для конкретного пользователя
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`, // URL для удаления пользователя
        method: 'DELETE', // HTTP метод
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'Users', id: userId }], // Инвалидируем тег для конкретного пользователя
    }),
    blockUser: builder.mutation({
      query: ({ userId, isBlocked }) => ({
        url: `/users/${userId}`, // URL для блокировки пользователя
        method: 'PATCH', // HTTP метод
        body: { isBlocked }, // Тело запроса с флагом блокировки
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Users', id: userId }], // Инвалидируем тег для конкретного пользователя
    }),
  }),
});

// Генерация хуков для использования в компонентах
export const {
  useGetFeedbacksQuery, // Хук для получения отзывов
  useAddFeedbackMutation, // Хук для добавления отзыва
  useDeleteFeedbackMutation, // Хук для удаления отзыва
  useBlockFeedbackMutation, // Хук для блокировки отзыва
  useGetUsersQuery, // Хук для получения пользователей
  useUpdateUserRoleMutation, // Хук для обновления роли пользователя
  useDeleteUserMutation, // Хук для удаления пользователя
  useBlockUserMutation, // Хук для блокировки пользователя
} = apiSlice;