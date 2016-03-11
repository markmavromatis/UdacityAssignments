#!/usr/bin/python

import pickle
import sys
import matplotlib.pyplot
import math
sys.path.append("../tools/")
from feature_format import featureFormat, targetFeatureSplit


### read in data dictionary, convert to numpy array
data_dict = pickle.load( open("../final_project/final_project_dataset.pkl", "r") )

# Remove TOTAL row
data_dict.pop("TOTAL", 0)

features = ["salary", "bonus"]
data = featureFormat(data_dict, features)


### your code below
print("Data length is: " + str(len(data)))
for point in data:
    salary = point[0]
    bonus = point[1]
    matplotlib.pyplot.scatter( salary, bonus )

matplotlib.pyplot.xlabel("Salary")
matplotlib.pyplot.ylabel("Bonus")
matplotlib.pyplot.show()

for key in data_dict:
    bonus = data_dict[key]['bonus']
    salary = data_dict[key]['salary']
    # Identify TOTAL outlier
    if math.isnan(float(bonus)) == False and bonus > 8000000:
        print(key + "    " + str(data_dict[key]['bonus']))
    # Identify bandits who made out with >$5M bonuses and >$1M salaries
    if math.isnan(float(bonus)) == False and bonus > 5000000:
        if math.isnan(float(salary)) == False and salary > 1000000:
            print(key + "    " + str(data_dict[key]['salary'])+ "    " + str(data_dict[key]['bonus']))
