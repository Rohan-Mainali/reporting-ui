import * as React from 'react';
import { useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { Typography, Alert, Snackbar } from '@mui/material';

export default function EmailBox(props) {
    const ref = useRef(null);
    const [open,setOpen] = useState(false);
    const route = useSelector((state) => state.route);
    const handleClose = () => {
        setOpen(false);
    }
    const handleChange = (e) => {
        // props.formikProps.setFieldValue(props.tag, e.target.value);
        let val = e.target.value.toString();
        let emails = val.replace(/\s+/g, '').split(",");
        props.formikProps.setFieldValue(props.tag, (emails[0] === '') ? [] : emails);

        // if ( validations ) {
        //     setOpen(false);
        //     props.formikProps.setFieldValue(props.tag, emails);
        // } else {
        //     setOpen(true);
        //     let err = {};
        //     err[props.tag] = "Email is wrong";
        //     props.formikProps.setFieldError(props.tag,"jhgjg gjg")
        //     props.formikProps.setFieldValue(props.tag, [])
        // }
    }

    useEffect(() => {
        // ref.current.value = ""
    },[route.activeItem])

    // const validateEmail = (email) => {
    //     return email.match(
    //         /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //     );
    // };

    return (<>
        <Paper
            component=""
            sx={{ 
                m: '10px 0', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start', 
                width: 397, 
                boxShadow: 0, 
                border: "0.5px solid #CCCCCC",
                background: '#FAFAFA',
                borderRadius: '2px',
                padding: '7px 5px',
                position:'relative'
            }}
        >
            {
                props.innerLabel &&
                <Typography style={{
                    fontSize: '12px',
                    padding: '0 5px'
                }}>{props.innerLabel}</Typography>
            }
            <InputBase
                sx={{ flex: 1, width: '100%', padding: '0 5px', fontSize:'14px', fontWeight:'400' }}
                inputProps={{ 'aria-label': 'search' }}
                type={props.numeric ? "number" : "text"}
                id={props?.tag} 
                name={props?.tag} 
                label={props.label ? props.label : 'Placeholder'} 
                placeholder={props.label && props.label} 
                variant="outlined" 
                inputRef={ref}
                defaultValue={props?.formikProps?.values[props.tag]} 
                onChange={handleChange}
            />
        </Paper>
        </>
    );
}
