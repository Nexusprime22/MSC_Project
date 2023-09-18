import { Location } from "./classes/Location.js";
import { Friend } from "./classes/Friend.js";
import { OriginDestination } from "./classes/OriginDestination.js";
import locationsData from "../data/locationsData.json" assert { type: "json" };

// Create the locations array using our locationsData.json file
const locations = locationsData.map(
	(data) => new Location(data.name, data.latitude, data.longitude)
);

const friendsArray = [
	new Friend("Antonin", locations[0]),
	new Friend("Killian", locations[29]),
];

const matrix = new OriginDestination(locations, friendsArray);

console.log(matrix);

const meetingLocation = matrix.findEarliestMeetingPoint(
	matrix.locations,
	matrix.originDestinationMatrix,
	matrix.friends
);

console.log(`The earliest meeting point is ${meetingLocation.name}`);
