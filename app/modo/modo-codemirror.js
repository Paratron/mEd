/**
 * modo-codemirror.js
 * ==================
 * A CodeMirror Element for the modo library.
 */
define([], function () {
    var waiting = [],
        ready = false,
        waiting_for_mode = {},
        head = document.head || document.getElementsByTagName('head')[0];

    function requestCodeMirror(callback) {
        if (!ready) {
            waiting.push(callback);
        } else {
            callback();
        }
    }

    function requestMode(name, callback){
        if(typeof CodeMirror.modes[name] !== 'undefined'){
            callback();
            return;
        }
        if(typeof waiting_for_mode[name] === 'undefined'){
            waiting_for_mode[name] = [];
            var s = document.createElement('script');
            s.onload = function(){
                for(var i = 0; i < waiting_for_mode[name].length; i++){
                    waiting_for_mode[name][i]();
                }
                waiting_for_mode[name] = undefined;
            };
            s.src = 'lib/js/modes/' + name + '.js';
            head.appendChild(s);
        }
        waiting_for_mode[name].push(callback);
    }

    (function () {
        var s = document.createElement('script');
        s.onload = function () {
            ready = true;
            for (var i = 0; i < waiting.length; i++) {
                waiting[i]();
            }
        };
        s.src = 'lib/js/codemirror.js';

        head.appendChild(s);

        var c = document.createElement('link');
        c.rel = 'stylesheet';
        c.type = 'text/css';
        c.href = 'lib/css/codemirror.css';
        head.appendChild(c);
    })();

    modo.CodeMirror = function (params) {
        params || (params = {});

        modo.Element.call(this, params);

        var settings = {
            mode:params.mode || 'javascript',
            lineNumbers:params.lineNumbers || false
        };

        this.addClass(modo.CodeMirror.classNames[0]);

        var that = this;

        this.cm = undefined;

        requestCodeMirror(function () {
            that.cm = CodeMirror(that.el[0], {
                mode:settings.mode,
                lineNumbers:settings.lineNumbers
            });

            if(typeof CodeMirror.modes[settings.mode] === 'undefined'){
                requestMode(settings.mode, function(){
                    that.cm.setOption('mode', settings.mode);
                });
            }

            //@TODO: remove this
            comir = that.cm;

            var wrap = that.cm.getWrapperElement();
            setInterval(function () {
                wrap.style.height = that.el.height() + 'px';
            }, 1000);

            that.cm.on('change', function (i, c) {
                that.trigger('change', that.get());
            });

            that.trigger('ready');
        });

        this.focus = function () {
            this.cm.focus();
        }

        this.get = function () {
            return this.cm.getValue();
        };

        this.set = function (data, options) {
            var silent;

            options || (options = {});

            silent = options.silent;

            this.cm.setValue(data);

            if (!silent) {
                this.trigger('change', data);
            }

            return this;
        }
    };

    modo.CodeMirror.classNames = ['codemirror'];

    modo.CodeMirror.prototype = _.clone(modo.Element.prototype);

    return true;
});