var human;
var tech, bullets, road, coins;
var score, gameState, equipment, amounts;
var botSound, playerImg, roadImg, coinImg, bulletImg, standingImg, techImg2
var bulletGroup, techGroup, coinGroup;
var bullet, techs;
var start, startImg;
var minutes, seconds, milliseconds, hours, minutesBest, secondsBest, millisecondsBest, hoursBest;
var coinSound, techSound, min1Sound, bulletSound, loseSound
var restart, restartImg;

function preload() {
    playerImg = loadAnimation("Runner-1.png", "Runner-2.png")
    roadImg = loadImage("Road.png")
    bulletImg = loadImage("bullet.png")
    standingImg = loadImage("Runner-1.png")
    techImg2 = loadImage("tech2.png")
    coinImg = loadImage("bitcoin.png")
    startImg = loadImage("start.png")
    coinSound = loadSound("coin.mp3")
    techSound = loadSound("tech.mp3")
    min1Sound = loadSound("win.mp3")
    bulletSound = loadSound("bullet.mp3")
    loseSound = loadSound("lose.wav")
    restartImg = loadImage("restart.png")

}


function setup() {
    createCanvas(windowWidth, windowHeight)

    

    techGroup = createGroup()        

    road = createSprite(width / 2, height / 2)
    road.addImage("ground", roadImg)

    start = createSprite(width / 2, height / 2.0)
    start.addImage(startImg)
    start.scale = 0.8


    human = createSprite(width / 2, 638)
    human.addAnimation("standing", standingImg)
    human.addAnimation("running", playerImg)
    human.scale = 0.1

    coinGroup = createGroup()

    milliseconds = 0
    seconds= 0
    minutes = 0
    hours = 0

    restart = createSprite(width / 2, height / 2 + 150)
    restart.scale = 0.25
    restart.visible = false
    restart.addImage("button", restartImg)
    //restart.debug = true
    restart.setCollider("circle", 0,0,290)

    bulletGroup = createGroup()

    score = 5
    gameState = "Serve"
    equipment = 0
    amounts = 0
    
    minutesBest = 0
    hoursBest = 0
    milliBest = 0
    secondsBest = 0



    time = [milliseconds, seconds, minutes, hours]
    timeBest = [milliBest, secondsBest, hoursBest, minutesBest]
}

function draw() {
   
    console.log(gameState)

    if (gameState == "Serve") {
        background("yellow")
  
        road.visible = false;
        
        fill("Blue")
        textFont("Monospace")
        textSize(20)

        text("Press 'Start Button' to Start.", width / 60, height / 8.5)
        if (mousePressedOver(start) && gameState=='Serve') {
            gameState = "Play"
            start.destroy()
            console.log("Game started")
        }

        let h5 = createElement(
            'p', 'Hit the coins and tech! If you get 50 tech, you will get 5 coins! "<br> If you get 20 coins, you will get 2 more lives. <br> You will lose one life, if you get hit by a bullet.'
        );
        h5.style('color', 'blue');
        h5.position(width / 2+50, height / 100);
        h5.style("font-size", "20px")

        text("Lives: " + score, 20, 20)
        text("Tech: " + equipment, 20, 40)
        text("Coins: " + amounts, 20, 60)
    }
    textSize(30)

    text(str(hours) + ":" + str(minutes) + ":" + str(seconds), 20, 150)

    
    if (gameState == "Play") {
        road.visible = true
        start.visible = false
        human.changeAnimation("running", playerImg)
        human.x = World.mouseX
        road.velocityY = 7
        human.visible = true
        spawnBullets()
        spawnTech()
        spawnCoins()

        if (human.isTouching(coinGroup)) {
            coinSound.play()
        }

        if (human.isTouching(techGroup)) {
            techSound.play()
        }

        if (road.y > 868) {
            road.y = 686
        }
        
        milliseconds += 1
       
        if (milliseconds == 60 ) {
            milliseconds = 0            
            seconds += 1
        }
   
        if (seconds == 60 ) {
            seconds = 0            
            if (seconds == 0) {
                minutes += 1
            }
            min1Sound.play() 
        }

        if (minutes == 60 ) {
            minutes = 0            
            if (minutes == 0) {
                hours += 1
            }
        }


        if (bulletGroup.isTouching(human)) {
            bulletSound.play()

            for (let i = 0; i < bulletGroup.length; i++) {
                let sprite = bulletGroup.get(i)

                if (sprite.isTouching(human)) {
                    sprite.velocityY = 0
                    sprite.destroy()
                    score -= 1
                }
            }
        }


        if (coinGroup.isTouching(human)) {
            for (let i = 0; i < coinGroup.length; i++) {
                let sprite = coinGroup.get(i)

                if (sprite.isTouching(human)) {
                    sprite.velocityY = 0
                    sprite.destroy()
                    amounts += 1
                }
            }

        }

        if (techGroup.isTouching(human)) {
            for (let i = 0; i < techGroup.length; i++) {
                let sprite = techGroup.get(i)

                if (sprite.isTouching(human)) {
                    sprite.velocityY = 0
                    sprite.destroy()
                    equipment += 1
                }
            }
        }

        if (score <= 0) {
            gameState = "Over"
        }
        
        if (equipment == 5) {
            equipment = 0
            amounts += 1
        }

        if (amounts >= 10) {
            score += 2
            amounts = 0
        }

    }

    drawSprites()

    textFont("Monospace")
    textSize(20)

    if (gameState == "Over" || gameState == "Play") {
        fill("white")
        start.destroy()
        removeElements()
        textFont("Monospace")
        textSize(20)
        text("Lives: " + score, 20, 20)
        text("Tech: " + equipment, 20, 40)
        text("Coins: " + amounts, 20, 60)
    }

    if (gameState == "Over") {
        background("red")
        human.visible = false
        road.visible = false
        road.velocityY = 0
        techGroup.destroyEach()
        coinGroup.destroyEach()
        bulletGroup.destroyEach()

        fill("yellow")
        textFont('monospace')
        textSize(50)
        text("You have lost! Try Again ", width / 3, height / 2-100)
        fill("white")
        textFont("Monospace")
        textSize(20)
        text("Lives: " + score, 20, 20)
        text("Tech: " + equipment, 20, 40)
        text("Coins: " + amounts, 20, 60)
        loseSound.play()

        fill("white")
        text(str(hours) + ":" + str(minutes) + ":" + str(seconds), 20, 100)
        restart.visible = true
        
        
        if (mousePressedOver(restart) && gameState =='Over') {
            console.log("game restarted")
            gameState = "Serve"
            reset()
        }
        drawSprites()
    }


    
    
    
}

function spawnBullets() {
    if (World.frameCount % Math.round(random(100, 200)) == 0) {
        bullets = createSprite(Math.round(random(50, width - 50), 40, 10, 10));
        bullets.addImage("shooting", bulletImg)
        bullets.scale = 0.2
        bullets.velocityY = 6
        bulletGroup.add(bullets)
    }
}

function spawnTech() {
    if (World.frameCount % Math.round(random(100, 200)) == 0) {
        tech = createSprite(Math.round(random(50, width - 50), 40, 10, 10));
        tech.scale = 0.2
        tech.velocityY = 6
        techGroup.add(tech)
        tech.addImage("floating", techImg2)
    }
}

function spawnCoins() {
    if (World.frameCount % Math.round(random(100, 200)) == 0) {
        coins = createSprite(Math.round(random(50, width - 50), 40, 10, 10));
        coins.scale = 0.2
        coins.velocityY = 6
        coinGroup.add(coins)
        coins.addImage("falling", coinImg)
    }
}

function reset() {
    score = 5
    
    amounts = 0
    equipment = 0
    milliseconds = 0
    
    seconds = 0
    minutes = 0
    hours = 0

    gameState = "Serve"

    restart.destroy()
    start = createSprite(width / 2, height / 2.0)
    start.addImage(startImg)
    start.scale = 0.8
    start.depth = road.depth+1
}



