"use strict";
$(document).ready(function(){
	var $today = $("#today");
	$today.on("click",function(){
		if($("#calendar-box").attr("data-format") == "month"){
			var Name_of_Month = window.dataobject.name_month;
			var Name_of_Day = window.dataobject.name_days;
			var mFunc = window.dataobject.month;
			window.dataobject.dt = new Date()
			var dt = window.dataobject.dt;
			var month = dt.getMonth();
			var year = dt.getFullYear();
			window.dataobject.dt = new Date(year,month);
			var startM = new Date(year,month);
			startM = startM.getDay();
			var data_color_array=[];
			dt.setDate(1);
			mFunc();
		}
		else if($("#calendar-box").attr("data-format") == "week"){
			var month = new Date().getMonth();
			var year = new Date().getFullYear();
			var number = new Date().getDate();
			window.dataobject.dt = new Date(year,month,number);
			var wFunc = window.dataobject.week;
			wFunc();	
		}else if($("#calendar-box").attr("data-format") == "day"){
			var dFunc = window.dataobject.day;
			var date = window.dataobject.dt
			var month = new Date().getMonth();
			var year = new Date().getFullYear();
			var number = new Date().getDate();
			date = new Date(year,month,number);
			window.dataobject.dt = date;
			dFunc("calendar-table",date);
		}
	})
})