import { DialogContentText } from "@mui/material";
import BaseDialog from "../atoms/BaseDialog";

const ConfirmDialog = ({
  open, onClose, onConfirm,
  title = "Are you sure?",
  message,
  primaryLabel = "Delete",
  secondaryLabel = "Cancel",
}) => {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title}
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
      onPrimary={onConfirm}
    >
      <DialogContentText>{message}</DialogContentText>
    </BaseDialog>
  );
};

export default ConfirmDialog;