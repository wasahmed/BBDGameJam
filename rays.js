
window.addEventListener('DOMContentLoaded', (event) =>{


    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });




    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');


    tutorial_canvas.style.background = "#000000"


    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){

            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 0
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
           tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
        }
    }

    class Observer{
        constructor(){
            this.body = new Circle( 350, 350, 10, "white")
            this.ray = []
            this.rayrange = 640
            this.globalangle = Math.PI
            this.gapangle = Math.PI/6
            this.edge1 = new Circle(0,0,10,"red")
            this.edge2 = new Circle(0,0,10,"red")
            this.currentangle = 0
            this.obstacles = []


        }
        beam(){

            this.currentangle  = this.gapangle/2

            for(let k = 0; k<1000; k++){

                this.currentangle+=(this.gapangle/500)
                let ray = new Circle(this.body.x, this.body.y, 1, "white",((this.rayrange * (Math.cos(this.globalangle+this.currentangle))))/this.rayrange*2, ((this.rayrange * (Math.sin(this.globalangle+this.currentangle))))/this.rayrange*2 )
       
            ray.collided = 0
            ray.lifespan = this.rayrange-1
            this.ray.push(ray)

            }

            for(let f = 0; f<this.rayrange/2; f++){
                for(let t = 0; t<this.ray.length; t++){
                    if(this.ray[t].collided == 1){
                        
                    }else{
                        this.ray[t].move()

                    this.ray[t].lifespan--
                    if(this.ray[t].lifespan <= 0){
                        this.collided = 1
                    }
                    for(let q = 0; q<this.obstacles.length; q++){
                        if(this.ray[t].x > this.obstacles[q].x){
                            if(this.ray[t].y > this.obstacles[q].y){
                                if(this.ray[t].x < this.obstacles[q].x+this.obstacles[q].width){
                                    if(this.ray[t].y < this.obstacles[q].y+this.obstacles[q].height){
                                        this.ray[t].collided = 1
                                    }
                                }
                            }
                        }
                        if(intersects(this.obstacles[q], this.ray[t])){
                            this.ray[t].collided = 1
                        }
                    }
                    }
                }
            }

        }
        draw(){

            this.beam()
            this.body.draw()
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.body.x, this.body.y)

            for(let y = 0; y<this.ray.length; y++){
            tutorial_canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
            }
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.fillStyle = "red"
            tutorial_canvas_context.fill()
            this.ray =[]
        }
        control(){

            if(keysPressed['t']){
                this.globalangle += .05
            }
            if(keysPressed['r']){
                this.globalangle -= .05
            }

        }

    }

    class Player{
        
        constructor(){
            this.body = new Rectangle( 300, 500, 50, 50, "green")
            this.borders = []
            this.xspeed = 0;
            this.yspeed = 0;
            this.maxspeed = 10;
            this.friction = 0.1;
        }
        draw(){
            this.body.draw()
            tutorial_canvas_context.beginPath()
        }
        control(){

            if(keysPressed['d'])
                this.xspeed ++;
            else if(keysPressed['a'])
                this.xspeed --;
            else if(keysPressed['w'])
                this.yspeed --;
            else if(keysPressed['s'])
                this.yspeed ++;
            else if(!keysPressed['a'] && !keysPressed['d'] || keysPressed['a'] && keysPressed['d']){
                this.xspeed *= this.friction;
            }
            if(!keysPressed['w'] && !keysPressed['s'] || keysPressed['w'] && keysPressed['s']){
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
                x: this.body.x + this.xspeed,
                y: this.body.y,
                width: this.body.width,
                height: this.body.height
            }
            let verticalRect = {
                x: this.body.x,
                y: this.body.y + this.yspeed,
                width: this.body.width,
                height: this.body.height
            }
    
            //check intersections
            for(let i = 0; i < this.borders.length; i++){
                let borderRect = {
                    x: this.borders[i].x,
                    y: this.borders[i].y,
                    width: this.borders[i].width,
                    height: this.borders[i].height
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
    
            this.body.x += this.xspeed;
            this.body.y += this.yspeed;
    
          
        }

    }

    let observer = new Observer()
    let player = new Player()

    observer.obstacles.push(player.body)

    for(let k = 0; k<5; k++){
        let tempRectangle = new Rectangle(Math.random()*tutorial_canvas.width,Math.random()*tutorial_canvas.height, 5+Math.random()*70, 5+Math.random()*70, "blue")
        observer.obstacles.push(tempRectangle)
        player.borders.push(tempRectangle)
    }

    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0, 0, tutorial_canvas.width, tutorial_canvas.height)  
        observer.draw()
        observer.control()
        player.draw()
        player.control()
        for(let p = 0; p<observer.obstacles.length; p++){
            observer.obstacles[p].draw()
        }
    }, 14) 

    function intersects(circle, left) {
        var areaX = left.x - circle.x;
        var areaY = left.y - circle.y;
        return areaX * areaX + areaY * areaY <= circle.radius * circle.radius*1.1;
    }

    function checkIntersection(r1,r2){
        if (r1.x >= r2.x + r2.width){
            return false;
        }
        else if (r1.x + r1.width <= r2.x){
            return false;
        }
        else if (r1.y >= r2.y + r2.height){
            return false;
        }
        else if (r1.y + r1.height <= r2.y){
            return false;
        }else{
            return true;
        }
    }


// random color that will be visible on  black background
function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 15)+1)];
    }
    return color;
  }

    
})