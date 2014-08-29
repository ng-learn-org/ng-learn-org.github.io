---
layout: post
title: Testing Promises with Jasmine
author: Bluescreen
categories: [tips]
---

[Jasmine][1] is a great testing framework but when you have to deal with promises is not always clear how to deal with promises. Typical use cases are asynchronous services calling a backend. For instance, consider the following AngularJS service.

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

Upon calling ``EmployeeService.get()`` it will return a promise that will be either fulfilled or rejected. Testing a promise without the necessary guards can lead to two different scenarios. First scenario we get a deferred pass or fail when running our test suite, this can make difficult to trace failed tests. The second possibility and more dangerous, our test suite finishes before the promise is completed hiding passes and failures under the rag.

Since Jasmine 2.0, test methods can be supplied with an special function called ``done`` that will signal the test runner to wait until that function is invoked. Here is a sample test case for the previously defined service.

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

[1]: http://jasmine.github.io/