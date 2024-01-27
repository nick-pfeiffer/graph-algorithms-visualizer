let prevText = "previous text";

function processInput(text) {
	if (prevText == text.substring(0, prevText.length)) return;
	let n = 0;
	let tempLinks = [];
	text.split("\n").forEach((ln) => {
		// console.log(text);
		if (ln.split(" ") <= 1 || ln.split(" ")[1] == "") return;
		let f1 = ln.split(" ")[0];
		let s1 = ln.split(" ")[1];

		if (f1 == undefined || s1 == undefined) return;

		let f2 = parseInt(f1.replace("[^0-9.]", ""));
		let s2 = parseInt(s1.replace("[^0-9.]", ""));

		n = Math.max(n, f2, s2);

		if (isNaN(f2) || isNaN(s2)) return;

		f2--;
		s2--;

		tempLinks.push({ first: f2, second: s2 });
	});

	// Call draw function with nodes and lines arrays
	if (n > 0) {
		for (let i = 0; i <= n; i++) {
			adj[i] = [];
		}

		for (let i = 0; i < n; i++) {
			let vals = getAvailable();
			nodeMap.set(i, new Node(vals[0], vals[1], i + 1));
		}

		tempLinks.forEach((temp) => {
			links.push(
				new Link(nodeMap.get(temp.first), nodeMap.get(temp.second))
			);

			adj[temp.first + 1].push(temp.second + 1);
			adj[temp.second + 1].push(temp.first + 1);
		});
		prevText = text;
	}
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

		nodeMap.forEach((node, id) => {
			if (dist(first, second, node.x, node.y) <= RAD * 2) {
				valid = false;
			}
		});

		if (valid) return [first, second];
		i++;
	}
}
