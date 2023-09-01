import React, { useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Input, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InputView from "../../ui-components/InputView";
import { useSelector } from 'react-redux';
import { List, ListItem, Grid, ListItemText, Box } from '@mui/material';
import moment from 'moment';
import uploadImg from '../../../assets/cloud_file_upload_server_icon_196427.png'
import style from '../../ui-components/styles/ImageInput.module.css'
import initApiRequest from '../../../api-config/helper/api-request';
import apiPoints from '../../../api-config/api-points';

const p_style = {
  margin: '10px 0 0 0',
  color: '#626262',
  fontSize: '14px',
}


const list_style = {
  maxHeight: '200px',
  overflowY: 'scroll',
  height: 'auto',
  width: '100%',
  border: '0.5px solid #CCCCCC',
  background: '#FAFAFA',
  borderRadius: '2px',
  marginTop: '10px'
}

const inputStyle = {
  widht: '100%',
  marginTop: '12px',
  border: '0.5px solid #CCCCCC',
  background: '#FAFAFA',
  borderRadius: '2px',
  padding: '7px 5px',
  color: '#636363',
}


const fieldHeading = {
  fontWeight: '500',
  fontSize: '16px'
}

const fieldSubHeading = {
  fontWeight: '400',
  fontSize: '12px',
  color: '#6b6b6b'
}
const tableStyle = {
  width: '100%',
  padding: '18px',
  marginTop: '18px',
  borderRadius: '10px',
  border: '1px solid  #dbdbdb ',
}
const ReportIssueModal = ({ data, alert, closeModal }) => {

  const form = useSelector((state) => state.form);
  const [location, setLocation] = useState([]);
  const [fields, setFields] = useState([]);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleFileUpload = (event) => {
    const inputFiles = event.target.files;
    const fileSizeThreshold = 100 * 1024 * 1024;
    for (const file of inputFiles) {
      if (file.size <= fileSizeThreshold) {
        setFiles(prevFiles => [
          ...prevFiles,
          {
            id: Date.now(),
            name: file.name,
            size: file.size,
            file: file,
          }
        ]);
      } else {
        setError('Please upload file below 100MB')
      }
    }
  };

  const handleDeleteFile = (id) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      let formData = new FormData();
      formData.append('description', description)
      for (const file of files) {
        formData.append('files', file.file);
      }
      let baseURL = process.env.REACT_APP_BACKEND_ENDPOINT
      const response = await fetch(`${baseURL}${apiPoints.reports.reportIssue.url}${data._id}`, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 200) {
        setDescription('')
        setFiles([])
        closeModal()
      } else {
        setError('Could not submit your issue')
      }
    } catch (err) {
      setError('Could not submit your issue')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    setLocation((data.filters.clinic.all) ? form.clinic : data.filters.clinic.selected);
    setFields(data.projection_fields.selected);
  }, [])

  return (
    <Box sx={{ height: 'inherit', overflowY: 'scroll', padding: '0 2rem 3rem 2rem' }}>
      {error &&
        <div width={'100%'}>
          <Alert severity="error">
            {error}
          </Alert>
        </div>
      }
      <div style={{ display: 'flex', fontFamily: 'Roboto', marginTop: '10px', justifyContent: 'space-between' }}>

        <form style={{ width: '48%' }} onSubmit={handleSubmit}>
          <div className='interactive' style={{ width: '100%' }}>
            <TextField
              label="Describe your issue"
              name="description"
              multiline
              rows={4}  // You can adjust the number of rows here
              variant="outlined"
              onChange={(e) => { setDescription(e.target.value) }}
              fullWidth
            />
            <div className={style.parent}>
              <div className={style.fileUpload}>
                <img width={90} src={uploadImg} alt="upload" />
                <h3 style={{ margin: '0px' }}>Upload Additional Files</h3>
                <p className={style.fileUploadLabel}>Maximun file size 100MB</p>
                <input name="files" onChange={handleFileUpload} type="file" className={style.fileUploadInput} />
              </div>
            </div>
            {files.length > 0 && (
              <div >
                <table style={{ ...tableStyle }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', fontWeight: '500' }}>File Name</th>
                      <th style={{ textAlign: 'left', fontWeight: '500' }}>Size</th>
                      <th style={{ textAlign: 'left', fontWeight: '500' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id}>
                        <td>{file.name}</td>
                        <td>{Math.round(file.size / 1024)} KB</td>
                        <td>
                          <button onClick={() => handleDeleteFile(file.id)} style={{ border: 'none', background: 'white', cursor: 'pointer' }}>
                            <DeleteIcon
                              sx={{
                                color: "#ff5d5d",
                              }}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}

            <Button type="submit" disabled={!description} variant="contained" disableElevation color="success" sx={{ background: '#00AD6F', marginTop: '20px', paddingLeft: '53px', paddingRight: '53px', marginRight: '10px', textTransform: 'none' }}

            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Submit'
              )}
            </Button>

          </div>
        </form>
        <div className='information' style={{ width: '48%', gap: '12px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ ...fieldHeading }}>Report Issue</label>
            <span style={{ ...inputStyle }}>{data.title}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ ...fieldHeading }}>Classification</label>
            <span style={{ ...inputStyle }}>{data.classification}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ ...fieldHeading }}>Report Date Range</label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <label style={{ ...fieldSubHeading }}>From Date</label>
                <span style={{ ...inputStyle }}>
                  {moment(data.date_range.range_date_start).utc(false).format('DD MMM YYYY')}
                </span>

              </div>

              <div style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <label style={{ ...fieldSubHeading }}>To Date</label>
                <span style={{ ...inputStyle }}>
                  {moment(data.date_range.range_date_end).utc(false).format('DD MMM YYYY')}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label variant="reportTitle" component="div" style={{ ...fieldHeading }}>Data Included in the report</label>
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
          </div>
        </div>
      </div>
    </Box >
  )
}

export default ReportIssueModal;
