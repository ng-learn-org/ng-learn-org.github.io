---
layout: post
title: Writing Custom Validations - Part 3
author: Santiago Esteva
categories: [beginner, validations, directives]
---

In this delivery, we are going to refactor our birth date validation and html into a semantic reusable component.
If you would like to revisit out of the box validations, creating a custom validation over a single input, read [Part 1][1] and
if you would like to revisit creating validations over complex objects go over [Part 2][2].


### Step 4 - Refactoring

The birth date validation is a three part deal.
In order to preserve some sense between these and because there is a real possibility on reusing these three select options together,
we are going to take a first stub at transforming this into a component.

We are going to write a new directive called "myBirthDate" that will take care of generating this component for us.
It will know nothing about validation. When we are done, both our new component and validation directives will work together.

#### As always Test Driven Development...Unit tests first.

We need to write unit tests to make sure our directive will generate the three select elements (day, month and year) with the options we set from the constants.

In order to make options matching easier, we will create a custom jasmine matcher that will iterate over all options and
use some underscore magic to compare the gathered options against a list of options we will pass to the function.
If there is no difference, we return true so the expectation is fulfilled.

{% highlight javascript %}

          beforeEach(function() {
            this.addMatchers({
              toContainSelectOptions: function(expected){
                var actualValues = [],
                    difference = [];

                angular.forEach(this.actual.find('option'), function(option) {
                  actualValues.push(option.text);
                });

                difference = _.difference(expected, actualValues);

                this.message = function() {
                  return 'Expected ' + angular.toJson(actualValues) + ' to contain options ' + angular.toJson(difference) + '.';
                };

                return difference.length == 0;
              }
            });
          });

{% endhighlight %}

Now lets write some tests.

{% highlight javascript %}

        describe("birth date directives", function() {

          beforeEach( function(){
            module('myApp')
          });

          beforeEach(inject(function($compile, $rootScope){
            $scope = $rootScope;
            element = angular.element(
              '<form name="form"><div data-my-birth-date data-ng-model="dateOfBirth"></div></form>'
            );
            $scope.model = { dateOfBirth: null};
            $compile(element)($scope);
            $scope.$digest();
            form = $scope.form;
          }));

          beforeEach(function() {
            this.addMatchers({
              toContainSelectOptions: function(expected){
                var actualValues = [],
                    difference = [];

                angular.forEach(this.actual.find('option'), function(option) {
                  actualValues.push(option.text);
                });

                difference = _.difference(expected, actualValues);

                this.message = function() {
                  return 'Expected ' + angular.toJson(actualValues) + ' to contain options ' + angular.toJson(difference) + '.';
                };

                return difference.length == 0;
              }
            });
          });

          describe("my-birth-date component", function(){

              it("should generate the birth date selects for day, month and year", function(){
                expect(element.find("select").length).toBe(3);
              });

              it("should contain the month options", function(){
                expect(element).toContainSelectOptions(["Month","1-Jan","2-Feb","3-Mar","4-Apr","5-May","6-Jun","7-Jul","8-Aug","9-Sep","10-Oct","11-Nov","12-Dec"]);
              });

              it("should contain the days options", function(){
                expect(element).toContainSelectOptions(["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]);
              });

              it("should contain the year options", function(){
                expect(element).toContainSelectOptions(["Year", "2014", "2013", "1899"]);
              })

            });
{% endhighlight %}

And now we write the directive...It is going to be a very simple directive. It is reason to be and to change is load an html block with a preloaded data set as options.

As you can see, Im injecting the data set I was previously using on our validation directive and initializing those values in the scope using the link function.

{% highlight javascript%}

        myApp.constant("dataSet", {
          months: ["1-Jan", "2-Feb", "3-Mar", "4-Apr", "5-May", "6-Jun", "7-Jul", "8-Aug", "9-Sep", "10-Oct", "11-Nov", "12-Dec"],
          years: _.range(new Date().getFullYear(), new Date().getFullYear() - 116, -1),
          days: _.range(1, 32)
        });

        myApp.directive("myBirthDate", function(dataSet){
           return {
             // restrict to an attribute type.
             restrict: 'A',
             scope: {
               date: '=ngModel'
             },
             link: function(scope){
               // Constants
               angular.extend(scope, dataSet);
             },
             template: "Date Of Birth:" +
                  "<select data-ng-model='date.month' required name='monthOfBirth' data-ng-options='month as month for month in months'>" +
                  "  <option value='' selected=''>Month</option> "+
                  " </select>" +
                  " <select data-ng-model='date.day' required name='dayOfBirth' data-ng-options='day as day for day in days'> " +
                  "  <option value='' selected=''>Day</option> " +
                  " </select> " +
                  " <select data-ng-model='date.year'' required name='yearOfBirth'' data-ng-options='year as year for year in years'> " +
                  " <option value='' selected=''>Year</option> " +
                  " </select> "
            }
        });


{% endhighlight %}

In order to avoid adding more moving pieces to this post, I kept the html code inside the template attribute.
You should know you can use templateUrl and $templateCache so as to request the html using an http call or from cache.
If you are familiar with ngInclude, templateUrl works just like it.

    **Best Practice:** Unless your template is very small, it's typically better to break it apart into its own HTML file and load it with the templateUrl option.

#### Updating our validation directive

Having done this, we need to make a few adjustments on our "myValidateBirthDate" directive constructed on [Part 2][2].

    - We remove any notion about the data set and the select options prepopulation.
    - We need to start watching at the model called "date". This is the one that it is going to change now.

Having our unit tests provides all the support we need to make sure nothing is broken.

I've gathered all our birth date directives' unit tests into one file.
If you would like to play/see with the unit test, launch this demo.

{% include plunker.html id="ak1HU2ro129YEbO7Ugan" %}

And this is how out html looks like now:


{% highlight markup %}

  <div data-my-birth-date data-my-validate-birth-date data-ng-model="search.dateOfBirth"></div>

{% endhighlight %}

And here is the whole picture so far:

{% highlight markup %}

<body data-ng-app="myApp" data-ng-controller="searchCtrl">

    <div class="errors">
      <!-- We use submitted to hide all error msgs until its actually submitted-->
      <ul data-ng-show="searchForm.submitted">
        <li data-ng-show="searchForm.leaving_from.$invalid">Departure Airport is invalid</li>
        <li data-ng-show="searchForm.leaving_from.$error.required">Departure Airport is required</li>
        <li data-ng-show="searchForm.leaving_from.$error.minlength">Departure Airport should be at least 3 characters</li>
        <li data-ng-show="searchForm.leaving_from.$error.invalidAiportCode">Airport Code should start with letter A</li>
        <li data-ng-show="searchForm.$error.incompleteDateOfBirth">Incomplete Date of Birth</li>
        <li data-ng-show="searchForm.$error.invalidDateOfBith">Invalid Date of Birth</li>
        <li data-ng-show="searchForm.$error.minorDateOfBirth">Must be an adult</li>
      </ul>
    </div>

    <form name="searchForm" novalidate="" role="form">
      <!-- Required: out of the box validation -->
      <label for="leaving_from" data-ng-class="{'error-req': searchForm.submitted &amp;&amp; searchForm.leaving_from.$invalid}">From<span class="ada-hide"> City or airport</span>*</label>
      <input type="text" placeholder="City or airport" id="leaving_from" name="leaving_from"
        data-ng-model="search.leavingFrom" required data-ng-minlength="3"
        my-validate-airport-code>
      <br />

      <!-- Applying the directive to the model holding all parts of the date -->
      <div data-my-birth-date data-my-validate-birth-date data-ng-model="search.dateOfBirth"></div>

      <br />

      <button type="submit" data-ng-click="submitSearch()">submit</button>
      <button data-ng-click="reset()">reset</button>
    </form>

</body>

{% endhighlight %}


If you would like to play/see with the complete example, launch this demo.

{% include plunker.html id="74ltPz9Upn8zUNQY8D6E" %}

#### What does this have to do with Validations?

The progression that it is been laid out in these 6 steps (4 so far published) aims to demonstrate validations as well as a refactoring methodology taking simple or complex validations into components.

Step 5 will cover a very small tweak so we can reuse both directives and have multiple instances on the same page.
Picture a Flight booking form where you need to enter multiple passengers birth dates.

Step 6 will cover the refactoring of the error handling on the html so we can support multiple instances of passengers
taking advantage of the same semantics we've already built.

Stay tuned!

[1]:http://ng-learn.org/2014/02/Writing_Custom_Validitions/
[2]:http://ng-learn.org/2014/02/Wirting_Custom_Validations_Part2/
