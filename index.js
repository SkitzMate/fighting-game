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

const enemyAnimations = {
    idle: { folder: './img/fireKnight/png/fire_knight/idle', numFrames: 8 },
    run: { folder: './img/fireKnight/png/fire_knight/run', numFrames: 8 },
    jump: { folder: './img/fireKnight/png/fire_knight/jump', numFrames: 18 },
    attack: { folder: './img/fireKnight/png/fire_knight/attack', numFrames: 11 },
    takeHit: { folder: './img/fireKnight/png/fire_knight/takeHit', numFrames: 6 },
    death: { folder: './img/fireKnight/png/fire_knight/death', numFrames: 13 },
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
    animations: playerAnimations,
    colour: 'red'
})

//load and play idle animation (player)
player.loadAnimationFrames(true)
player.playAnimation('idle')

//creating enemy and set position and velocity
const enemy = new Fighter({
    position: {
        x: 300,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    animations : enemyAnimations,
    colour: 'blue'
})

enemy.loadAnimationFrames(false)
enemy.playAnimation('idle')

console.log(player);
console.log(enemy);

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
    if (!player.isDead && isPlayerMoving && !player.isHit && !player.isAttacking && !player.isJumping) {
        player.playAnimation('run');

    } else if (!player.isDead && !player.isHit && !player.isAttacking && !player.isJumping && player.position.y + player.height >= 396) {
        player.playAnimation('idle');
    } // <-- Here's the missing closing brace for the else if block

    if (player.isJumping) {
        if (!player.isDead && !player.isHit && !isPlayerMoving && !player.isAttacking && !player.isJumping && player.position.y + player.height >= 396) {
            player.playAnimation('idle');
        } else if (!player.isDead && !player.isHit && isPlayerMoving && !player.isAttacking && !player.isJumping && player.position.y + player.height >= 396) {
            player.playAnimation('idle');
        }
    }

    const isEnemyMoving = enemy.velocity.x !== 0; // Check if enemy is moving

    // Play run animation if enemy is moving horizontally
    if (!enemy.isDead && isEnemyMoving && !enemy.isHit && !enemy.isAttacking && !enemy.isJumping) {
        enemy.playAnimation('run');

    } else if (!enemy.isDead && !enemy.isHit && !enemy.isAttacking && !enemy.isJumping && enemy.position.y + enemy.height >= 396) {
        enemy.playAnimation('idle');
    }

    if (enemy.isJumping) {
        if (!enemy.isDead && !enemy.isHit && !isEnemyMoving && !enemy.isAttacking && !enemy.isJumping && enemy.position.y + enemy.height >= 396) {
            enemy.playAnimation('idle');
        } else if (!enemy.isDead && !enemy.isHit && isEnemyMoving && !enemy.isAttacking && !enemy.isJumping && enemy.position.y + enemy.height >= 396) {
            enemy.playAnimation('idle');
        }
    }

    //set default velocity
    player.velocity.x = 0
    enemy.velocity.x = 0

    //player Movement
    if (!player.isDead && keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (!player.isDead && keys.d.pressed && player.lastKey === 'd') {
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
        player.isAttacking) {
        enemy.health -= 1.5
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        enemy.isHit = true
        enemy.playAnimation('takeHit')
        setTimeout(() => {
            enemy.isHit = false;
        }, 500);

        if (enemy.health <=0) {
            enemy.isDead = true
            enemy.playAnimation('death')
        }
    }

    //detect collisions for enemy
    if (!player.isDead && rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking) 
        {
        player.health -= 1.5
        document.querySelector('#playerHealth').style.width = player.health + '%';
        player.isHit = true
        player.playAnimation('takeHit')
        setTimeout(() => {
            player.isHit = false;
        }, 500);

        if (player.health <=0) {
            player.isDead = true
            player.playAnimation('death')
        }
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
            if (!player.isDead && player.position.y + player.height >= 396) {
                player.velocity.y = -20
                player.playAnimation('jump')
                player.isJumping = true
                setTimeout(() => {
                    player.playAnimation('fall');
                }, 500); // Assuming frameDuration is the duration of each frame in milliseconds
            }
            break
        case ' ':
            if (!player.isHit && !player.isDead) {
                player.attack()
                player.playAnimation('attack')
                }
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
            if (!enemy.isDead && enemy.position.y + enemy.height >= 396) {
                enemy.velocity.y = -20
                enemy.playAnimation('jump')
                enemy.isJumping = true
                setTimeout(() => {
                    enemy.isJumping = false
                }, 500);
            }
            break
        case 'ArrowDown':
            if (!enemy.isHit && !enemy.isDead) {
                enemy.attack()
                enemy.playAnimation('attack')
            }
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