// import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";

// const AppBarHeader = ({ onHomeClick, title, rightSlot }) => {
//   return (
//     <AppBar position="sticky" color="primary">
//       <Toolbar sx={{ position: "relative" }}>

//         <IconButton color="inherit" onClick={onHomeClick} sx={{ mr: 2 }}>
//           <HomeIcon />
//         </IconButton>

//         <Typography
//           variant="h6"
//           sx={{
//             position: "absolute",
//             left: "50%",
//             transform: "translateX(-50%)",
//             fontWeight: "bold",
//             cursor: "pointer",
//           }}
//           onClick={onHomeClick} 
//         >
//           {title}
//         </Typography>


   
//         {/* Right — anything passed in (avatar, menu, etc) */}
//         {rightSlot}

//       </Toolbar>
//     </AppBar>
//   );
// };

// export default AppBarHeader;



import HomeIcon from "@mui/icons-material/Home";

const AppBarHeader = ({ onHomeClick, title, rightSlot }) => {
  return (
    //  AppBar 
    <div className="sticky top-0 z-40 w-full 
                    bg-blue-600 text-white shadow-md">

      //  Toolbar 
      <div className="relative flex items-center 
                      px-4 py-2 h-16">

        //  Home Icon 
        <button
          onClick={onHomeClick}
          className="p-2 rounded-full mr-2
                     hover:bg-blue-700
                     transition-colors duration-200"
        >
          <HomeIcon />
        </button>

        //  Center Title 
        <span
          onClick={onHomeClick}
          className="absolute left-1/2 -translate-x-1/2
                     text-lg font-bold cursor-pointer
                     hover:opacity-80
                     transition-opacity duration-200"
        >
          {title}
        </span>

        //  Right Slot 
        <div className="ml-auto">
          {rightSlot}
        </div>

      </div>
    </div>
  );
};

export default AppBarHeader;
