import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ApiResponseViewer({
  apiResponse,
  isLoading,
  onFieldSelect,
}) {
  const [expandedPaths, setExpandedPaths] = useState(new Set());

  const toggleExpand = (path) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) newSet.delete(path);
      else newSet.add(path);
      return newSet;
    });
  };

  const renderValue = (value) => {
    if (value === null) return <span className="text-purple-600">null</span>;
    if (typeof value === "number")
      return <span className="text-blue-600">{value}</span>;
    if (typeof value === "boolean")
      return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === "string")
      return <span className="text-green-600">"{value}"</span>;
    if (Array.isArray(value))
      return <span className="text-gray-500">[{value.length}]</span>;
    if (typeof value === "object")
      return (
        <span className="text-gray-500">
          {"{" + Object.keys(value).length + "}"}
        </span>
      );
    return <span>{JSON.stringify(value)}</span>;
  };

  const renderJson = (data, path = "") => {
    if (data && typeof data === "object" && data.error) {
      return (
        <div className="text-red-600 bg-red-50 p-2 rounded text-sm">
          <strong>Error:</strong> {data.error}
        </div>
      );
    }

    if (Array.isArray(data)) {
      const expanded = expandedPaths.has(path);
      return (
        <div className="pl-4">
          <div
            className="flex items-center cursor-pointer hover:bg-gray-50 -ml-4 pl-4"
            onClick={() => toggleExpand(path)}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="text-gray-700">[</span>
            <span className="ml-1 text-sm text-gray-500">
              {data.length} items
            </span>
            {!expanded && <span className="text-gray-700">]</span>}
          </div>
          {expanded && (
            <>
              {data.map((item, index) => (
                <div key={index} className="pl-4">
                  {renderJson(item, `${path}[${index}]`)}
                </div>
              ))}
              <span className="text-gray-700">]</span>
            </>
          )}
        </div>
      );
    }

    if (data && typeof data === "object") {
      const keys = Object.keys(data);
      const expanded = expandedPaths.has(path);

      return (
        <div className="pl-4">
          <div
            className="flex items-center cursor-pointer hover:bg-gray-50 -ml-4 pl-4"
            onClick={() => toggleExpand(path)}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="text-gray-700">{"{"}</span>
            <span className="ml-1 text-sm text-gray-500">
              {keys.length} properties
            </span>
            {!expanded && <span className="text-gray-700">{"}"}</span>}
          </div>
          {expanded && (
            <>
              {keys.map((key, index) => (
                <div key={key} className="pl-4">
                  <div
                    className="flex items-baseline group cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFieldSelect?.(`${path}.${key}`);
                    }}
                  >
                    <span className="text-red-700 mr-1 group-hover:underline">
                      "{key}":
                    </span>
                    {renderJson(data[key], `${path}.${key}`)}
                    {index < keys.length - 1 && ","}
                  </div>
                </div>
              ))}
              <span className="text-gray-700">{"}"}</span>
            </>
          )}
        </div>
      );
    }

    return renderValue(data);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold">API Response</h3>
      </div>
      <div className="p-4 font-mono text-sm flex-1 overflow-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : apiResponse ? (
          renderJson(apiResponse)
        ) : (
          <div className="text-gray-400 flex items-center justify-center h-full">
            No response data available. Click "Test API Call" to fetch data.
          </div>
        )}
      </div>
    </div>
  );
}
