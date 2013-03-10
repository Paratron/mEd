/**
 * base.js
 * ===========
 * Generates the UI base.
 */
define(['modo/modo-codemirror', 'modo/modo-markdownrender'], function () {
    return modo.generate([
        {
            type:'FlexContainer',
            ref:'root',
            params:{
                direction:modo.FlexContainer.VERTICAL
            },
            children:[
                {
                    type:'FlexContainer',
                    params: {
                        className:'toolbar'
                    },
                    children:[
                        {
                            type:'Image',
                            params:{
                                className: 'mEd-icon',
                                tooltip: 'markdown Editor.',
                                value:'lib/img/mEd-icon.svg'
                            }
                        },
                        {
                            type:'Toolbar',
                            ref:'toolbar',
                            flexible: true,
                            params:{
                                elements:[
                                    [
                                        {
                                            key:'newdoc',
                                            tooltip:'New Document (ALT+N)',
                                            className:'icon-file'
                                        },
                                        {
                                            key:'open',
                                            tooltip:'Open Document (ALT+O)',
                                            className:'icon-upload'
                                        },
                                        {
                                            key:'save',
                                            tooltip:'Save Document (ALT+S)',
                                            className:'icon-download'
                                        }
                                    ],
                                    [
                                        {
                                            key:'bold',
                                            tooltip:'Bold Format (CTRL+B)',
                                            className:'icon-bold'
                                        },
                                        {
                                            key:'italic',
                                            tooltip:'Italic Format (CTRL+I)',
                                            className:'icon-italic'
                                        },
                                        {
                                            key:'quote',
                                            tooltip:'Quote (CTRL+Q)',
                                            className:'icon-quotes-left'
                                        }
                                    ],
                                    [
                                        {
                                            key:'link',
                                            tooltip:'Link (ALT+L)',
                                            className:'icon-link'
                                        },
                                        {
                                            key:'image',
                                            tooltip:'Image',
                                            className:'icon-image'
                                        },
                                        {
                                            key:'code',
                                            tooltip:'Code',
                                            className:'icon-code'
                                        },
                                        {
                                            key:'list',
                                            tooltip:'Insert List',
                                            className:'icon-list'
                                        },
                                        {
                                            key:'line',
                                            tooltip:'Horizontal Ruler',
                                            className:'icon-minus'
                                        },
                                        {
                                            key:'table',
                                            tooltip:'Insert Table',
                                            className:'icon-table'
                                        }
                                    ],
                                    [
                                        {
                                            key:'settings',
                                            tooltip:'Settings (CTRL+ALT+S)',
                                            className:'icon-cog'
                                        }
                                    ]
                                ]
                            }
                        }
                    ]
                },
                {
                    type:'FlexContainer',
                    flexible:true,
                    params:{
                        className:'workspace',
                        direction:modo.FlexContainer.HORIZONTAL
                    },
                    children:[
                        {
                            type:'CodeMirror',
                            ref:'codemirror',
                            params:{
                                className:'markdown-editor',
                                mode:'markdown',
                                lineNumbers:true
                            }
                        },
                        {
                            type:'MarkdownRender',
                            flexible:true,
                            ref:'preview',
                            params:{
                                className:'html-preview'
                            }
                        }
                    ]
                },
                {
                    type:'Menu',
                    ref:'mnu_save',
                    params:{
                        elements:[
                            {
                                ref: 'md_localstorage',
                                label:'Save Markdown in LocalStorage',
                                hotkey: 'l',
                                icon:'layer'
                            },
                            {
                                ref: 'md_gist',
                                label:'Save Markdown as GitHub Gist',
                                hotkey: 'g',
                                icon:'github',
                                disabled: true
                            },
                            {
                                ref: 'md_dropbox',
                                label:'Save Markdown in Dropbox',
                                hotkey: 'd',
                                icon:'box',
                                disabled: true
                            },
                            {}, //Divider
                            {
                                ref: 'html_download',
                                label: 'Download rendered HTML'
                            }
                        ]
                    }
                }
            ]
        }
    ]);
});