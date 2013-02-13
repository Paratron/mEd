/**
 * base.js
 * ===========
 * Generates the UI base.
 */
define(['modo/modo-codemirror', 'modo/modo-markdownrender'], function(){
    return modo.generate([
        {
            type: 'FlexContainer',
            ref: 'root',
            params: {
                direction: modo.FlexContainer.VERTICAL
            },
            children: [
                {
                    type: 'Container',
                    params: {
                        className: 'toolbar'
                    }
                },
                {
                    type: 'FlexContainer',
                    flexible: true,
                    params: {
                        className: 'workspace',
                        direction: modo.FlexContainer.HORIZONTAL
                    },
                    children: [
                        {
                            type: 'CodeMirror',
                            ref: 'codemirror',
                            params: {
                                className: 'markdown-editor',
                                mode: 'markdown',
                                lineNumbers: true
                            }
                        },
                        {
                            type: 'MarkdownRender',
                            flexible: true,
                            ref: 'preview',
                            params: {
                                className: 'html-preview'
                            }
                        }
                    ]
                }
            ]
        }
    ]);
});