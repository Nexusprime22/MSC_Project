export class Friend {
	constructor(
		name,
		currentLocation,
		iconUrl,
		currentPositionIndex,
		hasArrived,
		marker,
		routingControl,
		trackTravelTime
	) {
		this.name = name;
		this.currentLocation = currentLocation;
		this.iconUrl = iconUrl;
		this.currentPositionIndex = currentPositionIndex;
		this.hasArrived = hasArrived;
		this.marker = marker;
		this.routingControl = routingControl;
		this.trackTravelTime = trackTravelTime;
	}
}
