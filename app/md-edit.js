/**
 * md-edit
 * =======
 * description
 */

require.config({
    //urlArgs:"bust=" + (new Date()).getTime() //Remove after development
});

define(['ui/base', 'text!templates/default.md', 'modules/gear'], function (ui, txt_md_default, gear) {
    gui = ui;

    var cm,
            actions;

    /**
     * This actions can bei either invoked by the toolbar, or by a hotkey.
     * @type {Object}
     */
    actions = {
        newdoc:function () {
            cm.setValue('');
            cm.focus();
        },
        save:function () {
            ui.mnu_save.show_at_element(ui.toolbar.get_element_by_key('save'));
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
        list:function () {
            var selection,
                    cursor,
                    line,
                    md,
                    i;

            md = '';

            selection = cm.getSelection();

            cursor = cm.getCursor(true);

            if (!selection) {
                line = cm.getLine(cursor.line);
                if (cursor.line > 0) {
                    line += cm.getLine(cursor.line - 1);
                }

                if (line) {
                    md += '\n\n';
                    cursor.line += 2;
                }

                md += '* ';
                cursor.ch = 2;
            } else {
                selection = selection.split('\n');
                for (i = 0; i < selection.length; i++) {
                    md += '* ' + selection[i] + '\n';
                }
            }

            cm.replaceSelection(md);
            cm.setCursor(cursor);
            cm.focus();
        },
        table:function () {
            var input,
                    cols,
                    rows,
                    cursor,
                    line,
                    md,
                    i,
                    j;

            input = prompt('How many columns and rows should the table have?\nEnter in format: COLS:ROWS', '3:5');

            if (!input) {
                return;
            }

            input = input.split(':');

            cols = parseInt(input[0]);
            rows = parseInt(input[1]);

            if (cols < 1 || rows < 1) {
                alert('Illegal input.');
            }

            rows++;

            //Generate the markdown code.
            md = '';

            cursor = cm.getCursor(true);

            line = cm.getLine(cursor.line);
            if (cursor.line > 0) {
                line += cm.getLine(cursor.line - 1);
            }

            if (line) {
                md += '\n\n';
            }

            for (i = 0; i < rows; i++) {
                for (j = 0; j < cols; j++) {
                    if (j) {
                        md += ' | ';
                    }
                    if (!i) {
                        md += 'Header          '
                    } else {
                        md += 'Cell            ';
                    }
                }

                if (!i) {
                    md += '\n';
                    for (j = 0; j < cols; j++) {
                        if (j) {
                            md += ' | ';
                        }
                        md += '----------------';
                    }
                }

                md += '\n';
            }

            md += '\n';

            cm.replaceSelection(md);

            cm.setCursor(cursor);

            cm.focus();
        },
        settings:function () {
            require(['ui/settings'], function (settings_ui) {
                settings_ui.pop_settings.open();
            });
        }
    };

    var menu_actions = {
        md_localstorage:function () {

        },

        md_gist:function () {

        },

        md_dropbox:function () {

        },

        html_download:function () {
            require(['modules/clientside_download'], function (fs) {
                var data = ui.preview.get();
                fs.save_text('mEd-render.html', data);
            });
        }
    };

    ui.mnu_save.on('select', function (key) {
        menu_actions[key]();
    });

    /**
     * Whenever a change is made to the codemirror element, forward the content
     * to the preview element.
     */
    ui.codemirror.on('change', function (content) {
        localStorage.setItem('med_backup', content);
        ui.preview.set(content);
    });

    /**
     * When the codemirror is ready with its creation process, get a reference
     * of the cm object for usage in the action functions.
     * Also, the codemirror element is being focused.
     */
    var ignore_scroll;
    ui.codemirror.once('ready', function () {
        cm = ui.codemirror.cm;
        var backup = localStorage.getItem('med_backup');
        if (backup) {
            txt_md_default = backup;
        }
        ui.codemirror.set(txt_md_default);
        ui.codemirror.focus();

        //A little hack that is needed to fix codemirror's width.
        $cm_box = $('.CodeMirror-scroll');
        setInterval(function () {
            var the_width = ui.root.el.width() / 2;

            $cm_box.css({
                width:the_width
            });

            ui.codemirror.el.width(the_width);
        }, 500);

        function scrollUpdate() {
            if (!gear.get('scroll_lock') || ignore_scroll) {
                return;
            }
            var s = cm.getScrollInfo();
            var sb_height = s.clientHeight / (s.height / 100);
            var max_scroll = (s.height / 100) * (100 - sb_height);
            var scroll_percentage = s.top / (max_scroll / 100);

            ui.preview.scrollTo(scroll_percentage);
        }


        cm.on('scroll', scrollUpdate);
        cm.on('cursorActivity', scrollUpdate);

        gear.on('change:editor_theme', function () {
            cm.setOption('theme', gear.get('editor_theme'));
        });
        cm.setOption('theme', gear.get('editor_theme'));
    });

    var ig_timeout;
    ui.preview.once('ready', function () {
        this.on('scroll', function (s) {
            if (!gear.get('scroll_lock')) {
                return;
            }

            var sb_height = s.clientHeight / (s.height / 100);
            var max_scroll = (s.height / 100) * (100 - sb_height);
            var scroll_percentage = s.top / (max_scroll / 100);


            var s2 = ui.codemirror.cm.getScrollInfo();
            var sb_height2 = s2.clientHeight / (s2.height / 100);
            var msv = (s2.height / 100) * (100 - sb_height2);
            ignore_scroll = true;
            ui.codemirror.cm.scrollTo(0, (msv / 100) * scroll_percentage);
            clearTimeout(ig_timeout);
            ig_timeout = setTimeout(function () {
                ignore_scroll = false;
            }, 1);
        });
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
        'alt+u':'link',
        'alt+l':'list',
        'alt+t':'table',
        'alt+n':'newdoc',
        'ctrl+alt+s':'settings',
        'alt+s':'save'
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