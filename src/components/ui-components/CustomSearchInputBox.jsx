import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export default function CustomSearchInput(props) {
    let timeOut = null;

    const handleChange = (e) => {
        props.formikProps.setFieldValue(props.tag, e.target.value);
    }
    const handleDebouncedChange = (e) => {
        window.clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            props.formikProps.setFieldValue(props.tag, e.target.value);
        }, 500)
    }

    return (
        <Paper
            component=""
            sx={{ 
                m: '10px 0', 
                display: 'flex', 
                alignItems: 'center', 
                width: 254,
                height: 40, 
                boxShadow: 0, 
                border: "0.5px solid #CCCCCC",
                background: '#FAFAFA',
                borderRadius: '2px',
                padding: '0'
            }}
        >
            <IconButton sx={{ p: '5px 0 5px 12px' }} aria-label="menu">
                <SearchOutlinedIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1, fontSize: '14px',fontWeight: '400', fontFamily: 'Roboto !important'}}
                placeholder={props.placeholder ? props.placeholder : "Placeholder"}
                inputProps={{ 'aria-label': 'search your query' }}
                onChange={(e) => props.debounced ? handleDebouncedChange(e) : handleChange(e)}
            />
        </Paper>
    );
}
