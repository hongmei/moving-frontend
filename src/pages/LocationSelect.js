/*global google*/
import React, { Component } from "react";
import { withStyles, Button, Divider, Box } from "@material-ui/core";
import LocationField from "../components/LocationField";
import Map from "../components/Map";
import { connect } from "react-redux";
import { locationSelected, setStep } from "../redux/actions";

const styles = {
	topPanel: {
		height: 110
	},
	panel: {
		background: "var(--colorWhite)",
		padding: 10,
		display: "inline-flex",
		alignItems: "center"
	},
	divider: {
		height: 30,
		marginRight: 20,
		background: "var(--colorLightGray)"
	},
	button: {
		background: "var(--colorYellow)"
	}
};

class LocationSelect extends Component {
	state = {
		directions: null,
		distance: 0
	};

	componentWillMount() {
		const { location, setStep } = this.props;
		setStep(2);
		this.setState({
			pickup: location ? location.pickup : null,
			destination: location ? location.destination : null
		});
	}

	showDirection = () => {
		const { pickup, destination } = this.state;
		if (pickup && destination) {
			this.getDistance(pickup.coordinate, destination.coordinate);
			const directionsService = new google.maps.DirectionsService();
			directionsService.route(
				{
					origin: pickup.coordinate,
					destination: destination.coordinate,
					travelMode: google.maps.TravelMode.DRIVING
				},
				(result, status) => {
					if (status === google.maps.DirectionsStatus.OK) {
						this.setState({
							directions: result
						});
					} else {
						console.error(`error fetching directions ${result}`);
					}
				}
			);
		}
	};

	getDistance = (pickup, destination) => {
		const latLong1 = new google.maps.LatLng(pickup.lat, pickup.lng);
		const latLong2 = new google.maps.LatLng(destination.lat, destination.lng);
		const distance = google.maps.geometry.spherical.computeDistanceBetween(
			latLong1,
			latLong2
		);
		this.setState({
			distance: distance
		});
	};

	pickupSelected = data => {
		this.setState({
			pickup: data
		});
		this.showDirection();
	};

	destinationSelected = data => {
		this.setState({
			destination: data
		});
		this.showDirection();
	};

	onClickContinue = () => {
		const { pickup, destination } = this.state;

		if (!pickup || !destination) {
			alert("Select pickup and destination");
			return;
		}

		this.props.history.push("/vehicle");
		this.props.locationSelected({
			pickup: pickup,
			destination: destination
		});
	};

	render() {
		const { classes } = this.props;
		const { directions, pickup, destination, distance } = this.state;

		return (
			<div>
				<div className={classes.topPanel}>
					<div className={classes.panel}>
						<LocationField direction={0} placeSelected={this.pickupSelected} />
						<Divider orientation="vertical" className={classes.divider} />
						<LocationField
							direction={1}
							placeSelected={this.destinationSelected}
						/>
						<Button
							className={classes.button}
							size="large"
							onClick={() => this.onClickContinue()}
						>
							Continue
						</Button>
					</div>
					<Box mt={1}>
						distance : {Number.parseFloat(distance / 1000).toFixed(2)}km
					</Box>
				</div>
				<Map
					pickup={pickup ? pickup.coordinate : null}
					destination={destination ? destination.coordinate : null}
					directions={directions}
					width="100%"
					height="calc(100vh - 250px)"
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	location: state.selectedLocation
});

const mapDispatchToProps = dispatch => ({
	locationSelected: location => dispatch(locationSelected(location)),
	setStep: value => dispatch(setStep(value))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(LocationSelect));
