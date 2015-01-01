---
layout: post
title: Polymer Templates - Part 2 - Logic
author: Santiago Esteva
categories: [polymer]
---

We keep learning polymer's templates features. Its time to take a look at iterating templates, conditional flow and referencing another template.
If you would like to review bindings to a property, a complex object or a specific context please review [Polymer Templates - Bindings][12]

By now you got the idea and differences between TemplateBinding and Polymer.
From this point onwards I will just add the Polymer's version.

**knowledge revision:** in our [previous article][12] we talked about Bindings. The native template element does not provide bindings capabilities.
This is one if those the enhanced features provided by [TemplateBinding][9] library created by the Polymer team.
This library is used by Polymer under the hood but it could be used as standalone.


## Repeating Templates

Repeat in Polymer has two possible formats: tacit or named scope. The tacit form looks like this:

{% highlight markup %}

<polymer-element name="my-element">
  <template>
    The brother names are
    <template repeat="{% raw %}{{ brothers }}{% endraw %}">
      <span>{% raw %}{{ name }}{% endraw %}</span>
    </template>
  </template>
  <script>
    Polymer({
      created: function(){
        this.brothers = [
          {name: 'Santiago'},
          {name: 'Pablo'},
          {name: 'Veronica'}
        ]
      }
    })
  </script>
</polymer-element>

{% endhighlight %}

The named scope form is:

{% highlight markup %}

<polymer-element name="my-element">
  <template>
    <template repeat="{% raw %}{{ brother in brothers }}{% endraw %}">
          <span>{% raw %}{{ brother.name }}{% endraw %}</span>
    <template>
  </template>
  <script>
    Polymer({
      created: function(){
        this.brothers = [
          {name: 'Santiago'},
          {name: 'Pablo'},
          {name: 'Veronica'}
        ]
      }
    });
  </script>
</polymer-element>
{% endhighlight %}

Sometimes you need the the iteration Index.
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

You can use 'bind if' or 'if':

{% highlight markup %}
<template bind if="{{ conditionalValue }}">
  Binds if and only if conditionalValue is truthy.
</template>

<template if="{{ conditionalValue }}">
  Binds if and only if conditionalValue is truthy. (same as *bind if*)
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


#### Conditional repeats

You may also use to condition whether to repeat a template or not.

{% highlight  markup%}
<template repeat if="{% raw %}{{ conditionalValue }}{% endraw %}">
  Repeat if and only if conditionalValue is truthy.
</template>
{% endhighlight %}

#### Conditional boolean attributes

This is another form of condition using **?=** syntax. Let's see an example:

You can set an element's `hidden` property using `hidden?=`:

{% highlight markup %}
<p hidden?="{% raw %}{{shortView}}{% endraw %}">
  ...
</p>
{% endhighlight %}

The boolean attribute gets set if it is bound to a `true` value. Note the use of `?=` syntax for conditionally setting a boolean attribute.

{% highlight markup %}
<polymer-element name="my-element">
  <template>
   <div>The Big Lebowski</div>
    <p hidden?="{% raw %}{{shortView}}{% endraw %}">
      'Dude' Lebowski, mistaken for a millionaire Lebowski, seeks restitution
      for his ruined rug and enlists his bowling buddies to help get it.
    </p>
    <button on-tap="{% raw %}{{toggleView}}{% endraw %}">Toggle View</button>
  </template>
  <script>
    Polymer({
      shortView: true,
      toggleView: function() {
        this.shortView = !this.shortView;
      }
    });
  </script>
</polymer-element>
{% endhighlight %}

## Referencing another template

Lets say we want to use the same template multiple times.
When creating an instance, the content of this template will be ignored, and the content of #myTemplate is used instead.
In the following example, the text 'Used by any template which refers to this one by the ref attribute' will be printed twice.


{% highlight markup %}
<polymer-element name="my-element">
  <template>
    <template id="user">
      <span style="userName">{% raw %}{{ name }}{% endraw %}</span>
    </template>

    Hi, <template ref="user" bind="{% raw %}{{loggedIn}}{% endraw %}"></template>.
    People you may want to add:
    <ul>
      <!-- tacit binding of each object inside collection-->
      <template repeat="{% raw %}{{peopleYouMayKnow}}{% endraw %}">
        <li><template ref="user" bind></template></li>
      </template>
      <!-- named scope binding of each object inside collection-->
      <template repeat="{% raw %}{{person in peopleYouMayKnow}}{% endraw %}">
        <li><template ref="user" bind="{% raw %}{{person}}{% endraw %}"></template></li>
      </template>
    </ul>
  </template>
  <script>
    Polymer({
      created: function(){
        this.loggedIn = { name: 'Sam' };
        this.peopleYouMayKnow = [{ name: 'Amy' }, { name: 'Lin' }, { name: 'Peter' }];
      }
    });
  </script>
</polymer-element>
{% endhighlight %}


#### Recursive Templates

You can also use it to easily represent tree structures with a recursive template:

{% highlight markup %}
<template>
  <template>
    <ul>
    <template repeat="{% raw %}{{items}}{% endraw %}" id="t">
      <li>{% raw %}{{name}}{% endraw %}
      <ul>
        <template ref="t" repeat="{% raw %}{{children}}{% endraw %}"></template>
      </ul>
    </li>
  </template>
</template>
{% endhighlight %}

#### Choose templates dynamically

This is simplistic example on how you could dynamically decide which template to display based on a given logic.

We give each template a unique id but instead of reference one or the other, we bind the selection to our model.

{% highlight markup %}
<polymer-element name="my-element">
  <template >
    <template id="one">
      The username is {% raw %}{{username}}{% endraw %}
    </template>
    <template id="two">
      The name is {% raw %}{{name}}{% endraw %}
    </template>
    <template bind="{% raw %}{{user}}{% endraw %}" ref="{% raw %}{{templateName}}{% endraw %}"></template>
	</template>
  <script>
    Polymer({
      created: function(){
        this.user = { name: 'Amy'};
      },
      domReady: function(){
       this.templateName = 'two';
       if(this.user.hasOwnProperty('username')){
         this.templateName = 'one';
       }
     }
    });
  </script>
</polymer-element>
{% endhighlight %}

**Created vs Attached vs DomReady:** Polymer shortens web components lifecycle callbacks. Created - from createdCallback - is called when an instance of the element was created.
Here we can instantiate our Model.

In this example, I wanted to choose the templates dynamically based on an existing model. So I decided to perform my logic in a
later stage. I could have picked 'attached' - from attachedCallback - which is called when an instance of the element was inserted into the DOM.

I chose 'domReady' which is called when the element’s initial set of children exist. From the docs: "This is an appropriate time to poke at the element’s parent
or light DOM children. Another use is when you have sibling custom elements (e.g. they’re .innerHTML‘d together, at the same time).
Before element A can use B’s API/properties, element B needs to be upgraded. The domReady callback ensures both elements exist."


## Try it yourself
You should go to [ele.io][11] and take any of the Polymer examples and play!

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
[12]:http://ng-learn.org/2014/12/Polymer_Templates-Bindings/










