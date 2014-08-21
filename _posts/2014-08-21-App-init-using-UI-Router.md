---
layout: post
title: App init using ui-router
author: Bluescreen
categories: [tips]
---

One of the coolest features that [ui-router][1] is the ability create nested views. Child states inherit resolved dependencies from the parent state. Nested views is something that the default [ngRoute][2] does not support.

We are building an application in which the user needs to be authenticated first. If the user is not authenticated we present the login form, if it has previously authenticated (has a valid session cookie) we let the user in.

Using the default ngRoute, we came up to a code that looks like this:

{%highlight javascript %}

app.config(function($routeProvider) {
  var authentication = function() {
    // Promise to validate prior authentication
  }

  $routeProvider
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    })
    .when('/home', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl',
      resolve: authentication
    })
    .when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: 'ProfileCtrl',
      resolve: authentication
    })
});

{% endhighlight %}

One of the problems with the that code is that for any new route we create we need to include the ``resolve: authentication``. The repetition in itself is problematic, as there is more code to maintain and understand. But more important is the fact that if we forget to include the dependency to the authentication promise, an unauthenticated with a deep link to that page will be presented with a very likely broken page as items and actions inside the application depend on the user being authenticated.

Maybe when the ui-router team created nested states didn't have this particular use case in mind, but being able to inherit dependencies from a parent state simplifies the code significantly. Let's look at the previous example using now the ui-router

{%highlight javascript %}

app.config(function($stateProvider) {
  var authentication = function() {
    // Promise to validate prior authentication
  }

  $stateProvider
    .state('login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      url: '/login'
    })
    .state('secured', {
      abstract: true,
      resolve: authentication
    })
    .state('secured.home', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl',
      url: '/home'
    })
    .state('secured.profile', {
      templateUrl: 'partials/profile.html',
      controller: 'ProfileCtrl',
      url: '/profile'
    })
});

{% endhighlight %}

The dependency is declared once and all children states, which in a big application can be a considerable amount, will automatically inherit it. This makes code less error-prone and more maintainable.

[1]: https://github.com/angular-ui/ui-router
[2]: https://github.com/angular/angular.js/tree/master/src/ngRoute
