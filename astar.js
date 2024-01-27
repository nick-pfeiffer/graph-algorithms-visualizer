let foundTarget = false;

function astar(source, target, nMap) {
	let openSet = [source];
	let cameFrom = new Map();
	let gScore = new Map();
	let fScore = new Map();

	gScore.set(source, 0);
	fScore.set(source, heuristic(source, target, nMap));

	while (openSet.length > 0) {
		let current = minFScore(openSet, fScore);

		console.log(current);
		if (current === target) {
			console.log("reached target");
			foundTarget = true;
			reconstructPath(cameFrom, current);
			return;
		}

		let newSet = [];
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i] != current) {
				newSet.push(openSet[i]);
			}
		}
		openSet = newSet;

		for (let neighbor of adj[current]) {
			if (getLink(current, neighbor) == null) {
				console.log(getLink(1, 7));
				console.log(current, neighbor);
			}
			let tentativeGScore =
				gScore.get(current) + getLink(current, neighbor).weight;

			if (
				!gScore.has(neighbor) ||
				tentativeGScore < gScore.get(neighbor)
			) {
				cameFrom.set(neighbor, current);
				gScore.set(neighbor, tentativeGScore);
				fScore.set(
					neighbor,
					tentativeGScore + heuristic(neighbor, target, nMap)
				);

				if (!openSet.includes(neighbor)) {
					openSet.push(neighbor);
				}

				dfsOrder.push(getLink(current, neighbor));
			}
		}
	}
}

function heuristic(node, target, nodeMap) {
	const sourceNode = nodeMap.get(node);
	const targetNode = nodeMap.get(target);

	if (sourceNode && targetNode) {
		const edge = getLink(node, target);

		if (edge) {
			return edge.weight;
		} else {
			console.error("No direct edge between nodes");
			return 0;
		}
	} else {
		console.error("Node not found in nodeMap");
		return 0;
	}
}

function minFScore(openSet, fScore) {
	let minNode = openSet[0];
	let minFScore = fScore.get(minNode);

	for (let node of openSet) {
		let score = fScore.get(node);
		if (score < minFScore) {
			minNode = node;
			minFScore = score;
		}
	}

	return minNode;
}

function reconstructPath(cameFrom, current) {
	let totalPath = [current];
	while (cameFrom.has(current)) {
		current = cameFrom.get(current);
		totalPath.unshift(current);
	}

	startShortestPath = dfsOrder.length;
	for (let i = 0; i < totalPath.length - 1; i++) {
		let link = getLink(totalPath[i], totalPath[i + 1]);
		// dfsOrder.push(link);
		finalPath.push(link);
	}
}
