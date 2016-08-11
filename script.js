chrome.webNavigation.onCompleted.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "iFrame.js"});
});