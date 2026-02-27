import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import PageNotFound404 from "./components/PageNotFound404";
import Login from "./pages/login";
import Register from "./pages/register";
import Projects from "./pages/Projects";
import PrivateRoute from "./components/Protectedroute";
import ResetPasswordPage from "./pages/ResetPassword/ResetPasswordForm";
import FlowBuilder from "./components/FlowBuilder/Flowbuilder";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Services from "./pages/Services";
import Work from "./pages/Work";
import Team from "./pages/Team";
import About from "./pages/About";
import HowToUse from "./pages/HowToUse";
import FAQs from "./pages/FAQs";
import Support from "./pages/Support";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Login />
            <Footer />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
            <Footer />
          </PrivateRoute>
        ),
      },
      {
        path: "projects",
        element: (
          <PrivateRoute>
            <Projects />
            <Footer />
          </PrivateRoute>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <>
            <PrivacyPolicy />
            <Footer />
          </>
        ),
      },
      {
        path: "services",
        element: (
          <>
            <Services />
            <Footer />
          </>
        ),
      },
      {
        path: "work",
        element: (
          <>
            <Work />
            <Footer />
          </>
        ),
      },
      {
        path: "team",
        element: (
          <>
            <Team />
            <Footer />
          </>
        ),
      },
      {
        path: "about",
        element: (
          <>
            <About />
            <Footer />
          </>
        ),
      },
      {
        path: "how-to-use",
        element: (
          <>
            <HowToUse />
            <Footer />
          </>
        ),
      },
      {
        path: "faqs",
        element: (
          <>
            <FAQs />
            <Footer />
          </>
        ),
      },
      {
        path: "support",
        element: (
          <>
            <Support />
            <Footer />
          </>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/resetpassword",
    element: <ResetPasswordPage />,
  },
  {
    path: "*",
    element: <PageNotFound404 />,
  },
  {
    path: "projects/:id",
    element: (
      <PrivateRoute>
        <FlowBuilder />
      </PrivateRoute>
    ),
  },
]);

export default router;
