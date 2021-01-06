$(function () {
	chrome.storage.sync.get(["rollno", "name"], function (user) {
		if (user.rollno && user.name) {
			console.log(user);
			$("#helloMessage").text("Hello " + user.name);
			document.getElementById("formDiv").innerHTML = "";
		}
	});

	$("#signInForm").submit(function (e) {
		e.preventDefault();
		//prettier-ignore
		chrome.storage.sync.set({ "rollno": $("#rollno").val() }, function(){
		
		//prettier-ignore
		chrome.storage.sync.set({ "name": $("#name").val() }, function(){
			location.reload();
		});
			
		});
	});
});
