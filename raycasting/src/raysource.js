
class RaySource {
    constructor() {
        this.position = createVector(width / 2, height / 2);
    }

    render() {
        fill(255);
        ellipse(this.position.x, this.position.y, 4);
    }

    castRays(walls, xPos, yPos, lightAngle) {
        let trueX = xPos-500;
        let trueY = -(yPos-500);
        let angleOffset = getAngle(0,0,trueX,trueY);
        this.fieldOfView = [];
        for (let angle = 0; angle < lightAngle; angle += 0.25) {
            this.fieldOfView.push(new Ray(this.position, radians(angle-(lightAngle/2)-angleOffset)));
        }
        for (let ray of this.fieldOfView) {
            // point with closest distance to the wall
            let closest = null;
            let record = Infinity;
            for (let wall of walls) {
                const intersection = ray.cast(wall);
                if (intersection) {
                    const currentDistance = p5.Vector.dist(this.position, intersection);
                    if (currentDistance < record) {
                        record = currentDistance;
                        closest = intersection;
                    }
                }
            }
            if (closest) {
                strokeWeight(0.125);
                stroke(255);
                line(this.position.x, this.position.y, closest.x, closest.y);
            }
        }
    }
    
}

function getAngle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI; 
    return theta;
}