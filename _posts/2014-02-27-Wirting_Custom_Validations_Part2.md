---
layout: post
title: Writing Custom Validations - Part 2
author: Santiago Esteva
categories: [beginner, validations, directives]
---

In this delivery, we are going to build a custom validation over a complex object.
Then we will refactor our code iteratively until we get a nice semantic reusable component.
If you would like to revisit Steps 1 and 2, read [Part 1][1]

### Step 3 - Complex Object Custom Validation

Lets take the example of "Date of birth". Lets say we have an object on our scope holding this model.
It has three attributes (day, month and year) represented by 3 independent select elements.
Lets look at our requirements:

AC | Given | When | Then
-- | ---- | ---- | ----
 1 | I (the user) don't select the day, month and year | I submit the form | I should see the error message 'Incomplete Date of Birth'
 2 | I (the user) don't select any of the day, month or year | I submit the form | I should see the error message 'Incomplete Date of Birth'
 3 | I (the user) select a wrong combination such as "2-Feb" as month, "31" as day and any year | I submit the form | I should see the error message 'Invalid Date of Birth'
 4 | I (the user) select a combination where the year difference with current year is lower than 15 such as 1998 | I submit the form | I should see the error message 'Must be an adult'

#### TDD, TDD, TDD

We write the basics for our test first.

{% highlight javascript %}

        describe("myValidateBirthDate", function() {

          beforeEach( function(){
            module('myApp')
          });

          beforeEach(inject(function($compile, $rootScope){
            $scope = $rootScope;
            var element = angular.element(
              '<form name="form">'
                +'<div data-my-validate-birth-date data-ng-model="dateOfBirth">'
                  + 'Date Of Birth:<select data-ng-model="dateOfBirth.month" required name="monthOfBirth" data-ng-options="month as month for month in months">'
                  + '<option value="" selected="">Month</option></select>'
                  + '<select data-ng-model="dateOfBirth.day" required name="dayOfBirth" data-ng-options="day as day for day in days">'
                  + '<option value="" selected="">Day</option></select>'
                  + '<select data-ng-model="dateOfBirth.year" required name="yearOfBirth" data-ng-options="year as year for year in years">'
                  + '<option value="" selected="">Year</option></select>'
                +'</div>'
              + '</form>'
            );
            $scope.model = { dateOfBirth: null};
            $compile(element)($scope);
            $scope.$digest();
            form = $scope.form;
          }));

        });

{% endhighlight %}

We basically created an element holding an html block that includes our directive. We compile it, trigger a digest cycle and we keep the form into a local variable.

Lets keep moving and write our unit tests for one of the error messages.
AC 1 and 2 display 'Incomplete Date of Birth' error. I will call this error message 'incompleteDateOfBirth' as the user has not submitted a complete date object.

{% highlight javascript %}

          describe("incompleteDateOfBirth", function(){

            it('should be defined and initially set valid to false', function() {
              expect(form.$error.incompleteDateOfBirth.$valid).toBeFalsy();
            });

            it('should be set to invalid if user has only entered day', function(){
              form.monthOfBirth.$setViewValue("2-Feb");
              $scope.$digest();
              expect(form.$error.incompleteDateOfBirth.$valid).toBeFalsy();
            });

            it('should be false when user has entered day, month and year', function(){
              form.monthOfBirth.$setViewValue("2-Feb");
              form.dayOfBirth.$setViewValue(16);
              form.yearOfBirth.$setViewValue(1970);
              $scope.$digest();
              expect(form.$error.incompleteDateOfBirth).toBeFalsy();
            });

          });

{% endhighlight %}

- We use the pattern "formName.fieldName" to get a handle on the select and then we call $setViewValue to simulate the user interaction.
- We call $digest to let angular run its magic and process the change. This ends up calling our directive and the form controller gets updated.

Lets keep moving. Next is AC 3.
We need to display 'Invalid Date of Birth' error when the combination results in for example Feb 31. We will call this one 'invalidDateOfBith'.

{% highlight javascript %}

          describe("invalidDateOfBith", function(){

            it("should be initially undefined", function(){
              expect(form.$error.invalidDateOfBith).not.toBeDefined();
            });

            it("should be invalid when day, month and year results in an invalid combination such as 31 Feb", function(){
              form.monthOfBirth.$setViewValue("2-Feb");
              form.dayOfBirth.$setViewValue(31);
              form.yearOfBirth.$setViewValue(1970);
              $scope.$digest();
              expect(form.$error.invalidDateOfBith.$valid).toBeFalsy()
            });

            it("should be false when day, month and year results in an valid combination such as 11 Feb", function(){
              form.monthOfBirth.$setViewValue("2-Feb");
              form.dayOfBirth.$setViewValue(11);
              form.yearOfBirth.$setViewValue(1970);
              $scope.$digest();
              expect(form.$error.invalidDateOfBith).toBeFalsy();
            })

          });

{% endhighlight %}

And finally, we cover AC 4.
We need to display 'Must be an adult' error when the date of birth diff with current year is less than 15 years. We will call this one 'minorDateOfBirth'.

{% highlight javascript %}

          describe("minorDateOfBirth", function(){

            it("should be initially undefined", function(){
              expect(form.$error.minorDateOfBirth).not.toBeDefined();
            });

            it("should be invalid when day, month and year results in a combination where the year difference with current year is lower than 15 such as 1998", function(){
              form.monthOfBirth.$setViewValue("2-Feb");
              form.dayOfBirth.$setViewValue(31);
              form.yearOfBirth.$setViewValue(1999);
              $scope.$digest();
              expect(form.$error.minorDateOfBirth.$valid).toBeFalsy()
            });

            it("should be false when day, month and year results in a combination where the year difference with current year is higher than 15 such as 1998", function(){
              form.monthOfBirth.$setViewValue("2-Feb");
              form.dayOfBirth.$setViewValue(31);
              form.yearOfBirth.$setViewValue(1970);
              $scope.$digest();
              expect(form.$error.minorDateOfBirth).toBeFalsy()
            });

          });

{% endhighlight %}

#### Now lets code the directive

    **Note:** I have chosen to hide the implementation on how we determine if the date is complete, valid or if we have a minor.
    Instead Im adding the methods isDateOfBirthComplete(), isDateOfBirthValid() and isAdult().
    The demo holds a basic implementation no those methods but these are not important to what we want to demonstrate here.

We will add an extra module holding some date related constants that we will use to initialize the list of days, months and years.
There is nothing relevant about it. Im sure there must be an easier way of getting the same values. This is just to support our example.

Go over the comments to see what its being done in every line.

{% highlight javascript %}

        myApp.constant("dataSet", {
          months: ["1-Jan", "2-Feb", "3-Mar", "4-Apr", "5-May", "6-Jun", "7-Jul", "8-Aug", "9-Sep", "10-Oct", "11-Nov", "12-Dec"],
          years: _.range(new Date().getFullYear(), new Date().getFullYear() - 116, -1),
          days: _.range(1, 32)
        });

        myApp.directive("myValidateBirthDate", function(dataSet){

          isDateOfBirthComplete = function(dateOfBirth){} //implementation left out intentionally
          isDateOfBirthValid = function(dateOfBirth){} //implementation left out intentionally
          isAdult = function(dateOfBirth) {} //implementation left out intentionally

          return {
            // restrict to an attribute type.
            restrict: 'A',
            // element must have ng-model attribute.
            require: 'ngModel',
            link: function(scope, ele, attrs, ctrl){

              // set the validation to false until user actually changes the model. This equals required for all three elements of the object
              ctrl.$setValidity('incompleteDateOfBirth', false);

              // Constants to initialize where we get months, days and years
              angular.extend(scope, dataSet);

              // Watch if whole model has changed
              scope.$watch(attrs.ngModel, function(newVal){

                if(angular.isDefined(newVal)) {

                  dateOfBirth = newVal;
                  dateOfBirthComplete = isDateOfBirthComplete(dateOfBirth);

                  // AC 1 and AC 2
                  ctrl.$setValidity('incompleteDateOfBirth', dateOfBirthComplete);

                  if(dateOfBirthComplete){
                    // AC 3
                    ctrl.$setValidity("invalidDateOfBith", isDateOfBirthValid(dateOfBirth));
                    // AC 4
                    ctrl.$setValidity("minorDateOfBirth", isAdult(dateOfBirth));
                  }

                }

              }, true);
            }
          }
        });

{% endhighlight %}


In our previous example we had 1 control attached to the input. So by adding our validation function to the array of parsers was good enough for us.

This time we need to look at 3 controls instead of 1 since we have 3 select elements to look over to determine validity.
So instead of doing that we are watching over the model holding the day, month and year attributes.

If you would like to play/see with the unit test, launch this demo.

{% include plunker.html id="RCc5SuMjBKQSAxXY6SEQ" %}

If you would like to play/see with the complete example, launch this demo.

{% include plunker.html id="hU62W2VOKYC0462FuPmo" %}


I was originally under the impression I would be able to fit the last 4 progressions into this second part. I was clearly wrong.
On the next delivery of this series, we are going to turn our birth date combo into an isolated reusable component.
We will demonstrate how we can use this component infinite times and how we would semantically handle the errors for these infinite instances.
Stay tuned!


[1]:http://ng-learn.org/2014/02/Writing_Custom_Validitions/




