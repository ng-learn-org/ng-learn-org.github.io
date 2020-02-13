---
layout: post
title: Quick Intro to Angular 8
author: Guest Author kanchan_p
image: http:///img/Angular-8-features.webp
categories: [angular, tutorial, beginner]
---

Angular v8 is here with a big bang. Released on 8th May 2019 it has lots of exciting features. 
Let's get our hands dirty and go over a quick tutorial.

Here are some of the major changes in Angular 8:

1. Performance optimization using differential loading
2. Ivy Rendering engine support
3. Bazel tool is now in open-source for opt-in features
4. Builder API and Web Worker support
5. No support for @angular/Http
6. PNPM support including npm and yarn
7. Support for Typescript 3.4.x


With this brief idea, we’ll look into creating a basic application using Angular8.

## Installation Prerequisites
To work on Angular 8, we need to configure and install below tools for the environment

* Typescript version 3.4 or above
* IDE like Visual studio 2015 or above
* Angular CLI to install and run the project

## Creating a New project:
To create a new project, we can use Angular CLI. To install Angular CLI using npm 

{% highlight sh %}

    // Installing Angular CLI
    npm install -g @angular/cli
    // Creating new project
    ng new AngularDemo

{% endhighlight %}

In case, you have an existing application of angular, you can update the required dependencies of @angular/cli and @angular/core. 

{% highlight sh %}

    ng update @angular/cli @angular/core

{% endhighlight %}

To update the material and CDK for Angular 8 applications, you need to uninstall material and CDK then install it using Angular 8.

{% highlight sh %}
    npm uninstall --save @angular/material
    npm uninstall --save @angular/cdk
    // install using Angular 8
    ng add @angular/material
{% endhighlight %}

Once you've installed these modules, check your package.json file for the updated version of the material and CDK.
Now run your application. Check out your application running at `localhost:4200`. 

{% highlight sh %}
    ng serve
{% endhighlight %}


## Data display Using Angular 8
Once you run your Angular 8 application, we‘ll create components to display the products. 

{% highlight sh %}
    ng g component products
{% endhighlight %}

Once you create the components, open the ‘src/app/app.module.ts’ file and verify the new components are imported and declared in @Ngmodule. 
Next, we’ll create routes in the app-routing.module.ts file. Open `src/app/app-routing.module.ts`  and add below imports. 

{% highlight javascript %}
    import { ProductsComponent } from './products/products.component';
{% endhighlight %}


Add these routes to the existing route constant.

{% highlight javascript %}
    const routes: Routes = [
      {
        path: 'products',
        component: ProductsComponent,
        data: { title: 'List of Products' }
      },
      {
       { path: '',
        redirectTo: '/products',
        pathMatch: 'full'
      }
    ]; 
{% endhighlight %}


Next, we’ll create the API for the GET the request.  Register ‘HttpClientModule’ along with FormsModule in `src/app/app.module.ts` 

{% highlight javascript %}
    import { FormsModule } from '@angular/forms';
{% endhighlight %}


Add these modules in @NgModule below the BrowseModule in ‘src/app/app.module.ts’.

{% highlight javascript %}

    imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule
    ],
{% endhighlight %}

To get the typed result object for the products, we’ll create a Typescript file of the path `src/app/product.ts`.

{% highlight javascript %}
    export class Product {
      _id: string;
      prod_name: string;
      prod_desc: string;
      prod_price: number;
}
{% endhighlight %}

We’ll create the product data in app/product.data.ts file.

{% highlight javascript %}
    import { Product } from './product';
    
    export const PRODUCTS: Product[] = [
      {
        _id: '1',
        prod_name: 'drone',
        prod_desc: 'electonic',
        prod_price: 1234
      },
      {
        _id: '2',
        prod_name: 'API',
        prod_desc: 'electonic',
        prod_price: 12343
      },
    ];
{% endhighlight %}

Now we’ll create service to get the product data.

{% highlight sh %}
    ng g service api
{% endhighlight %}


We’ll now add below imports in ‘src/app/api.service.ts’.

{% highlight javascript %}
    import { Injectable } from '@angular/core';
    import { Observable, of } from 'rxjs';
    import { Product } from './product';
    import { PRODUCTS } from './product.data';
{% endhighlight %}

We’ll create a simple function to display product data. 

{% highlight javascript %}
    // Get the product details
    getProducts(): Product[] {
      return PRODUCTS;
    }
{% endhighlight %}

We’ll now read the data published by the API service. Open the `src/app/products/products.component.ts` and add the imports of API service and inject.

{% highlight javascript %}
    import { ApiService } from '../api.service';
    constructor(private api: ApiService) { }
{% endhighlight %}


To display products we’ll use the Angular 8 materials and CDK. You can install it using

{% highlight sh %}
    ng add @angular/material
{% endhighlight %}

Register all the required modules of Angular 8 Material in `src/app/app.module.ts` file.

{% highlight javascript %}
    import {
      MatInputModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatSortModule,
      MatTableModule,
      MatIconModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule } from "@angular/material";
{% endhighlight %}


Next, add the ‘ReactiveFormsModule’ and import its module in ‘@NgModule’.

{% highlight javascript %}
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';
{% endhighlight %}


Now register all the above modules to ‘@NgModule’.

{% highlight javascript %}
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      MatInputModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule
    ],
{% endhighlight %}


Now we’ll add the imports in ‘src/app/products/products.component.ts’. Declare the variables in the constructor and modify the ‘ngOnInit’ Function for the product list.

{% highlight javascript %}
    import { Component, OnInit } from '@angular/core';
    import { ApiService } from '../api.service';
    import { Product } from '../product';

    @Component({
      selector: 'app-products',
      templateUrl: './products.component.html',
      styleUrls: ['./products.component.scss']
    })
    export class ProductsComponent implements OnInit {

      displayedColumns: string[] = ['prod_name', 'prod_price'];
      data: Product[] = [];
      isLoadingResults = true;

      constructor(private api: ApiService) { }

      ngOnInit() {
          this.setProducts();
      }

      setProducts(): void {
        this.data = this.api.getProducts();
      }
    }
{% endhighlight %}


Now, we’ll replace all the HTML tags of ‘src/app/products/products.component.html’ to Angular Material tags.

{% highlight html %}
    <div class="example-container mat-elevation-z8">
      <table
        mat-table
        [dataSource]="data"
        class="example-table"
        matSort
        matSortActive="prod_name"
        matSortDisableClear
        matSortDirection="asc"
      >
        <!-- Product Name Column -->
        <ng-container matColumnDef="prod_name">
          <th mat-header-cell *matHeaderCellDef>Product Name</th>
          <td mat-cell *matCellDef="let row">{{row.prod_name}}</td>
        </ng-container>

        <!-- Product Price Column -->
        <ng-container matColumnDef="prod_price">
          <th mat-header-cell *matHeaderCellDef>Product Price</th>
          <td mat-cell *matCellDef="let row">$ {{row.prod_price}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns;"
          [routerLink]="['/products/', row.id]"
        ></tr>
      </table>
    </div>
{% endhighlight %}

Finally, we will add CSS code to `src/app/products/products.component.scss`.

{% highlight css %}
    /* Structure */
    .example-container {
      position: relative;
      padding: 5px;
    }

    .example-table-container {
      position: relative;
      max-height: 400px;
      overflow: auto;
    }

    table {
      width: 100%;
    }
{% endhighlight %}


Now add ‘@Component’ declaration in `src/app/products/products.component.ts` declarations.

{% highlight javascript %}
    @Component({
      selector: 'app-products',
      templateUrl: './products.component.html',
      styleUrls: ['./products.component.scss']
    })	
{% endhighlight %}


Finally run your application using ng server.

Take a look at sample application on https://codesandbox.io/s/wandering-brook-er0go?fontsize=14&hidenavigation=1&theme=dark
TakeAway:

Angular 8 has come up with major changes. This article briefs the major features of Angular 8 and describes the basic display operation using the Angular 8 framework. 