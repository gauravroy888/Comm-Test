document.getElementById('optionsPage').addEventListener("click", function () {
    chrome.tabs.create({ url: chrome.extension.getURL('/settings/settings.html') });
});