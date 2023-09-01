import { Box } from "@mui/material";
import React from "react";
import { PopOver } from "../ui-components/PopOver";
import { PopUpWidgetData } from "../utils";

export default function Widget({ hide = false, hideAnimation = false }) {
  return (
    <>
      {!hide ? (
        <Box
          style={{
            position: "fixed",
            bottom: "80px",
            right: "40px",
            maxHeight: "200px",
          }}
        >
          <PopOver data={PopUpWidgetData} hideAnimation={hideAnimation} />
        </Box>
      ) : null}
    </>
  );
}
