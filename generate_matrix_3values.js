function generateMatrix() {
    const matrix = [];
    for (let i = 0; i < 30; i++) {
      const row = [];
      for (let j = 0; j < 30; j++) {
        if (i === j) {
          row.push([0, 0, 0, 0]);
        } else {
          const randomArray = Array.from({ length: 4 }, () =>
            Math.floor(Math.random() * 30)
          );
          row.push(randomArray);
        }
      }
      matrix.push(row);
    }
    return matrix;
  }
  
  const resultMatrix = generateMatrix();
  const jsonMatrix = JSON.stringify(resultMatrix, null, '\t');
  console.log(jsonMatrix);