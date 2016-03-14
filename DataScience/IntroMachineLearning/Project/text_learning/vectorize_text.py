#!/usr/bin/python

import os
import pickle
import re
import sys

sys.path.append( "../tools/" )
from parse_out_email_text import parseOutText

"""
    Starter code to process the emails from Sara and Chris to extract
    the features and get the documents ready for classification.

    The list of all the emails from Sara are in the from_sara list
    likewise for emails from Chris (from_chris)

    The actual documents are in the Enron email dataset, which
    you downloaded/unpacked in Part 0 of the first mini-project. If you have
    not obtained the Enron email corpus, run startup.py in the tools folder.

    The data is stored in lists and packed away in pickle files at the end.
"""


from_sara  = open("from_sara.txt", "r")
from_chris = open("from_chris.txt", "r")

from_data = []
word_data = []

### temp_counter is a way to speed up the development--there are
### thousands of emails from Sara and Chris, so running over all of them
### can take a long time
### temp_counter helps you only look at the first 200 emails in the list so you
### can iterate your modifications quicker
temp_counter = 0


for name, from_person in [("sara", from_sara), ("chris", from_chris)]:
    for path in from_person:
        ### only look at first 200 emails when developing
        ### once everything is working, remove this line to run over full dataset
        temp_counter += 1
# Temporary counter for restricting processed emails to 200.
#        if temp_counter < 200:
        if temp_counter >= 0:
            path = os.path.join('..', path[:-1])
            print path
            email = open(path, "r")

            ### use parseOutText to extract the text from the opened email
            email_test = parseOutText(email)

            ### use str.replace() to remove any instances of the words
            ### ["sara", "shackleton", "chris", "germani"]
            ignore_words_array = ['sara','shackleton','chris','germani']
            for ignore_word in ignore_words_array:
                email_test = email_test.replace(ignore_word, "")

            word_data.append(email_test)
            ### append the text to word_data
            #for each_word in email_test:
            #    word_data.append(each_word)

            ### append a 0 to from_data if email is from Sara, and 1 if email is from Chris
            if name == 'sara':
                from_data.append(0)
            else:
                from_data.append(1)

            email.close()

print "emails processed"
from_sara.close()
from_chris.close()

print("Word data index #152 = " + word_data[152])

pickle.dump( word_data, open("your_word_data.pkl", "w") )
pickle.dump( from_data, open("your_email_authors.pkl", "w") )





### in Part 4, do TfIdf vectorization here
print(len(word_data))
from sklearn.feature_extraction.text import TfidfVectorizer
# Remove stopwords while vectorizing
vectorizer = TfidfVectorizer(min_df=1, stop_words='english')
vectorizer.fit_transform(word_data)
print("Feature names")
print(vectorizer.get_feature_names())
print("# of features")
print(len(vectorizer.get_feature_names()))
print("Word #34597")
print(vectorizer.get_feature_names()[34597])



