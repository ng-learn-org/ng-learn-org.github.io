---
layout: post
title: A Simple Directive Example - Part 2
author: Gonzalo do Carmo Norte
categories: [beginner, directives]
---

In [the first part of this post][1], we refactored a jQuery code block into a pretty simple but limited directive.
Now it's time to refactor our directive by removing the pages fixed amount limitation.

Just to recap, below is the directive we did:

{% highlight html %}
<div data-my-progress-bar="{{"{{pageIndex"}}}}" data-currentPageStyle="active">
  <span>Select Product</span>
  <span>Shipping Info</span>
  <span>Billing Info</span>
  <span>Confirmation</span>
</div>
{% endhighlight %}

    Remember:

    We use 'data-' prefix to make sure html validates and we do not cause IE7, 8 browsers to go into quirks mode. Very Important!!!!

    We use 'my-' prefix to determine this is a custom directive that belongs to our team.

Even though we add more span/pages in the above HTML, our directive doesn't consider them since the switch block's logic is only covering the first four "span" elements.
Let's consider the following:

{% highlight html %}
<div data-my-progress-bar="5" data-currentPageStyle="active">
   <span>Select Product</span>
   <span>Shipping Info</span>
   <span>Billing Info</span>
   <span>Confirmation</span>
   <span>Post Sale</span>
</div>
{% endhighlight %}


{% highlight js %}
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
{% endhighlight %}


The "active" class would never be assigned to any "span" element beyond the forth one. (in this case the "Post Sale" "span" element)

We said we were going to show you a more flexible way of coding this directive. This way actually involves having a non-fixed number of pages. Taking advantage of this change, we\'re going to code this directive in a slighty different way.

Our new directive should look like:
{% highlight html %}
<div data-my-progress-bar
     data-currentpage="{{"{{pageIndex"}}}}" 
     data-currentpagestyle="active" 
     data-pages="['Select Product','Checkout','Confirmation']">
</div>
{% endhighlight %}

In this case the directive has one extra attribute -"data-pages"-, which is intended to hold an array of page names.
This way we can get rid of the fixed number of pages from our previous simple example.
The array of pages is hardcoded in this example but it may be coming from a scope attribute dynamically generated in a controller, service, etc.

As always the test comes first. Let\'s use the first one from the previous post and update the HTML with our new code:

{% highlight javascript %}
describe("Unit testing other progress bar directive", function() {
  var $compile, $scope, element;
  $scope = element = $compile = undefined;

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
    element = angular.element('<div data-my-progress-bar data-currentpage="1" data-currentpagestyle="active" data-pages="['Select Product','Checkout','Confirmation']"></div>');
        
    // Compile a piece of HTML containing the directive
    $compile(element)($scope);
    $scope.$digest();

    // Set expectations
    expect(element.children()[0].className).toBe ("active");
    expect(element.children()[1].className).toBe ("");
    expect(element.children()[2].className).toBe ("");
  });
});
{% endhighlight %}

Please note that expectations were not changed. Even though the code was updated, the result shouldn't change.

Remember that after compiling the code, our directive applies the "active" CSS class to the corresponding element based on the current page(index) attribute.

Let\'s write more tests changing the number of pages and the CSS selector for the page the user is on:

{% highlight javascript %}
  it('should show 1st span highlighted when Page 1', function () {
    element = angular.element('<div data-my-progress-bar data-currentpage="1" data-currentpagestyle="selected" data-pages="['Select Product','Confirmation']"></div>');
      
    $compile(element)($scope);
    $scope.$digest();

    expect(element.children()[0].className).toBe ("selected");
    expect(element.children()[1].className).toBe ("");
  })

  it('should show 6th span highlighted when Page 6', function () {
    element = angular.element('<div data-my-progress-bar data-currentpage="6" data-currentpagestyle="selected" data-pages="['Select Product','Product Details','Shipping Info','Billing Info','Confirmation','Share Purchase']"></div>');
      
    $compile(element)($scope);
    $scope.$digest();

    expect(element.children()[0].className).toBe ("");
    expect(element.children()[1].className).toBe ("");
    expect(element.children()[2].className).toBe ("");
    expect(element.children()[3].className).toBe ("");
    expect(element.children()[4].className).toBe ("");
    expect(element.children()[5].className).toBe ("selected");
  })
{% endhighlight %}

Having finished writting the tests, it\'s now time to write the new directive code:

{% highlight javascript %}
  // Here we create a module to group these directives jquery related
  var sampleModule = angular.module("sampleTestDirectivesModule", []);

  // Here we add a directive to the module. camelCase naming in this file (myProgressBar) and dash separated in html (my-progress-bar)
  sampleModule.directive("myProgressBar", [
    function() {
      return {

        // This means the directive can be used as attribute only
        // Example <div my-progress-bar> </div>
        restrict: "A",

        // Our directive will append an html block to our page.
        templateUrl: "myTemplate.html",

        // isolated scope: directive's inner scope
        // we are mapping the attributed holding params into the directive's scope
        scope: {
          cssActivePage: '@currentpagestyle',
          indexActivePage: '@currentpage',
          allPages: '=pages'
        }

        // This is the function that gets executed after Angular has compiled the html
        // We are going to move our logic into our template. Therefore, there is no need to add any logic in this function
        // link: function(scope, element, attrs) {
        // }
      }
    }
  ]);
{% endhighlight %}

Let's have a look at the "myTemplate.html" file:

{% highlight html %}
<span ng-repeat="page in allPages"
    {% raw %} ng-class="{ {{cssActivePage}}: $index == indexActivePage}">{{page}} {% endraw %}
</span>

{% endhighlight %}

So now each html has:

{% highlight html %}

<div class="breadcrumb">
  <div data-my-progress-bar
    data-currentPage="0"
    data-currentPageStyle="active"
    data-pages="['Select Product','Confirmation']">
  </div>
</div>

{% endhighlight %}

Let's point out that:
- the directive is declared to be used as an attribute ("restrict" attribute)
- the directive HTML code related is extracted and placed into a new separated file ("templateUrl" attribute)
- the directive defines its inner scope with variables ("scope" attribute)
- the "link" function has been commented since the logic is now applied on the template html.

Note: the real-world directive should have more code written (for instance some validation on the page number or CSS) but that is not the purpose of this post and is totally out of scope.-

Having updated the original code, we are able to provide different quantities of pages and their corresponding names.

{% include plunker.html id="LFB2RG3zGB59OKhtKbwT" %}

[1]:http://ng-learn.org/2014/02/Simple-Directive-Example/
