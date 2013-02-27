/**
 * modo-markdownrender
 * ===========
 * description
 */
define([], function () {
    var waiting = [],
            ready = false;

    function requestInstance(callback) {
        if (!ready) {
            waiting.push(callback);
        } else {
            callback();
        }
    }

    (function () {
        var head = document.head || document.getElementsByTagName('head')[0];

        var s = document.createElement('script');
        s.onload = function () {
            ready = true;
            for (var i = 0; i < waiting.length; i++) {
                waiting[i]();
            }
        };
        s.src = 'lib/js/marked.js';

        head.appendChild(s);
    })();

    modo.MarkdownRender = function (params) {
        params || (params = {});

        params.el = $('<iframe></iframe>');

        modo.Element.call(this, params);

        this.addClass(modo.MarkdownRender.classNames[0]);

        var settings = {
            value:'',
            css:''
        };

        var that = this;

        var doc;

        function render() {
            doc = that.el[0].contentDocument;
            doc.open();
            doc.write('<html><head><style>' + settings.css + '</style></head>');
            doc.write(settings.value);
            doc.write('</html>');
            doc.close();
        }

        /**
         * Will set the content of the preview element to a specific value.
         * @param {String} value
         */
        this.set = function (value) {
            if (!ready) {
                requestInstance(function () {
                    that.set(value);
                });
                return;
            }
            settings.value = marked(value);
            render();
        };

        /**
         * Will take a CSS source string and apply it on the rendered content.
         * @param {String} source
         */
        this.css = function (source) {
            settings.css = source;
            render();
        }
    };

    modo.MarkdownRender.classNames = ['markdownrender'];

    modo.MarkdownRender.prototype = _.clone(modo.Element.prototype);
});