from pymongo import MongoClient
client = MongoClient()

db = MongoClient().test
pipeline = [
	{"$match" : {"Origin" : {"$in" : ["ATL",'ORD','DFW','DEN','LAX',
		'SFO', 'IAH', 'PHX', 'LAS', 'MSP'] }}},
  	{"$group" : {"_id": { 
  		"Origin" : "$Origin"}, "total" : {"$sum" : 1}, "delays" : 
  		{"$sum" : "$DepDel15"}, "cancellations" : {
  		"$sum" : "$Cancelled"}, "carrierDelayMins" : {"$sum" : 
  		"$CarrierDelay"}, "weatherDelayMins" : {"$sum" : 
  		"$WeatherDelay"}, "nasDelayMins" : {"$sum" : "$NASDelay"},
  		"securityDelayMins" : {"$sum" : "$SecurityDelay"},
  		"lateAircraftDelayMins" : {"$sum" : "$LateAircraftDelay"}}}, 
  	{"$sort" : {"_id" : 1}}
]
results = db.flights2015.aggregate(pipeline) 

filename = 'airport_stats.csv'
f = open(filename, 'w')
f.write("RecordType,Airport,Count,CarrierDelayMins,WeatherDelayMins,NasDelayMins,SecurityDelayMins, LateAircraftDelayMins\n")
for document in results:
	origin = document['_id']['Origin']
	total = str(document['total'])
	delays = str(document['delays'])
	cancellations = str(document['cancellations'])
	carrierDelayMinutes = str(document['carrierDelayMins'])
	weatherDelayMinutes = str(document['weatherDelayMins'])
	nasDelayMinutes = str(document['nasDelayMins'])
	securityDelayMinutes = str(document['securityDelayMins'])
	lateAircraftDelayMinutes = str(document['lateAircraftDelayMins'])
	f.write("Totals" + "," + origin + "," + total + "\n")
	f.write("Delays" + "," + origin + "," + delays + "," + cancellations + "," + carrierDelayMinutes + "," +
		weatherDelayMinutes + "," + nasDelayMinutes + "," + 
		securityDelayMinutes + "," + lateAircraftDelayMinutes + "\n")
f.close()
print("Done. Wrote output to file: " + filename)
