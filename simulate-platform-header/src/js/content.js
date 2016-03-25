// console.log("come in content js");
// debugger


// console.log('content chrome', chrome);
;(function(){
var headHeightMap = {
    app: 44
};

var port = chrome.runtime.connect({name: 'content'});
port.onMessage.addListener(function(response) {
    if(response === 'reset'){
        location.reload();
        return;
    }

    if(/Mobile/.test(navigator.userAgent)){
        var platform = response;
        var head, body = document.body;
        var html = document.documentElement;
        var title = document.title;

        if(!(head = body.querySelector('.extention-simulate-head'))){
            head = document.createElement('div');
            head.className = 'extention-simulate-head';
            html.classList.add('extention-simulate');
            body.insertBefore(head, body.firstElementChild);
        }


        if(platform === 'full'){
            html.classList.remove('extention-simulate');
            body.removeChild(head);
            html.style.marginTop = 0;
            html.style.height = body.style.height = innerHeight + 'px';
            return;
        }

        head.innerHTML = (title.length > 10 ? title.slice(0,10) + '...' : title) || '微信head模拟';
        head.classList.remove('weixin', 'qq', 'app', 'alipay');
        head.classList.add(response);

        var headHeight = headHeightMap[platform] || 48;
        html.style.marginTop = headHeight + 'px';
        html.style.height = body.style.height = innerHeight - headHeight + 'px';
    }
});
})();