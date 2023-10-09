import * as tools from "../utils/tools.js";

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

		// we check if the json is a squared matrix
		if(!tools.isItSquaredMatrix(this.originDestinationMatrix)){
			console.log("the matrix is not a squared matrix, at a specific row, we don't have the same number of columns as the number of rows");
		}
		else{
			console.log("matrix is a squared matrix, we can use it");
		}

		// console.log("originDestinationData:", originDestinationData);
		console.log("Matrix dimensions:", originDestinationData.length, "x", originDestinationData[0].length);
		
		// we check if the json is a reflexive matrix
		if(!tools.isMatrixReflexive(this.originDestinationMatrix)){
			console.log("the matrix is not reflexive, there are values different from 0 in diagonal");
			// we make it reflexive
			this.originDestinationMatrix = tools.makeMatrixReflexive(this.originDestinationMatrix);

		}
		else{
			console.log("matrix is reflexive, only 0 on diagonal");
		}

		// we check if the json is a symmetrical matrix
		if(!tools.isMatrixSymmetrical(this.originDestinationMatrix)){
			console.log("the matrix is not symmetrical, at (i,j) we don't have the same value than at (j,i)");
			// we make it symmetrical
			this.originDestinationMatrix = tools.makeMatrixSymmetrical(this.originDestinationMatrix);
		}
		else{
			console.log("matrix is symmetrical, at (i,j) we have the same value than at (j,i)");
		}

		// we check if the json is a transitive matrix
		if(!tools.isMatrixTransitive_no_zero_outside_diagonal(this.originDestinationMatrix)){
			console.log("the matrix is not transitive, there are 0 outside diagonal");
		}
		else{
			console.log("matrix is transitive, no 0 outside diagonal");
		}
		// console.log("originDestinationData:", originDestinationData);
		// console.log("Matrix dimensions:", originDestinationData.length, "x", originDestinationData[0].length);		

		this.meetingLocation;
		this.isTracking = false; // Track if tracking is active

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

			// Disable the button to follow the friends once the routes are generated
			document.querySelector(
				"#buttonFollowFriendsToMeetingPoint"
			).disabled = true;
		};

		// Call the function to generate the routes for friends when the button is clicked
		document.querySelector("#buttonGenerateRouteForFriends").onclick = () => {
			this.generateRouteForFriends();

			// Enable the button to follow the friends once the routes are generated
			document.querySelector(
				"#buttonFollowFriendsToMeetingPoint"
			).disabled = false;

			// Disable the button to generate routes
			document.querySelector("#buttonGenerateRouteForFriends").disabled = true;
		};

		// Call the function to follow the friends when the button is clicked
		document.querySelector("#buttonFollowFriendsToMeetingPoint").onclick =
			() => {
				if (!this.isTracking) {
					// Start following friends to the meeting point
					this.followFriendsToMeetingPoint();

					// Disable the button to change locations
					document.querySelector(
						"#buttonChangeFriendsLocation"
					).disabled = true;

					// Disable the button to find a meeting point
					document.querySelector(
						"#buttonFindEarliestMeetingPoint"
					).disabled = true;

					// Update the button text to "Cancel Tracking" when tracking starts
					document.querySelector(
						"#buttonFollowFriendsToMeetingPoint span"
					).textContent = "CANCEL TRACKING";

					this.isTracking = true;
				} else {
					// Stop tracking when the button is clicked again
					clearInterval(this.trackingInterval);

					// Enable the button to change friends location once tracking is canceled
					document.querySelector(
						"#buttonChangeFriendsLocation"
					).disabled = false;
					// Enable the button to find the meeting point once tracking is canceled
					document.querySelector(
						"#buttonFindEarliestMeetingPoint"
					).disabled = false;

					// Update the button text to "CHANGE FRIENDS LOCATION" when tracking is canceled
					document.querySelector(
						"#buttonFollowFriendsToMeetingPoint span"
					).textContent = "FOLLOW FRIENDS";

					this.isTracking = false;
				}
			};
	}

	followFriendsToMeetingPoint() {
		// Function to periodically update friend positions
		const updateFriendPositions = () => {
			const arrivedFriends = new Set(); // Use a Set to keep track of arrived friends

			for (let x = 0; x < this.friends.length; x++) {
				const friend = this.friends[x];
				const routingControl = friend.routingControl;

				// Check if routingControl is defined and we find routes
				if (
					routingControl != undefined &&
					routingControl != null &&
					routingControl._routes != undefined
				) {
					// Get the first route from routingControl
					const route = routingControl._routes[0];

					// Get all coordinates of the route
					const currentLatLng = route.coordinates;

					// Check if the friend has already arrived
					if (friend.hasArrived) {
						arrivedFriends.add(friend); // Add the friend to the Set of arrived friends
						continue; // Skip this friend if they have arrived
					}

					// Get the travel time in seconds
					const travelTime = route.summary.totalTime;
					// Calculate the travel time per coordinate in seconds
					const travelTimePerCoordinate = travelTime / currentLatLng.length;

					// Generate a random number between 0 and 2 in order to have a sort of tracking by advancing or not on the road
					const randomNumber = tools.randomIntFromInterval(0, 2);

					// If the random number is 0, it means that the friend doesn't move so he's losing time
					if (randomNumber == 0) {
						friend.trackTravelTime -= travelTimePerCoordinate;
					} else if (randomNumber == 1) {
						// No change to trackTravelTime
					}
					// Else, the random number is 2, it means that the friend skipped a coordinate so he's gaining time
					else {
						friend.trackTravelTime += travelTimePerCoordinate;
					}

					// Calculate the index for the next position update
					const currentPositionIndex = friend.currentPositionIndex || 0;
					const newPositionIndex = currentPositionIndex + randomNumber;

					// Check if there are more coordinates in the route
					if (newPositionIndex < currentLatLng.length) {
						// Get the new position from the route coordinates
						const newLatLng = currentLatLng[newPositionIndex];

						// Update the friend's position
						friend.currentLocation.latitude = newLatLng.lat;
						friend.currentLocation.longitude = newLatLng.lng;

						// Update the friend's marker on the map
						this.updateFriendMarker(x, friend.trackTravelTime);

						// Store the updated position index for the friend
						friend.currentPositionIndex = newPositionIndex;
					} else {
						// The friend has reached the destination
						friend.hasArrived = true; // Mark the friend as arrived
						arrivedFriends.add(friend); // Add the friend to the Set of arrived friends
						tools.log(`${friend.name} has arrived at the meeting point!`);
					}
				}
			}

			// If all friends arrived
			if (arrivedFriends.size === this.friends.length) {
				tools.log("All friends have arrived!");
				clearInterval(this.trackingInterval); // Stop the interval when all friends have arrived
				// Enable the button to change friends location once the tracking is finished
				document.querySelector("#buttonChangeFriendsLocation").disabled = false;
				// Enable the button to find the meeting point once the tracking is finished
				document.querySelector(
					"#buttonFindEarliestMeetingPoint"
				).disabled = false;
				this.isTracking = false;
			}
		};

		// Update friend positions periodically
		this.trackingInterval = setInterval(updateFriendPositions, 500); // Update every half of a second
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
					`${this.friends[x].name} is currently at ${this.friends[x].currentLocation.name}.`
				);
			tools.log(
				`${this.friends[x].name} is currently at ${this.friends[x].currentLocation.name}.`
			);
		}
	}

	updateFriendMarker(friendIndex, trackTravelTime) {
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

		// If we haven't specified travel time
		if (trackTravelTime == null) {
			tools.log(`${friend.name} is currently at ${location.name}.`);
		} else {
			// Show an alert in the logs if he is 10 or more early
			if (trackTravelTime > 10) {
				tools.log(
					`${friend.name} will be ${Math.round(trackTravelTime)} seconds early.`
				);
			}
			// Show an alert in the logs if he is -10 or less late
			if (trackTravelTime < -10) {
				tools.log(
					`${friend.name} will be ${Math.abs(
						Math.round(trackTravelTime)
					)} seconds late.`
				);
			}
		}

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
			// Disable the button to follow friends if a friend's location is changed
			document.querySelector(
				"#buttonFollowFriendsToMeetingPoint"
			).disabled = true;

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
			this.updateFriendMarker(friendIndex, null);

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
		// Remove existing routes before generating new ones
		this.removeExistingRoutes();
		let friendsLocation = [];

		// Loop through all friends to store their current location in an array but also to reset some values used for the follow
		for (let x = 0; x < this.friends.length; x++) {
			this.friends[x].trackTravelTime = 0;
			this.friends[x].hasArrived = false;
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
		tools.log(
			`The earliest meeting point is ${this.meetingLocation.name} and will take place in ${earliestMeetingTime} minutes.`
		);

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
			const routeColor = routeColors.colors[x % routeColors.colors.length];

			// Clear old routes and tracking information for each friend
			this.friends[x].routingControl = null;
			this.friends[x].currentPositionIndex = 0;
			this.friends[x].hasArrived = false;
			this.friends[x].trackTravelTime = 0;

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
				// show: false, // To disable the itinerary
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

		// Get all elements with the class "leaflet-routing-container" which contain the itinerary
		const routingContainers = document.querySelectorAll(
			".leaflet-routing-container"
		);

		// Create the button which will allow to close the itinerary
		const closeButton = document.createElement("span");
		closeButton.className = "closeItineraryButton";
		closeButton.setAttribute("aria-hidden", "true");
		closeButton.style.cssText =
			"right: 5px; position: absolute; cursor: pointer; font-size: 3rem; top: -3px;";
		closeButton.textContent = "×"; // Set the text content to "×"

		// Loop through each "leaflet-routing-container" element and append the child
		routingContainers.forEach((container) => {
			container.appendChild(closeButton.cloneNode(true));
		});

		// Detect a click
		document.addEventListener("click", function (event) {
			const clickedElement = event.target;

			// Check if the clicked element has the "closeItineraryButton" class
			if (clickedElement.classList.contains("closeItineraryButton")) {
				// Access the parent element
				const parentElement = clickedElement.parentNode;
				// Hide the itinerary tab
				parentElement.classList.add("leaflet-routing-container-hide");
				parentElement.style.cursor = "pointer";
				// Hide the cross
				clickedElement.style.display = "none";

				// Prevent the click event from propagating further
				event.stopPropagation();
			}

			// Check if the clicked element has the "leaflet-routing-container" class
			if (clickedElement.classList.contains("leaflet-routing-container")) {
				// If the clicked element has the class to hide the itinerary, we remove it to show the itinerary
				if (
					clickedElement.classList.contains("leaflet-routing-container-hide")
				) {
					clickedElement.classList.remove("leaflet-routing-container-hide");
					clickedElement.children[1].style.display = "block";
				}

				// Prevent the click event from propagating further
				event.stopPropagation();
			}
		});
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
