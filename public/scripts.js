$(document).ready(function () {
	var $create_task_button = $(".create_task");
	var $create_section_button = $(".create_section");
	var $delete_cross = $(".close_cross");

	$create_section_button.dialogbox({
		width: "40%",
		prvDft: true,
		keyEvent: {
			keypress: function (e) {
				var $dialogbox = $(".dialogbox");
				if (e.which == 13) {
					createCategory();
					$dialogbox.remove();
				}
			},
		},
		buttons: [
			{
				text: "Create",
				type:"submit",
				click: function (e) {
					e.preventDefault();
					createCategory();
				},
				close: true
			},
			{
				text: "Cancel",
				close: true
			}
		],
		hasCloseButton: true,
		hasCloseOverlay: false,
	});
	


	$create_task_button.dialogbox({
		width: "60%",
		prvDft: true,
		keyEvent: {
			keypress: function (e) {
				var $dialogbox = $(".dialogbox");
				if (e.which == 13) {
					createTask();
					$dialogbox.remove();
				}
			},
		},
		buttons: [
			{
				text: "Create",
				type:"submit",
				click: function () {
					createTask();	
				},
				close: true
			},
			{
				text: "Cancel",
				close: true
			}
		],
		hasCloseButton: true,
		hasCloseOverlay: false,

	});
	


	function createDeleteCategoryButton(){
		var $del_section = $(".del_section[data-event = '']");
		$del_section.dialogbox({
			width: "25%",
			prvDft: true,
			buttons: [
				{
					text: "Delete",
					type:"submit",
					click:function(){
						var id = this.parentNode.previousSibling.getAttribute("data-id");
						deleteCategory(id);
					},
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
	}


	function addCategory(tasks){
		return "<div class ='section_of_task' data-id = '"+tasks._id+"'>" +"<h4 class = 'name_section' data-color = '"+tasks.task_color+"'>" + tasks.name+"</h4>"+"<span class='del_section' data-event = '' data-id = '"+tasks._id+"'>X</span>"+"</div>";
	}

	function createCategory() {
	    $.ajax({
	        url: "api/tasks",
	        contentType: "application/json",
	        method: "POST",
	        data: JSON.stringify({
	            name : $(".task_name_input").val(),
	            color: $(".color_picker").val()
	        }),
	        success: function (tasks) {
	        	$(".tasks").append(addCategory(tasks));
	        	isExistCategory();
	        	if($(".del_section")[$(".del_section").length-1].getAttribute("data-event") == ""){
	        		createDeleteCategoryButton();
	        		$(".del_section")[$(".del_section").length-1].setAttribute("data-event","active");
	        	}	
	        }
	    })
	}


	function getCategory() {
	    $.ajax({
	        url: "/api/tasks",
	        type: "GET",
	        contentType: "application/json",
	        success: function (tasks) {
	            var category = '';
	            $.each(tasks, function (index, tasks) {
	                category +=  addCategory(tasks);
	            })
	            $(".tasks").append(category);
	            isExistCategory();
	            createDeleteCategoryButton();
	            $(".del_section").attr("data-event","active");
	         }
	    });
	}

	function deleteCategory(id){
		$.ajax({
            url: "api/tasks/"+id,
            contentType: "application/json",
            method: "DELETE",
            success: function (section) {
              	$(".section_of_task[data-id ='" + section + "']").remove();
              	isExistCategory();
            }
	    })
	}

	function isExistCategory() {
		var task = $(".tasks").find("div");
		if (task.length == 0) {
			$create_task_button.attr('disabled',true);
			
		} else {
			$create_task_button.attr('disabled',false);
		}
	}

	function addTask(undertask_name,undertask_id,undertask_date,undertask_time,undertask_color){
		return "<div class ='name_of_task' data-date = '"+undertask_date+"' data-time = '"+undertask_time+"' data-id = '"+undertask_id+"'>"+undertask_name +"<span> "+undertask_date+"</span>"+"<span class = 'close_cross' data-id = '"+undertask_id+"'><i class='fa fa-close'></i></span>"+"</div>";		
	}


	function createTask() {
		 $.ajax({
            url: "api/underTasks",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                taskName          :$(".task_name_input").val(),
                task_description  :$(".description_task").val(),
                list_value        :$(".choice_section option:selected").text(),
                data_value        :$(".data_picker").val(),
                time_value 		  :$(".time_picker").val(),
                time_value2 	  :$(".time_picker2").val(),
                time_value2 	  :$(".time_picker2").val(),
                task_color 		  :$("h4:contains("+$(".choice_section option:selected").text()+")").attr("data-color")
            }),
            success: function (undertask) {
				showNewTasks(undertask)
				createDeleteTaskButton();
       		}
        })
	};
		
	function getTask(){
		setTimeout(function(){
	        $.ajax({
	            url: "/api/underTasks",
	            type: "GET",
	            contentType: "application/json",
	            success: function (undertask) {
	                var task = '';
	                $.each(undertask, function (index, undertask) {
	                	createDeleteTaskButton();
	                	addToSideMenu(undertask)
	                })
	            }
	        });
		},50)
	}

	function deleteTask(id) {
        $.ajax({
            url: "api/underTasks/"+id,
            contentType: "application/json",
            method: "DELETE",
            success: function (id) {
            	var id_section =$("[data-id='"+id+"']").parent().parent().children("span.del_section").attr("data-id");
            	if($(".section_of_task[data-id='"+id_section+"']").children(".name_of_task").length == 1){
            		$("[data-id='"+id+"']").parent().children("span.del_section").attr("data-event","");
            		createDeleteCategoryButton();
            		$("[data-id='"+id+"']").parent().children("span.del_section").attr("data-event","active");
            	}
              	$(".name_of_task[data-id ='" + id + "']").remove();
              	$(".circle[data-id='"+id+"']").remove();
              	$("#week_td[data-id='"+id+"']").removeAttr("data-index");
              	$("#week_td[data-id='"+id+"']").css("background","none");
              	$("#week_td[data-id='"+id+"']").removeAttr("data-id");
              	$(".day_element[data-id='"+id+"']").css("background","none");
              	$(".day_element[data-id='"+id+"']").css("borderColor","lightgrey");
              	$(".day_element[data-id='"+id+"']").removeAttr("data-id");
              	isExistCategory();             	  	
            }
        })
    }

function addToSideMenu(undertask){
	setTimeout(function(){
		var task_section_name = $(".tasks").find(".name_section");
			var task_section = $(".tasks").find(".section_of_task");
			for (var i = 0; i < task_section.length; i++){
				if (task_section_name[i].textContent == undertask.value) {            		
		            $(".tasks .section_of_task")[i].innerHTML += addTask(undertask.name_task,undertask._id,undertask.dater,undertask.timer);
		        }
		    }     
	},400)
}

	function showNewTasks(undertask){
		setTimeout(function(){
			addToSideMenu(undertask)
            $(".td_day[data-date='"+undertask.dater+"']").append("<div class='circle' style=width:10px;height:10px;padding:3px;border-radius:50%;background:"+undertask.color+" data-time = '"+undertask.timer+"' data-id = '"+undertask._id+"' data-date="+undertask.dater+"></div>");    
            $("#week_td[data-date='"+undertask.dater+"']").css("background",undertask.color);
            $("#week_td[data-date='"+undertask.dater+"']").attr("data-id",undertask._id);
				var now_day = $(".task_field");
				if(undertask.dater == now_day.attr("data-date")){
					for(var j = 0; j < now_day.children(".day_element").length;j++){
						if(now_day.children(".day_element")[j].getAttribute("data-hours") == undertask.timer){
							while(now_day.children(".day_element")[j].getAttribute("data-hours") <= undertask.timer2){
								now_day.children(".day_element")[j].style.background=undertask.color;
								now_day.children(".day_element")[j].setAttribute("data-id",undertask._id);
								now_day.children(".day_element")[j].style.borderColor="transparent";
								j++;
							}
						}
					}		
				}
		},550)			
	}


	
	

    
	function createDeleteTaskButton(){
		$("body").on("click",".close_cross",function(e){
		var id = this.getAttribute("data-id");
			deleteTask(id);
		})
	}
    getCategory();
    getTask();
	isExistCategory();


});
