import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Products from "./components/Product";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import HomePage from "./components/HomePage";
import PdfPage from "./components/PdfPage";
import type {ReactNode} from 'react';
const App = () => {
  function ProtectedRoute({ children }: { children: ReactNode }) {
    const { login } = useContext(UserContext);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!login && !isLoggedIn) {
      return <Navigate to="/home" replace />;
    }
    return children;
  }

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          // <ProtectedRoute>
            <HomePage />
          // {/* </ProtectedRoute> */}
        }
      />
      <Route
        path="/pdf"
        element={
          // <ProtectedRoute>
            <PdfPage />
          // </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
