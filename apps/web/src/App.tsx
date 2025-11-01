import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/auth-context";
import { AppRoutes } from "./routes/app-routes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        closeButton
        theme="system"
        position="top-right"
      />
    </AuthProvider>
  );
}

export default App;
