import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Paper, styled } from "@mui/material";

export function PopOver({ title, features, label, animation, children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // const Popover = styled(Paper)((props) => ({
  //   "& .MuiPaper-root": {
  //     marginTop: '8px',
  //     maxWidth: '397px',
  //     height: '100%',
  //
  //   },
  //
  // }))
  return (
    <div style={{ position: 'absolute', bottom: '5px', right: '16px' }}>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        {label}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div style={{ padding: '10px', background: '#00ad6f' }}>
          <Typography sx={{ width: '200px', color: 'white', background: '#00ad6f' }}>{title}</Typography>
        </div>
        <div style={{ padding: '10px' }}>
          <div className="children" style={{}}>
            {children}
          </div>

        </div>
      </Popover>
    </div>
  );
}
