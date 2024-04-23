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
}

//game timer
let timer = 60
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