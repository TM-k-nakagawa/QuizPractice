// CSVデータを1行目をキー、2行目以降をバリューとして連想配列に格納する関数
export function parseCSVData(csvData) {
  const lines = csvData.split("\n");
  // ヘッダ行と問題データの初期化
  var header = lines[0].split(",");
  var questions = [];

  // 各行のデータを処理
  for (var i = 1; i < lines.length; i++) {
    var data = lines[i].split(",");
    var question = {};

    for (var j = 0; j < header.length; j++) {
      question[header[j]] = data[j];
    }

    questions.push(question);
  }

  // 問題データを変数に格納
  var quizData = {questions};
  console.log(quizData);
  return quizData;
}
