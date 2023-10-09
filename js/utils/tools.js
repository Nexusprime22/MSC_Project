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

// if the number of lines is not equals to the number of columns, then not squared matrix
export function isItSquaredMatrix(matrix){
	for(let i=0;i<matrix.length;i++){
        if(matrix.length!=matrix[i].length){
            return false;
        }
	}
	return true;   
}

/*

    SYMMETRY

*/

/**
 * @brief method to check if the given matrix is symmetrical
 * @param {*} matrix 
 * @returns 
 */
export function isMatrixSymmetrical(matrix){
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(matrix[i][j]!=matrix[j][i]){
				return false;
			}
		}	
	}
	return true;
}

/**
 * @brief if the matrix is not symmetrical, then make it symmetrical
 * @param {*} matrix 
 * @returns 
 */
export function makeMatrixSymmetrical(matrix){
    // the matrix is already symmetrical, no need to go further
    if(isMatrixSymmetrical(matrix)){
        return matrix;
    }
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(matrix[i][j]!=matrix[j][i]){
				// we choose to replace j,i value
				matrix[j][i]=matrix[i][j]
			}
		}	
	}	
	return matrix;
}

/*

    Reflexivity

*/
/**
 * @brief check if matrix is reflexive (diagonal from upper left to down right values are 0)
 * @param {*} matrix 
 * @returns 
 */
export function isMatrixReflexive(matrix){
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(i==j && matrix[i][j]!=0){
				return false;
			}
		}	
	}
	return true;
}

/**
 * @brief makes the given matrix reflexive
 * @param {*} matrix 
 * @returns 
 */
export function makeMatrixReflexive(matrix){
    // if it's already reflexive, no need to go further
    if(isMatrixReflexive(matrix)){
        return matrix;
    }
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(i==j && matrix[i][j]!=0){
				matrix[i][j]==0;
			}
		}	
	}
	return matrix;
}

/*

    Transitivity

*/

/**
 * @brief check if given matrix has no 0 outside diagonal
 * @param {*} matrix 
 * @returns 
 */

export function isMatrixTransitive_no_zero_outside_diagonal(matrix){
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(i!=j){
				for(let k=0;k<matrix.length;k++){
					if(j!=k){
						if(matrix[i][j]==0 || matrix[j][k]==0 || matrix[j][k]==0){
							return false;
						}
					}
				}
			}
		}	
	}
	return true;	
}

/*

    Transitivity but to check if value at (i,k) is equals to (i,j)+(j,k)

    HOWEVER
    When dealing with matrices where values are not binary (i.e., not 0 or 1), 
	applying a transitive closure in our case may not make sense, 
	because it's not directly related to reachability or transitive relationships like
	transitive closure is with non-binary values (which don't have a standard interpretation or application)

	So we won't use it, because it's an unending process in our origin matrix (30x30)

    we also tried to ignore the reuse of (i,j), (j,k) and (i,k) once (i,k) modified,
    but it still results to not transitive result

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
        // look for (i,j)
        if(i!=j){
            for (let j = 0; j < n; j++) {
                // look for (j,k)
                if(j!=k){
                    for (let k = 0; k < n; k++) {
                        // if sum at (i,k) is not consistent (not equals to (i,j)+(j,k)), then not transitive
                        if (i!=k && (originMatrix[i][k] != originMatrix[i][j] + originMatrix[j][k])) {
                            console.log("wrong at coordinates", `(${i}, ${k}) because wrong value according to values of (${i}, ${j}) and (${j}, ${k})`
                                +" indeed "+originMatrix[i][k]+" != "+originMatrix[i][j]+" + "+originMatrix[j][k]
                            );
                            // no need to go further
                            return false;
                        }
                    }
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
        // reset the condition at the beginning of each iteration
        // if the loops do not result in modified=true, then we leave the while loop
        modified = false;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    if (i !== k && i !== j && j !== k && (matrix[i][k] > matrix[i][j] + matrix[j][k])) {
						console.log(`modif to be done at (${i},${k}), because transitivity with (${i},${j}) and (${j},${k})`);
						console.log("value has to be modified because "+matrix[i][k]+" != "+matrix[i][j]+"+"+matrix[j][k]);
						matrix[i][k] = matrix[i][j] + matrix[j][k];
						console.log("so we replace (i,k) value with "+matrix[i][k]+" = "+matrix[i][j]+"+"+matrix[j][k]);
                        // once a modification was brought, we can restart the process with the updated matrix
                        // until there are no modification left to bring
                        modified = true;
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

