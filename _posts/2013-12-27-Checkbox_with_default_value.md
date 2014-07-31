---
layout: post
title: AngularJS - Checkbox with default value
author: Santiago Esteva
categories: [beginner]
---

In the following example, we set the values for our checkbox using ng-checked. The default values are set using ng-init; the same result is accomplished by initializing the value in the controller. When the user marks the checkbox as checked, we use the ng-click to change the value from true to false, or vice versa.

{% highlight markup %}
<div ng-init="options={};options.one.selected=true">
    <input id="option_1" type="checkbox" 
        ng-click="options.one.selected=!options.one.selected"
        ng-checked="options.one.selected"
        ng-model="options.one.selected"/>
    <label for="option_1" >Option 1</label>
</div>
{% endhighlight %}

_Note_: ng-checked expects an expression.

For more information go to the [AngularJS documentation][1]

{% include plunker.html id="6mEwqX" %}

[1]: http://docs.angularjs.org/api/ng.directive:ngChecked