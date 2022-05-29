import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  goals: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const getGoals = createAsyncThunk('goals/getGoals', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const resp = await axios.get('/api/goals', config);
    return resp.data;
  } catch (error) {
    console.log('ERROR GETGOALS getGoals asyncThunk throw error');
    // const message =
    //   (error.resp && error.resp.data && error.resp.data.message) ||
    //   error.message ||
    //   error.toString()
    return thunkAPI.rejectWithValue(error.toString());
  }
});

const addGoal = createAsyncThunk(
  'goals/addGoal',
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const resp = await axios.post('/api/goals', formData, config);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString());
    }
  }
);

const deleteGoal = createAsyncThunk('goals/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const resp = await axios.delete(`/api/goals/${id}`, config);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.toString());
  }
});

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGoals.pending, (state) => {
        state.isLoading = true;
        state.message = 'Fetching Goals...';
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.message = '';
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = action.payload;
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addGoal.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals.push(action.payload);
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteGoal.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = state.goals.filter(
          (goal) => goal._id !== action.payload.id
        );
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default goalsSlice.reducer;
export const { reset } = goalsSlice.actions;
export { getGoals, addGoal, deleteGoal };
