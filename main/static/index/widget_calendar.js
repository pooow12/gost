var $calendarTable = $('#calendar');
var $calendarFixedTop = $('.calendar-fixed-top');
var $calendarScrollableTop = $('.calendar-scrollable-top');
var $calendarScrollableBottom = $('.calendar-scrollable-bottom');
var $calendarScrollableTopContent = $('.calendar-scrollable-top-content');
var calendarFixedTopHeight = getCalendarFixedTopDefaultHeight($calendarFixedTop);

$calendarScrollableTop.scroll(function() {
	$calendarScrollableBottom.scrollLeft($calendarScrollableTop.scrollLeft());
});
$calendarScrollableBottom.scroll(function() {
	$calendarScrollableTop.scrollLeft($calendarScrollableBottom.scrollLeft());
});

var reset = function() {
	if (!calendarFixedTopHeight) {
		return;
	}
	$calendarScrollableTopContent.width($calendarTable.width());
	//var hasScrollbar = $calendarScrollableBottom.outerHeight() - $calendarScrollableBottom[0].clientHeight >= getScrollBarWidth();
	//$calendarFixedTop.height(calendarFixedTopHeight + (hasScrollbar ? getScrollBarWidth() : 0));
};

$(window).on('resize', reset);
reset();

var calendarFixedTopDefaultHeight = null;
var scrollBarWidth = null;

function getCalendarFixedTopDefaultHeight($calendarFixedTop) {
	if (!$calendarFixedTop.length)
		return;
	if (!calendarFixedTopDefaultHeight) {
		var height = parseInt(getComputedStyle($calendarFixedTop[0]).height, 10);
		if (isNaN(height)) {
			return null;
		}
		calendarFixedTopDefaultHeight = height;
	}
	return calendarFixedTopDefaultHeight;
}

function getScrollBarWidth () {
	if (!scrollBarWidth) {
		var $outer = $('<div></div>').css({
			visibility: 'hidden',
			width: 100,
			overflow: 'scroll'
		}).appendTo(document.body);
		var widthWithScroll = $('<div></div>').css({
			width: '100%'
		}).appendTo($outer).outerWidth();
		$outer.remove();
		if (widthWithScroll === 0) {
			return null;
		}
		scrollBarWidth = 100 - widthWithScroll;
	}
	return scrollBarWidth;
}

var date_start, date_end, select = false, startTime, endTime;
var cell = [], last_cell = [];
if (only_view) {
	;
} else if (oneday) {
	$(document).
	delegate('#calendar td.freeday', 'mousedown', function() {
		
		if (oneday_multi){		
			if (!select){
				select_start(this);
			} 
			
			if (!select_calc(this)){
				return false;
			}
			select_end(this);
			
		} else {
			select_start(this);
			if (!select)
				return false;
		
			date_start = $('#calendar tbody tr:eq('+cell[1]+') td:eq('+cell[0]+')');
			var day_info1 = date_start.data('id').match(/r(\d+)d(\d+)(b(\d+))?/);
			var date1 = new Date((parseInt(day_info1[2]))*1000+(3600000*utoffset));
			var date2 = new Date(date1);
			date2.setDate(date2.getDate() + 1);
			getPrice(day_info1, date1, date2, date_start);
		}
	});
} else {
	$(document).
	delegate('#calendar td.freeday, #calendar td.start_booking', 'mousedown', function() {
		if ('ontouchstart' in window)
			return false;
		if (last_cell[0] == cell[0]){
			if (!select) {
				select_start(this);
			} else {
				$('#calendar td').removeClass('selected');
				cell = last_cell = [];
				select = false;
				$('.close-booking-form').trigger('click');
			}
		}
		return false;
	}).
	delegate('#calendar td.freeday', 'touchstart, touchmove', function() {
		startTime = new Date().getTime();
	}).
	delegate('#calendar td.freeday, #calendar td.start_booking, #calendar td.end_booking', 'touchend', function() {
		endTime = new Date().getTime();
		if((endTime-startTime)/100 < 4)
			return false;
		if (select){
			if (cell[1] != $(this).parent().index())
				return false;
			if ($(this).index() >= cell[0])
				for(var i=cell[0]; i<=$(this).index(); i++){
					if ($('td:eq('+i+')', $(this).parent()).hasClass('booking') && !$(this).hasClass('start_booking'))
					return false;
				}
			else
				for(var i=cell[0]; i>=$(this).index(); i--){
					if ($('td:eq('+i+')', $(this).parent()).hasClass('booking') && !$('td:eq('+cell[0]+')', $(this).parent()).hasClass('start_booking'))
						return false;
				}

			$(this).addClass('selected');
			last_cell = getXY(this);
			select_end(this);
		} else {
			select_start(this);
		}
	})
	.delegate('#calendar td.freeday, #calendar td.start_booking', 'mouseover', function(){
		if ('ontouchstart' in window)
			return true;
		else
			select_calc(this);
	})
	.on('mouseup', function() {
		if ('ontouchstart' in window)
			return false;
		
		if (last_cell[0] != cell[0]){
			if (!select)
				return false;
			select_end(this);
		}
		
	});
}
function select_start(el){
	if ($(el).hasClass('selected')) {
		$('#calendar td.freeday, #calendar td.start_booking').removeClass('selected');
		if ($('#new-booking').is(":visible"))
			$('.close-booking-form').trigger('click');
	} else {
		select = true;
		cell = last_cell = getXY(el);
		
		$('#calendar td.freeday, #calendar td.start_booking').removeClass('selected');
		$(el).addClass('selected');
		
		date_start = $('#calendar tbody tr:eq('+cell[1]+') td:eq('+cell[0]+')');
		var day_info1 = date_start.data('id').match(/r(\d+)d(\d+)(b(\d+))?/);
		var date1 = new Date((parseInt(day_info1[2]))*1000+(3600000*utoffset));
		getPrice(day_info1, date1, false, date_start);
	}
}

function select_calc(el) {
  if (!select || cell[1] != $(el).parent().index())
		return false;
		
	if ($(el).index() > last_cell[0]+1 || $(el).index() < last_cell[0]-1)
		return false;
	
	xy = getXY(el);
	if ((!$('#calendar tbody tr:eq('+cell[1]+') td:eq('+cell[0]+')').hasClass('end_booking') && $(el).hasClass('end_booking') && xy[0] > cell[0]) || (!$('#calendar tbody tr:eq('+cell[1]+') td:eq('+cell[0]+')').hasClass('start_booking') && $(el).hasClass('start_booking') && xy[0] < cell[0]))
		return false;

	if ($(el).index() >= cell[0] && $(el).index() < last_cell[0] && last_cell[0] > cell[0])
		$('td:gt('+$(el).index()+')', $(el).parent()).removeClass('selected');

	if($(el).index() <= cell[0] && $(el).index() > last_cell[0] && last_cell[0] < cell[0])
		$('td:lt('+$(el).index()+')', $(el).parent()).removeClass('selected');

	if (!cell.equal(xy)) {
		if ($(el).hasClass('selected') && !($(el).index() >= cell[0] && $(el).index() <= last_cell[0]) && !($(el).index() <= cell[0] && $(el).index() >= last_cell[0]))
			$(el).removeClass('selected');
		else
			$(el).addClass('selected');
	}

	last_cell = xy;
	return true;
}

function select_end(el){
	if(!oneday_multi)
		select = false;

	if (last_cell[0] == cell[0] && !oneday_multi){
		return false;
	} else if (last_cell[0] > cell[0]) {
		date_start = $('#calendar tbody tr:eq('+cell[1]+') td:eq('+cell[0]+')');
		date_end = $('#calendar tbody tr:eq('+last_cell[1]+') td:eq('+last_cell[0]+')');
	} else {
		date_start = $('#calendar tbody tr:eq('+last_cell[1]+') td:eq('+last_cell[0]+')');
		date_end = $('#calendar tbody tr:eq('+cell[1]+') td:eq('+cell[0]+')');
	} 
	var day_info1 = date_start.data('id').match(/r(\d+)d(\d+)(b(\d+))?/);
	var day_info2 = date_end.data('id').match(/r(\d+)d(\d+)(b(\d+))?/);
	
	var date1 = new Date((parseInt(day_info1[2]))*1000+(3600000*utoffset));
	var date2 = new Date((parseInt(day_info2[2]))*1000+(3600000*utoffset));
	date2.setDate(date2.getDate());
	
	if (oneday_multi)
		date2.setDate(date2.getDate() + 1);
	
	getPrice(day_info1, date1, date2, date_end);
}

function getPrice(day_info, date1, date2, date_end) {
	var $booking_form = $('#new-booking'), $date_in = $('.datein', $booking_form), $date_out = $('.dateout', $booking_form), $price = $('.booking-form-price .price', $booking_form), $fordays = $('.booking-form-price .fordays', $booking_form);
	$date_in.empty();
	$date_out.empty();
	$price.empty();
	$fordays.empty();
	$('input[name='+(booking_mode == 3 && !room_mode ? 'cat_id' : 'room_id')+']', $booking_form).val(day_info[1]);
	$('input[name=date_in]', $booking_form).val(date1.format("d-m-Y"));
	$date_in.text(date1.format("d.m.Y"));
	if (date2 !== false){
		$('input[name=date_out]', $booking_form).val(date2.format("d-m-Y"));
		$('input[type=submit]', $booking_form).removeClass('hidden');
		diff = Math.round(Math.abs((date1.getTime() - date2.getTime())/(24*60*60*1000)));
		if (!oneday || (oneday && oneday_multi && diff > 1)){
			$('.oneday', $booking_form).removeClass('hidden');
			$date_out.text(date2.format("d.m.Y"));
		} else {
			$('.oneday', $booking_form).addClass('hidden');
		}
		var left_pos = date_end.offset().left+date_end.width()-$booking_form.outerWidth()-$('.widget-wrapper').offset().left;
		var top_pos = date_end.offset().top + date_end.outerHeight() -2;
		$booking_form.css({left:(left_pos < 0 ? 0 : left_pos), top:top_pos}).show();
		var $loading = $('<div class="loading2"></div>');
		$loading.appendTo($('.booking-form-price', $booking_form));
		$.post('/widget/get_stay_price', $('#new-booking form').serialize(),
			function(data) {
				$loading.remove();
				if (data.error){
					$fordays.html(data.error);
				} else {
					$price.html(data.price);
					if (!oneday)
						$fordays.html(data.fordays);
				}
			}, 'json'
		);
	} else {
		$('.oneday, input[type=submit]', $booking_form).addClass('hidden');
		var left_pos = date_end.offset().left+date_end.width()-$booking_form.outerWidth();
		var top_pos = date_end.offset().top + date_end.outerHeight()-2;
		$booking_form.css({left:(left_pos < 0 ? 0 : left_pos), top:top_pos}).show();
		$fordays.html('выберите дату выезда');
	}
}

$('.freeday, .booking', '#calendar td').on("selectstart", function () {
	return false; // prevent text selection in IE
});

$('.close-booking-form').on('click', function(){
	$('#calendar td').removeClass('selected');
	cell = last_cell = [];
	select = false;
	$('#new-booking').hide();
});
$.datepicker.setDefaults($.datepicker.regional[locale]);
$.datepicker.setDefaults({
	showOtherMonths: true,
	selectOtherMonths: true,
	changeMonth: true,
	changeYear: true,
	dateFormat: "dd-mm-yy",
	hideIfNoPrevNext: true
});
$(".date").datepicker({
	showButtonPanel: true,
	minDate: "0"
}).mask("99-99-9999", {placeholder: "__-__-____", autoclear: true});

if (atonce){
	$('.date').datepicker("option", "onSelect", function(date, input){
		$(".date-form form").submit();
	});
}

$("#new-booking form").submit(function(){
	var date_from = $('#new-booking input[name=date_in]'),
		date_to = $('#new-booking input[name=date_out]'),
		expr = /^[0-3][0-9]-(0|1)[0-9]-(19|20)[0-9]{2}$/;
	if(date_from.val() != "" && !date_from.val().match(expr)){
		date_from.focus();
		alert("Неверный формат даты");
		return false;
	} else if (date_to.val() != "" && !date_to.val().match(expr)){
		date_to.focus();
		alert("Неверный формат даты");
		return false;
	} else if (parseDate(date_from.val()) >= parseDate(date_to.val())){
		date_to.focus();
		alert("Дата выезда должна быть позже даты заезда");
		return false;
	}
});

$('.request-form form').submit(function(){
	if ($('.opd').length){
		$('.request-form .error').remove();
		if (!$('.opd i').is('.checked')) {
			$('<div class="error">Мы не сможем обработать вашу заявку без согласия на обработку персональных данных.</div>').insertAfter('.request-form .title');
			return false;
		}
	}

	$('.request-form .form-row').hide();
	var $loading = $('<div class="loading"></div>');
	$loading.appendTo($('.request-form'));
	$.post('/widget/request', 
		{id: user_id, name: $('.request-form input[name=name]').val(), phone: $('.request-form input[name=phone]').val(), comment: $('.request-form input[name=comment]').val()},
		function(data) {
			$loading.remove();
			if (data.error){
				alert(data.error);
				$('.request-form .form-row').show();
			} else {
				$('.request-form').append('<div class="result">'+data.status+'</div>');
				if (ymcounter) { yaCounter = eval('yaCounter'+ymcounter); yaCounter.reachGoal('PRE_ORDER'); }
				if (fbcounter) { fbq('track', 'Lead'); }
			}
		}, 'json'
	);
	return false;
});
$.fn.roomBookingDatePicker = function() {
  return $(this).each(function() {
    var $monthTables = $(this).find('.month-table');
    var freeItems = initializeFreeDates($monthTables);
    var selectedItems = [];
    var startItem = null;
    var endItem = null;
	
    $monthTables.click(function(event) {
      var $target = $(event.target);
      var $day = $target.closest('.calendar-day');
      if ($day.length !== 1) {
		return;
      }

      var id = $day.data('id');
      var selectionMode = getSelectionMode(startItem, endItem);
      var item = findDateById(freeItems, id);
	  if (!item) {
		return;
      }
	  
	  if (oneday){
			selectedItems = [item];
			highlightSelectedDates($monthTables, getSelectedIds(selectedItems));
			var day_info1 = item.id.match(roomIdRegExp);
			var date2 = new Date(item.date);
			date2.setDate(date2.getDate() + 1);
			getPrice(item.id.match(roomIdRegExp), item.date, date2, item.object);			
	  }	else {
			if (selectionMode === 'start') {
				if (item.start) {
					if (startItem) {
						endItem = null;
					}
					startItem = item;
				}
				else {
					selectionMode = 'end';
					endItem = item;
					startItem = null;
				}
			}
			else {
				if (item.end) {
					endItem = item;
				}
				else {
					selectionMode = 'start';
					endItem = startItem;
					startItem = item;
				}
			}
			if ((selectionMode === 'start' && !endItem) || (selectionMode === 'end' && !startItem)) {
				selectedItems = [item];
			}
			else if (startItem && endItem) {
				if (endItem.timestamp < startItem.timestamp) {
					var swapItem = startItem;
					startItem = endItem;
					endItem = swapItem;
				}
				var possibleSelectedItems = getFreeDateRange(freeItems, startItem, endItem);
				if (possibleSelectedItems && startItem.start && endItem.end) {
					selectedItems = possibleSelectedItems;
				}
				else {
					if (item.start) {
						startItem = item;
						endItem = null;
					}
					else {
						startItem = null;
						endItem = item;
					}
					selectedItems = [item];
				}
			}
			else {
				selectedItems = [];
			}

			highlightSelectedDates($monthTables, getSelectedIds(selectedItems));

			if (startItem && endItem) {
				getPrice(item.id.match(roomIdRegExp), startItem.date, endItem.date, item.object);
			}
			else {
				hideSubmitPopup($monthTables);
			}
		}
		$('.close-booking-form').on('click', function(){
			selectedItems = [];
			highlightSelectedDates($monthTables, getSelectedIds(selectedItems));
			$('#new-booking').hide();
		});
    });

    return this;
  });
}

function initializeFreeDates($monthTables) {
  var isTodayPassed = false;
  var freeItems = [];
  $monthTables.find('.calendar-day').each(function() {
    var $day = $(this);
    if (!isTodayPassed && $day.hasClass('today')) {
      isTodayPassed = true;
    }
    if (($day.hasClass('freeday') || $day.hasClass('start_booking') || $day.hasClass('end_booking')) && !$day.hasClass('lastday')) {
      var start = $day.hasClass('freeday') || $day.hasClass('end_booking');
      var end = ($day.hasClass('freeday') || $day.hasClass('start_booking')) && !$day.hasClass('end_booking');
      freeItems.push(Object.assign({ start: start, end: end }, parseRoomData($day)));
    }
  });
  return freeItems;
}

var roomIdRegExp = /^r(\d+)d(\d+)(b(\d+))?$/;

function parseRoomData($day) {
  var id = $day.data('id');
  var roomIdMatch = id.match(roomIdRegExp);
  var roomId = Number(roomIdMatch[1]);
  var timestamp = Number(roomIdMatch[2]);
  var date = new Date(timestamp*1000+(3600000*utoffset)); //new Date((timestamp + utoffset * 3600) * 1000);
  
  return {
    id: id,
    roomId: roomId,
    date: date,
	timestamp: timestamp,
	object: $day
  };
}

function findDateById(items, id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return items[i];
    }
  }
  return null;
}

function getSelectionMode(startTimestamp, endTimestamp) {
  return startTimestamp && !endTimestamp ? 'end' : 'start';
}

function getSelectedIds(selectedItems) {
  var ids = [];
  for (var i = 0; i < selectedItems.length; i++) {
    ids.push(selectedItems[i].id);
  }
  return ids;
}

function getFreeDateRange(freeItems, startItem, endItem) {
  var isStarted = false;
  var items = [];
  for (var i = 0; i < freeItems.length; i++) {
    var item = freeItems[i];
    if (!isStarted) {
      if (item.id === startItem.id) {
        items.push(item);
        isStarted = true;
      }
      continue;
    }
    if (item.timestamp - items[items.length - 1].timestamp > 24 * 60 * 60) {
      return null;
    }
    items.push(item);
    if (item.id === endItem.id) {
      return items;
    }
  }
  return null;
}

function highlightSelectedDates($monthTables, selectedIds) {
  $('.calendar-day').removeClass('selected');
  $monthTables.find('.calendar-day').each(function() {
    var $day = $(this);
    var id = $day.data('id');
	if (selectedIds.includes(id)) {
		$day.addClass('selected');
    }
  });
}

function hideSubmitPopup($monthTables) {
  $monthTables.find('.day-selection-popup').remove();
}
var $widgetListRoom = $('.widget-list-room');
if (!only_view)
	$widgetListRoom.find('.room-item').roomBookingDatePicker();