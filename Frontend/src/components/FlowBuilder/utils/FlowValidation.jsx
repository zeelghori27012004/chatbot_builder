/**
 * Validates a React Flow graph based on a set of rules.
 *
 * @param {Array} nodes - The array of nodes from React Flow.
 * @param {Array} edges - The array of edges from React Flow.
 * @returns {{isValid: boolean, errors: string[]}} - An object containing a boolean and an array of error messages.
 */
export function validateFlow(nodes, edges) {
  const errors = [];

  if (nodes.length === 0) {
    // You can decide if an empty canvas is valid or not.
    // For this example, we'll allow it.
    return { isValid: true, errors: [] };
  }

  // Helper maps for efficient lookups
  const nodeConnections = new Map(
    nodes.map((node) => [node.id, { in: 0, out: 0 }])
  );

  for (const edge of edges) {
    // Rule: No self-connecting nodes
    if (edge.source === edge.target) {
      const node = nodes.find((n) => n.id === edge.source);
      errors.push(
        `Error: Node "${node?.data?.label || node?.id}" connects to itself.`
      );
    }

    // Tally incoming and outgoing connections for each node
    if (nodeConnections.has(edge.source)) {
      nodeConnections.get(edge.source).out += 1;
    }
    if (nodeConnections.has(edge.target)) {
      nodeConnections.get(edge.target).in += 1;
    }
  }

  // Iterate over each node to check its specific rules
  for (const node of nodes) {
    const connections = nodeConnections.get(node.id);

    // Rule: Every node must be connected (except for a single start node)
    // A more robust check: find nodes that are not part of the main flow.
    // A simpler check: Every node must have at least one connection.
    if (connections.in === 0 && connections.out === 0) {
      errors.push(
        `Error: Node "${
          node.data.label || node.id
        }" is isolated and not connected to anything.`
      );
    }

    const startNodes = nodes.filter((n) => n.type === "start");
    if (startNodes.length > 1) {
      errors.push("Error: Multiple start nodes detected. Only one is allowed.");
    }

    if (connections.in === 0 && node.type !== "start") {
      errors.push(
        `Error: Node "${
          node.data.label || node.id
        }" has no incoming connection.`
      );
    }
    if (connections.out === 0 && node.type !== "end") {
      errors.push(
        `Error: Node "${
          node.data.label || node.id
        }" has no outgoing connection.`
      );
    }

    // --- Required content validation ---
    // Helper: required fields for each node type
    const requiredFieldsMap = {
      start: [],
      message: ["message"],
      buttons: ["message", "buttons"],
      keywordMatch: ["keywords"],
      apiCall: ["requestName", "url"],
      askaQuestion: ["question", "propertyName"],
      end: [],
    };
    const nodeType = node.type;
    const requiredFields = requiredFieldsMap[nodeType] || [];
    const properties = node.data?.properties || {};
    requiredFields.forEach((field) => {
      const value = properties[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (Array.isArray(value) && value.every((item) => !item || (typeof item === "string" && item.trim() === "")))
      ) {
        errors.push(
          `Error: Node "${node.data.label || node.id}" is missing required content: ${field}`
        );
      }
      // API URL validation
      if (nodeType === "apiCall" && field === "url" && typeof value === "string") {
        try {
          // eslint-disable-next-line no-new
          new URL(value);
        } catch {
          errors.push(`Error: Node "${node.data.label || node.id}" has an invalid API URL.`);
        }
      }
    });
    // --- End required content validation ---

    // Node-specific validation
    switch (node.type) {
      case "condition": {
        const outgoingEdges = edges.filter((e) => e.source === node.id);
        const labels = new Set(
          outgoingEdges.map((e) => (e.label || e.data?.label)?.toLowerCase())
        );
        if (!labels.has("true")) {
          errors.push(
            `Error: Condition node "${
              node.data.label || node.id
            }" is missing an outgoing 'true' path.`
          );
        }
        if (!labels.has("false")) {
          errors.push(
            `Error: Condition node "${
              node.data.label || node.id
            }" is missing an outgoing 'false' path.`
          );
        }
        break;
      }
      case "buttons": {
        const definedButtons = node.data?.properties?.buttons || [];
        if (definedButtons.length === 0 && connections.out > 0) {
          errors.push(
            `Error: Buttons node "${
              node.data.label || node.id
            }" has outgoing connections but no buttons defined.`
          );
        }

        const outgoingEdges = edges.filter((e) => e.source === node.id);
        const edgeLabels = new Set(
          outgoingEdges.map((e) => (e.label || e.data?.label)?.toLowerCase())
        );

        for (const buttonLabel of definedButtons) {
          if (!edgeLabels.has(buttonLabel.toLowerCase())) {
            errors.push(
              `Error: Buttons node "${
                node.data.label || node.id
              }" is missing an outgoing connection for the "${buttonLabel}" button.`
            );
          }
        }
        break;
      }
      // You can add cases for other node types, e.g., an 'end' node must not have outgoing connections.
      case "end":
        if (connections.out > 0) {
          errors.push(
            `Error: End node "${
              node.data.label || node.id
            }" cannot have outgoing connections.`
          );
        }
        break;
      case "start":
        if (connections.in > 0) {
          errors.push(
            `Error: Start Node "${
              node.data.label || node.id
            }" cannot have incoming connections.`
          );
        }
        break;
      default:
        break;
    }
  }

  // Check for multiple end nodes
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length > 1) {
    errors.push("Error: Multiple end nodes detected. Only one is allowed.");
  }

  // Cycle detection (DFS)
  function hasCycle() {
    const visited = new Set();
    const recStack = new Set();
    const adj = {};
    nodes.forEach((node) => (adj[node.id] = []));
    edges.forEach((edge) => {
      if (adj[edge.source]) adj[edge.source].push(edge.target);
    });
    function dfs(nodeId) {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        recStack.add(nodeId);
        for (const neighbor of adj[nodeId]) {
          if (!visited.has(neighbor) && dfs(neighbor)) return true;
          else if (recStack.has(neighbor)) return true;
        }
      }
      recStack.delete(nodeId);
      return false;
    }
    return nodes.some((node) => dfs(node.id));
  }
  if (hasCycle()) {
    errors.push("Error: The flow contains a circular loop (cycle). Please remove cycles.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
