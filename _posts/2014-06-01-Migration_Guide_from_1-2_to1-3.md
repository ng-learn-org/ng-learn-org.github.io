---
layout: post
title: AngularJS Migration Guide 1.2 to 1.3
author: Santiago Esteva
categories: [tips, angularjs-2]
---

AngularJS 1.2 branch seems to have slowed down as expected and announced.
AngularJS 1.3 has become the main focus to transform AngularJS core into AngularJS 2.0.
This is a beginning of a draft to create a Migration guide.

We usually publish when AngularJS team published a stable (non dev) version.
Last version that came out was [1.2.16][1] April 3rd.

While we are waiting for the next big stable release, the beta branch 1.3.0 has been growing at a significant pace.

I was considering moving my current small time project to the latest build version.
As I was doing the corresponding analysis I figured I should have found a guide that illustrates migration from 1.2 to 1.3.
AngularJS docs provide an excellent [Migrating from 1.0 to 1.2][3] .
It is a matter of time till they actually construct one.

So I thought it would be useful to do a recap on major and breaking changes so far occurred. There are some very interesting changes such the lazy one-time binding, strict-DI, ngModelOptions, $watchGroup, ngMessages and some more.
Bug fixes and performance improvements are not mentioned but it is worth to mention a change on scope getting ~10x speedup from sharing the child scope class.


## Features

- **Browsers:** IE8 is no longer supported (yes, it is a feature since it unblocks the usage of modern implementations )
- **input:**
    - types date, time, datetime-local, month, week now always require a Date object as model
    - support types date, time, datetime-local, month, week
- **$http:** add xhr statusText to completeRequest callback
- **$resource:** Make stripping of trailing slashes configurable.
- **Scope:** add $watchGroup method for observing a set of expressions
- **injector:** "strict-DI" mode which disables "automatic" function annotation
- **ngModelOptions:** custom triggers and debounce of ngModel updates
- **$compile:** allow SVG and MathML templates via special type property
- **FormController:** commit $viewValue of all child controls when form is submitted
- **NgMessages:** introduce the NgMessages module and directives
- **ngTouch:** add optional ngSwipeDisableMouse attribute to ngSwipe directives to ignore mouse events.
- **$interpolate:**
    - escaped interpolation expressions
    - add optional allOrNothing param
- \{\{ bindings \}\} : lazy one-time binding support
- **ngMock:**
    - $httpBackend: added support for function as URL matcher
    - add support of mocha tdd interface

## Breaking changes

- **build:** IE8 is no longer supported.
- **input:** types date, time, datetime-local, month, week now always require a Date object as model
- **$compile:**
    - calling attr.$observe no longer returns the observer function, but a deregistration function instead.
    - the replace flag for defining directives that replace the element that they are on will be removed in the next major angular version. With Web Components it is normal to have custom elements in the DOM.
- **$httpBackend:** the JSONP behavior for erroneous and empty responses changed: Previously, a JSONP response was regarded as erroneous if it was empty. Now Angular is listening to the correct events to detect errors, i.e. even empty responses can be successful.
- **$animate:**
    - Any class-based animation code that makes use of transitions and uses the setup CSS classes must now provide a empty transition value to ensure that its styling is applied right away.
    - $animate will no longer default the after parameter to the last element of the parent container. Instead, when after is not specified, the new element will be inserted as the first child of the parent container.
- **$interpolate:** the function returned by $interpolate no longer has a .parts array set on it
- **$http:** interceptors API changed -> https://docs.angularjs.org/api/ng/service/$http#interceptors
- **injector:** provider registration always occurs prior to configuration for a given module, and therefore config blocks are not able to have any control over a providers registration. This is no longer possible within a single module.
- **jqLite:** jQuery detach() method does not trigger the $destroy event. If you want to destroy Angular data attached to the element, use remove().
- **$parse:** promise unwrapping has been removed. It has been deprecated since 1.2.0-rc.3. It can no longer be turned on.
- **Scope:**  $broadcast and $emit will now reset the currentScope property of the event to null once the event finished propagating. If any code depends on asynchronously accessing their currentScope property, it should be migrated to use targetScope instead.

If you would like to analyze or read these changes in more detail, please refer to the [changelog][2].


[1]:http://ng-learn.org/2014/04/AngularJS-1-2-16/
[2]:https://github.com/angular/angular.js/blob/master/CHANGELOG.md
[3]:https://docs.angularjs.org/guide/migration