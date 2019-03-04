$('#abc').click(function () {
    sendMessageToContentScript('cookie', (response) => {
        console.log('收到来自content-script的回复：' + response);
    });
});

$('#refresh').click(function () {
    sendMessageToContentScript('refresh', (response) => {
        $("#text").html(decodeURIComponent(response));
    });
});


function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}