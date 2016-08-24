from pymongo import MongoClient
client = MongoClient()

db = MongoClient().test
print("Hello World")

airlineCodes = {}
airlineCodes['AA'] = "American Airlines"
airlineCodes['B6'] = "JetBlue Airways"
airlineCodes['AS'] = "Alaska Airlines"
airlineCodes['F9'] = "Frontier Airlines"
airlineCodes['NK'] = "Spirit Airlines"
airlineCodes['UA'] = "United Airlines"
airlineCodes['EV'] = "ExpressJet Airlines"
airlineCodes['MQ'] = "Envoy Air"
airlineCodes['HA'] = "Hawaiian Airlines"
airlineCodes['VX'] = "Virgin America"
airlineCodes['DL'] = "Delta Air Lines"
airlineCodes['OO'] = "SkyWest Airlines"
airlineCodes['US'] = "US Airways"
airlineCodes['WN'] = "Southwest Airlines"

months = [None, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
filename_base = 'airport_carrier_stats'
filename_extension = '.csv'
for i in months:
	pipeline = []
	if i is not None:
		pipeline.append({"$match" : {"Month" : i}})

	pipeline.extend([
		{"$match" : {"Origin" : {"$in" : ["ATL",'ORD','DFW','DEN','LAX',
			'SFO', 'IAH', 'PHX', 'LAS', 'MSP'] }}},
	  	{"$group" : {"_id": {"Origin" : "$Origin", "Month" : "$Month", 
	  		"Carrier" : "$Carrier"}, "total" : {"$sum" : 1}, "delays" : 
	  		{"$sum" : "$DepDel15"}, "cancellations" : {
	  		"$sum" : "$Cancelled"}, "carrierDelayMins" : {"$sum" : 
	  		"$CarrierDelay"}, "weatherDelayMins" : {"$sum" : 
	  		"$WeatherDelay"}, "nasDelayMins" : {"$sum" : "$NASDelay"},
	  		"securityDelayMins" : {"$sum" : "$SecurityDelay"},
	  		"lateAircraftDelayMins" : {"$sum" : "$LateAircraftDelay"}}}, 
	  	{"$sort" : {"_id" : 1}}
	])
	results = db.flights2015.aggregate(pipeline) 


	if i is None:
		filename = filename_base + filename_extension
	else:
		filename = filename_base + "_" + str(i) + filename_extension

	f = open(filename, 'w')
	f.write("RecordType,Origin,Month,CarrierName,Count,Cancellations,CarrierDelayMins,WeatherDelayMins,NasDelayMins,SecurityDelayMins,LateAircraftDelayMins\n");
	for document in results:
		origin = document['_id']['Origin']
		month = str(document['_id']['Month'])
		carrierCode = document['_id']['Carrier']
		total = str(document['total'])
		delays = str(document['delays'])
		cancellations = str(document['cancellations'])
		carrierDelayMinutes = str(document['carrierDelayMins'])
		weatherDelayMinutes = str(document['weatherDelayMins'])
		nasDelayMinutes = str(document['nasDelayMins'])
		securityDelayMinutes = str(document['securityDelayMins'])
		lateAircraftDelayMinutes = str(document['lateAircraftDelayMins'])
		carrierName = ""

		if carrierCode in airlineCodes:
			carrierName = airlineCodes[carrierCode]
		else:
			print("Unknown Carrier Code: " + carrierCode)


		f.write("Totals," + origin + "," + month + "," + carrierName + "," + total + "\n");
		f.write("Delays," + origin + "," + month + "," + carrierName + "," + 
			delays + "," + cancellations + "," + carrierDelayMinutes + "," +
			weatherDelayMinutes + "," + nasDelayMinutes + "," + 
			securityDelayMinutes + "," + lateAircraftDelayMinutes + "\n")
	f.close()
	print("Wrote output to file: " + filename)
print("Done!")
