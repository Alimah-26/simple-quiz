"use strict";

/**
 * SPA Quiz App
 * - Questions stored in an array of objects (not hardcoded in HTML)
 * - Renders questions dynamically
 * - Shows immediate feedback (green/red) and auto-advances
 * - Uses .hidden class to switch screens (no reloads)
 */

// ===== DATA (EDIT THIS TO CHANGE TOPIC / ADD MORE QUESTIONS) =====
const questions = [
  {
    question: "Which tag is the most semantic for the main content of a page?",
    options: ["<div>", "<main>", "<span>", "<section>"],
    correctIndex: 1
  },
  {
    question: "Which CSS layout is best for aligning items in a row with flexible spacing?",
    options: ["Flexbox", "Float", "Position absolute", "Inline-block"],
    correctIndex: 0
  },
  {
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Method", "Digital Order Map", "Document Orientation Mode"],
    correctIndex: 0
  },
  {
    question: "Which method creates a new element in JavaScript?",
    options: ["document.add()", "document.createElement()", "document.makeNode()", "document.newElement()"],
    correctIndex: 1
  },
  {
    question: "Which is best practice for event handling?",
    options: ['onclick="doSomething()"', "addEventListener()", "put JS inside HTML tags only", "events are automatic"],
    correctIndex: 1
  }
];

// ===== ELEMENTS =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const progressText = document.getElementById("progress-text");
const scoreText = document.getElementById("score-text");
const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const finalScoreEl = document.getElementById("final-score");

// ===== STATE =====
let currentIndex = 0;
let score = 0;
let acceptingAnswers = true;

// ===== HELPERS =====
function showScreen(screen) {
  // Hide all
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");

  // Show one
  screen.classList.remove("hidden");
}

function resetQuiz() {
  currentIndex = 0;
  score = 0;
  acceptingAnswers = true;
  feedbackEl.textContent = "";
  scoreText.textContent = `Score: ${score}`;
}

function renderQuestion() {
  const q = questions[currentIndex];

  progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  scoreText.textContent = `Score: ${score}`;
  questionText.textContent = q.question;

  // Clear previous answers
  answersDiv.innerHTML = "";
  feedbackEl.textContent = "";

  // Render answer buttons dynamically
  q.options.forEach((optionText, optionIndex) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.textContent = optionText;

    btn.addEventListener("click", () => handleAnswer(btn, optionIndex));
    answersDiv.appendChild(btn);
  });

  acceptingAnswers = true;
}

function handleAnswer(clickedBtn, chosenIndex) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;

  const q = questions[currentIndex];
  const allBtns = Array.from(document.querySelectorAll(".answer-btn"));

  // Disable all so user can’t change answer
  allBtns.forEach(b => (b.disabled = true));

  const isCorrect = chosenIndex === q.correctIndex;

  if (isCorrect) {
    score += 1;
    clickedBtn.classList.add("correct");
    feedbackEl.textContent = "Correct ✅";
  } else {
    clickedBtn.classList.add("wrong");
    feedbackEl.textContent = "Incorrect ❌";

    // Also highlight the correct one
    const correctBtn = allBtns[q.correctIndex];
    if (correctBtn) correctBtn.classList.add("correct");
  }

  // Update score display immediately
  scoreText.textContent = `Score: ${score}`;

  // Move to next question after a short pause (so feedback is seen)
  window.setTimeout(() => {
    currentIndex += 1;

    if (currentIndex >= questions.length) {
      showResults();
    } else {
      renderQuestion();
    }
  }, 900);
}

function showResults() {
  showScreen(resultScreen);
  finalScoreEl.textContent = `You got ${score} out of ${questions.length} correct!`;
}

// ===== EVENTS =====
startBtn.addEventListener("click", () => {
  resetQuiz();
  showScreen(quizScreen);
  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  resetQuiz();
  showScreen(startScreen);
});
