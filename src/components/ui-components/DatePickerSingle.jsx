import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import moment from 'moment';

export default function DatePickerSingle(props) {
  const [value, setValue] = React.useState(new Date(props.formikProps.values[props.tag]));
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Stack spacing={3}>
		<LocalizationProvider dateAdapter={AdapterDateFns}>
  		  <Paper
  		    component=""
  		    sx={{
  		      m: '10px 0px 0px 0',
  		      display: 'flex',
  		      alignItems: 'center',
  		      width: '248px',
  		      height: 40,
  		      boxShadow: 0,
  		      border: "0.5px solid #CCCCCC",
  		      background: '#FAFAFA',
  		      borderRadius: '2px',
  		    }}
  		  >
  		    <DatePicker
  		      fullScreen
  		      label="Custom input"
  		      disablePast
  		      keyboard={true}
  		      value={value}
  		      onChange={(newValue) => { 
		        let set = new Date(newValue);
                let currentDate = set.getFullYear() + '-' + ( set.getMonth() + 1) + '-' + set.getDate();
  		  		props?.formikProps?.setFieldValue(props.tag, currentDate);
  		  		setValue(newValue)
  		  	}
  		  	}
  		      renderInput={({ inputRef, inputProps, InputProps }) => (
  		        <InputBase
  		          ref={inputRef}
  		          // type={"date"}
  		          endAdornment={(
  		            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
  		              {InputProps?.endAdornment}
  		            </div>
  		          )}
  		          sx={{ ml: 1, flex: 1, padding: '7px 5px', fontSize: '12px', fontWeight: '500' }}
  		          id={props?.tag}
  		          name={props?.tag}
  		          variant="outlined"
  		          value={props?.formikProps?.values[props.tag]}
  		          onChange={props?.formikProps?.handleChange}
  		          {...inputProps}
  		          placeholder={props.placeholder}
  		        />
  		      )}
  		    />
  		  </Paper>
  		</LocalizationProvider>
        </Stack>
    </div>
  );
}
