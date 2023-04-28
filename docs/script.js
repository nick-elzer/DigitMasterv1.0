// script.js
const userGuess = document.getElementById("user-guess");
const submitGuess = document.getElementById("submit-guess");
const guessTableBody = document.getElementById("guess-table-body");
const resultMessage = document.getElementById("result-message");
const secret = document.getElementById("secret");
let secretNumber = generateSecretNumber();
let attempts = 0;
correctPositions = 0;
let previousGuesses = [];
userGuess.addEventListener("input", () => {
  const nonNumeric = /[^1-9]/g;
  const hasNonNumeric = nonNumeric.test(userGuess.value);
  submitGuess.disabled =
    userGuess.value.length !== 4 ||
    userGuess.value.includes("0") ||
    userGuess.value.length === 0 ||
    hasNonNumeric ||
    new Set(userGuess.value).size !== userGuess.value.length ||
    previousGuesses.includes(userGuess.value);
});

function toggleModal() {
  const modal = document.querySelector(".modal");
  modal.classList.toggle("show-modal");
}

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.classList.remove("show-modal");
}

const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", closeModal);

function loadDifficultyLevel() {
  const storedLevel = localStorage.getItem("difficultyLevel");
  if (storedLevel) {
    document.getElementById("level").value = storedLevel;
  } else {
    document.getElementById("level").value = "easy";
  }
}

function generateSecretNumber() {
  let digits = "123456789";
  let secret = "";
  for (let i = 0; i < 4; i++) {
    let index = Math.floor(Math.random() * digits.length);
    secret += digits[index];
    digits = digits.slice(0, index) + digits.slice(index + 1);
  }
  return secret;
}



function checkGuess(guess) {
  let correctDigits = 0;
  let correctPositions = 0;
  let secretCopy = secretNumber.slice(); // Create a copy of secretNumber to avoid modifying the original
  let guessCopy = guess.slice(); // Create a copy of the guess to avoid modifying the original
  const nonNumeric = /[^1-9]/g;
  const hasNonNumeric = nonNumeric.test(guess);

  if (guess.length === 0 || hasNonNumeric) {
    return { valid: false, correctDigits: 0, correctPositions: 0 };
  }
  const hasZero = guess.includes("0");
  const hasRepeatingDigits = new Set(guess).size !== guess.length;

  if (hasZero || hasRepeatingDigits || previousGuesses.includes(guess)) {
    return { valid: false, correctDigits: 0, correctPositions: 0 };
  }

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secretCopy[i]) {
      correctPositions++;
      secretCopy[i] = null; // Mark the digit as matched to avoid counting it again
      guessCopy[i] = null; // Mark the digit as matched to avoid counting it again
    }
  }

  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] !== null) {
      let index = secretCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        correctDigits++;
        secretCopy[index] = null; // Mark the digit as matched to avoid counting it again
      }
    }
  }

  return { valid: true, correctDigits, correctPositions };
}


function updateGuessTable(guess, correctDigits, correctPositions, level) {
  const newRow = document.createElement("tr");
  let coloredGuess = "";

  if (level === "easy" || level === "medium") {
    for (let i = 0; i < guess.length; i++) {
      if (level === "easy" && guess[i] === secretNumber[i]) {
        coloredGuess += `<span style="color: rgb(0,255,76);">${guess[i]}</span>`;
      } else if (secretNumber.includes(guess[i])) {
        coloredGuess += `<span style="color: yellow;">${guess[i]}</span>`;
      } else {
        coloredGuess += guess[i];
      }
    }
  } else {
    coloredGuess = guess;
  }

  newRow.innerHTML = `
    <td>${attempts}</td>
    <td>${coloredGuess}</td>
    <td>${correctDigits}</td>
    <td>${correctPositions}</td>
  `;
  guessTableBody.appendChild(newRow);
}


const guessForm = document.getElementById("guess-form");

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guess = userGuess.value;
  console.log("User guess:", guess);
  const checkResult = checkGuess(guess);
  const level = document.getElementById("level").value;
  localStorage.setItem("difficultyLevel", level);
  console.log(
    "checkGuess result:",
    checkResult.correctDigits,
    checkResult.correctPositions
  );

  if (!checkResult.valid) {
    console.log("Invalid guess");
    userGuess.value = ""; // Clear the input box
    return; // Exit the event listener if the guess is invalid
  } else {
    attempts++;
    previousGuesses.push(guess); // Add the guess to the previousGuesses array
    updateGuessTable(
      guess,
      checkResult.correctDigits,
      checkResult.correctPositions,
      level
    );

    if (checkResult.correctPositions === 4) {
      document.querySelector(".color-fan").style.display = "block";
      resultMessage.textContent = `Congratulations! You guessed the secret number! Answer: ${secretNumber}`;
      toggleModal();
    } else if (attempts === 10) {
      document.body.style.backgroundColor = "red";
      resultMessage.textContent = `Answer: ${secretNumber}`;
      toggleModal();
    }

    userGuess.value = ""; // Clear the input box
    const progressBar = document.querySelector(".bar");
    progressBar.style.width = (attempts / 10) * 100 + "%";
  }
});

const playAgainButton = document.getElementById("play-again");
playAgainButton.classList.add("wiggle");
playAgainButton.addEventListener("click", () => {
  location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  loadDifficultyLevel();
});


console.log("Secret number:", secretNumber);

guessForm.addEventListener("submit", (event) => {});
// Add event listener for the "How to Play?" button
const howToPlayButton = document.getElementById("how-to-play");
howToPlayButton.addEventListener("click", () => {
  // Show the modal
  const modal2 = document.querySelector(".modal2");
  modal2.style.display = "block";
});

// Add event listener for the "Got it!" button
const exitButton = document.querySelector(".exit-button");
exitButton.addEventListener("click", () => {
  // Hide the modal
  const modal2 = document.querySelector(".modal2");
  modal2.style.display = "none";
});
