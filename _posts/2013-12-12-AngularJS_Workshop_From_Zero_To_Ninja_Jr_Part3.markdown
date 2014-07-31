---
layout: post
title: AngularJS - Workshop - From Zero to Ninja Turtle Jr - Part 3
author: Santiago Esteva
categories: [beginner , workshop]
---

Welcome again little grasshopper. This is the third part of our AngularJS + CoffeeScript + TDD Workshop.
Are you ready to kill Bill?

### Scenes from our last chapters
In our [first chapter][1], we setup our Angular application and define our first module.

In our [second chapter][2], we defined our first controller and we looked at some angular\'s magic: scope and bidirectional data binding.

### What concepts and practices will be covered in the second part of this workshop?

- TDD Flow
- Unit Test our Controller
- RootScope

### If you just join us...
You may choose to follow [Part 1][1] and [Part 2][2] to setup the application and create the controller all by yourself.

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

Before doing anything new, lets bring everybody to the same page. Please run the following command in your terminal:

    git checkout -f step-3

If you get \"Karma is not a task\" or \"Karma is not found\". Please execute

    npm install grunt-karma --save-dev
    npm install karma-ng-scenario --save-dev


 **AC:** As a User, when I open myStore home page, then I should see the phrase \"Welcome to the AngularJS World, FULL_NAME_HERE\".

 **Assumptions:** The application already has an object called profile that contains firstName and lastName.

 - **Development Flow - Unit Test:** Now that we know our AC, we need to write our first unit test. Under test lets create a folder spec and a subfolder called controllers. And inside lets create a file called welcomeControllerSpec.coffee

  {% highlight coffeescript %}
  describe "Controller: WelcomeController", ->

      # load the controller's module
      beforeEach module("myStoreApp")

      welcomeController = scope = undefined

      # Initialize the controller and a mock scope
      beforeEach inject(($controller, $rootScope) ->

        $rootScope.profile =
          firstName: "First"
          lastName: "Last"

        scope = $rootScope.$new()

        welcomeController = $controller("welcomeController",
          $scope: scope
        )
      )

      it "should compose the fullName based on firstName and lastName attributes from prexisting profile object", ->
        expect(scope.fullName).toBe "First Last"
  {% endhighlight %}

  Lets run the tests, go to the console and execute \'grunt test\'. You will see \"Expected undefined to be \'First Last\'.\" and \"PhantomJS 1.9.2 (Linux): Executed 1 of 1 (1 FAILED) ERROR (0.183 secs / 0.009 secs)\"
  That\'s actually great. This is the expected output. Now we have a failing unit test that we can code against. Kudos!

 - **Development Flow - Coding:** Now we will write the minimum amount of code to make the unit test pass. In our app.coffee we will create the function to compose the fullName

  {% highlight coffeescript %}
  angular.module("myStoreApp").controller "welcomeController", ["$scope", ($scope)->
      $scope.fullName = $scope.profile.firstName + " " +  $scope.profile.lastName
  ]
  {% endhighlight %}

  The business logic is covered. Lets make the changes on the UI. Go to index.html and update the welcome phrase div.

  {% highlight markup %}
  Welcome to the AngularJS World, {{"{{fullName"}}}}
  {% endhighlight %}

  Lets run the app.

    grunt server

  Lets take a look at our application on te browser.

  **Q:** What??? How come we still see '\{\{fullName\}\}'?

  **A:** That\'s because we don\'t have a preexisting profile object.

  Lets fix this with some stubbed data. Open app.coffee and update the run block.

  {% highlight coffeescript %}
    angular.module("myStoreApp", []).
        run ($rootScope) ->
            console.log 'Its alive!'

          # Prexisting profile object
          $rootScope.profile =
              firstName: "Santiago"
              lastName: "Esteva"
  {% endhighlight %}

  Lets refresh the app. You should now see \"Welcome to the AngularJS World, Santiago Esteva\".

    **Notes:**

    This actually brings up an interesting subject. When we created the myStoreApp, Angular created a $rootScope. This is parent of all scopes. At the run block, we instructed Angular to inject an object Profile with certain attributes.

    Our welcome phrase lives inside the welcomeController\'s scope. All scopes inherit from its parent and ultimately from $rootScope. This is why we can refer to $scope.profile.firstName in our controller.

### Whats Next?

   In 48 hours we will publish. Yes Yes I know...we said 48 hours last time and that did not happen. Well, you\'re right but in our defense it was the first time it happened. We are back from some vacations and ready to pick up from where we left.

   So, whats coming? On our 4th delivery we will continue our TDD development flow with new requirements. We will write a component test (E2E test) to test our application flow, setup routes and views.

   Stay tuned...


[1]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Turtle_Jr/
[2]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Jr_Part_2/
