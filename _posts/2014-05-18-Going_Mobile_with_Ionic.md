---
layout: post
title: Going Mobile with Ionic
author: Santiago Esteva
image: http://ng-learn.org/img/irene.jpg
categories: [ionic, mobile]
---

**Irene:** Everybody is doing mobile!! Why not me? **Myself:** But I only know AngularJS. Could that be enough?
**I:** I've heard about these hybrids apps that don't feel really mobile. **Irene:** Are we sure???

## Tools

- Yeoman
- AngularJS
- Ionic
- Grunt
- Compass
- Ripple

## Setup

### Pre-requesites:

- Install [NodeJS](http://nodejs.org/), [Git](http://git-scm.com/), [Ruby](https://www.ruby-lang.org/en/),[Compass](http://compass-style.org/install/)
- If you are using npm 1.2.10 or above, this will also automatically install grunt and bower for you.
If you're on an older version of npm, you will need to install them manually:

        npm install -g grunt-cli bower

### Yeoman

        npm install -g yo

### Ionic Generator

        npm install -g generator-ionic

### Creating the project

Make a new directory, and cd into it

        mkdir my-ionic-project && cd $_

Run yo ionic

        yo ionic

The generator will ask several question to setup the project for us

    [?] Would you like to use Sass with Compass (requires Ruby)? (y/N)
    [?] Which Cordova plugins would you like to include? (Press <space> to select)
    [?] Which starter app template which you like to use? (Use arrow keys)

The last step gives you a basic app already setup in a given way using tabs, or a side menu. Choose any, these are just to help you start and avoid writter's blank page fear. :)

Once we have answered these questions, the generator will perform all steps creating folder structure, downloading all node and bower dependencies,
setting up grunt to build, serve and everything you might need to develop a web application.

Once yeoman completes its work, run the following:

        grunt serve

You're absolutely welcome. You have an application up and running.

### Mobile setup

You could start building your application but if you are like me, you had mobile in your mind and you want to see the mobile version of the app.

In order to build Android application we are missing the Android development kit.

#### Install Android SDK

- Download SDK: http://developer.android.com/sdk/index.html?hl=sk#download
- Select Use an Existing IDE
- Unzip to desired folder
- Run ./tools/android update sdk --no-ui
- Add to your bash profile:

        export ANDROID_HOME="$HOME/applications/android-sdk-linux/tools"
        export ANDROID_PLATFORM_TOOLS="$HOME/applications/android-sdk-linux/platform-tools"
        export PATH="$ANDROID_HOME:$ANDROID_PLATFORM_TOOLS:$PATH"

- Install ANT if you dont have it following these instructions: http://ant.apache.org/manual/install.html
- Set ANT_HOME to your bash profile:

        export ANT_HOME="$HOME/ant"
        export PATH="$PATH:$ANT_HOME/bin"

## Flow

#### Build web version:

    grunt serve

#### Run Unit tests:

    grunt test

#### Add platform

    grunt platform:add:android

#### Build mobile version:

    grunt build

#### Run Ripple emulator (Web emulator for mobile devices)

    grunt ripple

#### Run Android emulator (this takes a while to stand up)

    grunt emulate:android

#### Serve to Android Device - [docs](http://cordova.apache.org/docs/en/2.9.0/guide_getting-started_android_index.md.html)

    grunt run:android

## What's next?

You take it from here just for a lil bit.

Between the project example setup by the generator and the [docs](http://ionicframework.com/docs/) you're gonna be just fine kiddo.

That's it for now. Give it a spin.

Stay tuned!
