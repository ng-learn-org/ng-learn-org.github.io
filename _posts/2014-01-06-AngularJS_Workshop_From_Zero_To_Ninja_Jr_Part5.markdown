---
layout: post
title: AngularJS - Workshop - From Zero to Ninja Turtle Jr - Part 5
author: Santiago Esteva
categories: [beginner , workshop]
---

This is the fifth part of our AngularJS + CoffeeScript + TDD Workshop.
On other news, we are one week away from the first Angular Conference <a href="http://ng-conf.org/" target="_blank">NG-CONF</a>.
Ng-Learn will be present and posting what we learn.
Stay tuned!!


### Scenes from our last chapters
In our [first chapter][1], we setup our Angular application and define our first module.

In our [second chapter][2], we defined our first controller and we looked at some angular\'s magic: scope and bidirectional data binding.

In our [third chapter][3], we wrote our first unit test following our Test Driven Development methodology

In our [fourth chapter][4], we wrote our first component test (E2E), we set our first route and view.

### What concepts and practices will be covered in the fifth part of this workshop?

- Application Flow testing: E2E vs Unit Tests

### If you just join us...
You may choose to follow [Part 1][1], [Part 2][2], [Part 3][3] and [Part 4][4] to setup the application, create the controller, write a unit test, add a route, a view and a component/flow test (e2e) all by yourself.

If you want to jump to this lesson, you just need to follow our Setup section and we will provide you with fully setup application.
All past and future lessons are co-related but independent from each other.

**Warning:** our workshop is our first humble attempt to provide a smooth introduction to three topics:
- AngularJS,
- CoffeeScript and
- Test Driven Development

In our [Part 1][1] we lay out reasons why CoffeeScript and not Javascript was selected for this mission.

### Setup
Follow these steps if you haven\'t played Part 1. Take a look at the requirements explained in [Part 1][1].

In these couple of steps we install all dependencies and our complete tool chain.

    git clone https://github.com/ng-learn-org/workshop.git
    cd workshop
    npm install
    npm install -g bower
    bower install



### Step 0 - Setup the AngularJs App
If you would like to review this section, please revisit [Part 1][1].

### Step 1 - Defining our first module
If you would like to review this section, please revisit [Part 1][1].

### Step 2 - Defining our first controller
If you would like to review this section, please revisit [Part 2][2].

### Step 3 - Our first Requirement
If you would like to review this section, please revisit [Part 3][3].

### Step 4 - Our second Requirement
If you would like to review this section, please revisit [Part 4][4].

### Step 5 - Tackling AC 2 - Application Flow

Before doing anything new, lets bring everybody to the same page. Please run the following command in your terminal:

    git checkout -f step-4b

If you get \"Karma is not a task\" or "Karma is not found". Please execute

    npm install grunt-karma --save-dev
    npm install karma-ng-scenario --save-dev

**AC 2: ** \'As a User, when I fill in the login form, then I should be redirected to my welcome page.\'

 It seems that once again, we could start with a flow interaction test. When I click on Login button, the application should redirect to the welcome page.
 We have two options to test this. We could extend our E2E test simulating the user has filled the form, click Login and expect the welcome view has been attached and the welcome phrase is now displayed.
 We can also write a unit test taking advantage we have access to the $location service, who is responsible for making that url change which ultimately produces the view change.
 Which one to choose? 600 unit tests will run in 2 secs. 20 E2E test will execute in 1-2 mins. Taking into account the validation is covered by both test, the economic option seems to be the best fit in this case.

 - **Development Flow - Unit Test:** Lets create a new test inside our spec/controllers folder. Lets call it \'loginController.coffee\'

    {% highlight coffeescript %}
    describe "Login Controller", ->

      # load the controller's module
      beforeEach module("myStoreApp")

      loginController = scope = undefined

      # Initialize the controller
      beforeEach inject ($controller, $rootScope) ->
        scope = $rootScope.$new()

        loginController = $controller "loginController",
          $scope: scope

      describe "When clicking the submit button", ->

        it "should go to the welcome page", ->
    {% endhighlight %}


   If we run grunt test, we will get a message saying \"Error: Argument \'loginController\' is not a function, got undefined\" Lets switch and code the minimum code to make this test green.

 - **Development Flow - Coding:** Lets create a new controller inside our app. In our app.coffee lets add the new controller.

    {% highlight coffeescript %}
    angular.module("myStoreApp").controller "loginController", ["$scope", ($scope)->

    ]
    {% endhighlight %}

   Run the tests again. Success!

 - **Development Flow - Unit Test:** Lets add a new expectation in our test, so when we click the submit button the app is redirected to the welcome page.

    {% highlight coffeescript %}
    describe "Login Controller", ->

      # load the controller's module
      beforeEach module("myStoreApp")

      loginController = scope = location = undefined

      # Initialize the controller
      beforeEach inject ($controller, $rootScope, $location) ->
        location = $location
        scope = $rootScope.$new()

        loginController = $controller "loginController",
          $scope: scope

      describe "When clicking the submit button", ->

        it "should go to the welcome page", ->
          scope.submit()
          expect(location.path()).toBe("/welcome")
    {% endhighlight %}

   Run grunt test and you will see a new error: TypeError: \'undefined\' is not a function (evaluating \'scope.submit()\'). Switch!

 - **Development Flow - Coding:** We will add a new function to our scope and use the location service to change the path.

    {% highlight coffeescript %}
    angular.module("myStoreApp").controller "loginController", ["$scope","$location", ($scope, $location)->

      $scope.submit = ()->
        $location.path "/welcome"

    ]
    {% endhighlight %}

   Lets run the tests again -> success!

   Are we missing something? Lets attach this new behaviour to our View.

   In our login.html we will give the control to our loginController and attach our submit function to out Login button.

    {% highlight html %}
    <div ng-controller="loginController">
        <h1>Login</h1>
        <form>
            <label>username</label><input name="username">
            <label>password</label><input name="password">
            <button ng-click="submit()">Login</button>
        </form>
    </div>
    {% endhighlight %}
   Lets run the app with \'grunt server\' and hit the Login button. AC 2 seems to be covered.

### Whats Next?

   We will be back with much more TDD action. Always check our [Workshop Section][5] for more posts.



[1]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Turtle_Jr/
[2]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part_2/
[3]: http://ng-learn.org/2013/12/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part3/
[4]: http://ng-learn.org/2013/12/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part4/
[5]: http://ng-learn.org/tags/workshop.html