let WINDOW_WIDTH
let WINDOW_HEIGHT
let RADIUS
let MARGIN_TOP
let MARGIN_LEFT
let balls = []
const colors = [
  '#fee410',
  '#33b5e5',
  '#0099cc',
  '#aa66cc',
  '#9933cc',
  '#99cc00',
  '#669900',
  '#ffbb33',
  '#ff8800',
  '#ff4444'
]

const endTime = new Date(2020,1,14,18,12,21)
var curShowTimeSeconds = 0

WINDOW_WIDTH = document.documentElement.clientWidth
WINDOW_HEIGHT = document.documentElement.clientHeight
MARGIN_TOP = Math.round(WINDOW_HEIGHT/5)
MARGIN_LEFT = Math.round(WINDOW_WIDTH/10)
RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1

window.onload = function(){
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')

  canvas.width = WINDOW_WIDTH
  canvas.height = WINDOW_HEIGHT

  curShowTimeSeconds = getCurrentShowTimeSeconds()
  setInterval(()=>{
    render(context)
    update()
  },50)

  render(context)
}

function update(){
  var nextShowTimeSeconds = getCurrentShowTimeSeconds()
  var nextHours = parseInt(nextShowTimeSeconds/3600)
  var nextMinutes = parseInt((nextShowTimeSeconds - (nextHours*3600))/60)
  var nextSeconds = parseInt(nextShowTimeSeconds % 60)
  
  var curHours = parseInt(curShowTimeSeconds/3600)
  var curMinutes = parseInt((curShowTimeSeconds - (curHours*3600))/60)
  var curSeconds = parseInt(curShowTimeSeconds % 60)

  if(nextSeconds != curSeconds){
    if(parseInt(curHours/10) != parseInt(nextHours/10)){
      addBalls(MARGIN_LEFT+0, MARGIN_TOP,parseInt(curHours/10))
    }
    if(parseInt(curHours%10) != parseInt(nextHours%10)){
      addBalls(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP,parseInt(curHours/10))
    }
    if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
      addBalls(MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP,parseInt(curMinutes/10))
    }
    if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
      addBalls(MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP,parseInt(curMinutes/10))
    }
    if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
      addBalls(MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP,parseInt(curSeconds/10))
    }
    if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
      addBalls(MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP,parseInt(curSeconds/10))
    }
    
    curShowTimeSeconds = nextShowTimeSeconds
  }
  updateBalls()
}

function render(context){
  context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

  var hours = parseInt(curShowTimeSeconds/3600)
  var minutes = parseInt((curShowTimeSeconds - (hours*3600))/60)
  var seconds = parseInt(curShowTimeSeconds % 60)

  renderDigit(MARGIN_LEFT ,MARGIN_TOP , parseInt(hours/10), context)
  renderDigit(MARGIN_LEFT + 15*(RADIUS+1) ,MARGIN_TOP , parseInt(hours%10), context)
  renderDigit(MARGIN_LEFT + 30*(RADIUS+1) ,MARGIN_TOP , 10, context)
  renderDigit(MARGIN_LEFT + 39*(RADIUS+1) ,MARGIN_TOP , parseInt(minutes/10), context)
  renderDigit(MARGIN_LEFT + 54*(RADIUS+1) ,MARGIN_TOP , parseInt(minutes%10), context)
  renderDigit(MARGIN_LEFT + 69*(RADIUS+1) ,MARGIN_TOP , 10, context)
  renderDigit(MARGIN_LEFT + 78*(RADIUS+1) ,MARGIN_TOP , parseInt(seconds/10), context)
  renderDigit(MARGIN_LEFT + 93*(RADIUS+1) ,MARGIN_TOP , parseInt(seconds%10), context)

  for( let i = 0; i < balls.length; i++){
    context.fillStyle = balls[i].color
    
    context.beginPath();
    context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true)
    context.closePath();
    context.fill()
  }
}

function renderDigit(x, y, num, context){
  context.fillStyle='rgb(0, 102, 153)'
  for(let i = 0; i < digit[num].length; i++){
    for(let j = 0; j < digit[num][i].length; j++){
      if(digit[num][i][j] == 1){
        context.beginPath()
        context.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI)
        context.closePath();
        
        context.fill();
      }
    }
  }
}

function getCurrentShowTimeSeconds(){
  var curTime = new Date()
  var ret = endTime.getTime() - curTime.getTime()
  ret = Math.round(ret/1000)
  return ret >= 0 ? ret : 0
}

function addBalls(x, y, num){
  for(let i = 0; i < digit[num].length; i++){
    for(let j = 0; j < digit[num][i].length; j++){
      if(digit[num][i][j] == 1){
        let aBall = {
          x: x+j*2*(RADIUS+1)+(RADIUS+1),
          y: y+i*2*(RADIUS+1)+(RADIUS+1),
          g: 1.5+Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random()*1000))*4, // 正负4 
          vy: -5,
          color: colors[Math.floor(Math.random()*colors.length)]
        }
        balls.push(aBall)
      }
    }
  }
}
function updateBalls(){
  for(let i = 0; i < balls.length; i++){
    balls[i].x += balls[i].vx
    balls[i].y += balls[i].vy
    balls[i].vy += balls[i].g
    // 碰撞检测
    if( balls[i].y >= WINDOW_HEIGHT - RADIUS ){
      balls[i].y = WINDOW_HEIGHT - RADIUS
      balls[i].vy = - balls[i].vy * 0.75
    }  
  }
  let cnt = 0
  for(let i = 0; i < balls.length; i++){
    if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
      balls[cnt++] = balls[i]
    }
  }
  while(balls.length > Math.min(300,cnt)){
    balls.pop()
  }
}