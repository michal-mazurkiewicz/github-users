import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SearchUsersResponse, User } from '../../types/users';
import { usersApi } from '../../api/users';
import type { RootState } from '../store';

type UsersState = {
  users: User[];
  total_count?: number;
  incomplete_results?: boolean;
  page: number;
  size: number;
  has_more: boolean;
  query: string;
  selectedUser?: User;
  favourites: User[];
  searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  userStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: UsersError;
  rateLimitResetAt?: number;
};

type UsersError = {
  message: string;
  rateLimitResetAt?: number;
};

const STORAGE_KEY = 'github-users:favourites';

const readFavourites = (): User[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeFavourites = (users: User[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const searchUsers = createAsyncThunk<SearchUsersResponse, { query: string; page: number }, { rejectValue: UsersError }>(
  'users/searchUsers',
  async ({ query, page }, { rejectWithValue }) => {
    try {
      const result = await usersApi.searchUsers(query, page);
      return { ...result, page: page + 1 };
    } catch (error) {
      if (error instanceof Error) {
        const rateLimitResetAt = 'rateLimitResetAt' in error ? (error as Error & { rateLimitResetAt?: number }).rateLimitResetAt : undefined;
        return rejectWithValue({ message: error.message, rateLimitResetAt });
      }
      return rejectWithValue({ message: 'Failed to search users' });
    }
  },
);

export const fetchUserByHandle = createAsyncThunk<User, string, { rejectValue: UsersError }>(
  'users/fetchUserByHandle',
  async (handle, { rejectWithValue }) => {
    try {
      const user = await usersApi.getUserByHandle(handle);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        const rateLimitResetAt = 'rateLimitResetAt' in error ? (error as Error & { rateLimitResetAt?: number }).rateLimitResetAt : undefined;
        return rejectWithValue({ message: error.message, rateLimitResetAt });
      }
      return rejectWithValue({ message: 'Failed to fetch user' });
    }
  },
);

const initialState: UsersState = {
  users: [],
  page: 1,
  size: 30,
  has_more: false,
  query: '',
  favourites: readFavourites(),
  searchStatus: 'idle',
  userStatus: 'idle',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleFavourite: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      const exists = state.favourites.find(item => item.login === user.login);
      let next: User[];

      if (exists) {
        next = state.favourites.filter(item => item.login !== user.login);
      } else {
        next = [...state.favourites, { ...user, starred: true }];
      }

      state.favourites = next;
      writeFavourites(next);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchUsers.pending, (state, action) => {
        const { query, page } = action.meta.arg;
        state.searchStatus = 'loading';
        state.error = undefined;
        state.rateLimitResetAt = undefined;
        state.query = query;

        if (page === 1) {
          state.users = [];
          state.total_count = undefined;
          state.incomplete_results = undefined;
          state.has_more = false;
          state.page = 1;
        }
      })
      .addCase(searchUsers.fulfilled, (state, action: PayloadAction<SearchUsersResponse>) => {
        //@ts-ignore
        const { page, query } = action.meta.arg;
        const nextUsers = page === 1 ? action.payload.items : [...state.users, ...action.payload.items];
        state.searchStatus = 'succeeded';
        state.users = nextUsers;
        state.total_count = action.payload.total_count;
        state.incomplete_results = action.payload.incomplete_results;
        state.page = action.payload.page;
        state.has_more = action.payload.total_count > nextUsers.length;
        state.query = query;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.error = action.payload;
        state.rateLimitResetAt = action.payload?.rateLimitResetAt;
      })
      .addCase(fetchUserByHandle.pending, state => {
        state.userStatus = 'loading';
        state.error = undefined;
        state.rateLimitResetAt = undefined;
      })
      .addCase(fetchUserByHandle.fulfilled, (state, action: PayloadAction<User>) => {
        state.userStatus = 'succeeded';
        const user = action.payload;
        state.selectedUser = user;
      })
      .addCase(fetchUserByHandle.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.error = action.payload;
        state.rateLimitResetAt = action.payload?.rateLimitResetAt;
      });
  },
});

export const { toggleFavourite } = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;
export const selectUser = (state: RootState) => state.users.selectedUser;
export const selectFavourites = (state: RootState) => state.users.favourites;
export const selectIsFavourite = (handle?: string) => (state: RootState) =>
  handle ? state.users.favourites.some(user => user.login === handle) : false;
export const selectPaginationInfo = (state: RootState) => ({
  total_count: state.users.total_count,
  page: state.users.page,
  has_more: state.users.has_more,
  query: state.users.query,
});

export const selectRateLimitResetAt = (state: RootState) => state.users.rateLimitResetAt;

export default usersSlice.reducer;
