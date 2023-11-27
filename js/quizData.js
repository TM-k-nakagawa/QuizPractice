// CSVデータを1行目をキー、2行目以降をバリューとして連想配列に格納する関数
export function parseCSVData(csvData) {
  const lines = csvData.split("\n");
  const header = lines[0].split(",");
  const questions = lines.slice(1).map((line) => {
    const data = line.split(",");
    return header.reduce((obj, key, index) => {
      obj[key.trim()] = data[index] ? data[index].trim() : "";
      return obj;
    }, {});
  });

  return { questions };
}

export function LevelCSVData(quizData, selectedLevel) {
  const questions = quizData.questions.filter(
    (question) => question.level === selectedLevel
  );
  console.log(questions);
  return { questions };
}
