#!/usr/bin/python

""" 
    This is the code to accompany the Lesson 2 (SVM) mini-project.

    Use a SVM to identify emails from the Enron corpus by their authors:    
    Sara has label 0
    Chris has label 1
"""
    
import sys
from time import time
sys.path.append("../tools/")
from email_preprocess import preprocess


### features_train and features_test are the features for the training
### and testing datasets, respectively
### labels_train and labels_test are the corresponding item labels
features_train, features_test, labels_train, labels_test = preprocess()




#########################################################
### your code goes here ###

# Speed up the training period by training on a smaller dataset.
#features_train = features_train[:len(features_train) / 100]
#labels_train = labels_train[:len(labels_train) / 100]


from sklearn.svm import SVC

#clf = SVC(kernel="linear")

# Try the complex RBF kernel
clf = SVC(C=10000, kernel="rbf")

t0 = time()
clf.fit(features_train, labels_train)
print("Training time: ", round(time() - t0, 3), "s")
t0 = time()
pred = clf.predict(features_test)
print("Prediction time: ", round(time() - t0, 3), "s")
from sklearn.metrics import accuracy_score
accuracy = accuracy_score(labels_test, pred)
print("Accuracy is: " + str(accuracy))


#Prediction individual elements
print("Element #10 = " + str(pred[10]))
print("Element #26 = " + str(pred[26]))
print("Element #50 = " + str(pred[50]))

print(len(filter(lambda x: x == 1, pred)))
#########################################################


