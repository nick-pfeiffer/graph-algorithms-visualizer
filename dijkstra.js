function dijkstra(source) {
	let dist = [];
	let visited = [];

	for (let i = 0; i < adj.length; i++) {
		dist[i] = Infinity;
		visited[i] = false;
	}

	dist[source] = 0;

	for (let count = 0; count < adj.length - 1; count++) {
		let u = minDistance(dist, visited);
		visited[u] = true;

		for (let v = 0; v < adj.length; v++) {
			if (!visited[v] && adj[u].includes(v)) {
				let link = getLink(u, v);
				if (v == 2 && u == 3) console.log(link);
				if (u == 2 && v == 3) console.log(link);
				dfsOrder.push(link);
				let weight = link.weight;
				if (dist[u] + weight < dist[v]) {
					dist[v] = dist[u] + weight;
				}
			}
		}
	}

	console.log("Shortest distances from source node:");
	for (let i = 0; i < adj.length; i++) {
		console.log(`Node ${i}: ${dist[i]}`);
	}

	console.log(dfsOrder);
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
