import { Location } from "./classes/Location.js";
import { Friend } from "./classes/Friend.js";
import { OriginDestination } from "./classes/OriginDestination.js";
import locationsData from "../data/locationsData.json" assert { type: "json" };
import friendsList from "../data/friendsData.json" assert { type: "json" };

const locations = locationsData.map(
	(data) => new Location(data.name, data.latitude, data.longitude)
);

// Map friends array
const friendsArray = friendsList.map((friend) => {
	// Specify the parameters to match
	const targetName = friend.currentLocation.name;
	const targetLatitude = friend.currentLocation.latitude;
	const targetLongitude = friend.currentLocation.longitude;

	// Use findIndex to find the index of the element that matches the parameters
	const index = locations.findIndex((location) => {
		return (
			location.name === targetName &&
			location.latitude === targetLatitude &&
			location.longitude === targetLongitude
		);
	});

	if (index !== -1) {
		// If the element is found, use it to create a new Friend
		return new Friend(
			friend.name,
			locations[index],
			friend.iconUrl,
			friend.currentPositionIndex,
			friend.hasArrived,
			friend.marker,
			friend.routingControl,
			friend.trackTravelTime
		);
	} else {
		// Handle the case where the element is not found (optional)
		console.log(`Location not found for ${friend.name}`);
		return;
	}
});

new OriginDestination(locations, friendsArray);
