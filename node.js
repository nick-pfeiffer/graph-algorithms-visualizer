// A Node is a new Node(x, y, id)
// where x is the x coordinate of the node
//       y is the y coordinate of the node
//       id is the id of the node and the text displayed on the node
class Node {
	constructor(x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.pos = createVector(this.x, this.y);
		this.force = createVector(0, 0);
		this.mass = (2 * Math.PI * RAD) / 3;
	}

	update() {
		this.pos = createVector(this.x, this.y);
		let force = this.force.copy();

		// Consider delta time for smoother animation
		let dt = deltaTime / 1000; // Convert milliseconds to seconds
		let vel = force.copy().div(this.mass).mult(dt); // Scale by delta time
		this.pos.add(vel);

		if (this.pos.x > WIDTH - RAD - PADDING) {
			this.pos.x = WIDTH - RAD - PADDING;
		}
		if (this.pos.x < 0 + RAD + PADDING) {
			this.pos.x = 0 + RAD + PADDING;
		}
		if (this.pos.y > HEIGHT - RAD - PADDING) {
			this.pos.y = HEIGHT - RAD - PADDING;
		}
		if (this.pos.y < 0 + RAD + PADDING) {
			this.pos.y = 0 + RAD + PADDING;
		}

		let damping = 0.99; // Adjust damping factor as needed
		this.force.mult(damping);

		this.x = this.pos.x;
		this.y = this.pos.y;
	}

	display(r, borderStrk) {
		this.pos = createVector(this.x, this.y);
		stroke(borderStrk);
		strokeWeight(3);
		fill("white");
		circle(this.x, this.y, r);

		stroke("black");
		strokeWeight(1);
		textSize(20);
		textAlign(CENTER, CENTER);
		fill("black");
		text(this.id, this.x, this.y);
	}
}
