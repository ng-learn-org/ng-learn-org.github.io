---
layout: post
title: Polymer Templates - Part 3 - Misc
author: Santiago Esteva
categories: [polymer]
---

[Intro text]

## Binding to native html elements

{% highlight markup %}

<polymer-element name="my-element">
  <template>
     <template id="input" bind="{% raw %}{{ input }}{% endraw %}">
      <h2>Text Input</h2>

      <p>The amount (value: {% raw %}{{ amount }}{% endraw %}) property is
         bound to both of these text input elements:</p>

        <label>Text: <input value="{% raw %}{{ amount }}{% endraw %}"></label>
        <label>Number: <input type="number" value="{% raw %}{{ amount }}{% endraw %}"></label>

      <h2>Checkbox</h2>

      <p>The toggle (value: {% raw %}{{ toggle }}{% endraw %}) property is
         bound to both of these check boxes</p>

        <label>Checkbox 1: <input type="checkbox" checked="{% raw %}{{ toggle }}{% endraw %}"></label>
        <label>Checkbox 2: <input type="checkbox" checked="{% raw %}{{ toggle }}{% endraw %}"></label>

      <h2>Radio</h2>

      <p>radio1 (value: {% raw %}{{ radio1 }}{% endraw %}, radio2 (value: {% raw %}{{ radio2 }}{% endraw %}),
         and radio3 (value: {% raw %}{{ radio3 }}{% endraw %} are bound to  these radio buttons</p>

        <form>
          <label>Radio 1: <input type="radio" checked="{% raw %}{{ radio1 }}{% endraw %}"></label>
          <label>Radio 2: <input type="radio" checked="{% raw %}{{ radio2 }}{% endraw %}"></label>
          <label>Radio 3: <input type="radio" checked="{% raw %}{{ radio3 }}{% endraw %}"></label>
        </form>
    </template>
  </template>
  <script>
    Polymer({
      created: function(){
        this.input = {
        	amount: 10,
        	toggle: true,
        	radio1: true,
        	radio2: false,
        	radio3: false
        }
      }
    });
  </script>
</polymer-element>

{% endhighlight %}

## Insertion points

## One Way Binding


## Try it yourself
You should go to [ele.io][11] and take any of the Polymer examples and play!

Ele.io is the jsfiddle for polymer, created for polymer playing and developed with polymer elements.
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










