var  gameState = 'play';
var score = 0, life = 3;

function preload(){
  policeImg = loadAnimation ('Images/p1.png', 'Images/p2.png','Images/p3.png','Images/p4.png',
  'Images/p5.png','Images/p6.png','Images/pj7.png','Images/pj9.png' )

  policeJump = loadAnimation ('Images/pj8.png')
  policeDie =  loadAnimation ('Images/pD.png')
  
  bgImg = loadImage('Images/bg.jpg')

  alienImg = loadAnimation("Images/v1.png","Images/v2.png","Images/v3.png","Images/v4.png","Images/v5.png")
  
  platform1 = loadImage('Images/Platform1.png')
  platform2 = loadImage('Images/Platform2.png')

  bulletImg = loadImage('Images/bullet.png')

  restartImg = loadImage('Images/restart.png');
  gameOverImg = loadImage("Images/GameOver.png");
  playImg = loadImage("Images/play.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight+5,);

  bg = createSprite(200,250, width, height)
  bg.addImage(bgImg)
  bg.scale = 1.275
  bg.velocityX = -1;

  police = createSprite(150,height-200,30,80)
  police.addAnimation("run", policeImg)
  police.addAnimation("jump", policeJump)
  police.addAnimation("die", policeDie)

  ground =createSprite(width/2,height-80, width, 20 )
  ground.visible = false;

  aliensGroup = new Group()
  platformsGroup = new Group()
  bulletsGroup = new Group()

  gameOver = createSprite(width/2,height/2-150)
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.scale = 0.15
  play = createSprite(width/2,height/2)
  play.addImage(playImg)
  play.scale = 0.5
  gameOver.visible = false;
  restart.visible = false;
  play.visible = false
  }

function draw() {
  background('#470C68');  
  drawSprites();

  fill (255)
  textSize(30)
  text('Score: ' + score, camera.position.x+400,50)
  text('Life: ' + life, camera.position.x-600,50)
  
  if(gameState === 'play') {
  police.x = camera.position.x - 400

  bg.velocityX = -(1+ Math.round(score/10));

  if(bg.x < 610) {
    bg.x = width/2
  }


  if(police.y > height+100) {
    police.y = ground.y;
}


  if(keyDown("up")){
    police.velocityY =  -7
  }

  if(keyWentDown("up")) {
    police.changeAnimation("jump",policeJump);
  }

  if(keyWentUp("up")) {
    police.changeAnimation("run", policeImg);
  }

  if (keyWentDown('space'))   {
    bullet = createSprite(police.x+73,police.y - 39,10,10)
    bullet.addImage(bulletImg)
    bullet.scale = 0.015
    bullet.velocityX=10;
    bulletsGroup.add(bullet)
  }

  if (aliensGroup.isTouching(bulletsGroup)){
    score += 10
    aliensGroup[0].destroy()
    bulletsGroup[0].destroy()
    platformsGroup[0].destroy()
  }

  if(aliensGroup.isTouching(police)) {
    life -= 1
    police.velocityX = 0;
    police.velocityY = 0;
    police.y = ground.y-10
    police.changeAnimation("die", policeDie)
    police.scale = 1.5
    gameState = 'end'
  }

  
  police.velocityY += 0.9;
  police.collide(ground)
  police.collide(platformsGroup)

  spawnPlatforms()
}

else if(gameState === 'end') {
    bg.velocityX = 0
    aliensGroup.setVelocityXEach(0)
    platformsGroup.setVelocityXEach(0)
    aliensGroup.setLifetimeEach(0)
    platformsGroup.destroyEach()
    gameOver.visible = true;

    if(life !== 0) {
      play.visible = true;
      
      if(mousePressedOver(play)){
        police.changeAnimation("run", policeImg)
        police.scale = 1
        play.visible = false;
        gameOver.visible=false;
        gameState = 'play'
      }
    }

    else {
        restart.visible = true
        if(mousePressedOver(restart)){
          location.reload() 
        }
      }
  }

}

function spawnPlatforms() {
  if(frameCount % 150=== 0) {
    posY = random(100, 350)
    platform = createSprite(width,posY,100,60)
    velocity = -( 2 + Math.round(score/10))
    platform.velocityX = velocity
    platform.lifetime = 1000
    platformsGroup.add(platform)
    
    var aY;
    var rand = Math.round(random(1,2))
    if( rand === 1) {
      platform.addImage(platform1)
      platform.scale = 0.45
      aY = 100
    }
    else {
      -platform.addImage(platform2)
      platform.scale = 0.3
      aY = 125

    }    

    alien =  createSprite(width+50,posY-aY,30,80)
    alien.velocityX = velocity
    alien.addAnimation("stand", alienImg )
    alien.scale= 0.25
    alien.lifetime = 1000
    aliensGroup.add(alien)
  }
}

     
