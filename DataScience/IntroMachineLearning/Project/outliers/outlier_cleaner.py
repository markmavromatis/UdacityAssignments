#!/usr/bin/python

import numpy

def outlierCleaner(predictions, ages, net_worths):
    """
        Clean away the 10% of points that have the largest
        residual errors (difference between the prediction
        and the actual net worth).

        Return a list of tuples named cleaned_data where 
        each tuple is of the form (age, net_worth, error).
    """
    # How much is the residual error of each point?
    residual_errors = numpy.power((predictions - net_worths), 2)
    tenPercentCount = len(ages) / 10
    for i in range(tenPercentCount):
        indexToRemove = residual_errors.argmax()
        predictions = numpy.delete(predictions, indexToRemove)
        ages = numpy.delete(ages, indexToRemove)
        net_worths= numpy.delete(net_worths, indexToRemove)
        residual_errors = numpy.delete(residual_errors, indexToRemove)
    cleaned_data = []

    ### your code goes here
    for i in range(len(ages)):
        cleaned_data.append([ages[i], net_worths[i], residual_errors[i]])
    
    return cleaned_data




# print("Hello World")
# testArray = [1,2,3]
# print("Test array:")
# print(testArray)
# print(max(testArray))
# #print(maxInd() max(testArray))
# # Use numpy?
#
# import numpy
# testNumpyArray = numpy.reshape( [1,2,3,4], (4, 1))
# print("Test Numpy Array")
# print(testNumpyArray)
# print("Max")
# print(testNumpyArray.max())
# print("ArgMax")
# print(testNumpyArray.argmax())
# testNumpyArray = numpy.delete(testNumpyArray,3)
# print("Test Numpy Array")
# print(testNumpyArray)
# print("Max")
# print(testNumpyArray.max())
# print("ArgMax")
# print(testNumpyArray.argmax())
