import React, { useState, useRef } from 'react'
import { Button, List, ListItem, ListItemButton, Paper, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSelector } from 'react-redux';

const PaperDropDown = styled(Paper)(() => ({
    position:'absolute',
    width: '100%',
    right: '0',
    minWidth: '250px',
    border: '1px solid #EAEAEA',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.25)',
    borderRadius: '4px',
    zIndex: 4,
    "&:after" : {
        content: '""',
        display: 'block',
        width: '0',
        height: '0', 
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderBottom: '12px solid white',
        position: 'absolute',
        right:'52px',
        top:'-12px'
    },
    "& .MuiListItem-root": {
        padding: '0 16px 0 16px',
        "& .MuiListItemButton-root" : {
            padding: '16px 0 16px 0',
            borderBottom: '1px solid #EAEAEA',
            transition: 'all .5s ease-in-out',
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

const CustomDropDown = (props) => {
    const route = useSelector((state) => state.route);
    const items = route.jsonData.items;
    const [show, setShow] = useState(false);
    const ref = useRef();

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setShow(false);
        }
      };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
    },[])
    return (
        <Box ref={ref} sx={{position: 'relative'}}>
            <Button disabled={props.disable} onClick={() => setShow(prev => !prev)} variant="contained" disableElevation color="success" sx={{background:'#00AD6F',paddingLeft:'53px',paddingRight:'53px',textTransform:'none !important'}}>
                  New Report
                  { (!show) ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </Button>
            {show && 
            <PaperDropDown>
                <List>
                    {
                        items.map((item,index) => (
                            <ListItem key={index} disablePadding onClick={() => props.handleClick(item)}>
                                <ListItemButton>
                                    <Typography variant="reportDisplayTextRoboto">{item.title}</Typography>
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </PaperDropDown>
            }
        </Box>
    )
}

export default CustomDropDown;