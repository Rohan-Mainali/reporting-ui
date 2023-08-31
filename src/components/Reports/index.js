import React from "react"
import { Grid, Paper , styled, Typography} from "@mui/material";
import Nav from "./Navigation";
import ReportContent from "./Content";

// const Item = styled(Paper)(({ theme }) => ({
//     // ...theme.typography.body2,
//     padding: '24px 16px 24px 32px',
//     boxShadow: 'inset -1px 0px 0px rgba(0, 0, 0, 0.1)',
//     borderRadius: '0',
//     height:'100%',
//     minHeight: '100vh'
//   }));

const Report = () => {

 return (
     <>
    <Grid container sx={{height: 'calc(100% - 75px)'}}>
        <Grid item xs={4} sx={{height: '100%'}}>
          <Nav/>
        </Grid>
        <Grid item xs={8}>
            <ReportContent />
            {/* { !test ? "Loading." : test} */}
        </Grid>
      </Grid>
     </>
 )
}

export default Report;