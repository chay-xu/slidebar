(function($){
		$.fn.slideBar = function(options){
			var init = $.extend({
				// btnID: "sliderControl", //滑动按钮
				// rangeID: "sliderControl", //滑动按钮
				startVal: 0,			//初始值
				maxVal: 100,            //最大值
				minVal: 0,				//最小值
				stepVal: 1,				//步长值
				range: "",				//选择的范围 min,max,""
				animate: false,			//动画效果
				direction: true,		//是否水平方向
				mode: "outside",		//outside,inside
				tip: "",

				onStartFun: null,		//移动开始时执行函数
				onEndFun: null,			//移动结束时执行函数
				onMoveFun: null,		//移动时执行函数
				onSlideFun: null		//时执行函数
			}, options);
			// for (i in options) this.options[i] = options[i];
			var btn = $(this).find("a"),
			shade, tip, offSeat = 0,
			that = this,
			offset = init.direction ? this.offset().left : this.offset().top,	//当前视口的相对偏移
			size = init.direction ? this.width() : this.height(),				//bar的宽高（移动范围）
			btnWidth = init.direction ? btn.width() : btn.height(),				//btn的宽高
			size = init.mode == "outside" ? size : size - btnWidth,
			part = size / ( init.maxVal - init.minVal ),						//每份值
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
						case 37: 	//左
						case 40: 	//下
							e.preventDefault();
							var partVal = methods.setAlignValue(htmlVal - init.stepVal);
							methods.setStartVal(partVal);
							break;
						case 39: 	//右
						case 38: 	//上
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
	var sb1 = $("#sildebar").slideBar({ //你的sb
		startVal: 15,			//初始值
		maxVal: 50,             //最大值
		minVal: 0,				//最小值
		stepVal: 5,				//步长值
		range: "min",				//选择的范围 min,max,""
		animate: true,			//动画效果
		direction: true,			//是否水平方向

		onMoveFun: function(val){
			if(val == this.maxVal) console.log("最大值哦！");
			if(val == this.minVal) console.log("最小值哦！");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
			$("#id_test").html(val + "--" + percent +"%");
		}
	});
	var sb2 = $("#slidebar2").slideBar({ //你的sb
		startVal: 3,			//初始值
		maxVal: 15,             //最大值
		minVal: 3,				//最小值
		stepVal: 1,				//步长值
		range: "max",				//选择的范围 min,max,""
		// animate: true,			//动画效果
		direction: true,			//是否水平方向
		mode: "inside",

		onMoveFun: function(val){
			if(val == this.maxVal) console.log("最大值哦！");
			if(val == this.minVal) console.log("最小值哦！");
		},
		onSlideFun: function(val){
			var percent = Math.round(( val - this.minVal ) * (100 / (this.maxVal - this.minVal )));
			$("#id_test2").html(val + "--" + percent +"%");
		}
	});
	var sb3 = $("#slidebar3").slideBar({ //你的sb
		startVal: 26,			//初始值
		maxVal: 100,             //最大值
		minVal: 0,				//最小值
		stepVal: 1,				//步长值
		range: "max",				//选择的范围 min,max,""
		//animate: true,			//动画效果
		direction: false,			//是否水平方向
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
			if(val == this.maxVal) console.log("最大值哦！");
			if(val == this.minVal) console.log("最小值哦！");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
			// $(".ttContent").html(val + "--" + percent +"%");
			$("#slidebar3 .ttContent").html(percent +"%");
		}
	});
	var sb4 = $("#slidebar4").slideBar({ //你的sb
		startVal: 26,			//初始值
		maxVal: 100,             //最大值
		minVal: 0,				//最小值
		stepVal: 1,				//步长值
		range: "min",				//选择的范围 min,max,""
		animate: true,			//动画效果
		direction: false,			//是否水平方向
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
			if(val == this.maxVal) console.log("最大值哦！");
			if(val == this.minVal) console.log("最小值哦！");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
			// $(".ttContent").html(val + "--" + percent +"%");
			$("#slidebar4 .ttContent").html(percent +"%");
		}
	});
	var sb5 = $("#slidebar5").slideBar({ //你的sb
		startVal: 0,			//初始值
		maxVal: 100,             //最大值
		minVal: 0,				//最小值
		stepVal: 1,				//步长值
		range: "min",				//选择的范围 min,max,""
		// animate: true,			//动画效果
		direction: false,			//是否水平方向
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
			if(val == this.maxVal) console.log("最大值哦！");
			if(val == this.minVal) console.log("最小值哦！");
		},
		onSlideFun: function(val){
			var percent = Math.round(val * (100 / this.maxVal));
		}
	});