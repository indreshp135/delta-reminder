var backend = "http://localhost:8000";
$(function () {
	chrome.storage.sync.get(["rollno", "name"], function (user) {
		if (user.rollno && user.name) {
			console.log(user);
			$("#helloMessage").text("Hello " + user.name);
			document.getElementById("formDiv").innerHTML = "";
			$("a").attr(
				"href",
				`${backend}/events/${user.name}/${user.rollno}`
			);
		} else {
			$("#reminders").hide();
			$("#logoutBtn").hide();
		}
	});

	$("#logoutBtn").click(function (e) {
		chrome.storage.sync.clear();
		chrome.runtime.reload();
	});

	$("#signInForm").submit(function (e) {
		e.preventDefault();
		//prettier-ignore
		chrome.storage.sync.set({ "rollno": $("#rollno").val(), "name": $("#name").val() }, function() {
            $.post(`${backend}/add/user`, { rollno: $("#rollno").val(), name: $("#name").val() })
                .done(data => console.log(data))
                .fail((xhr, status) => console.log('error:', status));
            
                chrome.runtime.reload();
            location.reload();
        });
	});
});
