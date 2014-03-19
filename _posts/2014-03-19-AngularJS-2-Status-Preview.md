---
layout: post
title: AngularJS 2.0 Status and Preview
author: santiago Esteva
categories: [ng-conf, angularjs-2]
---

AngularJS team has been busy working on AngularJS 2.0. As we mentioned [before][1], this is not a complex major update; this is a whole rewrite!
Having learnt many lessons from AngularJS and AngularDart a lot of thinking is being done to produce the future core and its ecosystem.
We will walk you through what you need to know to stay up to date.

## Table of Contents
* This will become a table of contents (this text will be scraped).
{:toc}

## What is AngularJS 2.0 all about?

The team has opted to document each module into an architecture design document.
These documents have been available to the community since the beginning. This is turned into warly feedback for the team
and a rare and excellent opportunity for the community to participate and better understand a framework from its roots.

Just when I was about to publish this article Brad Green (AngularJS manager) published an article on angularjs blog providing
insight on what was being done and which goals were in mind. Great minds think alike? He is tall, blonde, brilliant and work at google surrounded by master minds. Im....not.

Brad does an excellent job expressing the key areas the team is working on. These are the main concepts I gathered: Mobile First, Loosely Couple Modules, Simplicity, Metadata and Performance.
If you haven't already you should read the <a href="http://blog.angularjs.org/" target="_blank">blog</a>.

I will briefly review these cross cutting subjects and then I will try to summarize all different efforts the team has queued for AngularJS 2.0.

- ** Mobile First: ** At the ng-conf the team expressed they would go for mobile but I guess we never thought that would mean focus all efforts to get mobile right and then work up to desktops.
I think this is a bold and brilliant approach. For the last 3 years this has been the recommended approach we have either received or given when building an application that needs to live in mobile and desktop platforms.
If you do it right on mobile, if you tackle loading times, performance and other mobile challenges first, then desktop becomes a much easier task.

- ** Loosely Couple Modules: ** This one comes without surprises. Angular Team has been deattaching modules from its core for several versions now.

  At the same time, the community started to offer some very interesting modules such as ui router and restangular which have worked as
  options for some core angular modules.

  Both the angular team and the community have succesfully built a module ecosystem that keeps growing.
  <a href="http://ngmodules.org/" target="_blank">www.ngmodules.org</a> holds a list of 529 modules. Im sure this does not represent half of the ones that exist out there.
  As a community we need to better publicize this index.

  In addition, smaller libraries or modules combined with lazy loading generates a boost on performance.

- ** Simplicity / MetaData: ** One of the goals for Angular 2.0 is allow developers to concentrate on the lines of code related to
their business domain. The next version will better hide angular frame. Annotations and ES6 provides the tools and standards to make this possible.

  The team has also embraced feedback coming from a community who found directives syntax to have a rather long learning curve.
  A much simple dsl for directives is on the works.

## What are the challenges?

Change Detection, Dependency Injection, Templating, Persistance, Routing, Logging, Annotations, Documentation,
Benchmarking, Touch/Animations, Package Repository, Reference App, Scaffolding and Build/Deploy.

These are the many facets the team is working on. Almost every topic deserves a project of its own.

Some of the design documents have already received enough feedback for the team to produce a first prototype/working version.

These are all moving targets and each deserve its own post to understand how each will work.
Here is a brief intro to each subject.

### Change Detection
The long term approach is to take advantage of Object.observe() implementation that comes available in browsers such as Chrome 35M.
We are currently in 33M.

    Object.observe() is a low-level API that lets you add a listener to be notified when a JavaScript object changes state.

If you want to know more abour this pattern, follow this <a href="http://updates.html5rocks.com/2012/11/Respond-to-change-with-Object-observe" target="_blank">link</a>
and this <a href="http://wiki.ecmascript.org/doku.php?id=harmony:observe" target="_blank">link</a>.

While we wait to the browser native change detection, the team has found a solution that is fast and more efficient than the current one available in AngularJS 1.2.

Watchtower.js is super-fast change detection library.
This is a javascript port of an already implemented algorithm in AngularDart.

    "Internally the change detection algorithm keeps track of fields to check as Record data structure. When reporting changes it returns a list of Records which have changes."

The design document goes over the change detection approach utilized for field, array and map.

If you would like to look at the source code, follow this link: <a href="https://github.com/angular/watchtower.js" target="_blank">watchtower.js</a>

In future posts we will analyze this in detail.
In the meantime, if you would like to read the design document, follow this link: <a href="https://docs.google.com/document/d/10W46qDNO8Dl0Uye3QX0oUDPYAwaPl0qNy73TVLjd1WI/edit#heading=h.qjnbvlr7uej1" target="_blank">Design Doc</a>

**Note:** during the ng-conf Brian talked about Zone.js as a candidate for dirty checking. <a href="https://github.com/angular/zone.js/blob/master/zone.js" target="_blank">zone.js</a>

### Dependency Injection
The design doc is already out-dated but it serves as background history for the current version.

The prototype has grown into a library and it is ready to be tested. Based on ES6 it attempts to provide less complex syntax, declarative annotations and lazy loading.

Take a look at the next code block. This is the Dependency Injection design pattern.
All the dependencies are simply passed in as constructor arguments.
Heater has no idea where these dependencies (electricity) are coming from.
Heater is not coupled to any particular environment.
You can re-use it in a different environment, which can be a different configuration of the same project, or a complete different project.


    {% highlight javascript %}
    import {Inject} from 'di/annotations';
    import {Electricity} from '../electricity';

    @Inject(Electricity)
    export class Heater {
      constructor(electricity) {
        this.electricity = electricity;
      }

      on() {
        console.log('Turning on the coffee heater...');
      }

      off() {
        console.log('Turning off the coffee heater...');
      }
    }
    {% endhighlight %}

And here we create a Fake/Mock implementation of the Heater.

    {% highlight javascript %}
    import {Provide} from 'di/annotations';
    import {Heater} from './coffee_maker/heater';

    @Provide(Heater)
    export class MockHeater {
      constructor() {}

      on() {
        console.log('Turning on the MOCK heater...');
      }

      off() {}
    }
    {% endhighlight %}

You may find all the ng-conf videos here: [http://ng-conf.ng-learn.org/][2] Look for dependency injection.

        {% highlight bash%}
        # Clone this repo (or your fork).
        git clone https://github.com/angular/di.js.git

        # Install all the the dev dependencies, such as Karma, Gulp, etc.
        npm install

        # If you wanna use "karma" or "gulp" commands, install also:
        npm install -g karma-cli
        npm install -g gulp

        # Transpile ES6 into ./compiled/*
        gulp build

        # Watch all the sources and transpile on any change
        gulp watch

        gulp build_examples
        gulp serve
        {% endhighlight %}

If you would like to look at the source code, follow this link: <a href="https://github.com/angular/di.js" target="_blank">di.js</a>

In future posts we will analyze this in detail. In the meantime, if you would like to read the design document, follow this
link: <a href="https://docs.google.com/document/d/1fTR4TcTGbmExa5w2SRNAkM1fsB9kYeOvfuiI99FgR24/edit#heading=h.2e8op9ntdrm0" target="_blank">Design Doc</a>

### Templating
The goals on this effort are to simplify the directive API, to use web standards, improve performance and provide opportunity to better tooling.

The team has analyzed other available frameworks trying to identify strength and weakness. This roman approach is laid out
in the design doc and it is of value for any web developer. There is a special doc for polymer. (<a href="https://docs.google.com/document/d/16O2Im1ekfdJ4FU8FBbVRYGjqsXjmcV3tYFg1vyfhYC8/edit#heading=h.j75blxt2a4j7" target="_blank">link</a>)

The team has a first example using ShadowDom and they are currently working on bindings.
Here is an indication on how a very simple directive could look like:

        {% highlight html %}
        <exp-hello></exp-hello>
        {% endhighlight %}

        {% highlight javascript %}
        @ComponentDirective({
          selector: 'exp-hello',
          template: 'Hello world!'
        })
        {% endhighlight %}

If you would like to look at the source code, follow this <a href="https://github.com/angular/templating" target="_blank">link</a>

And here is candidate usage of one way binding.

        {% highlight html %}
        {% raw %} {{:foo}} {% endraw %}
        {% endhighlight %}


In future posts we will analyze this in detail. In the meantime, if you would like to read the design document,
follow this <a href="https://docs.google.com/document/d/1f5VWROeTI2kJwVKbNsrHuEz5IqtZe14OpoxM9fEYJNU/edit#" target="_blank">link</a>

#### What is ShadowDOM?

    Shadow DOM is designed to provide encapsulation by hiding DOM subtrees under shadow roots.
    It provides a method of establishing and maintaining functional boundaries between DOM trees and
    how these trees interact with each other within a document, thus enabling better functional encapsulation
    within the DOM.

If you would like to understand shadowDom, please follow these links:

- <a href="http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/" target="_blank">Html5rocks - ShadowDOM</a>

- <a href="http://www.polymer-project.org/platform/shadow-dom.html" target="_blank">Polymer - ShadowDOM</a>

If you would like to know more about web components and polymer, follow this <a href="http://updates.html5rocks.com/2014/01/Yo-Polymer-A-Whirlwind-Tour-Of-Web-Component-Tooling" target="_blank">link</a> into a brief write-up Addy Osmani does.

You will rapidly notice how much in common Web Components Standards - which includes ShadowDOM - share with AngularJS directives.

### Persistance
This is still being documented, commented and reviewed.

There is a lot of thought and consideration being done on storage quotas on different browsers (desktop	 and mobile), promises, performance, etc.

We will start hearing about rewritten and new modules such as ngHTTP, ngWebSocket, ngStore, ngOffline and ngData.

I believe this topic is going to become a great adventure for this team. There is so much ground to cover and so many performance boundaries.

In future posts we will analyze this in detail. In the meantime,
if you would like to read the design document, follow this <a href="https://docs.google.com/document/d/1DMacL7iwjSMPP0ytZfugpU4v0PWUK0BT6lhyaVEmlBQ/edit" target="_blank">link</a>

### Routing
This is still being documented, commented and reviewed. The team is looking at Ember.js, Durandal (framework built on top of jQuery, Knockout and RequireJS) and  Passport (middleware for Express) for reference on other approaches.

The goal is to cover proven requirements such as multiple, nested, sibilings, state based views.

The new design holds the following parts:

- Url Resolver: <a href="https://github.com/btford/url-resolver.js" target="_blank">url-resolver.js</a>

- Location Service: very similiar to $location but independently packaged.

- Url Matcher

- Route Resolver

- Route Configuration: this is the api devs will deal with.

The team is also looking at user privilege control hooks.

In future posts we will analyze this in detail. In the meantime, if you would like to read the design document,
follow this <a href="https://docs.google.com/document/d/1I3UC0RrgCh9CKrLxeE4sxwmNSBl3oSXQGt9g3KZnTJI/edit#" target="_blank">link</a>

### Logging
This subject also came up at the ng-conf. The need of a library that would allow pluggable modules that help
logging a much meaningful stacktrace when working with an asynchronous event oriented language such as javascript.

If you would like to look at the source code, follow this <a href="https://github.com/angular/diary.js" target="_blank">diary.js</a>
In future posts we will analyze this in detail. In the meantime, if you would like to read the design document, follow this <a href="https://docs.google.com/document/d/1gGUEODxxDjY7azF8InqtN1pRcLo3WhGb8BcoIihyI80/edit" target="_blank">link</a>

### Annotations
As mentioned above, metadata is the approach the team has selected to reduce boilerplate and hide angularjs wireframe.

Declarative annotations provides wiring while keeping the readibility for developers to understand what is going on.

Example:

    {% highlight javascript %}
    @Provide(Heater)
    export class MockHeater {
      constructor() {}

      on() {
        console.log('Turning on the MOCK heater...');
      }

      off() {}
    }
    {% endhighlight %}

In future posts we will analyze this in detail. In the meantime,
if you would like to read the design document, follow this <a href="https://docs.google.com/document/d/1u2cBiLV2aCXnAwXJOPghtxWoikH9hY6enUI1AE4k4cw/edit" target="_blank">link</a>  and this <a href="https://docs.google.com/document/d/1uhs-a41dp2z0NLs-QiXYY-rqLGhgjmTf4iwBad2myzY/edit#heading=h.mp4ukbw5r5y9" target="_blank">link</a>

### Documentation
Here is some code to look at <a href="https://github.com/angular/dgeni" target="_blank">here</a>

### Benchmarking
There are tools out there to evaluate performance on Javascript. benchmark.js, jsperf.com, octane, kraken, robohornet, etc.

The team is trying to leverage karma unit tests and make benchmarking easy to test and easy to run; making sure the results answers one question: "Is this code fast enough?".

- Demo: <a href="http://jbdeboer.github.io/todobenchmark/?show" target="_blank">link</a>

- Source Code: <a href="https://github.com/angular/benchpress" target="_blank">link</a>

In future posts we will analyze this in detail. In the meantime, if you would like to read the design document,
follow this <a href="https://docs.google.com/document/d/1pHMbpInJtiMF2zp4AZaW2jYSkVvNQZLLYrqXhJRi2T8/edit" target="_blank">link</a>

### Touch/Animations
Team is working on touch devices use cases making emphasis on performance.
The main goal is to create a module that implements usage patterns using native browsers features aiming at performance (goal is 60+ FPS).

So far the documentation is still in progress. No code has been published so far.

If you would like to read the design document, follow this <a href="https://docs.google.com/document/d/16Z6Lun15DoWNrE2imk7N-2WiRAaqc954LOfU2-2JSoI/edit#" target="_blank">link</a>

### Package Repository
This subject is more of an infrastructure / distribution concern on how each module (core, complimentary or third party) are being
packaged and delivered.

The document presents a great analysis on the different available options.

In future posts we might analyze this in detail. In the meantime, if you would like to read the design document,
follow this <a href="https://docs.google.com/document/d/14t1u5bjJV0TDJxNHhJnZe6Qu8Tn0muWytwjfuVPdAdY/edit#" target="_blank">link</a>

### Reference App
During the ng-conf the team announced they will build an AngularJS app.
This will serve as a reference on best practices for the community.
It will also serve the team presenting real challenged on building a large scale app.
So far this team has gained feedback from other teams at Google or from the community what are the challenges when building a large app with Angular.

There is no code or design doc available yet. There is a placeholder here: <a href="https://projects.angularjs.org/" target="_blank">https://projects.angularjs.org/</a>

In the meantime, you might find interesting a blog post the team did on AngularJS style guide <a href="http://blog.angularjs.org/2014/02/an-angularjs-style-guide-and-best.html" target="_blank">here</a>

During the ng-conf Google Double Click Team made different presentations talking about large scale apps built on AngularJS.
You may find all videos at <a href="http://ng-conf.ng-learn.org/" target="_blank">http://ng-conf.ng-learn.org/</a>

### Scaffolding
<a href="http://yeoman.io/" target="_blank">Yeoman</a>, <a href="http://lauterry.github.io/ngTailor/" target="_blank">ngTailor</a> are reference conventions set the team is analyzing.

No doc or code examples available yet. In the meantime, there is a published document attempting to gather
best recommendations to structure an application. Follow this <a href="https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub" target="_blank">link</a>.

### Build/Deploy
These are more internal topics. Nevertheless, my personal experience has been that we greatly benefit from looking at how this team has setup their CI chain. Hopefully we will gain more insight on these subjects as well.

### Notes

#### Where is Grunt?
As you may see from the different repos, Angular team is already working with <a href="http://gulpjs.com/" target="_blank">GulpJS</a>.

#### ES6 today
You may also have noticed the need to Transpile ES6 to ES5 in order to use the mentioned modules with a current browser.

Traceur is a JavaScript.next-to-JavaScript-of-today compiler that allows you to use features from the future today.
Traceur's goal is to inform the design of new JavaScript features which are only valuable if they allow you to write better code.
Traceur allows you to try out new and proposed language features today, helping you say what you mean in your code while informing the standards process.
<a href="https://github.com/google/traceur-compiler" target="_blank">Traceur</a>

Here is a great review of some of the ES6 language features you can try with Traceur today! <a href="https://github.com/google/traceur-compiler/wiki/LanguageFeatures" target="_blank">Language Features</a>



[1]:http://ng-learn.org/2014/01/AngularJS-2/
[2]:http://ng-conf.ng-learn.org/
