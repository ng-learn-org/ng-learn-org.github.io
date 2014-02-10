---
layout: post
title: AngularJS - Workshop - From Zero to Ninja Turtle Jr - Part 6
author: Santiago Esteva
categories: [beginner , workshop]
---

Today the Angular Conference <a href="http://ng-conf.org/" target="_blank">NG-CONF</a> starts.
We are going to be part of it. Follow us on twitter  <a href="https://twitter.com/ng_learn" target="_blank">@ng_learn</a> to get more news.
Before we departed we wanted to give you some homework.
This is the sixth part of our AngularJS + CoffeeScript + TDD Workshop.

### Scenes from our last chapters
In our [first chapter][1], we setup our Angular application and define our first module.

In our [second chapter][2], we defined our first controller and we looked at some angular\'s magic: scope and bidirectional data binding.

In our [third chapter][3], we wrote our first unit test following our Test Driven Development methodology

In our [fourth chapter][4], we wrote our first component test (E2E), we set our first route and view.

In our [fifth chapter][5], we analyzed different options to test our application flow (e2e vs unit tests).

### What concepts and practices will be covered in the sixth part of this workshop?

- Create Constant to fake a persistance layer
- Unit Test Controllers with dependencies
- Unit Test Services
- Usage of Jasmine Spys
- Providing fake implementations in Unit Tests

### If you just join us...
You may choose to follow [Part 1][1], [Part 2][2], [Part 3][3], [Part 4][4] and [Part 5][5] to setup the application, create the controller, write a unit test, add a route, a view and a component/flow test (e2e) all by yourself.

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
If you would like to review this section, please revisit [Part 5][5].


### Step 6 - Tackling AC 3 - A TDD experience

Before doing anything new, lets bring everybody to the same page. Please run the following command in your terminal:

    git checkout -f step-4c

If you get "Karma is not a task" or "Karma is not found". Please execute

    npm install grunt-karma --save-dev
    npm install karma-ng-scenario --save-dev


### AC 3

 "As a User, when I get to my welcome page, then I should see the phrase "Welcome to the AngularJS World, FULL_NAME_HERE"."

 **Assumptions:**
   1. All login attempts are successful.
   2. When the user fills the form, our application needs to pass the username and password to our Profile Service. Our Profile Service returns a Profile containing user\'s Full Name.

 - **Development Flow - Unit Test:** We will start by creating a unit test for our ProfileService. We will create the file profileServiceSpec.coffee inside a new folder called services inside Spec.

   {% highlight coffeescript %}
   describe "Profile Service", ->

     # load the controller\'s module
     beforeEach module("myStoreApp")

     profileService = undefined

     # create an instance of the ProfileService and assign it to my local variable
     beforeEach inject ($injector) ->
       profileService = $injector.get 'profileService'

     it "should login user with username and password", ->
       profileService.login("myUser", "myPassword")
   {% endhighlight %}

   Now if we run 'grunt test' we should get an error saying **"Error: Unknown provider: ProfileServiceProvider <- ProfileService"** since our ProfileService does not actually exist yet. Lets fix that.

 - **Development Flow - Coding:** Since our application is still small, we will keep working on our app.coffee. Only fix the problem you have in front of you. Lets add a new service.

   {% highlight coffeescript %}
   angular.module("myStoreApp").service "profileService", [ ->

       login: ()->

   ]
   {% endhighlight %}

   We created a service and gave it a public method called 'login. 'Run 'grunt test' again and our tests are back to green.

 - **Development Flow - Unit Test:** Lets add another failing test.

   {% highlight coffeescript %}
   it "should login user with username and password", ->
       profile = profileService.login("myUser", "myPassword")
       expect(profile.fullName).toBe("Santiago Esteva")
   {% endhighlight %}

 - **Development Flow - Coding:** We will provide an implementation to our login method. Pay special attention to our public vs private functions.

   {% highlight coffeescript %}
   angular.module("myStoreApp").service "profileService", [ ->

       # private functions
       retrieveProfile = (user, password)->
         profile =
           fullName: "Santiago Esteva"

       # public functions
       login: retrieveProfile

   ]
   {% endhighlight %}

   Lets run 'grunt test' again. All tests should be green now. Lets pause for a second. What if we want to see the JS generated for our service? Go to .tmp/scripts and open app.js and lets take a look at the profileService.

 - **Development Flow - Unit Test:** Lets add another failing test.

   {% highlight coffeescript %}
   it "should login user with username and password", ->
       profile = profileService.login("myUser", "myPassword")
       expect(profile.fullName).toBe("Santiago Esteva")

   it "should login any user with username and password and return the fullName", ->
       profile = profileService.login("anotherUser", "hisPassword")
       expect(profile.fullName).toBe("John Doe")
   {% endhighlight %}

   When running the tests you will see **"Expected 'Santiago Esteva' to be 'John Doe'."**

 - **Development Flow - Coding:** We will need to make a few changes to fix this one. Lets start...

   Im going to start providing a fake persistance layer, somewhere where we can retrieve the profile based on user/pass. We are going to use the object of type Constant. In our app.coffee...

   {% highlight coffeescript %}
   angular.module("myStoreApp").constant "myFakeDb",

     profiles: [
       user: "myUser"
       password: "myPassword"
       fullName: "Santiago Esteva"
     ,
       user: "anotherUser"
       password: "hisPassword"
       fullName: "John Doe"
     ]
   {% endhighlight %}

   In our profileService we want to include the constants as our fake DB and query it looking for that profile that matches our user/pass.

   {% highlight coffeescript %}
   retrieveProfile = (user, password)->
       matchedProfile = undefined

       angular.forEach myFakeDb.profiles, (profile, key)->
           if profile.user is user then matchedProfile = profile

       return matchedProfile
   {% endhighlight %}

 - **Development Flow - Unit Test:** Next move is to provide the logic in our controller so it queries the ProfileService with the user/pass provided by the user. Lets open our loginControllerSpec.coffee. We need to make sure that after the form was submitted, the profile service was queried and then the location was changed to the welcome page.

   We add a local instance of the profile service in our test

   {% highlight coffeescript %}
   loginController = scope = location = profileService = undefined
   {% endhighlight %}

   We add _profileService_ to our inject statement. Angular removed the underscores and injects a version of our ProfileService. Then assign the service to our local instance.
   Then we create a spy on the service's function called login. A spy is an object that will intercept that call and it will provide control to us to verify it was called, inject a canned response and other convenient methods.

   {% highlight coffeescript %}
   # Initialize the controller
   beforeEach inject ($controller, $rootScope, $location, _profileService_) ->
       location = $location
       scope = $rootScope.$new()

       # The injector unwraps the underscores (_) from around the parameter names when matching
       profileService = _profileService_

       loginController = $controller "loginController",
           $scope: scope

   describe "When clicking the submit button", ->

       it "should go to the welcome page", ->

           # Create spy on our service. Intercept the call to our login method. We do not care about its internal implementation or response
           profileSpyOn = spyOn(profileService, "login")

           scope.submit()

           expect(profileSpyOn).toHaveBeenCalled()
           expect(location.path()).toBe("/welcome")

   {% endhighlight %}

   Since we are not really interested in the ProfileService, instead of injecting the ProfileService we could have created a small fake profileService that has a function called login.
   If you do this, you should also tell the controller you want to inject the fake Service on the place of the real service. In the previous scenario, Angular was taking care of that for us.
   The last change is to spy on the fakeService instead. The changes would look like this.

   {% highlight coffeescript %}
   loginController = scope = location = fakeProfileService = undefined

   # Initialize the controller
   beforeEach inject ($controller, $rootScope, $location) ->
       location = $location
       scope = $rootScope.$new()

       # We create a fake profile Service that fulfills the login function
       fakeProfileService =
           login: ()->
             return null

       # We create the controller passing the profile service implementation to be injected.
       loginController = $controller "loginController",
           $scope: scope
           profileService: fakeProfileService

     describe "When clicking the submit button", ->

       it "should go to the welcome page", ->

           # Create spy on our service. Intercept the call to our login method. We do not care about its internal implementation or response
           profileSpyOn = spyOn(fakeProfileService, "login")

           scope.submit()

           expect(profileSpyOn).toHaveBeenCalled()
           expect(location.path()).toBe("/welcome")
   {% endhighlight %}

   Both options are correct and you may find opting for the later one since allows you more control.
   On the other hand, if the object you are testing has a lot of dependencies there may be an overhead creating all those fake implementations.
   In that case you may choose to inject the real implementation but then use spyOn so you intercept those calls.
   we are going to stick with this last implementation.

   If we run 'grunt test' now, it will show the following error "Expected spy login to have been called." since our controller does not have any call to our profileService. We shall change that..

 - **Development Flow - Coding:** Lets open our app.coffee and go into our loginController.

   {% highlight coffeescript %}
   angular.module("myStoreApp").controller "loginController", ["$scope","$location","profileService", ($scope, $location, Profile)->

       $scope.submit = ()->
         Profile.login("user", "password")
         $location.path "/welcome"

   ]
   {% endhighlight %}

   Run the tests and we should be green again.

 - **Development Flow - Unit Test:** Now lets make sure the controller is passing the values the user entered.

   {% highlight coffeescript %}
   describe "When clicking the submit button", ->

       it "should go to the welcome page", ->

           # Create spy on our service. Intercept the call to our login method. We do not care about its internal implementation or response
           profileSpyOn = spyOn(fakeProfileService, "login")

           # Faking user input
           scope.ui.login.user = "labrador"
           scope.ui.login.pass = "trinity1"

           scope.submit()

           expect(profileSpyOn).toHaveBeenCalledWith('labrador', 'trinity1')
           expect(location.path()).toBe("/welcome")
   {% endhighlight %}

   Lets run the tests. Failed as expected.

 - **Development Flow - Coding:** Lets implement the code to make that test pass.

   {% highlight coffeescript %}
   angular.module("myStoreApp").controller "loginController", ["$scope","$location","profileService", ($scope, $location, Profile)->

       $scope.ui =
           login: {}

       $scope.submit = ()->
           Profile.login($scope.ui.login.user, $scope.ui.login.pass)
           $location.path "/welcome"

   ]
   {% endhighlight %}

   We run the tests and green!  Lets run the app. 'grunt server'.

### Whats Next?

   We will be back with much more, debugging, directives and lots of updates from the Conference.
   Always check our [Workshop Section][6] for more posts.



[1]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Turtle_Jr/
[2]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part_2/
[3]: http://ng-learn.org/2013/12/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part3/
[4]: http://ng-learn.org/2013/12/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part4/
[5]: http://ng-learn.org/2014/01/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part5/
[6]: http://ng-learn.org/tags/workshop.html
