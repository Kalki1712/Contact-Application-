import UsersTemplate from "../components/templates/UsersTemplate";
import useUsers from "../hooks/useUsers";

const Users = () => {
  const {
    users, total, page, rowsPerPage,
    searchTerm, setSearchTerm,
    handleChangePage, handleChangeRowsPerPage,
    open, setOpen, isEdit,
    handleOpenAdd, handleEdit, handleSave,
    formData, setFormData, errors,
    deleteDialogOpen, setDeleteDialogOpen,
    handleDeleteClick, handleDeleteConfirm,
    countries, statesList, citiesList,
  } = useUsers();

  return (
    <UsersTemplate
      users={users}
      total={total}
      page={page}
      rowsPerPage={rowsPerPage}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      open={open}
      setOpen={setOpen}
      isEdit={isEdit}
      handleOpenAdd={handleOpenAdd}
      handleEdit={handleEdit}
      handleSave={handleSave}
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      handleDeleteClick={handleDeleteClick}
      handleDeleteConfirm={handleDeleteConfirm}
      countries={countries}
      statesList={statesList}
      citiesList={citiesList}
    />
  );
};

export default Users;