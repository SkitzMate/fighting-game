/*
    File: classes.js
    Author: Dylan Farquhar
    Matriculation number: 40489350
    last Edit: 23/04/2024
    Description: This file contains the classes for my javascript fighting game project.
*/

//game over initialisation
class Game {
    constructor() {
        this.gameOver = false
        }
}

//sprite creation
class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
    }

    //drawing sprite size/colour
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
    
    //update loop drawing the sprites and background
    update() {
        this.draw()
    }
}

//all rules for my fighter sprites, initialising flags for sprite actions
class Fighter {
    constructor({ position, velocity, colour = 'red', offset, animations }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.isDead
        this.isHit
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 120,
            height: 50,
        }
        this.colour = colour
        this.isAttacking
        this.isJumping
        this.health = 100
        this.animations = animations
        this.animationFrames = {}
        this.currentFrameIndex = 0
        this.frameDuration = 100
        this.animationInterval
    }

    //logs to check animation frames load correctly
    loadAnimationFrames(isPlayer) {
        const entityType = isPlayer ? `player` : `enemy`;
        console.log(`loading ${entityType} animation frames...`)
        for (let key in this.animations) {
            console.log(`loading frames for ${entityType} animation: ${key}`)
            const frames = []
            const folderPath = this.animations[key].folder
            const numFrames = this.animations[key].numFrames

            //setting up counter to cycle through frames
            for (let i = 1; i <= numFrames; i++) {
                const imagePath = `${folderPath}/${i}.png`
                const image = new Image
                image.src = imagePath
                frames.push(image)
            }
            this.animationFrames[key] = frames
        }
        console.log(`${entityType} animation frames loaded:`, this.animationFrames)
    }

    //code for cycling through animation frames
    playAnimation(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName
            this.currentFrameIndex = 0
            clearInterval(this.animationInterval)
            this.animationInterval = setInterval(() => {
                if (animationName === 'death' && this.currentFrameIndex === this.animationFrames[this.currentAnimation].length - 1) {
                    clearInterval(this.animationInterval)
                } else {
                    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.animationFrames[this.currentAnimation].length
                }
            }, this.frameDuration);
        }
    }

    //drawing sprite and animation frame
    draw() {
            const animationFrames = this.animationFrames[this.currentAnimation];
            if (animationFrames) {
                const frame = animationFrames[this.currentFrameIndex];
                if (frame) {
                    c.drawImage(frame, this.position.x, this.position.y);
                }
            }
    }

    //update loop for position and velocity, making gravity only work when the sprite is in the air
    update() {
        const floorBoundary = canvas.height - 178
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 180) {
            this.velocity.y = 0;
        } else {
        this.velocity.y += gravity
        }
    }

    //creating attack window
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 500)
    }
}