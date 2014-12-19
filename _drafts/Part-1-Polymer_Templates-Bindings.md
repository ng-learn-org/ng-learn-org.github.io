---
layout: post
title: Polymer Templates - Part 1 - Bindings
author: Santiago Esteva
categories: [polymer]
---

Polymer’s TemplateBinding library extends the capabilities of the HTML Template Element
by enabling it to create, manage, and remove instances of content bound to data defined in JavaScript.
Although internal in Polymer, it is also useful standalone.

In our previous article we presented a new challenge [Will Polymer kill Angular 2.0?][8].
We also said that in order to choose one over any other, we needed to know its strength and weakness and finally we came up with a list of small challenges to cover.
Templates are the first one for no particular reason and if you want to can see the whole list in our [previous post][8].

So Polymer team created a standalone small library called ['TemplateBinding'][9].
This lib stands on [HTML Template Element][10] spec's shoulders providing binding, interpolation and some logic helpers.
Lets take a look at these added features.

We'll start with 'bindings'.
In this article we will try to gather facts, problems workarounds and tips I've found on from polymer's docs, articles about html templates spec and different code repos I've found.

Next one will be on some logic features such as repeat and conditions.
Then we will go into a third article on binding on native html elements, multiple insertion points and one way binding.

## About templates

- Its content is effectively inert until activated. Essentially, your markup is hidden DOM and does not render.
- Any content within a template won't have side effects. Script doesn't run, images don't load, audio doesn't play,...until the template is used.
- Content is considered not to be in the document. Using document.getElementById() or querySelector() in the main page won't return child nodes of a template.

## Binding to a property

### Standalone TemplateBinding Version

{% highlight markup %}

<template id="text">
  <p>My favorite color is {% raw %}{{color}}{% endraw %}.</p>
</template>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var myTemplate = document.getElementById('text');
    myTemplate.model = {
      color: 'red'
    };
    // Needed to detect model changes if Object.observe
    // is not available in the JS VM.
    Platform.performMicrotaskCheckpoint();
  });
</script>

{% endhighlight %}

**Note:** TemplateBinding depends on NodeBind which depends on observe-js.
TemplateBinding.js uses Platform.performMicrotaskCheckpoint() which is defined in observe-js

### Polymer Version

{% highlight markup %}

<polymer-element name="my-element">
  <template>
    <p>My favorite color is {% raw %}{{color}}{% endraw %}.</p>
  </template>
  <script>
    Polymer({
      color: 'red'
    });
  </script>
</polymer-element>
{% endhighlight %}

**Note:** A few features of native templates can’t be replicated perfectly with the polyfill library, and require some workarounds.
Binding to certain attributes (such as the img tag’s src attribute) doesn’t work correctly on some browsers that don’t support templates.

For example, running

{% highlight markup %}
<img src="/users/{% raw %}{{id}}{% endraw %}.jpg">
{% endhighlight %}


under the polyfill produces a network request that 404s.
In addition, browsers such as IE sanitize certain attributes, disallowing {% raw %}{{}}{% endraw %} replacements in their text.

To avoid these side effects, bindings in certain attributes can be prefixed with “_”:

{% highlight  markup%}
<img _src="/users/{% raw %}{{id}}{% endraw %}.jpg">
<div _style="color: {{color}}">
<a _href="{% raw %}{{url}}{% endraw %}">Link</a>
<input type="number" _value="{{number}}">
{% endhighlight %}


## Binding to a complex object

### Standalone TemplateBinding Version

{% highlight markup %}

<template id="text">
  <p>My favorite color is {% raw %}{{options.color}}{% endraw %}.</p>
</template>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var myTemplate = document.getElementById('text');
    myTemplate.model = {
      options: {
        color: 'red'
      }
    };
    Platform.performMicrotaskCheckpoint();
  });
</script>

{% endhighlight %}

### Polymer Version

{% highlight markup %}

<polymer-element name="my-element">
  <template>
    <p>My favorite color is {% raw %}{{options.color}}{% endraw %}.</p>
  </template>
  <script>
    Polymer({
      created: function(){
        this.options = {
          color: 'red'
        }
      }
    });
  </script>
</polymer-element>
{% endhighlight %}

**Note:** For property values that are objects or arrays, you should set the default value in the created callback instead.
This ensures that a separate object is created for each instance of the element!

## Binding to a specific context

In order to simplify use of deeply nested objects in a template, we can use "bind" to pick our implicit context.
Bindings inside the template are evaluated in the context of the bound object.

### Standalone TemplateBinding Version

{% highlight markup %}

<template id="text" bind="{% raw %}{{ options }}{% endraw %}">
  <p>My favorite color is {% raw %}{{color}}{% endraw %}.</p>
</template>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var myTemplate = document.getElementById('text');
    myTemplate.model = {
      options: {
        color: 'red'
      }
    };
    Platform.performMicrotaskCheckpoint();
  });
</script>

{% endhighlight %}

### Polymer Version

{% highlight markup %}

<polymer-element name="my-element">
  <template>
    <template bind="{% raw %}{{ options }}{% endraw %}">
      <p>My favorite color is {% raw %}{{color}}{% endraw %}.</p>
    <template>
  </template>
  <script>
    Polymer({
      created: function(){
        this.options = {
          color: 'red'
        }
      }
    });
  </script>
</polymer-element>
{% endhighlight %}

**Note:** In order for the context binding to work on Polymer I had to nest a template inside the element's template.
You will notice this pattern as we use more TemplateBinding features inside Polymer.

You can also create a named scope. This comes useful if you have nested templates.

{% highlight markup %}

<polymer-element name="my-element">
  <template>
    <template bind="{% raw %}{{ options as o }}{% endraw %}">
      <p>My favorite color is {% raw %}{{o.color}}{% endraw %}.</p>
    <template>
  </template>
  <script>
    Polymer({
      created: function(){
        this.options = {
          color: 'red'
        }
      }
    });
  </script>
</polymer-element>
{% endhighlight %}

## Try it yourself
You should go to [ele.io][11] and take any of the Polymer examples and play!

Ele.io is the jsfiddle for polymer, created for polymer playing and developed with polymer elements.

Next article will be on logic features such as repeat and conditions.
Then we will go into a third article on binding on native html elements, multiple insertion points and one way binding.

Enjoy!


[1]:http://webcomponents.org/
[2]:http://jonrimmer.github.io/are-we-componentized-yet/
[3]:http://webcomponents.org/polyfills/
[4]:http://www.x-tags.org/
[5]:http://bosonic.github.io/
[6]:https://www.polymer-project.org/
[7]:https://www.youtube.com/playlist?list=PLOU2XLYxmsII5c3Mgw6fNYCzaWrsM3sMN
[8]:http://ng-learn.org/2014/12/Polymer/
[9]:https://github.com/Polymer/TemplateBinding
[10]:http://www.w3.org/TR/html5/scripting-1.html#the-template-element
[11]:https://ele.io/










