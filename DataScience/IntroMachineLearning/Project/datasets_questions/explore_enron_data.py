#!/usr/bin/python

""" 
    Starter code for exploring the Enron dataset (emails + finances);
    loads up the dataset (pickled dict of dicts).

    The dataset has the form:
    enron_data["LASTNAME FIRSTNAME MIDDLEINITIAL"] = { features_dict }

    {features_dict} is a dictionary of features associated with that person.
    You should explore features_dict as part of the mini-project,
    but here's an example to get you started:

    enron_data["SKILLING JEFFREY K"]["bonus"] = 5600000
    
"""

import pickle
import math

enron_data = pickle.load(open("../final_project/final_project_dataset.pkl", "r"))
#print(len(enron_data))
i = 0
# for eachKey in enron_data.keys():
#     if enron_data[eachKey]['poi'] == True:
#     #print(len(enron_data[eachKey]))
#         print(enron_data[eachKey])
#         i += 1
#
# print("Poin = True Count: " + str(i))
print(enron_data.keys())

# Total stock value of James Prentice's holdings
# print(enron_data['PRENTICE JAMES']['total_stock_value'])
# Number of emails from Wesley Colwell
# print("Wesley Colwell: From Messages")
# print(enron_data['COLWELL WESLEY']['from_messages'])
# print("Wesley Colwell: To Messages")
# print(enron_data['COLWELL WESLEY']['to_messages'])
# print("Wesley Colwell: To POI")
# print(enron_data['COLWELL WESLEY']['from_this_person_to_poi'])

print(enron_data['COLWELL WESLEY'].keys())
# Total value of stock options exercised by Jeffrey Skilling
print(enron_data['SKILLING JEFFREY K']['exercised_stock_options'])

# Who took home the most money?
print(enron_data['SKILLING JEFFREY K']['total_payments'])
print(enron_data['LAY KENNETH L']['total_payments'])
print(enron_data['FASTOW ANDREW S']['total_payments'])

# To count employees with defined salaries, skip Nan values using 'math.isnan()'
salaryCount = 0
for eachKey in enron_data.keys():
    salary = enron_data[eachKey]['salary']
    if math.isnan(float(salary)) == False:
        salaryCount+= 1
print("# of employees with populated salaries is: " + str(salaryCount))

# Count # of employees with email addresses
emailCount = 0
for eachKey in enron_data.keys():
    email = enron_data[eachKey]['email_address']
    if email != "NaN":
        #print(email)
        emailCount+= 1
print("# of employees with populated email addresses is: " + str(emailCount))


# How many people in the E+F dataset (as it currently exists) have ?NaN? for their total payments?
#What percentage of people in the dataset as a whole is this?
numberRows = len(enron_data)
missingTotalPaymentsCount = 0
for key in enron_data:
    if enron_data[key]['total_payments'] == 'NaN':
        missingTotalPaymentsCount += 1
print("# of people missing values for total payments: " + str(missingTotalPaymentsCount))
print("Total # of people = " + str(numberRows))
print("Percentage = " + str(1.0 * missingTotalPaymentsCount / numberRows))

# How many POIs in the E+F dataset have ?NaN? for their total payments?
# What percentage of POI?s as a whole is this?
poiCount = 0
poiWithMissingTotalPaymentsCount = 0
for key in enron_data:
    if enron_data[key]['poi'] == True:
        poiCount += 1
        #print(enron_data[key]['total_payments'])
        if enron_data[key]['total_payments'] == 'NaN':
            poiWithMissingTotalPaymentsCount
print("Total number of POIs = " + str(poiCount))
print("POIs missing total payments field: " + str(poiWithMissingTotalPaymentsCount))
print("Percentage of POIs missing total payments: " + str(1.0 * poiWithMissingTotalPaymentsCount / poiCount))
