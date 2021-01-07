var date = null;
var backend = "https://localhost:8000"
chrome.storage.sync.get('olddate', (fetch) => {
    date = new Date(fetch.olddate)
    if (Date.now() - date > 8640) {
        chrome.storage.sync.set({ olddate: Date.now() }, () => {
            var notifications;
            console.log(date);
            $.get(`${backend}/events`)
                .done(data => {
                    notifications = data
                    var notifOptions = {
                        type: "basic",
                        iconUrl: "icon/icon48.png",
                        title: "Remainders from delta",
                        message: `You have ${notifications.length} remaining to be marked as read.`,
                        isClickable: true,
                    };
                    chrome.notifications.create('remind', notifOptions);
                    chrome.notifications.onClicked.addListener(() => {
                        chrome.tabs.create({
                            url: `${backend}/events`, //changes required
                            active: true
                        }, function(tab) {
                            chrome.windows.create({
                                tabId: tab.id,
                                focused: true
                            });
                        });
                    })
                })
                .fail((xhr, status) => console.log('error:', status));
        })
    }
})

var ToDelta = {
    "id": "ToDelta",
    "title": "ToDelta",
    "contexts": ["selection"]
};

var Personal = {
    "id": "Personal",
    "title": "Personal",
    "contexts": ["selection"]
};

chrome.contextMenus.create(Personal);
chrome.contextMenus.create(ToDelta);

chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "ToDelta" && clickData.selectionText) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            chrome.storage.sync.set({ url: tabs[0].url })
        });
        chrome.storage.sync.set({ content: clickData.selectionText })
        window.open("toDelta.html", "extension_popup", "width=500,height=500,status=no,scrollbars=yes,resizable=no")
    }
    if (clickData.menuItemId == "Personal" && clickData.selectionText) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            chrome.storage.sync.set({ url: tabs[0].url })
        });
        chrome.storage.sync.set({ content: clickData.selectionText })
        window.open("Personal.html", "extension_popup", "width=500,height=500,status=no,scrollbars=yes,resizable=no")
    }
});