class Obstacle{
    constructor(game, x){
        this.game = game
        this.spriteWidth = 120
        this.spriteHeight = 120
        this.scaledWidth= this.spriteWidth*this.game.ratio
        this.scaledHeight= this.spriteHeight*this.game.ratio
        this.x = x
        this.y=Math.random()* (this.game.height - this.scaledHeight)
        this.collisonX
        this.collisonY
        this.collisonRadius 
        this.speedY = Math.random()<0.5 ? -1*this.game.ratio:1*this.game.ratio
        this.markedForDeletion = false
        this.image = document.getElementById('smallGears')
        this.frameX = Math.floor(Math.random()*4)
    }
    update(){
        this.x -= this.game.speed
        this.y += this.speedY
        this.collisonX = this.x+this.scaledWidth * 0.5
        this.collisonY = this.y+this.scaledHeight * 0.5
        if (!this.game.gameOver){
            if (this.y <= 0 || this.y >= this.game.height - this.scaledHeight ){
                this.speedY *= -1
        } 
        }else {
            this.speedY += 0.1;
        }

        if( this.isOffScreen()){
        this.markedForDeletion = true
        this.game.obstacles = this.game.obstacles.filter(obstacle=>
         !obstacle.markedForDeletion)
         console.log(this.game.obstacles.length)
         this.game.score++
         if(this.game.obstacles.length<=0) 
            this.game.triggerGameOver()
        }
        if(this.game.checkCollison(this, this.game.player)){
           
            this.game.player.collided =true    
            this.game.player.stopCharge()
            this.game.triggerGameOver()
        }
    }
    draw(){
       
        this.game.ctx.drawImage(this.image, this.frameX*this.spriteWidth, 0,this.spriteWidth,this.spriteHeight, this.x , this.y, this.scaledWidth , this.scaledHeight)
       if(this.game.debug){ 
        this.game.ctx.beginPath()
        this.game.ctx.arc(this.collisonX, this.collisonY,this.collisonRadius,0,Math.PI*2)
        this.game.ctx.stroke()
        }
    }
    resize(){
        this.scaleWidth= this.spriteWidth* this.game.ratio
        this.scaleHeight=this.spriteHeight* this.game.ratio
        this.collisonRadius= this.scaledWidth*0.4
    }
    isOffScreen(){
        return this.x< - this.scaleWidth || this.y > this.game.height
    }
}
