---
layout: post
title: Running Grunt Tasks from WebStorm/IntelliJ on Ubuntu
author: Santiago Esteva
categories: [tools, tips]
---

Here is a brief tip to integrate Grunt tasks to be executed inside WebStorm or Intellij.

### Running Grunt Tasks from WebStorm/IntelliJ on Ubuntu

1- Install NodeJs Plugin: Go to Settings/Plugins and search for NodeJS plugin and install it.

2- Make sure PhantomJS is globally installed. In the command line, run "sudo npm install -g phantomjs" . Phantom binary is now located /usr/lib/node_modules/phantomjs/bin/phantomjs

3- Make sure Grunt-cli is globally installed. In the command line, run "sudo npm install -g grunt-cli" . Grunt command line interface is now located /usr/lib/node_modules/grunt-cli/bin/grunt

4- In WebStorm, go to Run/Edit Configurations. 	Add a new NodeJS configuration.

        Name: provide a name to identify this task
        Path to Node: /usr/bin/node
        Node Parameters:
        Working Directory: **directory where your GruntFile.js is located**
        Path to Node App JS File: /usr/lib/node_modules/grunt-cli/bin/grunt
        Application Parameters: **name of your grunt task. example: test**
        Environment Variables: PHANTOMJS_BIN=/usr/lib/node_modules/phantomjs/bin/phantomjs


