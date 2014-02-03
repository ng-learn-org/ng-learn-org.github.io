---
layout: post
title: Debugging Protractor from WebStorm/IntelliJ
author: Santiago Esteva
categories: [tools, tips, protractor]
---

Here is a brief tip to debug Protractor tests inside WebStorm or Intellij.

### Setup

This is only one possibility. Read the following do to analyze all options. [https://github.com/angular/protractor/blob/master/docs/debugging.md](https://github.com/angular/protractor/blob/master/docs/debugging.md)

1. Open Run/Debug Configurations dialog
2. Add new Node.js configuration
3. On Configuration tab set:
 - **Path to Node**: path to node executable . e.g. '/usr/bin/node'
 - **Working directory**: your project base path e.g. '/usr/sesteva/myTests'
 - **Path To Node JS App file**: path to Protractor cli.js file (e.g. *node_modules\protractor\lib\cli.js*)
 - **Application parameters**: path to your Protractor configuration file (e.g.
 *protractorConfig.js*)
4. Click OK, place some breakpoints on your js files.
5. Click on Debug from the Run menu.

#### If you are using CoffeeScript

The only difference would be to just set the breakpoints on the generated JS.

I usually set my grunt coffee task to generate all JS files under .tmp folder

### Add before Launch external tool

    Program: grunt
    Parameters: test-setup
    Working directory: /home/sesteva/myTests


### Warning

Note that the element function returns a promise. This means you cannot debug that line directly.

In order to debug an element() output, set a break point on the 'then' method; or create a then for it. Example:

     element(By.id('#myId')).then(function(elm){
        #breakpoint here
        elm.click()
     });


