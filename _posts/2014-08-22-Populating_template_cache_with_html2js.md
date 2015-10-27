---
layout: post
title: Populating template cache with html2js
author: Bluescreen
categories: [tips]
---

You probably find yourself creating small html files for each view or directive (pages and widgets) in your application. This is good because it makes your application more maintainable by breaking things into individual components.

However, this can become a bottleneck when running the application in production. Imagine an application made of hundreds of different views and directives. In this scenario, when the application request a new template, AngularJS will check its [$templateCache][1] to check if the template was already fetched, if not it will download the template and put it on the cache. This is an optimization to prevent downloading the same template multiple times.

When the application is initialized the $templateCache is empty, it also happens when the user clicks the refresh button. In an app like the one described before, AngularJS could trigger multiple requests to the server even if the templates didn't change.

Templates usually change at best every time we deploy a new version of our application. [html2js][2] it's a plugin for [Grunt][3] that parses all template files in your application and creates a javascript file that populates the $templateCache. This is very useful trick to reduce the number of request your app needs to make to start the application. It can also minify the html snippets saving some bandwitdh as well.

The add the plugin, simple install it with npm

{% highlight bash %}
npm install grunt-html2js --save-dev
{% endhighlight %}

Then add the following to your ``Gruntfile.js`` in the ``initConfig`` section

{% highlight javascript %}
html2js: {
  options: {
    base: 'app',
    module: 'myApp.templates',
    singleModule: true,
    useStrict: true,
    htmlmin: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }
  },
  main: {
    src: ['app/scripts/**/*.html'],
    dest: 'app/scripts/populate_template_cache.js'
  }
}
{% endhighlight %}

Also we need to tell our Grunt tasks to invoke html2js. To do that simply add ``html2js:main`` in the tasks section, for instance, in ``build`` and ``serve`` sections

{% highlight javascript %}
grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
  if (target === 'dist') {
    return grunt.task.run(['build', 'connect:dist:keepalive']);
  }

  grunt.task.run([
    'clean:server',
    'wiredep',
    'concurrent:server',
    'autoprefixer',
    'html2js:main',
    'configureProxies',
    'connect:livereload',
    'watch'
  ]);
});

grunt.registerTask('build', [
  'clean:dist',
  'wiredep',
  'useminPrepare',
  'concurrent:dist',
  'autoprefixer',
  'html2js:main',
  'concat',
  'ngAnnotate',
  'copy:dist',
  'cdnify',
  'cssmin',
  'uglify',
  'filerev',
  'usemin',
  'htmlmin'
]);
{% endhighlight %}

Now we need to add ``scripts/populate_template_cache.js`` in our ``index.html``

{% highlight html %}
<!-- build:js({.tmp,app}) scripts/scripts.js -->
<script src="scripts/populate_template_cache.js"></script>
<script src="scripts/app.js"></script>
<!-- other JS like controllers, directives, services, .. -->
<!-- endbuild -->
{% endhighlight %}

Finally we need to make ``myApp.templates`` a dependency for ``myApp``, to tell ``myApp`` to wait until the ``$templateCache`` is populated.

{% highlight javascript %}
angular.module('myApp', [ 'myApp.templates', /* other dependencies */ ]);
{% endhighlight %}

And that's it. Enjoy!

[1]: https://docs.angularjs.org/api/ng/service/$templateCache
[2]: https://github.com/karlgoldstein/grunt-html2js
[3]: http://gruntjs.com/
