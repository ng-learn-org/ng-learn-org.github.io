---
layout: post
title: Die Controllers Die!
author: Santiago Esteva
categories: [directives]
---

How about creating applications without controllers? is MVC always the best design?
How about writing independent modular features?

When you start learning angularJS you go over the docs and tutorials. This is a perfect sandbox.
You are just learning so there are really no complexities and you dont have to worry about what happens when your application gets massive.
If you are actually coding a small site, then you are safe, you may stick to MVC and everything will be fine. You can stop reading now...go have a beer and enjoy life! you lucky!

On the contrary, if your application gets massive, if your team gets bigger than 3, if your team is split between remote locations, if those locations dont share the same timezone....
well you get the idea...if life is not that easy, then lets start looking at some options.


### My personal experience

When I started to learn angularJS everything was easy. A view had a controller, the controller called a service that contacted my backend API.
The controller got the data applied small transformations and delivered a beautiful model to my view to play with.
After one or two months into the project I found myself talking to somebody form another company about angularjS. they were doing a 'directives only' approach.
I failed to see the importance of what they were talking about at that time.

So we kept working and more interesting scenario came up. When a second view was needed and some the contents inside the first view were needed, our options to reuse where to extract into its own template and ng-include.
This was a messy option as you start loosing context on who is providing the model, you need to make sure both contexts are using the same model structure and naming.
And this is how we got directives. We started encapsulating small features into directives. A not very simple or friendly API but with hard work you eventually get it.
Now we were able to share isolated, encapsulated, reusable components across the page.

Kudos to us! Was the problem solved? Almost...Everytime we reused our component in a new view, we needed to make sure the utilized controller
did its work to provide all the parts that our component was expecting. We could not reuse the controllers since the view has a different goal and features.
So developers started copy pasting small transformations snippets from one controller to another. And so we were back in problems. Now if one of those snippets needed to change we needed to change it everywhere.

A quick solution was to extract our logic into a service. Basically get a single instance of a utility object that we could inject into multiple controllers and have them delegate the transformation.
Was the problem solved now? Not really, our controllers were talking to one service for data and then another service for transformations but there was not easy way to know what transformations needed to be done.
There was some manual coding on what transformations should happen in each controller depending on each view.

### How do we solve the problem then?

Here is my take on this problem. Hopefully many others will comment and share feedback and even better options.
I used to say controllers should be 10-15 lines long. Basically call service to fetch data, do transformation, done!
I now say 'DIE controllers DIE'. If I have a team of 9 developers and I assign each one of them a story,
my best scenario is they can run with it without overlapping, without dependencies. This might be utopic to get it every time but if we aim at 100 may be get 90!

I say each developer should create one or more directives to solve the problem the story defines.
Each directive should be independent, isolated, and it should only have one reason to change. I think it is easy to think abut features and business logic inside a directive.
I people have problems isolating, encapsulating when they start thinking about how will the model get to the directive.
If the directive needs data, then it should call the service responsible for contacting the backend API.

Are your eyes rolling now? Are your hands around your head? Well, they should be! If you simply apply
what I've just said then you get multiple http requests fetching the same data on the very same view. Not good! Bad developer! Bad!
Think about expedia or orbitz trying and the results page. A directive representing the list of hotels, another representing filters, another representing sorters, etc.
Each module will hit the same API and then only work on different parts of the same results set.

So how do we fix this? Angular provides you with a simple way to cache results. YEAH!!! Go Angular!
And it even provides a way to provide a custom cache factory if you want to override the way it behaves. Go Angular!!!
But....the api does not provide an elegant way of cleaning the cache.

I created a small prototype. You can check it out at [my github repo][3]

{% highlight markup %}

<div class="jumbotron">
  <my-menu></my-menu>
</div>
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-8">
    <my-coordinates></my-coordinates>
  </div>
  <div class="col-xs-6 col-md-4">
    <my-description></my-description>
  </div>
</div>

{% endhighlight %}

All directives talk to the same service. It does not matter which gets first.
The service will perform the http call for the first requestor and then cache the response
so the consequent requestors get that response really quick.

{% highlight javascript %}

angular.module('projectApp')
  .directive('myDescription', function (myWeatherService) {
    return {
      templateUrl: 'scripts/mydescription/mydescription.html',
      restrict: 'E',
      scope:{},
      link: function postLink(scope, element, attrs) {

          scope.description ={
              data: {},
              city: 'dallas,us'
          }

          scope.getData = function(city, fresh){
              myWeatherService.retrieveWeather(city, fresh).then(function(response){
                  scope.description.data = response.weather[0].description;
              });
          }

          // default query
          // It may  be the first one or may be getting from angular's cache
          scope.getData(scope.description.city);

      }
    };
  });

{% endhighlight %}

When the cache is enabled, $http stores the response from the server in the specified cache.
The next time the same request is made, the response is served from the cache without sending a
request to the server.

Note that even if the response is served from cache, delivery of the data is asynchronous in the same way that real requests are.

If there are multiple GET requests for the same URL that should be cached using the same cache,
but the cache is not populated yet, only one request to the server will be made and the remaining requests will be fulfilled using
the response from the first request.

{% highlight javascript %}

angular.module('projectApp')
  .service('myWeatherService', function ($http, $q, $cacheFactory) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var queryWeatherUsingAngularCache = function(param, refresh){
            var deferred = $q.defer();
            console.log('querying');

            var config = {
                url: 'http://api.openweathermap.org/data/2.5/weather?q='+ param +'&callback=JSON_CALLBACK',
                method: 'JSONP',
                cache: true
            }

            // Remove cache if somebody wants to get a fresh data object
            if(refresh){
                console.log('refreshing : ' + refresh);
                $cacheFactory.get('$http').remove(config.url);
            }

            $http(config).then(function(response){
                deferred.resolve(response.data);
            })

            return deferred.promise;
        }

        return {
            retrieveWeather: queryWeatherUsingAngularCache
        }

  });

{% endhighlight %}

As you can see we have to remove the cache object manually. It is easy but it feels hacky.

### So what if I want to let the user refresh the data?  Nice catch!

Based on our approach this means that we have created a directive that provides a control, a menu feature for the user to apply such change.
Now we need to let every other component know that the user wants to refresh.

I created a menu component for this prototype.
I attached to the scope a function that takes two parameters, a city and fresh boolean.
If the user wants to force to get fresh data, we broadcast and event so if any component is interested can subscribe to.

{% highlight javascript %}

angular.module('projectApp')
  .directive('myMenu', function (myWeatherService, $rootScope) {
    return {

       [...other code...]

        scope.getData = function(city, fresh){
            // If we want to refresh, we shall tell all interested components
            if(fresh){
                scope.menu.city = city;
                $rootScope.$broadcast('menu:cityUpdate', {'city': city});
            }
            myWeatherService.retrieveWeather(city, fresh).then(function(response){
                scope.menu.data = response.name;
            });

        };

        [...other code...]


      }
    };
  });

{% endhighlight %}

Then in our components I can subscribe to such event and get data form the service.
As said before, one component will get there first producing fresh data to be cached and the rest will get the cached version.

{% highlight javascript %}

scope.$on('menu:cityUpdate', function(event, args){
  scope.getData(args.city);
})

{% endhighlight %}

This is just a simple way of cleaning the cache.

You may find a more complex scenario to solve with a different mechanism such as limit of time.

You may also want to provide your own cacheFactory.

You can read more about it at the [angularJS Docs][2] and here is an extract of the ng-book [we recommend:][1]


[1]:https://www.ng-book.com/p/Caching/
[2]:https://docs.angularjs.org/api/ng/service/$cacheFactory
[3]:https://github.com/sesteva/angular-communication-example

