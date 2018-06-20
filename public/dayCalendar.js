"use strict";
$(document).ready(function(){
	var Name_of_Day = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var Name_of_Month = window.dataobject.name_month;
	var date = window.dataobject.dt;
	var month = date.getMonth();
	var year = date.getFullYear();
	var number = date.getDate();


	function drawDate(){
		$("#month").text(Name_of_Month[date.getMonth()]+" "+date.getDate()+" "+Name_of_Day[date.getDay()]);
	}	

	function makeDayCalendar(element,temp_date){
		setTimeout(function(){
	        $.ajax({
	            url: "/api/underTasks",
	            type: "GET",
	            contentType: "application/json",
	            success: function (undertask){
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
				if(window.dataobject.dayCalendar.hours < 10){
					window.dataobject.dayCalendar.hours = "0" + window.dataobject.dayCalendar.hours;
				}
				table+="<div class='day_element'>"+window.dataobject.dayCalendar.hours+":"+window.dataobject.dayCalendar.minutes+"</div>";
				window.dataobject.dayCalendar.hours++;
				if(window.dataobject.dayCalendar.hours == 24){
					window.dataobject.dayCalendar.hours = 0;
				}
			}
			table+="</td>";
			table+="<td class='task_field' data-date='"+new Date(date.getFullYear(),date.getMonth(),date.getDate() + 1).toISOString().slice(0,10)+"'>";
			for(var i = 1; i <=24;i++){
				if(window.dataobject.dayCalendar.temp_time == 24) window.dataobject.dayCalendar.temp_time = 0;
				if(window.dataobject.dayCalendar.temp_time < 10){
					window.dataobject.dayCalendar.temp_time = "0"+window.dataobject.dayCalendar.temp_time;
				}
				table+="<div class= 'day_element' data-hours ='"+window.dataobject.dayCalendar.temp_time+":"+window.dataobject.dayCalendar.minutes+"' ></div>";
				window.dataobject.dayCalendar.temp_time++;
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
		window.dataobject.elements.right_nav_month.css("visibility","hidden");
		window.dataobject.elements.left_nav_month.css("visibility","hidden");
		window.dataobject.elements.left_nav_week.css("visibility","hidden");
		window.dataobject.elements.right_nav_week.css("visibility","hidden");
		window.dataobject.elements.right_nav_day.css("visibility","visible");	
		window.dataobject.elements.left_nav_day.css("visibility","visible");
		date = window.dataobject.dt;
		month = date.getMonth();
		year = date.getFullYear();
		date.setDate(new Date().getDate());
		makeDayCalendar("calendar-table",new Date(year,month,new Date().getDate()));
		window.dataobject.elements.month_format.attr('disabled',false);
		window.dataobject.elements.week_format.attr('disabled',false);
		window.dataobject.elements.day_format.attr('disabled',true);
		$("#calendar-box").attr("data-format","day");
	}
	window.dataobject.elements.day_format.on("click",dayCalendarCall);
	window.dataobject.elements.left_nav_day.on("click",change_day_prev);
	window.dataobject.elements.right_nav_day.on("click",change_day_next);

})