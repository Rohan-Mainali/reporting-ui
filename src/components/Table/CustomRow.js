import React from 'react'
import { Grid, styled } from '@mui/material'
import TableRow from '@mui/material/TableRow';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#F5F6F6',
    marginLeft: '-100px',
    '&:nth-of-type(odd)': {
      backgroundColor: '#F5F6F6',
    },
  }));

const CustomRow = (props) => {

    return (
        <StyledTableRow>
            {props.children}
        </StyledTableRow>
    )
}

export default CustomRow;