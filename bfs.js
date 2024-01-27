function bfs(startingVertex) {
	const visited = new Set();
	const stack = [];

	visited.add(startingVertex);
	stack.push(startingVertex);

	while (stack.length > 0) {
		const currentVertex = stack.pop();

		const neighbors = adj[currentVertex] || [];

		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				dfsOrder.push(
					new Link(
						nodeMap.get(currentVertex - 1),
						nodeMap.get(neighbor - 1)
					)
				);
				stack.push(neighbor);
			}
		}
	}
}
