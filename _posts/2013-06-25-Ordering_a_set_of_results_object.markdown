---
layout: post
title: Ordering a set of results +/- more option, iterating over an object
author: Santiago
categories: [sorting]
---

In the following example, we take advantage of more angular magic. To each string representing the search criteria we will add a '+' or a '-' to indicate the reverse or not direction of our set order. 
As we get more advanced on our order criteria, we moved from a simple string to an object holding the key value map. 
Example: {'+name': 'Name: A-Z','-name': 'Name: Z-A'} 

{% highlight html %}
<div>
    <h3>Order By:</h3>
    <select data-ng-model='selectedSortOrder2'
        data-ng-options="k as v for (k,v) in {'+name': 'Name: A-Z','-name': 'Name: Z-A', '+lastName': 'Last Name: A-Z', '-lastName': 'Last Name: Z-A ', '+age': 'Age: Young to Experienced', '-age': 'Age: Experienced to Young' }"
        data-ng-init="selectedSortOrder2='+name'">
    </select>  
</div>

<div>
    <h3>List of results:</h3>
    <div ng-repeat="person in results | orderBy:selectedSortOrder2">
        {{person.name}} {{person.lastName}} - {{person.age}}
    </div>
</div>
{% endhighlight %}

_Note_: In order to iterate over this object, Angular provides us with a dsl expression we can use in the ng-options. In this case it will be 'k as v for (k,v) in optionsSet'. There are other available expressions:

*  label for (key , value) in object
*  select as label for (key , value) in object
*  label group by group for (key, value) in object
*  select as label group by group for (key, value) in object

For more information go to the [AngularJS "select" documentation][1] 

{% include plunker.html id="djei1a" %}

[1]: http://docs.angularjs.org/api/ng.directive:select