import * as React from 'react';
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import moment from 'moment';

const CustomPicker = (props) => {
const [value, setValue] = React.useState(new Date(props.formikProps.values.date_range[props.tag]));
  
return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Paper
      component=""
      sx={{
        m: '10px 8px 10px 0',
        display: 'flex',
        alignItems: 'center',
        width: 144,
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
        keyboard={true}
        value={value}
        disableFuture={!props?.future}
        onChange={(newValue) => {

		    let set = new Date(newValue);
        let currentDate = set.getFullYear() + '-' + ( set.getMonth() + 1) + '-' + set.getDate();
        props?.formikProps?.setFieldValue("date_range", { ...props.formikProps.values.date_range, [props.tag]: currentDate });
			setValue(newValue)}
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
            value={props?.formikProps?.values.date_range[props.tag]}
            onChange={props?.formikProps?.handleChange}
            {...inputProps}
            placeholder={props.placeholder}
          />
        )}
      />
	{ /* <DatePicker
        fullScreen
        label="Custom input"
        //keyboard={true}
        //disableFuture={!props?.future}
        value={value}
        onChange={(newValue) => {
		console.log( newValue.getTimezoneOffset());
		let tzoffset = newValue.getTimezoneOffset() * 60000; //offset in milliseconds
		let localISOTime = new Date(newValue.setHours(0,0,0,0) - tzoffset).toISOString();
        console.log(localISOTime)
		props?.formikProps?.setFieldValue("date_range", { ...props.formikProps.values.date_range, [props.tag]: localISOTime });
		console.log(props.formikProps.values.date_range[props.tag])
			setValue(localISOTime)
			//props?.formikProps?.setFieldValue("date_range", { ...props.formikProps.values.date_range, [props.tag]: moment(newValue).utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString() });
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
            sx={{ ml: 1, flex: 1, padding: '7px 5px', fontSize: '12px', fontWeight: '500' }}
            id={props?.tag}
            name={props?.tag}
            variant="outlined"
            value={props?.formikProps?.values.date_range[props.tag]}
            onChange={props?.formikProps?.handleChange}
            {...inputProps}
            placeholder={props.placeholder}
          />
        )}
      /> */ }
    </Paper>
  </LocalizationProvider>
)
}

export default function DatePickerRange(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Stack spacing={3}>
          <CustomPicker 
            tag={props.tag[0]} 
            formikProps={props.formikProps}
            placeholder={"Start Range"}
            future={false}
          />
        </Stack>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3}>
          <CustomPicker 
            tag={props.tag[1]} 
            formikProps={props.formikProps}
            placeholder={"End Range"}
            future={false}
          />
        </Stack>
      </LocalizationProvider>
    </div>
  );
}
