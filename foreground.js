console.log("netflix en català està injectant codi");

var s = document.createElement('script');
s.src = chrome.runtime.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);