import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { Typography } from '@mui/material';

export default function InputBox(props) {

    return (
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
                padding: '7px 5px'
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
                defaultValue={props?.formikProps?.values[props.tag]} 
                onChange={props?.formikProps?.handleChange}
            />
        </Paper>
    );
}
