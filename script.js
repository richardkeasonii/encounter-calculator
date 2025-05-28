let playerCount = 0;
let enemyCount = 0;

//Ensures minimum of one player and enemy
window.onload = () => {
  addCharacter('player');
  addCharacter('enemy');
};

//Adds an additional character to the player or enemy list to be populated
function addCharacter(type) {
  const list = document.getElementById(`${type}-list`);
  if (list.children.length < 8) {
  const count = type === 'player' ? ++playerCount : ++enemyCount;

  const div = document.createElement('div');
  div.className = 'character-entry';
  div.innerHTML = `
    <input class="name" type="text" placeholder="Name" required/>
    <input class="damage" type="text" placeholder="Base Damage (e.g., 1d6)" required/>
    <input class="health" type="text" placeholder="Health Points" required/>
    <select class="class">
      <option>Warrior</option>
      <option>Rogue</option>
      <option>Mage</option>
    </select>
    <select class="strategy">
      <option>Aggressive</option>
      <option>Defensive</option>
      <option>Supportive</option>
    </select>
    <select class="strength">
      <option>Optimized Build</option>
      <option>Standard Build</option>
      <option>Unoptimized Build</option>
    </select>
    <select class="type">
      <option>Blaster (AoE)</option>
      <option>Controller (CC)</option>
      <option>Defender</option>
      <option>Healer</option>
      <option>Single-target</option>
      <option>Support (Buffs)</option>
    </select>
    <button onclick="removeCharacter(this, '${type}')">-</button>
  `;
  list.appendChild(div);

    const nameInput = div.querySelector('.name');
    const damageInput = div.querySelector('.damage');
    const healthInput = div.querySelector('.health');

    nameInput.addEventListener('blur', validateName);
    damageInput.addEventListener('blur', validateDamage);
    healthInput.addEventListener('blur', validateHealth);

    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') validateName(e);
    });
    damageInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') validateDamage(e);
    });
    healthInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') validateHealth(e);
    });
  } else {
    type === 'player' ? alert(`Limit of eight players for current implementation.`) : alert(`Limit of eight enemies for current implementation.`);
  }
}

function removeCharacter(button, type) {
  const list = document.getElementById(`${type}-list`);
  if (list.children.length > 1) {
    button.parentElement.remove();
    if (type === 'player') playerCount--;
    else enemyCount--;
  } else {
    alert(`You must have at least one ${type}!`);
  }
}

function validateName(e) {
  const input = e.target;
  if (input.value.trim() === '') {
    input.setCustomValidity("Name is required.");
    input.reportValidity();
  } else {
    input.setCustomValidity("");
  }
}

function validateDamage(e) {
  const input = e.target;
  const regex = /^\d+d\d+$/; // e.g., 1d6, 2d8
  if (!regex.test(input.value.trim())) {
    input.setCustomValidity("Format must be XdY, like 1d6.");
    input.reportValidity();
  } else {
    input.setCustomValidity("");
  }
}

function validateHealth(e) {
  const input = e.target;
  const value = input.value.trim();
  const isValid = /^\d+$/.test(value) && Number(value) > 0;

  if (!isValid) {
    input.setCustomValidity("Please enter a positive integer.");
    input.reportValidity();
  } else {
    input.setCustomValidity("");
  }
}

document.getElementById('submit-btn').addEventListener('click', () => {
  
  const resultDiv = document.getElementById('results');
  const playerEntries = document.querySelectorAll(`#player-list .character-entry`);
  const enemyEntries = document.querySelectorAll(`#enemy-list .character-entry`);

  const players = Array.from(playerEntries).map(entry => ({
    name: entry.querySelector('.name').value,
    damage: entry.querySelector('.damage').value,
    health: entry.querySelector('.health').value,
    class: entry.querySelector('.class').value,
    strategy: entry.querySelector('.strategy').value,
    strength: entry.querySelector('.strength').value,
    type: entry.querySelector('.type').value
  }));

  const enemies = Array.from(enemyEntries).map(entry => ({
    name: entry.querySelector('.name').value,
    damage: entry.querySelector('.damage').value,
    health: entry.querySelector('.health').value,
    class: entry.querySelector('.class').value,
    strategy: entry.querySelector('.strategy').value,
    strength: entry.querySelector('.strength').value,
    type: entry.querySelector('.type').value
  }));

  console.log("Players:", players);
  console.log("Enemies:", enemies);

  const log = simulateCombat(players, enemies);
  resultDiv.innerHTML = `<pre>${log.join('\n')}</pre>`;
});



function simulateCombat(players, enemies) {
  const battleLog = [];
  const combatants = [...players.map(p => ({ ...p, team: 'player' })), ...enemies.map(e => ({ ...e, team: 'enemy' }))];

  // Initialize HP
  combatants.forEach(c => c.currentHealth = parseInt(c.health));

  // Shuffle turn order each round
  shuffleArray(combatants);

  // Main simulation loop
  while (players.some(p => p.currentHealth > 0) && enemies.some(e => e.currentHealth > 0)) {
    for (let combatant of combatants) {
      if (combatant.currentHealth <= 0) continue; // Skip dead

      const targets = combatant.team === 'player'
        ? enemies.filter(e => e.currentHealth > 0)
        : players.filter(p => p.currentHealth > 0);

      if (targets.length === 0) break;

      const target = randomChoice(targets);
      const dmg = rollDamage(combatant.damage);
      target.currentHealth -= dmg;

      battleLog.push(`${combatant.name} hits ${target.name} for ${dmg} damage!`);
      if (target.currentHealth <= 0) {
        battleLog.push(`${target.name} has fallen!`);
      }
    }

    // You can shuffle again or alternate turns
    shuffleArray(combatants);
  }

  return battleLog;
}


function rollDamage(damageStr) {
  const [count, sides] = damageStr.toLowerCase().split('d').map(Number);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}