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
					var editorID = textarea.id;
					var editorType = registry.textarea2rte[ editorID ].editorType;
					if ( editorID in exsltforms.registry.textarea2rte ) {
					} else {
						var clonedEditorID = textarea.attributes[ 'oldid' ].nodeValue;
						registry.textarea2rte[ editorID ] = {};
						registry.textarea2rte[ editorID ].editorType = exsltforms.registry.textarea2rte[ clonedEditorID ].editorType;
						registry.textarea2rte[ editorID ].id = editorID;
						registry.textarea2rte[ editorID ].XFtextareaID = textarea.parentNode.parentNode.parentNode.parentNode.attributes[ 'id' ].nodeValue;
						registry.textarea2rte[ editorID ].incremental = exsltforms.registry.textarea2rte[ clonedEditorID ].incremental;
						registry.textarea2rte[ editorID ].editorContentModified = 'no';
						registry.textarea2rte[ editorID ].processContentOnSave = exsltforms.rte.generalFunctions.processContentOnSave;
						registry.textarea2rte[ editorID ].processContentOnUpdate = exsltforms.rte.generalFunctions.processContentOnUpdate;
						registry.textarea2rte[ editorID ].nativeConfigOptionsObject = exsltforms.registry.textarea2rte[ clonedEditorID ].nativeConfigOptionsObject;
						registry.textarea2rte[ editorID ].nativeConfigOptionsString = exsltforms.registry.textarea2rte[ clonedEditorID ].nativeConfigOptionsString;
					}
					if ( editorType in { Xinha: 1, DojoEditor: 1, YUIEditor: 1 } ) {
					} else {
						exsltforms.rte.specificFunctions[editorType].beforeRendering(registry.textarea2rte[editorID].nativeConfigOptionsObject);
						exsltforms.rte.generateEditor(editorType, editorID, registry.textarea2rte[ editorID ].nativeConfigOptionsObject, registry.textarea2rte[ editorID ].nativeConfigOptionsString );
					}
				}

				exsltforms.utils.pollTestedValues[ 'textarea2rte_registered' ] = true;
			}
		}
		exsltforms.utils.poll( 'textarea2rte_register' );
	},
	//function to generate and render editors in a single pass
	generateEditors : function( generatedEditorType ) {
			for (var editorID in exsltforms.registry.textarea2rte) {
				if ( exsltforms.registry.textarea2rte[ editorID ].editorType == 'YUIEditor' ) {
					switch ( exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject.YUIeditorType ) {
						case "Editor":
							new YAHOO.widget.Editor( editorID, exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject );
						break;
						case "SimpleEditor":
							new YAHOO.widget.SimpleEditor( editorID, exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject );
						break;
					}
					exsltforms.rte.generateEditor( 'YUIEditor', editorID, exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject, '' );
					exsltforms.rte.generalFunctions.addXFupdateListener( editorID );
				}
			}
	}, 
	//function to generate and render editors one by one
	generateEditor : function(editorType, editorID, nativeConfigOptionsObject, nativeConfigOptionsString) {
			var generalFunctions = exsltforms.rte.generalFunctions;
			var specificFunctions = exsltforms.rte.specificFunctions;
				switch ( editorType ) {
					case "CKEditor":
						CKEDITOR.replace( document.getElementById(editorID), nativeConfigOptionsObject );						
						CKEDITOR.instances[editorID].on("instanceReady", function() {
							this.on("blur", function() {exsltforms.rte.generalFunctions.saveEditorContent(editorID, this.document.$.activeElement.innerHTML); } );
							if (exsltforms.registry.textarea2rte[ editorID ].incremental == 'true') {
								this.on("key", function() {exsltforms.rte.generalFunctions.saveEditorContent( editorID, this.document.$.activeElement.innerHTML );});
								this.on("paste", function() {exsltforms.rte.generalFunctions.saveEditorContent( editorID, this.document.$.activeElement.innerHTML );});
							}
						});	
//						CKEDITOR.instances[editorID].document.on('keyup', function(event) {
//							alert('a');
//						});						
					break;
					case "EditArea":
						var nativeConfigOptionsStringProcessed = nativeConfigOptionsString.substring(nativeConfigOptionsString.indexOf('{') + 1, nativeConfigOptionsString.lastIndexOf('}'));
						specificFunctions[ exsltforms.registry.textarea2rte[ editorID ].editorType ].beforeRendering( exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject );
						editAreaLoader.init(eval('(' + '{ id:\"' + editorID + '\", ' + nativeConfigOptionsStringProcessed + ', save_callback: "exsltforms.rte.specificFunctions.saveEditAreaContent"}' + ')'));
					break;
					case "YUIEditor":
// 					exsltforms.utils.pollingConditions[ 'generateYUIEditors' ] = {
// 						testedValue: function() { return typeof YAHOO.widget.EditorInfo != 'undefined' },
// 						executedFunction: function() {
						new YAHOO.widget.Editor(editorID, exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject);
						YAHOO.widget.EditorInfo._instances[ editorID ].on( 'editorWindowBlur', function() {exsltforms.rte.generalFunctions.saveEditorContent( editorID, this._getDoc().body.innerHTML ); } );
						if (exsltforms.registry.textarea2rte[ editorID ].incremental == 'true' ) {
							YAHOO.widget.EditorInfo._instances[ editorID ].on('afterNodeChange', function() {exsltforms.rte.generalFunctions.saveEditorContent( editorID, this._getDoc().body.innerHTML ); } );
						}
						specificFunctions[exsltforms.registry.textarea2rte[editorID].editorType].beforeRendering( exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject );
						YAHOO.widget.EditorInfo._instances[ editorID ].render();
// 						}
// 					}
// 					exsltforms.utils.poll( 'generateYUIEditors' );
					break;
					case "DojoEditor":
						dojo.addOnLoad(function() {
							new dijit.Editor(exsltforms.registry.textarea2rte[ editorID ].nativeConfigOptionsObject, dojo.byId( editorID ));
							dojo.connect(dijit.byId( editorID ), "onBlur", function( editorContent ) {exsltforms.rte.generalFunctions.saveEditorContent( this.id, dijit.registry._hash[ this.id ].document.activeElement.innerHTML ); });
							if (exsltforms.registry.textarea2rte[ editorID ].incremental == 'true' ) {
								dojo.connect( dijit.byId( editorID ), "onNormalizedDisplayChanged", function( event ) {exsltforms.rte.generalFunctions.saveEditorContent( this.id, dijit.registry._hash[ this.id ].document.activeElement.innerHTML ); } );
							}
						});
					break;
				}
				exsltforms.rte.generalFunctions.addXFupdateListener(editorID);
	},
	//specific functions for editors
	specificFunctions : {
		DojoEditor : {
			setEditorContent : function( editorID, editorContent ) { dijit.byId( editorID ).setValue( exsltforms.registry.textarea2rte[ editorID ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		CKEditor : {
			setEditorContent : function( editorID, editorContent ) { CKEDITOR.instances[ editorID ].setData( exsltforms.registry.textarea2rte[ editorID ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		EditArea : {
			setEditorContent : function( editorID, editorContent ) { editAreaLoader.setValue( editorID, exsltforms.registry.textarea2rte[ editorID ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		YUIEditor : {
			setEditorContent : function( editorID, editorContent ) { YAHOO.widget.EditorInfo._instances[ editorID ].setEditorHTML( exsltforms.registry.textarea2rte[ editorID ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		Xinha : {
			setEditorContent : function( editorID, editorContent ) { xinha_editors[ editorID ].setHTML( exsltforms.registry.textarea2rte[ editorID ].processContentOnUpdate( editorContent ) ); },
			beforeRendering : function( nativeConfigOptionsObject ) {}
		},
		saveEditAreaContent : function( editorID, editorContent ) {
			exsltforms.rte.generalFunctions.saveEditorContent( editorID, editorContent );
		},
		saveDojoContent : function( editorID ) {
			
		}
	},
	//general functions for editors
	generalFunctions : {
		processContentOnSave	: function( editorContent ) {return editorContent.replace(/&nbsp;/gi, "&#160;");},
		processContentOnUpdate	: function( editorContent ) {return editorContent;},
		addXFupdateListener	: function(editorID) {				
			new XsltForms_listener(XsltForms_globals.body.xfSubform, document.getElementById(exsltforms.registry.textarea2rte[editorID].XFtextareaID), null, "xforms-value-changed", null, function( evt ) {
				exsltforms.rte.generalFunctions.updateEditorContent( editorID );
			});
		},
		updateEditorContent	: function( editorID ) {
			if ( exsltforms.registry.textarea2rte[ editorID ].editorContentModified == 'yes' ) {
				exsltforms.registry.textarea2rte[ editorID ].editorContentModified = 'no';
			} else {
				exsltforms.rte.specificFunctions[ exsltforms.registry.textarea2rte[ editorID ].editorType ].setEditorContent( editorID, document.getElementById( exsltforms.registry.textarea2rte[ editorID ].id ).value );
				}
		},
		saveEditorContent	: function(editorID, editorContent) {
			var textareaContent = document.getElementById(editorID).value;
			setTimeout(
				function() {
					if (textareaContent !== editorContent) {
						exsltforms.registry.textarea2rte[ editorID ].editorContentModified = 'yes';
						var editorContentProcessedOnSave = exsltforms.registry.textarea2rte[ editorID ].processContentOnSave( editorContent );
						XsltForms_control.getXFElement(document.getElementById( exsltforms.registry.textarea2rte[ editorID ].XFtextareaID)).valueChanged(editorContentProcessedOnSave || "");
					}
				},
			0);
		}
	}	
};
