var g_url;
var g_title;

var domain = "http://zinor.net";
var url_login = domain+"/action/user/login";
var url_loginout = domain+"/action/user/loginout";
var url_add = domain+"/action/view/add";
var url_mark = domain+"/action/view/mark";
var url_list = domain+"/action/view/list";
var url_more = domain+"/view/more";
var url_register = domain+"/register";

//初始化
function init() {
	chrome.tabs.getSelected(null, function(tab){
		g_url = tab.url;
		g_title = tab.title;
	});
	load();
}
//从服务器获取数据
function load() {
	showLoading();
	send(url_list,"",function(msg){
		if(msg.error) {
			return ;
		}
		processDatas(msg);
	});
}

//处理数据
function processDatas(json) {
	var node="";
	for(i=0; i<json.length; i++) {
		node = node + "<li id='"+json[i].__key_id+"' url='"+json[i].url+"' title='"+json[i].title+"'>"+json[i].title+"</li>";
	}
	$("#list").html(node);
	showTodo();
}

//添加到view it later
function add() {
	var params = {
		"url" : g_url,
		"title" : g_title
	};
	send(url_add, params, function(msg){
		if(msg.error) {
			return ;
		}
		var node = "<li id='"+msg.id+"' url='"+g_url+"' title='"+g_title+"'>"+g_title+"</li>";
		$("#todo").prepend(node);
		window.close();
	});
}

//登录
function login() {
	var u = $("#username");
	var p = $("#password");
	if(u.val().length<=0){
		u.focus();
		return ;
	}
	if(p.val().length<=0) {
		p.focus();
		return ;
	}
	var params = {
		"username":u.val(),
		"pwd":p.val()
	};
	send(url_login, params, function(msg){
		if(msg.error) {
			$("#error").html(msg.msg);
			u.val("");
			p.val("");
			u.focus();
			return;
		}
		load();
	});
}

//注册
function regist() {
	open(url_register);
}

//点击浏览
function view() {
	var id = $(this).attr("id");
	var url = $(this).attr("url");
	sendToView(id);
	open(url);
}

//浏览更多
function viewMore() {
	open(url_more);
}

//发送服务器已浏览
function sendToView(id) {
	var params = {
		"id":id
	};
	send(url_mark, params, function(msg){
		if(msg.error) {
			// alert(msg.msg);
			return;
		}
	});
}

//新窗口打开url
function open(url) {
	chrome.tabs.create({
		url:url
	});
}

//向服务器发送数据
function send(url, params, callback) {
	$.ajax({
		type:'POST',
		dataType:'json',
		url:url,
		data:params,
		success:function(msg){
			if(msg.unlogin) {
				showLogin();
				return ;
			}
			callback(msg);
		},
		error:function(msg){
		}
	});
}

//退出登录
function loginout() {
	send(url_loginout,"",function(msg){
		load();
	});
}
//显示登录界面
function showLogin() {
	$("#loading").hide();
	$("#todo").hide();
	$("#login").show();
	$("#username").focus();
}
//显示待do页面
function showTodo() {
	$("#loading").hide();
	$("#login").hide();
	$("#todo").show();
}
//显示加载页面
function showLoading() {
	$("#login").hide();
	$("#todo").hide();
	$("#loading").show();
}

$(function(){
	init();
	$("#add").live("click", add);
	$("#btn_login").live("click", login);
	$("#password").keyup(function(event){
		if(event.which==13)
			login();
	});
	$("#btn_regist").live("click", regist);
	$("#todo li").live("click", view);
	$("#more").live("click", viewMore);
	$("#loginout").live("click", loginout);
});


