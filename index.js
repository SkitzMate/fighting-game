//creating constants for canvas and canvas context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//setting canvas size
canvas.width = 1024;
canvas.height = 576;

//filling canvas for visibility
c.fillRect(0, 0, canvas.width, canvas.height);

//creating sprite rules
const gravity = 0.2

class Sprite {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
    }

    //drawing sprite size/colour
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    //update loop for position and velocity, making gravity only work when the sprite is in the air
    update() {
        this.draw()
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }else
        this.velocity.y += gravity
    }
}

//creating player and set position and velocity
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

//creating enemy and set position and velocity
const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
})

console.log(player);

//create animation loop
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
}

animate()