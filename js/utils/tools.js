// Function to generate a random value between a minimum and maximum
export function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to generate an origin-destination matrix with random values between a min and a max giving a set of locations
export function generateMatrixWithRandomValues(locations, min, max) {
	let originDestinationMatrix = [];
	// Generate the matrix wih random values for testing
	for (let x = 0; x < locations.length; x++) {
		originDestinationMatrix.push([]);
		for (let y = 0; y < locations.length; y++) {
			if (x == y) {
				originDestinationMatrix[x].push(0);
			} else {
				originDestinationMatrix[x].push(randomIntFromInterval(min, max));
			}
		}
	}
	return originDestinationMatrix;
}

// Function to add a log message to the log window
export function log(message) {
	const logContent = document.getElementById("logContent");
	const timestamp = new Date().toLocaleTimeString();
	logContent.innerHTML += `[${timestamp}] ${message}\n`;
	logContent.scrollTop = logContent.scrollHeight; // Scroll to the bottom
}

/*

Transitivity

*/
export function isTransitive(originMatrix) {
    const n = originMatrix.length;
    // Check if the matrix is square
    for (let i = 0; i < n; i++) {
        if (originMatrix[i].length !== n) {
            return false; // Not a square matrix, so not transitive
        }
    }

    // Iterate through the rows (i) and columns (j) of the array
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Look for (y, z) in the y-line only
            for (let k = 0; k < n; k++) {
                // if there are no value at i,k or that the sum is not consistent, then not transitive
                if (i!=k && i!=j && j!=k && (originMatrix[i][k] != originMatrix[i][j] + originMatrix[j][k])) {
                    console.log("wrong at coordinates", `(${i}, ${k}) because wrong value according to values of (${i}, ${j}) and (${j}, ${k})`
                        +" indeed "+originMatrix[i][k]+" != "+originMatrix[i][j]+" + "+originMatrix[j][k]
                    );
                    // Transitive property violated
                    return false;
                }
            }
        }
    }
    return true;
}

// makes the matrix transitive (but loop if we reset process at each modif)
export function applyTransitiveClosure(matrix) {
    const n = matrix.length;
    let modified = true; // Flag to check if any modifications were made
    
    while (modified) {
		// if the loops do not result in modification of modified, then we leave the while loop
        modified = false; // Reset the flag at the beginning of each iteration

		// console.log(matrix[0][10]);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    if (i !== k && i !== j && j !== k && (matrix[i][k] > matrix[i][j] + matrix[j][k])) {
						//console.log(`modif to be done at (${i},${k}), because transitivity with (${i},${j}) and (${j},${k})`);
						//console.log("value has to be modified because "+matrix[i][k]+" != "+matrix[i][j]+"+"+matrix[j][k]);
						matrix[i][k] = matrix[i][j] + matrix[j][k];
						//console.log("so we replace (i,k) value with "+matrix[i][k]+" = "+matrix[i][j]+"+"+matrix[j][k]);
                        modified = true; // Set the flag to true if a modification is made
						//console.log("");
						break;
                    }
                }
				if(modified){
					break;
				}
            }
			if(modified){
				break;
			}
        }
    }

    return matrix;
}

