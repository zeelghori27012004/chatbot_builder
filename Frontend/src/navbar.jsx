import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserContext } from "../context/User.context";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { MdSettings } from "react-icons/md";
import ReactDOM from "react-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = !!user;
  const [showMenu, setShowMenu] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ top: 0, left: 0 });
  const iconRef = React.useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  React.useEffect(() => {
    if (showMenu && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8, // 8px gap
        left: rect.right - 160, // 160px = menu width
      });
    }
    // Close dropdown on outside click
    function handleClickOutside(e) {
      if (
        iconRef.current &&
        !iconRef.current.contains(e.target) &&
        !document.getElementById("profile-dropdown-menu")?.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <nav className="bg-white shadow-md w-full z-50 max-w-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            <img src={logo} className="w-25" />
          </Link>

          <div className="flex items-center space-x-6">
            {isLoggedIn && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 font-semibold hover:text-blue-600 transition"
                }
              >
                Dashboard
              </NavLink>
            )}

            {isLoggedIn && (
              <div className="relative ml-4">
                <button
                  ref={iconRef}
                  onClick={() => setShowMenu((v) => !v)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={
                      user.photoUrl || "https://avatar.iran.liara.run/public"
                    }
                    className="rounded-full h-12 w-12"
                    alt="user avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://avatar.iran.liara.run/public";
                    }}
                  />
                  {/* <FaUserCircle size={32} className="text-blue-600" /> */}
                </button>
                {showMenu &&
                  ReactDOM.createPortal(
                    <div
                      className="fixed w-64 bg-white border rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-2"
                      style={{ top: menuPos.top, left: menuPos.left }}
                      id="profile-dropdown-menu"
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-2">
                        {user?.avatarUrl || user?.photoUrl ? (
                          <img
                            src={
                              user.avatarUrl ||
                              user.photoUrl ||
                              "https://avatar.iran.liara.run/public"
                            }
                            alt="avatar"
                            className="w-12 h-12 rounded-full border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://avatar.iran.liara.run/public";
                            }}
                          />
                        ) : (
                          <FaUserCircle size={48} className="text-blue-600" />
                        )}
                        <div>
                          <div className="font-semibold text-lg text-gray-900">
                            {user?.name || user?.username || "User Name"}
                          </div>
                          {user?.role && (
                            <div className="text-xs text-gray-500 mt-1">
                              {user.role}
                            </div>
                          )}
                        </div>
                      </div>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          navigate("/profile");
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-200 focus:bg-gray-200 mb-1"
                      >
                        <FiUser className="text-lg" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          navigate("/settings");
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-200 focus:bg-gray-200 mb-1"
                      >
                        <MdSettings className="text-lg" />
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-md font-medium text-red-600 hover:bg-gray-200 focus:bg-gray-200 border border-transparent hover:border-red-200"
                      >
                        <FiLogOut className="text-lg" />
                        Logout
                      </button>
                    </div>,
                    document.body
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
