import React from 'react'
import { TableCell , tableCellClasses, Box, styled } from '@mui/material';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f2f2f2',
      color: '#333',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

const CustomCell = (props) => {
    
    return (
        <CustomTableCell>
            {(props?.icon !== '') ?
                <Box sx={{display:'flex'}}>
                    {props.icon}
                    <Box sx={{...props.sx}}>
                        {props.children}
                    </Box>
                </Box> : 
                <>{props.children}</>
            }
        </CustomTableCell>
    )
}

export default CustomCell