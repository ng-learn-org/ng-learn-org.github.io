---
layout: post
title: AngularJS - Workshop - From Zero to Ninja Turtle Jr - Part 4
author: Santiago Esteva
categories: [beginner , workshop]
---

Merry Xmas!! This is the fourth part of our AngularJS + CoffeeScript + TDD Workshop.
Have you been a good developer this year?

### Scenes from our last chapters
In our [first chapter][1], we setup our Angular application and define our first module.

In our [second chapter][2], we defined our first controller and we looked at some angular\'s magic: scope and bidirectional data binding.

In our [third chapter][3], we wrote our first unit test following our Test Driven Development methodology

### What concepts and practices will be covered in the third part of this workshop?

- E2E Test
- Routes
- Views

### If you just join us...
You may choose to follow [Part 1][1], [Part 2][2] and [Part 3][3] to setup the application, create the controller and write a unit test all by yourself.

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

Before doing anything new, lets bring everybody to the same page. Please run the following command in your terminal:

    git checkout -f step-4

If you get \"Karma is not a task\" or \"Karma is not found\". Please execute

    npm install grunt-karma --save-dev
    npm install karma-ng-scenario --save-dev


**AC:**

1. As a User, when I open myStore home page, then I should see the login form requesting username and password.

2. As a User, when I fill in the login form, then I should be redirected to my welcome page.

3. As a User, when I get to my welcome page, then I should see the phrase \"Welcome to the AngularJS World, FULL_NAME_HERE\".

**Assumptions:**

1. All login attempts are successful.

2. When the user fills the form, our application needs to pass the username and password to our Profile Service. Our Profile Service returns a Profile containing user\'s Full Name.

### AC 1
AC 1 seems to require a change on the flow. We need to add another test to our test nest. For this change, a unit test will not do. Instead, we will do an E2E test. E2E should be considered the Angular keyword to describe Component or UI testing.

 - **Development Flow - E2E Test:** In this case, we can create an E2E test to validate the first page we hit is the login page. Create a new folder under test. Lets call it e2e. Then create a new file called \"loginScenario.coffee\".

 {% highlight coffeescript %}
 describe "Login Flow", ->

     beforeEach ->
         browser().navigateTo "/"

     it "should be the first page", ->
         expect(element("h1").text()).toBe "Login"
 {% endhighlight %}

 If we run \'grunt test\' then all unit and e2e test will be executed. We now have a failing test.

 - **Development Flow - Coding:**  Adding an H1 tag (with the "Login" text) in our index.html would be enough to make this test go green. Since we are already there, lets add a small form requesting a username and password.

 {% highlight html %}
 <div>
     <h1>Login</h1>
     <form>
         <label>username</label><input name="username">
         <label>password</label><input name="password">
         <button>Login</button>
     </form>
 </div>

 <div ng-controller="welcomeController">
     Welcome to the AngularJS World, {{"{{fullName"}}}}
 </div>
 {% endhighlight %}

 Lets run the app and see what we got. As you can see we now have the Login section and the welcome phrase all together on the same page. This is not the flow requested. Lets fix that. We are going to create two different views: one for the login page and one for the welcome page.

 - Create a new file under app/views and call it \'login.html\' and cut/paste the div containing the Login H1 and form.
 - Create a new file under app/views and call it \'welcome.html\' and cut/paste the div containing the welcome phrase.

 If we run the app right now, nothing will be displayed since we have removed all the content from that index.html. Now we need to attach the views to our app flow. How do we do that?

 - **Step 1:** In our index.html we will add a container for our views.

 {% highlight html %}
  <div ng-view></div>
 {% endhighlight %}

**Notes:** The ng-view directive is the one Angular will find and insert/remove/swap the views.

 - **Step 2:** Now we need to tell Angular what view to include based on the url we are at. so if we are in \'/\' we want to display the login page. if we are at \'/welcome\' we want to display the welcome page. In order to that we will Routes to our main module \'myStoreApp\'. Lets go to app.coffee and make the following modifications:

 {% highlight coffeescript %}
 # Define main module and its dependencies
 angular.module('myStoreApp', [])

 # Add configuration to the module; such as routes
 angular.module("myStoreApp").config ($routeProvider) ->

     # When the url matches / then we inject the login html
     $routeProvider.when("/",
         templateUrl: "views/login.html"
     )

 # Add a run block. This is executed only once when the app is bootstrapped.
 angular.module("myStoreApp").run ($rootScope) ->
     console.log 'Its alive!'

     # Prexisting profile object
     $rootScope.profile =
         firstName: "Santiago"
         lastName: "Esteva"

 # Add a controller to our main module/
 angular.module("myStoreApp").controller "welcomeController", ["$scope", ($scope)->

     $scope.fullName = $scope.profile.firstName + " " +  $scope.profile.lastName

 ]
 {% endhighlight %}

 Now lets add a route for our welcome page.

 {% highlight coffeescript %}
 # When the url matches / then we inject the login html
 $routeProvider.when("/",
     templateUrl: "views/login.html"
 ).when("/welcome",
     templateUrl: "views/welcome.html"
 )
 {% endhighlight %}

 Lets run our app. \'grunt server\' and we should find the login form being displayed.

 The url is \'http://localhost:9000/#/\' The portion we should be paying attention to is \'#/\'.

 If we change the url manually to \'http://localhost:9000/#/welcome\' the application will change the view and it will now display the welcome phrase only.

 AC 1 seems to be covered. We are in a good state to commit our code.

 We have added value and left everything in a good position so somebody else could pick this up tomorrow.

### Whats Next?

 We will be looking at Application Flow testing (unit test vs E2E). See you soon.


[1]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Turtle_Jr/
[2]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part_2/
[3]: http://ng-learn.org/2013/12/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part3/
