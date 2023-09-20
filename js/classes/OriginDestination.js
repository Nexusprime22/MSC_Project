import { generateMatrixWithRandomValues } from "../utils/tools.js";
import { closeModal } from "../utils/handleModal.js";
import originDestinationData from "../../data/originDestinationData.json" assert { type: "json" };
import routeColors from "../../data/routeColors.json" assert { type: "json" };

export class OriginDestination {
	constructor(locations, friends) {
		// Initialize the OriginDestination class with locations and friends data
		this.locations = locations;
		this.friends = friends;

		// Static matrix filled manually
		this.originDestinationMatrix = originDestinationData;

		this.meetingLocation;

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

		// Place the friends on the map
		this.placeFriendsToLocations();

		// Function that allows changing the location of friends using the form
		this.changeFriendLocation();

		// Call the function to find the meeting point when the button is clicked
		document.querySelector("#buttonFindEarliestMeetingPoint").onclick = () => {
			this.findEarliestMeetingPoint();
			// Enable the button to generate routes once the meeting point is found
			document.querySelector("#buttonGenerateRouteForFriends").disabled = false;
		};

		// Call the function to generate the routes for friends when the button is clicked
		document.querySelector("#buttonGenerateRouteForFriends").onclick = () => {
			this.generateRouteForFriends();
		};
	}

	placeFriendsToLocations() {
		const offset = 0.001; // Little offset to prevent overlap of friends

		// Loop through all friends to show them on the map with an offset
		for (let x = 0; x < this.friends.length; x++) {
			// Custom icon of the person
			let personIcon = L.icon({
				iconUrl: "./media/icons/" + this.friends[x].iconUrl,
				iconSize: [52, 52], // Adjust the size as needed
			});

			// Add a small random offset to the latitude and longitude
			const offsetLatitude = this.friends[x].currentLocation.latitude;
			const offsetLongitude = this.friends[x].currentLocation.longitude;

			// Add the marker to the friend object in order to allow its modification
			this.friends[x].marker = L.marker(
				[
					offsetLatitude + (Math.random() - 0.5) * offset,
					offsetLongitude + (Math.random() - 0.5) * offset,
				],
				{
					icon: personIcon,
				}
			)
				.addTo(this.map)
				.bindPopup(
					`${this.friends[x].name} is currently at ${this.friends[x].currentLocation.name}`
				);
		}
	}

	updateFriendMarker(friendIndex) {
		const offset = 0.001; // Little offset to prevent overlap of friends
		const friend = this.friends[friendIndex];
		const location = friend.currentLocation;

		// Remove the old marker from the map
		if (friend.marker) {
			this.map.removeLayer(friend.marker);
		}

		// Create a new marker with the updated location
		const personIcon = L.icon({
			iconUrl: "./media/icons/" + friend.iconUrl,
			iconSize: [52, 52], // Adjust the size as needed
		});

		friend.marker = L.marker(
			[
				location.latitude + (Math.random() - 0.5) * offset,
				location.longitude + (Math.random() - 0.5) * offset,
			],
			{
				icon: personIcon,
			}
		)
			.addTo(this.map)
			.bindPopup(`${friend.name} is currently at ${location.name}`);

		// Close the modal
		closeModal();
	}

	changeFriendLocation() {
		const form = document.querySelector("#changeFriendsLocationForm");
		// Detect when the user submits the form
		form.addEventListener("submit", (event) => {
			event.preventDefault();
			const friendIndex = parseFloat(document.querySelector("#friend").value);
			const locationIndex = parseFloat(
				document.querySelector("#location").value
			);

			// Disable the button to generate routes if a friend's location is changed
			document.querySelector("#buttonGenerateRouteForFriends").disabled = true;

			// Get the index of the new location
			let index = this.locations.findIndex((location) => {
				return (
					location.name === this.locations[locationIndex].name &&
					location.latitude === this.locations[locationIndex].latitude &&
					location.longitude === this.locations[locationIndex].longitude
				);
			});

			// Update the friend's location data
			this.friends[friendIndex].currentLocation = this.locations[index];

			// Update the friend's marker on the map
			this.updateFriendMarker(friendIndex);

			// Go back to initial view
			this.map.setView([47.57, 6.86], 12);

			// Remove the existing meeting point marker if it exists
			if (this.meetingPointMarker) {
				this.map.removeLayer(this.meetingPointMarker);
			}

			// Remove existing routes
			this.removeExistingRoutes();
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

		// Remove the existing meeting point marker if it exists
		if (this.meetingPointMarker) {
			this.map.removeLayer(this.meetingPointMarker);
		}

		this.meetingLocation = earliestMeetingLocation;
		let meetingPointIcon = L.icon({
			iconUrl: "./media/icons/meeting.png", // Replace with your marker icon URL
			iconSize: [52, 52],
		});

		// Create a marker for the meeting point
		this.meetingPointMarker = L.marker(
			[this.meetingLocation.latitude, this.meetingLocation.longitude],
			{
				icon: meetingPointIcon,
			}
		)
			.addTo(this.map)
			.bindPopup(
				`The earliest meeting point is ${this.meetingLocation.name} and will take place in ${earliestMeetingTime} minutes.`
			)
			.openPopup(); // Open the popup when the marker is added;

		// Center the map on the popup's coordinates
		this.map.setView(
			[this.meetingLocation.latitude, this.meetingLocation.longitude],
			13
		);

		return { location: this.meetingLocation, time: earliestMeetingTime };
	}

	generateRouteForFriends() {
		// Remove existing routes before generating new ones
		this.removeExistingRoutes();

		for (let x = 0; x < this.friends.length; x++) {
			const routeColor = routeColors.colors[x % routeColors.colors.length]; // Get a color from the array
			const routingControl = L.Routing.control({
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
				show: false, // To disable the itinerary
				createMarker: function () {
					return null;
				},
				lineOptions: {
					addWaypoints: false,
					styles: [{ color: routeColor, weight: 5 }],
				},
			}).addTo(this.map);

			// Store the routing control instance for future removal
			this.friends[x].routingControl = routingControl;
		}
	}

	removeExistingRoutes() {
		// Remove existing routing controls for friends
		for (let x = 0; x < this.friends.length; x++) {
			const routingControl = this.friends[x].routingControl;
			if (routingControl) {
				this.map.removeControl(routingControl);
			}
		}
	}
}
