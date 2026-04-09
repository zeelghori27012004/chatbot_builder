// src/context/VariableContext.jsx
import { createContext, useContext, useState } from "react";

const VariableContext = createContext();

export const VariableProvider = ({ children }) => {
  const [variables, setVariables] = useState([]);

  const syncVariablesFromNodes = (nodes) => {
    const vars = nodes
      .filter((n) => n.type === "askaQuestion" )
      .map((n) => n.data?.properties?.propertyName)
      .filter(Boolean);
    setVariables([...new Set(vars)]);
  };

  const addVariable = (newVar) => {
    if (newVar && !variables.includes(newVar)) {
      setVariables((prev) => [...prev, newVar]);
    }
  };

  return (
    <VariableContext.Provider
      value={{ variables, syncVariablesFromNodes, addVariable }}
    >
      {children}
    </VariableContext.Provider>
  );
};

export const useVariableContext = () => useContext(VariableContext);
