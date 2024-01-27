let found = false;
function dfs(cur, target, visited) {
	if (cur == target || found) {
		found = true;
		return;
	}

	visited.push(cur);
	for (let i = 0; i < adj[cur].length; i++) {
		if (visited.includes(adj[cur][i])) continue;
		if (found) break;
		// dfsOrder.push(getLink(cur - 1, adj[cur][i] - 1));
		dfsOrder.push(
			new Link(nodeMap.get(cur - 1), nodeMap.get(adj[cur][i] - 1))
		);
		dfs(adj[cur][i], target, visited);
	}
}
