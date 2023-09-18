import { generateMatrixWithRandomValues } from "../utils/tools.js";
import originDestinationData from "../../data/originDestinationData.json" assert { type: "json" };

export class OriginDestination {
	constructor(locations, friends) {
		this.locations = locations;
		this.friends = friends;

		// Static matrix generated with random values between 5 and 60
		this.originDestinationMatrix = originDestinationData;

		// // Matrix generated with random values between 5 and 60
		// this.originDestinationMatrix = generateMatrixWithRandomValues(
		// 	locations,
		// 	5,
		// 	60
		// );
	}

	// Function to find the earliest meeting point
	findEarliestMeetingPoint(locations, originDestinationMatrix, friends) {
		let friendsLocation = [];

		for (let x = 0; x < friends.length; x++) {
			friendsLocation.push(friends[x].currentLocation);
		}

		let earliestMeetingLocation = null;
		let earliestMeetingTime = Infinity;

		// Loop through all locations
		for (let i = 0; i < locations.length; i++) {
			let maxTravelTime = 0;

			// Calculate the maximum travel time for the current location
			for (const personLocation of friendsLocation) {
				// Find the index of the person's location in the locations array
				const personLocationIndex = locations.indexOf(personLocation);

				// Update maxTravelTime if the travel time is greater
				if (originDestinationMatrix[i][personLocationIndex] > maxTravelTime) {
					maxTravelTime = originDestinationMatrix[i][personLocationIndex];
				}
			}

			// Update the earliest meeting point if a better one is found
			if (maxTravelTime < earliestMeetingTime) {
				earliestMeetingTime = maxTravelTime;
				earliestMeetingLocation = locations[i];
			}
		}

		return earliestMeetingLocation;
	}
}
