import {
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";

import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AboutUs from "./pages/AboutUs/AboutUs";
import GuideDashboard from "./pages/GuideDashboard/GuideDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<GlobalLandingPage />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route path="/" element={<GlobalLandingPage />} />

        <Route path="/about" element={<AboutUs />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} />


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