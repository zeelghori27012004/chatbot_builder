import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { DefaultField } from "./DefaultField";
import ApiResponseViewer from "./ApiResponseViewer";
import { useVariableContext } from "../../../context/Variable.context";

export default function ApiCallFields({ formData, onChange, errors }) {
  const [apiResponse, setApiResponse] = useState(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [testVariables, setTestVariables] = useState({});

  const [selectedFields, setSelectedFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const { addVariable } = useVariableContext();
  // Extract base URL when URL changes
  useEffect(() => {
    if (formData.url) {
      try {
        const urlObj = new URL(formData.url.replace(/\{\{(.*?)\}\}/g, "test")); // temp replace to make valid
        setBaseUrl(`${urlObj.protocol}//${urlObj.host}`);
      } catch {
        setBaseUrl("");
      }

      // Extract variables from {{variable}} format
      const matches = [...formData.url.matchAll(/\{\{(.*?)\}\}/g)];
      const vars = {};
      matches.forEach(([_, key]) => {
        vars[key] = testVariables[key] || "";
      });
      setTestVariables(vars);
    } else {
      setBaseUrl("");
      setTestVariables({});
    }
  }, [formData.url]);

  const AuthFields = ({ authType, formData, onChange }) => {
    if (authType === "basic") {
      return (
        <div className="mt-2 space-y-2">
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={(e) => onChange("username", e.target.value)}
            placeholder="Username"
            className="w-full px-3 py-2 text-sm border rounded-md bg-gray-50 focus:bg-white"
          />
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 text-sm border rounded-md bg-gray-50 focus:bg-white"
          />
        </div>
      );
    }
    if (authType === "bearer") {
      return (
        <input
          type="text"
          value={formData.bearerToken || ""}
          onChange={(e) => onChange("bearerToken", e.target.value)}
          placeholder="Bearer Token"
          className="mt-2 w-full px-3 py-2 text-sm border rounded-md bg-gray-50 focus:bg-white"
        />
      );
    }
    if (authType === "custom") {
      return (
        <input
          type="text"
          value={formData.accessToken || ""}
          onChange={(e) => onChange("accessToken", e.target.value)}
          placeholder="Access Token"
          className="mt-2 w-full px-3 py-2 text-sm border rounded-md bg-gray-50 focus:bg-white"
        />
      );
    }
    return null;
  };

  const toggleExpand = (path) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
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

  const renderJsonData = (data, path = "") => {
    if (data && typeof data === "object" && data.error) {
      return (
        <div className="text-red-600 bg-red-50 p-2 rounded text-sm">
          <strong>Error:</strong> {data.error}
        </div>
      );
    }

    if (Array.isArray(data)) {
      const isExpanded = expandedPaths.has(path);

      return (
        <div className="pl-4">
          <div
            className="flex items-center cursor-pointer hover:bg-gray-50 -ml-4 pl-4"
            onClick={() => toggleExpand(path)}
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <span className="text-gray-700">[</span>
            <span className="text-gray-500 ml-1 text-sm">
              {data.length} items
            </span>
            {!isExpanded && <span className="text-gray-700">]</span>}
          </div>

          {isExpanded && (
            <>
              {data.map((item, index) => (
                <div key={index} className="pl-4">
                  {renderJsonData(item, `${path}[${index}]`)}
                  {index < data.length - 1 && ","}
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
      const isExpanded = expandedPaths.has(path);

      return (
        <div className="pl-4">
          <div
            className="flex items-center cursor-pointer hover:bg-gray-50 -ml-4 pl-4"
            onClick={() => toggleExpand(path)}
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <span className="text-gray-700">{"{"}</span>
            <span className="text-gray-500 ml-1 text-sm">
              {keys.length} properties
            </span>
            {!isExpanded && <span className="text-gray-700">{"}"}</span>}
          </div>

          {isExpanded && (
            <>
              {keys.map((key, index) => (
                <div key={key} className="pl-4">
                  <div
                    className={`flex items-baseline group ${
                      selectedFields.some((v) => v.path === `${path}.${key}`)
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newPath = `${path}.${key}`;
                      const existingIndex = selectedFields.findIndex(
                        (v) => v.path === newPath
                      );

                      if (existingIndex >= 0) {
                        setSelectedFields((prev) =>
                          prev.filter((v) => v.path !== newPath)
                        );
                        onChange("selectedField", null);
                      } else {
                        const value = data[key];
                        let fullUrl = null;

                        if (typeof value === "string") {
                          if (value.match(/^https?:\/\//)) {
                            fullUrl = value;
                          } else if (value.startsWith("/") && baseUrl) {
                            fullUrl = `${baseUrl}${value}`;
                          }
                        }

                        const newField = {
                          path: newPath,
                          fullUrl: fullUrl,
                        };

                        setSelectedFields((prev) => [...prev, newField]);
                        onChange("selectedField", newField);
                      }
                    }}
                  >
                    <span className="text-red-700 mr-1">"{key}":</span>
                    {renderJsonData(data[key], `${path}.${key}`)}
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

  const testApiCall = async () => {
    setIsLoading(true);
    setApiResponse(null);

    try {
      const headers = formData.headers?.reduce((acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      }, {});

      // Add auth headers if needed
      if (formData.authType === "bearer" && formData.bearerToken) {
        headers.Authorization = `Bearer ${formData.bearerToken}`;
      } else if (
        formData.authType === "basic" &&
        formData.username &&
        formData.password
      ) {
        headers.Authorization = `Basic ${btoa(
          `${formData.username}:${formData.password}`
        )}`;
      } else if (formData.authType === "custom" && formData.accessToken) {
        headers.Authorization = `Token ${formData.accessToken}`;
      }

      const options = {
        method: formData.method,
        headers: headers,
      };

      if (formData.method !== "GET" && formData.body) {
        options.body = JSON.stringify(JSON.parse(formData.body));
        headers["Content-Type"] = "application/json";
      }
      let resolvedUrl = formData.url;
      Object.entries(testVariables).forEach(([key, value]) => {
        resolvedUrl = resolvedUrl.replaceAll(`{{${key}}}`, value);
      });

      const response = await fetch(resolvedUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error("API call failed:", error);
      setApiResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Configuration Panel */}
      <div className="w-full md:w-1/2 flex flex-col space-y-4 overflow-y-auto pr-2">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-lg mb-4">API Configuration</h3>

          <DefaultField
            fieldKey="requestName"
            label="Request Name"
            formData={formData}
            onChange={onChange}
            errors={errors}
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Method
            </label>
            <select
              value={formData.method}
              onChange={(e) => onChange("method", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:bg-white"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <DefaultField
            fieldKey="url"
            label="URL"
            formData={formData}
            onChange={onChange}
            errors={errors}
            required
          />
          {Object.keys(testVariables).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Test Variable Values
              </h4>
              <div className="space-y-2">
                {Object.entries(testVariables).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-sm w-1/3 font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {key}
                    </span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        setTestVariables((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50 focus:bg-white"
                      placeholder={`Test value for ${key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.method !== "GET" && (
            <DefaultField
              fieldKey="body"
              label="Request Body (JSON)"
              formData={formData}
              onChange={onChange}
              errors={errors}
              required={true}
              textarea
            />
          )}

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Authentication
            </label>
            <div className="flex flex-wrap gap-3">
              {["none", "basic", "bearer", "custom"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm cursor-pointer px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    checked={formData.authType === type}
                    onChange={() => onChange("authType", type)}
                    className="text-blue-500"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
            <AuthFields
              authType={formData.authType}
              formData={formData}
              onChange={onChange}
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Headers
              </label>
              <button
                onClick={() =>
                  onChange("headers", [
                    ...(formData.headers || []),
                    { key: "", value: "" },
                  ])
                }
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                + Add Header
              </button>
            </div>

            <div className="space-y-2">
              {formData.headers?.map((header, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => {
                      const newHeaders = [...formData.headers];
                      newHeaders[index].key = e.target.value;
                      onChange("headers", newHeaders);
                    }}
                    placeholder="Key"
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => {
                      const newHeaders = [...formData.headers];
                      newHeaders[index].value = e.target.value;
                      onChange("headers", newHeaders);
                    }}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50 focus:bg-white"
                  />
                  <button
                    onClick={() => {
                      const newHeaders = formData.headers.filter(
                        (_, i) => i !== index
                      );
                      onChange("headers", newHeaders);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={testApiCall}
            disabled={isLoading}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Testing...
              </>
            ) : (
              "Test API Call"
            )}
          </button>
        </div>

        {formData.selectedField && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium mb-3">Selected Resource</h4>
            <div className="text-sm">
              <div>
                <span className="font-medium text-gray-600">Path:</span>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {formData.selectedField.path.replace(/^\./, "")}
                </span>
              </div>
            </div>
          </div>
        )}

        {formData.selectedField && (
          <button
            onClick={() =>
              addVariable(formData.selectedField.path.replace(/^\./, ""))
            }
            className="mt-2 text-sm text-green-600 hover:underline"
          >
            + Save as contact property
          </button>
        )}
      </div>

      <div className="w-full md:w-1/2">
        <div className="bg-white rounded-lg border border-gray-200 h-full">
          <ApiResponseViewer
            apiResponse={apiResponse}
            isLoading={isLoading}
            onFieldSelect={(path, value) => {
              const newField = { path };
              setSelectedFields((prev) => [...prev, newField]);
              onChange("selectedField", newField);
            }}
          />
        </div>
      </div>
    </div>
  );
}
