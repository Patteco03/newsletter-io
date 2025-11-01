import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/protected-router";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Admin Router</div>} />
        </Route>
      </Routes>
      <Toaster
        closeButton
        theme="system"
        position="top-right"
      />
    </AuthProvider>
  );
}

export default App;
