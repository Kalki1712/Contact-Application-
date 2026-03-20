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

const UsersTemplate = ({
  users,
  total,
  page,
  rowsPerPage,
  searchTerm,
  setSearchTerm,
  handleChangePage, 
  handleChangeRowsPerPage,
  open,
  setOpen, 
  isEdit,
  handleOpenAdd,
  handleEdit,
  handleSave,
  formData,
  setFormData, 
  errors,
  deleteDialogOpen,  
  setDeleteDialogOpen,
  handleDeleteClick,
  handleDeleteConfirm,
  countries,
  statesList,
  citiesList,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Box p={4}>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add User
          </Button>
          <TextField
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 220 }}
          />
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
                      sx={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", gap: 1 }}
                      onClick={() => navigate(`/user-details/${user.id}`)}
                    >
                      {user.image && (
                        <img
                          src={user.image}
                          alt={user.name}
                          style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                        />
                      )}
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.countryCode} {user.contact}</TableCell>
                    <TableCell>{user.country}</TableCell>
                    <TableCell>{user.state}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDeleteClick(user.id)}>
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
    </>
  );
};

export default UsersTemplate;