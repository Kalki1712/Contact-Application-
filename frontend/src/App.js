import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Users from "./components/Users";
import UserDetails from "./components/UserDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Settings from "./components/Settings";
import Layout from  "./components/Layout";

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



// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
// import Login from "./components/Login"
// import Signup from "./components/Signup"
// import Users from "./components/Users"
// import UserDetails from "./components/UserDetails"
// import ProtectedRoute from "./components/ProtectedRoute"
// import PublicRoute from "./components/PublicRoute"
// import Settings from "./components/Settings"

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />

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

//         <Route
//           path="/users"
//           element={
//             <ProtectedRoute>
//               <Users />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/user-details/:id"
//           element={
//             <ProtectedRoute>
//               <UserDetails />
//             </ProtectedRoute>
//           }
//         />

//            <Route
//           path="/settings"
//           element={
//             <ProtectedRoute>
//               <Settings />
//             </ProtectedRoute>
//           }
//         />


//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App;


