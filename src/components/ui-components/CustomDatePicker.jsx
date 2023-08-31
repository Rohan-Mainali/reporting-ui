import * as React from 'react';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';

export default function CustomDatePicker(props) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper
                component=""
                sx={{
                    m: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    width: 400,
                    boxShadow: 0,
                    border: "0.5px solid #CCCCCC",
                    background: '#FAFAFA',
                    borderRadius: '2px',
                }}
            >
                <DatePicker
                    fullScreen
                    label="Custom input"
                    keyboard={true}
                    value={props?.formikProps?.values[props.tag]}
                    onChange={(newValue) => {
                        props?.formikProps?.setFieldValue(props.tag, newValue);
                    }}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                        <InputBase
                            ref={inputRef}
                            // type={"date"}
                            endAdornment={(
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                    {InputProps?.endAdornment}
                                </div>
                            )}
                            sx={{ ml: 1, flex: 1, padding: '7px 5px' }}
                            id={props?.tag}
                            name={props?.tag}
                            variant="outlined"
                            value={props?.formikProps?.values[props.tag]}
                            onChange={props?.formikProps?.handleChange}
                            {...inputProps}
                            placeholder={props.placeholder ? props.placeholder : 'dd/mm/yyyy'}
                        />
                    )}
                />
            </Paper>
        </LocalizationProvider>
    );
}
