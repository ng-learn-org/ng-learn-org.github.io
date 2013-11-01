---
layout: post
title: Services - Complex Objects
categories: [resources, beginner]
---

## Services - Initializing Complex Objects

Lets say we want to model the object we retrieved from our backend. We want to modify some data, concatenate other and we want to add some functions so we can call them on the fly at presentation layer.
Lets assume our e-commerce site's backend just retrieved a saved shopping cart (a la amazon). It contains a saved shopping cart holding product with a title, description, quantity, price, taxes, fees, etc.

1- Our Controller will be just a pass through. It will only call our service and make sure that the model we obtain we attach it to our scope so the presentation layer has access to it.

{% raw %}
``` coffeescript
angular.module("myApp").controller "myCtrl", [ "$scope", "mySvc", ($scope, mySvc) ->

  $scope.ui = {}

  #Requesting our svc to fetch the ideal model
  $scope.ui.idealModel = mySvc.retrieveMyModel(1)

  ]
```
{% endraw %}

Notes: For debugging purposes we made an additional call to our svc so we can compare the unmodified model we got from our backend towards the one we constructed for our ui.

2- Our Service offers a small set of public methods - our API. Public function 'retrieveMyModel' calls by reference 'fetchModelFromBackendAndConstructIdealObject'.
A little bit hairy method name but it makes a point about what its responsibility is. We are faking the call to a backend service and we always return the same fakeModel. No massaging so far.

{% raw %}
``` coffeescript
angular.module("myApp").service "mySvc", [ ->

  fakeModel =
    id: 1
    title: 'a title'
    description: 'a description'
    price: 12
    tax: 2
    vendorFees: 1
    qty: 2

  fetchModelFromBackendAndConstructIdealObject = (id) ->
    #faking a model was retrieved from the backend. an Http request would be here instead.
    fakeModel

  retrieveMyModel: fetchModelFromBackendAndConstructIdealObject

  ]
```
{% endraw %}

3- Now we add a class with a constructor. This complex object 'UiExpectedModel' will serve as a blueprint to create a more suitable object with only the necessary data for the ui.
It will also contain some convenience methods that fall under the same domain and that will turn our Model smarter.

{% raw %}
``` coffeescript
angular.module("myApp").service "mySvc", [ ->

  class UiExpectedModel
    constructor: (backEndModel) ->

      # If we want to keep all the data we can extend our model with the one coming from the backend.
      angular.extend @, backEndModel

      # We decide to override the id to conform with some UI requirements
      @id = "#{backEndModel.id}-abc"
      @title = backEndModel.title.toUpperCase()

      # We perform some calculations based on received data.
      @totalPrice = getTotalPrice(backEndModel)
      @taxAndFees = getTaxAndFees(backEndModel)

      # We add some convenience methods that we will need at the presentation layer.
      @getTotalSale = ->
        (@price + @tax + @vendorFees) * @qty
      @addOne = ->
        @qty++
      @removeOne = ->
        @qty--


  # Private Methods
  getTaxAndFees = (model)->
    (model.tax + model.vendorFees) * model.qty

  getTotalPrice = (model) ->
    (model.price + model.tax + model.vendorFees) * model.qty

  fakeModel =
    id: 1
    title: 'a title'
    description: 'a description'
    price: 12
    tax: 2
    vendorFees: 1
    qty: 2

  fetchModelFromBackendAndConstructIdealObject = (id) ->

    #faking a model was retrieved from the backend. an Http request would be here instead.
    #instead of returning the model as it is, we create a new UiExpectedModel using our constructor.

    new UiExpectedModel fakeModel

  retrieveMyModel: fetchModelFromBackendAndConstructIdealObject

  ]
```
{% endraw %}


<iframe src="http://embed.plnkr.co/TFgtMTgI2tdHYUtDgzUl/preview" width="100%" height="950px"> </iframe>
