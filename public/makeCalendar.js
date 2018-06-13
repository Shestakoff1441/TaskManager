"use strict";
$(document).ready(function () {
	var week_format = $("#week-format");
	var month_format = $("#month-format");
	var day_format = $("#day-format");
	var left_nav_month = $(".left-nav-month");
	var left_nav_week = $(".left-nav-week");
	var left_nav_day = $(".left-nav-day");
	var right_nav_month = $(".right-nav-month");
	var right_nav_week = $(".right-nav-week");
	var right_nav_day = $(".right-nav-day");
	month_format.attr('disabled',true);
	$("#calendar-box").attr("data-format","month");
	window.dataobject = {};
	window.dataobject.dt = new Date();		
	window.dataobject.name_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	var Name_of_Day = window.dataobject.name_days
	window.dataobject.name_month = [
			"January", "February", "March", "April", "May", "June", "July",
			"August", "September", "October", "November", "December"];
	var Name_of_Month = window.dataobject.name_month;
	var day = 0;
	var td_count = 0;
	var dt = window.dataobject.dt;
	var month = dt.getMonth();
	var year = dt.getFullYear();
	var number = dt.getDate();
	window.dataobject.dt = new Date(year,month);
	var startM;

	function addInfoAboutTask(e){
		if($(this).attr("data-event")==""){
			var $td_day = $(this)
			$td_day.dialogbox({
				width: "25%",
				prvDft: true,
				buttons: [
					{
						text: "Delete",
						type:"submit",

						close: true

					},
					{
						text: "Cancel",
						close: true
					}
				],
				hasCloseButton: true,
				hasCloseOverlay: false,
			})
			
			$(this).attr("data-event","active");
		}
	}

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
								days[i].innerHTML+="<div class='circle' style=width:10px;height:10px;padding:3px;border-radius:50%;background:"+undertask[j].color+" data-time = '"+undertask[j].timer+"' data-id = '"+undertask[j]._id+"' data-date="+undertask[j].dater+"></div>"							
								days[i].addEventListener("click",addInfoAboutTask)
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
				td_count++;
				table += '<td></td>';

			}

			for (var i = 0; i < updateCalendar(year, month); i++) {
				td_count++;
				day++;
				table += '<td class ="td_day" data-event = "" data-date ='+new Date(year,month,day + 1).toISOString().slice(0,10)+">"+"<div id='day'>" + day + "</div></td>";
				if (td_count % 7 == 0) {
					table += "</tr><tr>";
				}

			}
			

			while (td_count % 7 != 0) {
				table += "<td></td>";
				td_count++;
			}
			table += "</tr><tr>";
			table += "</table>";
			el.innerHTML = table;

			day = 0;
			
		},350)

	
		
	};

	makeCalendar("calendar-table");

window.dataobject.month = function(){
	makeCalendar("calendar-table");

}

	function month_plus() {
		day = 0;
		td_count = 0;

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
		day = 0;
		td_count = 0;
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
		left_nav_week.css("visibility","hidden");
		right_nav_week.css("visibility","hidden");
		right_nav_day.css("visibility","hidden");	
		left_nav_day.css("visibility","hidden");
		right_nav_month.css("visibility","visible");
		left_nav_month.css("visibility","visible");
		td_count = 0;
		day = 0;
		dt.setDate(1);
		makeCalendar("calendar-table");
		month_format.attr('disabled',true);
		week_format.attr('disabled',false);
		day_format.attr('disabled',false);
		$("#calendar-box").attr("data-format","month");	
	}
	
	month_format.on("click",monthCalendarCall);
	right_nav_month.on("click", month_plus);
	left_nav_month.on("click", month_minus);

});



