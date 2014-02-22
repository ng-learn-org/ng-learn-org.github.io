---
layout: post
title: Writing Custom Validations - Part 1
author: Santiago Esteva
categories: [beginner, validations, directives]
---

I ll take you through a 6 steps progression on custom validations.
We ll go from out of the box Angular provided validations to reusable directives components.
In this article, we'll cover out of the box validations and unit testing and creating our first custom validation as a directive.

### Step 1 - Out of the box

Lets see a first simple example where we take advantage of out of the box validations.

{% highlight html %}

    <body data-ng-app="myApp" data-ng-controller="searchCtrl">

        <div class="errors">
          <ul data-ng-show="searchForm.submitted">
            <li data-ng-show="searchForm.leaving_from.$invalid">Departure Airport is invalid</li>
            <li data-ng-show="searchForm.leaving_from.$error.required">Departure Airport is required</li>
            <li data-ng-show="searchForm.leaving_from.$error.minlength">Departure Airport should be at least 3 charachters</li>
          </ul>
        </div>

        <form name="searchForm" novalidate="" role="form">
          <label for="leaving_from" data-ng-class="{'error-req': searchForm.leaving_from.$invalid}">From</label>
          <input type="text" placeholder="City or airport" id="leaving_from" name="leaving_from" data-ng-model="search.leavingFrom" required>

          <button type="submit" data-ng-click="submitSearch()">submit</button>
          <button data-ng-click="reset()">reset</button>
        </form>

    </body>

{% endhighlight %}

{% highlight javascript %}

    myApp = angular.module("myApp", []);

    myApp.controller("searchCtrl", function($scope){

      // This is to hold the validation until we submit the form.
      $scope.submitSearch = function(){
        if($scope.searchForm.$valid) {
          console.log("form sent");
        }else{
          // If for, is invalid, show errors
          $scope.searchForm.submitted = true;
        }
      }

      // This is to reset the search model and all errors from screen.
      $scope.reset = function(){
        $scope.search = {}
        $scope.searchForm.submitted = false;
      }

    });

{% endhighlight %}

This is what is going on...

- We setup the searchForm so that html5 validation does not kick in. We did so adding the attribute novalidate to the form definition.

- We created an input of type text and we marked it as required. This sets required validation error key if the value is not entered.

- The input's label has ngClass so that if the leaving_from.$invalid error key is set, we applied the style 'error-req' which makes the label change its color to red.

- We created a list of errors above the form and we applied ngShow so this error is only displayed when that error key exists.

- At work, we usually hide all error until the user has submitted the form for the first time. We accomplished this by setting an additional flag in our controller (submitted). Angular provides flag to identify the user has interacted with the form (pristine and dirty) but these are not enough when trying to wait till user has submitted the form.

- We also add a submit and reset methods in our controller.

- Based on the submitted flag we hide all error messages till the user has actually submitted the form.

Lets take a look at the different errors we listed.

{% highlight html %}

        <div class="errors">
          <ul data-ng-show="searchForm.submitted">
            <li data-ng-show="searchForm.leaving_from.$invalid">Departure Airport is invalid</li>
            <li data-ng-show="searchForm.leaving_from.$error.required">Departure Airport is required</li>
            <li data-ng-show="searchForm.leaving_from.$error.minlength">Departure Airport should be at least 3 charachters</li>
          </ul>
        </div>

{% endhighlight %}

- **formName.fieldName.$invalid** : searchForm.leaving_from.$invalid is looking at the validity of this field. This means all other rules should have passed to clean this error.
- **formName.fieldName.$error** : is the object has containing all references to all invalid rules for an specific field.
- **formName.fieldName.$error.required** : searchForm.leaving_from.$error.required is looking if our specific field has been entered by the user.
- **formName.fieldName.$error.minlength** : searchForm.leaving_from.$error.minlength is looking if our specific field has at least 3 characters.
- **formName.$error** : is the object has containing all references to all invalid rules for all fields inside the form.


**Note**: Other built-in validations are: email, max, maxlength, min, minlength, number, pattern, required, url

If you would like to see the working example, launch the demo.

{% include plunker.html id="AmbxWwU5uwRjCEBMjz5v" %}


### Step 2 - Custom Validation

Now we will write a simple custom validation.
Custom validations could be written in a controller but if you do so you would end up with a non reusable code block and the now the controller would have more than one reason to change.
The best practice and the angularesque way is to write a directive.

I talked to the Business Analyst already and he sent me the new Acceptance Criteria:



AC | Given | When | Then
-- | ----- | ---- | ----
 1 | I (the user) enter an airport code starting with letter different than 'A' or 'a' | I submit the form | I should see the error message 'Airport Code should start with letter A'



Lets start with the directive's unit test:



{% highlight javascript %}

        describe("myValidateAirportCode", function() {

          beforeEach( function(){
            module('myApp')
          });

          beforeEach(inject(function($compile, $rootScope){
            $scope = $rootScope;
            var element = angular.element(
              '<form name="form"><input type="text" name="leaving_from" ng-model="leavingFrom" my-validate-airport-code></form>'
            );
            $scope.model = { leavingFrom: null};
            $compile(element)($scope);
            $scope.$digest();
            form = $scope.form;
          }));

          it('should be valid initially', function() {
              expect(form.leaving_from.$valid).toBe(true);
          });

          it('should be invalid when user enters an airport that starts with a different letter than a or A', function(){
            form.leaving_from.$setViewValue('SLC');
            expect(form.leaving_from.$valid).toBe(false);
          });

          it('should contain invalidAiportCode when user enters an airport that starts with a different letter than a or A', function(){
            form.leaving_from.$setViewValue('SLC');
            expect(form.$error.invalidAiportCode).toBeDefined();
          });

          it('should not contain invalidAiportCode when user enters an airport that starts with letter than a or A', function(){
            form.leaving_from.$setViewValue('ALC');
            expect(form.$error.invalidAiportCode).not.toBeDefined();
          });

        });

{% endhighlight %}



    The NgModelController has an array of $parsers functions and another array of $formatters functions.
    The validation can occur in two places:

    - Model to View update - Whenever the bound model changes, all functions in NgModelController#$formatters array are pipe-lined, so that each of these functions has an opportunity to format the value and change validity state of the form control through NgModelController#$setValidity.

    - View to Model update - In a similar way, whenever a user interacts with a control it calls NgModelController#$setViewValue. This in turn pipelines all functions in the NgModelController#$parsers array, so that each of these functions has an opportunity to convert the value and change validity state of the form control through NgModelController#$setValidity.



We are going to follow the View to Model update. No need for scope.watch as angular will execute the parsers array of functions every time the user interacts with the control.
Here is our directive:


{% highlight javascript %}

        myApp.directive("myValidateAirportCode", function(){
          // requires an isloated model
          return {
           // restrict to an attribute type.
           restrict: 'A',
          // element must have ng-model attribute.
           require: 'ngModel',
           link: function(scope, ele, attrs, ctrl){

              // add a parser that will process each time the value is
              // parsed into the model when the user updates it.
              ctrl.$parsers.unshift(function(value) {
                if(value){
                  // test and set the validity after update.
                  var valid = value.charAt(0) == 'A' || value.charAt(0) == 'a';
                  ctrl.$setValidity('invalidAiportCode', valid);
                }

                // if it's valid, return the value to the model,
                // otherwise return undefined.
                return valid ? value : undefined;
              });

           }
          }
        });

{% endhighlight %}


If you would like to play/see with the unit test, launch this demo.

{% include plunker.html id="LPSYdyuoMnVGiObGfpbI" %}


Now that we have a working/tested directive for our custom validation, its time we apply it to our html.
The first step is to add it to our input.

{% highlight html %}

        <input type="text" placeholder="City or airport" id="leaving_from" name="leaving_from"
                data-ng-model="search.leavingFrom" required data-ng-minlength="3"
                my-validate-airport-code>

{% endhighlight %}


And then we add our error message to the errors' list.


{% highlight html %}

        <div class="errors">
          <!-- We use submitted to hide all error msgs until its actually submitted-->
          <ul data-ng-show="searchForm.submitted">
            <li data-ng-show="searchForm.leaving_from.$invalid">Departure Airport is invalid</li>
            <li data-ng-show="searchForm.leaving_from.$error.required">Departure Airport is required</li>
            <li data-ng-show="searchForm.leaving_from.$error.minlength">Departure Airport should be at least 3 charachters</li>
            <li data-ng-show="searchForm.$error.invalidAiportCode">Airport Code should start with letter A</li>
          </ul>
        </div>

{% endhighlight %}


That's it. If you would like to play/see with the complete example, launch this demo.

{% include plunker.html id="kBSBDrs74l8qNRGIy2wS" %}

On Part 2 we will go through 4 more progressions on custom validations. We will handle much more complex validations over a combination of fields.
Stay tuned.



