$(document).ready(function(){
	var Name_of_Day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	var short_name_month = window.dataobject.short_name_month;
	var date = window.dataobject.dt;
	var calendarArr=[];
	var calendarWeekDate =[];
	
	function drawDate(){
		date.setDate(date.getDate() - 6);
		var str1 = short_name_month[date.getMonth()]+" "+calendarArr[0]+" - ";
		date.setDate(date.getDate() + 6);	
		var str2 = short_name_month[date.getMonth()]+" "+calendarArr[6];
		var str3 = str1 + str2;
		$("#month").text(str3);
	}

	function makeCalendarArray(){
		date = window.dataobject.dt;
		date.setDate(new Date().getDate());
		date.setDate(date.getDate() - date.getDay());
		for (var i = 0; i <= 6; i++){
			date.setDate(date.getDate() + 1);
			calendarArr[i] = date.getDate();
			calendarWeekDate[i] = new Date(date.getFullYear(),date.getMonth(),date.getDate() + 1).toISOString().slice(0,10);	
		}
	} 
					 
	function change_data_next(){
		for (var i = 0; i <= 6; i++){		
			date.setDate(date.getDate() + 1);
			calendarArr[i] = date.getDate();
			calendarWeekDate[i] = new Date(date.getFullYear(),date.getMonth(),date.getDate() + 1).toISOString().slice(0,10);
		}
		drawDate()
	}
		
	function change_data_prev(){
		date.setDate(date.getDate() - 14);
		for (var i = 0; i <= 6; i++){
			date.setDate(date.getDate() + 1);
			calendarArr[i] = date.getDate();
			calendarWeekDate[i] = new Date(date.getFullYear(),date.getMonth(),date.getDate() + 1).toISOString().slice(0,10);
		}
		drawDate()
	}

	function makeWeekCalendar(element){
		setTimeout(function(){
	        $.ajax({
	            url: "/api/underTasks",
	            type: "GET",
	            contentType: "application/json",
	            success: function (undertask) {
	               	var days = document.querySelectorAll("#name-of-day th");
					for(var i = 0; i < days.length; i++){
						for(var j = 0; j < undertask.length; j++){
							if(days[i].getAttribute("data-date") == undertask[j].dater){
								$('td[data-index ='+(i-1)+"]").css("background",undertask[j].color);
								$('td[data-index ='+(i-1)+"]").attr("data-id",undertask[j]._id);
								days[i].setAttribute("data-id",undertask[j]._id);
								days[i].setAttribute("data-time",undertask[j].timer);
							}
						}	
					}
	            }     
	        });  
		},500);
		
		setTimeout(function(){
			date = window.dataobject.dt;
			var el = document.getElementById(element);
			var table = "<table id='calendar'>";
			drawDate();
			table+="<tr id='name-of-day'>";
			table+="<th></th>";					
			for(var i = 0; i < Name_of_Day.length;i++){
				table+="<th data-date ='"+calendarWeekDate[i]+"' data-index ='"+i+"'>" + Name_of_Day[i] + " "+ calendarArr[i]  + "</th>";			
			}				
			
			table+="<tr>";
			table+="<td>";
			for(var i = 0; i < 24;i++){
				if(window.dataobject.weekCalendar.hours < 10){
					window.dataobject.weekCalendar.hours = "0" + window.dataobject.weekCalendar.hours;
				}
				table+="<div class='week_element'>"+window.dataobject.weekCalendar.hours+"."+window.dataobject.weekCalendar.minutes+"</div>";
				window.dataobject.weekCalendar.hours++;
				if(window.dataobject.weekCalendar.hours==24){
					window.dataobject.weekCalendar.hours = 0;
				}
			}
			table+="</td>";
			
			for(var i = 0; i < 7;i++){
				table+="<td id = 'week_td'data-index ="+ i +" data-date ='"+calendarWeekDate[i]+"'>";
				
				for(var j = 0; j < 24;j++){
					if(window.dataobject.weekCalendar.temp_time == 24) window.dataobject.weekCalendar.temp_time = 0;
					table+="<div class='week_element' data-hours ='"+(window.dataobject.weekCalendar.temp_time)+"'>" +"</div>";
					window.dataobject.weekCalendar.temp_time++;
				}
				table+="</td>";
			}
			table+="</td>";
			table+="</tr>";
			table+="</table>";
			el.innerHTML = table;
		},400)
	};
	
	window.dataobject.elements.right_nav_week.on("click",function(){
		makeWeekCalendar("calendar-table", change_data_next());
	});

	window.dataobject.elements.left_nav_week.on("click",function(){		
		makeWeekCalendar("calendar-table", change_data_prev());
	});

	window.dataobject.week = function(){
		makeWeekCalendar("calendar-table",makeCalendarArray());
	}
	
	function weekCalendarCall(e){
		date = window.dataobject.dt;
		window.dataobject.elements.right_nav_month.css("visibility","hidden");
		window.dataobject.elements.right_nav_day.css("visibility","hidden");
		window.dataobject.elements.left_nav_month.css("visibility","hidden");
		window.dataobject.elements.left_nav_day.css("visibility","hidden");
		window.dataobject.elements.right_nav_week.css("visibility","visible");
		window.dataobject.elements.left_nav_week.css("visibility","visible");
		makeWeekCalendar("calendar-table",makeCalendarArray());
		window.dataobject.elements.month_format.attr('disabled',false);
		window.dataobject.elements.week_format.attr('disabled',true);
		window.dataobject.elements.day_format.attr('disabled',false);
		$("#calendar-box").attr("data-format","week");
	}
	
	window.dataobject.elements.week_format.on("click",weekCalendarCall);
})