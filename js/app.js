// Importing the CSV parsing function from the quiz data script
import { parseCSVData, LevelCSVData } from "./quizData.js";

let quizData = null;
let currentQuestionIndex = 0;
let score = 0;
let fileInputLabel; // Reference to the file input label
const quizContainer = document.getElementById("quiz-section");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startButton").addEventListener("click", startQuiz);
  customizeFileInput();
});

function customizeFileInput() {
  const fileInput = document.getElementById("fileInput");
  fileInputLabel = document.createElement("label");
  fileInputLabel.className = "btn btn-secondary";
  fileInputLabel.innerText = "ファイルを選択";
  fileInput.insertAdjacentElement("afterend", fileInputLabel);
  fileInput.style.display = "none";

  fileInputLabel.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    fileInputLabel.innerText =
      fileInput.files.length > 0 ? fileInput.files[0].name : "ファイルを選択";
  });
}

function startQuiz() {
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length === 0) {
    alert("ファイルが選択されていません。");
    return;
  }

  const selectedFile = fileInput.files[0];

  if (!isCSVFile(selectedFile)) {
    alert("選択されたファイルはCSVファイルではありません。");
    return;
  }

  document.getElementById("startButton").style.display = "none";
  fileInputLabel.style.display = "none";
  readCSV(selectedFile);
  showLevelSelection();
}

// Checks if the selected file is a CSV file
function isCSVFile(file) {
  return file.type === "text/csv" || file.name.endsWith(".csv");
}

// Show level selection interface
function showLevelSelection() {
  quizContainer.innerHTML = "";
  quizContainer.appendChild(createLevelSelectElement());
  toggleDisplay("quiz-section", true);
  document
    .getElementById("startLevelButton")
    .addEventListener("click", startQuizWithSelectedLevel);
}

// Create a level selection card
function createLevelSelectElement() {
  const card = document.createElement("div");
  card.className = "card my-3";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = "難易度を選択してください:";

  const selectContainer = document.createElement("div");
  selectContainer.className = "my-3";

  const levelSelect = document.createElement("select");
  levelSelect.id = "levelSelect";
  levelSelect.className = "form-select";
  ["簡単", "普通", "難しい"].forEach((level, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = level;
    levelSelect.appendChild(option);
  });

  const startButton = document.createElement("button");
  startButton.id = "startLevelButton";
  startButton.className = "btn btn-primary";
  startButton.textContent = "クイズを開始";

  selectContainer.appendChild(levelSelect);
  cardBody.appendChild(title);
  cardBody.appendChild(selectContainer);
  cardBody.appendChild(startButton);
  card.appendChild(cardBody);

  return card;
}

function startQuizWithSelectedLevel() {
  const selectedLevel =
    document.getElementById("levelSelect").selectedOptions[0].textContent;
  quizData = LevelCSVData(quizData, selectedLevel);
  displayCurrentQuestion();
}

function readCSV(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    quizData = parseCSVData(event.target.result);
    toggleDisplay("csv-download", false);
  };
  reader.readAsText(file);
}

function displayCurrentQuestion() {
  if (quizData.questions.length === currentQuestionIndex) {
    displayFinalScore();
    return;
  }

  const question = quizData.questions[currentQuestionIndex];
  // クイズコンテナの内容をクリアする
  quizContainer.innerHTML = "";
  //createQuestionHTML 関数から返された要素をクイズコンテナに追加する
  quizContainer.appendChild(createQuestionHTML(question));
  toggleDisplay("quiz-section", true);

  // 画像がある場合、adjustLayoutForImageを呼び出す
  if (question["image"]) {
    adjustLayoutForImage(question["image"], quizContainer);
  }
}

function adjustLayoutForImage(imageFileName, container) {
  const img = new Image();
  img.onload = function () {
    const aspectRatio = this.width / this.height;
    const imageTextContainer = document.getElementById("image-text-container");
    const textDiv = document.getElementById("text-div");

    if (aspectRatio > 1) {
      imageTextContainer.classList.remove("flex-row");
      imageTextContainer.classList.add("flex-column");
      textDiv.style.marginTop = "40px";
    } else {
      imageTextContainer.classList.remove("flex-column");
      imageTextContainer.classList.add("flex-row");
      textDiv.style.marginLeft = "25px";
      imageTextContainer.style.marginBottom = "20px";
    }

    // 画像の読み込み完了後に回答するボタンを追加
    addAnswerButton(container);
  };
  img.src = `images/${imageFileName}`;
}

function createQuestionHTML(question) {
  const contentDiv = document.createElement("div");
  contentDiv.id = "content-div";
  contentDiv.className =
    "d-flex flex-column justify-content-center align-items-center";
  contentDiv.style.minHeight = "450px";

  const questionText = document.createElement("p");
  questionText.className = "card-text";
  questionText.textContent = question.Question;
  contentDiv.appendChild(questionText);

  const imageTextContainer = document.createElement("div");
  imageTextContainer.id = "image-text-container";
  imageTextContainer.className = "d-flex";

  if (question["image"]) {
    const imageDiv = document.createElement("div");
    imageDiv.id = "image-div";
    imageDiv.className = "d-flex justify-content-center align-items-center";

    const img = new Image();
    img.alt = "クイズの画像";
    img.style.maxWidth = "450px";
    img.style.maxHeight = "450px";
    img.style.objectFit = "contain";
    img.onload = () => adjustLayoutForImage(img, question["image"]);
    img.src = `images/${question["image"]}`;

    imageDiv.appendChild(img);
    imageTextContainer.appendChild(imageDiv);
  }
  const choicesDiv = document.createElement("div");
  choicesDiv.id = "text-div";
  choicesDiv.className = "d-flex flex-column justify-content-center ms-3";

  for (let i = 1; i <= 4; i++) {
    if (question["Choice" + i]) {
      const choiceDiv = document.createElement("div");
      choiceDiv.className = "form-check";

      const input = document.createElement("input");
      input.className = "form-check-input";
      input.type = "radio";
      input.name = "question";
      input.id = `choice${i}`;
      input.value = question["Choice" + i];

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.htmlFor = `choice${i}`;
      label.textContent = question["Choice" + i];

      choiceDiv.appendChild(input);
      choiceDiv.appendChild(label);
      choicesDiv.appendChild(choiceDiv);
    }
  }

  imageTextContainer.appendChild(choicesDiv);
  contentDiv.appendChild(imageTextContainer);

  // 画像がない場合ボタンを追加
  if (!question["image"]) {
    const answerButton = document.createElement("button");
    answerButton.id = "answer-button";
    answerButton.className = "btn btn-primary mt-2";
    answerButton.textContent = "回答する";
    answerButton.addEventListener("click", () =>
      handleAnswer(contentDiv, answerButton)
    );
    contentDiv.appendChild(answerButton);
  }
  return contentDiv;
}

// addAnswerButton 関数の修正
function addAnswerButton(container) {
  // 画像がある場合のみボタンを追加
  if (quizData.questions[currentQuestionIndex]["image"]) {
    const answerButton = document.createElement("button");
    answerButton.id = "answer-button";
    answerButton.innerText = "回答する";
    answerButton.className = "btn btn-primary mt-2";
    answerButton.addEventListener("click", () => handleAnswer(container));
    container.appendChild(answerButton);
  }
}

function handleAnswer(container) {
  const selectedOption = getSelectedOption();
  if (!selectedOption) {
    alert("1つ選択してください");
    return;
  }

  const isCorrect = checkAnswer(selectedOption);
  const feedbackClass = isCorrect ? "alert-success" : "alert-danger";
  const feedbackText = isCorrect ? "正解です！" : "不正解です。";
  isCorrect ? score++ : score ;

  const contentDiv = document.createElement("div");
  contentDiv.className = "d-flex align-items-center justify-content-center";
  contentDiv.style.height = "450px";

  const infoDiv = document.createElement("div");
  infoDiv.className = "d-flex";

  const currentQuestion = quizData.questions[currentQuestionIndex];
  if (currentQuestion["eximage"]) {
    const imageHtml = `<img src="images/${currentQuestion["eximage"]}" alt="解説画像" style="max-width: 450px; height: 450px; object-fit: contain; margin-right: 40px;">`; // 画像の右にマージンを追加
    infoDiv.innerHTML += imageHtml;
  }

  const textDiv = document.createElement("div");
  textDiv.className = "d-flex flex-column justify-content-center";

  const feedback = document.createElement("div");
  feedback.className = `alert ${feedbackClass}`;
  feedback.innerText = feedbackText;
  textDiv.appendChild(feedback);

  const nextQuestionButton = document.createElement("button");
  nextQuestionButton.innerText = "次の問題へ";
  nextQuestionButton.className = "btn btn-secondary mt-2";
  nextQuestionButton.addEventListener("click", () => {
    currentQuestionIndex++;
    displayCurrentQuestion();
    toggleDisplay("feedback-section", false);
  });
  textDiv.appendChild(nextQuestionButton);

  infoDiv.appendChild(textDiv);
  contentDiv.appendChild(infoDiv);
  container.innerHTML = "";
  container.appendChild(contentDiv);
}

function getSelectedOption() {
  return document.querySelector('input[name="question"]:checked')?.value;
}

function checkAnswer(selectedOptionValue) {
  const currentQuestion = quizData.questions[currentQuestionIndex];
  return (
    currentQuestion["Choice" + currentQuestion.CorrectAnswer] ===
    selectedOptionValue
  );
}

function displayFinalScore() {
  toggleDisplay("quiz-section", false);
  const scoreDisplay = document.getElementById("score-display");
  scoreDisplay.innerText = `合計得点: ${score}`;
  scoreDisplay.className = "alert alert-success mt-2 justify-content-center";
  scoreDisplay.classList.add("flex-column");
  addBackToTopButton();
}

function addBackToTopButton() {
  const button = document.createElement("button");
  button.innerText = "トップページへ";
  button.className = "btn btn-info";
  button.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/index.html";
    // スタートボタンとファイル選択ラベルの表示状態をリセット
    document.getElementById("startButton").style.display = "block";
    fileInputLabel.style.display = "block";
  });
  // フッター内のコンテナ要素を取得
  const container = document.querySelector("#score-footer .container");

  // コンテナ内にボタンを挿入
  container.appendChild(button);

  // スコアフッターを表示
  toggleDisplay("score-footer", true);
}

function toggleDisplay(elementId, show) {
  const element = document.getElementById(elementId);
  element.style.display = show ? "block" : "none";
}
