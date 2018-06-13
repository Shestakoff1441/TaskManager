"use strict";
$(document).ready(function(){
	var week_format = $("#week-format");
	var month_format = $("#month-format");
	var day_format = $("#day-format");
	var left_nav_month = $(".left-nav-month");
	var left_nav_week = $(".left-nav-week");
	var left_nav_day = $(".left-nav-day");
	var right_nav_month = $(".right-nav-month");
	var right_nav_week = $(".right-nav-week");
	var right_nav_day = $(".right-nav-day");
	var Name_of_Day = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var Name_of_Month = window.dataobject.name_month;
	var hours = 1;
	var minutes = "00";
	var date = window.dataobject.dt;
	var month = date.getMonth();
	var year = date.getFullYear();
	var number = date.getDate();
	var temp_time = 1;

	function drawDate(){
		$("#month").text(Name_of_Month[date.getMonth()]+" "+date.getDate()+" "+Name_of_Day[date.getDay()]);
	}	


	function makeDayCalendar(element,temp_date){
		setTimeout(function(){
	        $.ajax({
	            url: "/api/underTasks",
	            type: "GET",
	            contentType: "application/json",
	            success: function (undertask) {
					for(var i = 0; i < undertask.length; i++){
						var now_day = $(".task_field");
						if(undertask[i].dater == now_day.attr("data-date")){
							for(var j = 0; j < now_day.children(".day_element").length;j++){
								if(now_day.children(".day_element")[j].getAttribute("data-hours") == undertask[i].timer){
									while(now_day.children(".day_element")[j].getAttribute("data-hours") <= undertask[i].timer2){
										now_day.children(".day_element")[j].style.background=undertask[i].color;
										now_day.children(".day_element")[j].style.borderColor="transparent";
										now_day.children(".day_element")[j].setAttribute("data-id",undertask[i]._id);
										j++;
									}
								}
							}		
						}
					}		
	            }     
	        });		    
		},500);


		setTimeout(function(){
			var el = document.getElementById(element);
			var table = "<table id='calendar'>";
			date = window.dataobject.dt;
			year = date.getFullYear();
			month = date.getMonth();
 			number = date.getDate();
			date = temp_date;
			drawDate();
			table+="<td class='time_field'>";
			for(var i = 0; i < 24;i++){ 
				if(hours < 10){
					hours = "0" + hours;
				}
				table+="<div class='day_element data'>"+hours+":"+minutes+"</div>";
				hours++;
				if(hours==24){
					hours = 0;
				}
			}
			table+="</td>";
			table+="<td class='task_field' data-date='"+new Date(date.getFullYear(),date.getMonth(),date.getDate() + 1).toISOString().slice(0,10)+"'>";
			for(var i = 1; i <=24;i++){
				if(temp_time == 24) temp_time = 0;
				if(temp_time < 10){
					temp_time = "0"+temp_time;
				}
				table+="<div class= 'day_element' data-hours ='"+temp_time+":"+minutes+"' ></div>";
				temp_time++;

			}
			table+="</table>";
			el.innerHTML = table;
		},350)
	}
	window.dataobject.day = makeDayCalendar;
	
	function change_day_next(){
		date = window.dataobject.dt;
		date.setDate(date.getDate() + 1);
		drawDate();
		makeDayCalendar("calendar-table",date);
	}
	function change_day_prev(){
		date = window.dataobject.dt;
		date.setDate(date.getDate() - 1);
		drawDate();
		makeDayCalendar("calendar-table",date);
	}
	


	 function dayCalendarCall(){
		right_nav_month.css("visibility","hidden");
		left_nav_month.css("visibility","hidden");
		left_nav_week.css("visibility","hidden");
		right_nav_week.css("visibility","hidden");
		right_nav_day.css("visibility","visible");	
		left_nav_day.css("visibility","visible");
		date = window.dataobject.dt;
		month = date.getMonth();
		year = date.getFullYear();
		date.setDate(new Date().getDate());
		makeDayCalendar("calendar-table",new Date(year,month,new Date().getDate()));
		month_format.attr('disabled',false);
		week_format.attr('disabled',false);
		day_format.attr('disabled',true);
		$("#calendar-box").attr("data-format","day");
	}
	day_format.on("click",dayCalendarCall);
	left_nav_day.on("click",change_day_prev);
	right_nav_day.on("click",change_day_next);

})