class Player {
    constructor(game){
        this.game = game;
        this.x = 20;
        this.y;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.width;
        this.height;
        this.speedY;
        this.flapSpeed;
        this.collisonX 
        this.collisonY
        this.collisonRadius
        this.collided
        this.energy =30
        this.maxEnergy = this.energy*2
        this.minEnergy= 15
        this.charging
        this.image = document.getElementById('player_fish')
        this.frameY
    }
    draw(){
       
        this.game.ctx.drawImage(this.image, 0, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight , this.x, this.y, this.width,this.height)
        if(this.game.debug){  
        this.game.ctx.beginPath()
        this.game.ctx.arc(this.collisonX + this.collisonRadius*0.9,this.collisonY,this.collisonRadius,0,Math.PI*2)
        this.game.ctx.stroke()}
    }
    update(){
        this.handleEnergy()
        if(this.speedY>=0)this.wingsUp()
        this.y += this.speedY;
        this.collisonY = this.y + this.height * 0.5
        if (!this.isTouchingBottom() && !this.charging){
            this.speedY += this.game.gravity;
        } else {
            this.speedY = 0   
        }
        // bottom boundary
        if (this.isTouchingBottom()){
            this.y = this.game.height - this.height - this.game.bottomMargin
            this.wingsIdle( )
        }
    }
    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -5 * this.game.ratio;
        this.flapSpeed = 4* this.game.ratio;
        this.collisonRadius = 40*this.game.ratio
        this.collisonX = this.x +this.width*0.5
        this.collided = false
        this.barSize = Math.floor(5*this.game.ratio)
        this.energy = 30
        this.frameY=0
        this.charging = false
    }
    startCharge(){
        if(this.energy>=this.minEnergy && !this.charging){
        this.charging = true
        this.game.speed = this.game.maxSpeed
        this.wingsCharge()
        this.game.sound.charge.play(this.game.sound.charge)
    }else{
        this.stopCharge()
    }
        
    }
    stopCharge(){
        this.charging = false
        this.game.speed = this.game.minSpeed
    }
    wingsIdle(){
        if(!this.charging) this.frameY=0
    }
    wingsDown(){
        if(!this.charging) this.frameY=1
    }
    wingsUp(){
        if(!this.charging)  this.frameY=2
    }
    wingsCharge(){
        this.frameY=3
    }
    isTouchingtop(){
        return this.y<=0;
    }
    isTouchingBottom(){
        return this.y >= this.game.height - this.height-this.game.bottomMargin

    }
    handleEnergy(){
        if(this.game.eventUpdate){

        
        if (this.energy<this.maxEnergy){
            this.energy+=1
        }
        if(this.charging){
            this.energy-=5
            if(this.energy<=0){
            this.energy+= 0
            this.stopCharge()
        }
        }
    }
        
        
    }
    flap(){
        this.stopCharge()
        
        if (!this.isTouchingtop()){
            
            this.speedY =  -this.flapSpeed;
            this.game.sound.play(this.game.sound.flap5)
            this.wingsDown()
        }
    }
}