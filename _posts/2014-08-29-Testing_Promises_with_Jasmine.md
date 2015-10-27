---
layout: post
title: Testing Promises with Jasmine
author: Bluescreen
categories: [tips]
---

[Jasmine][1] is a great testing framework but when you have to deal with promises is not always clear how. Typical use cases are asynchronous services calls to a backend. For instance, consider the following service:

{% highlight javascript %}
angular.module('myApp').service('EmployeeService',
  function($resource) {
    var Employee = $resource('/employees/:employeeId', {employeeId:'@id'});

    this.get = function(id) {
      return Employee.get({employeeId: id}).$promise;
    }
  }
);
{% endhighlight %}

Calling ``EmployeeService.get()`` returns a promise that will be either fulfilled or rejected. Testing a promise without the necessary guards can lead to two different scenarios.

First we get a deferred pass or fail when running our test suite, this can make tracing failed tests very difficult. Second possibility and more dangerous one, our test suite finishes before the promise is completed hiding passes and failures under the rag.

Since Jasmine 2.0, test methods can be supplied with an special function called ``done``. The test runner will wait until this function is called before moving to the next test, it also sets a watchdog in case it is never called.

{% highlight javascript %}
describe('EmployeeService', function() {
  var service, http;
  var mockEmployee = { id: 1, name: "John Doe" };

  beforeEach(module('myApp'));
  beforeEach(inject(function(EmployeeService, $httpBackend) {
    service = EmployeeService;
    http = $httpBacked;
  }));

  it('should fetch an employee', function(done) {
    var testEmployee = function(employee) {
      expect(employee.name).toBe(mockEmployee.name);
      expect(employee.id).toBe(mockEmployee.id);
    };

    var failTest = function(error) {
      expect(error).toBeUndefined();
    };
    
    http.expectGET('/employees/1').respond(200,mockEmployee);

    service.get(mockEmployee.id)
      .then(testEmployee)
      .catch(failTest)
      .finally(done);

    http.flush();
  });
});
{% endhighlight %}

In this case ``http.flush()`` will also force the test runner to wait before the promise is completed. But this is a particularity of ``$httpBackend``, it is generally safer to use ``done()``.

The other particularity is that we also created a ``failTest`` function that upon invocation will signal a test failure, without this, if for any reason the promise is broken our test will silently pass. 

[1]: http://jasmine.github.io/
