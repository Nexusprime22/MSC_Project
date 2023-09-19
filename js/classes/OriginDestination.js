import { generateMatrixWithRandomValues } from "../utils/tools.js";
import originDestinationData from "../../data/originDestinationData.json" assert { type: "json" };
import routeColors from "../../data/routeColors.json" assert { type: "json" };

export class OriginDestination {
	constructor(locations, friends) {
		this.locations = locations;
		this.friends = friends;

		// Static matrix generated with random values between 5 and 60
		this.originDestinationMatrix = originDestinationData;

		this.meetingLocation;

		// // Matrix generated with random values between 5 and 60
		// this.originDestinationMatrix = generateMatrixWithRandomValues(
		// 	locations,
		// 	5,
		// 	60
		// );

		// Create a map object and set the view to a specific location and zoom level
		this.map = L.map("map").setView([47.57, 6.86], 12);

		// Add a tile layer for the map
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(this.map);

		// Loop through the locations and add markers
		locations.forEach((location) => {
			L.marker([location.latitude, location.longitude])
				.addTo(this.map)
				.bindPopup(location.name); // Display the name as a popup when the marker is clicked
		});
	}

	// Function to find the earliest meeting point
	findEarliestMeetingPoint() {
		let friendsLocation = [];

		// Loop through all friends to store their current location in an array
		for (let x = 0; x < this.friends.length; x++) {
			friendsLocation.push(this.friends[x].currentLocation);
		}

		let earliestMeetingLocation = null;
		let earliestMeetingTime = Infinity;

		// Iterate through all possible meeting locations
		for (let i = 0; i < this.locations.length; i++) {
			let maxTravelTime = 0;

			// Calculate the maximum travel time for all friends to reach the meeting location
			for (const personLocation of friendsLocation) {
				const personLocationIndex = this.locations.indexOf(personLocation);
				if (
					this.originDestinationMatrix[personLocationIndex][i] > maxTravelTime
				) {
					maxTravelTime = this.originDestinationMatrix[personLocationIndex][i];
				}
			}

			// If the calculated maximum travel time is less than the current earliest time, update the result
			if (maxTravelTime < earliestMeetingTime) {
				earliestMeetingTime = maxTravelTime;
				earliestMeetingLocation = this.locations[i];
			}
		}

		this.meetingLocation = earliestMeetingLocation;
		// Add a popup to indicate what's the meeting point
		L.popup()
			.setLatLng([
				this.meetingLocation.latitude,
				this.meetingLocation.longitude,
			])
			.setContent(`The earliest meeting point is ${this.meetingLocation.name}`)
			.openOn(this.map);

		return this.meetingLocation;
	}

	generateRouteForFriends() {
		for (let x = 0; x < this.friends.length; x++) {
			const routeColor = routeColors.colors[x % routeColors.colors.length]; // Get a color from the array
			L.Routing.control({
				waypoints: [
					// Origin is the location of the friend
					L.latLng(
						this.friends[x].currentLocation.latitude,
						this.friends[x].currentLocation.longitude
					),
					// Destination is the location of the meeting point
					L.latLng(
						this.meetingLocation.latitude,
						this.meetingLocation.longitude
					),
				],
				fitSelectedRoutes: false,
				draggableWaypoints: false,
				routeWhileDragging: false,
				createMarker: function () {
					return null;
				},
				lineOptions: {
					addWaypoints: false,
					styles: [{ color: routeColor, weight: 5 }],
				},
			}).addTo(this.map);
		}
	}
}
