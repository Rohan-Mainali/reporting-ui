import React from "react"
import { Grid, Typography, Paper, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import Report from "../Reports";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TableComponent from "../Table";
import CloseIcon from '@mui/icons-material/Close';
import CustomDropDown from "../ui-components/CustomDropDown";
import { useSelector, useDispatch } from "react-redux";
import { showModal, recordRoute, showDialog, fetchReports } from "../../redux/slices/routeSlice";
import ViewConfig from "../Reports/View";
import NoContent from "./noContent";
import ReportIssueModal from "../Reports/Issue";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  height: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};
const view_style = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  height: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >{
        //{value === index && (
        //  <Box sx={{ p: 0 }}>
        //    <Box >{children}</Box>
        //  </Box>
        //)}
        <Box sx={{ p: 0 }}>
          <Box>{children}</Box>
        </Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    variant: 'tabs'
  };
}

const Dashboard = () => {
  const route = useSelector((state) => state.route);
  const modalShow = route.modalShow;
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [reports, setReports] = React.useState(false);
  const [scheduledReports, setScheduledReports] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(true);

  const reportModal = (toggle) => { return { show: toggle, type: 'report' } }
  const handletChange = (event, newValue) => {
    setValue(newValue);
    handleRefresh(newValue)
  }
  const handleRefresh = (forceValue) => {
    const fetchFilters = ((forceValue ?? value) === 1) ? {
      page: route.pagination.scheduled.currentPage,
      limit: route.pagination.scheduled.rowsPerPage,
      type: "SCHEDULED"
    } :
      {
        page: route.pagination.reports.currentPage,
        limit: route.pagination.reports.rowsPerPage
      }
    dispatch(fetchReports(fetchFilters));
  }

  const handleItemClick = (item) => {
    dispatch(recordRoute(item));
    dispatch(showModal({ show: true, type: 'report', report_type: (value === 0) ? 'AD_HOC' : 'SCHEDULED' }));
  }

  let headers = ['DETAILS', 'GENERATED ON', 'DATE RANGE', 'ACTIONS'];
  let scheduled_headers = ['DETAILS', 'FREQUENCY', 'LAST DELIVERED ON', 'RECEIPENTS', 'ACTIONS'];
  const scheduled_data = {
    headers: scheduled_headers,
    type: 'SCHEDULED',
    body: route.scheduledReports,
  }
  const data = {
    headers: headers,
    type: 'DEFAULT',
    body: route.reports,
  }

  React.useEffect(() => {
    if (route.mode === 'dev') {
      (Object.keys(route.user).length > 0) ? setShow(true) : setShow(false)
    }

    if (route.mode === 'prod') {
      if (route.token !== '') { setShow(true) } else { setShow(false) };
    }
  }, [route.token, route.user])

  React.useEffect(() => {
    if (route.reports.dataCount) { setReports(route.reports.dataCount > 0) } else { setReports(false) };
    if (route.scheduledReports.dataCount) { setScheduledReports(route.scheduledReports.dataCount > 0) } else { setScheduledReports(false) };
  }, [route.reports, route.scheduledReports])

  return (
    <>
      <Box container>
        <Box sx={{
          padding: '24px 16px 0 32px',
          borderRadius: '0',
          background: '#fff',
          position: 'sticky',
          top: '0',
          zIndex: '1',
        }}>

          <Typography variant="reportDisplay" onClick={() => { window.location.href = "https://www.dentira.com" }} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} component="div" ><img src="/dentira-logo.svg" width={150} alt="image" />Reports</Typography>
          <Typography variant="reportTitleText" component="div" sx={{ mt: '8px' }}>Access or generate reports you want</Typography>

          <Grid container>
            <Grid item xs={8} >
              <Box sx={{ mt: '24px' }}>
                <Tabs
                  value={value}
                  onChange={handletChange}
                  textColor="primary"
                  indicatorColor="primary">
                  <Tab label="Previous Generated Reports" {...a11yProps(0)} />
                  <Tab label="Scheduled Reports" {...a11yProps(1)} />
                </Tabs>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
              <Button disabled={!show} onClick={handleRefresh} variant="contained" disableElevation color="success" sx={{ background: '#00AD6F', paddingLeft: '53px', paddingRight: '53px', marginRight: '10px', textTransform: 'none' }}>
                Refresh
              </Button>
              <CustomDropDown disable={!show} handleClick={handleItemClick} />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{
          padding: '0 16px 0 32px',
        }}>
          <TabPanel value={value} index={0}>
            {
              (!reports) ?
                <NoContent disable={!show} handleClick={() => dispatch(showModal({ show: true, type: "report", report_type: 'AD_HOC' }))} /> :
                <TableComponent key={1} data={data} />
            }
          </TabPanel>
          <TabPanel value={value} index={1}>
            {(!scheduledReports) ?
              <NoContent disable={!show} handleClick={() => dispatch(showModal({ show: true, type: "report", report_type: 'SCHEDULED' }))} /> :
              <TableComponent key={2} data={scheduled_data} />
            }
          </TabPanel>
        </Box>

        {modalShow.show &&

          <Modal
            open={modalShow.show}
            onClose={() => dispatch(showModal({ show: false, type: "report" }))}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={(modalShow.type === 'report') ? { ...style } : { ...view_style }}>
              <Paper sx={{ height: '75px' }}>
                <Typography sx={{
                  fontSize: '18px', fontWeight: '500', p: '24px', boxShadow: 'inset 0px -0.5px 0px #CCCCCC',
                  borderRadius: '4px'
                }} component="div">{(modalShow.type === 'report') ? 'Generate Or Schedule New Report' : (modalShow.type === 'issue') ? 'Report an Issue' : 'Report Config'}</Typography>
                <CloseIcon onClick={() => dispatch(showModal({ show: false, type: "report", report_type: "AD_HOC" }))} sx={{ position: 'absolute', right: '20px', top: '20px', cursor: 'pointer' }} />
              </Paper>
              {(modalShow.type === 'report') ?
                <Report /> :
                modalShow.type === 'issue' ? <ReportIssueModal data={modalShow.value} closeModal={() => { setModalVisible(false); dispatch(showModal({ show: false })) }} /> :
                  <ViewConfig data={modalShow.value} />
              }
            </Box>
          </Modal>
        }

        <Dialog
          open={route.dialogShow}
          onClose={() => { dispatch(fetchReports()); dispatch(fetchReports({ type: "SCHEDULED" })); dispatch(showDialog(false)) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Request Received"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span style={{ width: '100%' }}>We’re working on collecting the data, we will mail you a link to download the same once its ready.</span>
              <span>The report will also be accessible on the ‘Previously Generated Reports’ tab for future references</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(showDialog(false))} variant="contained" disableElevation color="success" sx={{ background: '#00AD6F', paddingLeft: '53px', paddingRight: '53px', textTransform: 'none' }}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Dashboard;


