import { parseCSVData } from "./quizData.js";
let associativeArray = null;

document.getElementById("startButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;

      // CSVデータを連想配列に変換
      associativeArray = parseCSVData(csvData);

      // ダウンロード用のボタンは消す
      var csvDownload = document.getElementById("csv-download");
      csvDownload.innerHTML = "";

      // ダウンロードが完了したらクイズ画面を表示
      displayQuiz(associativeArray);
    };

    // ファイルを読み込む
    reader.readAsText(file);
  } else {
    console.log("No file selected.");
  }
});

let count = 0;

// クイズを表示する関数
function displayQuiz(quizData) {
  var quizContainer = document.getElementById("quiz-container");
  var questionJudge = document.getElementById("questionjudge");
  quizContainer.style.display = "block"; // 表示に切り替え
  questionJudge.style.display = "block"; // 表示に切り替え
  document.getElementById("feedback").style.display = "none";
  quizContainer.innerHTML = "";

  //　問題を出し終えたら、スコアを出す。
  if (quizData.questions.length === count) {
    quizContainer.style.display = "none";
    document.getElementById("feedback").style.display = "none";
    var playerScore = document.getElementById("playerscore");
    playerScore.style.display = "block"; // 表示に切り替え
    displayScore();
  }
  // 回答するボタンを作る
  var answerButton = document.createElement("button");
  answerButton.innerText = "回答する";
  answerButton.style.display = "block";
  quizContainer.appendChild(answerButton);

  // 各問題を処理
  let questionElement = document.createElement("div");
  questionElement.innerHTML =
    "<p>" + quizData.questions[count].Question + "</p>";

  // 選択肢を処理
  for (var i = 1; i <= 4; i++) {
    var optionKey = "Choice" + i;
    // ラジオボタンを追加
    var radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "question" + count;
    radioButton.value = quizData.questions[count][optionKey];

    // ラベルを追加
    var labelElement = document.createElement("label");
    labelElement.appendChild(radioButton);
    labelElement.innerHTML += quizData.questions[count][optionKey];
    questionElement.appendChild(labelElement);
  }
  // 次の問題へ進むボタンを作る
  var nextQuestionButton = document.createElement("button");
  nextQuestionButton.innerText = "次の問題へ";
  nextQuestionButton.style.display = "none";
  quizContainer.appendChild(nextQuestionButton);

  // ボタンがクリックされたときの処理を追加
  answerButton.addEventListener("click", function () {
    // ラジオボタンの値を取得
    var selectedRadioButton = document.querySelector(
      'input[name="question' + count + '"]:checked'
    );
    console.log(selectedRadioButton);
    // ラジオボタンが選択されていない場合の処理
    var radioButtonMessage = document.getElementById("warning");

    if (selectedRadioButton) {
      // 正解判定やスコアの更新
      checkAnswer(quizData, selectedRadioButton.value, count);
      radioButtonMessage.style.display = "none";
      answerButton.style.display = "none";
      nextQuestionButton.style.display = "block";
    } else {
      radioButtonMessage.style.display = "block";
    }
  });

  // 次の問題へ進むボタンが押下されたときの処理
  nextQuestionButton.addEventListener("click", function () {
    nextQuestionButton.style.display = "none";
    // 次の問題を出す。
    count += 1;
    displayQuiz(quizData);
  });
  quizContainer.appendChild(questionElement);
}

let score = 0;
//　正解かどうかを判定する関数
function checkAnswer(quizData, selectedOption, count) {
  let word = "CorrectAnswer\r";
  document.getElementById("feedback").style.display = "block";
  if (selectedOption === quizData.questions[count][word].trim()) {
    score += 1;
    document.getElementById("feedback").innerText = "正解です！";
  } else {
    document.getElementById("feedback").innerText = "不正解です。";
  }
}

// スコアを表示する関数
function displayScore() {
  document.getElementById("score").style.display = "block";
  document.getElementById("score").innerText = score + "問正解です";
}
