---
layout: post
title: Ionic Framework Beta Changes
author: Santiago Esteva
categories: [ionic, news]
---

Right now the library's latest cut is 1.0.0-beta.12 "krypton-koala" (2014-09-10).
Lets take a quick glance at some the new features:

## Features

* **$ionicBody:** service to simplify body ele interaction ([2c3f1c9f](https://github.com/driftyco/ionic/commit/2c3f1c9f02ea3f2a90054556637a11f142010764))
* **$ionicConfigProvider:** add $ionicConfigProvider ([2643cffc](https://github.com/driftyco/ionic/commit/2643cffc19c65ad292ecc7069516427a71b43332))
* **$ionicScrollDelegate:** expose zoomBy and zoomTo methods ([029f8f33](https://github.com/driftyco/ionic/commit/029f8f33533115f7da95722d6fd596adfadd6a48), closes [#1977](https://github.com/driftyco/ionic/issues/1977))
* **ionContent:** add `locking` option ([af229072](https://github.com/driftyco/ionic/commit/af229072dfce16709bcd213333005e523fa9b162), closes [#2034](https://github.com/driftyco/ionic/issues/2034))
* **ionScroll:** add locking option ([cc8f31d8](https://github.com/driftyco/ionic/commit/cc8f31d8e8cd145bdcc7f3a0309c3c3b21506a88), closes [#2034](https://github.com/driftyco/ionic/issues/2034))
* **popover:** support popping from bottom or top of screen ([5d06c4ae](https://github.com/driftyco/ionic/commit/5d06c4aef8bf39703f9f4f32de52dad7749d1de5), closes [#1986](https://github.com/driftyco/ionic/issues/1986))
* **scroll-content:** add 1px padding-top ([e5b5906c](https://github.com/driftyco/ionic/commit/e5b5906cb7693b63e4c8059893b791214aed26c1))
* **splitView:** expose side menu on large viewport ([b69aa548](https://github.com/driftyco/ionic/commit/b69aa5485f90efb295547732dcaa87507abc0bdd))
* **templateCache:** automatically cache template files to prevent flicker on page navigation and imp ([944a92b0](https://github.com/driftyco/ionic/commit/944a92b08d40a7a4fb7e1e4727af9a2f8df3774f))
* **collectionRepeat:** other children of ion-content element fit in ([7ddb57e6](https://github.com/driftyco/ionic/commit/7ddb57e60b27072b69a0da66b9b22acdd44e6f10), closes [#1920](https://github.com/driftyco/ionic/issues/1920), [#1866](https://github.com/driftyco/ionic/issues/1866), [#1380](https://github.com/driftyco/ionic/issues/1380))
* **popover:** created popovers ([c1215aa3](https://github.com/driftyco/ionic/commit/c1215aa300e8506d30fbeaf2c608b07058c46e3b))
* **tabs:** Expand striped android style tab functionality. Closes 1694 ([ddda809b](https://github.com/driftyco/ionic/commit/ddda809b57ef334dc35ac2f33133f061d4856073))
* **$ionicLoading:** add $ionicLoadingConfig constant for default options ([26ca840d](https://github.com/driftyco/ionic/commit/26ca840dfc58621d09fdf207e41f73332aee541e), closes [#1800](https://github.com/driftyco/ionic/issues/1800))
* **checkbox:** add disabled and emotion styles to ion-checkbox. and #1509 ([79fb1e49](https://github.com/driftyco/ionic/commit/79fb1e494151360d5925de036ae20464aa2a09b3), closes [#1683](https://github.com/driftyco/ionic/issues/1683))
* **ionModalView:** ion-modal-view to wrap template instead of `<div class="modal">` ([ed4f2288](https://github.com/driftyco/ionic/commit/ed4f22889e6b8e28758f3ac637f1cba1e241cbc9), closes [#1668](https://github.com/driftyco/ionic/issues/1668))
* **ionSideMenu:** add `edge-drag-threshold`, delegate `edgeDragThreshold()` ([ba56bb98](https://github.com/driftyco/ionic/commit/ba56bb983fc727c42dfbd02d98b9aeadd10ea5c8), closes [#1570](https://github.com/driftyco/ionic/issues/1570))
* **ionSlideBox:** add 'auto-play' attr to optionally disable auto-play ([8f808609](https://github.com/driftyco/ionic/commit/8f8086092f2fc4cb69149acd1b06d348717d1e60), closes [#1552](https://github.com/driftyco/ionic/issues/1552))
* **tab:** options 'hidden' attribute for tabs., #1673 ([bb6976ad](https://github.com/driftyco/ionic/commit/bb6976ad54736103d78be3bddd9faf7719dc0153), closes [#1666](https://github.com/driftyco/ionic/issues/1666))


## Breaking Changes

* 
ion-radio no longer has an isolate scope.
This will break your radio only if you were relying upon the radio having an isolate scope: if you were referencing `$parent.value` as
the ng-disabled attribute, for example.

Change your code from this:

```
<ion-radio ng-disabled="{{$parent.isDisabled}}"></ion-radio>
```

To this:

```
<ion-radio ng-disabled="{{isDisabled}}"></ion-radio>
```

 ([53c437e2](https://github.com/driftyco/ionic/commit/53c437e2054e1f95d548e42b386f7a82aba56a14))

*
ion-toggle no longer has an isolate scope.
This will break your toggle only if you were relying upon the toggle
having an isolate scope: if you were referencing `$parent.value` as
the ng-disabled attribute, for example.

Change your code from this:

<ion-toggle ng-disabled="{{$parent.isDisabled}}"></ion-toggle>

To this:

<ion-toggle ng-disabled="{{isDisabled}}"></ion-toggle>

 ([537b29d0](https://github.com/driftyco/ionic/commit/537b29d0bbf000fc0639965029983a0f79c03c8f))
* Reordering with ion-reorder-button no longer changes the order of the items in the DOM.

This change will only break your list if you were not using the
onReorder callback as described in the documentation.

Before, while reordering an element in a list Ionic would swap the
elements underneath as the reordering happened.  This sometimes caused
errors with angular's ngRepeat directive.

Now, reordering an element in a list does not change the order of
elements in the DOM.  It is expected that the end developer will use the
index changes given in the `onReorder` callback to reorder the items
in the list. This is simple to do, see the [examples in the
ionReorderButton
documentation](http://ionicframework.com/docs/api/directive/ionReorderButton/).

 ([ba1859b3](https://github.com/driftyco/ionic/commit/ba1859b308b0769e4af2e72cb229cb7a87ade0e3))

*
ion-toggle no longer has an isolate scope.
This will break your toggle only if you were relying upon the toggle
having an isolate scope: if you were referencing `$parent.value` as
the ng-disabled attribute, for example.

Change your code from this:

<ion-toggle ng-disabled="{{$parent.isDisabled}}"></ion-toggle>

To this:

<ion-toggle ng-disabled="{{isDisabled}}"></ion-toggle>

 ([537b29d0](https://github.com/driftyco/ionic/commit/537b29d0bbf000fc0639965029983a0f79c03c8f))
* Reordering with ion-reorder-button no longer changes the order of the items in the DOM.

This change will only break your list if you were not using the
onReorder callback as described in the documentation.

Before, while reordering an element in a list Ionic would swap the
elements underneath as the reordering happened.  This sometimes caused
errors with angular's ngRepeat directive.

Now, reordering an element in a list does not change the order of
elements in the DOM.  It is expected that the end developer will use the
index changes given in the `onReorder` callback to reorder the items
in the list. This is simple to do, see the [examples in the
ionReorderButton
documentation](http://ionicframework.com/docs/api/directive/ionReorderButton/).

 ([ba1859b3](https://github.com/driftyco/ionic/commit/ba1859b308b0769e4af2e72cb229cb7a87ade0e3))


Stay tuned!


