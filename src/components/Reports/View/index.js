import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import InputView from "../../ui-components/InputView";
import { useSelector } from 'react-redux';
import { List, ListItem, Grid, ListItemText, Box } from '@mui/material';
import moment from 'moment';

const p_style = {
  margin: '10px 0 0 0',
  color: '#626262',
  fontSize: '14px',
}

const list_style = {
  maxHeight: '200px',
  overflowY: 'scroll',
  height: 'auto',
  maxWidth: '397px',
  background: '#ccc',
  width: '100%',
  border: '0.5px solid #CCCCCC',
  background: '#FAFAFA',
  borderRadius: '2px',
  marginTop: '10px'
}

const ViewConfig = ({ data }) => {

  const form = useSelector((state) => state.form);
  const [location, setLocation] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setLocation((data.filters.clinic.all) ? form.clinic : data.filters.clinic.selected);
    setFields(data.projection_fields.selected);
  }, [])

  return (
    <Box sx={{ height: 'inherit', overflowY: 'scroll', padding: '0 2rem 3rem 2rem' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ width: '100%' }}>
          <Typography variant="reportTitle" component="div" >Report Name</Typography>
          <InputView
            sx={{ maxWidth: '397px', width: '100%' }}
            name={"title"}
            label={"Report Name"}
            value={data.title} />

        </Grid>
        <Grid item xs={12} md={6} sx={{ width: '100%' }} >
          <Typography variant="reportTitle" component="div" >Classification</Typography>
          <InputView
            sx={{ width: '100%', maxWidth: '397px' }}
            name={"classfication"}
            label={"Classification"}
            value={data.classification} />

        </Grid>
      </Grid>
      <Typography variant="reportTitle" component="div" >Report Date Range</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ width: '100%' }} >
          <p style={{ ...p_style }}>From Date</p>
          <InputView
            styless={{ marginTop: 0 }}
            name={"dateStart"}
            label={"From Date"}
            value={moment(data.date_range.range_date_start).utc(false).format('DD MMM YYYY')} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: '100%' }} >
          <p style={{ ...p_style }}>To Date</p>
          <InputView
            styless={{ marginTop: 0 }}
            name={"dateEnd"}
            label={"To Date"}
            value={moment(data.date_range.range_date_end).utc(false).format('DD MMM YYYY')} />
        </Grid>
      </Grid>

      <Grid container spacing={2} >
        <Grid item xs={12} md={6} sx={{ width: '100%' }} >
          <Typography variant="reportTitle" component="div" >For Office / Location</Typography>
          <List dense={false} sx={{ ...list_style }}>
            {location.map((i, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText
                    primary={i.clinic_name}
                  />
                </ListItem>)
            }
            )}
          </List>
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: '100%' }} >
          <Typography variant="reportTitle" component="div" >Data Included in the report</Typography>
          <List dense={false} sx={{ ...list_style }}>
            {fields.map((i, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText
                    primary={i.value}
                  />
                </ListItem>)
            }
            )}
          </List>

        </Grid>
      </Grid>


    </Box>
  )
}

export default ViewConfig;
