import React from "react";
import { useState } from "react";
import { Paper ,Typography, Box, listItemTextClasses, styled} from "@mui/material";
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import NavItem from "./NavItems";
import { useSelector, useDispatch } from 'react-redux'
const StyledBox = styled(Box)(() => ({
  height: '100%',
  overflowY:'auto',
  overflowX:'inherit',
}))
const Nav = () => {
  const route = useSelector(state => state.route);
  let listItems = route.jsonData?.items;
  const [items, setItems] = useState(listItems);

  const filter = (e) => {
    const keyword = e.target.value;
    if (keyword !== '') {
      const results = listItems.filter((item) => {
        return item.title.toLowerCase().includes(keyword.toLowerCase());
      });
      setItems(results);
    } else {
      setItems(listItems);
    }
  };
  return (
    <Box sx={{
      padding: '24px 16px 24px 32px',
      boxShadow: 'inset -1px 0px 0px rgba(0, 0, 0, 0.1)',
      borderRadius: '0',
      height:'inherit',
      background: '#FAFAFA',
      boxSizing: 'border-box',
      position: 'sticky',
      top: '0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="reportDisplay" component="div" >Report</Typography>
      <Typography variant="reportDisplayText" component="div" sx={{mb:'10px'}}>Access or Generate reports you need</Typography>
      <Paper
        variant="outlined"
        component="form"
        sx={{ p: '8px 16px', display: 'flex', alignItems: 'center', m: '8px 0' }}
      >
        <IconButton type="submit" sx={{ p: 0 ,width:'14px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize:'14px', lineHeight: '24px' }}
          placeholder="Search"
          inputProps={{ 'aria-label': 'Search' }}
          onChange={filter}
          type="search"
          className="input"
        />
      </Paper>
      <StyledBox>
        {items && items.length > 0 ? (
          items.map((item,i) => {
            return (
              <NavItem
                key={i}
                item={item}
              />
            )
          })
        ) : (
          <h4>No results found!</h4>
        )}
      </StyledBox>
    </Box>
  )}
export default Nav;
