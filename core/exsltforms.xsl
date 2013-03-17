<?xml version="1.0" encoding="UTF-8"?>
<!--
Copyright (C) 2009-2013 kuberam.ro - Claudius Teodorescu
Contact at : claudius.teodorescu@gmail.com

Copyright (C) 2008-2009 agenceXML - Alain COUTHURES
Contact at : info@agencexml.com

Copyright (C) 2006 AJAXForms S.L.
Contact at: info@ajaxforms.com

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
	-->
<xsl:stylesheet xmlns:exfk="http://kuberam.ro/exsltforms" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:exslt="http://exslt.org/common" xmlns:xalan="http://xml.apache.org/xalan" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0" exclude-result-prefixes="xhtml xforms ev exfk">
    <xsl:output method="html" encoding="utf-8" omit-xml-declaration="no" indent="no" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>
    <xsl:variable name="exsltformsConfigOptions">
        <xsl:copy-of select="document('../config/exsltforms-config.xml')/*"/>
    </xsl:variable>
    
    <xsl:template name="exsltforms">
        <xsl:variable name="exsltformsBaseURI">
		<xsl:choose>
			<xsl:when test="function-available('xalan:nodeset')">
				<xsl:apply-templates select="xalan:nodeset($exsltformsConfigOptions)/exsltforms-config-options/exsltforms-base-uri"/>
			</xsl:when>
			<xsl:when test="function-available('exslt:node-set')">
				<xsl:apply-templates select="exslt:node-set($exsltformsConfigOptions)/exsltforms-config-options/exsltforms-base-uri"/>
			</xsl:when>
			<xsl:when test="function-available('msxsl:node-set')">
				<xsl:apply-templates select="msxsl:node-set($exsltformsConfigOptions)/exsltforms-config-options/exsltforms-base-uri"/>
			</xsl:when>
		</xsl:choose>
        </xsl:variable>
        <script src="{$exsltformsBaseURI}core/exsltforms.js" type="text/javascript">/* */</script>
        <xsl:variable name="RTEs" select="//xforms:textarea[starts-with(@appearance, 'exfk:')]"/>
        <xsl:if test="count($RTEs) &gt; 0">
            <script src="{$exsltformsBaseURI}rte/rte.js" type="text/javascript">/* */</script>
            <xsl:variable name="rteConfigOptions">
                <rteConfigOptions>
                    <xsl:copy-of select="document('../config/rte-config.xml')/rteConfigOptions/*"/>
                </rteConfigOptions>
            </xsl:variable>
            <xsl:variable name="editorTypesOnPage">
                <xsl:for-each select="$RTEs/@appearance">
                    <xsl:value-of select="."/>
                </xsl:for-each>
            </xsl:variable>
            <xsl:for-each select="exslt:node-set($rteConfigOptions)/rteConfigOptions/editor">
                <xsl:if test="contains($editorTypesOnPage, @type)">
                    <xsl:copy-of select="initialize/*"/>
                </xsl:if>
            </xsl:for-each>
            <script type="text/javascript">
<!-- 		<![CDATA[ -->
				exsltforms.rte.registerEditors();
<!-- 			]]> -->
            </script>
        </xsl:if>
        <xsl:if test="//xforms:textarea[starts-with(@appearance, 'exfk:YUI')] | //xhtml:table[starts-with(@appearance, 'exfk:YUI')]">
		<!--load YUI 3 config file-->
            <xsl:variable name="YUI3-config-options" select="document('../config/yui-config.xml')/config-options"/>
            <script type="text/javascript" src="{$YUI3-config-options/yui3-seed-url}" charset="utf-8">/**/</script>
        </xsl:if>
    </xsl:template>

    <xsl:template match="xforms:transform" mode="script" priority="1">
<!--	<xsl:choose>
		<xsl:when test="@type = 'xslt'">

		</xsl:when>
		<xsl:when test="@type = 'xquery'">

		</xsl:when>
		<xsl:when test="@type = 'xproc'">

		</xsl:when>
	</xsl:choose>-->
		<xsl:param name="parentworkid"/>
		<xsl:param name="workid" select="concat(position(),'_',$parentworkid)"/>
        <xsl:variable name="idInsertElem" select="concat('xsltforms_insert_transform_', $workid)"/>
        <xsl:variable name="idDeleteElem" select="concat('xsltforms_delete_transform_', $workid)"/>      
        <xsl:apply-templates select="@*" mode="scriptattr"/>
		<xsl:if test="@param">
			<xsl:variable name="kxexprs">
				<xexprs xmlns="">
					<xexpr>
						<xsl:value-of select="@param"/>
					</xexpr>
				</xexprs>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="function-available('xalan:nodeset')">
					<xsl:call-template name="xps">
						<xsl:with-param name="ps" select="xalan:nodeset($kxexprs)/xexprs"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="function-available('exslt:node-set')">
					<xsl:call-template name="xps">
						<xsl:with-param name="ps" select="exslt:node-set($kxexprs)/xexprs"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="xps">
						<xsl:with-param name="ps" select="msxsl:node-set($kxexprs)/xexprs"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
		<js>
	        <xsl:value-of select="concat('var xsltforms_transform_', $workid, ' = new transform_action(xsltforms_subform,&#34;', @origin, '&#34;, &#34;', @transformer, '&#34;, &#34;', @param, '&#34;, &#34;', @ref, '&#34;, &#34;transform_', $workid, '&#34;);')"/>
	        <xsl:value-of select="concat('var ', $idInsertElem, ' = new XsltForms_insert(xsltforms_subform,&#34;', @ref)"/><xsl:text>",null,null,null,"after","instance('xf-instance-extensions')",null,null,null,null);</xsl:text>
	        <xsl:value-of select="concat('new XsltForms_listener(xsltforms_subform,document.getElementById(&#34;xf-model-extensions&#34;),null,&#34;xforms-transform-insert_transform_', $workid, '&#34;,null,function(evt) {XsltForms_browser.run(', $idInsertElem, ',XsltForms_browser.getId(evt.currentTarget ? evt.currentTarget : evt.target),evt,false,true);});')"/>
	        <xsl:value-of select="concat('var ', $idDeleteElem, ' = new XsltForms_delete(xsltforms_subform,&#34;', @ref, '&#34;,null,null,null,null,null,null,null);')"/>
	        <xsl:value-of select="concat('new XsltForms_listener(xsltforms_subform,document.getElementById(&#34;xf-model-extensions&#34;),null,&#34;xforms-transform-delete_transform_', $workid, '&#34;,null,function(evt) {XsltForms_browser.run(', $idDeleteElem, ',XsltForms_browser.getId(evt.currentTarget ? evt.currentTarget : evt.target),evt,false,true);});')"/>
		</js>
        <xsl:apply-templates select="node()" mode="script">
        	<xsl:with-param name="parentworkid" select="$workid"/>
        </xsl:apply-templates>
    </xsl:template>

    <xsl:template match="xforms:replace" mode="script" priority="1">
    	<xsl:param name="parentworkid"/>
        <xsl:param name="workid" select="concat(position(),'_',$parentworkid)"/>
        <xsl:variable name="idInsertElem" select="concat('xsltforms_insert_replace', $workid)"/>
        <xsl:variable name="idDeleteElem" select="concat('xsltforms_delete_replace', $workid)"/>
        <xsl:apply-templates select="@*" mode="scriptattr"/>        
        <js>
	        <xsl:value-of select="concat('var xsltforms_replace_', $workid, ' = new replace_action(&#34;', $workid, '&#34;);')"/>
	        <xsl:value-of select="concat('var ',$idInsertElem, ' = new XsltForms_insert(xsltforms_subform,&#34;', @ref, '&#34;,null,null,null,&#34;after&#34;,&#34;', @origin, '&#34;,null,null,null,null);')"/>
	        <xsl:value-of select="concat('new XsltForms_listener(xsltforms_subform,document.getElementById(&#34;xf-model-extensions&#34;),null,&#34;xforms-replace-insert_replace', $workid, '&#34;,null,function(evt) {XsltForms_browser.run(', $idInsertElem, ',XsltForms_browser.getId(evt.currentTarget ? evt.currentTarget : evt.target),evt,false,true);});')"/>
	        <xsl:value-of select="concat('var ', $idDeleteElem, ' = new XsltForms_delete(xsltforms_subform,&#34;', @ref, '&#34;,null,null,null,null,null,null,null);')"/>
	        <xsl:value-of select="concat('new XsltForms_listener(xsltforms_subform,document.getElementById(&#34;xf-model-extensions&#34;),null,&#34;xforms-replace-delete_replace', $workid, '&#34;,null,function(evt) {XsltForms_browser.run(', $idDeleteElem, ',XsltForms_browser.getId(evt.currentTarget ? evt.currentTarget : evt.target),evt,false,true);});')"/>        
        </js>
        <xsl:apply-templates select="node()" mode="script">
        	<xsl:with-param name="parentworkid" select="$workid"/>
        </xsl:apply-templates>
    </xsl:template>
    
		<xsl:template match="xforms:action" mode="script" priority="2">
			<xsl:param name="parentworkid"/>
			<xsl:param name="workid" select="concat(position(),'_',$parentworkid)"/>
			<xsl:apply-templates select="@*" mode="scriptattr"/>
			<xsl:apply-templates select="node()" mode="script">
				<xsl:with-param name="parentworkid" select="$workid"/>
			</xsl:apply-templates>
			<js>
				<xsl:text>var </xsl:text>
				<xsl:value-of select="$vn_pf"/>
				<xsl:text>action_</xsl:text>
				<xsl:value-of select="$workid"/>
				<xsl:text> = new XsltForms_action(</xsl:text>
				<xsl:value-of select="$vn_subform"/>
				<xsl:text>,</xsl:text>
				<xsl:call-template name="toScriptParam"><xsl:with-param name="p" select="@if"/></xsl:call-template>
				<xsl:text>,</xsl:text>
				<xsl:call-template name="toScriptParam"><xsl:with-param name="p" select="@while"/></xsl:call-template>
				<xsl:text>,</xsl:text>
				<xsl:call-template name="toScriptParam"><xsl:with-param name="p" select="@iterate"/></xsl:call-template>
				<xsl:text>)</xsl:text>
				<xsl:for-each select="node()">
					<xsl:if test="contains(':setvalue:insert:delete:action:toggle:send:setfocus:setindex:setnode:load:message:dispatch:rebuild:reset:show:hide:script:unload:transform:replace:',concat(':',local-name(),':'))">
						<xsl:text>.add(</xsl:text>
						<xsl:value-of select="$vn_pf"/>
						<xsl:value-of select="local-name()"/>
						<xsl:text>_</xsl:text>
						<xsl:value-of select="concat(position(),'_',$workid)"/>
						<xsl:text>)</xsl:text>
					</xsl:if>
				</xsl:for-each>
				<xsl:text>;</xsl:text>
			</js>
		</xsl:template>

    <xsl:template match="xforms:textarea[starts-with(@appearance, 'exfk:')]" priority="3">
        <xsl:param name="appearance" select="false()"/>
        <xsl:param name="parentworkid"/>
        <xsl:param name="workid" select="concat(position(),'_',$parentworkid)"/>
        <xsl:variable name="editorType" select="substring-after(@appearance, ':')"/>
        <xsl:variable name="idExtElem" select="concat($editorType, '_', $workid)"/>
        <xsl:variable name="XFtextareaID">
            <xsl:choose>
                <xsl:when test="@id">
                    <xsl:value-of select="@id"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>xsltforms-mainform-textarea-</xsl:text>
                    <xsl:value-of select="$workid"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:call-template name="field">
        	<xsl:with-param name="workid" select="$workid"/>
            <xsl:with-param name="appearance" select="$appearance"/>
            <xsl:with-param name="body">
                <textarea id="{$idExtElem}"><xsl:copy-of select="@*[local-name() != 'ref']"/><xsl:call-template name="comun"/><xsl:text/> </textarea>
            </xsl:with-param>
        </xsl:call-template>
        <script type="text/javascript">
			exsltforms.registry.textarea2rte['<xsl:value-of select="$idExtElem"/>'] = {
				editorType : '<xsl:value-of select="$editorType"/>',
				id : '<xsl:value-of select="$idExtElem"/>',
				XFtextareaID : '<xsl:value-of select="$XFtextareaID"/>',
				incremental : '<xsl:value-of select="@incremental"/>',
				editorContentModified : 'no',
				processContentOnSave : exsltforms.rte.generalFunctions.processContentOnSave,
				processContentOnUpdate : exsltforms.rte.generalFunctions.processContentOnUpdate,
				nativeConfigOptionsObject : <xsl:value-of select="xforms:extension/exfk:rteOptions"/>
			};
	</script>
    </xsl:template>
    
    <xsl:template match="xhtml:table[@appearance = 'exfk:YUI3-DataTable']">
        <xsl:variable name="elementID">
            <xsl:choose>
                <xsl:when test="@id">
                    <xsl:value-of select="@id"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="generate-id(.)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <div id="{$elementID}"></div>
        <script type="text/javascript" charset="utf-8">
            <xsl:variable name="xexpr">
                    <xexpr>
                        <xsl:value-of select="@xforms:repeat-ref"/>
                    </xexpr>
            </xsl:variable>
			YUI().use('datatable-datasource', 'datasource-local', 'datasource-xmlschema', 'datatable-sort', 'recordset-base', function (Y) {
				var datatables = exsltforms.registry.datatables;
				var datasources = exsltforms.registry.datasources;
	
				//define formatters
				<xsl:for-each select="xforms:extension/exfk:formatters/exfk:formatter">
					var <xsl:value-of select="@name"/> = <xsl:value-of select="normalize-space(exfk:definition)"/>;
				</xsl:for-each>
				//define editors
				<xsl:for-each select="xforms:extension/exfk:editors/exfk:editor">
					var <xsl:value-of select="@name"/> = <xsl:value-of select="normalize-space(exfk:definition)"/>;
				</xsl:for-each>
	
				//define columns
				var columns = [
					<xsl:for-each select="xhtml:tr/xhtml:td">
						{
							key: "<xsl:value-of select="xforms:*/@ref"/>",
							<xsl:for-each select="@*[name() != 'exfk:sortable']">
								<xsl:value-of select="concat(substring-after(name(), 'exfk:'), ': ', ., ', ')"/>
							</xsl:for-each>
							label: "<xsl:value-of select=".//xforms:label"/>"
						},
					</xsl:for-each>
				];
				var sortableColumns = [
					<xsl:for-each select="xhtml:tr/xhtml:td[@exfk:sortable]">
						"<xsl:value-of select="xforms:*/@ref"/>",
					</xsl:for-each>
				];
				
				//define datasource and dataschema
				var nodesetPath = "<xsl:value-of select="@xforms:repeat-ref"/>";
				var resultListLocatorName = nodesetPath.substring(nodesetPath.lastIndexOf( "/" ) + 1);
				var myDataSource = new Y.DataSource.Local();
				myDataSource.responseType = Y.DataSource.TYPE_XML;
				myDataSource.plug(Y.Plugin.DataSourceXMLSchema, {
					schema: {
						//TO DO: to generalize resultListLocator
						resultListLocator: resultListLocatorName,
						resultFields: [
						<xsl:for-each select="xhtml:tr/xhtml:td[./xforms:*/@ref]">
	                			<xsl:variable name="ref" select="xforms:*/@ref"/>
							{key: "<xsl:value-of select="$ref"/>", locator: "<xsl:value-of select="$ref"/>"},
						</xsl:for-each>
						]
					}
				});
					
				//setting the datatable
				var myDataTable = new Y.DataTable({
					columnset: columns
					<xsl:if test="xhtml:caption">
						,caption: "<xsl:value-of select="normalize-space(xhtml:caption)"/>"
					</xsl:if>
					,sortable: sortableColumns
				});			
				myDataTable.plug(Y.Plugin.DataTableDataSource, {
					datasource: myDataSource
				}).render("#<xsl:value-of select="$elementID"/>");
				//TO DO: sorting to be made by the clicked column
				<xsl:if test="xhtml:tr/xhtml:td[@exfk:sortable = 'true']">
					//myDataTable.plug(Y.Plugin.DataTableSort);
					//workaround for table sort
					myDataTable.datasource.onDataReturnInitializeTable = function (e) {
						this.get("host").set("recordset", new Y.Recordset({records: e.response.results}));
						this.get("host").plug(Y.Plugin.DataTableSort, {
							lastSortedBy: {
								field: "<xsl:value-of select="xhtml:tr/xhtml:td[@exfk:sortable = 'true']/xforms:*/@ref"/>",
								dir: "asc"
							}
						});
					}
				</xsl:if>
	
				// Enable inline cell editing
				<xsl:if test="xforms:extension/exfk:editors">
					myDataTable.on("cellClickEvent", myDataTable.onEventShowCellEditor);
				</xsl:if>
	
				//registering myDataTable and myDataSource in exsltforms registry
				datatables[ '<xsl:value-of select="$elementID"/>' ] = myDataTable;
				datasources[ '<xsl:value-of select="$elementID"/>' ] = myDataSource;
				
				//get data
				exsltforms.utils.pollingConditions[ 'get-<xsl:value-of select="$elementID"/>-source' ] = {
					testedValue: function() {return (XsltForms_globals.ready)},
					executedFunction: function() {
						<xsl:call-template name="expath"><xsl:with-param name="xp" select="exslt:node-set($xexpr)/xexpr"/><xsl:with-param name="nms" select="''"/></xsl:call-template>					
						var sourceString = "";
						var model = '<xsl:value-of select="@model"/>';
						model = model ? model : XsltForms_globals.models[1].element.id;
																		
						var sourceBinding = (new XsltForms_binding(null, nodesetPath, model)).evaluate();
						for ( i = 0, il = sourceBinding.length; i &lt; il; i++) {
							sourceString += XsltForms_browser.saveXML(sourceBinding[i]);
						}
						//alert(sourceString);
						var liveData = Y.DataType.XML.parse("&lt;liveData&gt;" + sourceString.replace( new RegExp( ' xmlns=""', 'gi' ), "" ) + "&lt;/liveData&gt;");
						datasources[ '<xsl:value-of select="$elementID"/>' ].set('source', liveData);
						datatables[ '<xsl:value-of select="$elementID"/>' ].datasource.load();						
					}
				};
				exsltforms.utils.poll( 'get-<xsl:value-of select="$elementID"/>-source' );

		});
	</script>
    </xsl:template>
    
    <xsl:template match="xhtml:table[starts-with(@appearance, 'exfk:')]/xhtml:tr/xhtml:td/xforms:*" mode="script" priority="2"/>
    
	  <xsl:template name="expath">
			<xsl:param name="xp"/>
			<xsl:param name="nms"/>
			<xsl:param name="main"/>
			<xsl:variable name="xp2jsres"><xsl:call-template name="xp2js"><xsl:with-param name="xp" select="$xp"/></xsl:call-template></xsl:variable>
			<xsl:variable name="xp2jsres2">
				<xsl:choose>
					<xsl:when test="contains($xp2jsres,'~~~~')">"<xsl:value-of select="substring-after(translate(substring-before(concat($xp2jsres,'~#~#'),'~#~#'),'&#34;',''),'~~~~')"/> in '<xsl:value-of select="$xp"/>'"</xsl:when>
					<xsl:when test="$xp2jsres != ''"><xsl:value-of select="$xp2jsres"/></xsl:when>
					<xsl:otherwise>"Unrecognized expression '<xsl:value-of select="$xp"/>'"</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:variable name="result">XsltForms_xpath.create(XsltForms_globals.body.xfSubform,"<xsl:call-template name="toXPathExpr"><xsl:with-param name="p" select="$xp"/></xsl:call-template>",<xsl:call-template name="unordered"><xsl:with-param name="js" select="$xp2jsres"/></xsl:call-template>,<xsl:value-of select="$xp2jsres2"/><xsl:call-template name="js2ns"><xsl:with-param name="js" select="$xp2jsres"/><xsl:with-param name="nms" select="$nms"/></xsl:call-template>);</xsl:variable>
			<xsl:value-of select="$result"/><xsl:text>
</xsl:text>
	  </xsl:template>    
</xsl:stylesheet>