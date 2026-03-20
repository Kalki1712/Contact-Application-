import {
  Dialog, DialogTitle,
  DialogContent, DialogActions, Button,
} from "@mui/material";

const BaseDialog = ({
  open, onClose, title, children,
  primaryLabel = "Save",
  secondaryLabel = "Cancel",
  onPrimary,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          {secondaryLabel}
        </Button>
        <Button onClick={onPrimary} color="success">
          {primaryLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseDialog;