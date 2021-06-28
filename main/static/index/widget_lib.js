$(function() {
	$(window).scroll(function(){
		if ($(this).scrollTop() > 800) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	$('.scrollToTop').on('click', function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
	$('.gotorequest').on('click', function(){
		$('html, body').animate({scrollTop : $('#request-form').offset().top },800);
		return false;
	});
	$('.country-button').on('click', function(){
		$('.country-list').toggleClass('hidden');
	});
	$(document).on('click', function(e){
		if(!$('.country').is(e.target) && $('.country').has(e.target).length === 0){
			$('.country-list').addClass('hidden');
		}
	});
	$('.input_switch_button').each(function(){
		var $parent = $(this),
			$input = $('input', this),
			$enable = $('.input_switch_enable', this),
			$disable = $('.input_switch_disable', this);
		$input.on('change', function(){
			if ($(this).val() == 1){
				$enable.addClass('selected');
				$disable.removeClass('selected');
			} else {
				$disable.addClass('selected');
				$enable.removeClass('selected');
			}
			$(this).parent().toggleClass('disabled', $(this).is(':disabled'));
		}).change();
		$enable.on('click', function() {
			if ($parent.hasClass('necessarily')){
				alert('обязательная услуга');
				return false;
			}
			if (!$input.is(':disabled'))
				$input.val(1).change();
		});
		$disable.on('click', function() {
			if ($parent.hasClass('necessarily')){
				alert('обязательная услуга');
				return false;
			} if (!$input.is(':disabled'))
				$input.val(0).change();
		});
	});
	$('.input_number_up').on('mousedown', function(){
		var input = $(this).siblings('input.input_number');
		if (input.is(':disabled'))
			return;
		var min = input.attr('data-min') != '' ? parseInt(input.data('min')) : null;
		var max = input.attr('data-max') != '' ? parseInt(input.data('max')) : null;
		value = (input.val().match(/^[\-0-9]+$/) ? parseInt(input.val()) : 0)+1;
		if (min != null && value < min) value = min;
		if (max != null && value > max) value = max;
		input.val(value).change();
	});
	$('.input_number_down').on('mousedown', function(){
		var input = $(this).siblings('input.input_number');
		if (input.is(':disabled'))
			return;
		var min = input.attr('data-min') != '' ? parseInt(input.data('min')) : null;
		var max = input.attr('data-max') != '' ? parseInt(input.data('max')) : null;
		value = (input.val().match(/^[\-0-9]+$/) ? parseInt(input.val()) : 0)-1;
		if (min != null && value < min) value = min;
		if (max != null && value > max) value = max;
		input.val(value).change();
	});
	$('.input_number').on('input keydown keyup mousedown mouseup select contextmenu drop', function(e){
		var min = $(this).attr('data-min') != '' ? parseInt($(this).data('min')) : null;
		var max = $(this).attr('data-max') != '' ? parseInt($(this).data('max')) : null;
		value = parseInt($(this).val());
		if (min != null && value < min) value = min;
		if (max != null && value > max) value = max;
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			value == '' ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			 // Allow: Ctrl+C
			(e.keyCode == 67 && e.ctrlKey === true) ||
			 // Allow: Ctrl+X
			(e.keyCode == 88 && e.ctrlKey === true) ||
			 // Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
				 // let it happen, don't do anything
				 return;
			} else
				$(this).val(value || '');
	});
});
function parentMessage(post_arr) {
	var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
    if(typeof target != "undefined"){
		target.postMessage($.toJSON(post_arr), "*");
	}
}
function parseDate(str) {
    var mdy = str.split('-')
    return new Date(mdy[2], mdy[1]-1, mdy[0]);
}
function parseDate(str) {
    var mdy = str.split('-')
    return new Date(mdy[2], mdy[1]-1, mdy[0]);
}

function getXY(cell) {
  var x = $(cell).index();
  var y = $(cell).parent().index();
  return [x, y];
}

function UpdateQueryString(key, value, url) {
	if (!url) url = window.location.href;
	var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
		hash;

	if (re.test(url)) {
		if (typeof value !== 'undefined' && value !== null)
			return url.replace(re, '$1' + key + "=" + value + '$2$3');
		else {
			hash = url.split('#');
			url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
			if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
				url += '#' + hash[1];
			return url;
		}
	}
	else {
		if (typeof value !== 'undefined' && value !== null) {
			var separator = url.indexOf('?') !== -1 ? '&' : '?';
			hash = url.split('#');
			url = hash[0] + separator + key + '=' + value;
			if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
				url += '#' + hash[1];
			return url;
		}
		else
			return url;
	}
}

function number_format(number, decimals, decPoint, thousandsSep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number;
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  var sep = (typeof thousandsSep === 'undefined') ? '' : thousandsSep;
  var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
  var s = '';

  var toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec);
    return '' + (Math.round(n * k) / k)
      .toFixed(prec);
  }

  // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  return s[1] != '00' ? s.join(dec) : s[0];
}

Array.prototype.equal=function(r){if(this.length!=r.length)return!1;for(var t=0;t<r.length;t++){if(this[t].compare&&!this[t].compare(r[t]))return!1;if(this[t]!==r[t])return!1}return!0};
Date.prototype.format=function(e){var t="";var n=Date.replaceChars;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(r-1>=0&&e.charAt(r-1)=="\\"){t+=i}else if(n[i]){t+=n[i].call(this)}else if(i!="\\"){t+=i}}return t};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return this.getDate()%10==1&&this.getDate()!=11?"st":this.getDate()%10==2&&this.getDate()!=12?"nd":this.getDate()%10==3&&this.getDate()!=13?"rd":"th"},w:function(){return this.getDay()},z:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)},W:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var e=new Date;return(new Date(e.getFullYear(),e.getMonth(),0)).getDate()},L:function(){var e=this.getFullYear();return e%400==0||e%100!=0&&e%4==0},o:function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-(this.getDay()+6)%7+3);return e.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1e3/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var e=this.getMilliseconds();return(e<10?"00":e<100?"0":"")+e},e:function(){return"Not Yet Supported"},I:function(){var e=null;for(var t=0;t<12;++t){var n=new Date(this.getFullYear(),t,1);var r=n.getTimezoneOffset();if(e===null)e=r;else if(r<e){e=r;break}else if(r>e)break}return this.getTimezoneOffset()==e|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+":00"},T:function(){var e=this.getMonth();this.setMonth(0);var t=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(e);return t},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}};