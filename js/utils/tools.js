// Function to generate a random value between a minimum and maximum
function randomIntFromInterval(min, max) {
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
