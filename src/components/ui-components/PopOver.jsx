import { Close } from "@mui/icons-material";
import { Box } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { PopOverItem } from "./PopOverItem";
import style from "./styles/PopOver.module.css";

export function PopOver({ data, hideAnimation }) {
  const { title = "", btnLabel = "", items = [] } = data;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box>
      <Box
        onClick={handleClick}
        className={hideAnimation ? style.hidePopover : style.popover}
      >
        <Typography>{btnLabel}</Typography>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        style={{
          margin: "-16px 0 0 -16px",
        }}
      >
        <Box
          width={350}
          height={500}
          style={{
            overflow: "hidden",
          }}
        >
          <Box
            style={{
              padding: "10px",
              background: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="reportTitle" color={"white"}>
                {title}
              </Typography>
            </Box>
            <Box onClick={handleClose}>
              <Close
                style={{
                  color: "white",
                  backgroundColor: "primary",
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
          <Box
            style={{
              maxHeight: "calc(100% - 50px)",
              overflowY: "auto",
            }}
          >
            <Box
              style={{
                padding: "20px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                overflowY: "scroll",
              }}
            >
              {items.length
                ? items.map((item, idx) => (
                    <PopOverItem key={idx} data={item} />
                  ))
                : null}
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
