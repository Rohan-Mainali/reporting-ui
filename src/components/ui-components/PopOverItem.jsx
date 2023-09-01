import { Box, Link, Typography } from "@mui/material";

export const PopOverItem = ({ data }) => {
  const { title = "", description = "", link = "", linkTitle = "" } = data;
  return (
    <Box
      style={{
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
        padding: "10px",
        borderBottom: "1px solid 	#D3D3D3",
      }}
    >
      <Box>
        <Typography variant="reportDisplayTextRoboto" fontWeight={"bold"}>
          {title}
        </Typography>
      </Box>
      <Box
        style={{
          margin: "8px 0",
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Typography>{description}</Typography>
      </Box>
      {link && (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Link target="_blank" href={link}>
            {linkTitle || title}
          </Link>
        </Box>
      )}
    </Box>
  );
};
