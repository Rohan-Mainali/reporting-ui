import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import initApiRequest from '../../api-config/helper/api-request'
import apiPoints from '../../api-config/api-points/index';

export const fetchJson = createAsyncThunk('route/fetchJson', async (data, { getState }) => {

  const state = getState();
  let fileName = "/data.json";
  if (state.route.market !== "en") {
    fileName = "/data-" + state.route.market + ".json";
  }
  const response = await fetch(process.env.REACT_APP_JSON_ENDPOINT + fileName);
  return response.json();
})

export const fetchReports = createAsyncThunk('form/fetchReports',
  async (data, { rejectWithValue, getState }) => {
    try {
      let api = { ...apiPoints.reports.getReports };
      const state = getState();
      const response = await initApiRequest({
        url: '',
        apiDetails: api,
        // params: {...data },
        params: { ...data, user_id: (state.route.user.user_id) ? state.route.user.user_id : state.route.user.userID },
        extraHeaders: { 'x-dentalcorp-sessiontoken': state.route.token, 'x-dentalcorp-environment': state.route.mode, 'x-dentalcorp-market': state.route.market }
      });
      return (response.isError) ? rejectWithValue([], response.message) : response;
    } catch (err) {
      return rejectWithValue([], err);
    }
  }
)

export const postReport = createAsyncThunk('form/postReport',
  async (data, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState();
      let api = { ...apiPoints.reports.postReport };

      const response = await initApiRequest({
        url: '', apiDetails: api, requestData: data,
        params: { user_id: (state.route.user.user_id) ? state.route.user.user_id : state.route.user.userID },
        extraHeaders: { 'x-dentalcorp-sessiontoken': state.route.token, 'x-dentalcorp-environment': state.route.mode, 'x-dentalcorp-market': state.route.market }
      })
      if (response.isError) {
        return rejectWithValue([], response.message)
      } else {
        dispatch(fetchReports());
        fetchReports({ type: "SCHEDULED" });
        return response;
      }
    } catch (err) {
      return rejectWithValue([], err);
    }
  }
)

export const updateReport = createAsyncThunk('form/updateReport',
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let api = { ...apiPoints.reports.updateReport };
      const response = await initApiRequest({
        url: '',
        apiDetails: api,
        requestData: data.body,
        pathVariables: { reportID: data.id },
        params: { user_id: (state.route.user.user_id) ? state.route.user.user_id : state.route.user.userID },
        extraHeaders: { 'x-dentalcorp-sessiontoken': state.route.token, 'x-dentalcorp-environment': state.route.mode, 'x-dentalcorp-market': state.route.market }
      });
      return (response.isError) ? rejectWithValue([], response.message) : response;
    } catch (err) {
      return rejectWithValue([], err);
    }
  }
)

export const deleteReport = createAsyncThunk('form/deleteReport',
  async (data, { rejectWithValue }) => {
    try {
      let api = { ...apiPoints.reports.deleteReport };
      const response = await initApiRequest({
        url: '', apiDetails: api, requestData: data.body, pathVariables: { reportID: data.id }
      });

      // let responseCSV = { isError: false};
      // if(data?.body?.s3_url) {
      //     responseCSV = await initApiRequest({
      //         apiDetails: apiPoints.reports.deleteCSV, requestData: data?.body?.s3_url
      //     })
      // }

      return (response.isError) ? rejectWithValue([], response.message) : response;
    } catch (err) {
      return rejectWithValue([], err);
    }
  })

export const getUser = createAsyncThunk('form/getUser',
  async (data, { rejectWithValue }) => {
    try {
      let api = { ...apiPoints.reports.getUser };
      const response = await initApiRequest({
        url: '', apiDetails: api, params: { user_id: data }
      });

      return (response.isError) ? rejectWithValue([], response.message) : response;
    } catch (err) {
      return rejectWithValue([], err);
    }
  })

export const downloadReport = createAsyncThunk('form/downloadReport',
  async (data, { rejectWithValue }) => {
    try {
      let api = { ...apiPoints.reports.downloadReport };

      const response = await initApiRequest({
        url: '', apiDetails: api, requestData: { ...data.s3_url, title: data.title }
      });

      if (response.isError) {
        return rejectWithValue([], response.message)
      } else {
        const fileName = data.title + ".csv";
        var el = document.createElement("a");
        el.setAttribute("href", response.data.url);
        el.setAttribute("download", fileName);
        el.click();
        return response;
      }
    } catch (err) {
      return rejectWithValue([], err);
    }
  }
)

export const getToken = createAsyncThunk('form/getToken',
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      let url;
      switch (state.route.market) {
        case 'au':
          url = process.env.REACT_APP_SESSION_ENDPOINT_AU;
          break;
        case 'ca':
          url = process.env.REACT_APP_SESSION_ENDPOINT_CA;
          break;
        case 'nz':
          url = process.env.REACT_APP_SESSION_ENDPOINT_NZ;
          break;
        case 'canada':
          url = process.env.REACT_APP_SESSION_ENDPOINT_CA;
          break;
        default:
          url = process.env.REACT_APP_SESSION_ENDPOINT;
          break;
      }

      const response = await initApiRequest({
        url: url,
        apiDetails: apiPoints.session.getToken,
        extraHeaders: { 'x-dentalcorp-api-key': "fb4a6b72-a08a-4331-8d95-c7046ec6cd22" },
        withCredentials: true,
        market: state.route.market
      });

      if (response.isError) {
        return rejectWithValue([], response.message)
      } else {
        return response;
      }

      // } else {
      //     const res = await initApiRequest({
      //         url: process.env.REACT_APP_SESSION_ENDPOINT, apiDetails: apiPoints.session.getUser, extraHeaders: {'x-dentalcorp-api-key':'fb4a6b72-a08a-4331-8d95-c7046ec6cd22','x-dentalcorp-sessiontoken': response.body['session-token']}
      //     });
      //     if (res.isError) {
      //         return rejectWithValue([], res.message)
      //     } else {
      //         return res
      //     }
      // }
    } catch (err) {
      return rejectWithValue([], err);
    }
  })

export const getUserSession = createAsyncThunk('form/getUserSession',
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const response = await initApiRequest({
        url: '', apiDetails: apiPoints.session.getUser, market: state.route.market
      });

      if (response.isError) {
        return rejectWithValue([], response.message)
      } else {
        return response;
      }
    } catch (err) {
      return rejectWithValue([], err);
    }
  })

export const routeSlice = createSlice({
  name: 'route',
  initialState: {
    loading: true,
    jsonData: [],
    activeItem: {},
    modalShow: { show: false, type: 'report', report_type: 'AD_HOC' },
    popAlert: false,
    reports: [],
    scheduledReports: [],
    pagination: {
      scheduled: {
        currentPage: 0,
        rowsPerPage: 10
      },
      reports: {
        currentPage: 0,
        rowsPerPage: 10
      }
    },
    dialogShow: false,
    reportsLoading: true,
    generateLoading: true,
    failedReports: false,
    dateArray: [],
    user: [],
    sessionAlert: false,
    token: '',
    mode: 'dev',
    market: 'en'
  },
  reducers: {
    recordDateArray: (state, action) => {
      state.dateArray = action.payload
    },
    updatePagination: (state, action) => {

      if (action.payload.type === "SCHEDULED") {
        state.pagination.scheduled.currentPage = action.payload.currentPage;
        state.pagination.scheduled.rowsPerPage = action.payload.rowsPerPage;
      } else {
        state.pagination.reports.currentPage = action.payload.currentPage;
        state.pagination.reports.rowsPerPage = action.payload.rowsPerPage;
      }
    },
    recordRoute: (state, action) => {
      state.activeItem = action.payload
    },
    fetchRoute: (state) => {
      state.value -= 1
    },
    routePayload: (state, action) => {
      state.value += action.payload
    },
    showModal: (state, action) => {
      state.modalShow = action.payload
    },
    showDialog: (state, action) => {
      state.dialogShow = action.payload
    },
    changePopAlert: (state, action) => {
      state.popAlert = action.payload
    },
    changeSessionAlert: (state, action) => {
      state.sessionAlert = action.payload
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setMarket: (state, action) => {
      state.market = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchJson.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchJson.fulfilled, (state, action) => {
        state.loading = false;
        state.jsonData = action.payload;
        state.activeItem = action.payload?.items[0];
      })
      .addCase(fetchJson.rejected, (state, action) => {
        state.loading = false;
        state.popAlert = true;
      })
      .addCase(fetchReports.pending, (state, action) => {
        // state.loading = true;
        state.reportsLoading = true;
        state.failedReports = false;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        const report_type = action.payload.data.type;
        if (report_type === "SCHEDULED") {
          state.scheduledReports = { dataCount: action.payload.data.dataCount, data: action.payload.data.data }
        }
        if (report_type === "All") {
          state.reports = { dataCount: action.payload.data.dataCount, data: action.payload.data.data }
        }
        state.reportsLoading = false;
        state.failedReports = false;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        // state.loading = false;
        state.reportsLoading = false;
        state.failedReports = true;
        // state.popAlert = true;
      })
      .addCase(postReport.pending, (state, action) => {
        state.loading = true;
        state.generateLoading = true;

      })
      .addCase(postReport.fulfilled, (state, action) => {
        fetchReports();
        fetchReports({ type: "SCHEDULED" });
        state.modalShow.show = false;
        state.generateLoading = false;
        state.loading = false;
        state.dialogShow = true;

        // state.reports = action.payload.data;
      })
      .addCase(postReport.rejected, (state, action) => {
        state.generateLoading = false;
        state.loading = false;
        // state.loading = false;
        // state.popAlert = true;
      })
      .addCase(downloadReport.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(downloadReport.fulfilled, (state, action) => {
        // state.reports = action.payload.data;
      })
      .addCase(downloadReport.rejected, (state, action) => {
        // state.loading = false;
        // state.popAlert = true;
      })
      .addCase(updateReport.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.dialogShow = true;
        // state.reports = action.payload.data;
      })
      .addCase(updateReport.rejected, (state, action) => {
        // state.loading = false;
        // state.popAlert = true;
      })
      .addCase(deleteReport.pending, (state, action) => {

      })
      .addCase(deleteReport.fulfilled, (state, action) => {
      })
      .addCase(deleteReport.rejected, (state, action) => {

      })
      .addCase(getUser.fulfilled, (state, action) => {
        if (action.payload.data.rowCount) {
          state.user = action.payload.data.rows[0]
        }
      })
      .addCase(getUserSession.pending, (state, action) => {

      })
      .addCase(getUserSession.fulfilled, (state, action) => {

      })
      .addCase(getUserSession.rejected, (state, action) => {

      })
      .addCase(getToken.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.loading = false;
        if (Object.keys(action.payload.data.response).length > 0) {
          state.token = action.payload.data.response['session-token']
        }
        // if ( action.payload.data.rowCount) {
        //     state.user = action.payload.response;
        // }
      })
      .addCase(getToken.rejected, (state, action) => {
        state.sessionAlert = true;
        state.loading = false;
      })
  }
})

// Action creators are generated for each case reducer function
export const { updatePagination, recordDateArray, setMarket, setMode, recordRoute, fetchRoute, routePayload, showModal, showDialog, changePopAlert, changeSessionAlert } = routeSlice.actions;

export default routeSlice.reducer;
