$(function () {
    getSearchBoxSettings();
    setTimeout(readSettings, 200);

    $("#enableSVG").buttonset();
    $("#parseReferrer").buttonset();
    $("#reopen").buttonset();
    $("#rememberTerm").buttonset();
    $("#doubleF").buttonset();
    $("#ctrlaltF").buttonset();
    $("#ctrlshiftF").buttonset();
    $("#f2").buttonset();
    $("#showScrollbarMarkers").buttonset();
    $("#showDeleteOnHover").buttonset();

    $("#reset").button();

    $("#reset").click(resetSettings);

    document.addEventListener('click', storeSettings);

    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", chrome.extension.getURL('manifest.json'), false);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                var theManifest = JSON.parse(this.responseText);
                $("#version").text(theManifest.version);
            }
        };
        xhr.send();
    } catch (ex) { } // silently fail

});

function resetSettings(e) {
    $("#reset").text('Done.');
    $("#reset").button('refresh');

    searchBoxSettings = new SearchBoxSettings();
    storeSearchBoxSettings(true);
    readSettings();

    setTimeout('location.reload(true);', 3000);
}

function readSettings() {
    setSetting('enableSVG', searchBoxSettings.enableSVG);
    setSetting('ParseReferrer', searchBoxSettings.parseReferrer);
    setSetting('Reopen', searchBoxSettings.reOpen);
    setSetting('RememberTerm', searchBoxSettings.storeSearchText);
    setSetting('DoubleF', searchBoxSettings.keySettings.doubleF);
    setSetting('CtrlaltF', searchBoxSettings.keySettings.ctrlAltF);
    setSetting('CtrlshiftF', searchBoxSettings.keySettings.ctrlShiftF);
    setSetting('F2', searchBoxSettings.keySettings.f2);
    setSetting('showScrollbarMarkers', searchBoxSettings.showScrollbarMarkers);
    setSetting('showDeleteOnHover', searchBoxSettings.showDeleteOnHover);
}

function storeSettings(e) {
    searchBoxSettings.enableSVG = getSetting('enableSVG');
    searchBoxSettings.parseReferrer = getSetting('ParseReferrer');
    searchBoxSettings.reOpen = getSetting('Reopen');
    searchBoxSettings.storeSearchText = getSetting('RememberTerm');
    searchBoxSettings.keySettings.doubleF = getSetting('DoubleF');
    searchBoxSettings.keySettings.ctrlAltF = getSetting('CtrlaltF');
    searchBoxSettings.keySettings.ctrlShiftF = getSetting('CtrlshiftF');
    searchBoxSettings.keySettings.f2 = getSetting('F2');
    searchBoxSettings.showScrollbarMarkers = getSetting('showScrollbarMarkers');
    searchBoxSettings.showDeleteOnHover = getSetting('showDeleteOnHover');

    storeSearchBoxSettings(true);
}

function refreshButtons() {
    $("#enableSVG").buttonset('refresh');
    $("#parseReferrer").buttonset('refresh');
    $("#reopen").buttonset('refresh');
    $("#rememberTerm").buttonset('refresh');
    $("#doubleF").buttonset('refresh');
    $("#ctrlaltF").buttonset('refresh');
    $("#ctrlshiftF").buttonset('refresh');
    $("#f2").buttonset('refresh');
    $("#showScrollbarMarkers").buttonset('refresh');
    $("#showDeleteOnHover").buttonset('refresh');
}

function setSetting(name, value) {
    var on = $('#radio' + name + 'On');
    var off = $('#radio' + name + 'Off');


    off.attr('checked', !value);
    on.attr('checked', value);

    refreshButtons();
}


function getSetting(name) {
    var on = $('#radio' + name + 'On');
    var off = $('#radio' + name + 'Off');

    var val = off.attr('checked');

    on.attr('checked', !val);

    return !val;
}
       