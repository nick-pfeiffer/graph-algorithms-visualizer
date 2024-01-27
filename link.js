// A Link is a new Link(source, target)
// Where source is a Node representing the start of the line
//       target is a Node representing the end of the line
new p5();
class Link {
	constructor(source = null, target = null, weight = -1) {
		this.source = source;
		this.target = target;
		this.current = new Node(this.target.x, this.target.y, -1);
		this.weight = weight;
		this.angle = 0;
	}

	equal(ln) {
		if (
			ln.source == null ||
			ln.target == null ||
			this.source == null ||
			this.target == null
		) {
			return false;
		}
		if (WEIGHTED) {
			if (this.source.weight != this.target.weight) return false;
		}

		if (
			(ln.source.id == this.source.id &&
				ln.target.id == this.target.id) ||
			(ln.source.id == this.target.id && ln.target.id == this.source.id)
		) {
			return true;
		}
		return false;
	}

	display(startColor, endColor) {
		strokeWeight(STROKE_WEIGHT);
		stroke(endColor);

		let minX, minY, maxX, maxY;
		if (WEIGHTED) {
			let DISTANCE = 10;
			let slope = getSlope(
				this.source.x,
				this.source.y,
				this.target.x,
				this.target.y
			);
			let intercept = getIntercept(
				this.source.x,
				this.source.y,
				this.target.x,
				this.target.y
			);

			let angle = Math.atan(slope);
			let adjacent = DISTANCE * Math.cos(angle);
			let opposite = DISTANCE * Math.sin(angle);

			let midX = (this.target.x + this.source.x) / 2;
			let midY = (this.target.y + this.source.y) / 2;
		}
		line(this.source.x, this.source.y, this.current.x, this.current.y);

		// maybe change this to red so it's clear where the starting point is
		this.source.display(RAD, startColor);
		if (
			dist(
				this.current.x,
				this.current.y,
				this.target.x,
				this.target.y
			) <=
			RAD / 2
		) {
			this.target.display(RAD, endColor);
		} else {
			this.target.display(RAD, "black");
		}
	}

	animate() {
		tempX = map(this.angle, 0, 100, this.source.x, this.target.x, 1);
		tempY = map(this.angle, 0, 100, this.source.y, this.target.y, 1);

		this.current = new Node(tempX, tempY, -1);
		if (tempX == this.target.x && tempY == this.target.y) {
			animationDone = true;
		}
		this.angle += SPEED;
	}

	calcDist() {
		return dist(this.source.x, this.source.y, this.target.x, this.target.y);
	}
}
