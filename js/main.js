import { Location } from "./classes/Location.js";
import { Friend } from "./classes/Friend.js";
import { OriginDestination } from "./classes/OriginDestination.js";
import locationsData from "../data/locationsData.json" assert { type: "json" };
import friendsList from "../data/friendsData.json" assert {type : "json"}

const locations = locationsData.map(
	(data) => new Location(data.name, data.latitude, data.longitude)
);

// const friendsArray = [
// 	new Friend("Antonin", locations[0]),
// 	new Friend("Killian", locations[15]),
// ];

const friendsArray = friendsList.map(friend => new Friend(friend.name, new Location(friend.name ,friend.latitude, friend.longitude)));

const matrix = new OriginDestination(locations, friendsArray);

console.log(matrix);

const meetingLocation = matrix.findEarliestMeetingPoint();

matrix.generateRouteForFriends();

console.log(`The earliest meeting point is ${meetingLocation.name}`);
