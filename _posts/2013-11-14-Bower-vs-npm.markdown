---
layout: post
title: Bower vs. npm
author: Bluescreen
categories: [tools]
---

As you progress with frontend development, you will start using other tools besides your editor. Most of the tooling around Javascript runs on [node.js][1], node comes with [npm][2] a dependency manager. But then, there is [bower][3], both are dependency managers but with very different purposes.

On one hand **npm** was created to install modules used in a node.js environment, or development tools built using node.js such Karma, lint, minifiers and so on. npm can install modules locally in a project ( by default in `node_modules` ) or globally to be used by multiple projects. In large projects the way to specify dependencies is by creating a file called `package.json` which contains a list of dependencies. That list is recognized by npm when you run `npm install`, which then downloads and installs them for you.

On the other hand **bower** was created to manage your frontend dependencies. Libraries like jQuery, AngularJS, underscore, etc. Similar to npm it has a file in which you can specify a list of dependencies called `bower.json`. In this case your frontend dependencies are installed by running `bower install` which by default installs them in a folder called `bower_components`.

As you can see, although they perform a similar task they are targeted to a very different set of libraries. I hope that this article clarifies the confusion between them.

[1]: http://nodejs.org/
[2]: https://npmjs.org/
[3]: http://bower.io/
