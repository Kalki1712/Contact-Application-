import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";   // ✅ ADD THIS
import Login from "./components/Login";
import Signup from "./components/Signup";
import Users from "./components/Users";
import UserDetails from "./components/UserDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Settings from "./components/Settings";
import Layout from  "./components/Layout";

// ✅ ADD THIS BLOCK
const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes WITH Navbar */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/users" element={<Users />} />
          <Route path="/user-details/:id" element={<UserDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;



// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import Users from "./components/Users";
// import UserDetails from "./components/UserDetails";
// import ProtectedRoute from "./components/ProtectedRoute";
// import PublicRoute from "./components/PublicRoute";
// import Settings from "./components/Settings";
// import Layout from  "./components/Layout";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Default Redirect */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* Public Routes */}
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path="/signup"
//           element={
//             <PublicRoute>
//               <Signup />
//             </PublicRoute>
//           }
//         />

//         {/* Protected Routes WITH Navbar */}
//         <Route
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/users" element={<Users />} />
//           <Route path="/user-details/:id" element={<UserDetails />} />
//           <Route path="/settings" element={<Settings />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/login" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


