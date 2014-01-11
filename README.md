bootstrap-carousel-w-menu
=========================

Extends the Bootstrap 3 carousel with a menu using the html attributes. The carousel gets converted into a wizard with a menu on the left for easy navigation. This is useful for projects with many labelled steps. The slider is fully responsive (ofcourse) and the menu collapses into a select field for easy navigation on mobile

You can view the demo for the slider [here](http://dev.marketlytics.com/hslider).

## Usage

You start with the default setup for the carousel. You can use the built in previous next buttons, or can remove them as well or include them within the slides (unlike the demo).

```html
<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">

  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    <div class="item active">
      <img src="..." alt="...">
      <div class="carousel-caption">
        ...
      </div>
    </div>
    ...
  </div>

  <!-- Controls -->
  <a class="left carousel-control" href="#carousel-example-generic" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left"></span>
  </a>
  <a class="right carousel-control" href="#carousel-example-generic" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right"></span>
  </a>
</div>
```
You need to include the HSlider plugin files after jQuery and Bootstrap JS and call the hSlider function on it.

```js

$('#carousel-example-generic').hSlider();
```

You can also pass in the options for the Bootstrap carousel:

```js

$('#carousel-example-generic').hSlider({
  interval: false, // default
  pause: 'hover', // default,
  wrap: false //default
});
```

## Modifications

If you would like to change the names of the steps from the default generated, then you can add the **data-title** attribute on the div with the item class (ie. the slide div). Example:

You can also group certain titles using the **data-group** attribute, which is also added the same way. If you have the same data-group on several items, they show under the same group name.

```html

...
 <div class="item" data-title="Adult and Child disability (DLA/PIP)" data-group="Gathering Information">
  <div class="row">
    <div class="col-md-6">
      <label>Field name:</label>
      <input type="text" class="form-control">
      <label>Field name:</label>
      <input type="text" class="form-control">
      <label>Field name:</label>
      <input type="text" class="form-control">
      <label>Field name:</label>
      <input type="text" class="form-control">
    </div>
  </div>
</div>
...
```

## Disabling certain slides

A much needed feature in long forms / wizards is to dynamically control the slides so that you can disable some of them based on the data that has been given. This plugin allows us to remove and re-add selective slides.

To implement this using checkboxes with a special attribute. When the checkbox is selected the slide is active, and when its clicked on and it becomes unchecked, the mentioned slide in the attribute gets removed from the menu and the carousel. Rechecking it adds it back to the caoursel and menu.

Use the **data-hide-slide-number** attribute (where the slide number starts from 0 and is in the order as presented in the HTML). Since the slides are indexed on initiation, this number will not change if a slide before it is removed (obviously).

```html
<input type="checkbox" data-hide-slide-number="2" checked />
```





