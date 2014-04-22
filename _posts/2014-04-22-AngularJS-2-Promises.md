---
layout: post
title: AngularJS 2.0 Promises
author: Bluescreen
categories: [angularjs-2]
---

On our first [post][1] about AngularJS 2.0, we received about what promises framework would be used for the second edition of the superheroic framework.

At that time Promises was not part of the ES6 spec and it wasn't clear how generators - a not too distant concept - would play with AngularJS. Since then a lot has changed and we want to share that with you.

Last January Promises were incorporated in the ES6 official spec. This means that browsers implementing ES6 are likely to build native promises. While there are benefits having the browser provide a native Promise API, there are also downsides.

One of the downsides that affects AngularJS 2 is testability. When you have natively implemented control flow mechanisms, it becomes increasingly hard to hijack the process in a test environment. For instance you want to force a promise to call the reject handler without executing the resolver. The Angular team has been documenting some of those challenges in the [Promises Deign Document][2].

For the reason previously explained the team decided to create a wrapper library called "ngDeferred" that on runtime uses the native Promise API described in the ES6 spec. But when running in a test environment it can be replaced with a mocked version with the same API and different behavior.

[1]: http://ng-learn.org/2014/01/AngularJS-2/
[2]: https://docs.google.com/document/d/1ksBjyCgwuiEUGn9h2NYQGtmQkP5N9HbehMBgaxMtwfs/edit