chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getStorageData") {
        sendResponse(localStorage[request.key]);
    }

    if (request.type === "setStorageData") {
        localStorage[request.key] = request.data;
        sendResponse('stored.');
    }

    if (request.type === "setSearchText") {
        if (!localStorage[request.key]) {
            // first time storing the settings, store everything
            localStorage[request.key] = request.data;
            sendResponse('stored fully.');
        }
        else {
            // store only state and text
            var settings = JSON.parse(localStorage[request.key]);
            var requestData = JSON.parse(request.data);
            settings.isOpen = requestData.isOpen;
            settings.searchText = requestData.searchText;
            localStorage[request.key] = JSON.stringify(settings);
            sendResponse('stored partially.');
        }
    }
});



chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tab.id, { "type": "googleKeyword", "url": tab.url },
        function (response) {
            //console.log("set response:", response);
        });
});

