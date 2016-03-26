'use strict';

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('popup').addEventListener('click', function(e){
        chrome.runtime.sendMessage(e.target.dataset.platform);

        // console.log(chrome.extension.getBackgroundPage(), e);
    }, false);
}, false);
console.log('popup doing');