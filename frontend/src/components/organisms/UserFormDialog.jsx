import BaseDialog from "../atoms/BaseDialog";
import UserFormFields from "../molecules/UserFormFields";

const UserFormDialog = ({
  open, onClose, onSave, isEdit,
  formData, setFormData, errors,
  countries, statesList, citiesList,
}) => {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Add User"}
      primaryLabel={isEdit ? "Update" : "Save"}
      secondaryLabel="Cancel"
      onPrimary={onSave}
    >
      <UserFormFields
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        countries={countries}
        statesList={statesList}
        citiesList={citiesList}
      />
    </BaseDialog>
  );
};

export default UserFormDialog;