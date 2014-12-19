---
layout: post
title: Polymer Templates - Part 2 - Logic
author: Santiago Esteva
categories: [polymer]
---

[Intro text]


## Repeating Templates

By now you got the idea and differences between TemplateBinding and Polymer.
From this point onwards I will just add the Polymer's version.

{% highlight markup %}

<polymer-element name="my-element">
  <template>
    <template repeat="{% raw %}{{ color in colors }}{% endraw %}">
      <p>My favorite color is {% raw %}{{color}}{% endraw %}.</p>
    <template>
  </template>
  <script>
    Polymer({
      created: function(){
        this.colors = [
          'red',
          'blue',
          'white'
        ]
      }
    });
  </script>
</polymer-element>
{% endhighlight %}

Here is how we can get the Iteration Index.
You can use the iteration index like any other variable using double mustache syntax:

{% highlight markup %}
<template repeat="{% raw %}{{fruit, i in fruits}}{% endraw %}">
  <div>{% raw %}{{i + 1}}{% endraw %}. {% raw %}{{fruit}}{% endraw %}</div>
</template>
{% endhighlight %}

**Note:** A few features of native templates can’t be replicated perfectly with the polyfills library, and require some workarounds.
Some browsers don’t allow 'template' elements inside certain elements like 'select' or 'table'.
Browsers with native support for 'template' allow it to be a child of elements 'select' and 'table'.

{% highlight  markup%}
<table>
  <template repeat="{% raw %}{{fruit in fruits}{% endraw %}">
    <tr><td>{% raw %}{{fruit}}{% endraw %}</td></tr>
  </template>
</table>
{% endhighlight %}

Here is the workaround

{% highlight  markup%}
<tr template repeat="{% raw %}{{fruit in fruits}}{% endraw %}">
    <td>{% raw %}{{fruit}}{% endraw %}</td>
</tr>
<option template repeat="{% raw %}{{fruit in fruits}}{% endraw %}">{% raw %}{{fruit}}{% endraw %}</option>
{% endhighlight %}

## Conditional Flow

The template renders only if the value it is bound to is truthy.

{% highlight markup %}
<template if="{% raw %}{{showAnswer}}{% endraw %}">
  ...
</template>
{% endhighlight %}

Polymer has no `else` clause. Use a negative condition instead:

{% highlight markup %}
<template if="{% raw %}{{!showAnswer}}{% endraw %}">
  ...
</template>
{% endhighlight %}

Here is how it looks in a polymer element:

{% highlight markup %}
<polymer-element name="my-element">
  <template>
    <template if="{% raw %}{{showAnswer}}{% endraw %}">
      <div>42</div>
      <button on-tap="{% raw %}{{toggleView}}{% endraw %}">Show question</button>
    </template>
    <template if="{% raw %}{{!showAnswer}}{% endraw %}">
      <div>
        What is the answer to "The Ultimate Question of Life, the
        Universe, and Everything"?
      </div>
      <button on-tap="{% raw %}{{toggleView}}{% endraw %}">Show answer</button>
    </template>
  </template>
  <script>
    Polymer({
      showAnswer: false,
      toggleView: function(e, detail, sender) {
        this.showAnswer = !this.showAnswer;
      }
    });
  </script>
</polymer-element>
{% endhighlight %}



## Referencing another template


## Try it yourself
You got [ele.io][11] and take any of the Polymer examples and play!

Ele.io is the jsfiddle for polymer, created for polymer playing and developed with polymer elements.

Next we will go into a third article on binding on native html elements, multiple insertion points and one way binding.

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










