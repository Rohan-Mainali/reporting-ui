import { REQUEST_METHOD } from "../helper/schema";
const apiPoints = {
  reports: {
    getReports: {
      url: "/api/report/",
      requestType: REQUEST_METHOD.GET
    },
    reportIssue: {
      url: "/api/report/issue/",
      requestType: REQUEST_METHOD.POST
    },
    getUser: {
      url: "/api/filters/user",
      requestType: REQUEST_METHOD.GET
    },
    postReport: {
      url: "/api/report/",
      requestType: REQUEST_METHOD.POST
    },
    updateReport: {
      url: "/api/report/reportID",
      requestType: REQUEST_METHOD.PUT
    },
    deleteReport: {
      url: "/api/report/delete/reportID",
      requestType: REQUEST_METHOD.PUT
    },
    downloadReport: {
      url: "/api/report-upload/generate-url",
      requestType: REQUEST_METHOD.POST
    },
    deleteCSV: {
      url: "api/report-upload/deleteCSV",
      requestType: REQUEST_METHOD.POST
    },
    getSuppliers: {
      url: "/api/filters/suppliers",
      requestType: REQUEST_METHOD.GET
    },
    getCategories: {
      url: "/api/filters/category",
      requestType: REQUEST_METHOD.GET
    },
    getManufacturers: {
      url: "/api/filters/manufacturers",
      requestType: REQUEST_METHOD.GET
    },
    getClinics: {
      url: "/api/filters/clinic",
      requestType: REQUEST_METHOD.GET
    }
  },
  session: {
    getToken: {
      url: "/user/getsessioninfo",
      requestType: REQUEST_METHOD.GET
    },
    getUser: {
      url: "/user/session",
      requestType: REQUEST_METHOD.GET
    }
  }
};

export default apiPoints;
