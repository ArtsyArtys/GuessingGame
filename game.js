const prevGuessHeader = document.getElementById("guessHeader");
const guessesRemainingHeader = document.getElementById("guessesRemaining");
const narrationEl = document.getElementById('hotOrCold');
const input = document.querySelector('input');
const submitButton = document.getElementById("submit");
const replayButton = document.getElementById('replay');
const hintButton = document.getElementById('hint');
const hintText = document.getElementById('hintText');
const ulNode = document.querySelector('ul');
let numToGuess = 0;
let guessesRemaining = 5; // guesses done = |-5 + guessesRemaining|
let prevGuesses = [];
let lost = false;
let won = false;
let hints = 3;

input.addEventListener('keyup', (key) => { if (key.keyCode === 13) { submitGuess(); } });
replayButton.addEventListener('click', () => { startGame(); });
submitButton.addEventListener('click', () => { submitGuess(); });
hintButton.addEventListener('click', () => { useHint(); });

function startGame(restart = false)
{
  lost = false;
  won = false;
  hints = 3;
  input.value = '';
  ulNode.innerHTML = '';
  prevGuesses = [];
  numToGuess = Math.floor(Math.random() * 100) + 1;
  guessesRemaining = 5;
  prevGuessHeader.innerHTML = 'Guess a number between 1 and 100';
  guessesRemainingHeader.innerHTML = '5 Guesses Remaining';
  hintButton.innerHTML = `Hints 3/3`;
  hintText.innerHTML = '';
  narrationEl.innerHTML = '';
  document.getElementById('winText').innerHTML = '';
}

function submitGuess()
{
  let inputText = input.value;
  let inputNum = Number(inputText);

  if (!lost && !won)
  {
    // invalid entry
    if (Number.isNaN(inputNum) || inputNum < 1 || inputNum > 100 || !Number.isInteger(inputNum))
    {
      guessesRemainingHeader.innerHTML = 'You need to enter an integer between 1 and 100 you haven\'t used before';
    }
    // repeat entry
    else if (prevGuesses.includes(inputNum))
    {
      guessesRemainingHeader.innerHTML = 'You\'ve already tried that number!';
    }
    // correct entry
    else if (inputNum === numToGuess)
    {
      guessesRemainingHeader.innerHTML = 'Congratulations, You Win! Play Again?';
      narrationEl.innerHTML = '';
      document.getElementById('winText').innerHTML = `${inputNum}!`;
      ulNode.innerHTML = '';
      won = true;
    }
    // incorrect entry
    else
    {
      prevGuesses.push(Number(input.value));
      guessesRemaining--;
      let liNode = document.createElement('li');
      liNode.id = "guess" + String(Math.abs(-5 + guessesRemaining));
      guessesRemainingHeader.innerHTML = guessesRemaining === 1 ? 'Only 1 Guess Remaining' : `${guessesRemaining} Guesses Remaining`;

      if (inputNum < numToGuess)
      {
        liNode.innerHTML = inputText + `  <span style='color: darkblue;'>⟰</span>`;
        narrationEl.innerHTML = 'You\'re a little low, try again!';
      }
      else
      {
        liNode.innerHTML = inputText + `  <span style='color: darkblue;'>⟱</span>`;
        narrationEl.innerHTML = 'Too high! Try again';
      }
      ulNode.appendChild(liNode);

      if (guessesRemaining === 0) { loseGame(); }
    }
  }
  input.value = '';
}

function loseGame()
{
  guessesRemainingHeader.innerHTML = 'OOH. You Lost. Better Luck Next Time!';
  narrationEl.innerHTML = '';
  lost = true;
  hintText.innerHTML = '';
}

function useHint()
{
  if (!lost && !won)
  {
    if (hints > 0)
    {
      hintButton.innerHTML = `Hints ${hints - 1}/3`;

      let max = Math.max(...prevGuesses);
      let closestUpper = 100;
      let closestLower = 1;
      for (let i = numToGuess; i <= max; i++)
      {
        if (prevGuesses.includes(i)) { closestUpper = i; }
      }
      for (let i = numToGuess; i > 0; i--)
      {
        if (prevGuesses.includes(i)) { closestLower = i; }
      }

      console.log(closestLower, closestUpper);
      let hintRangeTop = Math.floor(Math.random() * (closestUpper - numToGuess) + numToGuess);
      let hintRangeBottom = Math.floor(Math.random() * (numToGuess - closestLower) + closestLower);

      hintText.innerHTML = `The number is between ${hintRangeBottom}-${hintRangeTop} :)`;
    }

    hints--;
  }

}

startGame();
