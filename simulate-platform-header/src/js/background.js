'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'content') {
        chrome.runtime.onMessage.addListener(function(msg){
            console.log(msg);
            localStorage.platform = msg;
            port.postMessage(msg);
        });

        if(localStorage.platform !== 'reset'){
            port.postMessage(localStorage.platform);
        }
    }
});