chrome.storage.sync.get('content', (res) => {
    console.log(res.content)
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
            $.post('https://jsonplaceholder.typicode.com/posts', { url, isPublic, user, name, date, content }) //changes required
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
            $.post('https://jsonplaceholder.typicode.com/posts', { url, isPublic, user, name, date, content }) //changes required
                .done(data => console.log({ data, url, isPublic, user, name, date, content }))
                .fail((xhr, status) => console.log('error:', status));
        })
    })
})