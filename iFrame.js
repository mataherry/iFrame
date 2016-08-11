//==UserScript==
//@name           iFrame
//@namespace      http://mataherry.blogspot.com/2011/10/browsing-with-mataFrame.html
//@description    Show iFrame preview on links hover
//@include        *
//==/UserScript==


var iFenable = true;
var iFctrl = false;
var iFalt = false;
var iFshift = false;
var iFbox = true;
var iFwidth = ' ';
var iFheight = ' ';
var iFtop = '5%';
var iFbottom = ' ';
var iFleft = ' ';
var iFright = '5%';
var iFsearch = 'https://www.duckduckgo.com/?q=%s';

function showIFrame() {
	var links = document.getElementsByTagName("a");
	for(var i = 0; i<links.length; i++) {	
		links[i].onmouseover = function() {
			if (!iFenable) return;
			if (iFctrl && window.event.ctrlKey != 1) return;
			if (iFalt && window.event.altKey != 1) return;
			if (iFshift && window.event.shiftKey != 1) return;

			if (iFbox)
				show_link(this);
			else
				show_div(this);
		};
	}
}

function show_link(url) {
	if (document.getElementById('mataLink'))
	{
		div = document.getElementById('mataLink');
	}
	else
	{
		var div = document.createElement('div');
		document.body.insertBefore(div, document.body.firstChild);
	}
	var x = findPosX(url) + url.offsetWidth + 3;
	var y = findPosY(url) - 3;
	div.setAttribute('ID', 'mataLink');
	div.setAttribute('scrolling', 'auto');
	div.setAttribute('style', 'background:skyblue; position: absolute; left:'+x+'px; top:'+y+'px; z-Index: 999; height: 7px; width: 7px; border-style: solid; border-width:2px');
	div.onclick = function() {
		hide('mataLink');
		show_div(url);
	};
	
}

function show_div(url) {
	if (document.getElementById('mataFrame'))
	{
		mDiv = document.getElementById('mataDiv');
		mFrame = document.getElementById('mataFrame');
		mMover = document.createElement('div');
		mSizer = document.createElement('div');
	}
	else
	{
		var mFrame = document.createElement('iFrame');
		var mDiv = document.createElement('div');
		var mMover = document.createElement('div');
		var mSizer = document.createElement('div');
		mDiv.appendChild(mFrame);
		mDiv.appendChild(mMover);
		mDiv.appendChild(mSizer);
	}
	
	var size = '';
	var position = '';
	
	var h = window.innerHeight * 0.9;
	var w = window.innerWidth / 2 * 0.9;
	
	//var x = findPosX(url) + url.offsetWidth;
	var x = window.innerWidth / 2.0;
	var y = window.innerHeight * 0.05;
	
	if (x > window.innerWidth / 2)
	{
		x = (x - url.offsetWidth - w) * 0.8;
	}
	else
	{
		x = x * 1.2;
	}
	// Check off-screen offsets
	if (x <= 0)
	{
		x = window.innerWidth * 0.1;
	}
	else if (x + w > window.innerWidth)
	{
		x = window.innerWidth * 0.4;
	}

	if (iFwidth == "")
		size += 'width:' + w + 'px;';
	else
		size += 'width:' + iFwidth + ';';

	if (iFheight == "")
		size += 'height:' + h + 'px;';
	else
		size += 'height:' + iFheight + ';';
	
	if (iFleft !== "")
		position += 'left:' + iFleft + ';';

	if (iFtop !== "")
		position += 'top:' + iFtop + ';';
	
	if (iFbottom !== "")
		position += 'bottom:' + iFbottom + ';';
	
	if (iFright !== "")
		position += 'right:' + iFright + ';';

	if (position == "")
	{
		position += 'left:' + x + 'px;';
		position += 'top:' + y + 'px;';
	}
	
	mDiv.setAttribute('ID', 'mataDiv');
	mDiv.setAttribute('scrolling', 'auto');
	mDiv.setAttribute('style', 'background-color:white;position: fixed;' + position + ';z-Index: 9999;' + size + ';border-style: solid');
	document.body.insertBefore(mDiv, document.body.firstChild);
	
	mFrame.setAttribute('ID', 'mataFrame');
	mFrame.setAttribute('src', url);
	mFrame.setAttribute('style', 'position:absolute;width:100%;height:100%;border:0');

	mMover.setAttribute('ID', 'mataMover');
	mMover.setAttribute('style', 'position: absolute;height:10px;width:100%;top:-10px;left:-3px;background-color:black;border-left-style:solid;border-right-style:solid;cursor:move');

	mSizer.setAttribute('ID', 'mataSizer');
	mSizer.setAttribute('style', 'position: absolute;height:10px;width:10px;bottom:-5px;right:-5px;background-color:none;cursor:nw-resize;z-Index:10000');	
	
	mMover.onmousedown = function() {
		dragStart(event,'mataDiv','move');
	};
	
	mSizer.onmousedown = function() {
		dragStart(event,'mataDiv','resize');
	};
}

document.onmouseup = show_search;

function show_search()
{
	var t = '';
	if(window.getSelection){
		t = window.getSelection();
	}else if(document.getSelection){
		t = document.getSelection();
	}else if(document.selection){
		t = document.selection.createRange().text;
	}
	
	var selectedText = t;
	
	if (iFsearch == undefined || iFsearch == "")
		return;

	if (selectedText == '') {
		hide('mataSearch');
		return;
	}
	var url = iFsearch.replace("%s", selectedText);
	
	if (document.getElementById('mataSearch'))
	{
		div = document.getElementById('mataSearch');
	}
	else
	{
		var div = document.createElement('div');
		document.body.insertBefore(div, document.body.firstChild);
	}
	var offset = selectedText.getRangeAt(0).getBoundingClientRect();
	var x = offset.right + 5;
	var y = offset.top + window.pageYOffset - 5;
	div.setAttribute('ID', 'mataSearch');
	div.setAttribute('scrolling', 'auto');
	div.setAttribute('style', 'background:skyblue; position: absolute; left:'+x+'px; top:'+y+'px; z-Index: 999; height: 7px; width: 7px; border-style: solid; border-width:2px');
	div.onclick = function() {
		hide('mataSearch');
		show_div(url);
	};
	document.body.insertBefore(div, document.body.firstChild);
}

window.addEventListener("click", hide_frame, true);

function hide_frame(event)
{
	var x = event.x;
	var y = event.y;
	
	var div = document.getElementById('mataDiv');
	if (div == null || window.getComputedStyle(div).visibility == 'none') {
		hide('mataLink');
		return;
	}
	
	if (x < div.offsetLeft || x > div.offsetLeft + div.offsetWidth ||
		 y < document.getElementById('mataMover').offsetTop || y > document.getElementById('mataSizer'))  {
		hide('mataDiv');
	}
}

function hide(element) 
{
	var div = document.getElementById(element);
	if (div)
	{
		div.setAttribute('style', 'display: none');
	}
}

function findPosX(obj)
{
	var curleft = 0;
	if(obj.offsetParent)
	{
		while(1) 
		{
			curleft += obj.offsetLeft;
			if(!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}
	}
	else if(obj.x)
	{
		curleft += obj.x;
	}
	return curleft;
}

function findPosY(obj)
{
	var curtop = 0;
	if(obj.offsetParent)
	{	while(1)
	{
		curtop += obj.offsetTop;
		if(!obj.offsetParent)
			break;
		obj = obj.offsetParent;
	}
	}
	else if(obj.y) 
	{
		curtop += obj.y;
	}
	return curtop;
}

// Global object to hold drag information.
var dragObj = new Object();
var mode = "";
function dragStart(event, id, dragMode) {
	var x, y;
	dragObj.elNode = document.getElementById(id);
	// Get cursor position with respect to the page.
	try {
		x = window.event.clientX + document.documentElement.scrollLeft
		+ document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop
		+ document.body.scrollTop;
	}
	catch (e) {
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;
	}

	mode = dragMode;

	// Save starting positions of cursor and element.
	dragObj.cursorStartX = x;
	dragObj.cursorStartY = y;
	dragObj.elStartLeft = dragObj.elNode.offsetLeft;
	dragObj.elStartTop = dragObj.elNode.offsetTop;
	if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
	if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;
	// Capture mousemove and mouseup events on the page.
	try {
		document.attachEvent("onmousemove", dragGo);
		document.attachEvent("onmouseup",   dragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	catch (e) {
		document.addEventListener("mousemove", dragGo,   true);
		document.addEventListener("mouseup",   dragStop, true);
		event.preventDefault();
	}
}
function dragGo(event) {
	var x, y;
	// Get cursor position with respect to the page.
	try  {
		x = window.event.clientX + document.documentElement.scrollLeft
		+ document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop
		+ document.body.scrollTop;
	}
	catch (e) {
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;
	}
	// Move drag element by the same amount the cursor has moved.
	var drLeft = (dragObj.elStartLeft + x - dragObj.cursorStartX);
	var drTop = (dragObj.elStartTop  + y - dragObj.cursorStartY);

	if (mode == "resize" )
	{
		dragObj.elNode.style.left = dragObj.elStartLeft + "px";
		dragObj.elNode.style.top = dragObj.elStartTop + "px";
		dragObj.elNode.style.width = (event.clientX - dragObj.elStartLeft) + "px";
		dragObj.elNode.style.height = (event.clientY - dragObj.elStartTop) + "px";
	}

	if (mode == "move")
	{
		if (drLeft > 0)
		{
			dragObj.elNode.style.left = drLeft  + "px";
		}
		else
		{
			dragObj.elNode.style.left = "1px";
		}
		if (drTop > 0)
		{
			dragObj.elNode.style.top  = drTop + "px";
		}
		else
		{
			dragObj.elNode.style.top  = "1px";
		}
	}

	try {
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	catch(e){
		event.preventDefault();
	}
}
function dragStop(event) {
	// Stop capturing mousemove and mouseup events.
	try {
		document.detachEvent("onmousemove", dragGo);
		document.detachEvent("onmouseup",   dragStop);
	}
	catch (e) {
		document.removeEventListener("mousemove", dragGo,   true);
		document.removeEventListener("mouseup",   dragStop, true);
	}
}

function loadSettings() {
	var settings = {};
	chrome.storage.local.get('iFrameOptions', function(items) {
		settings = items.iFrameOptions;
		if (settings != null) {
			iFenable = settings.iFenable;
			iFctrl = settings.iFctrl;
			iFalt = settings.iFalt;
			iFshift = settings.iFshift;
			iFbox = settings.iFbox;
			iFwidth = settings.iFwidth;
			iFheight = settings.iFheight;
			iFtop = settings.iFtop;
			iFbottom = settings.iFbottom;
			iFleft = settings.iFleft;
			iFright = settings.iFright;
			iFsearch = settings.iFsearch;
		}
		showIFrame();
	});
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
	// Escape key
    if (evt.keyCode == 27) {
		hide('mataLink');
		hide('mataSearch');
        hide('mataDiv');
    }
};

loadSettings();