/*
    File: utils.js
    Author: Dylan Farquhar
    Matriculation number: 40489350
    last Edit: 23/04/2024
    Description: This file contains the most of the functions for my javascript fighting game project.
*/

//collision detector
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

//function for win and draw conditions
function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    if (!this.gameOver) {
      document.querySelector('#displayText').style.display = 'flex'
      setTimeout(() => {
        if (player.isDead && enemy.isDead) {
            document.querySelector('#displayText').innerHTML = 'Mutual Destruction!'
          } else if (player.health > enemy.health) {
              document.querySelector('#displayText').innerHTML = 'Player 1 Wins!'
          } else if (player.health < enemy.health) {
              document.querySelector('#displayText').innerHTML = 'Player 2 Wins!'
          }
          }, 100);
          this.gameOver = true
        }

        //function for hiding the winner text and displaying the play again button
        if (this.gameOver) {
          setTimeout(() => {
            document.getElementById('displayText').style.display = 'none'
            document.getElementById('playAgain').style.display = 'block'
          }, 3500);
        }

      
      //event listener for play again button
      document.getElementById('playAgain').addEventListener('click', () => {
        window.location.href = 'game.html';
      })
}

//game timer
let timer = 30
let timerId

function decreaseTimer(){
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer --
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        document.querySelector('#displayText').style.display = 'flex'
        determineWinner({player, enemy, timerId})
    }
}