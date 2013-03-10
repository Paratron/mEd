/**
 * settings
 * ===========
 * description
 */
define(['text!default_styles.json'], function (css_styles) {
    return new (Backbone.Model.extend({
        defaults:{
            style:'github',
            style_css: null,
            styles_available:[]
        },
        initialize:function () {
            this.attributes.styles_available = JSON.parse(css_styles);
            this.set_style(this.attributes.style);
        },

        /**
         * This will set the CSS style of the HTML output.
         * @param style_name
         */
        set_style:function (style_name) {
            if (typeof this.attributes.styles_available[style_name] === 'undefined') {
                throw new Error('This style id does not exist.');
            }

            var s = this.attributes.styles_available[style_name],
                that = this;

            if (typeof s.data === 'undefined') {
                require(['text!styles/' + s.src], function (css) {
                    s.data = css;
                    that.set('style', style_name);
                    that.set('style_css', css);
                });
            } else {
                that.set('style', style_name);
                that.set('style_css', s.data);
            }
        }
    }))();
});