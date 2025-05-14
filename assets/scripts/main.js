class Game {
    constructor(canvas, context){
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height / this.baseHeight;
        this.background= new Background(this); 
        this.sound = new AudioControl()
        this.player = new Player(this);
        this.obstacles=[]
        this.numberofObstacles =20
        this.gravity;
        this.speed;
        this.minSpeed
        this.maxSpeed
        this.score
        this.gameOver
        this.bottomMargin
        this.timer
        this.flapscontrol
        this.chargecontrol
        this.message1
        this.message2
        this.smallFont
        this.largeFont
        this.eventTimer = 0
        this.eventInterval = 150
        this.eventUpdate = false
        this.touchStartX
        this.swipeDistance= 50
        // this.debug = true 
        this.restartButton = document.getElementById('restartButton')
        this.resize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        });
        //mouse controls
        this.canvas.addEventListener('mousedown', e =>{
            this.player.flap()

        })
        this.canvas.addEventListener('mouseup', e =>{
            this.player.wingsUp()

        })
        //Keyboard controls
        window.addEventListener('keydown', e=>{
            // console.log(e.key);
            if (e.key===' ' || e.key ==='Enter') this.player.flap()
            if (e.key==='Shift'|| e.key.toLowerCase()==='c') this.player.startCharge() 
            if (e.key.toLocaleLowerCase()==='r')this.resize(window.innerWidth,window.innerHeight)      
        })
        window.addEventListener('keyup', e =>{
            this.player.wingsUp()

        })
    
    //touch controls
    this.canvas.addEventListener('touchstart', e=>{
        this.player.flap()
        this.touchStartX = e.changedTouches[0].pageX
        console.log(e);

    })
    this.canvas.addEventListener('touchmove', e=>{
        if(e.changedTouches[0].pageX- this.touchStartX>this.swipeDistance){
            this.player.startCharge()
        }
    })
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.textAlign = 'right'
        this.ctx.lineWidth= 1
        this.ctx.strokeStyle = 'white'
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ratio = this.height / this.baseHeight;

        this.bottomMargin = Math.floor(50*this.ratio)
        this.smallFont = Math.ceil(20*this.ratio)
        this.largeFont = Math.ceil(45*this.ratio)
        this.ctx.font = this.smallFont + 'px Jersey'
        this.gravity = 0.15 * this.ratio;
        this.speed = 3*this.ratio
        this.minSpeed= this.speed
        this.maxSpeed= this.speed*3
        // this.restartButton =this.Game
        this.background.resize()
        this.player.resize();
        
        
        this.createObstacles()
        this.obstacles.forEach(obstacle=>{
            obstacle.resize()
            
        })
        this.score = 0
        // this.flapscontrol = 'Space/Enter'
        // this.chargecontrol = 'Shift/C'
        this.gameOver = false
        this.timer = 0
    }
    render(deltaTime){
        if(!this.gameOver) this.timer += deltaTime
        this.handlePeriodicEvents(deltaTime)
        this.background.update() ;
        this.background.draw();
        this.drawStatusText()
        this.player.update() 
        this.player.draw()
        
        this.obstacles.forEach(obstacle=>{
        obstacle.update()
        obstacle.draw()
    })    
    }
    createObstacles(){
        this.obstacles=[]
        const firstX = this.baseHeight* this.ratio
        const obstaclespacing = 600* this.ratio
        for(let i = 0; i<this.numberofObstacles; i++){
            this.obstacles.push(new Obstacle(this, firstX + i * obstaclespacing))
        }
    }
        checkCollison(a, b){
            const dx = a.collisonX - b.collisonX
            const dy = a.collisonY - b.collisonY
            const distance = Math.hypot(dx,dy)
            const sumofRadii = a.collisonRadius + b.collisonRadius
            return distance<= sumofRadii
        }
    
    formatTimer(){
        return (this.timer*0.001).toFixed(1)
    }
    handlePeriodicEvents(deltaTime){
        if (this.eventTimer< this.eventInterval){
            this.eventTimer += deltaTime
            this.eventUpdate = false

        } else {
            this.eventTimer = this.eventTimer % this.eventInterval
            this.eventUpdate = true
            
        }

    }
    triggerGameOver(){
        if(!this.gameOver){
            this.gameOver = true
            if(this.obstacles.length<=0){
                this.sound.play(this.sound.win)
                this.message1 ="YOU WON!!!!!"
            this.message2 = " BUT YOU CAN GO FASTER" +'   '+ this.formatTimer()+ ' seconds'   
            }else{
                this.sound.play(this.sound.lose)
                this.message1 = "GAME OVER!!"
            this.message2 = " TIME "+ this.formatTimer()+ 'seconds!'
            }
        }
    }
    drawStatusText(){
        this.ctx.save()
       
        this.ctx.fillText('Score: '+ this.score,this.width-this.smallFont,this.largeFont);
        //  this.ctx.fillText('Flap: '+ this.flapscontrol, this.smallFont,this.largeFont)
        //  this.ctx.fillText('Charge: '+ this.chargecontrol ,this.smallFont,this.largeFont)
         
        this.ctx.textAlign = 'left'
        this.ctx.fillText('Timer: '+ this.formatTimer(),this.smallFont,this.largeFont)
        
       
        
        
        if(this.gameOver){
            this.ctx.textAlign = 'center'
            this.ctx.font = this.largeFont+'px Jersey'
            this.ctx.fillText(this.message1, this.width*0.5,this.height*0.5-this.largeFont,this.width)
            this.ctx.font = this.smallFont+'px Jersey'
            this.ctx.fillText(this.message2, this.width*0.5,this.height*0.5-this.smallFont,this.width)
            this.ctx.fillText("Press 'R' to try again!!", this.width*0.5,this.height*0.5,this.width)

        }
        if(this.player.energy<=this.player.minEnergy) this.ctx.fillStyle = 'red'
        else if (this.player.energy>=this.player.maxEnergy) 
            this.ctx.fillStyle = 'orangered'
        for(let i = 0; i <this.player.energy; i++){
            this.ctx.fillRect(10,this.height -10- this.player.barSize *i,15,this.player.barSize*5,this.player.barSize)
        }
        this.ctx.restore()
    }  
}

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);
    let lastTime = 0
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime= timeStamp
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(deltaTime);
         requestAnimationFrame(animate);
    }
        if(!game.gameOver){requestAnimationFrame(animate)};
});