import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function DatePicker(props) {
    // const [value, setValue] = React.useState('');
    const handleChange = (newValue) => {
        // setValue(newValue);
        // console.log('New Value: ', newValue);
        props?.formikProps?.setFieldValue(props.tag, newValue);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
                <DesktopDatePicker
                    label={props.label ? props.label : 'Select your prefererd date'}
                    inputFormat="MM/dd/yyyy"
                    value={props?.formikProps?.values[props.tag]}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
        </LocalizationProvider>
    );
}
