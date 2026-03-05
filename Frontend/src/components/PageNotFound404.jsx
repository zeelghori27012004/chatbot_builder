import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/User.context";

export default function PageNotFound404() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold uppercase mb-4">
        404 - Page Not Found
      </h1>
      <p className="mb-6 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to={user ? "/dashboard" : "/login"}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {user ? "Go to Dashboard" : "Go to Login"}
      </Link>
    </div>
  );
}
