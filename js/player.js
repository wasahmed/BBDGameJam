function Player(x,y){
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.xspeed = 0;
    this.yspeed = 0;
    this.maxspeed = 10;
    this.friction = 0.6;

    this.step = function(){
        if(rightKey)
            this.xspeed ++;
        else if(leftKey)
            this.xspeed --;
        else if(upKey)
            this.yspeed --;
        else if(downKey)
            this.yspeed ++;
        else if(!leftKey && !rightKey || leftKey && rightKey){
            this.xspeed *= this.friction;
        }
        if(!upKey && !downKey || upKey && downKey){
            this.yspeed *= this.friction;
        }

        //correct speed
        if (this.xspeed > this.maxspeed){
            this.xspeed = this.maxspeed
        }else if (this.xspeed < -this.maxspeed){
            this.xspeed = -this.maxspeed;
        }
        if (this.yspeed > this.maxspeed){
            this.yspeed = this.maxspeed
        }else if (this.yspeed < -this.maxspeed){
            this.yspeed = -this.maxspeed;
        }
        if(this.xspeed > 0)
            this.xspeed = Math.floor(this.xspeed);
        else {
            this.xspeed = Math.ceil(this.xspeed);
        }
        if(this.yspeed > 0)
            this.yspeed = Math.floor(this.yspeed);
        else {
            this.yspeed = Math.ceil(this.yspeed);
        }


        //collisions
        let horizontalRect = {
            x: this.x + this.xspeed,
            y: this.y,
            width: this.width,
            height: this.height
        }
        let verticalRect = {
            x: this.x,
            y: this.y + this.yspeed,
            width: this.width,
            height: this.height
        }

        //check intersections
        for(let i = 0; i < borders.length; i++){
            let borderRect = {
                x: borders[i].x,
                y: borders[i].y,
                width: borders[i].width,
                height: borders[i].height
            }
            if(checkIntersection(horizontalRect,borderRect)){
                while(checkIntersection(horizontalRect,borderRect)){
                    horizontalRect.x -= Math.sign(this.xspeed);
                }
                this.x = horizontalRect.x;
                this.xspeed = 0;
            }
            if(checkIntersection(verticalRect,borderRect)){
                while(checkIntersection(verticalRect,borderRect)){
                    verticalRect.y -= Math.sign(this.yspeed);
                }
                this.y = verticalRect.y;
                this.yspeed = 0;
            }
        }

        this.x += this.xspeed;
        this.y += this.yspeed;

      
    }

    this.draw = function(){
       ctx.fillStyle = "green";
       ctx.fillRect(this.x, this.y,this.width,this.height) 
    }
}