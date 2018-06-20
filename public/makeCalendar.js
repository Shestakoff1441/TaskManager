"use strict";
$(document).ready(function () {
	window.dataobject = {};
	window.dataobject.elements = {
		"week_format":    $("#week-format"),
		"month_format":   $("#month-format"),
		"day_format":     $("#day-format"),
		"left_nav_month": $(".left-nav-month"),
		"left_nav_week":  $(".left-nav-week"),
		"left_nav_day":   $(".left-nav-day"),
		"right_nav_month":$(".right-nav-month"),
		"right_nav_week": $(".right-nav-week"),
		"right_nav_day":  $(".right-nav-day")
	};

	window.dataobject.elements.month_format.attr('disabled',true);
	$("#calendar-box").attr("data-format","month");
	
	window.dataobject.dt = new Date();		
	window.dataobject.name_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	var Name_of_Day = window.dataobject.name_days;
	window.dataobject.name_month = [
			"January", "February", "March", "April", "May", "June", "July",
			"August", "September", "October", "November", "December"];
	window.dataobject.short_name_month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	window.dataobject.monthCalendar = {
		"day":0,
		"td_count":0
	};
	window.dataobject.weekCalendar = {
		"hours":1,
		"minutes":"00",
		"temp_time":1
	};
	window.dataobject.dayCalendar = {
		"hours":1,
		"minutes":"00",
		"temp_time":1
	};
	var Name_of_Month = window.dataobject.name_month;
	var dt = window.dataobject.dt;
	var month = dt.getMonth();
	var year = dt.getFullYear();
	var number = dt.getDate();
	window.dataobject.dt = new Date(year,month);
	var startM;

	function makeCalendar(element) {
		setTimeout(function(){
	        $.ajax({
	            url: "/api/underTasks",
	            type: "GET",
	            contentType: "application/json",
	            success: function (undertask) {
	               	var days = $(".td_day");
					for(var i = 0; i < days.length; i++){
						for(var j = 0; j < undertask.length; j++){
							if(days[i].getAttribute("data-date") == undertask[j].dater){	
								days[i].innerHTML+="<div class='circle' style=width:10px;height:10px;padding:3px;border-radius:50%;background:"
								+undertask[j].color+" data-time = '"+undertask[j].timer+"' data-id = '"+undertask[j]._id+"' data-date="
								+undertask[j].dater+"></div>";							
							}
						}	
					}  	
	            }     
	        }); 
		},500);


		setTimeout(function(){
			dt = window.dataobject.dt;
			month = dt.getMonth();
			year = dt.getFullYear();
			number = dt.getDate();
			var el = document.getElementById(element);
			var table = "<table id='calendar'>";
			table+='<tr id="name-of-day">';
			startM = new Date(year,month);
			startM = startM.getDay();
	
			$('#date-now').text(new Date().getDate()+" "+Name_of_Month[new Date().getMonth()]+" "+ new Date().getFullYear());
			$('#month').text(Name_of_Month[month]+" "+year);
			for (var i = 0; i < Name_of_Day.length; i++) {
				table += '<th>' + Name_of_Day[i] + '</th>';
				if (i == Name_of_Day.length) {
					table += "</tr>";
				}
			}
			table += "<tr>";
			if (startM == 0) {
				startM += 7;
			}
			for (var i = 0; i < startM - 1; i++) {
				window.dataobject.monthCalendar.td_count++;
				table += '<td></td>';

			}
			for (var i = 0; i < updateCalendar(year, month); i++) {
				window.dataobject.monthCalendar.td_count++;
				window.dataobject.monthCalendar.day++;
				table += '<td class ="td_day" data-event = "" data-date ='
				+new Date(year,month,window.dataobject.monthCalendar.day + 1).toISOString().slice(0,10)+">"
				+"<div id='day'>" + window.dataobject.monthCalendar.day + "</div></td>";
				if (window.dataobject.monthCalendar.td_count % 7 == 0) {
					table += "</tr><tr>";
				}

			}
			while (window.dataobject.monthCalendar.td_count % 7 != 0) {
				table += "<td></td>";
				window.dataobject.monthCalendar.td_count++;
			}
			table += "</tr><tr>";
			table += "</table>";
			el.innerHTML = table;
			window.dataobject.monthCalendar.day = 0;	
		},350)
	};

	makeCalendar("calendar-table");

	window.dataobject.month = function(){
		makeCalendar("calendar-table");
	}

	function month_plus() {
		window.dataobject.monthCalendar.day = 0;
		window.dataobject.monthCalendar.td_count = 0;
		month++;
		if (month % 12 == 0 && month != 0) {
			month = 0;
			year++;
		}
		dt.setFullYear(year);
		dt.setMonth(month);
		dt.setDate(1);
		startM = dt.getDay();
		updateCalendar(year, month);	
		makeCalendar("calendar-table");
		
	}

	function month_minus() {
		window.dataobject.monthCalendar.day = 0;
		window.dataobject.monthCalendar.td_count = 0;
		month--;
		if (month % 12 == 0 && month != 0) {
			month = 0;
			year--;		
		}
		if(month < 0){
			month = 11;
			year--;
		}
		dt.setFullYear(year);
		dt.setMonth(month);
		startM = dt.getDay();
		updateCalendar(year, month);
		makeCalendar("calendar-table");
	}

	function updateCalendar(y, m) {
		return days_in_month_all();
		function days_in_month_all() {
			return 32 - new Date(y, m, 32).getDate();
		}
	}
	
	function monthCalendarCall(e){
		window.dataobject.elements.left_nav_week.css("visibility","hidden");
		window.dataobject.elements.right_nav_week.css("visibility","hidden");
		window.dataobject.elements.right_nav_day.css("visibility","hidden");	
		window.dataobject.elements.left_nav_day.css("visibility","hidden");
		window.dataobject.elements.right_nav_month.css("visibility","visible");
		window.dataobject.elements.left_nav_month.css("visibility","visible");
		window.dataobject.monthCalendar.td_count = 0;
		window.dataobject.monthCalendar.day = 0;
		dt.setDate(1);
		makeCalendar("calendar-table");
		window.dataobject.elements.month_format.attr('disabled',true);
		window.dataobject.elements.week_format.attr('disabled',false);
		window.dataobject.elements.day_format.attr('disabled',false);
		$("#calendar-box").attr("data-format","month");	
	}
	
	window.dataobject.elements.month_format.on("click",monthCalendarCall);
	window.dataobject.elements.right_nav_month.on("click", month_plus);
	window.dataobject.elements.left_nav_month.on("click", month_minus);

});



