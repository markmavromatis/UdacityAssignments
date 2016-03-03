#!/usr/bin/env python


import numpy as np
X = np.array([[-1, -1], [-2, -1], [-3, -2], [1,1], [2,1], [3,2]])
Y = np.array([1, 1, 1, 2, 2, 2])
from sklearn.naive_bayes import GaussianNB

clf = GaussianNB()
clf.fit(X, Y)

inputPoint1 = [[-0.8, -1]]
print("What is the prediction for point: " + str(inputPoint1))
print(clf.predict(inputPoint1))

inputPoint2 = [[3, 2]]
print("What is the prediction for point: " + str(inputPoint2))
print(clf.predict(inputPoint2))


