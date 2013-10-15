(function($){
		$.fn.slideBar = function(options){
			var init = $.extend({
				// btnID: "sliderControl", //������ť
				// rangeID: "sliderControl", //������ť
				startVal: 0,			//��ʼֵ
				maxVal: 100,            //���ֵ
				minVal: 0,				//��Сֵ
				stepVal: 1,				//����ֵ
				range: "",				//ѡ��ķ�Χ min,max,""
				animate: false,			//����Ч��
				direction: true,		//�Ƿ�ˮƽ����
				mode: "outside",		//outside,inside
				tip: "",

				onStartFun: null,		//�ƶ���ʼʱִ�к���
				onEndFun: null,			//�ƶ�����ʱִ�к���
				onMoveFun: null,		//�ƶ�ʱִ�к���
				onSlideFun: null		//ʱִ�к���
			}, options);
			// for (i in options) this.options[i] = options[i];
			var btn = $(this).find("a"),
			shade, tip, offSeat = 0,
			that = this,
			offset = init.direction ? this.offset().left : this.offset().top,	//��ǰ�ӿڵ����ƫ��
			size = init.direction ? this.width() : this.height(),				//bar�Ŀ�ߣ��ƶ���Χ��
			btnWidth = init.direction ? btn.width() : btn.height(),				//btn�Ŀ��
			size = init.mode == "outside" ? size : size - btnWidth,
			part = size / ( init.maxVal - init.minVal ),						//ÿ��ֵ
			htmlVal = init.startVal;

			if(init.range != "") shade = $(that).find(" > div").eq(0);
			// if(init.tip != "") tip = $(that).find("a div").eq(0);

			var methods = {
				setSlide: function(){

				},
				getPercent: function( val ){ 
					var percent = Math.round(( val - init.minVal ) * (100 / (init.maxVal - init.minVal )));
					return percent;
				},
				setAlignValue: function( val ){
					if(val >= init.maxVal){
						return init.maxVal;
					}
					if(val <= init.minVal){
						return init.minVal;
					}
					var isMove = (val - init.startVal - init.stepVal) % init.stepVal;
					if(isMove != 0) 
						val = val - isMove;
					return val;
				},
				setStartVal: function( val ){
					if( init.onMoveFun ) 
						init.onMoveFun( val );

					var partVal = val - init.minVal,
					start = partVal * part,
					percent = methods.getPercent(val);
					htmlVal = partVal;
						// console.log( start + "???" + partVal);

					if(init.direction){
						btn.stop(1,1)[init.animate ? "animate" : "css"]( {left : start } , init.nimate );
						// if(init.tip != "") tip.stop(1,1)[init.animate ? "animate" : "css"]( {left : start} , init.nimate );
						if(init.range == "min")
							shade.stop(1,1)[init.animate ? "animate" : "css"]({width: percent +"%"} , { queue: false, duration: init.animate });
						if(init.range == "max")
							shade.stop(1,1)[init.animate ? "animate" : "css"]({width: 100 - percent +"%"} , { queue: false, duration: init.animate });
					}else{
						btn.stop(1,1)[init.animate ? "animate" : "css"]( {bottom : start } , init.nimate );
						// if(init.tip != ""){
						// 	console.log(11);
						// 	tip.stop(1,1)[init.animate ? "animate" : "css"]( {bottom : start} , init.nimate );
						// }
						if(init.range == "min")
							shade.stop(1,1)[init.animate ? "animate" : "css"]({height: percent +"%"} , { queue: false, duration: init.animate });
						if(init.range == "max")
							shade.stop(1,1)[init.animate ? "animate" : "css"]({height: 100 - percent +"%"} , { queue: false, duration: init.animate });
					}

					if( init.onSlideFun )
						init.onSlideFun( val );
				},
				_mousedown: function(e){
					e.preventDefault();

					if(init.onStartFun) 
						init.onStartFun(tip);
					
					methods._mouseMove(e);

					$(document).bind("mousemove",methods._mouseMove);
					$(document).bind("mouseup",methods._mouseUp);
					return false;
				},
				_mouseMove: function(e){
					e.preventDefault();
					var xy, position, partVal, values;
					
					if(init.direction){ 
						xy = e.pageX;
						position = xy - offset; 
					}else{
						xy = e.pageY;
						position = size - (xy - offset) + offSeat;
					}
					console.log(position+"----"+offSeat);

					btn.focus();
					values = Math.round( position / part );
					partVal = methods.setAlignValue( values + init.minVal );
					methods.setStartVal( partVal );

					return false;
				},
				_mouseUp: function(e){
					if(init.onEndFun) init.onEndFun(tip);
					$(document).unbind("mousemove",methods._mouseMove);
					$(document).unbind("mouseup",methods._mouseUp);
					return false;
				},
				_keyDown: function(e){
					switch ( e.keyCode ) {
						case 35: 	//end
							e.preventDefault();
							var partVal = methods.setAlignValue(init.maxVal);
							methods.setStartVal(partVal);
							break;
						case 36: 	//home
							e.preventDefault();
							var partVal = methods.setAlignValue(init.minVal);
							methods.setStartVal(partVal);
							break;
						case 37: 	//��
						case 40: 	//��
							e.preventDefault();
							var partVal = methods.setAlignValue(htmlVal - init.stepVal);
							methods.setStartVal(partVal);
							break;
						case 39: 	//��
						case 38: 	//��
							e.preventDefault();
							var partVal = methods.setAlignValue(htmlVal + init.stepVal);
							methods.setStartVal(partVal);
							break;
					}
				}
			};
			methods.setStartVal(init.startVal);
			$(this).bind("mousedown", function(e){
				// if( init.mode == "inside" ){
				// 	size = size + btnWidth/2;
				// }
				methods._mousedown(e);
			});
			$(this).bind("keydown", methods._keyDown);
			btn.bind("mousedown",function(e){
				console.log(init.mode);
				if( init.mode == "inside" ){
					var offset = e.offsetY;
					offSeat = offset;
				}
				methods._mousedown(e);
			});
			return this;
			// return method.call(this);
		}
	})(jQuery);
	var sb1 = $("#sildebar").slideBar({ //���sb
		startVal: 15,			//��ʼֵ
		maxVal: 50,             //���ֵ
		minVal: 0,				//��Сֵ
		stepVal: 5,				//����ֵ
		range: "min",				//ѡ��ķ�Χ min,max,""
		animate: true,			//����Ч��
		direction: true,			//�Ƿ�ˮƽ����

		onMoveFun: function(val){
			if(val == this.maxVal) console.log("���ֵŶ��");
			if(val == this.minVal) console.log("��СֵŶ��");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
			$("#id_test").html(val + "--" + percent +"%");
		}
	});
	var sb2 = $("#slidebar2").slideBar({ //���sb
		startVal: 3,			//��ʼֵ
		maxVal: 15,             //���ֵ
		minVal: 3,				//��Сֵ
		stepVal: 1,				//����ֵ
		range: "max",				//ѡ��ķ�Χ min,max,""
		// animate: true,			//����Ч��
		direction: true,			//�Ƿ�ˮƽ����
		mode: "inside",

		onMoveFun: function(val){
			if(val == this.maxVal) console.log("���ֵŶ��");
			if(val == this.minVal) console.log("��СֵŶ��");
		},
		onSlideFun: function(val){
			var percent = Math.round(( val - this.minVal ) * (100 / (this.maxVal - this.minVal )));
			$("#id_test2").html(val + "--" + percent +"%");
		}
	});
	var sb3 = $("#slidebar3").slideBar({ //���sb
		startVal: 26,			//��ʼֵ
		maxVal: 100,             //���ֵ
		minVal: 0,				//��Сֵ
		stepVal: 1,				//����ֵ
		range: "max",				//ѡ��ķ�Χ min,max,""
		//animate: true,			//����Ч��
		direction: false,			//�Ƿ�ˮƽ����
		tip: "yes",

		onStartFun: function(){
			// $("#slidebar3 .tooltip").fadeIn("fast");
		},
		onEndFun: function(){
			// setTimeout(function(){
			// 	$("#slidebar3 .tooltip").fadeOut("slow");
			// },2000)
		},
		onMoveFun: function(val){
			if(val == this.maxVal) console.log("���ֵŶ��");
			if(val == this.minVal) console.log("��СֵŶ��");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
			// $(".ttContent").html(val + "--" + percent +"%");
			$("#slidebar3 .ttContent").html(percent +"%");
		}
	});
	var sb4 = $("#slidebar4").slideBar({ //���sb
		startVal: 26,			//��ʼֵ
		maxVal: 100,             //���ֵ
		minVal: 0,				//��Сֵ
		stepVal: 1,				//����ֵ
		range: "min",				//ѡ��ķ�Χ min,max,""
		animate: true,			//����Ч��
		direction: false,			//�Ƿ�ˮƽ����
		tip: "yes",

		onStartFun: function(){
			$("#slidebar4 .tooltip").fadeIn("fast");
		},
		onEndFun: function(){
			setTimeout(function(){
				$("#slidebar4 .tooltip").fadeOut("slow");
			},2000)
		},
		onMoveFun: function(val){
			if(val == this.maxVal) console.log("���ֵŶ��");
			if(val == this.minVal) console.log("��СֵŶ��");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
			// $(".ttContent").html(val + "--" + percent +"%");
			$("#slidebar4 .ttContent").html(percent +"%");
		}
	});
	var sb5 = $("#slidebar5").slideBar({ //���sb
		startVal: 0,			//��ʼֵ
		maxVal: 100,             //���ֵ
		minVal: 0,				//��Сֵ
		stepVal: 1,				//����ֵ
		range: "min",				//ѡ��ķ�Χ min,max,""
		// animate: true,			//����Ч��
		direction: false,			//�Ƿ�ˮƽ����
		tip: "yes",
		mode: "inside",

		onStartFun: function(){
			// $("#slidebar4 .tooltip").fadeIn("fast");
		},
		onEndFun: function(){
			// setTimeout(function(){
			// 	$("#slidebar4 .tooltip").fadeOut("slow");
			// },2000)
		},
		onMoveFun: function(val){
			var percent = Math.round(( val - this.minVal ) * (100 / (this.maxVal - this.minVal )));
			var seat = $("#scroll-content").height()-$("#slidebar4").height()-2,
			hval = (100 - val) * (seat / this.maxVal);
			$("#scroll-content").css("top",-hval);
			// console.log()
			if(val == this.maxVal) console.log("���ֵŶ��");
			if(val == this.minVal) console.log("��СֵŶ��");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
		}
	});