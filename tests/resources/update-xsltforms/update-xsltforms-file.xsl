<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:default="http://www.w3.org/1999/xhtml"
	version="2.0">
	<xsl:output method="xml" />
	<xsl:template match="rdf:RDF">
		<xsl:copy-of select="." />
		<xsl:element name="xsl:include" namespace="http://www.w3.org/1999/XSL/Transform">
			<xsl:attribute name="href">../../../core/exsltforms.xsl</xsl:attribute>
		</xsl:element>
	</xsl:template>
	<xsl:template match="xsl:copy-of[@select = '$script/config/extensions/afterInit/*']">
		<xsl:element name="xsl:call-template" namespace="http://www.w3.org/1999/XSL/Transform">
			<xsl:attribute name="name">exsltforms</xsl:attribute>
		</xsl:element>
		<xsl:copy-of select="." />		
	</xsl:template>
	<xsl:template match="xsl:template[@match = 'xforms:model|xforms:show|xforms:hide']">
		<xsl:element name="xsl:template" namespace="http://www.w3.org/1999/XSL/Transform">
			<xsl:attribute name="match"><xsl:value-of select="concat(@match, '|xforms:extension')" /></xsl:attribute>
			<xsl:attribute name="priority">2</xsl:attribute>
		</xsl:element>	
	</xsl:template>
	<xsl:template match="xsl:template[starts-with(@match, '@at | @calculate')]">
		<xsl:element name="xsl:template" namespace="http://www.w3.org/1999/XSL/Transform">
			<xsl:attribute name="match"><xsl:value-of select="concat(@match, ' | @param')" /></xsl:attribute>
			<xsl:attribute name="mode">scriptattr</xsl:attribute>
			<xsl:attribute name="priority">1</xsl:attribute>
			<xexpr><xsl:value-of select="."/></xexpr>
		</xsl:element>	
	</xsl:template>
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>
