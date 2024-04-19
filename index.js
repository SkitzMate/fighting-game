//creating constants for canvas and canvas context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//setting canvas size
canvas.width = 1024;
canvas.height = 576;

//filling canvas for visibility
c.fillRect(0, 0, canvas.width, canvas.height);

//creating sprite rules
const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const playerAnimations = {
    idle: { folder: './img/windHashashin/PNG/idle', numFrames: 8 },
    run: { folder: './img/windHashashin/PNG/run', numFrames: 8 },
    jump: { folder: './img/windHashashin/PNG/jump', numFrames: 3 },
    fall: { folder: './img/windHashashin/PNG/fall', numFrames: 3 },
    attack: { folder: './img/windHashashin/PNG/attack', numFrames: 8 },
    takeHit: { folder: './img/windHashashin/PNG/takeHit', numFrames: 6 },
    death: { folder: './img/windHashashin/PNG/death', numFrames: 19 }
}

//creating player and set position and velocity
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    animations: playerAnimations
})

//load and play idle animation
player.loadAnimationFrames()
player.playAnimation('idle')

//creating enemy and set position and velocity
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    colour: 'blue'
})

console.log(player);

//setting up keys constant for movement
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

//create animation loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    enemy.update();

    if (player.position.y + player.height >= 396) {
        // Player has landed, so set isJumping to false
        player.isJumping = false;
    }

    const isPlayerMoving = player.velocity.x !== 0; // Check if player is moving

    // Play run animation if player is moving horizontally
    if (isPlayerMoving && !player.isAttacking && !player.isJumping) {
        player.playAnimation('run');

    } else if (!player.isAttacking && !player.isJumping && player.position.y + player.height >= 396) {
        player.playAnimation('idle');
    } // <-- Here's the missing closing brace for the else if block

    if (player.isJumping) {
        if (!isPlayerMoving && !player.isAttacking && !player.isJumping && player.position.y + player.height >= 396) {
            player.playAnimation('idle');
        } else if (isPlayerMoving && !player.isAttacking && !player.isJumping && player.position.y + player.height >= 396) {
            player.playAnimation('idle');
        }
    }

    // Other animation logic...

    //const isEnemyMoving = keys.ArrowLeft.pressed || keys.ArrowRight.pressed;

    
    //if (!isEnemyMoving) {
        //enemy.playAnimation('idle');

    //set default velocity
    player.velocity.x = 0
    enemy.velocity.x = 0

    //player Movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //detect collisons for player
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking) 
        {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    //detect collisions for enemy
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking) 
        {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

decreaseTimer()

animate()
//listener for keydown events and setting what each does
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //player keys
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            if (player.position.y + player.height >= 396) {
            }
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            if (player.position.y + player.height >= 396) {
            }
            break
        case 'w':
            if (player.position.y + player.height >= 396) {
                player.velocity.y = -20
                player.playAnimation('jump')
                player.isJumping = true
                setTimeout(() => {
                    player.playAnimation('fall');
                }, 500); // Assuming frameDuration is the duration of each frame in milliseconds
            }
            break
        case ' ':
            player.attack()
            player.playAnimation('attack')
            break
        
        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
            }
})

//listener for keyup events
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //player keys
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        
        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})