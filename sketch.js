const WIDTH = 400;
const HEIGHT = 400;
const RAD = 35;

// nodes is a ListOf Node
let nodes = [];

// links is a ListOf Link
let links = [];

// curLink is one of:
//   - Empty Link, if we are not currently displaying DFS
//   - NonEmpty Link, representing the current link that we are displaying (highlighted red)
let curLink = new Link(new Node(), new Node());

// dfsOrder is a ListOf Link
// where each element represents a Link that goes from a source Node to a target Node
let dfsOrder = [];

// dI is an iterator used for traversing dfsOrder
let dI = 0;

// displaying is a boolean representing whether or not we are currently
// displaying a DFS animation
let displaying = false;

// draggingId is one of:
// 	  - -1, if there is no node being dragged currently
//    - Positive Number, representing the id of the node being dragged
let draggingId = -1;

let timer = 0;
let animTimer = 0;
let animFrames = 100;
let prevX = 0;

var tempX;
var tempY;
let speed = 1;
let ready = true;
let animating = false;

let wait = false;
let first = 0;
let extraWait = 0;
let ignore = false;

function setup() {
	createCanvas(WIDTH, HEIGHT);
}

function draw() {
	if (displaying) first++;
	if (!displaying) background("white");

	if (curLink.source.x != null) {
		if (!wait) {
			ready = false;
			curLink.animate();
			if (!displaying) console.log("not displaying");
			if (dI >= dfsOrder.length || extraWait == 2000) {
				curLink.displayLine("black", "red", "#4ac27c");
				extraWait = 2000;
			} else {
				curLink.displayLine("black", "red", "");
			}
		}

		if (ready && !wait) {
			animTimer = millis();
			wait = true;
			ignore = true;
		}

		// if (ready && wait) wait = true;
		if (ready && millis() >= 1000 + extraWait + animTimer) {
			wait = false;
			ignore = false;
		}
	}

	if (!ignore && (!displaying || (ready && !wait))) {
		if (displaying) {
			if (dI == dfsOrder.length) {
				curLink = new Link(new Node(), new Node());
				dfsOrder = [];
				displaying = false;
			} else {
				curLink = dfsOrder[dI];
				prevX = curLink.source.x;
				dI++;
			}
			timer = millis();
		}

		nodes.forEach((node) => {
			if (draggingId == node.id) {
				node.x = mouseX;
				node.y = mouseY;
			}
		});

		background("white");
		links.forEach((ln) => {
			strokeWeight(3);
			stroke("black");
			if (curLink.equal(ln)) {
			}
			line(ln.source.x, ln.source.y, ln.target.x, ln.target.y);
		});

		nodes.forEach((node) => {
			node.display(
				RAD,
				node.id == curLink.target.id
					? dI == dfsOrder.length
						? "black"
						: "black"
					: "black"
			);
		});
	}
}

function mousePressed() {
	nodes.forEach((node) => {
		if (dist(node.x, node.y, mouseX, mouseY) < RAD) {
			draggingId = node.id;
		}
	});
}

function mouseReleased() {
	draggingId = -1;
}

window.onload = () => {
	document.querySelector(".adj-input").addEventListener("input", () => {
		processInput(document.querySelector(".adj-input").value);
	});
	document.querySelector(".dfs").addEventListener("click", () => {
		displaying = true;
		dfs(1, 7, []);
	});
};
