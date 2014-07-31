---
layout: post
title: Simple Directive Example
author: Gonzalo do Carmo Norte
categories: [beginner, directives]
---

Going back to our [last post related to best practices and roles in AngularJS][1], let\'s talk a little bit more about this showing a really small example.

Remember:
A controller is the middle man!
Its main role is to talk to the Service to get the model and then make sure this model is available to our presentation layer (html).
Even in large applications, the controller should be small, compact and dumb!

Dom Manipulations should not exist in controllers, services or anywhere else but in directives!

This is another sample we ran into it some time ago...

Imagine there\'re 4 pages which represent the flow of an online purchase. Each of these pages displays the following progress bar: (Customer starts on first page)

{% highlight markup %}
<div id="progressBar">
  <span class="active">Select Product</span>
  <span class="">Shipping Info</span>
  <span class="">Billing Info</span>
  <span class="">Confirmation</span>
</div>
{% endhighlight %}

As soon as the customer moves into the next page, the progress bar is supposed to show the current page highlighted. We\'re going to accomplish this by assigning the "active" CSS class to the corresponding "span" element.

The following JS code was in place on the same HTML file the progress bar was defined to do the switch among the different "span" elements:

{% highlight javascript %}
function showProgressBar( index )
{
  switch(index)
  {
    case 1:
      $("#progressBar span:nth-child(1)").attr("class", "active")
      $("#progressBar span:nth-child(2)").attr("class", "")
      $("#progressBar span:nth-child(3)").attr("class", "")
      $("#progressBar span:nth-child(4)").attr("class", "")
      break;
    case 2:
      $("#progressBar span:nth-child(1)").attr("class", "")
      $("#progressBar span:nth-child(2)").attr("class", "active")
      $("#progressBar span:nth-child(3)").attr("class", "")
      $("#progressBar span:nth-child(4)").attr("class", "")
      break;
    case 3:
      $("#progressBar span:nth-child(1)").attr("class", "")
      $("#progressBar span:nth-child(2)").attr("class", "")
      $("#progressBar span:nth-child(3)").attr("class", "active")
      $("#progressBar span:nth-child(4)").attr("class", "")
      break;
    default:
      $("#progressBar span:nth-child(1)").attr("class", "")
      $("#progressBar span:nth-child(2)").attr("class", "")
      $("#progressBar span:nth-child(3)").attr("class", "")
      $("#progressBar span:nth-child(4)").attr("class", "active")
    }
}
{% endhighlight %}

Each page had the following code:
{% highlight javascript %}
jQuery(function(){
  showProgressBar(PAGE_NUM);
});
{% endhighlight %}

All of this code could be moved from the view into some place where it could be tested... As you have already read the very begining of this article and as you may already know neither a service nor a controller is the place to move this code to. But a directive is!

Having that said, a directive could be written in this case so that:
- we can avoid dependencies on other html blocks or scope's parents objects
- we can avoid hard coded CSS selectors

We are going to write a directive to be applied to the "div" element so as to show the corresponding flow status according to the current page the user is on. The current page the user is on will be represented by an external variable (similar idea to "PAGE_NUM").

To avoid dependency problems, we are going to pass this variable as a parameter. We don\'t care who changes this variable.
We only care to react when the variable (page) changes.

Our directive should look something like this:

{% highlight markup %}
<div data-my-progress-bar="{{"{{pageIndex"}}}}" data-currentPageStyle="active">
  <span>Select Product</span>
  <span>Shipping Info</span>
  <span>Billing Info</span>
  <span>Confirmation</span>
</div>
{% endhighlight %}

We use 'data-' prefix to make sure html validates and we do not cause IE7, 8 browsers to go into quirks mode. Very Important!!!!

We use 'my-' prefix to determine this is a custom directive that belongs to our team.

Lets write the code for this. As always the test comes first:

    {% highlight javascript %}
    describe("Unit testing progress bar directive", function() {
      var $compile, $scope, element;
      $scope = element = $compile = void 0;

      // Load the module, which contains the directive
      beforeEach(module("sampleTestDirectivesModule"));

      // Store references to $rootScope and $compile so they are available to all tests in this describe block
      beforeEach(inject(function(_$compile_, _$rootScope_) {

        // The injector unwraps the underscores (_) from around the parameter names when matching
        $scope = _$rootScope_;
        return $compile = _$compile_;

      }));

      it("should show 1st span highlighted when Page 1", function() {

        // Create html fragment
        element = angular.element('<div data-my-progress-bar="1" data-currentPageStyle="active"><span>Select Product</span><span>Shipping Info</span><span>Billing Info</span><span>Confirmation</span></div>');

        // Compile a piece of HTML containing the directive
        $compile(element)($scope);
        $scope.$digest();

        // Set expectations
        expect(element.children()[0].className).toBe ("active");
        expect(element.children()[1].className).toBe ("");
        expect(element.children()[2].className).toBe ("");
        expect(element.children()[3].className).toBe ("");
      });
    });
    {% endhighlight %}

So far we have created only one test, where after compiling the code, our directive applies the "active" CSS class to the corresponding element based on the page the user is currently on.

Having written the first test, the 3 remaining scenarios are straightforward. Below are them for your reference:

{% highlight javascript %}
it('should show 2nd span highlighted when Page 2', function () {
      element = angular.element('<div data-my-progress-bar="2" data-currentPageStyle="acive"><span>Select Product</span><span>Shipping Info</span><span>Billing Info</span><span>Confirmation</span></div>');

      $compile(element)($scope);
      $scope.$digest();

      expect(element.children()[0].className).toBe ("");
      expect(element.children()[1].className).toBe ("active");
      expect(element.children()[2].className).toBe ("");
      expect(element.children()[3].className).toBe ("");

})
it('should show 3rd span highlighted when Page 3', function () {
      element = angular.element('<div data-my-progress-bar="3" data-currentPageStyle="active"><span>Select Product</span><span>Shipping Info</span><span>Billing Info</span><span>Confirmation</span></div>');

      $compile(element)($scope);
      $scope.$digest();

      expect(element.children()[0].className).toBe ("");
      expect(element.children()[1].className).toBe ("");
      expect(element.children()[2].className).toBe ("active");
      expect(element.children()[3].className).toBe ("");

})
it('should show 4th span highlighted when Page 4', function () {
      element = angular.element('<div data-my-progress-bar="4" data-currentPageStyle="active"><span>Select Product</span><span>Shipping Info</span><span>Billing Info</span><span>Confirmation</span></div>');

      $compile(element)($scope);
      $scope.$digest();

      expect(element.children()[0].className).toBe ("");
      expect(element.children()[1].className).toBe ("");
      expect(element.children()[2].className).toBe ("");
      expect(element.children()[3].className).toBe ("active");

})
{% endhighlight %}

Having finished writting the test, it\'s now time to write the directive.

{% highlight javascript %}

    // Here we create a module to group these directives jquery related
    var sampleModule = angular.module("sampleTestDirectivesModule", []);

    // Here we add a directive to the module. camelCase naming in this file (mySlide) and dash separated in html (my-Slide)
    sampleModule.directive("myProgressBar", [
      function() {
        return {

          // This means the directive can be used as an attribute only.
          // Example <div data-my-progress-bar="variable"> </div>
          restrict: "A",

          // This is the function that gets executed after Angular has compiled the html
          link: function(scope, element, attrs) {
            var spans = element.find("span");
            var num = parseInt(attrs.myProgressBar);
            var cssClass = attrs.currentpagestyle;

            switch( num )
            {
              case 1:
                spans[0].className = cssClass;
                spans[1].className = "";
                spans[2].className = "";
                spans[3].className = "";
                break;
              case 2:
                spans[0].className = "";
                spans[1].className = cssClass;
                spans[2].className = "";
                spans[3].className = "";
                break;
              case 3:
                spans[0].className = "";
                spans[1].className = "";
                spans[2].className = cssClass;
                spans[3].className = "";
                break;
              default:
                spans[0].className = "";
                spans[1].className = "";
                spans[2].className = "";
                spans[3].className = cssClass;
            }
          }
        };
      }
    ]);
{% endhighlight %}

So now each html has:

{% highlight markup %}
  <div data-my-progress-bar="{{"{{pageIndex"}}}}" date-currentPageStyle="active">
    <span>Select Product</span>
    <span>Shipping Info</span>
    <span>Billing Info</span>
    <span>Confirmation</span>
  </div>
{% endhighlight %}

Having replaced the original code, we removed the jQuery library dependency as well as the hardcoded id ("progressBar") and CSS ("active"). As a result, now we have a reusable, independent, tested -and testable- directive.

Please note that this directive is only reusable within the same app and for that purpose, since the quantity of "span" elements (pages) and their names are fixed. We\'ll show you how this same directive can be written in a different way (more flexible) in the next post. Visit us shortly!
[1]:http://ng-learn.org/2014/01/Dom-Manipulations/
