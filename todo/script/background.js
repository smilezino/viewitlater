chrome.contextMenus.create({
	"title": "Add To View",
	"contexts":["link"],
	"onclick":contextMenusOnClick
});
function contextMenusOnClick(info, tab) {
	var params = {
		"url" : info.linkUrl,
		"title" : tab.title
	};
	$.ajax({
		type:'POST',
		dataType:'json',
		url:"http://www.zinor.net/action/view/add",
		data:params,
		success:function(msg){
			if(msg.unlogin) {
				alert("please login first");
				return ;
			}
		},
		error:function(msg){
		}
	});
}