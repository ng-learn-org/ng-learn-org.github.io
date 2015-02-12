AngularJS provides dependency injection out of the box. This makes it really easy to have our controller get an instance of our single service instance, or to a directive to get the same service.

### Classic Approach (pseudo code):

MyService: function($http)

  return {
     retrieveData: function()
	$http.get(url)
  }


MyController: function($scope, MyService)

     MyService.retrieveData().then(function(resp){
        scope.info = resp.data
     })


myApp.html

  <div ng-controller=“my-controller”>
     <div>{{info}}</div>
  </div>


### Component Oriented Approach

MyService: function($http)

  return {
     retrieveData: function()
	$http.get(url)
  }

MyDirective: function(MyService)
  return {
     template: “<div>{{info}}</div>”,
     restrict: ‘E’,
     scope: {},
     link: function(scope){
        MyService.retrieveData().then(function(resp){
           scope.info = resp.data
        })
     }
  }

If you would like to go into more details on this second approach please take a look at our previous article:

Now lets look at Polymer. Polymer’s pattern is to encapsulate the ‘service’ into a custom element itself.
Im going to abstract the implementation and jump to its usage:

  <data-api info={{info}}/>
  <my-info info={{info}}></my-info>

We create a component that performs the http calls and exposes the result as ‘data’. It is not intuitive but you get easily used to its simplicity!
Then we use bindings capabilities to pass the info model into my-info component whose single responsibility is to render the data.

So do we have something similar in Angular? Yes?No?May be?
The component oriented approach leveraged by cache is my default option but I was wondering if I could use directives composition to achieve the same pattern.
The short answer is ‘sort of’. Let’s see

http://plnkr.co/edit/wD7WB3uwW0y68kVzqEp5

So we want a component to render today’s temperature in a city the user enters.

      <input name="city" id="city" ng-model="city"/>
      <weather-temp city="{{city}}"></weather-temp>

Our component needs the city’s name as a paremater. Two binding to the rescue. Done. What’s next?
So who is going to fetch for the data then? how do we plug our api?

      <weather-temp weather-api city="{{city}}"></weather-temp>

Angular allows communication between directives. One directive can expose an API using the controller.

So lets create our api directive/component. Our API could be represented by a directive executing any http calls.

var weather = angular.module('weatherWidgets', []);

weather.directive('weatherApi', function($http){
  return {
    restrict: 'A',
    controller: function($scope){
      this.retrieveTemp = function(city){
        if(city.length > 3) {
          return $http({method:"JSONP", url: "http://api.openweathermap.org/data/2.5/weather?q="+ city + ",uk&callback=JSON_CALLBACK"});
        }
      }
    }
  }
})

This looks a little but out of place to me. Http calls belong to services. Lets consider this tech debt and park this for a minute.

So now we have a directive/component that represents our api. we can reuse it as many times as we need in multiple pages, apps, etc. So lets use it!

So now we create a directive/component with only one responsibility: render temperature data.


weather.directive('weatherTemp', function(){
  return {
    require: '^weatherApi',
    scope: {
      city: '@'
    },
    template: "<div ng-show='temp'>This is the min temp: {{temp.min}} and this is the max temp: {{temp.max}}",
    link: function(scope, element, attrs, weatherApiCtrl){
      scope.$watch('city', function(){
        weatherApiCtrl.retrieveTemp(scope.city).then(function(resp){
          scope.temp = {
            min: resp.data.main.temp_min,
            max: resp.data.main.temp_max
          }
        });
      })
    }
  }
})


As you can observe, we required the weatherApi. If you use the temp directive without weatherApi an error will come up on the console.
Then in our link function we obtain the weatherApiCtrl and we can use any of its public functions.

Here is a small example using two components calling the same api.

  <body ng-app="myApp" ng-init="city=''">
      Search for the weather and temp in any UK city:
      <div>
        <label for="city">City</label>
        <input name="city" id="city" ng-model="city"/>
      </div>
      <div>
        <weather-temp weather-api city="{{city}}"></weather-temp>
        <weather-desc weather-api city="{{city}}"></weather-desc>
      </div>
  </body>

Here is the code for the second component whose single responsibility is represent a different segment of data.

weather.directive('weatherDesc', function(){
  return {
    require: '^weatherApi',
    scope: {
      city: '@'
    },
    template: "<div ng-show='description'>Today we have {{description}}</div>",
    link: function(scope, element, attrs, weatherApiCtrl){
      scope.$watch('city', function(){
        weatherApiCtrl.retrieveTemp(scope.city).then(function(resp){
          scope.description = resp.data.weather[0].description
        });
      })
    }
  }
})

Example:  http://plnkr.co/edit/wD7WB3uwW0y68kVzqEp5

Have we generated less code? No
Have we created more encapsulation? No
Have we generated cleaner code? No
Have we added value? Not really
Is it better than previously discussed ‘Component Oriented Approach’? Not really
Is it worse? I would not call it worse but it adds a complexity that we did not need. In previous approach Angular’s dependency injection was solving this problem for us.
Is it better than the classic approach? Mmm…you got me here…let me put this way. I would do my best effort to do the ‘Component Oriented Approach’

I know what you are thinking…same amount of code or more, not cleaner, no added value….then why would you even consider writing this post?
Simple answer…I was curious!










