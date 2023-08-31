import React, { useState, useRef } from 'react'
import { Button, List, ListItem, ListItemButton, Paper, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


const PaperDropDown = styled(Paper)(() => ({
    position:'absolute',
    width: '100%',
    right: '0',
    minWidth: '220px',
    border: '1px solid #EAEAEA',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.25)',
    borderRadius: '4px',
    zIndex: 4,
    marginTop: '12px',
    "&:after" : {
        content: '""',
        display: 'block',
        width: '0',
        height: '0', 
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderBottom: '12px solid white',
        position: 'absolute',
        right:'20px',
        top:'-12px'
    },
    "& .MuiList-root": {
        padding: '0'
    },
    "& .MuiListItem-root": {
        padding: '0 16px 0 16px',
        "& .MuiListItemButton-root" : {
            padding: '16px 0 16px 0',
            borderBottom: '1px solid #EAEAEA',
            transition: 'all .5s ease-in-out',
            "&.redItem:hover": {
                background: 'linear-gradient(85deg, transparent,rgb(227 57 70 / 15%), transparent, transparent)',
                transition: 'all .5s ease-in-out',
            },
            "&:hover": {
                background: 'linear-gradient(85deg, transparent,rgb(169 235 211 / 42%), transparent, transparent)',
                transition: 'all .5s ease-in-out',
            }
        },
        "&:last-child .MuiListItemButton-root" : {
            padding: '16px 0 16px 0',
            borderBottom: 'none'
        }
    },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const CustomDropDown2 = (props) => {
    const route = useSelector((state) => state.route);
    const [show, setShow] = useState(false);
    const ref = useRef();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const deleteClose = (funcs) => {
        funcs();
        setOpen(false);
    }
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setShow(false);
        }
      };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
    },[])
    return (
        <Box ref={ref} sx={{position: 'relative', display: 'inline'}}>
            <Button  onClick={() => setShow(prev => !prev)} variant={(!show) ? 'outlined' : 'contained'} color="neutral" size="small" disableElevation >
                  More
                  {/* { (!show) ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />} */}
            </Button>
            {show && 
            <PaperDropDown>
                <List>
                    <ListItem disablePadding onClick={() => props.handleRunClick()}>
                        <ListItemButton>
                            <Typography variant="reportDisplayTextRoboto">Rerun Report for current data</Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding onClick={() => props.handleViewClick()}>
                        <ListItemButton>
                            <Typography variant="reportDisplayTextRoboto">Report Config</Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding onClick={handleClickOpen} >
                        <ListItemButton className="redItem" >
                            <Typography variant="reportDisplayTextRoboto" sx={{color:'#E33946'}}>Delete Report</Typography>
                        </ListItemButton>
                    </ListItem>
                </List>
            </PaperDropDown>
            }
             <Dialog
                fullWidth
                maxWidth="xs"
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle>{"This will permanently delete the generated report. Continue?"}</DialogTitle>
                <DialogActions>
                <Button onClick={() => deleteClose(props.handleDelClick)}>Yes</Button>
                <Button onClick={handleClose}>No</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CustomDropDown2;