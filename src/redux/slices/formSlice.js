import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import initApiRequest from '../../api-config/helper/api-request'
import apiPoints from '../../api-config/api-points/index'

export const fetchSupplier = createAsyncThunk('form/fetchSupplier', 
    async (data , { rejectWithValue }) => {
        try {
          const response =  await initApiRequest({
            url: '',apiDetails: apiPoints.reports.getSuppliers, params: { keyword: data }
                  });
          return (response.isError) ? rejectWithValue([], response.message) : response;
        } catch (err) {
          return rejectWithValue([], err);
        }
      }
)
export const fetchCategory = createAsyncThunk('form/fetchCategory', 
    async (data = '', { rejectWithValue }) => {
        try {
          const response =  await initApiRequest({
            url: '', apiDetails: apiPoints.reports.getCategories, params: { keyword: data },
                  });
          return (response.isError) ? rejectWithValue([], response.message) : response;
        } catch (err) {
          return rejectWithValue([], err);
        }
      }
)
export const fetchClinic = createAsyncThunk('form/fetchClinic', 
    async (data, { rejectWithValue, getState }) => {
        try {
          const state = getState();
          const response =  await initApiRequest({
            url: '', 
            apiDetails: apiPoints.reports.getClinics, 
            // pathVariables: { userId: data.userId},
            params: {...data, user_id: ( state.route.user.user_id )?  state.route.user.user_id : '' },
            extraHeaders: {'x-dentalcorp-sessiontoken': data.token, 'x-dentalcorp-environment' : state.route.mode,'x-dentalcorp-market': state.route.market}
                  });
          return (response.isError) ? rejectWithValue([], response.message) : response;
        } catch (err) {
          return rejectWithValue([], err);
        }
      }
)
export const fetchManufacturer = createAsyncThunk('form/fetchManufacturer', 
    async (data = '', { rejectWithValue }) => {
        try {
          const response =  await initApiRequest({
            url: '', apiDetails: apiPoints.reports.getManufacturers, params: { keyword: data }
                  });
          return (response.isError) ? rejectWithValue([], response.message) : response;
        } catch (err) {
          return rejectWithValue([], err);
        }
      }
)

export const routeSlice = createSlice({
    name: 'form',
    initialState: {
        loading: {
            supplier: false,
            category : false,
            clinic: false,
            manufacturer: false,
        },
        supplier: [],
        category: [],
        manufacturer: [],
        clinic: [],
        popAlert: "",
        userID: ""
    },
    reducers: {
        recordUserID: (state,action) => {
          state.userID = action.payload;
        },
        resetFilter: (state, action) => {
          // console.log('ACTION: ', action);
          state[action.payload.tag] = action.payload.value
        }
        // << reducers if exists any >>
        // << reducer name >> : (state, action) => {
        //     state.<< state variable >> -= action.payload // state update
        // }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSupplier.pending, (state, action) => {
                state.loading.supplier = true;
            })
            .addCase(fetchSupplier.fulfilled, (state, action) => {
                state.loading.supplier = false;
                state.supplier = action.payload.data.data.rows;
            })
            .addCase(fetchSupplier.rejected, (state, action) => {
                state.loading.supplier = false;
                state.popAlert += "Suppliers::"
            })
            .addCase(fetchManufacturer.pending, (state, action) => {
                state.loading.manufacturer = true;
            })
            .addCase(fetchManufacturer.fulfilled, (state, action) => {
                state.loading.manufacturer = false;
                // console.log('Data to store Manufacturer: ', action.payload.data.data.rows);
                state.manufacturer = action.payload.data.data.rows;
            })
            .addCase(fetchManufacturer.rejected, (state, action) => {
                state.loading.manufacturer = false;
                state.popAlert += "Manufacturers::";
            })
            .addCase(fetchCategory.pending, (state, action) => {
                state.loading.category = true;
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.loading.category = false;
                state.category = action.payload.data.data.rows;
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.loading.category = false;
                state.popAlert += "Category::"
            })
            .addCase(fetchClinic.pending, (state, action) => {
                state.loading.clinic = true;
            })
            .addCase(fetchClinic.fulfilled, (state, action) => {
                state.loading.clinic = false;
                state.clinic = action.payload.data.data.rows;
            })
            .addCase(fetchClinic.rejected, (state, action) => {
                state.loading.clinic = false;
                state.popAlert += "Clinics::"
            })
    }
})
export const { recordUserID, resetFilter } = routeSlice.actions;

export default routeSlice.reducer;
