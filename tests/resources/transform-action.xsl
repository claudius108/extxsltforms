<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="xml"/>
    <xsl:param name="param1">default value for param1</xsl:param>
    <xsl:param name="param2">default value for param2</xsl:param>
    <xsl:template match="pac">
        <success>XSL Transformation is successfull; parameters: <xsl:value-of select="concat($param1,' ',$param2)"/>
        </success>
    </xsl:template>
</xsl:stylesheet>