// import {
//   Dialog, DialogTitle,
//   DialogContent, DialogActions, Button,
// } from "@mui/material";

// const BaseDialog = ({
//   open, onClose, title, children,
//   primaryLabel = "Save",
//   secondaryLabel = "Cancel",
//   onPrimary,
// }) => {
//   return (
//     <Dialog open={open} onClose={onClose} fullWidth>
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent>{children}</DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="error">
//           {secondaryLabel}
//         </Button>
//         <Button onClick={onPrimary} color="success">
//           {primaryLabel}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default BaseDialog;



const BaseDialog = ({
  open, onClose, title, children,
  primaryLabel = "Save",
  secondaryLabel = "Cancel",
  onPrimary,
}) => {

  if (!open) return null;

  return (
    //  Overlay
    <div className="fixed inset-0 z-50 flex items-center 
                    justify-center bg-black bg-opacity-50">

   
      <div className="bg-white rounded-lg shadow-xl 
                      w-full max-w-md mx-4">

   
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
        </div>

    
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {children}
        </div>

        
        <div className="px-6 py-4 border-t border-gray-200 
                        flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium 
                       text-red-600 border border-red-300 
                       rounded-md hover:bg-red-50 
                       transition-colors duration-200"
          >
            {secondaryLabel}
          </button>
          <button
            onClick={onPrimary}
            className="px-4 py-2 text-sm font-medium 
                       text-white bg-green-600 
                       rounded-md hover:bg-green-700 
                       transition-colors duration-200"
          >
            {primaryLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BaseDialog;
