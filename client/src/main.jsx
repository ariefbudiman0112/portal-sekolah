import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { ContextProvider } from "./context/ContextProvider.jsx";
// CSS
import "./assets/css/index.css";
import "./assets/css/responsive.css";
import "./assets/css/animate.min.css";
import "./assets/css/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/css/light-bootstrap-dashboard-react.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
