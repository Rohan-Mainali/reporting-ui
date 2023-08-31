
import React from "react"
import { Paper ,Typography, Box, Grid, styled} from "@mui/material";
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { textTransform } from "@mui/system";
import { useDispatch } from "react-redux";
import { recordRoute } from '../../../redux/slices/routeSlice';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useSelector } from "react-redux";

const StyledBox = styled(Box)(() => ({
    transition: 'all .35s ease-out',
    padding: '16px 0',
    borderBottom: "0.5px solid #CCCCCC", 
    cursor: 'pointer',
    '&.ItemActive' : {
        // transform: 'scale(1.1)',
        background:'#f7f7f7 !important',
        boxShadow: '-5px 0 5px #c7c7c7',
        padding: '16px 20px',
        borderRadius: '5px',
        // borderRadius: '5px 0 0 5px',
    mozBoxShadow: 'inset 0 5px 13px #d5d5d5',
    webkitBoxShadow: 'inset 0 5px 13px #d5d5d5',
    // boxShadow: 'inset 0 0 13px #d5d5d5',
    boxShadow: 'inset 0px 5px 13px #d5d5d5',
    // boxShadow: 'inset 0px 5px 13px #bfbfbf',
        border: 'none',
        transition: 'all .35s ease-in'
    },
    '&:hover' : {
        background: '#fff',
        borderColor: '#000'
    }
  }));

const NavItem = ({item}) => {
    const route = useSelector((state) => state.route)
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(recordRoute(item));
    }

    return (
        <div onClick={handleClick} >
            <StyledBox className={(route.activeItem.title === item.title) ? 'ItemActive' : ''}>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant="reportTitle" component="div" sx={{m:'8px 0'}} >{item.title}</Typography>
                        <Typography variant="reportTitleText" component="div" >{item.desc}</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{justifyContent: 'center',display: 'flex',alignItems: 'center'}}>
                        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <KeyboardArrowRightIcon color={(route.activeItem.title === item.title) ? 'Green' : 'Grey'}/>
                        </Box>
                    </Grid>
                </Grid>
            </StyledBox>
        </div>
    )
}

export default NavItem;