import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CheckBox(props) {
  const [checked, setChecked] = React.useState(props.isChecked);

  const handleChange = (event) => {
    if(checked){
      props.onUncheck();
    }else {
      props.onCheck();
    }
    setChecked(event.target.checked);
  };

  return (
    <div>
      <FormControlLabel
      sx={{fontSize:'12px', fontWeight:'400', fontFamily: 'Roboto !important'}}
        control={
          <Checkbox
            checked={checked}
            disabled={props.disabled}
            onChange={handleChange}
            size="small"
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{p:"4px 4px 4px 10px"}}
          />}
        label={props.label ? props.label : 'Check'}
      />
    </div>
  );
}
