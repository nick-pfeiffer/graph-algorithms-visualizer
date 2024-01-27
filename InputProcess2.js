function processInput(text) {
	let newPart = "";
	if (text.length > prevText.length) {
		newPart = text.substring(prevText.length);
	}

	text = trimAll(text);

	if (!validEntries(text)) {
		errorMsg = "invalid text entry";
		return;
	} else if (!validWeight(text)) {
		if (WEIGHTED) {
			errorMsg = "You must include a third value for weight";
		} else {
			errorMsg = "No weight should be listed";
		}
		return;
	} else {
		errorMsg = "";
	}

	console.log(validEntries(text), validWeight(text), validInput(text));
	// if (!validInput(newPart) && newPart != "") {
	// 	console.log("Inavlid New Part: ", newPart);
	// 	return;
	// }
	if (!validInput(text)) {
		error = "enter weights for edges";
		return;
	} else {
		error = "";
	}
	prevText = text;

	links = [];

	let newNodeMap = new Map();

	let n = 0;
	let minNode = Number.MAX_SAFE_INTEGER;
	let arr = text.split("\n");
	let tempIds = [[]];
	arr.forEach((line) => {
		let nums = line.split(" ");
		let first = nums[0];
		let second = nums[1];
		let third;
		if (WEIGHTED) third = Number(nums[2]);

		first = Number(first);
		second = Number(second);

		if (
			isNaN(Number(first)) ||
			isNaN(Number(second)) ||
			(WEIGHTED && isNaN(Number(third)))
		) {
			return;
		}

		n = max(n, first, second);
		minNode = min(minNode, first, second);

		if (getLink(first - 1, second - 1)) {
			// console.log(getLink(first - 1, second - 1));
			// getLink(first - 1, second - 1).weight = third;
			// getLink(second - 1, first - 1).weight = third;
			// console.log(getLink(first - 1, second - 1));
		}
		if (nodeMap.has(first - 1) && nodeMap.has(second - 1)) {
			links.push(
				new Link(nodeMap.get(first - 1), nodeMap.get(second - 1), third)
			);
			if (UNDIRECTED) {
				links.push(
					new Link(
						nodeMap.get(second - 1),
						nodeMap.get(first - 1),
						third
					)
				);
			}
			// newNodeMap.set(first - 1, nodeMap.get(first - 1));
			// newNodeMap.set(second - 1, nodeMap.get(second - 1));
		} else if (nodeMap.has(first - 1)) {
			let vals = getAvailable();
			let newNode = new Node(vals[0], vals[1], second);
			links.push(new Link(nodeMap.get(first - 1), newNode, third));
			if (UNDIRECTED) {
				links.push(new Link(newNode, nodeMap.get(first - 1), third));
			}
			nodeMap.set(second - 1, newNode);

			// let newVals = getAvailable(newNodeMap);
			// let newNewNode = new Node(newVals[0], newVals[1], second);
			// newNodeMap.set(first - 1, nodeMap.get(first - 1));
			// newNodeMap.set(second - 1, newNewNode);
		} else if (nodeMap.has(second - 1)) {
			let vals = getAvailable();
			let newNode = new Node(vals[0], vals[1], first);
			links.push(new Link(newNode, nodeMap.get(second - 1), third));
			if (UNDIRECTED) {
				links.push(new Link(nodeMap.get(second - 1), newNode, third));
			}
			nodeMap.set(first - 1, newNode);

			// let newVals = getAvailable(newNodeMap);
			// let newNewNode = new Node(newVals[0], newVals[1], second);

			// newNodeMap.set(first - 1, newNewNode);
			// newNodeMap.set(second - 1, nodeMap.get(second - 1));
		} else {
			let vals1 = getAvailable();

			// let newVals1 = getAvailable(newNodeMap);
			// let newNewNode1 = new Node(newVals1[0], newVals1[1], first);
			let newVals2;
			let newNewNode2;

			let newNode1 = new Node(vals1[0], vals1[1], first);
			let newNode2;
			let vals2;
			while (true) {
				vals2 = getAvailable();
				newVals2 = getAvailable(newNodeMap);

				if (dist(vals1[0], vals1[1], vals2[0], vals2[1]) >= RAD) {
					newNode2 = new Node(vals2[0], vals2[1], second);
					break;
				}

				// if (
				// 	dist(newVals1[0], newVals1[1], newVals2[0], newVals2[1]) >=
				// 	RAD
				// ) {
				// 	newNewNode2 = new Node(newVals2[0], newVals2[1], second);
				// 	break;
				// }
			}
			links.push(new Link(newNode1, newNode2, third));
			if (UNDIRECTED) {
				links.push(new Link(newNode2, newNode1, third));
			}
			nodeMap.set(first - 1, newNode1);
			nodeMap.set(second - 1, newNode2);

			// newNodeMap.set(first - 1, newNewNode1);
			// newNodeMap.set(second - 1, newNewNode2);
		}

		tempIds.push([first, second]);
	});
	// nodeMap = newNodeMap;

	for (let i = 0; i <= n; i++) {
		adj[i] = [];
	}

	tempIds.forEach((temp) => {
		if (temp.length == 2) {
			adj[temp[0]].push(temp[1]);
			adj[temp[1]].push(temp[0]);
		}
	});

	if (!userInputtedStart) {
		startingNode = minNode;
	}
	if (!userInputtedGoal) {
		goalNode = n;
	}
}

function validWeight(text) {
	let validLength = 2;
	if (WEIGHTED) {
		validLength = 3;
	}
	let arr = text.split("\n");
	let anyGood = false;
	for (let i = 0; i < arr.length; i++) {
		let line = arr[i];
		let nums = line.split(" ");
		if (nums.length != validLength) {
			return false;
			// continue;
		}
		anyGood = true;
	}
	return anyGood;
}

function validEntries(text) {
	let arr = text.split("\n");
	let anyGood = false;
	for (let i = 0; i < arr.length; i++) {
		let line = arr[i];
		let nums = line.split(" ");
		if (nums[0] == "" || nums[1] == "" || (WEIGHTED && nums[2] == "")) {
			return false;
			// continue;
		}
		if (
			isNaN(Number(nums[0])) ||
			isNaN(Number(nums[1])) ||
			(WEIGHTED && isNaN(Number(nums[2])))
		) {
			return false;
		}
		anyGood = true;
	}
	return anyGood;
}

function validInput(text) {
	if (!isNaN(Number(text)) && text != "") {
		// add digit case
	}
	let validLength = 2;
	if (WEIGHTED) {
		validLength = 3;
	}
	let arr = text.split("\n");
	let anyGood = false;
	for (let i = 0; i < arr.length; i++) {
		let line = arr[i];
		let nums = line.split(" ");
		if (nums.length != validLength) {
			continue;
		}
		if (nums[0] == "" || nums[1] == "" || (WEIGHTED && nums[2] == "")) {
			continue;
		}
		if (
			isNaN(Number(nums[0])) ||
			isNaN(Number(nums[1])) ||
			(WEIGHTED && isNaN(Number(nums[2])))
		) {
			return false;
		}

		anyGood = true;
	}
	return anyGood;
}

function getNode(id) {
	let ans = null;
	nodeMap.forEach((node, curId) => {
		if (node.id == id) ans = node;
	});
	if (ans == null) console.log("node does not exist");
	return ans;
}

function getAvailable() {
	let i = 0;
	while (true) {
		let valid = true;
		let first = Math.random() * WIDTH;
		let second = Math.random() * HEIGHT;

		if (first < RAD) continue;
		if (first > WIDTH - RAD) continue;
		if (second < RAD) continue;
		if (second > HEIGHT - RAD) continue;

		nodeMap.forEach((node) => {
			if (dist(first, second, node.x, node.y) <= RAD * 2) {
				valid = false;
			}
		});

		if (valid) return [first, second];
		i++;
	}
}

function trimAll(text) {
	let ans = "";
	let arr = text.split("\n");
	for (let i = 0; i < arr.length; i++) {
		ans += arr[i].trim();
		if (i != arr.length - 1) ans += "\n";
	}
	return ans;
}
