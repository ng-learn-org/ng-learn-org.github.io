---
layout: post
title: AngularJS - Workshop - From Zero to Ninja Turtle Jr - Part 1
author: Santiago
categories: [beginner , workshop]
---

Welcome my young padawan. This is the first part of our AngularJS + CoffeeScript + TDD Workshop.
Are you ready Shinobi?

### Why an AngularJS + CoffeeScript + TDD workshop?

At work we have a really large AngularJS project. Here is a little bit of history about it:

- We created it using Yeoman to model the folder structure and Grunt as our task magic tool.
- We started working with Javascript but after a few weeks we switched to CoffeeScript. It took us a couple of weeks to stop thinking twice every single line but once we get used to it, it felt as the right thing to have done.
- The project got hectic and new developers joined.

So, we created a small workshop for them to follow on their own while traversing through different activities and lessons.
We wanted to focus their attention on AngularJS and TDD practices. We did not want them to pay attention to Yeoman or Grunt.
But having paid the price of switching from Javascript to CoffeeScript we decided to raise the bet "the only way to get better at something is through repition", right? So we decided to write the workshop in Coffee.

Today we publish our first part of our AngularJs Workshop - From Zero to Ninja Turtle Jr.

The code at github has been written in CoffeeScript but you could easily switch any part into JS using [http://js2coffee.org/][4]

### What concepts and practices will be covered in the first ?

- Creation and Setup of my AngularJS application
- Module creation and definition
- Controller creation and definition
- Understanding Scope and RootScope
- TDD: Karma and Jasmine - Unit Test - Controllers
- TDD: Karma and Jasmine - Unit Test - Services
- TDD: Karma and Jasmine - E2E Tests (Component Testing)
- Views
- Routes

### Is that it?

No sir/lady. We are already working on AngularJS Workshop - From Ninja Turtle Jr. to Kill Bill. It will contain much more content specially all around directives.

### What are the requirements to follow this workshop?

On a Mac or a Linux machine it is much much simple. Homebrew or apt-get will get you far. On a Windows machine, things are little bit different.
If you are on a windows machine, Id highly recommend an ubuntu VM. But if you still insist on working with Windows, then NodeJS (msi), NPM, Yeoman and Grunt have their windows installation sections. Here are some useful links about it:

- [Node and Npm on Windows][1]
- [Yeoman and Stack on Windows][2]
- [Grunt on Windows][3]

Tools getting started links:

- [GruntJS][5]
- [Yeoman][6]
- [NodeJS][7]
- [HomeBrew OSX missing package manager][8]


### Javascript or CoffeeScript?

In case you haven't read our intro let me tell our project switched from JS to CS and it was not that painful.
During this adaption, we were constantly visiting [http://js2coffee.org/][4] writing some code in JS and observing the CS output.
This was true for a couple of weeks. When we finally got it, it rapidly became a very comfortable place.
Maybe in the future we will redo the workshop again in JS. Right now, after our experience, it feels a better place to be.
And that's exactly why we encourage you to follow along. Switch now!

### What is not covered in this workshop?

- [GruntJS][5]
- [Yeoman][6]

These will be covered in future entries.

[1]: http://www.hacksparrow.com/install-node-js-and-npm-on-windows.html
[2]: http://decodize.com/css/installing-yeoman-front-end-development-stack-windows/
[3]: http://www.ghosthorses.co.uk/production-diary/installing-grunt-on-os-x-and-windows-7/#grunt_win7
[4]: http://js2coffee.org/
[5]: http://gruntjs.com/getting-started
[6]: http://yeoman.io/gettingstarted.html
[7]: http://nodejs.org/
[8]: http://brew.sh/


### PreRequisites

- Install Node and NPM

### Setup

    git clone https://github.com/ng-learn-org/workshop.git
    cd workshop
    npm install
    npm install -g bower
    bower install

In this couple of steps we install all dependencies and our complete tool chain.

### Step 0 - Setup the AngularJs App

    git checkout -f step-0

- Add AngularJs library to our index.html

    {% highlight html %}
      <div>Welcome to the AngularJS World</div>

      <script src="bower_components/angular/angular.js"></script>

    </body>
    {% endhighlight %}

- Bootstrap the AngularJS app using the automatic method

    {% highlight html %}
    <body ng-app>
    {% endhighlight %}

- Lets update our welcome message

    {% highlight html %}
    <div>Welcome to the AngularJS World, {{userName}}</div>
    {% endhighlight %}

- Start the app by going to our command line and running

    {% highlight coffeescript%}
    grunt server
    {% endhighlight %}

  By running this command, we have just created a small nodejs http server that will serve our application. But Grunt is not part of our scope today. Play along and lets go back to AngularJS.

  **Notes:** The application should say "Welcome to the AngularJS World," but the "{{userName}}" portion should not be visible. Angular has kicked in and it does not display it because that variable is not binded to anything, yet!

### Step 1 - Defining our first module

    git checkout -f step-1

- Lets name our application

    {% highlight html %}
    <body ng-app="myStoreApp">
    {% endhighlight %}

- Create app.coffee inside app folder and define our application in app.coffee

    {% highlight coffeescript %}
    angular.module("myStoreApp", [])
    {% endhighlight %}

  **Notes:** Here we define a module named 'myStoreApp'. The second parameter it is an array of dependencies required for this module.

- Add app.js to our index.html so the browser will load it

    {% highlight html %}
      <div>Welcome to the AngularJS World</div>

      <script src="bower_components/angular/angular.js"></script>

      <!-- build:js({.tmp,app}) scripts/scripts.js -->
      <script src="scripts/app.js"></script>
      <!-- endbuild -->
    </body>
    {% endhighlight %}

  **Notes:** we add our js file wrapped in a 'build comment' so our toolchain converts it from coffee script to javascript.

- To prove our point, we will add a Run block to our module. Run blocks are the closest thing in Angular to the main method in Java.
  It will be executed after all the dependencies have been injected. Open app.coffee and make the following modification

    {% highlight coffeescript %}
    angular.module("myStoreApp", []).
      run ->
        console.log 'Its alive!'
    {% endhighlight %}

  Lets run 'grunt server' in the terminal. This will open a browser with out application. Lets open the developer tools and on the console you should find "Its alive!".
  Congratulations. You've created your first Angular module.


### Is that it?

  Patience you must have my young padawan.
  We want to give you time to tune in, provide feedback and point out all our mistakes.
  We will be post the second part in 48 hours.







