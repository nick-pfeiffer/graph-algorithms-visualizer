const WIDTH = 400;
const HEIGHT = 400;
const RAD = 45;
const FORCE_CONSTANT = 5000;
const PADDING = 0;
let WEIGHTED = false;
let UNDIRECTED = true;
const startingEdges = `1 3\n1 4\n2 3\n4 7\n3 5\n2 8\n3 6`;
// const startingEdges = `1 3\n1 4`;
let FORCE_MODE = true;
let prevText = startingEdges;

let startShortestPath = -1;

// nodes is a ListOf Node
let nodeMap = new Map();

// links is a ListOf Link
let links = [];

// curLink is one of:
//   - Empty Link, if we are not currently displaying DFS
//   - NonEmpty Link, representing the current link that we are displaying (highlighted red)
let curLink = new Link(new Node(), new Node());

// dfsOrder is a ListOf Link
// where each element represents a Link that goes from a source Node to a target Node
let dfsOrder = [];

let finalPath = [];
let willDisplayShortest = false;

// dI is an iterator used for traversing dfsOrder
let dI = 0;

// draggingId is one of:
// 	  - -1, if there is no node being dragged currently
//    - Positive Number, representing the id of the node being dragged
let draggingId = -1;

let animTimer = 0;

var tempX;
var tempY;
let SPEED = 1;
const SHORTEST_PATH_SPEED_CHANGE = 1;
let animationDone = true;
let displayShortest = false;

const STROKE_WEIGHT = 3;

let startingNode = 1;
let goalNode = -1;

// adj is a ListOf (ListOf Node IDs)
// representing an adjacency matrix that we use for DFS traversal
let adj = [[]];

let userInputtedStart = false;
let userInputtedGoal = false;

var errorMsg = "";

var mode = 0;

let displayingError = false;

let courierFont;
function preload() {
	courierFont = loadFont("/assets/CourierPrime-Regular.ttf");
}

function setup() {
	var container = createDiv();
	container.class("canvas-container"); // Optional: Add a class to the container for styling

	var myCanvas = createCanvas(WIDTH, HEIGHT);
	myCanvas.parent(document.querySelector(".canvas"));
}

function draw() {
	if (errorMsg != "") {
		if (displayingError) return;

		displayError();
		displayingErorr = true;
		return;
	} else {
		// console.log(textFont());
		textFont("Helvetica");
		displayingError = false;
	}

	if (mode == 0) {
		if (FORCE_MODE) {
			applyForces();
		} else {
			resetForces();
		}
		nodeMap.forEach((node, id) => {
			// console.log(id);
			node.update();
		});

		background("white");
		nodeMap.forEach((node, id) => {
			if (draggingId == node.id) {
				document.body.style.userSelect = "none";
				let newX = constrain(
					mouseX,
					0 + RAD + PADDING,
					WIDTH - RAD - PADDING
				);
				let newY = constrain(
					mouseY,
					0 + RAD + PADDING,
					HEIGHT - RAD - PADDING
				);
				let changeX = node.x - newX;
				let changeY = node.y - newY;
				node.x = newX;
				node.y = newY;
			}
		});
		render();
	} else if (mode == 1) {
		if (millis() - animTimer >= 1000) {
			if (dI >= dfsOrder.length) {
				mode = 0;

				if (displayShortest) {
					console.log("completely finished");
					SPEED -= SHORTEST_PATH_SPEED_CHANGE;
				}

				if (willDisplayShortest) {
					dfsOrder = finalPath;
					dI = 0;
					mode = 1;
					resetAngles();
					displayShortest = true;
					willDisplayShortest = false;
				} else {
					return;
				}
			}
			curLink = dfsOrder[dI];
			dI++;
			mode = 2;
			background("white");
			render();
		}
	}
	if (mode == 2) {
		animationDone = false;
		curLink.animate();
		if (displayShortest) {
			SPEED += SHORTEST_PATH_SPEED_CHANGE;
			curLink.display("black", "#26e052");
		} else {
			curLink.display("black", "red");
		}

		if (animationDone) {
			mode = 1;
			animTimer = millis();
		}
	}
}

function render() {
	background("white");
	links.forEach((ln) => {
		strokeWeight(STROKE_WEIGHT);
		stroke("black");
		line(ln.source.x, ln.source.y, ln.target.x, ln.target.y);

		if (WEIGHTED) {
			let DISTANCE = 10;
			let slope = getSlope(
				ln.source.x,
				ln.source.y,
				ln.target.x,
				ln.target.y
			);
			let intercept = getIntercept(
				ln.source.x,
				ln.source.y,
				ln.target.x,
				ln.target.y
			);

			let angle = Math.atan(slope);
			let adjacent = DISTANCE * Math.cos(angle);
			let opposite = DISTANCE * Math.sin(angle);

			let midX = (ln.target.x + ln.source.x) / 2;
			let midY = (ln.target.y + ln.source.y) / 2;
			stroke("white");
			strokeWeight(STROKE_WEIGHT + 1);
			strokeCap(SQUARE);
			line(
				midX - adjacent,
				midY - opposite,
				midX + adjacent,
				midY + opposite
			);

			stroke("black");
			strokeWeight(1);
			textSize(20);
			textAlign(CENTER, CENTER);
			fill("black");
			// text(ln.weight, midX + xChange, midY + yChange);
			text(ln.weight, midX, midY);
		}
	});

	nodeMap.forEach((node, id) => {
		node.display(RAD, "black");
	});
}

function mousePressed() {
	nodeMap.forEach((node, id) => {
		if (dist(node.x, node.y, mouseX, mouseY) < RAD) {
			draggingId = node.id;
		}
	});
}

function mouseReleased() {
	document.body.style.userSelect = "";
	draggingId = -1;
}

window.onload = () => {
	document.querySelector(".adj-input").addEventListener("input", () => {
		processInput(document.querySelector(".adj-input").value);
	});
	document.querySelector(".dfs").addEventListener("click", () => {
		// dfs(1, 7, []);
		setPlaceholders();
		dfs(startingNode, goalNode, []);
		mode = 1;
	});
	document.querySelector(".bfs").addEventListener("click", () => {
		setPlaceholders();
		bfs(1);
		mode = 1;
	});
	document.querySelector(".dijkstras").addEventListener("click", () => {
		setPlaceholders();
		// dijkstra(1);
		willDisplayShortest = true;
		dijkstra(startingNode, goalNode);
		mode = 1;
	});
	document.querySelector(".astar").addEventListener("click", () => {
		setPlaceholders();
		willDisplayShortest = true;
		astar(startingNode, goalNode, nodeMap);

		// setTimeout(() => {
		mode = 1;
		// }, 2000);
	});
	document.querySelector(".speed-input").addEventListener("input", () => {
		SPEED = Number(document.querySelector(".speed-input").value);
	});

	document
		.querySelector(".starting-index-input")
		.addEventListener("input", () => {
			userInputtedStart = true;
			startingNode = Number(
				document.querySelector(".starting-index-input").value
			);
		});

	document
		.querySelector(".goal-index-input")
		.addEventListener("input", () => {
			userInputtedGoal = true;
			goalNode = Number(
				document.querySelector(".goal-index-input").value
			);
		});

	document.querySelector(".force-switch").addEventListener("change", () => {
		FORCE_MODE = !FORCE_MODE;
	});

	document.querySelector(".weight-switch").addEventListener("change", () => {
		WEIGHTED = !WEIGHTED;
		processInput(document.querySelector(".adj-input").value);
	});

	document.querySelector(".adj-input").innerHTML = startingEdges;
	processInput(document.querySelector(".adj-input").value);
	// console.log(nodeMap);
};

function setPlaceholders() {
	if (document.querySelector(".starting-index-input").value == "") {
		document.querySelector(".starting-index-input").value = startingNode;
	}
	if (document.querySelector(".goal-index-input").value == "") {
		document.querySelector(".goal-index-input").value = goalNode;
	}
}

const GRAVITY_CONSTANT = 0.01;
const REPULSION_CONSTANT = 5000;
const REPULSION_DISTANCE = 200;
const ATTRACTION_CONSTANT = 0.1;

function applyForces() {
	// Apply gravity towards the center of the canvas
	for (const [id, node] of nodeMap.entries()) {
		let center = createVector(WIDTH / 2, HEIGHT / 2);
		let forceDirection = center.copy().sub(node.x, node.y);
		let gravity = forceDirection.mult(GRAVITY_CONSTANT);
		node.force.add(gravity);
	}

	// Apply repulsive force between nodes within a certain distance
	for (const [id1, node1] of nodeMap.entries()) {
		for (const [id2, node2] of nodeMap.entries()) {
			if (id1 !== id2) {
				let pos1 = createVector(node1.x, node1.y);
				let pos2 = createVector(node2.x, node2.y);
				let dir = pos2.copy().sub(pos1);
				let distance = dir.mag();

				if (distance < REPULSION_DISTANCE) {
					// Ensure that distance is not too small to avoid extreme forces
					distance = max(distance, 5);

					let force = dir
						.normalize()
						.mult(REPULSION_CONSTANT / (distance * distance));
					node1.force.add(force.copy().mult(-1));
					node2.force.add(force);
				}
			}
		}
	}

	// Apply attraction force for connected nodes
	for (const link of links) {
		let node1 = nodeMap.get(link.source);
		let node2 = nodeMap.get(link.target);

		if (node1 && node2) {
			let pos1 = createVector(node1.x, node1.y);
			let pos2 = createVector(node2.x, node2.y);
			let dir = pos2.copy().sub(pos1);
			let force = dir.mult(ATTRACTION_CONSTANT);

			node1.force.add(force);
			node2.force.sub(force);

			// Apply damping near canvas boundaries
			let damping = 0.001;
			if (node1.x <= 100 || node1.x >= WIDTH - 100) {
				node1.force.x *= damping;
			}
			if (node2.x <= 100 || node2.x >= WIDTH - 100) {
				node2.force.x *= damping;
			}
			if (node1.y <= 100 || node1.y >= HEIGHT - 100) {
				node1.force.y *= damping;
			}
			if (node2.y <= 100 || node2.y >= HEIGHT - 100) {
				node2.force.y *= damping;
			}
		}
	}
}

function resetForces() {
	nodeMap.forEach((node, id) => {
		node.force = createVector(0, 0);
	});
}

function getSlope(x1, y1, x2, y2) {
	return (y2 - y1) / (x2 - x1);
}

function getIntercept(x1, y1, x2, y2) {
	return y1 - getSlope(x1, y1, x2, y2) * x1;
}

function getLink(a, b) {
	for (let i = 0; i < links.length; i++) {
		if (links[i].source.id == a && links[i].target.id == b) {
			return links[i];
		}
		if (!UNDIRECTED) {
			if (links[i].target.id == a && links[i].source.id == b) {
				return links[i];
			}
		}
	}
	return null;
}

function resetAngles() {
	links.forEach((link) => {
		link.angle = 0;
	});
}

function displayError() {
	background("white");
	strokeWeight(0);
	fill("#ed6464");
	rect(0, 0, WIDTH, 30);
	textSize(15);
	fill("black");
	textFont(courierFont);
	stroke(10);
	text(errorMsg, WIDTH / 2, 15);
	textAlign(CENTER, CENTER);
}
