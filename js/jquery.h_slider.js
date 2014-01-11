/**
 * HSlider
 * Version: 0.0.1
 * URL: http://imars.info
 * Description: A simple extension over bootstraps carousel which allows it to be used as a wizard
 * Requires: JQuery, Bootstrap
 * Author: Mashhood Rastgar (imars.info)
 * Copyright: Copyright 2014 Marketlytics
 * License: OpenSource
 */

/**
 * TODO:
 * If you want to disable a section on init
 */

;
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'hSlider';

    var defaults = {
        interval: false,
        pause: 'hover',
        wrap: false
    };

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);
        this.$el = $(element);
        this.$el.data(name, this);
        this._defaults = defaults;

        var meta = this.$el.data(name + '-opts');
        this.opts = $.extend(this._defaults, options, meta);

        this.struct = {}; // contains the structure of the slider (to manage the menu and disabling)
        this.wrapper = null; // contains the wrapper object once it has been created
        this.navSelectClass = "h-slider-nav-select";
        this.navUlClass = "h-slider-nav-list";
        this.activeSlideAttr = "data-slide-number";
        this.hideSlideAttr = "data-hide-slide-number";

        this.init();
    }

    Plugin.prototype = {
        // Fetching different elements from within the object
        navSelect: function() {
            return this.wrapper.find('.' + this.navSelectClass).first();
        },

        navUl: function() {
            return this.wrapper.find('.' + this.navUlClass).first();
        },

        // Functions for the plugin

        generateStructure: function() {
            /**
             * Structure will be as follows:
             * {
             *    'Group Name' :  [{
             *        title: 'Slide title',
             *        disabled: false,
             *        position: 0, // number at which it is present
             *        content: $(this) // used when the slide is re-enabled
             *     },
             *     {
             *     ...
             *     }],
             *
             *     'Another Group' : [...]
             * }
             */
            var struct = {};
            var slideCount = 0;
            var _this = this;
            this.$el.find('.item').each(function() {
                var item = $(this);
                item.attr(_this.activeSlideAttr, slideCount);
                var title = item.attr('data-title');
                var group = item.attr('data-group');
                if (typeof title === "undefined") {
                    title = "Slide " + (slideCount + 1);
                }

                if (typeof group === "undefined") {
                    group = "";
                }

                if (typeof struct[group] === "undefined") {
                    struct[group] = [];
                }

                struct[group].push({
                    title: title,
                    disabled: false,
                    position: slideCount,
                    content: item
                });

                slideCount++;
            });

            this.struct = struct;
        },

        generateScaffolding: function() {
            // generates the HTML for the menu and adds it
            // also adds the responsive classes
            this.$el.wrap('<div class="h-slider col-lg-8"><div class="row"></div></div>');
            this.wrapper = this.$el.parent();
            var inject = '' +
                '<div class="col-lg-3 col-md-3 col-sm-12 slides">' +
                '<select class="visible-sm visible-xs form-control ' + this.navSelectClass + '"></select>' +
                '<ul class="hidden-sm hidden-xs ' + this.navUlClass + '"></ul>' +
                '</div>';
            this.wrapper.prepend(inject);
            $(this).addClass("col-lg-9 col-md-9 col-sm-12");
        },

        createMenu: function() {
            // generates the HTML for the menu and select
            var select = this.navSelect();
            var ul = this.navUl();
            var _this = this;
            // reset their content
            select.html('');
            ul.html('');
            var dataset = this.struct;
            for (var key in dataset) {
                ul.append("<li><h4>" + key + "</h4></li>");
                var subUl = $("<ul></ul>");
                ul.append(subUl);
                select.append("<optgroup label='" + key + "'>");
                for (var stepObj in dataset[key]) {
                    var slide = dataset[key][stepObj];
                    if (!slide.disabled) {
                        select.append("<option " + this.activeSlideAttr + "=\"" + slide.position + "\">" + slide.title + "</option>");
                        subUl.append("<li " + this.activeSlideAttr + "=\"" + slide.position + "\"><a href='#'>" + slide.title + "</a></li>");
                    }
                }
                select.append("</optgroup>");
            }

            ul.find('a').click(function() {
                var slideToSwitch = $(this).parent().attr(_this.activeSlideAttr);
                _this.$el.carousel(parseInt(slideToSwitch, 10));
                return false;
            });

            select.change(function() {
                _this.$el.carousel($(this)[0].selectedIndex);
            });
        },

        paintMenu: function() {
            // adds the active classes
            var activeSlide = this.$el.find('.item.active').first();
            activeSlide.scrollTop(0);
            var activeSlideNumber = activeSlide.attr(this.activeSlideAttr);
            var _this = this;

            this.navSelect().find('option').each(function() {
                if ($(this).attr(_this.activeSlideAttr) == activeSlideNumber) {
                    $(this).attr("selected", "selected");
                } else {
                    $(this).removeAttr("selected");
                }
            });

            this.navUl().find('ul').each(function() {
                $(this).hide();
            });

            this.navUl().find('li').each(function() {
                if ($(this).attr(_this.activeSlideAttr) == activeSlideNumber) {
                    $(this).addClass("active");
                    $(this).parent().show();
                } else {
                    $(this).removeClass("active");
                }
            });
        },

        toggleSlide: function(disabled, number) {
            var dataset = this.struct;
            var _this = this;
            for (var key in dataset) {
                for (var slideKey in dataset[key]) {
                    var slide = dataset[key][slideKey];
                    if (slide.position == number) {
                        slide.disabled = disabled;
                        if (!disabled) {
                            slide.content.insertAfter(
                                this.$el.find('[' + this.activeSlideAttr + '="' + (number - 1) + '"]')
                            );
                        } else {
                            this.$el.find('.item').each(function() {
                                if ($(this).attr(_this.activeSlideAttr) == number) {
                                    $(this).remove();
                                    return;
                                }
                            });
                        }
                    }
                }
            }
        },

        init: function() {
            var _this = this;
            this.$el.carousel(this.options);
            this.generateStructure();
            this.generateScaffolding();
            this.createMenu();
            this.paintMenu();

            // repaint every time the carousel slides
            this.$el.on('slid.bs.carousel', function() {
                _this.paintMenu();
            });

            // disable enable slides when the checkbox is checked
            this.$el.find('[' + this.hideSlideAttr + ']').change(function() {
                var slideNumber = $(this).attr(_this.hideSlideAttr);
                if ($(this).is(":checked"))
                    _this.toggleSlide(false, slideNumber);
                else
                    _this.toggleSlide(true, slideNumber);

                _this.createMenu();
                _this.paintMenu();
            });
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, document, window);