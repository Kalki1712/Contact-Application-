import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Select, MenuItem, Alert, Box, Typography,
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, CircularProgress, Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ImportDialog = ({
  open, onClose, headers, mapping, setFieldMapping,
  rows, errors, importData, loading, FIELDS,
  allFieldsMapped, requiredFieldsMapped,
}) => {

  const usedColumns  = Object.values(mapping).filter(Boolean);
  const errorCount   = Object.keys(errors).length;
  const mappedCount  = Object.values(mapping).filter(Boolean).length;
  const totalFields  = FIELDS.length;

  // Import allowed only when all fields mapped and no errors
  const canImport = allFieldsMapped && errorCount === 0 && rows.length > 0 && !loading;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">

      <DialogTitle>
        Map Excel columns to contact fields
        {rows.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {rows.length} rows detected — map all {totalFields} fields to enable import
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>

        {/* No headers warning */}
        {headers.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No columns detected. Make sure your Excel file has headers in Row 1.
          </Alert>
        )}

        {/* Progress indicator */}
        {headers.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            {allFieldsMapped && errorCount === 0 ? (
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label="All fields mapped — ready to import"
                color="success"
                size="small"
                variant="outlined"
              />
            ) : (
              <Chip
                label={`${mappedCount} / ${totalFields} fields mapped`}
                color={mappedCount === totalFields ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* Field mapping rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {FIELDS.map((field) => {
            const isMapped = !!mapping[field.key];
            return (
              <Box
                key={field.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: isMapped ? "success.light" : field.required ? "error.light" : "divider",
                  backgroundColor: isMapped ? "rgba(46,125,50,0.04)" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                {/* Field label */}
                <Box sx={{ width: 130, flexShrink: 0 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {field.label}
                    {field.required && (
                      <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                        *
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {field.required ? "Required" : "Optional"}
                  </Typography>
                </Box>

                {/* Dropdown */}
                <Select
                  size="small"
                  fullWidth
                  value={mapping[field.key] || ""}
                  onChange={(e) => setFieldMapping(field.key, e.target.value)}
                  displayEmpty
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isMapped
                        ? "success.main"
                        : field.required
                        ? "error.light"
                        : undefined,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em style={{ color: "#999" }}>— skip —</em>
                  </MenuItem>

                  {headers.map((h) => {
                    const isUsedElsewhere =
                      usedColumns.includes(h) && mapping[field.key] !== h;
                    return (
                      <MenuItem key={h} value={h} disabled={isUsedElsewhere}>
                        {h}
                        {isUsedElsewhere && (
                          <Typography
                            component="span"
                            sx={{ ml: 1, fontSize: 11, color: "text.disabled" }}
                          >
                            (already mapped)
                          </Typography>
                        )}
                      </MenuItem>
                    );
                  })}
                </Select>

                {/* Mapped tick */}
                {isMapped && (
                  <CheckCircleOutlineIcon
                    fontSize="small"
                    sx={{ color: "success.main", flexShrink: 0 }}
                  />
                )}

              </Box>
            );
          })}
        </Box>

        {/* Not all fields mapped warning */}
        {headers.length > 0 && !allFieldsMapped && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Map all {totalFields} fields to enable the Import button.
          </Alert>
        )}

        {/* Validation errors */}
        {errorCount > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>
              {errorCount} row{errorCount > 1 ? "s have" : " has"} errors.
            </strong>{" "}
            Fix them in your Excel file and re-upload.
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              {Object.entries(errors).slice(0, 5).map(([rowIdx, errs]) => (
                <li key={rowIdx}>
                  <strong>Row {Number(rowIdx) + 2}:</strong> {errs.join(", ")}
                </li>
              ))}
              {errorCount > 5 && <li>...and {errorCount - 5} more rows</li>}
            </Box>
          </Alert>
        )}

        {/* Preview table */}
        {rows.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Preview (first 5 rows) — red rows have errors
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 240 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 40 }}>#</TableCell>
                    {FIELDS.map((f) => (
                      <TableCell key={f.key} sx={{ fontWeight: 600 }}>
                        {f.label}
                        {!mapping[f.key] && (
                          <Typography
                            component="span"
                            sx={{ fontSize: 10, color: "text.disabled", ml: 0.5 }}
                          >
                            (unmapped)
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(0, 5).map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        backgroundColor: errors[i]
                          ? "rgba(211,47,47,0.08)"
                          : "inherit",
                      }}
                    >
                      <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>
                        {i + 2}
                      </TableCell>
                      {FIELDS.map((f) => (
                        <TableCell key={f.key}>
                          {mapping[f.key] ? (
                            row[mapping[f.key]] ?? ""
                          ) : (
                            <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                              —
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={importData}
          variant="contained"
          disabled={!canImport}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            // Green when ready
            ...(canImport && {
              backgroundColor: "success.main",
              "&:hover": { backgroundColor: "success.dark" },
            }),
          }}
        >
          {loading
            ? "Importing..."
            : `Import${rows.length > 0 ? ` (${rows.length} rows)` : ""}`}
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default ImportDialog;













// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Select, MenuItem, Alert, Box, Typography,
//   Table, TableHead, TableRow, TableCell, TableBody,
//   TableContainer, Paper, CircularProgress,
// } from "@mui/material";

// const ImportDialog = ({
//   open, onClose, headers, mapping, setFieldMapping,
//   rows, errors, importData, getAllErrors, loading, FIELDS,
// }) => {

//   const usedColumns = Object.values(mapping).filter(Boolean);
//   const errorCount  = Object.keys(errors).length;

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">

//       <DialogTitle>
//         Map Excel columns
//         {rows.length > 0 && (
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//             {rows.length} select a column for each field below
//           </Typography>
//         )}
//       </DialogTitle>

//       <DialogContent dividers>

    
//         {headers.length === 0 && (
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             No columns detected. Make sure your Excel file has headers in Row 1.
//           </Alert>
//         )}

        
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
//           {FIELDS.map((field) => (
//             <Box
//               key={field.key}
//               sx={{ display: "flex", alignItems: "center", gap: 2 }}
//             >
//               {/* Field label */}
//               <Box sx={{ width: 130, flexShrink: 0 }}>
//                 <Typography variant="body2" fontWeight={500}>
//                   {field.label}
//                   {field.required && (
//                     <Typography component="span" color="error" sx={{ ml: 0.5 }}>
//                       *
//                     </Typography>
//                   )}
//                 </Typography>
//               </Box>

//               {/* Dropdown — all start as skip */}
//               <Select
//                 size="small"
//                 fullWidth
//                 value={mapping[field.key] || ""}
//                 onChange={(e) => setFieldMapping(field.key, e.target.value)}
//                 displayEmpty
//               >
//                 <MenuItem value="">
//                   <em>— skip —</em>
//                 </MenuItem>

//                 {headers.map((h) => {
//                   // disable if already selected by another field
//                   const isUsedElsewhere =
//                     usedColumns.includes(h) && mapping[field.key] !== h;
//                   return (
//                     <MenuItem key={h} value={h} disabled={isUsedElsewhere}>
//                       {h}
//                       {isUsedElsewhere && (
//                         <Typography
//                           component="span"
//                           sx={{ ml: 1, fontSize: 11, color: "text.disabled" }}
//                         >
//                           (already using)
//                         </Typography>
//                       )}
//                     </MenuItem>
//                   );
//                 })}
//               </Select>

//             </Box>
//           ))}
//         </Box>

//         {/* Validation errors */}
//         {errorCount > 0 && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             <strong>
//               {errorCount} row{errorCount > 1 ? "s have" : " has"} errors.
//             </strong>{" "}
//             Fix them in your Excel file and re-upload.
//             <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
//               {Object.entries(errors).slice(0, 5).map(([rowIdx, errs]) => (
//                 <li key={rowIdx}>
//                   <strong>Row {Number(rowIdx) + 2}:</strong> {errs.join(", ")}
//                 </li>
//               ))}
//               {errorCount > 5 && (
//                 <li>...and {errorCount - 5} more rows</li>
//               )}
//             </Box>
//           </Alert>
//         )}

//         {/* Preview table */}
//         {rows.length > 0 && (
//           <>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               Preview (first 5 rows) — red rows have errors
//             </Typography>
//             <TableContainer
//               component={Paper}
//               variant="outlined"
//               sx={{ maxHeight: 240 }}
//             >
//               <Table size="small" stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 600, width: 40 }}>#</TableCell>
//                     {FIELDS.map((f) => (
//                       <TableCell key={f.key} sx={{ fontWeight: 600 }}>
//                         {f.label}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {rows.slice(0, 5).map((row, i) => (
//                     <TableRow
//                       key={i}
//                       sx={{
//                         backgroundColor: errors[i]
//                           ? "rgba(211,47,47,0.08)"
//                           : "inherit",
//                       }}
//                     >
//                       <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>
//                         {i + 2}
//                       </TableCell>
//                       {FIELDS.map((f) => (
//                         <TableCell key={f.key}>
//                           {mapping[f.key] ? (
//                             row[mapping[f.key]] ?? ""
//                           ) : (
//                             <Typography
//                               sx={{ fontSize: 12, color: "text.disabled" }}
//                             >
//                               —
//                             </Typography>
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </>
//         )}

//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           onClick={getAllErrors}
//           variant="outlined"
//           disabled={loading || headers.length === 0}
//         >
//           Validate
//         </Button>
//         <Button
//           onClick={importData}
//           variant="contained"
//           disabled={loading || headers.length === 0 || errorCount > 0}
//           startIcon={
//             loading ? <CircularProgress size={16} color="inherit" /> : null
//           }
//         >
//           {loading
//             ? "Importing..."
//             : `Import${rows.length > 0 ? ` (${rows.length} rows)` : ""}`}
//         </Button>
//       </DialogActions>

//     </Dialog>
//   );
// };

// export default ImportDialog;