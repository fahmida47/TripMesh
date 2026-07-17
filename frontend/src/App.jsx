import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobalLandingPage />} />

        <Route
          path="*"
          element={
            <div>
              <h2>Page Not Found</h2>
              <Link to="/">Go to Home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;