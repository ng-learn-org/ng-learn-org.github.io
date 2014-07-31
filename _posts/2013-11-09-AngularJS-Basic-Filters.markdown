---
layout: post
title: AngularJS - Basic Filters
author: Santiago Esteva
categories: [filtering, beginner]
---

One of the features that makes AngularJS standout is the ability to bind the model with the views without having to write controller code to connect things together. More over it keeps them in sync, so for example, if the view either the view or the model are updated it refreshes the other automatically

As an example, consider the following snippet of code consisting of two input fields for filtering first and last names, and a list of results.

{% highlight markup %}
<div>
    <h2>Filters:</h2>
    Name: <input type="text" ng-model="filters.name"/>
    Last Name: <input type="text" ng-model="filters.lastName"/>
</div>
<div>
    <h2>List of results:</h2>
    <div ng-repeat="person in results | filter:filters">
        {% raw %} {{person.name}} {{person.lastName}} {% endraw %}
    </div>
</div>
{% endhighlight %}

In this case, we have combined all our input fields in a single model object called `filters`. Moving on, we have a `repeat` section in which we applied the filters to a list called `results`. Angular will look into each object we iterate over, check if the object has `name` and `lastName` attributes and if it has them, it will compare their values to `filters.name` and `filters.lastName`, finally if they match they will be included in the resulting collection. All the magic happens on the html code, without a single line of Javascript.


For more information go to the AngularJS [documentation][1] on filters

{% include plunker.html id="0xgNmw" %}

[1]: http://docs.angularjs.org/api/ng.filter:filter