// import { Button } from "@mui/material";

// const ImportButton = ({ onFileSelect }) => {
//   return (
//     <Button variant="outlined" component="label">
//       Import Excel
//       <input
//         type="file"
//         hidden
//         accept=".xlsx,.xls"
//         onClick={(e) => { e.target.value = null; }}
//         onChange={(e) => onFileSelect(e.target.files[0])}
//       />
//     </Button>
//   );
// };

// export default ImportButton;


import { Tooltip, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const ImportButton = ({ onFileSelect }) => {
  return (
    <Tooltip title="Import Excel">
      <IconButton color="primary" component="label">
        <UploadFileIcon />
        <input
          type="file"
          hidden
          accept=".xlsx,.xls"
          onClick={(e) => { e.target.value = null; }}
          onChange={(e) => onFileSelect(e.target.files[0])}
        />
      </IconButton>
    </Tooltip>
  );
};

export default ImportButton;

