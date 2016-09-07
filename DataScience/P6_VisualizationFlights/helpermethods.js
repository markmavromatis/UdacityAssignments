// Setup associated data file (either annual or 1-month of data)
var filename = `data/airport_carrier_stats_annual.csv`

var FLIGHT_DATA_2015 = [];

function initializePage() {

	// Load the file and setup the chart data
	d3.csv(filename, function (data) {
  		FLIGHT_DATA_2015 = data;
		console.log("Loaded flight data.");
	})

	document.getElementById('TestButton').addEventListener("click", function(evt) {
		const filteredData = filterData();
		prepareOnTimePercentData(filteredData);
	});
}


function filterData() {

	var selectedAirport = document.getElementById('airport').value;
	var selectedTimeframe = document.getElementById('timeframe').value;

	console.log("# of flight records: " + FLIGHT_DATA_2015.length);
	console.log("Selected airport = " + selectedAirport);
	console.log("Selected timeframe = " + selectedTimeframe);

	const filteredData = FLIGHT_DATA_2015.filter(function(row) {
		const airportMatch = selectedAirport === "000" || selectedAirport === row['Origin'];
		const timeframeMatch = selectedTimeframe === "annual" || selectedTimeframe === row['Month'];
		return airportMatch && timeframeMatch;
	})

	console.log("Filtered row count: " + filteredData.length);
	return filteredData;
}

function prepareOnTimePercentData(flightData) {

	// Array will hold airlines and flight data
	// Lookup object will hold airline -> row mapping

	console.log("Entering method prepareOnTimePercentData...");
	console.log("# rows = " + flightData.length);
	var carrierData = [];
	var carrierLookup = {};

	for (var i = 0; i < flightData.length; i++) {
		const row = flightData[i];
		const carrierName = row['CarrierName'];
		console.log("Carrier = " + carrierName);
		var statRow = {}
		if (carrierLookup[carrierName]) {
			// Get existing carrier row
			statRow = carrierLookup[carrierName];
			carrierData[carrierName] = [];
			carrierData[carrierName]['OnTimeFlights'] = 0;
			carrierData[carrierName]['DelayedFlights'] = 0;
		} else {
			// add new row to carrierData array and lookup table 
			carrierData.push(statRow);
			carrierLookup[carrierName] = statRow;
		}
		const statRow = carrierData[carrierName];
		const recordType = row['RecordType'];
		if (recordType === 'OnTime') {
			statRow['OnTimeFlights'] += row['Count'];
		} else if (recordType === 'Delayed') {
			statRow['DelayedFlights'] += row['Count'];
		} else {
			throw "Unexpected record type: " + recordType;
		}

	}
	console.log("Carrier data length: " + carrierData.length);
	const airlineOnTimePercentages = [];
	const carrierDataKeys = Object.keys(carrierData);

	for (var i = 0; i < carrierDataKeys.length; i++) {
		const targetRow = new [];

		const row = carrierData[i];
		const carrierName = carrierData['CarrierName'];
		const onTimeCount = carrierData['OnTimeFlights'];
		const delayedCount = carrierData['DelayedFlights'];
		const totalCount = onTimeCount + delayedCount;
		const onTimePercent = onTimeCount / totalCount;
		carrierData['OnTimePercent'] = onTimePercent;

		console.log(`${carrierName}     ${onTimeCount}     ${totalCount}    ${onTimePercent}`)
	}

}