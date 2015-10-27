---
layout: post
title: Writing Custom Validations - Part 4
author: Santiago Esteva
categories: [beginner, validations, directives]
---

Today we will cover the last two steps on the progression. We added some basic validation ([Part1][1]),
then we created a validation on a single form control ([Part1][1]), we raised the bet creating a custom validation over a complex object ([Part2][2]).
We took some distance and refactored our code to make it a reusable component ([Part3][3]).
And now we will make sure we handle multiple instances and its multiple errors in a semantic efficient fashion
that provides the user a much better experience.

### Step 5 - Multiples Instance, Specific Errors

Based on [Part 3][3] we could actually reuse our component N times like this:

{% highlight html %}

<div data-my-birth-date data-my-validate-birth-date data-ng-model="pax1.dateOfBirth"></div>
<div data-my-birth-date data-my-validate-birth-date data-ng-model="pax2.dateOfBirth"></div>

{% endhighlight %}

We will quickly see that when something fails we are always generating the same error in the form controller.
So far, no matter how many instances we have, we either set incompleteDateOfBirth invalidDateOfBith or minorDateOfBirth in our form$error array.

This is not good enough as we are handling multiple instances of passengers / persons now. We need to inform our user which one has failed.

In order to achieve this we want add specific errors for our specific models. This is what we will try to add to $errors instead:

- pax1_dateOfBirth_incomplete
- pax2_dateOfBirth_incomplete
- pax1_dateOfBirth_invalid
- pax2_dateOfBirth_invalid
- pax1_dateOfBirth_minor
- pax2_dateOfBirth_minor

#### TDD, TDD Unit Tests first

Our unit tests from [Part 3][3] don’t need to change much. We just need to replace the expected error object.

Before:

{% highlight javascript %}

    it("should be initially undefined", function(){
        expect(form.$error.invalidDateOfBith).not.toBeDefined();
    });

{% endhighlight %}

After:

{% highlight javascript %}

    it("should be initially undefined", function(){
        expect(form.$error.pax1_dateOfBirth_invalid).not.toBeDefined();
    });

{% endhighlight %}

In order to achieve this we will update our directive. We will take advantage of our model name (“pax1”, “pax2”) uniqueness in order to generate the error's name as well.

If you take a look at the demo on [Part 3][3] and draw your attention to our myValidateBirthDate directive, you will see we were setting the 3 possible error messages in this fashion:

{% highlight javascript %}

    ctrl.$setValidity('incompleteDateOfBirth', dateOfBirthComplete);
    ctrl.$setValidity("invalidDateOfBith", isDateOfBirthValid(dateOfBirth));
    ctrl.$setValidity("minorDateOfBirth", isAdult(dateOfBirth));

{% endhighlight %}

We were basically hardcoding the error’s name. In most of the cases this is enough. In our case, we will create a small private function
that takes a model name and an error string in order to generate our specific error message.

{% highlight javascript %}

    getErrorMsg = function(model, error){
         errorMsg = model.replace('.','_') + '_' + error;
         return errorMsg;
      }

{% endhighlight %}

And now, we update our setValidity calls accordingly invoking our message generator instead.

{% highlight javascript %}

    ctrl.$setValidity(getErrorMsg(attrs.ngModel, 'incomplete'), dateOfBirthComplete);
    ctrl.$setValidity(getErrorMsg(attrs.ngModel, 'invalid'), isDateOfBirthValid(dateOfBirth));
    ctrl.$setValidity(getErrorMsg(attrs.ngModel, 'minor'), isAdult(dateOfBirth));

{% endhighlight %}

If you would like to play/see with the unit test and the updated directive, launch this demo.

{% include plunker.html id="y4HxwCATQor7ppUZI7dH" %}

#### In Action

Beautiful! Now that we have a green suite of tests again, lets update our html code to get advantage of our semantic specific error messages.

First we can update our form to display N times our component.

{% highlight html %}

<div data-my-birth-date data-my-validate-birth-date data-ng-model="pax1.dateOfBirth"></div>
<div data-my-birth-date data-my-validate-birth-date data-ng-model="pax2.dateOfBirth"></div>

{% endhighlight %}

And now we update our errors section:

{% highlight html %}

    <div class="errors">
      <!-- We use submitted to hide all error msgs until its actually submitted-->
      <ul data-ng-show="searchForm.submitted">
        <li data-ng-show="searchForm.leavin_from.$invalid">Departure Airport is required</li>
        <li data-ng-show="searchForm.$error.invalidAiportCode">Airport Code should be at least 3 charchters</li>

        <li data-ng-show="searchForm.$error.pax1_dateOfBirth_incomplete">Pax 1: Incomplete Date of Birth</li>
        <li data-ng-show="searchForm.$error.pax1_dateOfBirth_invalid">Pax 1:Invalid Date of Birth</li>
        <li data-ng-show="searchForm.$error.pax1_dateOfBirth_minor">Pax 1: Must be an adult</li>

        <li data-ng-show="searchForm.$error.pax2_dateOfBirth_incomplete">Pax 2: Incomplete Date of Birth</li>
        <li data-ng-show="searchForm.$error.pax2_dateOfBirth_invalid">Pax 2:Invalid Date of Birth</li>
        <li data-ng-show="searchForm.$error.pax2_dateOfBirth_minor">Pax 2: Must be an adult</li>
      </ul>
    </div>

{% endhighlight %}

As you can see we can let the user know what Passenger is the one with an invalid date of birth and whether this date is incomplete, invalid or representing a minor.

If you would like to play/see with the complete example, launch this demo.

{% include plunker.html id="J9nhWPGAedoY6uEZt2FC" %}

### Step 6 - Can you handle it?

So, what if we are talking about 10 birth dates? Then we will need to write 3 LI elements for each instance's possible errors.
This is not good. We are getting soaked ( got it???..cause we are not being DRY! )

Lets disregard my inability to make smart jokes and refactor this once again.

Lets assume our application already has a list of passengers. So now we want to say something like:

{% highlight html %}
    <div data-ng-repeat="pax in passengers track by $index">
    Pax - {% raw %}{{pax.name}}{% endraw %}:
    <div data-my-birth-date data-my-validate-birth-date data-ng-model="pax.dateOfBirth"></div>
  </div>
{% endhighlight %}

Looks good but we lost the uniqueness of our model's name. We used to have "pax1.dateOfBirth" and "pax2.dateOfBirth".

To replace it we can make use of the $index and dynamically generate unique error names such as pax0_data_error.

#### TDD...TDD you know the drill

Once again, our tests don't need to change much. All these tests are still supporting our code changes.

We will only make a change to update the directive html code:

 - adding the index value as a parameter to myValidateBirthDate directive and
 - updating the model name to a generic one

Before

{% highlight javascript %}

    element = angular.element(
      '<form name="form"><div my-birth-date my-validate-birth-date ng-model="pax1.dateOfBirth"></div></form>'
    );

{% endhighlight %}

After

{% highlight javascript %}

    element = angular.element(
      '<form name="form"><div data-my-birth-date data-my-validate-birth-date="1" data-ng-model="pax.dateOfBirth"></div></form>'
    );

{% endhighlight %}

Tests should be failing now, so lets take care of this. We are going to make a couple of changes on our directive.

We need to update our getErrorMsg function to expect an index value and concatenate it at the end of our model's name.

{% highlight javascript %}

    getErrorMsg = function(model, index, error){
         modelName = model.split('.')[0];
         dataName = model.split('.')[1];
         errorMsg = modelName + index + '_' + dataName + '_' +  error;
         return errorMsg;
      }

{% endhighlight %}

And then update all references to this function adding the index value retrieved from the directive's attributes (attrs.myValidateBirthDate).
All our references are inside the link function.

{% highlight javascript %}

    link: function(scope, ele, attrs, ctrl){

      // set the validation to false until use fills in
      ctrl.$setValidity( getErrorMsg(attrs.ngModel, attrs.myValidateBirthDate, 'incomplete'), false);

      // Watch if model inside the directive has changed
      scope.$watch('date', function(newVal, oldVal){
        if(newVal){
          dateOfBirth = newVal
          dateOfBirthComplete = isDateOfBirthComplete(dateOfBirth);

          ctrl.$setValidity(getErrorMsg(attrs.ngModel, attrs.myValidateBirthDate, 'incomplete'), dateOfBirthComplete);

          if(dateOfBirthComplete){
            ctrl.$setValidity(getErrorMsg(attrs.ngModel, attrs.myValidateBirthDate, 'invalid'), isDateOfBirthValid(dateOfBirth));
            ctrl.$setValidity(getErrorMsg(attrs.ngModel, attrs.myValidateBirthDate, 'minor'), isAdult(dateOfBirth));
          }

        }

      }, true);

{% endhighlight %}

Now all tests should be green again.
If you would like to play/see with the unit test and the updated directive, launch this demo.

{% include plunker.html id="HeJzZqlGKVswAQ3QRewy" %}

#### In Action

We are green! Lets make use of this bad boy on our html.

Lets start by creating some fake passengers in our controller.
In a real app, our controller would get this information from a Service for example.

{% highlight javascript %}

    myApp.controller("searchCtrl", function($scope){

      $scope.passengers= [{name: 'Santiago'}, {name: 'Pablo'}, {name:'Veronica'}];

      // Extracted Code

    });

{% endhighlight %}

Now lets update our form just like we stated at the beginning of this step and add the index as parameter.

**Note** that since we are inside a new scope we need to access the index by calling $parent.

{% highlight html %}

<div data-ng-repeat="pax in passengers track by $index">
    Pax - {% raw %}{{pax.name}}{% endraw %}:
    <div data-my-birth-date data-my-validate-birth-date="{% raw %}{{$parent.$index}}{% endraw %}" data-ng-model="pax.dateOfBirth"></div>
</div>

{% endhighlight %}

Finally, we get to update our errors section and deliver more value to our devoted users.

Before:

{% highlight html %}

<li data-ng-show="searchForm.$error.pax1_dateOfBirth_incomplete">Pax 1: Incomplete Date of Birth</li>
<li data-ng-show="searchForm.$error.pax1_dateOfBirth_invalid">Pax 1:Invalid Date of Birth</li>
<li data-ng-show="searchForm.$error.pax1_dateOfBirth_minor">Pax 1: Must be an adult</li>

<li data-ng-show="searchForm.$error.pax2_dateOfBirth_incomplete">Pax 2: Incomplete Date of Birth</li>
<li data-ng-show="searchForm.$error.pax2_dateOfBirth_invalid">Pax 2:Invalid Date of Birth</li>
<li data-ng-show="searchForm.$error.pax2_dateOfBirth_minor">Pax 2: Must be an adult</li>

<!-- This could go forever -->

{% endhighlight %}

After:

{% highlight html %}

<div data-ng-repeat="pax in passengers track by $index">
  {% raw %}
  <li data-ng-show="searchForm.$error.pax{{$index}}_dateOfBirth_incomplete">Pax {{$index +1}} - {{pax.name}}: Incomplete Date of Birth</li>
  <li data-ng-show="searchForm.$error.pax{{$index}}_dateOfBirth_invalid">Pax {{$index +1}} - {{pax.name}}:Invalid Date of Birth</li>
  <li data-ng-show="searchForm.$error.pax{{$index}}_dateOfBirth_minor">Pax {{$index +1}} - {{pax.name}}: Must be an adult</li>
  {% endraw %}
</div>

{% endhighlight %}

Now we get to use the same model we used to display the N instances of our component. We share the same amount, so we can safely use the same index to generate the dynamic error name.

In addition, by using the same models, we can even present more interesting feedback to our users.
Instead of saying **"Passenger 1: invalid data"**, we can say **"Santiago: Incomplete Date..."**. We could even report what value was entered.
We have the same model!

Could you turn this error into its own component? Sure...but I am not going to do it. You take the keyboard while I get some coffee!

If you would like to play/see with the complete example, launch this demo.

{% include plunker.html id="mJbrXRI1WaHteuBaAeLE" %}

We have covered a long way. A progression of 6 steps from out of the box validations passing through single
form control validations in [Part1][1] to reusable complex object validations turned into components in [Part2][2]
and a final refactor to support semantic reusability for N instances.

[1]:http://ng-learn.org/2014/02/Writing_Custom_Validitions/
[2]:http://ng-learn.org/2014/02/Wirting_Custom_Validations_Part2/
[3]:http://ng-learn.org/2014/03/Writing_Custom_Validations_Part3/
