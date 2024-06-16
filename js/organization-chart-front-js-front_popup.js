function wpdaOrgChartPopup() {
	this.defParams = {
		'ClickAreaClass': 'wpda_tree_open_popup_el',
		'contentClass': 'wpda_tree_popup_content',
		'adminBarHeight': '0',
		'currentView': 'desktop',
		'elementIndex': 0,
		'offsettop': 0,
		'closeSectionHeight': 0,
		'popupWindowHeight': 0,
		'popupWindowWidth': 0,
		'events': new Array(),
	};
	this.innerElements = {};
	this.popupElements = new Array();
}

wpdaOrgChartPopup.prototype.init = function () {
	let self = this;
	this.calcViewType();
	this.loadElements();
	this.fixThemeValues();
	this.addElementsFunctionality();
	window.addEventListener('resize', function () {
		self.resizePopup();
	});
}

wpdaOrgChartPopup.prototype.loadElements = function () {
	let popupLinks = document.getElementsByClassName(this.defParams.ClickAreaClass), i = 0;
	while (i in popupLinks) {
		this.popupElements[i] = {};
		this.popupElements[i]['clickElement'] = popupLinks[i];
		if (this.popupElements[i]['clickElement'].getElementsByClassName('wpda_tree_popup_content')[0] != null) {
			this.popupElements[i]['popupContent'] = this.popupElements[i]['clickElement'].getElementsByClassName('wpda_tree_popup_content')[0];
		} else {
			this.popupElements[i]['popupContent'] = this.popupElements[i]['clickElement'].parentElement.getElementsByClassName('wpda_tree_popup_content')[0];
		}
		this.popupElements[i]['popupTheme'] = this.popupElements[i]['popupContent'].getAttribute('date-popup-theme');
		i++;
		if (i > 10000) {
			alert("error in js");
			break;
		}
	}
}
wpdaOrgChartPopup.prototype.addElementsFunctionality = function () {
	let self = this, i = 0;
	while (i in this.popupElements) {
		(function (j) {
			self.popupElements[j]['clickElement'].addEventListener('click', function () {
				self.defParams['elementIndex'] = j;
				self.createOverlay(j);
				self.createPopup(j);
			})
		}(i))
		i++;
	}
}

wpdaOrgChartPopup.prototype.createOverlay = function (elementIndex) {
	let self = this, themeId = this.popupElements[elementIndex]['popupTheme']
	this.innerElements['overlay'] = this.createHtmlElement('div', { 'id': 'wpdaOrgChartOverlay', 'style': 'position:fixed;left:0px;top:0px;width:100%;height:100%;background-image: linear-gradient(' + this.gradientToString(wpda_org_chart_popup_theme[themeId]['overlay_bg_color']) + ');' });
	document.getElementsByTagName('body')[0].appendChild(this.innerElements['overlay']);
	if (wpda_org_chart_popup_theme[themeId]['close_aditional'] == 'esc_click') {
		this.innerElements['overlay'].addEventListener('click', function () {
			self.remove();
		})
		let eventObject = {};
		eventObject['eventFunction'] = function (e) {
			if (e.code == 'Escape' || e.key == 'escape') {
				self.remove();
			}
		}
		eventObject['eventName'] = 'keydown';
		eventObject['element'] = document;
		self.defParams['events'].push(eventObject);
		eventObject['element'].addEventListener(eventObject['eventName'], eventObject['eventFunction'])
	}
	if (wpda_org_chart_popup_theme[themeId]['close_aditional'] == 'esc') {
		let eventObject = {};
		eventObject['eventFunction'] = function (e) {
			if (e.code == 'Escape' || e.key == 'escape') {
				self.remove();
			}
		}
		eventObject['eventName'] = 'keydown';
		eventObject['element'] = document;
		self.defParams['events'].push(eventObject);
		eventObject['element'].addEventListener(eventObject['eventName'], eventObject['eventFunction'])
	}
	if (wpda_org_chart_popup_theme[themeId]['close_aditional'] == 'click') {
		this.innerElements['overlay'].addEventListener('click', function () {
			self.remove();
		})
	}
}

wpdaOrgChartPopup.prototype.createCloseSection = function (elementIndex) {
	let self = this, themeId = this.popupElements[elementIndex]['popupTheme'], theme = wpda_org_chart_popup_theme[themeId];
	if (theme['close_button_text']['desktop'] != '') {
		let fontStyle = '';
		fontStyle += 'font-family:' + theme['close_button_text_font_family'] + ';';
		fontStyle += 'color:' + theme['close_button_text_color'] + ';';
		fontStyle += 'font-size:' + theme['close_button_text_font_size']['desktop'] + theme['close_button_text_font_size']['metric_desktop'] + ';';
		fontStyle += 'letter-spacing:' + theme['close_button_text_letter_spacing']['desktop'] + theme['close_button_text_letter_spacing']['metric_desktop'] + ';';
		fontStyle += 'line-height:' + theme['close_button_text_line_height']['desktop'] + theme['close_button_text_line_height']['metric_desktop'] + ';';
		fontStyle += 'font-weight:' + theme['close_button_text_font_weight'] + ';'
		fontStyle += 'font-style:' + theme['close_button_text_font_style'] + ';'

		if (theme['close_section_type'] == 'section') {
			this.innerElements['closeSection'] = this.createHtmlElement('div', { 'id': 'wpdaOrgChartCloseSection', 'style': 'text-align: right;border-bottom:' + this.borderToString(theme['close_section_border_bottom_width'], theme['close_section_border_bottom_type'], theme['close_section_border_bottom_color'] + ';' + 'background-color:' + theme['close_button_section_bg_color'] + ';') });
			var textSpan = this.createHtmlElement('span', { 'style': fontStyle }, theme['close_button_text']['desktop']);
			this.innerElements['closeSection'].appendChild(textSpan);
			this.innerElements['popupWindow'].prepend(this.innerElements['closeSection']);
			this.defParams['closeSectionHeight'] = this.innerElements['closeSection'].getBoundingClientRect().height;
		} else {
			var textSpan = this.createHtmlElement('span', { 'style': 'position:absolute;right: 5px;z-index:9999;' + fontStyle }, theme['close_button_text']['desktop']);
			this.innerElements['popupWindow'].prepend(textSpan);
		}
		textSpan.addEventListener('click', function () {
			self.remove();
		})
	}
}

wpdaOrgChartPopup.prototype.createPopup = function (elementIndex) {
	let self = this, themeId = this.popupElements[elementIndex]['popupTheme'], theme = wpda_org_chart_popup_theme[themeId], classs = '', duration = 0;
	this.innerElements['popupWindow'] = this.createHtmlElement('div', { 'id': 'wpdaOrgChartPopupWindow' });
	this.innerElements['popupWindow'].appendChild(this.popupElements[elementIndex]['popupContent'].children[0]);
	document.getElementsByTagName('body')[0].appendChild(this.innerElements['popupWindow']);
	this.innerElements['popupWindow'].setAttribute('style', this.popupStyle(themeId));
	// left and top value need generate after popup width and height is initial
	this.innerElements['popupWindow'].style.left = this.leftPosition(themeId);
	this.innerElements['popupWindow'].style.top = this.topPosition(themeId);
	this.innerElements['popupWindow'].style.animationDuration = 0 + 'ms';
	self.innerElements['popupWindow'].setAttribute('class', classs);
	this.createCloseSection(elementIndex);	
	this.innerElements['popupWindow'].getElementsByClassName('wpda_popup_innerhtml')[0].style.paddingTop = theme['padding'][this.defParams['currentView'] +'_top'] + 'px ';
	this.innerElements['popupWindow'].getElementsByClassName('wpda_popup_innerhtml')[0].style.paddingRight = theme['padding'][this.defParams['currentView'] +'_right'] + 'px ';
	this.innerElements['popupWindow'].getElementsByClassName('wpda_popup_innerhtml')[0].style.paddingBottom = theme['padding'][this.defParams['currentView'] +'_bottom'] + 'px ';
	this.innerElements['popupWindow'].getElementsByClassName('wpda_popup_innerhtml')[0].style.paddingLeft = theme['padding'][this.defParams['currentView'] +'_left'] + 'px';
	this.innerElements['popupWindow'].getElementsByClassName('wpda_popup_innerhtml')[0].style.maxHeight = this.innerElements['popupWindow'].offsetHeight - parseInt(theme['popup_border_width']['desktop']) * 2 - parseInt(this.defParams['closeSectionHeight']) + 1 + 'px';
}

wpdaOrgChartPopup.prototype.leftPosition = function (themeId) {
	let theme = wpda_org_chart_popup_theme[themeId], metricView = 'metric_' + this.defParams['currentView'];
	if (theme['popup_width'][this.defParams['currentView']] != '') {
		var el_width = theme['popup_width'][this.defParams['currentView']] + theme['popup_width'][metricView];
	}
	if (this.innerElements['popupWindow'].getBoundingClientRect != null) {
		var el_width = this.innerElements['popupWindow'].getBoundingClientRect().width;
	}
	if (!(typeof (el_width) != 'undefined' && el_width != 0)) {
		var el_width = '550';
	}
	switch (parseInt(theme['popup_position'])) {
		case 1:
		case 4:
		case 7:
			return 0 + 'px';
			break;
		case 2:
		case 5:
		case 8:
			return (this.innerElements['overlay'].offsetWidth - parseInt(el_width)) / 2 + 'px';
			break;
		case 3:
		case 6:
		case 9:
			return (this.innerElements['overlay'].offsetWidth - parseInt(el_width)) + 'px';
			break;
	}
}

wpdaOrgChartPopup.prototype.topPosition = function (themeId) {
	let theme = wpda_org_chart_popup_theme[themeId], metricView = 'metric_' + this.defParams['currentView'], offsetTop = 0;
	if (theme['popup_width'][this.defParams['currentView']] != '') {
		var el_height = theme['popup_height'][this.defParams['currentView']] + theme['popup_height'][metricView];
	}
	if (this.innerElements['popupWindow'].getBoundingClientRect != null) {
		var el_height = this.innerElements['popupWindow'].getBoundingClientRect().height;
	}
	if (!(typeof (el_height) != 'undefined' && el_height != 0)) {
		var el_height = '550';
	}
	if (theme['popup_fixed_postion'] == 'relative') {
		offsetTop = window.scrollY;
	}
	switch (parseInt(theme['popup_position'])) {
		case 1:
		case 2:
		case 3:
			return offsetTop + 'px';
			break;
		case 4:
		case 5:
		case 6:
			return (this.innerElements['overlay'].offsetHeight - parseInt(el_height)) / 2 + offsetTop + 'px';
			break;
		case 7:
		case 8:
		case 9:
			return (this.innerElements['overlay'].offsetHeight - parseInt(el_height)) + offsetTop + 'px';
			break;
	}
}

wpdaOrgChartPopup.prototype.resizePopup = function () {
	let self = this;
	self.calcViewType();
	if (self.innerElements['popupWindow'] != null) {
		self.innerElements['popupWindow'].setAttribute('style', self.popupStyle(self.popupElements[self.defParams['elementIndex']]['popupTheme']));
		self.innerElements['popupWindow'].style.left = self.leftPosition(self.popupElements[self.defParams['elementIndex']]['popupTheme']);
		self.innerElements['popupWindow'].style.top = self.topPosition(self.popupElements[self.defParams['elementIndex']]['popupTheme']);
	}
}


wpdaOrgChartPopup.prototype.OffsetFromTop = function () {
	let top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
	this.param.OffsetFromTop = top;
}

wpdaOrgChartPopup.prototype.remove = function () {
	let self = this;
	this.popupElements[this.defParams['elementIndex']]['popupContent'].appendChild(this.innerElements['popupWindow'].getElementsByClassName('wpda_popup_innerhtml')[0]);
	for (let j = 0; j < self.defParams['events'].length; j++) {
		self.defParams['events'][j]['element'].removeEventListener(self.defParams['events'][j]['eventName'], self.defParams['events'][j]['eventFunction']);
	}
	this.innerElements['popupWindow'].remove();
	this.innerElements['overlay'].remove();
}

wpdaOrgChartPopup.prototype.calculateAdminBarHeight = function () {
	wv = window.innerWidth;
	wh = window.innerHeight;
	let adminBar = document.getElementById('wpadminbar');
	if (adminBar == null) return;
	if (typeof (adminBar.getBoundingClientRect) != 'undefined') {
		this.param.adminBarHeight = adminBar.getBoundingClientRect().height;
		return;
	}
	this.param.adminBarHeight = '32';
}

wpdaOrgChartPopup.prototype.popupStyle = function (themeId) {
	let self = this;
	let style = '', positionConvert = { 'relative': 'absolute', 'fixed': 'fixed' }, theme = wpda_org_chart_popup_theme[themeId], metricView = 'metric_' + this.defParams['currentView'], animDuration = 50;
	style += 'position:' + positionConvert[theme['popup_fixed_postion']]; // inside parameter value is fixed or relative
	style += ';background-image: linear-gradient(' + this.gradientToString(theme['popup_bg_color']) + ');';
	style += ';border:' + this.borderToString(theme['popup_border_width'], theme['popup_border_type'], theme['popup_border_color']);
	style += ';border-radius:' + parseInt(theme['popup_border_radius']['desktop']) + theme['popup_border_radius']['metric_desktop'];
	if (theme['popup_width'][this.defParams['currentView']] != '') {
		style += ";max-width:" + theme['popup_width'][this.defParams['currentView']] + theme['popup_width'][metricView];
	}
	if (theme['popup_height'][this.defParams['currentView']] != '') {
		style += ";max-height:" + theme['popup_height'][this.defParams['currentView']] + theme['popup_height'][metricView];
	}
	return style;
}

wpdaOrgChartPopup.prototype.calcViewType = function () {
	if (window.innerWidth < parseInt(wpda_org_chart_responsive_sizes['mobile'])) {
		this.defParams['currentView'] = 'mobile';
		return;
	}
	if (window.innerWidth < parseInt(wpda_org_chart_responsive_sizes['tablet'])) {
		this.defParams['currentView'] = 'tablet';
		return;
	}
	this.defParams['currentView'] = 'desktop';
	return;
}
/*helper functions*/
wpdaOrgChartPopup.prototype.createHtmlElement = function (tag = "", attr = {}, innerHTML = "") {
	let el = document.createElement(tag);
	for (const key in attr) {
		el.setAttribute(key, attr[key]);
	}
	if (innerHTML != '') {
		el.innerHTML = innerHTML;
	}
	return el;
}

wpdaOrgChartPopup.prototype.gradientToString = function (gradient) {
	if (gradient == null) {
		return '';
	}
	let color1 = "rgba(255,255,255,0)", color2 = "rgba(255,255,255,0)", direction = "to left";
	if ("color1" in gradient && "color2" in gradient && "gradient" in gradient) {
		color1 = gradient['color1'];
		color2 = gradient['color2'];
		if (gradient['gradient'] != 'none') {
			direction = gradient['gradient'];
		} else {
			color2 = color1;
		}
	}
	return direction + ',' + color1 + ',' + color2;
}

wpdaOrgChartPopup.prototype.borderToString = function (borderWidth, borderType, borderColor) {
	return border = parseInt(borderWidth['desktop']) + borderWidth['metric_desktop'] + " " + borderType + " " + borderColor;
}

wpdaOrgChartPopup.prototype.fixThemeValues = function () {
	let types = ['desktop', 'tablet', 'mobile'];
	if (typeof wpda_org_chart_popup_theme != 'undefined')
		for (let i = 0; i < wpda_org_chart_popup_theme.length; i++) {
			if (typeof (wpda_org_chart_popup_theme[i]) == 'undefined')
				continue;
			for (const key in wpda_org_chart_popup_theme[i]) {
				// if value is not numeric then metric is empty
				if (typeof (wpda_org_chart_popup_theme[i][key]) == 'object' && wpda_org_chart_popup_theme[i][key] != null) {					
					for (let k = 0; k < types.length; k++) {
						if (types[k] in wpda_org_chart_popup_theme[i][key] && wpda_org_chart_popup_theme[i][key]['desktop'] != '') {
							if ('metric_' + types[k] in wpda_org_chart_popup_theme[i][key] && wpda_org_chart_popup_theme[i][key]['metric_' + types[k]] != '') {
								if (isNaN(wpda_org_chart_popup_theme[i][key][types[k]])) {
									wpda_org_chart_popup_theme[i][key]['metric_' + types[k]] = '';
								}
							}
						}
					}
				}
				// if mobile and tablet value don't filled it's equaled desktop value(on responsive parameters)
				if (typeof (wpda_org_chart_popup_theme[i][key]) == 'object' && wpda_org_chart_popup_theme[i][key] != null) {
					if ('desktop' in wpda_org_chart_popup_theme[i][key] && wpda_org_chart_popup_theme[i][key]['desktop'] != '') {
						if ('mobile' in wpda_org_chart_popup_theme[i][key] && wpda_org_chart_popup_theme[i][key]['mobile'] == '') {
							wpda_org_chart_popup_theme[i][key]['mobile'] = wpda_org_chart_popup_theme[i][key]['desktop'];
							if ('metric_desktop' in wpda_org_chart_popup_theme[i][key] && 'metric_mobile' in wpda_org_chart_popup_theme[i][key])
								wpda_org_chart_popup_theme[i][key]['metric_mobile'] = wpda_org_chart_popup_theme[i][key]['metric_desktop'];
						}
						if ('tablet' in wpda_org_chart_popup_theme[i][key] && wpda_org_chart_popup_theme[i][key]['tablet'] == '') {
							wpda_org_chart_popup_theme[i][key]['tablet'] = wpda_org_chart_popup_theme[i][key]['desktop'];
							if ('metric_desktop' in wpda_org_chart_popup_theme[i][key] && 'metric_tablet' in wpda_org_chart_popup_theme[i][key])
								wpda_org_chart_popup_theme[i][key]['metric_tablet'] = wpda_org_chart_popup_theme[i][key]['metric_desktop'];
						}
					}
				}

			}
		}
}

document.addEventListener('DOMContentLoaded', function () {
	var wpdaOrgChartPopupObject = new wpdaOrgChartPopup();
	wpdaOrgChartPopupObject.init();
})