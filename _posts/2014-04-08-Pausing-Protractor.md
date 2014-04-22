---
layout: post
title: Pausing Protractor
author: Santiago Esteva
image: http://ng-learn.org/img/protractor.png
categories: [tips, protractor]
---

STOP! FREEZE! PAUSE!
Here is a brief tip that might come useful while creating tests with Protractor.

If you haven't update to the latest version, then you might want to. There is beta feature that allows you to stop
the test execution so you can play around with your browser.
(You can review latest changes in [0.21.0 here][1])

    If you come from E2E tests with Karma you know how it goes and you were already missing this feature.

Long story short, in your tests you can now drop browser.pause() as many times as you want.
Protractor will start execution and when it finds the pause command it will freeze right there.

This allows you to play with the application or site that you have programatically opened for the Spec you have written.
You may open developer tools, take screenshots, take a look at source code, etc.

{% highlight javascript %}
    describe('when found with global element', function() {
      it('should wrap the result', function() {
        element.all(by.binding('planet.name')).then(function(results) {
          results.forEach(verifyMethodsAdded);
        });
        element.all(by.binding('planet.name')).get(0).then(function(elem) {
          browser.pause()
          elem.verifyMethodsAdded;
        });
        browser.pause()
        element.all(by.binding('planet.name')).first().then(function(elem) {
          elem.verifyMethodsAdded;
        });
        browser.pause()
        element.all(by.binding('planet.name')).last().then(function(elem) {
          elem.verifyMethodsAdded;
        });
        browser.pause()
        element.all(by.css('option[value="4"]')).then(function(results) {
          results.forEach(verifyMethodsAdded);
        });
      });
    });
{% endhighlight %}

At your command line, you will see the following legend:

{% highlight bash %}

Using ChromeDriver directly...
...................................w.........................
Hit SIGUSR1 - starting debugger agent.
debugger listening on port 5858
Starting WebDriver debugger in a child process. Pause is still beta, please report issues at github.com/angular/protractor
------- WebDriver Debugger -------
 ready

press c to continue to the next webdriver command
press d to continue to the next debugger statement
press ^C to exit

{% endhighlight %}

The verbiage is self explanatory. By typing 'c' or 'd' you basically handle the flow.

This is a beta status feature but feedback and pull requests become the best way to get it to the next stage.

If you liked this one, stay tuned for the next Protractor tip on elementExplorer.

[1]: http://ng-learn.org/2014/04/Protractor-0-21-0/