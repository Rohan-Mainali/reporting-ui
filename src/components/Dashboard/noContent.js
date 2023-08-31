import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import NoReport from '../../assets/noreport.png';

const NoContent = ({disable,handleClick}) => {

    return (
        <Box sx={{display: 'flex',alignItems:'center',justifyContent:'center',flexDirection:'column', minHeight: '70vh'}} >
            <img src={NoReport} />
            <Typography variant="paragraph" component="div" sx={{maxWidth:'400px', textAlign:'center', mb:'24px',mt:'18px'}}>
            You have no previous reports, you can either generate a new report or schedule one for timely delivery . To generate/schedule a report click button below
            </Typography>
            <Button disabled={disable} onClick={() => handleClick()} variant="contained" disableElevation color="success" sx={{background:'#00AD6F',paddingLeft:'53px',paddingRight:'53px', textTransform:'none'}}>
            New Report
            </Button>
      </Box>
    )
}

export default NoContent;
