"use strict";
$(document).ready(function(){
	(function ($) {
		function addDefaultParams(params){
			var params = $.extend({
				"hasCloseButton": true,
				"hasCloseOverlay": true,
				"prvDft": true,
				"buttons":[{
					text:"some"
				},
				{
					text:"button"
				}
				]


			}, params);
		}
		function deleting(delete_elem) {
			delete_elem.remove();
		}
		function addButtons(params,parent_elem){
			for (var i = 0; i < params.buttons.length; i++){
				var $button = $("<button class='dialogbox-btn'>");
				$button.addClass(params.buttons[i].Class);
				$button.text(params.buttons[i].text);
				$button.attr("type",params.buttons[i].type);
				$button.on("click", params.buttons[i].click);
				$button.on("kyepress", params.buttons[i].keypress);
				params.buttons[i].close;
				if (params.buttons[i].close == true) {
					$button.on("click",function(){
						deleting($(".dialogbox"));
					});
				}
				parent_elem.append($button);
			};
		}

		$.fn.dialogbox = function (params){
			addDefaultParams(params);
			return this.on("click", function (e){
				
				var $dialogbox = $("<div class='dialogbox'>");
				var $dialogboxChild = $("<div class='dialogbox-child'>");
				var $dialogboxHead = $("<div class='dialogbox-Head'>");
				var $dialogboxContent = $("<div class='dialogbox-Content'>");
				var $dialogboxInner = $("<div class='dialogbox-inner'>");
				var $dialogboxElementContent = $("<div class='dialogbox-elementContent'>");
				var $dialogboxButtons = $("<div class='dialogbox-Buttons'>");
				var $spanClose = $("<span class='dialogbox-spanClose'><i class='fa fa-close'></i></span>");
				var $dialogboxForm = $("<form name = 'Form'></form>");
				var $dialogbox_task_input = $("<input class='task_name_input'>");
				var $dialogbox_section_input = $("<input class='section_name_input'>");
				var $tasks = $(".tasks");
				var task = $tasks.find(".name_section");
				
				$dialogboxChild.css("width", params.width);
				$dialogboxChild.css("height", params.height);
				
				$dialogbox.append($dialogboxChild);
				$dialogboxChild.append($dialogboxHead);
				$dialogboxChild.append($dialogboxContent);
				$dialogboxContent.append($dialogboxInner);
				$dialogboxInner.append($dialogboxElementContent);
				$dialogboxChild.append($dialogboxButtons);
				
				
		
				if(e.currentTarget.className == "create_section"){
					var color_picker = $("<input>");
					color_picker.attr("type","color");
					color_picker.addClass("color_picker");
					color_picker.attr("value","#fff156")
					$dialogboxElementContent.append($("<div>Input category</div>"));
					$dialogboxElementContent.append($dialogboxForm);
					$dialogboxForm.append($dialogbox_task_input);
					$dialogboxForm.append(color_picker);
					$dialogbox_task_input.on("keypress",params.keyEvent.keypress);
					this.blur();
				}
				else if(e.currentTarget.className == "create_task"){
					var data_picker = $("<input>");
					data_picker.attr("type","date");
					data_picker.addClass("data_picker");
					data_picker.val(new Date().toISOString().slice(0,10));
					var time_picker = $("<input>");
					time_picker.attr("type","time");
					time_picker.addClass("time_picker");
					time_picker.val("08:00");
					var time_picker2 = $("<input>");
					time_picker2.attr("type","time");
					time_picker2.addClass("time_picker2");
					time_picker2.val("20:00");
					var description = $("<textarea>");
					description.addClass("description_task");
					var select_section = $("<select class='choice_section'></select>");
					$dialogboxElementContent.append($("<div>Input task</div>"));
					$dialogboxElementContent.append($dialogboxForm);
					$dialogboxForm.append("<span> Task name: </span>");
					$dialogboxForm.append($dialogbox_task_input);
					$dialogboxForm.append(select_section);
					$dialogboxForm.append("<br>");
					$dialogboxForm.append("<span> Task description: </span>");
					$dialogboxForm.append(description);
					$dialogboxForm.append("<br>");
					$dialogboxForm.append("<span>Date of task: </span>");
					$dialogboxForm.append(data_picker);
					$dialogboxForm.append("<br>");
					$dialogboxForm.append("<span> Start task:</span>");
					$dialogboxForm.append(time_picker);
					$dialogboxForm.append("<br>");
					$dialogboxForm.append("<span> End task:</span>");
					$dialogboxForm.append(time_picker2);

					for(var i = 0; i < task.length;i++){
						select_section.append("<option>"+task[i].textContent+"</option>");
					}
					$dialogbox_task_input.on("keypress",params.keyEvent.keypress);
					this.blur();	
				}
				else if(e.currentTarget.className == "del_section"){
					$dialogboxElementContent.append("<div data-id='"+this.parentNode.getAttribute('data-id')+"'>"+ "delete section " +this.previousSibling.textContent+" ?</div>");
					$dialogboxElementContent.append($dialogboxForm);
				}
				addButtons(params,$dialogboxForm);
				if (params.hasCloseButton) {
					$dialogboxHead
						.append($spanClose);
				}
				$dialogbox.on("click", function (e) {
					if (params.hasCloseOverlay && e.target.className == "dialogbox") {
						deleting($(".dialogbox"));
					}
					if (e.target.className == "fa fa-close") {
						deleting($(".dialogbox"));
					}
				});
				if(params.prvDft) {
					$(this).on("click", function (e) {
						e.preventDefault();
					});
				}
				$("body").append($dialogbox);
			});
		};
	})(jQuery)
});
