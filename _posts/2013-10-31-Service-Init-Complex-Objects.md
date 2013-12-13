---
layout: post
title: AngularJS - Services - Initializing Complex Objects
author: Santiago Esteva
categories: [resources, beginner]
---

Lets say we want to model the object we retrieved from our backend. We want to modify some data, concatenate other and we want to add some functions so we can call them on the fly at presentation layer. Lets assume our e-commerce site's backend just retrieved a saved shopping cart (a la amazon). It contains a saved shopping cart holding product with a title, description, quantity, price, taxes, fees, etc.

### Step by Step

1- Our Controller will be just a pass through. It will only call our service and make sure that the model we obtain we attach it to our scope so the presentation layer has access to it.

{% highlight javascript %}

angular.module("myApp").controller("myCtrl", ["$scope", "mySvc", function($scope, mySvc) {
    $scope.ui = {};
    $scope.ui.idealModel = mySvc.retrieveMyModel(1);
    $scope.ui.backEndModel = mySvc.retrieveBackendModel(1);
  }
]);

{% endhighlight %}

Notes: For debugging purposes we made an additional call to our svc so we can compare the unmodified model we got from our backend towards the one we constructed for our ui.

2- Our Service offers a small set of public methods - our API. Public function 'retrieveMyModel' calls by reference 'fetchModelFromBackendAndConstructIdealObject'.
A little bit hairy method name but it makes a point about what its responsibility is. We are faking the call to a backend service and we always return the same fakeModel. No massaging so far.

{% highlight javascript %}

angular.module("myApp").service("mySvc", [ function() {

    var fakeModel, fetchModelFromBackendAndConstructIdealObject;

    fakeModel = {
          id: 1,
          title: 'a title',
          description: 'a description',
          price: 12,
          tax: 2,
          vendorFees: 1,
          qty: 2
        };

    return {
          retrieveMyModel: fetchModelFromBackendAndConstructIdealObject
        };
      }
    ]);

{% endhighlight %}

3- Now we add a class with a constructor. This complex object 'UiExpectedModel' will serve as a blueprint to create a more suitable object with only the necessary data for the ui.
It will also contain some convenience methods that fall under the same domain and that will turn our Model smarter.

{% highlight javascript %}

angular.module("myApp").service("mySvc", [ function() {

    var UiExpectedModel, fakeModel, fetchModelFromBackendAndConstructIdealObject, getTaxAndFees, getTotalPrice;

    UiExpectedModel = (function() {

      function UiExpectedModel(backEndModel) {
        angular.extend(this, backEndModel);
        this.id = "" + backEndModel.id + "-abc";
        this.title = backEndModel.title.toUpperCase();
        this.totalPrice = getTotalPrice(backEndModel);
        this.taxAndFees = getTaxAndFees(backEndModel);

        this.getTotalSale = function() {
          return (this.price + this.tax + this.vendorFees) * this.qty;
        };

        this.addOne = function() {
          return this.qty++;
        };

        this.removeOne = function() {
          return this.qty--;
        };
      }

      return UiExpectedModel;

    })();

    getTaxAndFees = function(model) {
      return (model.tax + model.vendorFees) * model.qty;
    };

    getTotalPrice = function(model) {
      return (model.price + model.tax + model.vendorFees) * model.qty;
    };

    fakeModel = {
      id: 1,
      title: 'a title',
      description: 'a description',
      price: 12,
      tax: 2,
      vendorFees: 1,
      qty: 2
    };

    fetchModelFromBackendAndConstructIdealObject = function(id) {
      return new UiExpectedModel(fakeModel);
    };

    return {
      retrieveMyModel: fetchModelFromBackendAndConstructIdealObject
    };
  }
]);

{% endhighlight %}

CoffeeScript Working App and Code: {% include plunker.html id="TFgtMTgI2tdHYUtDgzUl" %}

<hr>

Javascript Working App and Code: {% include plunker.html id="cTy2SAC0tupocveiFhtG" %}


