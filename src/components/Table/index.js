import React, { useState, useEffect, useRef } from "react"
import { CircularProgress, Button, Paper, Box, Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ReportIcon from "../Icons/Report";
import CustomRow from "./CustomRow";
import CustomCell from "./CustomCell";
import { useDispatch, useSelector } from "react-redux";
import { updatePagination, downloadReport, updateReport, fetchReports, deleteReport, postReport, showModal } from "../../redux/slices/routeSlice";
import moment from "moment";
import TablePagination from '@mui/material/TablePagination';
import CustomDropDown2 from "../ui-components/CustomDropDown2";

const TableComponent = ({ data }) => {
  const route = useSelector((state) => state.route);
  const form = useSelector((state) => state.form);
  const {
    headers,
    type,
    body: { data: tableData },
    body: { dataCount: tableDataCount }
  } = data;
  const [paginationMap, setPaginationMap] = useState({
    rowsPerPage: 10,
    rowsPerPageOption: [],
    currentPage: 0
  });
  const dispatch = useDispatch();
  const handleDownload = (row) => {
    if (row?.s3_url !== undefined && row?.s3_url !== null) {
      dispatch(downloadReport(row))
    }
  }
  function cleanId(obj) {
    if (Array.isArray(obj))
      obj.forEach(cleanId);
    else {
      delete obj['_id'];
      // obj['_id'] = undefined;
      for (let key in obj)
        if (typeof obj[key] == 'object')
          cleanId(obj[key]);
    }
  }
  const handleRun = (row) => {
    let diff = moment(row.date_range.range_date_end).diff(moment(row.date_range.range_date_start), 'days');
    let date_range = {
      range_date_end: moment().subtract(1, "days").utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString(),
      range_date_start: moment().subtract(diff + 1, 'days').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString()
    }
    const data = { ...row };
    if (data.s3_url) {
      data.s3_url = undefined;
    }
    data.title = row.title;
    data.desc = row.desc;
    let projection = [];
    data.projection_fields.selected.map((i) => {
      projection.push({
        key: i.key,
        value: i.value
      })
    })
    data.date_range_option = {
      key: row.date_range_option.key,
      value: row.date_range_option.value
    }
    data.projection_fields = {
      all: row.projection_fields.all,
      selected: projection
    };
    data.filters = {
      suppliers: {
        all: row.filters.suppliers.all,
        selected: row.filters.suppliers.selected
      },
      manufacturers: {
        all: row.filters.manufacturers.all,
        selected: row.filters.manufacturers.selected
      },
      category: {
        all: row.filters.category.all,
        selected: row.filters.category.selected
      },
      clinic: {
        all: row.filters.clinic.all,
        selected: row.filters.clinic.selected
      }
    };
    data.custom_field_filters = {
      operation: row?.custom_field_filters?.operation || "AND",
      condition: row?.custom_field_filters?.condition?.map(o => { return { fieldId: o.fieldId, operator: o.operator, value: o.value } }) || []
    }
    data.report_format = row.report_format;
    data.email = row.email;
    data.report_view = row.report_view;
    data.first_delivery_date = moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();
    data.next_delivery_date = undefined;
    data.schedule_frequency = undefined;
    data.parent_report_id = row._id;
    data.report_status = 'REQUESTED';
    data.report_type = 'RERUN';
    data.last_delivered_date = undefined;
    data.user_id = (form.userID !== null) ? form.userID : "";
    data.group_id = (route.user.group_id) ? route.user.group_id : '';
    data.group_service_id = (route.user.group_service_id) ? route.user.group_service_id : '';
    const payload = {
      ...data,
      timestamp: moment().format(),
      date_range: date_range,
      s3_url: {
        bucket: '',
        key: ''
      }
    }
    delete payload._id;
    delete payload.__v;
    dispatch(postReport(payload))

  }

  const handleView = (row) => {
    dispatch(showModal({ type: 'view', show: true, value: row }))
  }

  const handleReportIssue = (row) => {
    dispatch(showModal({ type: 'issue', show: true, value: row }))
  }

  const handleDelete = (row) => {
    const payload = { ...row, report_status: 'DELETED' }
    dispatch(deleteReport({ body: payload, id: row._id }))
    dispatch(fetchReports({ page: paginationMap.currentPage, limit: paginationMap.rowsPerPage, type: data.type }))

  }
  const updatePaginationMap = () => {
    const pages = Math.ceil(tableDataCount / 10);
    dispatch(updatePagination({ ...paginationMap, type: data.type }));
    setPaginationMap({
      ...paginationMap,
      rowsPerPageOption: [...Array(pages).keys()].map(el => (el + 1) * 10)
    });
  }

  const handleChangePage = (event, newPage) => {
    setPaginationMap({
      ...paginationMap,
      currentPage: newPage
    })

    dispatch(updatePagination({ currentPage: newPage, rowsPerPage: paginationMap.rowsPerPage, type: data.type }))
    dispatch(fetchReports({ page: newPage, limit: paginationMap.rowsPerPage, type: data.type }))
  };

  const handleRefresh = () => {
    dispatch(fetchReports({ page: paginationMap.currentPage, limit: paginationMap.rowsPerPage, type: data.type }))
  }

  const handleChangeRowsPerPage = (event) => {
    setPaginationMap({
      ...paginationMap,
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 0
    })
    dispatch(updatePagination({ currentPage: 0, rowsPerPage: parseInt(event.target.value, 10), type: data.type }));
    dispatch(fetchReports({ page: 0, limit: parseInt(event.target.value, 10), type: data.type }))
  };

  useEffect(() => {
    // Updating table pagination metrics
    updatePaginationMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id={data.key}>
      <TableContainer sx={{ boxShadow: 'none', p: 0, position: 'relative', minHeight: '50vh', background: '#f2f2f2' }} component={Paper}>
        <Table sx={{ minWidth: 700, boxShadow: 'none' }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {headers && headers.map((header, index) => (
                <CustomCell key={header} align={(index !== 0) ? 'center' : 'left'}>{header}</CustomCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData && tableData.map((row, index) => (
              <CustomRow key={index} >
                <CustomCell component="th" scope="row" sx={{ display: 'flex', flexDirection: 'column', marginLeft: '12px' }} icon={<ReportIcon color="blue" />}>

                  {/* <CustomCell component="th" scope="row" icon= {(row?.details?.icon) ? <ReportIcon color={row?.details?.icon} /> : ''}> */}
                  <Typography variant="tableTitle" sx={{ m: '4px 0 6px 0' }}>{row?.title}</Typography>
                  <Typography variant="reportTitleText">{row?.desc}</Typography>
                </CustomCell>

                {(data.type === 'DEFAULT') ? <>
                  <CustomCell align="center">{moment(row?.timestamp).format('DD MMM YYYY - HH:mm')}</CustomCell>
                  <CustomCell align="center">{(row?.date_range?.range_date_start !== undefined) ? moment(row?.date_range?.range_date_start).utc(false).format('DD MMM YYYY') : ''} - {(row?.date_range?.range_date_start !== undefined) ? moment(row?.date_range?.range_date_end).utc(false).format('DD MMM YYYY') : ''}</CustomCell>
                  <CustomCell align="center">
                    <Button onClick={() => handleDownload(row)} disabled={(row?.s3_url?.bucket !== undefined && row?.s3_url?.key !== undefined && row?.s3_url?.bucket !== '' && row?.s3_url?.key !== '') ? false : true} variant="outlined" color="neutral" sx={{ marginRight: '8px' }} size="small">
                      Download
                    </Button>
                    <CustomDropDown2 handleRunClick={() => handleRun(row)} handleViewClick={() => handleView(row)} handleReportIssue={() => handleReportIssue(row)} handleDelClick={() => handleDelete(row)}></CustomDropDown2>
                    {/* <Button onClick={() => handleRun(row)} variant="outlined" color="neutral" size="small">
                                        More
                                    </Button> */}
                  </CustomCell></> :
                  <>
                    <CustomCell align="center">{row?.schedule_frequency}</CustomCell>
                    <CustomCell align="center">{(row?.last_delivered_date) ? moment(row?.last_delivered_date).utc(false).format('DD MMM YYYY - HH MM') : '--'}</CustomCell>
                    <CustomCell align="center">
                      {(row.email.length > 0) ? row.email.map((item, index) => {
                        return (
                          <span key={index}>{item}</span>
                        )
                      }) : '--'}</CustomCell>
                    <CustomCell align="center">
                      <Button onClick={() => handleDelete(row)} variant="outlined" color="neutral" sx={{ marginRight: '8px' }} size="small">
                        Remove
                      </Button>
                    </CustomCell>
                  </>
                }
              </CustomRow>
            ))}
          </TableBody>
        </Table>
        {route.reportsLoading && <Box sx={{ width: '100%', height: '100%', position: 'fixed', top: '100px', left: '0', background: 'rgb(0 0 0 / 17%)', display: 'flex', justifyContent: 'center' }}><CircularProgress disableShrink size="5rem" sx={{ marginTop: '100px' }} color="success" /></Box>}

      </TableContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <TablePagination
          key={data.key}
          component="div"
          count={tableDataCount}
          page={paginationMap.currentPage}
          rowsPerPage={paginationMap.rowsPerPage}
          rowsPerPageOptions={paginationMap?.rowsPerPageOption}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            margin: "10px 0 20px"
          }}
        />

      </Box>
    </div>
  )
}

export default TableComponent;

