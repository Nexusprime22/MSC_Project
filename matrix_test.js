function isMatrixSymmetrical(matrix){
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(matrix[i][j]!=matrix[j][i]){
				return false;
			}
		}	
	}
	return true;
}

function makeMatrixSymmetrical(matrix){
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

function isMatrixReflexive(matrix){
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(i==j && matrix[i][j]!=0){
				return false;
			}
		}	
	}
	return true;
}

function makeMatrixReflexive(matrix){
	for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
			if(i==j && matrix[i][j]!=0){
				matrix[i][j]==0;
			}
		}	
	}
	return matrix;
}

function isMatrixTransitive_no_zero_outside_diagonal(matrix){
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

function isTransitive(matrix) {
    const n = matrix.length;

    // loop through all combinations of points i, j, and k
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
			if(i!=j){
				for (let k = 0; k < n; k++) {
					if(j!=k){
						// check if distance from i to k is different than (distance_from_i_to_j + distance_from_j_to_k)
						if (i!=k && matrix[i][k] != matrix[i][j] + matrix[j][k]) {
							console.log("problem ("+i+","+k+")"+" = "+matrix[i][k]+" AND ("+i+","+j+")"+" = "+matrix[i][j]+" with ("+j+","+k+")"+" = "+matrix[j][k]);
							// transitivity condition violated
							return false;
						}
					}
				}
			}
        }
    }

	// the matrix is transitive
    return true;
}

/*
	When dealing with matrices where values are not binary (i.e., not 0 or 1), 
	applying a transitive closure in our case may not make sense, 
	because it's not directly related to reachability or transitive relationships like
	transitive closure with non-binary values (which don't have a standard interpretation or application)

	So we won't use it, because it's an unending process in our origin matrix (30x30)
*/
function makeMatrixTransitive(matrix) {
    const n = matrix.length;
    const modified = Array.from({ length: n }, () => Array(n).fill(false));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
			// if matrix[i][k] was already modified, we don't change it again
            if (i != j && !modified[i][j]) {
                for (let k = 0; k < n; k++) {
                    if (j != k) {
                        if (i != k && matrix[i][k] != matrix[i][j] + matrix[j][k]) {
                            // we adjust the values to make matrix transitive
                            console.log("Change done at (" + i + "," + k + ")" + " = " + matrix[i][k] + " because (" + i + "," + j + ")" + " = " + matrix[i][j] + " with (" + j + "," + k + ")" + " = " + matrix[j][k]);
                            console.log("so instead of " + matrix[i][k] + ", we got " + (matrix[i][j] + matrix[j][k]) + "\n");
                            matrix[i][k] = matrix[i][j] + matrix[j][k];
                            modified[i][k] = true;
							modified[i][j] = true;
							modified[j][k] = true;
                        }
                    }
                }
            }
        }
    }

    return matrix;
}

let inputMatrix = [
	[
		0, 5, 6, 6, 5, 5, 5, 3, 7, 6, 8, 3, 18, 21, 17, 17, 18, 18, 19, 19, 19, 18,
		16, 23, 26, 24, 23, 22, 24, 24
	],
	[
		5, 0, 3, 3, 6, 2, 6, 7, 9, 11, 6, 21, 24, 20, 20, 21, 21, 22, 22, 22, 21,
		19, 26, 29, 27, 28, 27, 26, 26, 27
	],
	[
		6, 3, 0, 1, 4, 2, 5, 6, 8, 10, 6, 21, 24, 20, 20, 21, 21, 22, 22, 22, 21,
		19, 26, 29, 27, 28, 27, 26, 26, 27
	],
	[
		6, 3, 1, 0, 4, 2, 5, 6, 8, 10, 6, 21, 24, 20, 20, 21, 21, 22, 22, 22, 21,
		19, 26, 29, 27, 28, 27, 26, 26, 27
	],
	[
		5, 6, 4, 4, 0, 4, 2, 1, 5, 6, 2, 20, 22, 19, 18, 19, 19, 20, 20, 20, 20, 17,
		24, 27, 26, 26, 25, 24, 24, 25
	],
	[
		5, 2, 2, 2, 4, 0, 6, 6, 9, 11, 6, 21, 24, 20, 20, 21, 21, 22, 22, 22, 21,
		19, 26, 29, 27, 28, 27, 26, 26, 27
	],
	[
		5, 6, 5, 5, 2, 6, 0, 4, 5, 7, 5, 21, 23, 20, 20, 21, 21, 22, 22, 22, 21, 19,
		26, 28, 27, 27, 27, 25, 25, 26
	],
	[
		3, 7, 6, 6, 1, 6, 4, 0, 5, 7, 2, 20, 23, 19, 19, 20, 20, 21, 21, 21, 20, 18,
		25, 28, 26, 27, 26, 25, 25, 26
	],
	[
		7, 9, 8, 8, 5, 9, 5, 5, 0, 2, 8, 16, 19, 15, 15, 16, 16, 17, 17, 17, 16, 14,
		21, 24, 22, 23, 22, 21, 21, 22
	],
	[
		6, 11, 10, 10, 6, 11, 7, 7, 2, 0, 8, 17, 20, 16, 16, 16, 16, 17, 17, 17, 17,
		15, 22, 24, 23, 23, 22, 21, 21, 22
	],
	[
		8, 6, 6, 6, 2, 6, 5, 2, 8, 8, 0, 18, 21, 17, 17, 18, 18, 19, 19, 19, 18, 16,
		23, 26, 24, 25, 24, 23, 23, 24
	],
	[
		3, 21, 21, 21, 20, 21, 21, 20, 16, 17, 18, 0, 3, 3, 6, 6, 6, 7, 7, 7, 7, 5,
		27, 29, 28, 29, 28, 26, 26, 27
	],
	[
		18, 24, 24, 24, 22, 24, 23, 23, 19, 20, 21, 3, 0, 6, 6, 9, 9, 10, 10, 10, 8,
		8, 29, 32, 31, 31, 30, 28, 29, 30
	],
	[
		21, 20, 20, 20, 19, 20, 20, 19, 15, 16, 17, 3, 6, 0, 4, 5, 5, 6, 6, 6, 5, 3,
		24, 27, 26, 26, 25, 24, 24, 25
	],
	[
		17, 20, 20, 20, 18, 20, 20, 19, 15, 16, 17, 6, 6, 4, 0, 3, 3, 4, 4, 4, 4, 2,
		25, 30, 26, 26, 25, 25, 24, 25
	],
	[
		17, 21, 21, 21, 19, 21, 21, 20, 16, 16, 18, 6, 9, 5, 3, 0, 1, 2, 2, 2, 1, 5,
		26, 28, 27, 27, 26, 25, 25, 26
	],
	[
		18, 21, 21, 21, 19, 21, 21, 20, 16, 16, 18, 6, 9, 5, 3, 1, 0, 2, 2, 2, 1, 5,
		26, 28, 27, 27, 26, 25, 25, 26
	],
	[
		18, 22, 22, 22, 20, 22, 22, 21, 17, 17, 19, 7, 10, 6, 4, 2, 2, 0, 1, 1, 2,
		6, 25, 27, 26, 26, 25, 24, 24, 25
	],
	[
		19, 22, 22, 22, 20, 22, 22, 21, 17, 17, 19, 7, 10, 6, 4, 2, 2, 1, 0, 1, 2,
		6, 25, 27, 26, 26, 25, 24, 24, 25
	],
	[
		19, 22, 22, 22, 20, 22, 22, 21, 17, 17, 19, 7, 10, 6, 4, 2, 2, 1, 1, 0, 2,
		6, 25, 27, 26, 26, 25, 24, 24, 25
	],
	[
		19, 21, 21, 21, 20, 21, 21, 20, 16, 17, 18, 7, 8, 5, 4, 1, 1, 2, 2, 2, 0, 5,
		25, 28, 26, 26, 26, 25, 25, 26
	],
	[
		18, 19, 19, 19, 17, 19, 19, 18, 14, 15, 16, 5, 8, 3, 2, 5, 5, 6, 6, 6, 5, 0,
		24, 26, 25, 25, 25, 23, 23, 24
	],
	[
		16, 26, 26, 26, 24, 26, 26, 25, 21, 22, 23, 27, 29, 24, 25, 26, 26, 25, 25,
		25, 25, 24, 0, 3, 3, 6, 6, 2, 7, 5
	],
	[
		23, 29, 29, 29, 27, 29, 28, 28, 24, 24, 26, 29, 32, 27, 30, 28, 28, 27, 27,
		27, 28, 26, 3, 0, 5, 8, 8, 5, 9, 7
	],
	[
		26, 27, 27, 27, 26, 27, 27, 26, 22, 23, 24, 28, 31, 26, 26, 27, 27, 26, 26,
		26, 26, 25, 3, 5, 0, 4, 4, 4, 5, 3
	],
	[
		24, 28, 28, 28, 26, 28, 27, 27, 23, 23, 25, 29, 31, 26, 26, 27, 27, 26, 26,
		26, 26, 25, 6, 8, 4, 0, 5, 7, 1, 2
	],
	[
		23, 27, 27, 27, 25, 27, 27, 26, 22, 22, 24, 28, 30, 25, 25, 26, 26, 25, 25,
		25, 26, 25, 6, 8, 4, 5, 0, 6, 4, 2
	],
	[
		22, 26, 26, 26, 24, 26, 25, 25, 21, 21, 23, 26, 28, 24, 25, 25, 25, 24, 24,
		24, 25, 23, 2, 5, 4, 7, 6, 0, 7, 6
	],
	[
		24, 26, 26, 26, 24, 26, 25, 25, 21, 21, 23, 26, 29, 24, 24, 25, 25, 24, 24,
		24, 25, 23, 7, 9, 5, 1, 4, 7, 0, 3
	],
	[
		24, 27, 27, 27, 25, 27, 26, 26, 22, 22, 24, 27, 30, 25, 25, 26, 26, 25, 25,
		25, 26, 24, 5, 7, 3, 2, 2, 6, 3, 0
	]
]

console.log("Is it symmetrical ? "+isMatrixSymmetrical(inputMatrix));
let symmetricalMatrix = makeMatrixSymmetrical(inputMatrix);
console.log("Is it still symmetrical after passage to makeMatrixSymmetrical method ? "+isMatrixSymmetrical(symmetricalMatrix)+"\n");

console.log("Is it reflexive ? "+isMatrixReflexive(inputMatrix));
let reflexiveMatrix = makeMatrixReflexive(inputMatrix);
let reflexiveMatrix2 = makeMatrixReflexive(symmetricalMatrix);
console.log("Is original matrix still reflexive after passage to makeMatrixReflexive method ? "+isMatrixReflexive(inputMatrix)+"");
console.log("Is symmetrical matrix still reflexive after passage to makeMatrixReflexive method ? "+isMatrixReflexive(reflexiveMatrix2)+"\n");


console.log("Is it transitive ? (no 0 outside diagonal) "+isMatrixTransitive_no_zero_outside_diagonal(inputMatrix)+"\n");
console.log("Is it transitive ? (i,k)=(i,j)+(j,k) :");
console.log(isTransitive(inputMatrix));

let transitivedMatrix = makeMatrixTransitive(inputMatrix);
function printMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        const row = matrix[i].join('\t'); // Join row elements with tabs
        console.log(row);
    }
}
printMatrix(transitivedMatrix);
console.log("Is it transitive after transitive closure [(i,k)=(i,j)+(j,k)] ? "+isTransitive(inputMatrix));
console.log("if it's not a binary matrix, then cannot apply transitive closure, we can only check if there are 0 outside diagonal")