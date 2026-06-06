import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
