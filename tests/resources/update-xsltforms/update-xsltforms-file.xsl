<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	version="2.0">
	<xsl:output method="xml" />
	<xsl:template match="rdf:RDF">
		<xsl:copy-of select="." />
		<xsl:element name="xsl:include" namespace="http://www.w3.org/1999/XSL/Transform">
			<xsl:attribute name="href">../../core/exsltforms.xsl</xsl:attribute>
		</xsl:element>
	</xsl:template>
	<xsl:template match="xsl:copy-of[@select = '$script/config/extensions/afterInit/*']">
		<xsl:element name="xsl:call-template" namespace="http://www.w3.org/1999/XSL/Transform">
			<xsl:attribute name="name">exsltforms</xsl:attribute>
		</xsl:element>
		<xsl:copy-of select="." />		
	</xsl:template>	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />
		</xsl:copy>
	</xsl:template>
	<!-- <xsl:template match="//*[local-name() = 'extensions']"> -->
	<!-- <extensions> HTML elements to be added just after xsltforms.js and xsltforms.css loading -->
	<!-- <beforeInit /> -->
	<!-- <onBeginInit> -->
	<!-- xf_model_extensions = XsltForms_model.create(xsltforms_subform, "xf-model-extensions", null); -->
	<!-- XsltForms_instance.create(xsltforms_subform, "xf-instance-extensions", xf_model_extensions, false, -->
	<!-- 'application/xml', null, "&lt;extensionRoot/&gt;"); -->
	<!-- XsltForms_xpath.create(xsltforms_subform,"instance('xf-instance-extensions')",false,new -->
	<!-- XsltForms_functionCallExpr('http://www.w3.org/2002/xforms instance',new -->
	<!-- XsltForms_cteExpr('xf-instance-extensions'))); -->
	<!-- </onBeginInit> -->
	<!-- <onEndInit /> -->
	<!-- <afterInit /> -->
	<!-- </extensions> -->
	<!-- </xsl:template> -->
</xsl:stylesheet>