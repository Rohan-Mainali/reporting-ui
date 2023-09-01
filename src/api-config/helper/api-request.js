import Axios from "axios";
import { REQUEST_BODY_TYPE } from "./schema";

function getFormData(requestData) {
  let formData = new FormData();
  for (let data in requestData) {
    if (requestData[data] instanceof Array) {
      requestData[data].forEach((dataEl, index) => {
        if (dataEl instanceof Object && !(dataEl instanceof File)) {
          Object.keys(dataEl).forEach(elKey => {
            return formData.append(`${data}[${index}].${elKey}`, dataEl[elKey]);
          });
        } else if (dataEl instanceof File) {
          formData.append(data, dataEl);
        }
      });
    } else if (requestData[data] instanceof Object && !(requestData[data] instanceof File)) {
      // eslint-disable-next-line no-unused-vars
      Object.entries(requestData[data]).forEach(([key, value]) => {
        return formData.append(`${data}`, value);
      });
    } else {
      formData.append(data, requestData[data]);
    }
  }
  return formData;
}

const getRequestHeaders = apiDetails => {
  let headers = {
    "Content-Type": "application/json",
    "Content-Language": "en",
    "Access-Control-Allow-Origin": "*"
  };
  switch (apiDetails.requestBodyType) {
    case REQUEST_BODY_TYPE.FORM_DATA:
      headers = {
        ...headers,
        "Content-Type": "multipart/form-data"
      };
      break;
    default:
      headers = { ...headers };
  }

  return headers;
};
const transformRequestData = (apiDetails, requestData) => {
  let transformedRequestData = { data: requestData };

  switch (apiDetails.requestBodyType) {
    case "FORM-DATA":
      transformedRequestData.data = getFormData(requestData);
      break;
    default:
      transformedRequestData.data = requestData;
      break;
  }

  return transformedRequestData;
};

const manageErrorResponse = error => {
  const { data = {}, config = null } = error;

  let serverErrors = {};
  const { errors = {} } = data;
  if (Object.keys(errors).length) {
    Object.keys(errors).forEach(e => {
      serverErrors[e] = Array.isArray(errors[e]) ? errors[e][0] : errors[e];
    });
  }
  let errorResponse = {
    message: data.message || "Something went wrong!",
    errors: Object.keys(serverErrors).length ? serverErrors : errors,
    status: error?.status || 500,
    noConnection: false,
    config: config
  };
  return errorResponse;
};


export default function initApiRequest({
  url,
  apiDetails,
  requestData,
  pathVariables,
  params,
  extraHeaders,
  withCredentials = false,
  market = 'en'
}) {
  if (Object.keys(pathVariables || {}).length) {
    apiDetails.url = Object.entries(pathVariables).reduce((acc, [key, value]) => {
      return acc.replace(`${key}`, value?.toString());
    }, apiDetails.url);
  }

  // API URL
  let baseURL = (url === '') ? process.env.REACT_APP_BACKEND_ENDPOINT : url;
  let headers = getRequestHeaders(apiDetails);
  headers = { ...headers, ...extraHeaders };
  const transformedRequestData = transformRequestData(apiDetails, requestData);
  let axiosReqParams = {
    baseURL,
    url: apiDetails.url,
    responseType: "json",
    method: apiDetails.requestType,
    timeout: 20000, // only wait for 2s
    headers,
    withCredentials,
    ...transformedRequestData
  };
  if (params) {
    axiosReqParams = {
      ...axiosReqParams,
      params: params,
    };
  }
  let redirect_url;
  switch (market) {
    case 'au':
      redirect_url = process.env.REACT_APP_REDIRECT_URL_AU;
      break;
    case 'ca':
      redirect_url = process.env.REACT_APP_REDIRECT_URL_CA;
      break;
    case 'nz':
      redirect_url = process.env.REACT_APP_REDIRECT_URL_NZ;
      break;
    case 'canada':
      redirect_url = process.env.REACT_APP_REDIRECT_URL_CA;
      break;
    default:
      redirect_url = process.env.REACT_APP_REDIRECT_URL;
      break;
  }
  return Axios.request(axiosReqParams)
    .then(response => {

      if (withCredentials) {
        if (((response?.status) && response.status === 401) || (response?.data?.response && Object.keys(response.data.response).length === 0)) {
          window.location.replace(redirect_url)
        }
      }
      if ((response?.status) && response.status === 401) {
        window.location.replace(redirect_url)
      }
      return {
        data: response.data,
        isSuccess: true,
        isError: false,
        status: response.status,
      };
    })
    .catch(error => {
      if (withCredentials) {
        if (((error?.response?.status) && error?.response.status === 401) || (error?.response?.data?.response && Object.keys(error?.response.data.response).length === 0)) {
          window.location.replace(redirect_url)
        }
      }
      if ((error?.response?.status) && error?.response.status === 401) {
        window.location.replace(redirect_url)
      }
      return {
        ...manageErrorResponse(error.response || {}),
        isError: true,
        isSuccess: false
      };
    });
}

Axios.interceptors.response.use(response => {
  return response;
});
