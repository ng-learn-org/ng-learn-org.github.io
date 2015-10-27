---
layout: post
title: AngularJS - Draw a Select with default option
author: Santiago Esteva
categories: [beginner]
---

In the following example, we set a default option for our users to see. We could leave it blank but it would not help our user. We could also preselect one of our options as the default one but sometimes we do not want to influence or dictate our user's selection.

{% highlight html %}
<form name="myForm">
    <select ng-options="color for color in ['red', 'blue', 'yellow']" ng-model="color1">
        <option value="" selected>--Please select your color--</option>
    </select>
</form>
{% endhighlight %}

_Note_: it is important that our default option has value set to nothing.

For more information go to the [AngularJS "select" documentation][1] 

{% include plunker.html id="5DmMNz6ktViXN6yG1fzy" %}

[1]: http://docs.angularjs.org/api/ng.directive:select
