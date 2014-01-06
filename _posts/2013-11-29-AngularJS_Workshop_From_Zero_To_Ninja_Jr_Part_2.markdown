---
layout: post
title: AngularJS - Workshop - From Zero to Ninja Turtle Jr - Part 2
author: Santiago Esteva
categories: [beginner , workshop]
---

Welcome again my young padawan. This is the second part of our AngularJS + CoffeeScript + TDD Workshop.
Was the first part too easy? Lets see how you do this time. Are you ready Shinobi?

### Scenes from our last chapter
In our [first chapter][1], we setup our Angular application and define our first module.

### What concepts and practices will be covered in the second part of this workshop?

- Controller definition
- Scope
- Data Binding

### If you just join us...
You may choose to follow [Part 1][1] to setup the application yourself.

If you want to jump to this lesson, you just need to follow our Setup section and we will provide you with fully setup application.
All past and future lessons are co-related but independent from each other.

**Warning:** our workshop is our first humble attempt to provide a smooth introduction to three topics:
- AngularJS,
- CoffeeScript and
- Test Driven Development

In our [Part 1][1] we lay out reasons why CoffeeScript and not Javascript was selected for this mission.

### Setup
Follow these steps if you haven't played Part 1. Take a look at the requirements explained in [Part 1][1].

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

Before doing anything new, lets bring everybody to the same page. Please run the following command in your terminal:

    git checkout -f step-2

- Now we are going to create a controller and provide our application some behaviour. Open index.html and lets add ng-controller to our div.

 {% highlight html %}
 <div ng-controller="welcomeController">Welcome to the AngularJS World, {{userName}}</div>
 {% endhighlight %}

 **Notes:** When you do this, Angular will look for a controller - inside of our myStoreApp module - called welcomeController.
 This controller will only have power over whats happening inside our \'div\'. We will refer to this domain as scope.

 Scopes are plain old JavaScript objects. We can attach properties to them. These become the glue between the view and the controller.

 Lets run the app and see what happens.

    grunt server

 The application will run without obvious problems. Now if we open the developer tools (Chrome: ctrl+shift+j) and take a look at the console we are going to see an error telling us the controller we are trying to use, it is not yet defined.

- Lets define our controller. Open app.coffee and make the following modifications.

 {% highlight coffeescript %}
 angular.module("myStoreApp").controller "welcomeController", ["$scope", ($scope) ->
     $scope.userName = "Santiago Esteva"
 ]
 {% endhighlight %}

 **Notes:** A few things have happened.

- We just created a new controller inside our module. We named it \"welcomeController\".
- We declare dependencies only the first time we defined the module. If we need to reuse a module we do not declare its dependencies.
- After naming our controller, we pass its dependencies **\' \[\"$scope\", \'** and then we defined the name these dependencies will have locally **\' ($scope) -> \'**. This means that we could have renamed them to whatever we wanted. **Example:  angular.module(\"myStoreApp\").controller \"welcomeController\", \[\"$scope\", (localScope) -> .** . As a best practice we keep the same names, specially when we deal with Angular objects.

 Lets open the application and see what we have. The application should not have any error and now you should see \"Welcome to the AngularJS World, Santiago\"

    **From the official docs**

     In Angular, a Controller is a JavaScript constructor function that is used to augment the Angular Scope.

     When a Controller is attached to the DOM via the ng-controller directive, Angular will instantiate a new Controller object, using the specified Controller\'s constructor function. A new child scope will be available as an injectable parameter to the Controller's constructor function as $scope.

     Use Controllers to:

     - Set up the initial state of the $scope object.
     - Add behavior to the $scope object.

- Finally, lets make a few more changes on our index.html.

 {% highlight html %}
 <div ng-controller="welcomeController">
     Welcome to the AngularJS World, {{userName}}
     <hr>
     <p>Inside the controller: <input name="userName" ng-model="userName"/></p>
 </div>
 <hr>
 <div>
     <p>Outside the controller: <input name="userName" ng-model="userName"/></p>
 </div>
 {% endhighlight %}

 Now, lets play with the inputs and lets see what happens. Noticed something weird???

 As you can see the first input generates the Bidirectional binding between the input and the welcome phrase. This is Angular magic.

 The userName variable exists under an specific scope, the controller\'s scope.

 While that works automagically, our second input - the one that exists outside our controller - does not change and even when we enter text it does not trigger a change on the welcome phrase. It is outside our controller's domain.
 Therefore, Angular does not connect the points between that string interpolation \'\{\{userName\}\}\' and the second model generated by the input.

    **More About Data Binding From the official Docs**

    Data-binding in Angular web apps is the automatic synchronization of data between the model and view components.

    The way that Angular implements data-binding lets you treat the model as the single-source-of-truth in your application.

    The view is a projection of the model at all times. When the model changes, the view reflects the change, and vice versa.


### Whats Next?

 In 48 hours we will publish the part 3 on this workshop. We will start our TDD process together. We will receive our first requirement for our application.
 We will start our development flow writing a unit test using Jasmine as our framework and Karma as our test executor.

 We will learn how to unit test a controller and once we get a nice failing test we will implement the logic to make that test go green again.

 Stay tuned...


[1]: http://ng-learn.org/2013/11/AngularJS_Workshop_From_Zero_To_Ninja_Turtle_Jr/

