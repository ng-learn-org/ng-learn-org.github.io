---
layout: post
title: Dealing with IE family
author: Santiago Esteva
categories: [browser-support]
---

Christmas really got us thinking about essential things in life, such as family.
Talking about families, there is one controversial family we usually deal with while developing with modern Javascript frameworks: the IE family.
Supporting multiple browser is a challenging task for all teams but supporting a modern super cool framework such as AngularJS in IE7 can easily become the kryptonite for your super team.

Fortunately the majority of projects using Angular do not support IE7/IE8 since that user base is insignificant.
Unfortunately, the corporate world is still hooked into some old and new web application that must work in IE7 upwards.

### Lets define Support

The browser industry moves way too fast. We need to define boundaries and goals to provide a testing framework.

Browsers | Look and Feel | Functional | Accessibility  | Notes
:------: | :-----------: | :--------: | :------------: | :---:
 Modern  | 100%          | 100%       | 100%           | Full Support
 Legacy  | 75%           | 90%        | 50%            | Minor functional/css tricks missing features.
 Dated   | 25%           | 50%        | 50%            | Making sure user is able to fulfill main goal.

#### Modern Browsers

- IE 10
- Chrome 3x
- Safari 6
- Firefox 24

#### Legacy Browsers

- IE 9
- IE 8
- Chrome 29
- Safari 29

#### Dated Browsers

- IE 7
- Firefox 10

**Note:** As the industry moves forward we need to keep up and update or support chart and strategy.

### AngularJS IE Family Support

Current version 1.2.7 still supports IE8 and above. This means the continuous integration server runs all tests against IE8 and the team accepts and will attempt to fix related bugs.

Angular team has already announced they are ready to drop IE8 support. It has not happened yet but it has coming really soon.

[Angular docs][1] hold a whole section on IE support. It contains a short and a long version on what steps should be followed to support legacy and dated IE versions.

### Cross-Browser Testing
Regression testing is nothing but full or partial selection of already executed test cases which are re-executed to ensure existing functionalities work fine.

As part of our Continuous Integration chain, we perform a regression test suite to provide functional validation in multiple browser and platforms following our Browser Support Tiers Definition.
This means we execute our functional tests on IE10, Chrome 3x, Safari 6, Firefox 24, IE9, IE8, IE7 and FF 10.

This regression suite may rely on a self hosted testing lab or a remote testing design through a distributed testing environment.
This distributed environment may be provided by a third party service.
Cloud-based testing platform allows developers to automatically or interactively test mobile and web applications on more than 150 browsers / OS combinations including iOS, Android & Mac OS X.

### Supporting IE 7

If you only need to support IE8 onwards, follow [Angular\'s guide][1] and you should be fine.

1- Polyfills

    <!--[if lt IE 9]>
      <script src="../../components/es5-shim/es5-shim.js"></script>
      <script src="../../components/json2/json2.js"></script>
    <![endif]-->


**Note:** While working with IE7, our results page would crash while trying to parse a medium/large json object. After a couple of head-against-wall days, we replaced JSON3 polyfill for JSON2.
The performance increased right away and our results were successfully displayed.

2- Application declaration

    {% highlight markup %}
    <body id="ng-app" data-ng-app="siteApp">
    {% endhighlight %}

3- Do not use custom tags. Use attributes instead always prefixed with \'data\' or \'x\'

    {% highlight markup %}
    <div ng-view>
    {% endhighlight %}

4- Ajax Caching: IE caches the XHR requests. In order to avoid this, we set an HTTP response header to mimic default behaviors of moderns browsers.

    {% highlight coffeescript %}
    angular.module("siteApp").config ($httpProvider) ->
      $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache'
    {% endhighlight %}

5- By adding $compileProvider.urlSanitizationWhitelist(/#/); we avoid getting href to be formed as unsafe in older browsers

    {% highlight coffeescript %}
    angular.module("siteApp").config ($locationProvider, $routeProvider, $compileProvider) ->
      $compileProvider.urlSanitizationWhitelist /#/
      $locationProvider.html5Mode false
    {% endhighlight %}

6- Angular is not able to handle radio buttons properly on IE7. That is why a directive should be used to set values.

    {% highlight coffeescript %}
    angular.module("ie7RadioButtonDirective", [])
    .directive "radioValue", ->
      require: "ngModel"
      restrict: "A"
      link: (scope, el, attr, controller) ->
        setTimeout ->
          unless attr.value is attr.radioValue
            # Enforce value
            attr.value = attr.radioValue
            controller.$render()
    {% endhighlight %}

Html Example:


    {% highlight markup %}
    <form role="form">
        <fieldset>
          <legend class="ada-hide">Show matrix in</legend>
          <input type="radio" name="matrix-view_type" value="points" data-ng-model="matrix.view_type" data-radio-value="points"/>
          <label for="points_matrix">Points</label>
          <input type="radio" name="matrix-view_type" value="dollars" data-ng-model="matrix.view_type" data-radio-value="dollars"/>
          <label for="dollars_matrix">Dollars</label>
        </fieldset>
    </form>
    {% endhighlight %}

7- IE7 does not bind labels and inputs by the **for** attribute when those value are dynamically generated and inside a loop.
There seems to be an issue on the behavior of ng-repeat on IE7.

In order to fix this and make all the browser to work on a consistent manner we have created the directive **bind-input** that set those values after the page is compiled.

    {% highlight coffeescript %}
    angular.module("checkboxBindingDirective", []).directive "bindInput", ->
      restrict: "A"
      link: (scope, element, attrs) ->
        $(element).attr("for", attrs.bindInput.replace(' ', '_'))
        $(element).children("input").attr("id", attrs.bindInput.replace(' ', '_'))
    {% endhighlight %}

To use it just do something like this:

    {% highlight markup %}
       <ul>
         <li ng-repeat="item in items">
            <label bind-input="{{item.id}}">
              <input type='checkbox' />
            A Label</label>
         </li>
       </ul>
    {% endhighlight %}

That will be compile and transform into something like:

    {% highlight markup %}
        <ul>
          <li>
             <label for="item0">A Label</label>
             <input type="checkbox" id="item0">
          </li>
          ....
       </ul>
    {% endhighlight %}






[1]: http://docs.angularjs.org/guide/ie

