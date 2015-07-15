---
layout: post
title: Atom behind proxy
author: Santiago Esteva
categories: [tools, tips]
---

If you are working behind a company proxy or you have a local proxy running,
then you closed Atom the minute you found an error when trying to install a new
package. Wait!! Don't go anywhere!

So you went online and found that after several months these lazy guys from
ng-learn came up with a new post about this amazing editor called Atom. We are
back and coming for more!

Here is a quick tip for those dealing with a proxy. This is applicable to
windows, mac and windows.

  apm config set proxy "http://localhost:3128"
  apm config set https_proxy proxy "http://localhost:3128"

Now open Atom and you will be able to install packages!

Leave us a comment letting us know what are your prefered packages. Stay tuned!
