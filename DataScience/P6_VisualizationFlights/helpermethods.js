// Setup associated data file (either annual or 1-month of data)
var filename = `data/airport_carrier_stats_annual.csv`

var FLIGHT_DATA_2015 = [];

function initializePage() {

	// Load the file and setup the chart data
	d3.csv(filename, function (data) {
  		FLIGHT_DATA_2015 = data;
		console.log("Loaded flight data.");
		updateChart();
	})

	// document.getElementById('TestButton').addEventListener("click", function(evt) {

	// 	const filteredData = filterData();
	// 	var results = prepareOnTimePercentData(filteredData);
	// 	console.log("Results = " + results);
	// });

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

}

function updateChart() {
	const flightCountsSelected = document.getElementById('chartModeFlights').checked;
	const filteredData = filterData();


	if (flightCountsSelected) {
		updateFlightCountsChart(filteredData);
	} else {
		const chartData = prepareOnTimePercentData(filteredData);
		// const sortedCarriers = sortCarriersBySizeDescending(chartData);
		// // debugger;
		updateFlightPercentsChart(chartData);
	}
}

// function sortCarriersBySizeDescending(chartData) {

// 	sortDescendingData = chartData.sort(function(a,b) {return b['TotalFlights'] - a['TotalFlights']})
// 	returnValues = [];
// 	for (var i = 0; i < sortDescendingData.length; i++) {
// 		returnValues.push(sortDescendingData[i]['CarrierName']);
// 	}
// 	return returnValues;
// }


function filterData() {

	var selectedAirport = document.getElementById('airport').value;
	var selectedTimeframe = document.getElementById('timeframe').value;
	if (selectedTimeframe != "annual") {
		selectedTimeframe = selectedTimeframe.substring(5);
	}

	// debugger;
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
      // var selectedAirport = document.getElementById('airport').value;
      // var selectedTimeframe = document.getElementById('timeframe').value;

      // Reset zoom control (and associated label) to 100% zoom 
      var zoomLevelControl = document.getElementById('zoomLevel');
      zoomLevelControl.disabled = false;
      zoomLevelControl.value = 100;
      d3.select("#zoomLevelDisplay").text("100%")


        // When DimpleJS redraws a bar chart with new data, if there are missing values for existing categories,
        // I see error messages in the console.
        //
        // This happens when a user transitions from a large airport with many airlines (i.e. LAX) to a smaller airport (i.e. IAH).
        // 
        // To get araound this, I remove any existing bar charts and redraw the chart from scratch.
        if (myChart.series) {
          myChart.series.forEach(function(series){
            if (series.shapes) {
              series.shapes.remove();
            }
          });
          myChart.series.splice(0, 1);
        }
	    if (myChart.axes) {
	      myChart.axes.forEach(function(axis){
	        if (axis.shapes) {
	          axis.shapes.remove();
	        }
	      });
	      myChart.axes.splice(0, 2);
	    }



	    // X axis
	    var carrierAxis = myChart.addCategoryAxis("x", "CarrierName");
	    carrierAxis.title = "Airlines";
	    carrierAxis.fontSize = "12px";

	    // Y Axis
	    var flightsAxis = myChart.addMeasureAxis("y", "Count");
	    flightsAxis.title = "Flights";
	    flightsAxis.fontSize = "12px";

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
        originalYMax = myChart.axes[1]._max;
      };

    

        // Update the chart using Javascript
    // Update the chart data and rebuild tooltips
    function updateFlightPercentsChart(chartData) {

      // Reset zoom control (and associated label) to 100% zoom 
      var zoomLevelControl = document.getElementById('zoomLevel');
      zoomLevelControl.disabled = true;

      // zoomLevelControl.value = 100;
      d3.select("#zoomLevelDisplay").text("100%")

    // When DimpleJS redraws a bar chart with new data, if there are missing values for existing categories,
    // I see error messages in the console.
    //
    // This happens when a user transitions from a large airport with many airlines (i.e. LAX) to a smaller airport (i.e. IAH).
    // 
    // To get this, I remove any existing bar charts and redraw the chart from scratch.
    if (myChart.series) {
      myChart.series.forEach(function(series){
        if (series.shapes) {
          series.shapes.remove();
        }
      });
      myChart.series.splice(0, 1);
    }
    if (myChart.axes) {
      myChart.axes.forEach(function(axis){
        if (axis.shapes) {
          axis.shapes.remove();
        }
      });
      myChart.axes.splice(0, 2);
    }



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


    myChart.addSeries(null, dimple.plot.bar)

    // myChart.series[0].getTooltipText = function(e) {
    //   return buildTooltip(e, chartData);
    // };
    myChart.series[0].tooltipFontSize="12px";

    // Now refresh the chart
    myChart.draw(500,false);

    // Update the maximum Y axis value (for zoom calculations)
    originalYMax = myChart.axes[1]._max;

    }

