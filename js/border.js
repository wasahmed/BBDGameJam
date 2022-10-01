function Border(x,y,width,height,type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    this.draw = function(){
        if(this.type === 1){
            ctx.fillStyle = "black";
        }
        else if (this.type === 2){
            ctx.fillStyle = "red";
        }
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}