let playerCount = 0;
let enemyCount = 0;

window.onload = () => {
  addCharacter('player');
  addCharacter('enemy');
};

function addCharacter(type) {
  const list = document.getElementById(`${type}-list`);
  if (list.children.length < 8) {
  const count = type === 'player' ? ++playerCount : ++enemyCount;

  const div = document.createElement('div');
  div.className = 'character-entry';
  div.innerHTML = `
    <input class="name" type="text" placeholder="Name" required/>
    <input class="damage" type="text" placeholder="Damage (e.g., 1d6)" required/>
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
    <button onclick="removeCharacter(this, '${type}')">-</button>
  `;
  list.appendChild(div);

     const nameInput = div.querySelector('.name');
    const damageInput = div.querySelector('.damage');

    nameInput.addEventListener('blur', validateName);
    damageInput.addEventListener('blur', validateDamage);

    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') validateName(e);
    });
    damageInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') validateDamage(e);
    });

  } else {
    type === 'player' ? alert(`Limit of eight players for current implementation.`) : alert(`Limit of eight players for current implementation.`);
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

document.getElementById('submit-btn').addEventListener('click', () => {
  // Placeholder combat logic
  const resultDiv = document.getElementById('results');
  const playerEntries = document.querySelectorAll(`#player-list .character-entry`);
  const enemyEntries = document.querySelectorAll(`#enemy-list .character-entry`);

  const players = Array.from(playerEntries).map(entry => ({
    name: entry.querySelector('.name').value,
    damage: entry.querySelector('.damage').value,
    class: entry.querySelector('.class').value,
    strategy: entry.querySelector('.strategy').value
  }));

  const enemies = Array.from(enemyEntries).map(entry => ({
    name: entry.querySelector('.name').value,
    damage: entry.querySelector('.damage').value,
    class: entry.querySelector('.class').value,
    strategy: entry.querySelector('.strategy').value
  }));

  console.log("Players:", players);
  console.log("Enemies:", enemies);

  resultDiv.innerHTML = 'Combat simulation not implemented yet.';
});
