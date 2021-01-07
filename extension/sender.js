$(function() {

    backend = 'https://localhost:8000'

    chrome.storage.sync.get(['content', 'url'], (res) => {
        $("#content").val(res.content);
        $("#url").val(res.url);
    })

    $('#delta').submit((e) => {
        e.preventDefault();
        const isPublic = true;
        chrome.storage.sync.get(['url', 'name'], (result) => {
            const url = result.url;
            const user = result.name;
            const name = $("#name").val()
            const date = $("#date").val()
            const content = $("#content").val()
            console.log({ url, isPublic, user, name, date, content })
            $.post(`${backend}/event`, { url, isPublic, user, name, date, content })
                .done(data => console.log({ data, url, isPublic, user, name, date, content }))
                .fail((xhr, status) => console.log('error:', status));
        })
    })

    $('#personal').submit((e) => {
        e.preventDefault();
        const isPublic = false;
        chrome.storage.sync.get(['url', 'name'], (result) => {
            const url = result.url;
            const user = result.name;
            const name = $("#name").val()
            const date = $("#date").val()
            const content = $("#content").val()
            console.log({ url, isPublic, user, name, date, content })
            $.post(`${backend}/event`, { url, isPublic, user, name, date, content }) //changes required
                .done(data => console.log({ data, url, isPublic, user, name, date, content }))
                .fail((xhr, status) => console.log('error:', status));
        })
    })
})