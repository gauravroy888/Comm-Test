var version="1.4"

/**
 * @constructor
 */
function SearchBoxSettings()
{
    this.isOpen = false;
    this.searchText = '';
    this.enableSVG = false;
    this.parseReferrer = true;
    this.keySettings = new KeySettings();
    this.reOpen = true;
    this.storeSearchText = true;
    this.quickPressDelay = 400;
    this.showScrollbarMarkers = true;
    this.showDeleteOnHover = true;
    this.version = version;
}
    
/**
 * @constructor
 */
function KeySettings()
{
    this.doubleF = true;
    this.ctrlAltF = true;
    this.ctrlShiftF = true;
    this.f2 = true;
}

function storeSearchBoxSettings(all) {
    var type = '';
    if (all) {
        type = "setStorageData";
    }
    else {
        type = "setSearchText";
    }

    chrome.extension.sendMessage({
        "type": type,
        "key": "searchBoxSettings",
        "data": JSON.stringify(searchBoxSettings)
    }, function (response) {
        //console.log("set response:", response);
    });
}
    
function getSearchBoxSettings()
{
    chrome.extension.sendMessage({
        "type": "getStorageData",
        "key": "searchBoxSettings"
    }, function (response) {
        try {
            var tmp = JSON.parse(response);

            if (tmp != null && tmp.version === version) {
                copyValues(searchBoxSettings, tmp);
            }
        } catch (e) {
        }

        if (typeof (highlighter) != 'undefined')
            highlighter.searchBoxSettingsRefreshed();
    });
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "googleKeyword" && typeof (highlighter) != 'undefined') {
        highlighter.checkredirecturl(request.url);
    }
});

function copyValues(toObj,fromObj)
{
    if(fromObj == null || toObj == null)
        return;
        
    for(var i in Object.keys(fromObj))
    {
        var key = Object.keys(fromObj)[i];
        var val = fromObj[key];
        
        if(typeof(key) == 'function')
            continue;

        var toSubObj = toObj[key];
        
        if(typeof(toSubObj) != 'undefined')
        {
            if(typeof(val)=='object')
            {
                copyValues(toSubObj, fromObj[key]);
            }
            else
            {
                toObj[key] = fromObj[key];
            }
        }
    }
}



var searchBoxSettings = new SearchBoxSettings();