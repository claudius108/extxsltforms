/*

Copyright (C) 2009-2010 kuberam.ro - Claudius Teodorescu
Contact at : claud108@yahoo.com

Copyright (C) 2008-2009 <agenceXML> - Alain COUTHURES
Contact at : <info@agencexml.com>

Copyright (C) 2006 AJAXForms S.L.
Contact at: <info@ajaxforms.com>

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
	
*/

exsltforms =
{
	version : '1.1.0',
	registry : {
		textarea2rte : {},
		input2calendar : {},
		plugins : {},
		datatables: {},
		datasources: {}
	},
	rte :	{},
	functions : {
		xsltExternalDocs : function( xmlDocPath, xsltDocPath ) {
			var xmlDoc = exsltforms.utils.loader( xmlDocPath, 'xml');
			var xsltDoc = exsltforms.utils.loader( xsltDocPath, 'xml');

			if (!XsltForms_browser.isIE) {
				var xsltProcessor = new XSLTProcessor();
				xsltProcessor.importStylesheet( xsltDoc );

				var serializer = new XMLSerializer();
				var langModuleString = serializer.serializeToString( xsltProcessor.transformToFragment( xmlDoc, document ) );
				} else {
					var xslTemplate = new ActiveXObject("Msxml2.XSLTemplate");
					xslTemplate.stylesheet = xsltDoc.documentElement;
					var xsltProcessor = xslTemplate.createProcessor();
					xsltProcessor.input = xmlDoc;

					xsltProcessor.transform();
					var langModuleString = xsltProcessor.output;
			}
			return langModuleString;
		}
	},
	sequence : function set () {
			var result = {};
			for (var i = 0; i < arguments.length; i++) {
				result[arguments[i]] = 1;
			}
			return result;
	},
	utils : {
		loader : function( componentURI, componentType ) {
			if ( componentURI in exsltforms.utils.loadedComponents ) {
				} else {
					switch( componentType ) {
							case "js":
								var script = document.createElement( 'script' );
								script.src = componentURI;
								script.type = "text/javascript";
								document.getElementsByTagName("head")[0].appendChild( script );
							break;
							case "css":
								var link = document.createElement( 'link' );
								link.href = componentURI;
								link.type = "text/css";
								link.rel = "stylesheet";
								document.getElementsByTagName("head")[0].appendChild( link );
							break;
							case "xml":
// 								var req = XsltForms_browser.openRequest("get", componentURI, false);
// 								req.send(null);
								var req = new XMLHttpRequest();
								req.open("GET", componentURI, false);
								req.send();
								var response = req.responseXML;
								//alert( response.querySelector( "*" ) );
								for ( var prop in response ) {
									//alert( prop + ' ' + response[ prop ])
								}

								if ( response == null ) {// || response.querySelector( "parsererror" ) !== null
									alert( "The file '" + componentURI.substring( componentURI.lastIndexOf( "/" ) + 1 ) + "' cannot be found. Either its path '" + componentURI + "' is wrong, or the file is missing.");
									return null;
								} else {
									return response;
								}
								
							break;
					}
					exsltforms.utils.loadedComponents[ componentURI ] = 1;
			}			
		},
		loadedComponents : {},
		addOnLoad : function( func ) {
			if( window.addEventListener ) {
				window.addEventListener('load', func, false);
				} else if ( window.attachEvent ) {
					window.attachEvent('onload', func);
				}
			},
		baseURI	: '',
		dataInstancesViewer : {
			render : function() {
				var dataInstancesViewer = document.createElement('div');
				dataInstancesViewer.setAttribute('id', 'dataInstancesViewerContainer') 
				dataInstancesViewer.innerHTML = exsltforms.utils.dataInstancesViewer.content;
				document.body.appendChild( dataInstancesViewer );
			},
			content : '<div id="showViewerButtonDiv"><button id="showViewerButton" type="button" onclick="dataViewer_getModelsIDs()">Expand Data Instances Viewer</button></div><div id="dataInstancesViewerDiv"/>'
		},
	
		poll : function( condition ) {
			if ( exsltforms.utils.pollingConditions[ condition ].testedValue() ) {
				exsltforms.utils.pollingConditions[ condition ].executedFunction();
				} else {
					setTimeout( function() { exsltforms.utils.poll( condition ); }, 50);
			}
		},
		pollTestedValues : {},
		pollingConditions : {
			dataInstancesViewerRendering : {
				testedValue : function() {
					return ( document.body != null );
				},
				executedFunction : function() {
					exsltforms.utils.dataInstancesViewer.render();
				}
			}
		}
	}
};
//set the module's base URL
(function(sModuleName, sModuleNS) {
	window[sModuleNS ? sModuleNS : sModuleName].utils.baseURI = document.querySelector("script[src*='" + sModuleName + "']").src.match(new RegExp("^(.)*(/)?" + sModuleName + "/"))[0];
})('exsltforms');
//load the data instances viewer, if needed
(function(){
	var html = document.documentElement;
	if ( html.attributes[ 'eXSLTFormsDataInstancesViewer' ] ) {
		if ( html.attributes[ 'eXSLTFormsDataInstancesViewer' ].nodeValue == 'true') {
			exsltforms.utils.loader( exsltforms.utils.baseURI + 'dataInstancesViewer/dataInstancesViewer.css', 'css' );
			exsltforms.utils.loader( exsltforms.utils.baseURI + 'dataInstancesViewer/dataInstancesViewer.js', 'js' );
		}
	}
})();

function transform_action(xmlXPath, xslPath, parametersXPath, targetXPath, idExtElem) {
 	this.xmlBinding = XsltForms_xpath.get(xmlXPath);
	this.xslPath = xslPath;
	this.parametersBinding = parametersXPath? XsltForms_xpath.get(parametersXPath) : null;
	this.targetBinding = XsltForms_xpath.get(targetXPath);
	var context =  null;
	this.context = XsltForms_xpath.get(context);
	this.idExtElem = idExtElem;
}
transform_action.prototype = new XsltForms_abstractAction();
transform_action.prototype.run = function(element, ctx) {
	if (this.context) {
		ctx = this.context.evaluate(ctx)[0];
	}
	if (!ctx) { return; }
	var xmlString = XsltForms_browser.saveXML(this.xmlBinding.evaluate(ctx)[0])
	, parametersXNode = this.parametersBinding !== null ? this.parametersBinding.evaluate(ctx)[0] : null
	, targetString = XsltForms_browser.saveXML(this.targetBinding.evaluate(ctx)[0])
	, xsltResult = eXSLTForms_xslt(xmlString, this.xslPath, parametersXNode)
	;	
	if (!XsltForms_browser.isIE) {
		var serializer = new XMLSerializer();
		var parser = new DOMParser();		
		var target_DOMNode = parser.parseFromString(targetString, "text/xml");
		var first = target_DOMNode.firstChild;
		target_DOMNode.removeChild(first);
		target_DOMNode.appendChild(xsltResult);
		var newTargetString = serializer.serializeToString( target_DOMNode );
	} else {
		var resultDoc = new ActiveXObject("Microsoft.XMLDOM");
		resultDoc.async = "false";
		resultDoc.loadXML(xsltResult);
		var targetDoc = new ActiveXObject("Microsoft.XMLDOM");
		targetDoc.async = "false";
		targetDoc.loadXML(targetString);
		var first = targetDoc.firstChild;
		targetDoc.removeChild(first);
		XNode.recycle(first);
		targetDoc.appendChild(resultDoc.documentElement);
		var newTargetString = targetDoc.xml;
	}
	
	var xf_model_extensions_container = document.getElementById("xf-model-extensions");
	document.getElementById("xf-instance-extensions").xfElement.setDoc(newTargetString);

	XsltForms_globals.addChange(xf_model_extensions);
	XsltForms_browser.events.dispatch(xf_model_extensions_container, "xforms-rebuild");
	XsltForms_globals.refresh();

	XsltForms_browser.events.dispatch(xf_model_extensions_container, "xforms-transform-insert_" + this.idExtElem);
	XsltForms_browser.events.dispatch(xf_model_extensions_container, "xforms-transform-delete_" + this.idExtElem);
}

function eXSLTForms_xslt(xmlString, xslPath, parametersXNode) {
	if (!XsltForms_browser.isIE) {
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xmlString, "text/xml");
	
		var req = XsltForms_browser.openRequest("get", xslPath, false);
		req.send(null);
		var xsltDoc = req.responseXML;
				
		var xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsltDoc);

		if (parametersXNode !== null) {	
			for (var i=0; i < parametersXNode.childNodes.length; ++i)
				{
				xsltProcessor.setParameter(null, parametersXNode.childNodes[i].attributes[0].nodeValue, parametersXNode.childNodes[i].attributes[1].nodeValue);
				}
		} else {}

		return xsltProcessor.transformToFragment(xmlDoc, document);
	} else {
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xmlString);
		var xsltDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
		xsltDoc.async = "false";
		xsltDoc.load(xslPath);
		
		var xslTemplate = new ActiveXObject("Msxml2.XSLTemplate");
		xslTemplate.stylesheet = xsltDoc.documentElement;
		var xsltProcessor = xslTemplate.createProcessor();
		xsltProcessor.input = xmlDoc;
		
		if (parametersXNode !== null) {
			for (var i=0; i < parametersXNode.childNodes.length; ++i) {
				xsltProcessor.addParameter(parametersXNode.childNodes[i].attributes[0].nodeValue, parametersXNode.childNodes[i].attributes[1].nodeValue);
			}
		} else {}
		xsltProcessor.transform();
		return xsltProcessor.output;
	}
}

function replace_action(idExtElem) {
	this.idExtElem = idExtElem;
}
replace_action.prototype = new XsltForms_abstractAction();
replace_action.prototype.run = function(element, ctx) {
	if (this.context) {
		ctx = this.context.evaluate(ctx)[0];
	}
    
	if (!ctx) { return; }

	var xf_model_extensions = document.getElementById("xf-model-extensions");
	XsltForms_browser.events.dispatch(xf_model_extensions,"xforms-replace-insert_replace" + this.idExtElem);
	XsltForms_browser.events.dispatch(xf_model_extensions,"xforms-replace-delete_replace" + this.idExtElem);
	}