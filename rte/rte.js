/*
Copyright (C) 2010 kuberam.ro - Claudius Teodorescu. All rights reserved.
 
Released under LGPL License - http://gnu.org/licenses/lgpl.html.
*/

exsltforms.rte = {
  	//function to register editors
	registerEditors : function() {
		exsltforms.utils.pollingConditions[ 'textarea2rte_register' ] = {
			testedValue: function() { return ( XsltForms_globals.body != null ) },
			executedFunction: function() {
				var textareas = document.querySelectorAll("textarea[appearance^='exfk:']");
				var registry = exsltforms.registry;
				for (var i=0, il = textareas.length; i < il; ++i) {
					var textarea = textareas[i];
					var editorId = textarea.id;
					var editorType = registry.textarea2rte[ editorId ].editorType;
					if (editorId in exsltforms.registry.textarea2rte) {
					} else {
						var clonededitorId = textarea.attributes[ 'oldid' ].nodeValue;
						registry.textarea2rte[ editorId ] = {};
						registry.textarea2rte[ editorId ].editorType = exsltforms.registry.textarea2rte[ clonededitorId ].editorType;
						registry.textarea2rte[ editorId ].id = editorId;
						registry.textarea2rte[ editorId ].XFtextareaID = textarea.parentNode.parentNode.parentNode.parentNode.attributes[ 'id' ].nodeValue;
						registry.textarea2rte[ editorId ].incremental = exsltforms.registry.textarea2rte[ clonededitorId ].incremental;
						registry.textarea2rte[ editorId ].editorContentModified = 'no';
						registry.textarea2rte[ editorId ].processContentOnSave = exsltforms.rte.generalFunctions.processContentOnSave;
						registry.textarea2rte[ editorId ].processContentOnUpdate = exsltforms.rte.generalFunctions.processContentOnUpdate;
						registry.textarea2rte[ editorId ].nativeConfigOptionsObject = exsltforms.registry.textarea2rte[ clonededitorId ].nativeConfigOptionsObject;
					}
					if (editorType in {Xinha: 1, DojoEditor: 1, YUIEditor: 1}) {
					} else {
						exsltforms.rte.specificFunctions[editorType].beforeRendering(registry.textarea2rte[editorId].nativeConfigOptionsObject);
						exsltforms.rte.generateEditor(editorType, editorId, registry.textarea2rte[ editorId ].nativeConfigOptionsObject);
					}
				}

				exsltforms.utils.pollTestedValues[ 'textarea2rte_registered' ] = true;
			}
		}
		exsltforms.utils.poll( 'textarea2rte_register' );
	},
	//function to generate and render editors in a single pass
	generateEditors : function( generatedEditorType ) {
			for (var editorId in exsltforms.registry.textarea2rte) {
				if ( exsltforms.registry.textarea2rte[ editorId ].editorType == 'YUIEditor' ) {
					switch ( exsltforms.registry.textarea2rte[ editorId ].nativeConfigOptionsObject.YUIeditorType ) {
						case "Editor":
							new YAHOO.widget.Editor( editorId, exsltforms.registry.textarea2rte[ editorId ].nativeConfigOptionsObject );
						break;
						case "SimpleEditor":
							new YAHOO.widget.SimpleEditor( editorId, exsltforms.registry.textarea2rte[ editorId ].nativeConfigOptionsObject );
						break;
					}
					exsltforms.rte.generateEditor( 'YUIEditor', editorId, exsltforms.registry.textarea2rte[ editorId ].nativeConfigOptionsObject, '' );
					exsltforms.rte.generalFunctions.addXFupdateListener( editorId );
				}
			}
	}, 
	//function to generate and render editors one by one
	generateEditor : function(editorType, editorId, nativeConfigOptionsObject) {
			var generalFunctions = exsltforms.rte.generalFunctions;
			var specificFunctions = exsltforms.rte.specificFunctions;
				switch ( editorType ) {
					case "CKEditor":
						CKEDITOR.replace( document.getElementById(editorId), nativeConfigOptionsObject );						
						CKEDITOR.instances[editorId].on("instanceReady", function() {
							this.on("blur", function() {exsltforms.rte.generalFunctions.saveEditorContent(editorId, this.document.$.activeElement.innerHTML); } );
							if (exsltforms.registry.textarea2rte[ editorId ].incremental == 'true') {
								this.on("key", function() {exsltforms.rte.generalFunctions.saveEditorContent( editorId, this.document.$.activeElement.innerHTML );});
								this.on("paste", function() {exsltforms.rte.generalFunctions.saveEditorContent( editorId, this.document.$.activeElement.innerHTML );});
							}
						});	
//						CKEDITOR.instances[editorId].document.on('keyup', function(event) {
//							alert('a');
//						});						
					break;
					case "EditArea":
						nativeConfigOptionsObject.id = editorId;
						nativeConfigOptionsObject['save_callback'] = 'exsltforms.rte.specificFunctions.saveEditAreaContent';
						editAreaLoader.init(nativeConfigOptionsObject);
					break;
					case "YUIEditor":
// 					exsltforms.utils.pollingConditions[ 'generateYUIEditors' ] = {
// 						testedValue: function() { return typeof YAHOO.widget.EditorInfo != 'undefined' },
// 						executedFunction: function() {
						new YAHOO.widget.Editor(editorId, exsltforms.registry.textarea2rte[ editorId ].nativeConfigOptionsObject);
						YAHOO.widget.EditorInfo._instances[ editorId ].on( 'editorWindowBlur', function() {exsltforms.rte.generalFunctions.saveEditorContent( editorId, this._getDoc().body.innerHTML ); } );
						if (exsltforms.registry.textarea2rte[ editorId ].incremental == 'true' ) {
							YAHOO.widget.EditorInfo._instances[ editorId ].on('afterNodeChange', function() {exsltforms.rte.generalFunctions.saveEditorContent( editorId, this._getDoc().body.innerHTML ); } );
						}
						specificFunctions[exsltforms.registry.textarea2rte[editorId].editorType].beforeRendering( exsltforms.registry.textarea2rte[ editorId ].nativeConfigOptionsObject );
						YAHOO.widget.EditorInfo._instances[ editorId ].render();
// 						}
// 					}
// 					exsltforms.utils.poll( 'generateYUIEditors' );
					break;
					case "DojoEditor":
						dojo.addOnLoad(function() {
							new dijit.Editor(exsltforms.registry.textarea2rte[ editorId ].nativeConfigOptionsObject, dojo.byId( editorId ));
							dojo.connect(dijit.byId( editorId ), "onBlur", function( editorContent ) {exsltforms.rte.generalFunctions.saveEditorContent( this.id, dijit.registry._hash[ this.id ].document.activeElement.innerHTML ); });
							if (exsltforms.registry.textarea2rte[ editorId ].incremental == 'true' ) {
								dojo.connect( dijit.byId( editorId ), "onNormalizedDisplayChanged", function( event ) {exsltforms.rte.generalFunctions.saveEditorContent( this.id, dijit.registry._hash[ this.id ].document.activeElement.innerHTML ); } );
							}
						});
					break;
				}
				exsltforms.rte.generalFunctions.addXFupdateListener(editorId);
	},
	//specific functions for editors
	specificFunctions : {
		DojoEditor : {
			setEditorContent : function( editorId, editorContent ) { dijit.byId( editorId ).setValue( exsltforms.registry.textarea2rte[ editorId ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		CKEditor : {
			setEditorContent : function( editorId, editorContent ) { CKEDITOR.instances[ editorId ].setData( exsltforms.registry.textarea2rte[ editorId ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		EditArea : {
			setEditorContent : function( editorId, editorContent ) { editAreaLoader.setValue( editorId, exsltforms.registry.textarea2rte[ editorId ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		YUIEditor : {
			setEditorContent : function( editorId, editorContent ) { YAHOO.widget.EditorInfo._instances[ editorId ].setEditorHTML( exsltforms.registry.textarea2rte[ editorId ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		Xinha : {
			setEditorContent : function(editorId, editorContent) {xinha_editors[editorId].setHTML( exsltforms.registry.textarea2rte[ editorId ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function(nativeConfigOptionsObject) {alert(nativeConfigOptionsObject)}
		},
		saveEditAreaContent : function( editorId, editorContent ) {
			exsltforms.rte.generalFunctions.saveEditorContent( editorId, editorContent );
		},
		saveDojoContent : function( editorId ) {
			
		}
	},
	//general functions for editors
	generalFunctions : {
		processContentOnSave	: function( editorContent ) {return editorContent.replace(/&nbsp;/gi, "&#160;");},
		processContentOnUpdate	: function( editorContent ) {return editorContent;},
		addXFupdateListener	: function(editorId) {				
			new XsltForms_listener(XsltForms_globals.body.xfSubform, document.getElementById(exsltforms.registry.textarea2rte[editorId].XFtextareaID), null, "xforms-value-changed", null, function( evt ) {
				exsltforms.rte.generalFunctions.updateEditorContent( editorId );
			});
		},
		updateEditorContent	: function( editorId ) {
			if ( exsltforms.registry.textarea2rte[ editorId ].editorContentModified == 'yes' ) {
				exsltforms.registry.textarea2rte[editorId].editorContentModified = 'no';
			} else {
				exsltforms.rte.specificFunctions[ exsltforms.registry.textarea2rte[ editorId ].editorType ].setEditorContent( editorId, document.getElementById( exsltforms.registry.textarea2rte[ editorId ].id ).value );
			}
		},
		saveEditorContent	: function(editorId, editorContent) {
			var textareaContent = document.getElementById(editorId).value;
			setTimeout(
				function() {
					if (textareaContent !== editorContent) {
						exsltforms.registry.textarea2rte[ editorId ].editorContentModified = 'yes';
						var editorContentProcessedOnSave = exsltforms.registry.textarea2rte[ editorId ].processContentOnSave( editorContent );
						XsltForms_control.getXFElement(document.getElementById( exsltforms.registry.textarea2rte[editorId].XFtextareaID)).valueChanged(editorContentProcessedOnSave || "");
					}
				},
			0);
		}
	}	
};
