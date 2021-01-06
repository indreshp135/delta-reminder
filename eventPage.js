var ToDelta = {
    "id":"ToDelta",
    "title":"ToDelta",
    "contexts":["selection"]
};

var Personal= {
    "id":"Personal",
    "title":"Personal",
    "contexts":["selection"]
};

chrome.contextMenus.create(Personal)
chrome.contextMenus.create(ToDelta)

chrome.contextMenus.onClicked.addListener(function(clickData){   
    if (clickData.menuItemId == "ToDelta" && clickData.selectionText){  
        window.open("toDelta.html", "extension_popup", "width=500,height=400,status=no,scrollbars=yes,resizable=no")
    }
    if (clickData.menuItemId == "Personal" && clickData.selectionText){  
        window.open("Personal.html", "extension_popup", "width=500,height=400,status=no,scrollbars=yes,resizable=no")
    }
});
