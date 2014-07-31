---
layout: post
title: Real Time Synced Slides using Ionic, Firebase and AngularJS
author: Santiago Esteva
categories: [ionic, mobile]
---

AngularJS, IonicFrameWork and Firebase to create a Multi Device synchronized Presentation in real time to X amount of computers/devices.

Its been a while since I last wrote about Angularjs. Work has temporarily driven me on other paths.
Once again, just like in the past, my spare time has become my playground.

I've playing around with Firebase, IonicFramework and Angular. So I thought I could do a small project with these three fellows.
So last night, after soccer but before dinner, a small idea crossed my mind...

**A Multi Device synchronized Presentation in real time to X amount of computers/devices.**

The idea is I would share my presenation/slides url to a given audience. While I slide through the slides, the presentation they have in front of their eyes should move along. Only the presentor should be allowed to move slides back anf forth.

My first step was doing a very small prototype. Time boxed to 30 minutes. My wife really hates when I stick in front of the computer while she is calling me for dinner. Perfect, I had the right motivation to make it within the time constraint.

### Why Ionic?
Because it is easy enough to create a desktop, ipad, mobile version without extra efforts.

### Why Firebase?
Haven't you heard? Three way binding!!! Update model on my app and it will be reflected in a Firebase Backend Pool and into whoever else is looking at this same model.

## Prototype Challenge

- Time Box: 30 minutes
- Environment: plnkr.co
- Libraries: AngularJS, IonicFramework, Firebase
- Goals:
	- Create an application that renders a slides in any device.
	- When the next slide is displayed, sync all other instances of this presentation running in any local/remote device.
	- The presentor should be the only one allowed to control the slides flow back anf forth.

## Presentation Layer

Lets take a look at our html.

IonicFramework is giving a lot of features out of the box. ionPane, ionHeader,iOnContent provides the structure of our application.

iOnSlideBox and ionSlide provides exactly what we needed. It gives us a box that knows how to slide back and forth when user swipes a finger. It also provides a service to delegate the control to a programatic api which we will take use to generate a 'Next' button. Multi Device slides render app, checked!

{% highlight markup %}

  <body ng-app="demo">
    <ion-pane >

      <ion-header-bar class="bar-stable">
        <h1 class="title">Ionic Blank Starter</h1>
      </ion-header-bar>

      <ion-content class="has-header">
        <ion-slide-box >

          <ion-slide ng-controller="slidesCtrl">
            <h1>Slide Index: {{ui.index}}</h1>
            <button ng-click="nextSlide()" >Next</button>
          </ion-slide>

          <ion-slide ng-controller="slidesCtrl">
            <h1>Slide Index: {{ui.index}}</h1>
            <button ng-click="nextSlide()">Next</button>
          </ion-slide>

        </ion-slide-box>
      </ion-content>
    </ion-pane>
  </body>

{% endhighlight %}

## Syncing - Three Way Binding

Now we need to make sure we hold a slide/presentation index to be shared among all instances of the application. Firebase to the rescue.

We will create a variable holding our index. We will make sure to synchronize this index with the one ionic handles and the one firebase does.

Go through the code comments to understand the logic.

{% highlight javascript %}

.controller('slidesCtrl', function ($scope, $ionicSlideBoxDelegate, $firebase) {

  // Initializing our presentation index to 0
  $scope.ui = {
    index: 0
  };

  $scope.nextSlide = function() {

    // When user clicks next, we programatically slide to the next slide using ionicSlideBoxDelegate
    $ionicSlideBoxDelegate.next();

    // Then we make sure we update our index to the current slides index.
    $scope.ui.index = $ionicSlideBoxDelegate.currentIndex();
  }

  // Create a reference to our firebase pool
  var ref = new Firebase("https://sync-slides.firebaseio.com/");

  // Create a new object inside the pool and assign it to a local variable as an object
  var syncedSlidesIndex = $firebase(ref).$asObject();

  // Set up a three way binding between the firebase object and the ui object inside scope.
  syncedSlidesIndex.$bindTo($scope, "ui" ).then(function(){
    $scope.ui.index = 0;
  });

  // Set up a listener so that we are notified when this object changes - either from our instance or from firebase
  syncedSlidesIndex.$watch(function() {
    // When the object changes, we change the slide to the prper index
    $ionicSlideBoxDelegate.slide($scope.ui.index);
  });


})

{% endhighlight %}

## Presentor vs Audience

Last step is to make sure only the presentor is able to control the flow. We can get away with this functionality in many different ways.

A simple solution might be an extra parameter. For example: the audience might get the following url in their calendar: http://mypresentation.io/slides but the presentor might use http://mypresentation.io/slides/presentor

With that extra parameter in place we could create a boolean in our scope and then show/hide the buttons accordingly.

{% highlight javascript %}

.controller('slidesCtrl', function ($scope, $ionicSlideBoxDelegate, $firebase, $stateParams) {

  $scope.presentor = $stateParams.presentor !== undefined

{% endhighlight %}

And then in our html

{% highlight markup %}

<ion-slide ng-controller="slidesCtrl">
    <h1>Slide Index: {{ui.index}}</h1>
    <button ng-click="nextSlide()" ng-show="presentor">Next</button>
</ion-slide>

{% endhighlight %}

{% include plunker.html id="cg7YZ3HVFnbZVc7Wyl9r" %}

To see the full example: http://embed.plnkr.co/cg7YZ3HVFnbZVc7Wyl9r/preview
It has been hardcoded to the presentor's role.

So if you open it in two different browsers, you will be able to control the flow from any instance.

This is the end of the prototype. Next steps involve: creating a small project with proper testing, anything we could extract into a bower component to be resusable?, deploy it, etc... More to come on future deliveries. Stay tuned!
