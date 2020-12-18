const monsterHealthBar = document.getElementById('monster-health');
const playerHealthBar = document.getElementById('player-health');
const bonusLifeEl = document.getElementById('bonus-life');

const attackBtn = document.getElementById('attack-btn');
const strongAttackBtn = document.getElementById('strong-attack-btn');
const healBtn = document.getElementById('heal-btn');
const logBtn = document.getElementById('log-btn');

function adjustHealthBars(maxLife) {
  monsterHealthBar.max = maxLife;
  monsterHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
}

function dealMonsterDamage(damage) {
  const dealtDamage = Math.random() * damage;
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  return dealtDamage;
}

function dealPlayerDamage(damage) {
  const dealtDamage = Math.random() * damage;
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

function resetGame(value) {
  playerHealthBar.value = value;
  monsterHealthBar.value = value;
}

function removeBonusLife() {
  bonusLifeEl.parentNode.removeChild(bonusLifeEl);
}

function setPlayerHealth(health) {
  playerHealthBar.value = health;
}

const enteredNumber = prompt("choose max life", "100");


let chosenMaxLife = parseInt(enteredNumber);


if (isNaN(chosenMaxLife) || chosenMaxLife <=0){
  chosenMaxLife = 100;
}


const attackValue = 10;
const monstAttackValue = 14;
const strongAttackValue = 15;
const logEventPlayerAttack = 'PLAYER_ATTACK';
const logEventStrongAttack = 'PLAYER_STRONG_ATTACK';
const logEventMonsterAttack = 'MONSTER_ATTACK';
const logEventPlayerHeal = 'PLAYER_HEAL';
const logEventGameOver = 'GAME_OVER';



let currentPlayerHealth = chosenMaxLife;
let currentMonsterHealth = chosenMaxLife;
let healValue = 20;
let hasBonusLife = true;
let battleLog = [];



adjustHealthBars(chosenMaxLife);


function writeToLog(ev, val, monsterHealth, playerHealth){
  if (ev === logEventPlayerAttack){
    const logEntry = {
      event: ev,
      value: val,
      target: 'monster',
      finalmonsterhealth: monsterHealth,
      finalplayerhealth: playerHealth
  };
  battleLog.push(logEntry);
 } else if (ev === logEventStrongAttack){
  const logEntry = {
    event: ev,
    value: val,
    target: 'monster',
    finalmonsterhealth: monsterHealth,
    finalplayerhealth: playerHealth
 };
 battleLog.push(logEntry);
 } else if (ev === logEventMonsterAttack){
  const logEntry = {
    event: ev,
    value: val,
    target: 'player',
    finalmonsterhealth: monsterHealth,
    finalplayerhealth: playerHealth
 };
 battleLog.push(logEntry);
} else if (ev === logEventPlayerHeal){
  const logEntry = {
    event: ev,
    value: val,
    target: 'player',
    finalmonsterhealth: monsterHealth,
    finalplayerhealth: playerHealth
};
battleLog.push(logEntry);
} else if (ev === logEventGameOver){
  const logEntry = {
    event: ev,
    value: val,
    finalmonsterhealth: monsterHealth,
    finalplayerhealth: playerHealth
};
battleLog.push(logEntry);
}

};
    







function reset(){
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
  resetGame(chosenMaxLife);

}

function endRound(){
  initialPlayerHealth = currentPlayerHealth;
  const PlayerDamage = dealPlayerDamage(monstAttackValue);
  currentPlayerHealth = currentPlayerHealth - PlayerDamage;
  writeToLog(logEventMonsterAttack, PlayerDamage, currentMonsterHealth, currentPlayerHealth);

  if (currentPlayerHealth <= 0 && hasBonusLife){
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('you would be dead but the bonus life saved you');
  }


  if(currentMonsterHealth <= 0  && currentPlayerHealth > 0){
    alert('you win');
    writeToLog(logEventGameOver, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
    alert('you lose');   
    writeToLog(logEventGameOver, 'YOU LOSE', currentMonsterHealth, currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0){
    alert(`it's a draw`);
    writeToLog(logEventGameOver, "IT'S A DRAW", currentMonsterHealth, currentPlayerHealth);
  }

if (currentMonsterHealth <= 0 && currentPlayerHealth > 0 || currentPlayerHealth <= 0 && currentMonsterHealth > 0){
  reset();
}

}

function attackMonster(mode){
  let maxDamages;
  let logEvent;
  if (mode === 'attack'){
    maxDamages = attackValue;
    logEvent = logEventPlayerAttack;
  } else if (mode === 'strongAttack'){
    maxDamages = strongAttackValue;
    logEvent = logEventStrongAttack;
  }
  const damage = dealMonsterDamage(maxDamages);
  currentMonsterHealth = currentMonsterHealth - damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler(){
  attackMonster('attack');
 
}

function strongAttackHandler (){
  attackMonster('strongAttack');
}

function healPlayerHandler(){
  let heal_Value;
  if (currentPlayerHealth >= chosenMaxLife - healValue){
    alert("you can't heal more than your max initial health");
    heal_Value = chosenMaxLife - currentPlayerHealth;
  } else {
    heal_Value = healValue;
  }
  increasePlayerHealth(heal_Value);
  currentPlayerHealth = currentPlayerHealth + heal_Value;
  writeToLog(logEventPlayerHeal, heal_Value, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function logEventHandler(){
  console.log(battleLog);
}
  







attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', logEventHandler);
