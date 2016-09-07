// Setup associated data file (either annual or 1-month of data)
var filename = `data/airport_carrier_stats_annual.csv`

var FLIGHT_DATA_2015 = [];
var myChart;
// Create a SVG container for our bar chart
var svg = dimple.newSvg("#chartContainer", 590, 400);

// For the zoom control, we need to store the Y axis maximum value at 100% zoom.
var originalYMax = 0;


initializePage();


function initializePage() {

	// Hide user inputs
	// document.getElementById('UserInputs').disabled = true;

	// Disable controls while the story is being told...
	disableControls(true);

	// Load the file and setup the chart data
	d3.csv(filename, function (data) {
  		FLIGHT_DATA_2015 = data;
		console.log("Loaded flight data.");
		updateChart();
	})

	document.getElementById('chartModeFlights').addEventListener("change", function(evt) {
		console.log("Clicked Flight Counts mode!");
		updateChart();
	})

	document.getElementById('chartModePercent').addEventListener("click", function(evt) {
		console.log("Clicked Flight Percent mode!");
		updateChart();
	})

    // For airport and time frame selection controls, update the chart when the value changes
    d3.select("#airport").on("change", function() {updateChart()});
    d3.select("#timeframe").on("change", function() {updateChart()});





    // Zoom updates
    d3.select("#zoomLevel").on("change", function() {

      const zoomLevelValue = this.value;
      const newMax = 1.0 * originalYMax / (zoomLevelValue / 100);
      d3.select("#zoomLevelDisplay").text(zoomLevelValue + "%")
      myChart.axes[1].overrideMax = newMax;
      myChart.draw(500);
    })

    const percentagesRadio = document.getElementById('chartModePercent')
    console.log("Before");
    setTimeout(function() {
    	console.log("After")
	    console.log("Before2");
	    setTimeout(function() {
	    	updateStoryDiv("Hello World");
	    	percentagesRadio.checked = true;
	    	updateChart();
	    	console.log("After2")
			// Story is finished, re-enable controls
			disableControls(false);
	    }, 5000)
    }, 1000)




}

function updateStoryDiv(message) {
	document.getElementById("StoryFrame").innerHTML = "<h2>" + message + "</h2>";

}

function disableControls(disableFlag) {
	console.log("Disposable flag = " + disableFlag);
	document.getElementById('chartModePercent').disabled = disableFlag;
	document.getElementById('chartModeFlights').disabled = disableFlag;
	document.getElementById('airport').disabled = disableFlag;
	document.getElementById('timeframe').disabled = disableFlag;
	document.getElementById('zoomLevel').disabled = disableFlag;

}

    // Format (ontime, delayed) percentage values for tooltips
    function formatPercent(aPercentage) {
      return (Math.round(aPercentage.toFixed(2) * 100)).toString() + "%"
    }

    // Format large numbers (flight counts, delayed minutes) for tooltips
    // Regex expression copied from:
    // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    function formatLargeNumber(aNumber) {
      return aNumber.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    // Code for setting the tooltip text
    // This code calculates on-time and delayed percentages in addition to displaying the numbers.
    function buildTooltip(e, chartDataSet) {
      var key = e.key;
      var fields = key.split("_");
      var recordType = fields[0];
      var carrier = fields[1];
      var returnValue = "";

      if (recordType === "OnTime") {
        // For ontime data, show the # of on-time flights and on-time percentage
        var onTimeFlights = e.yValue;
        var delayedFilter = chartDataSet.filter(function(row) {
          return row['RecordType'] === 'Delayed' && row['CarrierName'] === carrier;
        })
        var delayedFlights = delayedFilter.reduce(function(a, b) {
          return a + parseFloat(b['Count']);
        }, 0);
        const totalFlights = onTimeFlights + delayedFlights;
        const onTimeFlightsDisplay = formatLargeNumber(onTimeFlights);
        const onTimePercent = onTimeFlights / totalFlights;
        const onTimePercentDisplay = formatPercent(onTimePercent);
        returnValue = [
            `Airline: ${carrier}`,
            `  `,
            `On-Time Flights = ${onTimeFlightsDisplay} (${onTimePercentDisplay})`
        ];
      } else {
        // For delayed data, show the # of delayed flights, percentage, and delay reasons
        var filtered = chartDataSet.filter(function(row) {
          return row['RecordType'] === 'Delayed' && row['CarrierName'] === carrier;
        })
        var ontimeFilter = chartDataSet.filter(function(row) {
          return row['RecordType'] === 'OnTime' && row['CarrierName'] === carrier;
        })
        var ontimeFlights = ontimeFilter.reduce(function(a, b) {
          return a + parseFloat(b['Count']);
        }, 0);
        var delayedFlights = e.yValue;
        console.log(`Delayed flights = ${delayedFlights}`)
        console.log(`On-Time flights = ${ontimeFlights}`)
        var totalFlights = ontimeFlights + delayedFlights;
        var delayedPercent = delayedFlights / totalFlights; 

        var delayedMins = filtered.reduce(function(a, b) {
          return a + parseFloat(b['ArrDelayMins']);
        }, 0);
        var carrierDelayMins = filtered.reduce(function(a, b) {
          return a + parseFloat(b['CarrierDelayMins']);
        }, 0);
        console.log("Delayed mins = " + delayedMins)
        console.log("Carrier Delay mins = " + carrierDelayMins)
        var weatherDelayMins = filtered.reduce(function(a, b) {
          return a + parseFloat(b['WeatherDelayMins']);
        }, 0);
        var nasDelayMins = filtered.reduce(function(a, b) {
          return a + parseFloat(b['NasDelayMins']);
        }, 0);
        var securityDelayMins = filtered.reduce(function(a, b) {
          return a + parseFloat(b['SecurityDelayMins']);
        }, 0);
        var lateAircraftDelayMins = filtered.reduce(function(a, b) {
          return a + parseFloat(b['LateAircraftDelayMins']);
        }, 0);

        returnValue = [`Airline: ${carrier}`,
          `Delayed Flights = ${formatLargeNumber(e.yValue)} (${formatPercent(delayedPercent)})`,
          `Carrier Delay = ${formatPercent(carrierDelayMins / delayedMins)}`,
          `Weather Delay = ${formatPercent(weatherDelayMins / delayedMins)}`,
          `NAS Delay = ${formatPercent(nasDelayMins / delayedMins)}`,
          `Security Delay = ${formatPercent(securityDelayMins / delayedMins)}`,
          `Late Aircraft Delay = ${formatPercent(lateAircraftDelayMins / delayedMins)}`
        ];
      }
      return returnValue;
    }

function updateChart() {
	const flightCountsSelected = document.getElementById('chartModeFlights').checked;
	const filteredData = filterData();

	if (flightCountsSelected) {
		updateFlightCountsChart(filteredData);
	} else {
		const chartData = prepareOnTimePercentData(filteredData);
		updateFlightPercentsChart(chartData);
	}
}


function filterData() {

	var selectedAirport = document.getElementById('airport').value;
	var selectedTimeframe = document.getElementById('timeframe').value;
	if (selectedTimeframe != "annual") {
		selectedTimeframe = selectedTimeframe.substring(5);
	}

	console.log("# of flight records: " + FLIGHT_DATA_2015.length);
	console.log("Selected airport = " + selectedAirport);
	console.log("Selected timeframe = " + selectedTimeframe);

	const filteredData = FLIGHT_DATA_2015.filter(function(row) {
		const airportMatch = selectedAirport === "000" || selectedAirport === row['Origin'];
		const timeframeMatch = selectedTimeframe === "annual" || selectedTimeframe === row['Month'];
		console.log("Row month substring = " + selectedTimeframe);
		return airportMatch && timeframeMatch;
	})

    filteredData = filteredData.map(function(aRow) {
      // If the carrier name contains a space, then just keep the prefix
      // otherwise, display entire airline name
      const carrierFullName = aRow['CarrierName'];
      const carrierDisplayName = carrierFullName.indexOf(' ') > -1 ? carrierFullName.split(' ')[0] : carrierFullName;
      aRow['CarrierName'] = carrierDisplayName;
      return aRow;
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
		} else {
			// add new row to carrierData array and lookup table 
			carrierData.push(statRow);
			statRow['CarrierName'] = carrierName;
			statRow['OnTimeFlights'] = 0;
			statRow['DelayedFlights'] = 0;
			carrierLookup[carrierName] = statRow;
		}

		const recordType = row['RecordType'];
		if (recordType === 'OnTime') {
			statRow['OnTimeFlights'] += parseFloat(row['Count']);
		} else if (recordType === 'Delayed') {
			statRow['DelayedFlights'] += parseFloat(row['Count']);
		} else {
			throw "Unexpected record type: " + recordType;
		}

	}
	console.log("Carrier data length: " + carrierData.length);
	const airlineOnTimePercentages = [];
	const carrierDataKeys = Object.keys(carrierData);

	var results = [];
	for (var i = 0; i < carrierDataKeys.length; i++) {
		const newRow = {};

		const aRecord = carrierData[carrierDataKeys[i]];
		newRow['CarrierName'] = aRecord['CarrierName'];
		newRow['OnTimeFlights'] = aRecord['OnTimeFlights'];
		newRow['DelayedFlights'] = aRecord['DelayedFlights'];
		const totalCount = newRow['OnTimeFlights'] + newRow['DelayedFlights'];
		newRow['TotalFlights'] = totalCount
		const onTimePercent = aRecord['OnTimeFlights'] / totalCount;
		newRow['OnTimePercent'] = Math.round(onTimePercent * 100, 2);
		results.push(newRow);

		console.log(`${newRow['CarrierName']}     ${newRow['OnTimeFlights']}     ${totalCount}    ${onTimePercent}`)
	}
	return results;
}

    // Update the chart using Javascript
    // Update the chart data and rebuild tooltips
    function updateFlightCountsChart(chartData) {

		// Reset zoom control (and associated label) to 100% zoom 
		var zoomLevelControl = document.getElementById('zoomLevel');
     	zoomLevelControl.disabled = false;
      	zoomLevelControl.value = 100;
	    zoomLevelControl.hidden = false;
      	d3.select("#zoomLevelDisplay").text("100%")

        // When DimpleJS redraws a bar chart with new data, if there are missing values for existing categories,
        // I see error messages in the console.
        //
        // This happens when a user transitions from a large airport with many airlines (i.e. LAX) to a smaller airport (i.e. IAH).
        // 
        // To get around this, draw graph again from scratch.
        if (myChart) {
			myChart.svg.selectAll('*').remove();

		}
	    myChart = new dimple.chart(svg, null);
	    myChart.setBounds(60, 45, 510, 250);
	    myChart.addLegend(200, 10, 380, 20, "right");


	    // X axis
	    var carrierAxis = myChart.addCategoryAxis("x", "CarrierName");
	    carrierAxis.title = "Airlines";
	    carrierAxis.fontSize = "12px";

	    // Y Axis
	    var flightsAxis = myChart.addMeasureAxis("y", "Count");
	    flightsAxis.title = "Flights";
	    flightsAxis.fontSize = "12px";
	    flightsAxis.overrideMax = null;


	    // Series data and chart type
	    const mySeries = myChart.addSeries(["RecordType"], dimple.plot.bar);

        // Reset the chart data, reset the y-axis zoom, and update the tooltips
        myChart.data = chartData;

        myChart.axes[1].overrideMax = null;
        mySeries.getTooltipText = function(e) {
          return buildTooltip(e, chartData);
        };
        mySeries.tooltipFontSize="12px";

        // Now refresh the chart
        myChart = myChart.draw(500,false);

        // Update the maximum Y axis value (for zoom calculations)
        originalYMax = flightsAxis._max;
      };

    


    function updateFlightPercentsChart(chartData) {

		// Reset zoom control (and associated label) to 100% zoom 
		var zoomLevelControl = document.getElementById('zoomLevel');
		zoomLevelControl.hidden = true;

		// zoomLevelControl.value = 100;
		d3.select("#zoomLevelDisplay").text("100%")

		if (myChart) {
			myChart.svg.selectAll('*').remove();
		}

	    myChart = new dimple.chart(svg, null);
	    myChart.setBounds(60, 45, 510, 250);

        // Reset the chart data, reset the y-axis zoom, and update the tooltips
        myChart.data = chartData;

	    // X axis
	    var carrierAxis = myChart.addCategoryAxis("x", "CarrierName");
	    carrierAxis.title = "Airlines";
	    carrierAxis.fontSize = "12px";
	    carrierAxis.addOrderRule("TotalFlights", true);

	    // Y Axis
	    var flightsAxis = myChart.addMeasureAxis("y", "OnTimePercent");
	    flightsAxis.title = "On-Time Percent";
	    flightsAxis.fontSize = "12px";
	    flightsAxis.overrideMax = 100;


	    myChart.addSeries(null, dimple.plot.bar)

	    myChart.series[0].tooltipFontSize="12px";

	    // Now refresh the chart
	    myChart.draw(500,false);

	    // Update the maximum Y axis value (for zoom calculations)
	    originalYMax = myChart.axes[1]._max;

    }

