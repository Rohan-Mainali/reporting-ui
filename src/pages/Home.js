import React, { useState } from "react"
import { MuiTheme } from "../Theme";
import Dashboard from "../components/Dashboard";
import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Snackbar, Stack,Box } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux'
import { setMode, setMarket, fetchJson, changePopAlert, fetchReports, getUser, getToken , changeSessionAlert } from '../redux/slices/routeSlice';
import { fetchSupplier, fetchManufacturer, fetchCategory, fetchClinic, recordUserID} from '../redux/slices/formSlice';
import {
  useParams,
  useSearchParams
} from "react-router-dom";
import Widget from "../components/Widget";
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function Home() {
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = React.useState({status: false, msg: ''});
	const form = useSelector(state => state.form);
	const route = useSelector(state => state.route);
    const [searchParams] = useSearchParams();
    const {market} = useParams();

	const dispatch = useDispatch();
	const handleClose = (event, reason) => {
	  if (reason === 'clickaway') {
		return;
	  }
	  setOpen({status: false, msg: ''});
	}

	const handleCloseJson = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		dispatch(changePopAlert(false))
	}

	const handleCloseSession = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		  }
		  dispatch(changeSessionAlert(false))
	}

	React.useEffect(() => {
		(form.popAlert !== "") && setOpen({status: true, msg: form.popAlert});
	}, [form.popAlert])

	React.useEffect(() => {
        if( market !== undefined ) { dispatch(setMarket(market)) }
		dispatch(fetchJson())
	}, [])

	React.useEffect(() => {
		if( Object.keys(route.jsonData).length > 0 ) {
			if( route?.jsonData?.userSession ) {
				dispatch(getToken())
				dispatch(setMode('prod'))
			} else {
				dispatch(setMode('dev'))
				dispatch(getUser(searchParams.get('userID')))
				// dispatch(recordUserID(params.get('userID')))

			}
			// dispatch(fetchJson())
			// dispatch(fetchSupplier())
			// dispatch(fetchManufacturer())
			// dispatch(fetchCategory())
			// dispatch(fetchClinic())
		}
	}, [route.jsonData])

	React.useEffect(() => {
			if( route.token !== '') {
				dispatch(fetchReports())
				dispatch(fetchCategory())
				dispatch(fetchClinic({ userId: route.user.userId, token: route.token }))
			}		
	},[route.token])

	React.useEffect(() => {
			if( Object.keys(route.user).length > 0 ) {
				dispatch(fetchReports())
				dispatch(fetchCategory())
				dispatch(fetchClinic({ userId: route.user.userId, token: route.token })) 
			}		
	},[route.user])

	React.useEffect(() => {
		let arr = Object.values(form.loading).map((i) => i );
		arr.push(route.loading);
		if (arr.every(v => v === false)) { 
			setLoading(false)
		}
	}, [form.loading,route.loading])

  return (
    <MuiTheme>

		{ (loading) && <Box sx={{width:"100%",zIndex:'3', position:'absolute', top: '0', left: '0', filter:'blur(20)',background:'rgba(0,0,0,.2)',height: '100vh', display:'flex', alignItems:'center', justifyContent: 'center'}}><CircularProgress  disableShrink  size="5rem" color="success" /></Box>}
		<Dashboard />
		<Widget/>
		<Stack spacing={2}>
		<Snackbar open={open.status} anchorOrigin={{vertical: 'top',horizontal:'center'}} autoHideDuration={6000} onClose={handleClose}>
			<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
				Could not get {open.msg}
			</Alert>
		</Snackbar>
		<Snackbar open={route.popAlert} anchorOrigin={{vertical: 'top',horizontal:'right'}} autoHideDuration={6000} onClose={handleCloseJson}>
			<Alert onClose={handleCloseJson} severity="error" sx={{ width: '100%' }}>
				Could not get JSON DATA
			</Alert>
		</Snackbar>
		<Snackbar open={route.sessionAlert} anchorOrigin={{vertical: 'top',horizontal:'right'}} autoHideDuration={6000} onClose={handleCloseSession}>
			<Alert onClose={handleCloseSession} severity="error" sx={{ width: '100%' }}>
				Could not get User Session
			</Alert>
		</Snackbar>
		</Stack>
    </MuiTheme>
  );
}

export default Home;
