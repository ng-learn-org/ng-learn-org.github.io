---
layout: post
title: Best Practice - Dom Manipulations
author: Santiago Esteva                                `
categories: [best-practices, beginner, directives]
---

Lets talk about best practices and roles in AngularJS. A controller is the middle man.
Its main role is to talk to the Service to get the model and then make sure this model is available to our presentation layer(html).
Even in large applications, the controller should be small, compact and dumb!

Dom Manipulations should not exist in controllers, services or anywhere else but in directives.

This came up today. We have two products with its own results list controller.

productAResultsCtrl.coffee and productBResultsCtrl.coffee were both presenting this code:

    {% highlight javascript %}

    $(".search-details-form").hide()
    $("#more").click ->
        if $(".search-details-form").is(":hidden")
          $(".search-details-form").slideDown()
        else
          $(".search-details-form").slideUp()

    {% endhighlight %}


This is meant to hide a search bar with advanced options and if the user clicks on a button we display all the options with a classic jquery slide effect.

This works but...

- It is not reusable
- It is not testable
- It include css hard coded selectors dependencies

So in order to resolve these problems, we should always:

- write a directive for dom manipulation
- the directive should not have dependencies on other html blocks or scope's parents objects
- the directive should not have any hard coded css selector

We are going to write a directive to be applied in the div that should slide down or up based on an external variable.

To avoid dependency problems, we are going to pass this variable as a parameter. We dont care who changes this variable.
We only care to react when the variable changes.

Our directive should look something like this:

    {% highlight html %}
    <div data-my-slide="showDetails"> details content goes here</div>
    {% endhighlight %}

We use 'data-' prefix to make sure html validates and we do not cause IE7, 8 browsers to go into quirks mode. Very Important!!!!

We use 'my-' prefix to determine this is a custom directive that belongs to our team.

Lets write the code for this. As always the test comes first:

    {% highlight javascript %}
    describe("Unit testing jquery directive", function() {
      var $compile, $scope, element;
      $scope = element = $compile = void 0;

      // Load the module, which contains the directive
      beforeEach(module("jqueryDirectives"));

      // Store references to $rootScope and $compile so they are available to all tests in this describe block
      beforeEach(inject(function(_$compile_, _$rootScope_) {

        // The injector unwraps the underscores (_) from around the parameter names when matching
        $scope = _$rootScope_;
        return $compile = _$compile_;

      }));

      it("should slide Down a block", function() {

        // Create html fragment
        element = angular.element('<div class="form" data-my-slide="showForm">Text</div>');

        // Set variable
        $scope.showForm = true;

        // Compile a piece of HTML containing the directive
        $compile(element)($scope);
        $scope.$digest();

        // Set expectation
        return expect(element.css('height')).toBe('1px');
      });

      it("should slide Up a block", function() {

        // Create html fragment
        element = angular.element('<div class="form" data-my-slide="showForm">Text</div>');

        // Set variable
        $scope.showForm = false;

        // Compile a piece of HTML containing the directive
        $compile(element)($scope);
        $scope.$digest();

        // Set expectation
        return expect(element.css('height')).toBe('0px');
      });

    });
    {% endhighlight %}


We have created two tests where after compiling the code, our directive applies slideDown or slideUp.

Based on jquery's documentation the divs' height gets primarily affected.
We take this fact so as to evaluate the success of our directive.

Now lets write the directive

    {% highlight javascript %}

    // Here we create a module to group these directives jquery related
    var jqueryDirectives = angular.module("jqueryDirectives", []);

    // Here we add a directive to the module. camelCase naming in this file (mySlide) and dash separated in html (my-Slide)
    jqueryDirectives.directive("mySlide", [
      function() {
        return {

          // This means the directive can be used as an attribute only. Example <div data-my-slide="variable"> </div>
          restrict: "A",

          // This is the functions that gets executed after Angular has compiled the html
          link: function(scope, element, attrs) {

            // We dont want to abuse on watch but here it is critical to determine if the parameter has changed.
            scope.$watch(attrs.mySlide, function(newValue, oldValue) {

              // This is our logic. If parameter is true slideDown otherwise slideUp.
              // TODO: This should be transformed into css transition or angular animator if IE family supports it
              if (newValue) {
                return element.slideDown();
              } else {
                return element.slideUp();
              }
            });
          }
        };
      }
    ]);

    {% endhighlight %}


So now on both productAResults.html and productBResults.html we say

    {% highlight html %}
    <div class="search-details-form" data-my-slide="showRedoSearchDetails">
    {% endhighlight %}


And we remove the jquery dom maniuplations out of our controllers.

Now we have a reusable, independent, tested directive.
