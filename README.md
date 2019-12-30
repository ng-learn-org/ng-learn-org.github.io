Ng-Learn
========

# Prerequisites

    brew update && brew upgrade ruby-build
    brew install rbenv
    rbenv install 2.7.0
    rbenv rehash
    rbenv global 2.7.0
    gem install bundler jekyll

# Setup

    bundle install

# Run Locally

    bundle exec jekyll serve

# Release

    git checkout master
    [make changes]
    git add .
    git commit -m "add ..."
    git push origin master



