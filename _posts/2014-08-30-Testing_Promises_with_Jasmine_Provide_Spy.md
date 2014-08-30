---
layout: post
title: Testing Promises with Jasmine - Provide and Spy
author: Santiago Esteva
categories: [tips]
---

[Jasmine][1] provides a few more tools when dealing with promises. Consider the following controller: 

{% highlight javascript %}
angular.module("myApp.store").controller("StoresCtrl", function($scope, StoreService, Contact) {
  StoreService.listStores().then(function(branches) {
    Contact.retrieveContactInfo().then(function(userInfo) {});  
        //more code here crossing user and stores data
  });
});
{% endhighlight %}

Lets see how to test these two promises with the help of $provide to create fake implementations of our 
dependencies and jasmine's spies to fake results and be informed when a function was called.

Go through the code's comments to understand how to utilize these two concepts.


{% highlight javascript %}
describe("Store Controller", function() {
  var $controller, Contact, StoreService, createController, scope;
  
  beforeEach(function() {
    module('myApp.store');
    
    // Provide will help us create fake implementations for our dependencies
    module(function($provide) {
    
      // Fake StoreService Implementation returning a promise
      $provide.value('StoreService', {
        listStores: function() {
          return { 
            then: function(callback) {return callback([{ some: "thing", hoursInfo: {isOpen: true}}]);}
          };
        },
        chooseStore: function() { return null;}
      });
      
      // Fake Contact Implementation return an empty object 
      $provide.value('Contact', {
        retrieveContactInfo: function() {
          return {
            then: function(callback) { return callback({});}
          };
        }
      });
      
      return null;
    });
  });
  
  beforeEach(function() {
  
    // When Angular Injects the StoreService and Contact dependencies, it will use the implementation we provided above
    inject(function($controller, $rootScope, _StoreService_, _Contact_) {
      scope = $rootScope.$new();
      StoreService = _StoreService_;
      Contact = _Contact_;
      createController = function(params) {
        return $controller("StoresCtrl", {
          $scope: scope,
          $stateParams: params || {}
        });
      };
    });
  });
  
  it("should call the store service to retrieve the store list", function() {
    var user = { address: {street: 1}};
    
    // Jasmine spy over the listStores service. 
    // Since we provided a fake response already we can just call through. 
    spyOn(StoreService, 'listStores').and.callThrough();
    
    // Jasmine spy also allows to call Fake implementations via the callFake function 
    // or we can return our own response via 'and.returnValue
    // Here we can override the response we previously defined and return a promise with a user object
    spyOn(Contact, 'retrieveContactInfo').and.callFake(function() {
      return {
        then: function(callback) { return callback(user); }
      };
    });
    
    createController();
    // Since we setup a spy we can now expect that spied function to have been called 
    // or to have been called with certain parameters..etc
    expect(StoreService.listStores).toHaveBeenCalled();
  });
});

{% endhighlight %}

[1]: http://jasmine.github.io/