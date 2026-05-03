import { useEffect, useState } from "react";
import { useVariableContext } from "../../../context/Variable.context";
import { Variable } from "lucide-react";
import { useRef } from "react";

export default function VariableInsertDropdown({ onInsert }) {
  const { variables } = useVariableContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInsert = (variable) => {
    onInsert(`{{ ${variable} }}`);
    setShowDropdown(false); // auto-close
  };

  // className={`hover:opacity-100 w-full h-full ${
  //  showDropdown ? "opacity-100" : "opacity-50"
  //}`

  if (!variables.length) return null;
  return (
    <div className="relative inline-block rounded-full p-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setShowDropdown((prev) => !prev)}
        className={`text-sm w-max h-max px-2 py-1 border-gray-400 rounded-lg bg-white hover:bg-gray-300 hover:opacity-100 opacity-50 transition-all duration-300 ${
          showDropdown ? "opacity-100" : "opacity-50"
        }`}
      >
        <Variable size={25} />
      </button>

      {showDropdown && (
        <ul className="absolute z-10 mt-1 right-0 w-40 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
          {variables.map((v, i) => (
            <li
              key={i}
              onClick={() => handleInsert(v)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {` ${v} `}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
