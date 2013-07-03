---
layout: post
title: Ordering a set of results +/- more option, iterating over an array
categories: [sorting]
---

In the following example, we will once again provide the user with a set of options to order our results set. In this case, our order criteria options are sourced in an array. Depending on your use case, you may find the array fashion more practical than the object style. You should learn both.

<pre class="prettyprint linenums">
  <div>
    <h3>Order By:</h3>
    <select data-ng-model='selectedSortOrder3'
           data-ng-options="option.value as option.name for option in [{'value':'+name','name':'Name: A-Z'},{'value':'-name','name':'Name: Z-A'}, {'value':'+lastName','name':'Last Name: A-Z'}, {'value':'-lastName','name':'Last Name: Z-A'}, {'value':'+age','name':'Age: Young to Experienced'}, {'value':'-age','name':'Age: Experienced to Young'}]" 
           data-ng-init="selectedSortOrder3='+age'">
    </select>  
 </div>
 <div>
   <h3>List of results:</h3>
   <div ng-repeat="person in results | orderBy:selectedSortOrder3">
     {{person.name}} {{person.lastName}} - {{person.age}}
   </div>
 </div>
</pre>

_Note_: In order to iterate over this array, Angular provides us with a dsl expression we can use in the ng-options. In this case it will be 'option.value as option.name for option in in optionsSet'. There are other available expressions:
*  label for value in array
*  select as label for value in array
*  label group by group for value in array
*  select as label group by group for value in array

Useful links: [AngularJS Docs: select][1]

[1]: http://docs.angularjs.org/api/ng.directive:select
