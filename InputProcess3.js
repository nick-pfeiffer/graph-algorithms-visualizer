function processInput(text) {
	console.log("WEIGHTED: ", WEIGHTED);

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

	let newNm = new Map();

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

		// if (
		// 	isNaN(Number(first)) ||
		// 	isNaN(Number(second)) ||
		// 	(WEIGHTED && isNaN(Number(third)))
		// ) {
		// 	return;
		// }

		n = max(n, first, second);
		minNode = min(minNode, first, second);

		// console.log(nums);
		if (nums.length == 1) {
			if (nodeMap.has(first - 1)) {
				if (!newNm.has(first - 1)) {
					newNm.set(first - 1, nodeMap.get(first - 1));
				}
			} else {
				if (!newNm.has(first - 1)) {
					let newVals = getAvail(newNm);
					let newNode = new Node(newVals[0], newVals[1], first);
					newNm.set(first - 1, newNode);
				}
			}
		} else if (nodeMap.has(first - 1) && nodeMap.has(second - 1)) {
			let existingNode1 = nodeMap.get(first - 1);
			let existingNode2 = nodeMap.get(second - 1);
			if (newNm.has(first - 1)) {
				existingNode1 = newNm.get(first - 1);
			}
			if (newNm.has(second - 1)) {
				existingNode2 = newNm.get(second - 1);
			}
			links.push(new Link(existingNode1, existingNode2, third));
			if (UNDIRECTED) {
				links.push(new Link(existingNode2, existingNode1, third));
			}

			if (!newNm.has(first - 1)) {
				newNm.set(first - 1, nodeMap.get(first - 1));
			}
			if (!newNm.has(second - 1)) {
				newNm.set(second - 1, nodeMap.get(second - 1));
			}
			newNm.set(first - 1, nodeMap.get(first - 1));
			newNm.set(second - 1, nodeMap.get(second - 1));
		} else if (nodeMap.has(first - 1)) {
			let vals = getAvailable();
			let newNode = new Node(vals[0], vals[1], second);
			nodeMap.set(second - 1, newNode);

			let newVals = getAvail(newNm);
			let nnn = new Node(newVals[0], newVals[1], second);

			let existingNode = nodeMap.get(first - 1);
			if (!newNm.has(first - 1)) {
				newNm.set(first - 1, nodeMap.get(first - 1));
			} else {
				existingNode = newNm.get(first - 1);
			}

			newNm.set(second - 1, nnn);

			links.push(new Link(existingNode, nnn, third));
			if (UNDIRECTED) {
				links.push(new Link(nnn, existingNode, third));
			}
		} else if (nodeMap.has(second - 1)) {
			let vals = getAvailable();
			let newNode = new Node(vals[0], vals[1], first);
			nodeMap.set(first - 1, newNode);

			let newVals = getAvail(newNm);
			let nnn = new Node(newVals[0], newVals[1], first);
			newNm.set(first - 1, nnn);

			let existingNode = nodeMap.get(second - 1);
			if (!newNm.has(second - 1)) {
				newNm.set(second - 1, nodeMap.get(second - 1));
			} else {
				existingNode = newNm.get(second - 1);
			}

			links.push(new Link(nnn, existingNode, third));
			if (UNDIRECTED) {
				links.push(new Link(existingNode, nnn, third));
			}
		} else {
			let vals1 = getAvailable();
			let newNode1 = new Node(vals1[0], vals1[1], first);
			let newNode2;
			let vals2;
			while (true) {
				vals2 = getAvailable();

				if (dist(vals1[0], vals1[1], vals2[0], vals2[1]) >= RAD) {
					newNode2 = new Node(vals2[0], vals2[1], second);
					break;
				}
			}
			let newvals1 = getAvail(newNm);
			let newnewNode1 = new Node(newvals1[0], newvals1[1], first);
			let newnewNode2;
			let newvals2;
			while (true) {
				newvals2 = getAvail(newNm);

				if (
					dist(newvals1[0], newvals1[1], newvals2[0], newvals2[1]) >=
					RAD
				) {
					newnewNode2 = new Node(newvals2[0], newvals2[1], second);
					break;
				}
			}
			// if (first == 1 && second == 3) {
			// 	console.log(
			// 		newnewNode1.x,
			// 		newnewNode1.y,
			// 		newnewNode2.x,
			// 		newnewNode2.y
			// 	);
			// }
			links.push(new Link(newnewNode1, newnewNode2, third));
			if (UNDIRECTED) {
				links.push(new Link(newnewNode2, newnewNode1, third));
			}
			nodeMap.set(first - 1, newNode1);
			nodeMap.set(second - 1, newNode2);

			newNm.set(first - 1, newnewNode1);
			newNm.set(second - 1, newnewNode2);
			// newNodeMap.set(first - 1, newNewNode1);
			// newNodeMap.set(second - 1, newNewNode2);
		}

		if (nums.length != 1) {
			tempIds.push([first, second]);
		}
	});
	nodeMap = newNm;

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
	console.log("INSIDE VALID");
	let validLength = 2;
	if (WEIGHTED) {
		validLength = 3;
	}
	let arr = text.split("\n");
	let anyGood = false;
	for (let i = 0; i < arr.length; i++) {
		let line = arr[i];
		let nums = line.split(" ");
		// console.log(nums.length, validLength);
		if (nums.length != 1 && nums.length != validLength) {
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
		// console.log(nums);
		if (nums.length == 1 && !isNaN(Number(nums[0]))) {
			// console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
			anygood = true;
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

		if (i > 1000) {
			return [first, second];
		}

		nodeMap.forEach((node) => {
			if (dist(first, second, node.x, node.y) <= RAD * 2) {
				valid = false;
			}
		});

		if (valid) return [first, second];
		i++;
	}
}

function getAvail(newNm) {
	let i = 0;
	while (true) {
		let valid = true;
		let first = Math.random() * WIDTH;
		let second = Math.random() * HEIGHT;

		if (newNm == null) {
			console.log("NULLLL");
			return;
		}

		if (first < RAD) continue;
		if (first > WIDTH - RAD) continue;
		if (second < RAD) continue;
		if (second > HEIGHT - RAD) continue;

		if (i > 1000) {
			return [first, second];
		}

		newNm.forEach((node, id) => {
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
