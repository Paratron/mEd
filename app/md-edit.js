/**
 * md-edit
 * =======
 * description
 */

require.config({
    //urlArgs:"bust=" + (new Date()).getTime() //Remove after development
});

define(['ui/base', 'text!templates/default.md', 'text!default_styles.json', 'modules/gear'], function (ui, txt_md_default, css_styles, gear) {
    gui = ui;

    css_styles = JSON.parse(css_styles);

    var cm,
            actions;


    function load_style(name) {
        require(['text!styles/' + css_styles[name].src], function (css) {
            ui.preview.css(css);
        });
    }

    load_style(gear.get('style'));

    /**
     * This actions can bei either invoked by the toolbar, or by a hotkey.
     * @type {Object}
     */
    actions = {
        newdoc:function () {
            cm.setValue('');
        },
        save:function () {

        },
        bold:function () {
            var selection = cm.getSelection(),
                    cursor = cm.getCursor();
            cm.replaceSelection('**' + selection + '**');
            if (!selection) {
                cursor.ch += 2;
                cm.setCursor(cursor);
            }
            cm.focus();
        },
        italic:function () {
            var selection = cm.getSelection(),
                    cursor = cm.getCursor();
            cm.replaceSelection('*' + selection + '*');
            if (!selection) {
                cursor.ch += 1;
                cm.setCursor(cursor);
            }
            cm.focus();
        },
        quote:function () {
            var cursor = cm.getCursor(),
                    line = cm.getLine(cursor.line);

            cm.setLine(cursor.line, '> ' + line);
            cursor.ch += 2;
            cm.setCursor(cursor);
        },
        link:function () {
            var selection = cm.getSelection(),
                    cursor = cm.getCursor(true);

            if (selection.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/)) {
                cm.replaceSelection('[](' + selection + ')');
                cursor.ch += 1;
            } else {
                cm.replaceSelection('[' + selection + ']()');
                cursor.ch += 3 + selection.length;
            }
            cm.setCursor(cursor);
            cm.focus();
        },
        settings:function () {
            require(['ui/settings'], function (settings_ui) {
                settings_ui.pop_settings.open();
            });
        }
    };

    /**
     * Whenever a change is made to the codemirror element, forward the content
     * to the preview element.
     */
    ui.codemirror.on('change', function (content) {
        ui.preview.set(content);
    });

    /**
     * When the codemirror is ready with its creation process, get a reference
     * of the cm object for usage in the action functions.
     * Also, the codemirror element is being focused.
     */
    ui.codemirror.once('ready', function () {
        cm = ui.codemirror.cm;
        ui.codemirror.set(txt_md_default);
        ui.codemirror.focus();
    });

    /**
     * Whenever a button on the toolbar is clicked, invoke the according action,
     * if available.
     */
    ui.toolbar.on('click', function (e, key) {
        if (typeof actions[key] === 'function') {
            actions[key]();
        }
    });

    /**
     * Listen to a couple of hotkeys and invoke the according action.
     */
    modo.key_listener.enable();
    var strokes = {
        'ctrl+b':'bold',
        'ctrl+i':'italic',
        'ctrl+q':'quote',
        'alt+l':'link',
        'alt+n':'newdoc',
        'ctrl+alt+s':'settings'
    };
    modo.key_listener.on('stroke', function (e, stroke) {
        if (typeof strokes[stroke] === 'undefined') return;
        actions[strokes[stroke]]();
        e.preventDefault();
        e.stopPropagation();
    });

    /**
     * Throw the whole UI construct at the DOM.
     */
    modo.init(ui.root);
});