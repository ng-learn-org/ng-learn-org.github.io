---
layout: post
title: SEO Google crawl to execute your site JavaScript
author: Santiago Esteva
image: http://ng-learn.org/img/AngularJS-Shield-small.png
categories: [news, seo, tips]
---

How many times has the SEO discussion come up when choosing Javascript frameworks to do a project?
Google crawler is already reading your site's JavaScript. These are excellent news for SEO on AngularJS and every other SPAs!

If you've been at the [ng-conf][1] or watched the videos, Igor and Misko gave us all a hint about this very same fact.
They explained the team was not to focus on server side processing of the AngularJS views since these was not a problem for the framework
and he slipped the questions "What if Google was already crawling the javascript based sites?"

So yesterday, Google has announced on its webmaster's blog, they been crawling sites and interpreting javascript and css for some time now.

Google went through a learning period, which they refer to as "Understanding the pages".
After some rights and wrongs they have now got the news out with some additional details on how to help crawlers on this new task.

- **Problem:** If resources like JavaScript or CSS in separate files are blocked (say, with robots.txt) so that Googlebot can’t retrieve them, our indexing systems won’t be able to see your site like an average user.
- **Recommendation:** We recommend allowing Googlebot to retrieve JavaScript and CSS so that  your content can be indexed better. This is especially important for mobile websites, where external resources like CSS and JavaScript help our algorithms understand that the pages are optimized for mobile.

- **Problem:** If your web server is unable to handle the volume of crawl requests for resources, it may have a negative impact on our capability to render your pages.
- **Recommendation:** If you’d like to ensure that your pages can be rendered by Google, make sure your servers are able to handle crawl requests for resources.
It's always a good idea to have your site degrade gracefully. This will help users enjoy your content even if their browser doesn't have compatible JavaScript implementations. It will also help visitors with JavaScript disabled or off, as well as search engines that can't execute JavaScript yet.
Sometimes the JavaScript may be too complex or arcane for us to execute, in which case we can’t render the page fully and accurately.
Some JavaScript removes content from the page rather than adding, which prevents us from indexing the content.

For more details read the Google Webmaster's blog entry <a href="http://googlewebmastercentral.blogspot.com/2014/05/understanding-web-pages-better.html" target="_blank">here</a>

[1]:http://ng-conf.ng-learn.org/
