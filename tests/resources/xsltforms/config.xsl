<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template name="config">
		<options>
		</options>
		<properties> <!--  accessible at run time -->
			<language>navigator</language> <!-- navigator or default -->
			<calendar.day0>Mon</calendar.day0>
			<calendar.day1>Tue</calendar.day1>
			<calendar.day2>Wed</calendar.day2>
			<calendar.day3>Thu</calendar.day3>
			<calendar.day4>Fri</calendar.day4>
			<calendar.day5>Sat</calendar.day5>
			<calendar.day6>Sun</calendar.day6>
			<calendar.initDay>6</calendar.initDay>
			<calendar.month0>January</calendar.month0>
			<calendar.month1>February</calendar.month1>
			<calendar.month2>March</calendar.month2>
			<calendar.month3>April</calendar.month3>
			<calendar.month4>May</calendar.month4>
			<calendar.month5>June</calendar.month5>
			<calendar.month6>July</calendar.month6>
			<calendar.month7>August</calendar.month7>
			<calendar.month8>September</calendar.month8>
			<calendar.month9>October</calendar.month9>
			<calendar.month10>November</calendar.month10>
			<calendar.month11>December</calendar.month11>
			<format.date>MM/dd/yyyy</format.date>
			<format.datetime>MM/dd/yyyy hh:mm:ss</format.datetime>
			<format.decimal>.</format.decimal>
			<status>... Loading ...</status>
		</properties>
		<extensions><beforeInit/><onBeginInit>
xf_model_extensions = XsltForms_model.create(xsltforms_subform, "xf-model-extensions",null,null,null);
XsltForms_instance.create(xsltforms_subform, "xf-instance-extensions", xf_model_extensions, false, 'application/xml', null, "&lt;extensionRoot/&gt;");
XsltForms_xpath.create(xsltforms_subform,"instance('xf-instance-extensions')",false,new XsltForms_functionCallExpr('http://www.w3.org/2002/xforms instance',new XsltForms_cteExpr('xf-instance-extensions')));
			</onBeginInit><onEndInit/><afterInit/></extensions> <!-- HTML elements to be added just after xsltforms.js and xsltforms.css loading -->
	</xsl:template>
</xsl:stylesheet>