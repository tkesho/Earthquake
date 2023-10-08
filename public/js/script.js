document.getElementById('submitBtn').addEventListener('click', function() {
	if (event.target !== this) {
        return; // Not the parent element, so exit
    }
	document.getElementById('anch').scrollIntoView({ behavior: 'smooth' });
});

const newScript = document.createElement('script');
newScript.async = true;
newScript.defer = true;
newScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjm3YW-5Tu8md2gpaMjE7SwbzIjOiGsqw&libraries=visualization&callback=initializeMap";  // Replace with your new URL

// If there's a callback function you want to execute when the script loads:
newScript.onload = function() {
	// Your callback logic here
};

document.body.appendChild(newScript);
function initializeMap() {
	const map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 0, lng: 0 },
		zoom: 3,
		styles: [
			// ...
		],
		disableDoubleClickZoom: true,
		streetViewControl: false,
	});

	
	let infoWindow;
	map.addListener('click', function(event) {
		let clickedLocation = event.latLng;

		if (infoWindow) {
			infoWindow.close();
		}

		infoWindow = new google.maps.InfoWindow({
			content: 'You clicked at: ' + clickedLocation.lat() + ', ' + clickedLocation.lng(),
			position: clickedLocation
		});

		infoWindow.open(map);
	});

	const api_url = "https://earthquake.usgs.gov/fdsnws/event/1/query";
	const earthquakeLayers = []; // Array to store earthquake data layers

	// Function to fetch earthquake data for a specific time interval
	function fetchEarthquakeDataForInterval(starttime, endtime, minmagnitude) {
		const params = {
			format: "geojson",
			starttime: starttime,
			endtime: endtime,
			minmagnitude: minmagnitude
		};

		return fetch(api_url + '?' + new URLSearchParams(params))
			.then(response => {
				if (!response.ok) {
					throw new Error('API request failed: ' + response.status);
				}
				return response.json();
			})
			.then(data => {
				// Process and display the data as needed
				console.log(data);

				// Create a new earthquake data layer
				const earthquakeData = new google.maps.MVCArray();

				// Process earthquake data and add markers to the data layer
				const features = data.features;
				for (const feature of features) {
					const coordinates = feature.geometry.coordinates;
					const latLng = new google.maps.LatLng(coordinates[1], coordinates[0]);
					const magnitude = feature.properties.mag;

					let fillOpacity = 0.2; // Default fill opacity

					// Define different circle styles based on magnitude range
					const circle = new google.maps.Circle({
						strokeColor: 'red',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: 'red',
						fillOpacity: fillOpacity * magnitude,
						map: null, // Initially not added to the map
						center: latLng,
						radius: feature.properties.mag * 10000,
						title: feature.properties.title
					});

					const infoWindow = new google.maps.InfoWindow({
						content: feature.properties.title
					});

					// Add click event listener to display info window
					circle.addListener('click', function () {
						infoWindow.open(map, circle);
					});

					earthquakeData.push(circle); // Add the circle to the earthquake data layer
				}

				earthquakeLayers.push(earthquakeData); // Store the earthquake data layer

				// Add the earthquake data layer to the map
				earthquakeData.forEach(circle => {
					circle.setMap(map);
				});
			})
			.catch(error => {
				console.error("An error occurred:", error);
			});
	}

	// Function to fetch earthquake data in two-month intervals
	function fetchEarthquakeDataInIntervals(starttime, endtime, minmagnitude) {
		const intervalInMonths = 2; // Adjust as needed
		const currentDate = new Date(starttime);
		const endDate = new Date(endtime);

		// Clear the map and reset earthquakeLayers before fetching new data
		earthquakeLayers.forEach(dataLayer => {
			dataLayer.forEach(circle => {
				circle.setMap(null); // Remove circles from the map
			});
		});
		earthquakeLayers.length = 0; // Clear the earthquakeLayers array

		while (currentDate < endDate) {
			const intervalStart = new Date(currentDate);
			const intervalEnd = new Date(currentDate);
			intervalEnd.setMonth(intervalEnd.getMonth() + intervalInMonths);

			// Convert intervalStart and intervalEnd to the API date format
			const apiStartTime = intervalStart.toISOString().slice(0, 19);
			const apiEndTime = intervalEnd.toISOString().slice(0, 19);

			// Make the API request and process data for this interval
			fetchEarthquakeDataForInterval(apiStartTime, apiEndTime, minmagnitude);

			// Move to the next interval
			currentDate.setMonth(currentDate.getMonth() + intervalInMonths);
		}
	}

	// Add an event listener to the "Submit" button to call fetchEarthquakeDataInIntervals when clicked
	document.getElementById("submitBtn").addEventListener("click", function () {
		const starttime = document.getElementById("starttime").value;
		const endtime = document.getElementById("endtime").value;
		const minmagnitude = document.getElementById("minmagnitude").value;

		// Call the function to fetch data in two-month intervals
		fetchEarthquakeDataInIntervals(starttime, endtime, minmagnitude);
	});

	// Automatically trigger the click event of the submit button when the website is launched
	//document.getElementById("submitBtn").click();
}

document.getElementById('liveearth').addEventListener('click', function(event) {
	event.preventDefault();
	document.getElementById('earthquakeForm').style.display = 'none';
	//checking
	document.getElementById('liveearth').style.backgroundColor = '#8B4513';
	document.getElementById('dateearth').style.backgroundColor = '#d6732d';
	document.getElementById('zoneearth').style.backgroundColor = '#d6732d';
	document.getElementById('aboutearth').style.backgroundColor = '#d6732d';
});

document.getElementById('zoneearth').addEventListener('click', function(event) {
	event.preventDefault();
	document.getElementById('earthquakeForm').style.display = 'none';
	document.getElementById('liveearth').style.backgroundColor = '#d6732d';
	document.getElementById('dateearth').style.backgroundColor = '#d6732d';
	document.getElementById('zoneearth').style.backgroundColor = '#8B4513';
	document.getElementById('aboutearth').style.backgroundColor = '#d6732d';
});

document.getElementById('aboutearth').addEventListener('click', function(event) {
	event.preventDefault();
	document.getElementById('earthquakeForm').style.display = 'none';
	document.getElementById('liveearth').style.backgroundColor = '#d6732d';
	document.getElementById('dateearth').style.backgroundColor = '#d6732d';
	document.getElementById('zoneearth').style.backgroundColor = '#d6732d';
	document.getElementById('aboutearth').style.backgroundColor = '#8B4513';
});

document.getElementById('dateearth').addEventListener('click', function(event) {
	event.preventDefault();
	document.getElementById('earthquakeForm').style.display = 'block';
	document.getElementById('liveearth').style.backgroundColor = '#d6732d';
	document.getElementById('dateearth').style.backgroundColor = '#8B4513';
	document.getElementById('zoneearth').style.backgroundColor = '#d6732d';
	document.getElementById('aboutearth').style.backgroundColor = '#d6732d';
})