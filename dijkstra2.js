let path = [];

function dijkstra(source, target) {
	let dist = [];
	let visited = [];
	let parent = [];

	for (let i = 0; i < adj.length; i++) {
		dist[i] = Infinity;
		visited[i] = false;
		parent[i] = -1;
	}

	dist[source] = 0;

	for (let count = 0; count < adj.length - 1; count++) {
		let u = minDistance(dist, visited);
		visited[u] = true;

		for (let v = 0; v < adj.length; v++) {
			if (!visited[v] && adj[u].includes(v)) {
				let link = getLink(u, v);
				dfsOrder.push(link);
				if (u == target) break;
				let weight = link.weight;

				if (dist[u] + weight < dist[v]) {
					dist[v] = dist[u] + weight;
					parent[v] = u;
				}
			}
		}
	}

	console.log("Shortest distances from source node:");
	for (let i = 0; i < adj.length; i++) {
		console.log(`Node ${i}: ${dist[i]}`);
	}

	if (dist[target] != Infinity) {
		console.log("Shortest path to target node:");
		getPath(parent, target);
		for (let i = 1; i < path.length; i++) {
			let fNode = path[i - 1];
			let sNode = path[i];
			let link = getLink(fNode, sNode);
			finalPath.push(link);
		}
		console.log(finalPath);
	} else {
		console.log("No path to the target node");
	}
}

function getPath(parent, target) {
	if (parent[target] != -1) {
		getPath(parent, parent[target]);
	}
	path.push(target);
}

function minDistance(dist, visited) {
	let min = Infinity;
	let minIndex = -1;

	for (let v = 0; v < dist.length; v++) {
		if (!visited[v] && dist[v] <= min) {
			min = dist[v];
			minIndex = v;
		}
	}

	return minIndex;
}
