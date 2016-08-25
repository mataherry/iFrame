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
var iFwidth = '';
var iFheight = '';
var iFtop = '5%';
var iFbottom = '';
var iFleft = '';
var iFright = '5%';
var iFsearch = 'https://www.duckduckgo.com/?q=%s';

function showIFrame(e) {
	if (e == null || e.target == null) return;
	
	var target = getLinkElement(e.target);
	
	if (target != null) {

		if (!iFenable) return;
		if (iFctrl && window.event.ctrlKey != 1) return;
		if (iFalt && window.event.altKey != 1) return;
		if (iFshift && window.event.shiftKey != 1) return;

		if (iFbox)
			show_mataBox(target);
		else
			show_mataDiv(target);
	}
}

function show_mataBox(linkEl) {
	if (document.getElementById('mataBox'))
	{
		div = document.getElementById('mataBox');
	}
	else
	{
		var div = document.createElement('div');
		div.setAttribute('id', 'mataBox');
		document.body.insertBefore(div, document.body.firstChild);
	}
	var rect = getOffsetRect(linkEl);
	var x = rect.left + linkEl.offsetWidth + 3;
	var y = rect.top - 3;
	if(y < 0) y = 0;
	
	//div.setAttribute('scrolling', 'auto');
	div.setAttribute('style', 'position: absolute; left:'+x+'px; top:'+y+'px; z-Index: 99999;');
	div.onclick = function() {
		hideElementById('mataBox');
		show_mataDiv(linkEl.href);
	};
	
}

function show_mataDiv(url) {
	if (document.getElementById('mataDiv'))
	{
		mDiv = document.getElementById('mataDiv');
		mFrame = document.getElementById('mataFrame');
		mMover = document.getElementById('mataMover');
		mSizer = document.getElementById('mataSizer');
	}
	else
	{
		var mDiv = document.createElement('div');
		var mFrame = document.createElement('iFrame');		
		var mMover = document.createElement('div');
		var mSizer = document.createElement('div');
		mDiv.appendChild(mMover);
		mDiv.appendChild(mFrame);
		mDiv.appendChild(mSizer);
		document.body.insertBefore(mDiv, document.body.firstChild);
		
		mDiv.setAttribute('ID', 'mataDiv');
		mDiv.setAttribute('scrolling', 'auto');
	
		mFrame.setAttribute('ID', 'mataFrame');
		mMover.setAttribute('ID', 'mataMover');
		mSizer.setAttribute('ID', 'mataSizer');
		
		mMover.onmousedown = function() {
			dragStart(event,'mataDiv','move');
		};
		
		mSizer.onmousedown = function() {
			dragStart(event,'mataDiv','resize');
		};
	}
	
	var size = '';
	var position = '';
	
	var h = window.innerHeight * 0.9;
	var w = window.innerWidth / 2 * 0.9;
	
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
	
	mDiv.setAttribute('style', 'position: fixed;' + position + ';z-Index: 9999;' + size + ';');
	
	mFrame.setAttribute('src', url);

	mMover.innerHTML="<p onclick=\"window.open('" + url + "', '_blank')\" style='float:left'>Open in New Tab</a>";
	mMover.innerHTML+="<p onclick=\"document.getElementById('mataDiv').setAttribute('style', 'display: none');\" style='float:right'>X</p>";	
}

function show_mataSearch()
{
	if (!iFenable) return;
	if (iFctrl && window.event.ctrlKey != 1) return;
	if (iFalt && window.event.altKey != 1) return;
	if (iFshift && window.event.shiftKey != 1) return;

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
		hideElementById('mataBox');
		hideElementById('mataSearch');
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
		div.setAttribute('ID', 'mataSearch');
		div.setAttribute('scrolling', 'auto');
		document.body.insertBefore(div, document.body.firstChild);
	}
	var offset = selectedText.getRangeAt(0).getBoundingClientRect();
	var x = offset.right + 5;
	var y = offset.top + window.pageYOffset - 5;
	div.setAttribute('style', 'position: absolute; left:'+x+'px; top:'+y+'px; z-Index: 999;');
	div.onclick = function() {
		hideElementById('mataSearch');
		show_mataDiv(url);
	};
}

function hide_mataDivs(event)
{
	var x = event.x;
	var y = event.y;
	
	var div = document.getElementById('mataDiv');
	if (div == null || window.getComputedStyle(div).visibility == 'none') {
		hideElementById('mataBox');
		return;
	}
	
	if (x < div.offsetLeft || x > div.offsetLeft + div.offsetWidth ||
		 y < document.getElementById('mataMover').offsetTop || y > document.getElementById('mataSizer'))  {
		hideElementById('mataDiv');
		document.getElementById('mataFrame').src = 'about:blank';
	}
}

function hideElementById(element) 
{
	var div = document.getElementById(element);
	if (div)
	{
		div.setAttribute('style', 'display: none');
	}
}

function getLinkElement(t) {
	var el = t;
	do {
		if (el.tagName != null && el.tagName.toLowerCase() === "a") {
			if (el.getAttribute("href") == "#")
				return null;
			return el;
		}
	} while (el = el.parentNode);

	return null;
}

// Source: http://javascript.info/tutorial/coordinates
function getOffsetRect(el) {
    var box = el.getBoundingClientRect();
     
    var body = document.body;
    var docEl = document.documentElement;
     
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
     
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
     
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
     
    return { top: Math.round(top), left: Math.round(left) };
}

//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//*****************************************************************************

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
	});
}

loadSettings();

document.addEventListener('mousemove', showIFrame);
document.onmouseup = show_mataSearch;
window.addEventListener("click", hide_mataDivs, true);

document.onkeydown = function(evt) {
    evt = evt || window.event;
	// Escape key
    if (evt.keyCode == 27) {
		hideElementById('mataBox');
		hideElementById('mataSearch');
        hideElementById('mataDiv');
		document.getElementById('mataFrame').src = 'about:blank';
    }
};