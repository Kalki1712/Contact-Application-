import {
  Box, TextField, Button,
  Table, TableBody, TableCell,
  TableHead, TableRow, Paper,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
import UserFormDialog from "../organisms/UserFormDialog";
import ConfirmDialog from "../molecules/ConfirmDialog";
import ImportButton from "../atoms/ImportButton";
import ExportButton from "../atoms/ExportButton";  
import ImportDialog from "../molecules/ImportDialog";
import useImportData from '../../hooks/useImportData';
import { useExportData } from '../../hooks/useExportData';  

const UsersTemplate = ({
  users, total, page, rowsPerPage, searchTerm, setSearchTerm,
  handleChangePage, handleChangeRowsPerPage, open, setOpen, isEdit,
  handleOpenAdd, handleEdit, handleSave, formData, setFormData, errors,
  deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm,
  countries, statesList, citiesList,
}) => {
  const navigate = useNavigate();

  const importHook = useImportData(() => {
    window.location.reload();
  });

  const { exportToExcel, exporting } = useExportData();

  return (
    <>
      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add User
          </Button>
          <Box display="flex" alignItems="center" gap={1}>
            <ImportButton onFileSelect={importHook.parseExcel} />
           
            <ExportButton 
              onExport={exportToExcel} 
              exporting={exporting}
              disabled={total === 0}
            />
            <TextField
              size="small"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 220 }}
            />
          </Box>
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Profile Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell
                      sx={{ 
                        cursor: "pointer", 
                        color: "blue", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1 
                      }}
                      onClick={() => navigate(`/user-details/${user.id}`)}
                    >
                      {user.image && (
                        <img 
                          src={user.image} 
                          alt={user.name}
                          style={{ 
                            width: 30, 
                            height: 30, 
                            borderRadius: "50%", 
                            objectFit: "cover" 
                          }} 
                        />
                      )}
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell> 
                      {user.gender 
                        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase() 
                        : "—"
                      }
                    </TableCell>
                    <TableCell>{user.countryCode} {user.contact}</TableCell>
                    <TableCell>{user.country}</TableCell>
                    <TableCell>{user.state}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <UserFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        countries={countries}
        statesList={statesList}
        citiesList={citiesList}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact"
        message="Are you sure you want to delete this contact?"
      />

      <ImportDialog
        open={!!importHook.file}
        onClose={() => importHook.parseExcel(null)}
        headers={importHook.headers}
        mapping={importHook.mapping}
        setFieldMapping={importHook.setFieldMapping}
        rows={importHook.rows}
        errors={importHook.errors}
        loading={importHook.loading}
        importData={importHook.importData}
        FIELDS={importHook.FIELDS}
        allFieldsMapped={importHook.allFieldsMapped}
        requiredFieldsMapped={importHook.requiredFieldsMapped}
      />
    </>
  );
};

export default UsersTemplate;




















// import {
//   Box, TextField, Button,
//   Table, TableBody, TableCell,
//   TableHead, TableRow, Paper,
// } from "@mui/material";
// import TableContainer from "@mui/material/TableContainer";
// import TablePagination from "@mui/material/TablePagination";
// import { useNavigate } from "react-router-dom";
// import UserFormDialog from "../organisms/UserFormDialog";
// import ConfirmDialog from "../molecules/ConfirmDialog";
// import ImportButton from "../atoms/ImportButton";
// import ImportDialog from "../molecules/ImportDialog";
// import useImportData from '../../hooks/useImportData';

// const UsersTemplate = ({
//   users, total, page, rowsPerPage, searchTerm, setSearchTerm,
//   handleChangePage, handleChangeRowsPerPage, open, setOpen, isEdit,
//   handleOpenAdd, handleEdit, handleSave, formData, setFormData, errors,
//   deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm,
//   countries, statesList, citiesList,
// }) => {
//   const navigate = useNavigate();

//   const importHook = useImportData(() => {
//     window.location.reload();
//   });

//   return (
//     <>
//       <Box p={4}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//           <Button variant="contained" onClick={handleOpenAdd}>
//             Add User
//           </Button>
//           <Box display="flex" alignItems="center" gap={1}>
//             <ImportButton onFileSelect={importHook.parseExcel} />
//             <TextField
//               size="small"
//               placeholder="Search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               sx={{ width: 220 }}
//             />
//           </Box>
//         </Box>

//         <Paper>
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Profile Name</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Gender</TableCell>
//                   <TableCell>Contact</TableCell>
//                   <TableCell>Country</TableCell>
//                   <TableCell>State</TableCell>
//                   <TableCell>City</TableCell>
//                   <TableCell>Address</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.map((user) => (
//                   <TableRow key={user.id}>
//                     <TableCell
//                       sx={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", gap: 1 }}
//                       onClick={() => navigate(`/user-details/${user.id}`)}
//                     >
//                       {user.image && (
//                         <img src={user.image} alt={user.name}
//                           style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
//                       )}
//                       {user.name}
//                     </TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     {/* <TableCell>{user.gender}</TableCell> */}
//                     <TableCell> {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase() : "—"}</TableCell>
//                     <TableCell>{user.countryCode} {user.contact}</TableCell>
//                     <TableCell>{user.country}</TableCell>
//                     <TableCell>{user.state}</TableCell>
//                     <TableCell>{user.city}</TableCell>
//                     <TableCell>{user.address}</TableCell>
//                     <TableCell align="center">
//                       <Button size="small" onClick={() => handleEdit(user)}>Edit</Button>
//                       <Button size="small" color="error" onClick={() => handleDeleteClick(user.id)}>Delete</Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>

//         <TablePagination
//           component="div"
//           count={total}
//           page={page}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           rowsPerPageOptions={[5, 10, 25]}
//         />
//       </Box>

//       <UserFormDialog
//         open={open}
//         onClose={() => setOpen(false)}
//         onSave={handleSave}
//         isEdit={isEdit}
//         formData={formData}
//         setFormData={setFormData}
//         errors={errors}
//         countries={countries}
//         statesList={statesList}
//         citiesList={citiesList}
//       />

//       <ConfirmDialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         onConfirm={handleDeleteConfirm}
//         title="Delete Contact"
//         message="Are you sure you want to delete this contact?"
//       />

//       {/* <ImportDialog
//         open={!!importHook.file}
//         onClose={() => importHook.parseExcel(null)}
//         headers={importHook.headers}
//         mapping={importHook.mapping}
//         setFieldMapping={importHook.setFieldMapping}
//         rows={importHook.rows}
//         errors={importHook.errors}
//         loading={importHook.loading}
//         getAllErrors={importHook.getAllErrors}
//         importData={importHook.importData}
//         FIELDS={importHook.FIELDS}
//       /> */}


//       <ImportDialog
//         open={!!importHook.file}
//         onClose={() => importHook.parseExcel(null)}
//         headers={importHook.headers}
//         mapping={importHook.mapping}
//        setFieldMapping={importHook.setFieldMapping}
//        rows={importHook.rows}
//        errors={importHook.errors}
//        loading={importHook.loading}
//        importData={importHook.importData}
//        FIELDS={importHook.FIELDS}
//        allFieldsMapped={importHook.allFieldsMapped}
//        requiredFieldsMapped={importHook.requiredFieldsMapped}
//       />
//     </>
//   );
// };

// export default UsersTemplate;