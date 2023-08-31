import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function MuiButtons(props) {
  return (
      <Button variant="contained" type='submit'>{props.label ? props.label : 'Submit'}</Button>
  );
}