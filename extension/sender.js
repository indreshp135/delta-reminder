$(function() {

    backend = 'https://localhost:8000'

    chrome.storage.sync.get('content', (res) => {
        $("#content").val(res.content);
    })

    $('#delta').click((e) => {
        e.preventDefault();
        const isPublic = true;
        chrome.storage.sync.get('url', (result) => {
            const url = result.url;
            chrome.storage.sync.get('url', (res) => {
                const user = res.name;
                const name = $("#name").value
                const date = $("#date").value
                const content = $("#content").value
                $.post(`${backend}/event`, { url, isPublic, user, name, date, content }) //changes required
                    .done(data => console.log({ data, url, isPublic, user, name, date, content }))
                    .fail((xhr, status) => console.log('error:', status));
            })
        })
    })

    $('#personal').click((e) => {
        e.preventDefault();
        const isPublic = false;
        chrome.storage.sync.get('url', (result) => {
            const url = result.url;
            chrome.storage.sync.get('url', (res) => {
                const user = res.name;
                const name = $("#name").value
                const date = $("#date").value
                const content = $("#content").value
                console.log(url, isPublic, user, name, date, content)
                $.post(`${backend}/event`, { url, isPublic, user, name, date, content }) //changes required
                    .done(data => console.log({ data, url, isPublic, user, name, date, content }))
                    .fail((xhr, status) => console.log('error:', status));
            })
        })
    })
})