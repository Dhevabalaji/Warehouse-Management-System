import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/AuthProvider.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import { seedAppData } from "./utils/seedData.js";

seedAppData();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#020617",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
              },
              success: {
                iconTheme: {
                  primary: "#facc15",
                  secondary: "#020617",
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);