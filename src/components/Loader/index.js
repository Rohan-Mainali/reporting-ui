import { Box } from "@mui/system"
import CircularProgress from "@mui/material/CircularProgress"

export default CustomLoader = () => {

    return (
        <Box sx={{width:'100%',height:'100vw'}}>
            <CircularProgress color="success" />
        </Box>
    )
}