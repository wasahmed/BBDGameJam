
class Ray {
    constructor(posVec, angle) {
        this.position = posVec;
        this.direction = p5.Vector.fromAngle(angle);
    }

    render() {
        strokeWeight(1);
        stroke(255);
        push();
            translate(this.position.x, this.position.y);
            line(0, 0, this.direction.x * 10, this.direction.y * 10);
        pop();
    }

    setDirection(x ,y) {
        this.direction.x = x - this.position.x;
        this.direction.y = y - this.position.y;
        this.direction.normalize();
    }

    cast(wall) {
        // using wikipedia line-line collision
        const x1 = wall.start.x;
        const x2 = wall.end.x;
        const y1 = wall.start.y;
        const y2 = wall.end.y;

        // only looking at positive side of ray for collision
        const x3 = this.position.x;
        const x4 = this.position.x + this.direction.x;
        const y3 = this.position.y;
        const y4 = this.position.y + this.direction.y;
        
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        // division by 0, wall and vector are parallel
        if (denominator == 0) {
            return;
        }

        // calculate intersection points: t on wall, u on ray
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

        if (t > 0 && t < 1 && u > 0) {
            const intersectionPoint = createVector();
            intersectionPoint.x = x1 + t * (x2 - x1);
            intersectionPoint.y = y1 + t * (y2 - y1);
            return intersectionPoint;
        }
        else {
            return;
        }
    }
}