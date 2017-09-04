

function create(ele){
	return document.createElement(ele);
}

function rand(min,max){
	return Math.floor( Math.random()*(max-min+1) + min )
}

function add(score){ //分数显示优化
	if ( score >=10000 ){
		return score;
	}else if (  score <10000 && score >=1000){
		return "0" + score;
	}else if (  score <1000 && score>=100 ){
		return "00"+ score;
	}else if ( score <100  && score >=10 ){
		return "000" + score;
	}else if ( score < 10 ){
		return "0000"+ score;
	}
}



FontBlock.prototype.stydy = function(){
	alert(1)
}
//游戏引擎
function GameEngine(){
	if ( !GameEngine.instance ){
		GameEngine.instance = {
			board : document.getElementById("board"),
			degSum : 0 ,
			box : document.getElementById("iptBox"),
			body : document.getElementById("box"),
			block : new Set(),
			start : function(){
					this.initMenu();
			},
			initMenu : function(){
				var menus = document.getElementById("dialog");
				menus.onclick = function(e){
					var e = e || event;
					var target = e.target || e.srcElement;
					if ( target.nodeName == "LI" ){
						new GameEngine().speed = target.getAttribute("speed");
						new GameEngine().deg = target.getAttribute("deg");
						new GameEngine().hp = target.getAttribute("num");
						new GameEngine().fre = 36*30/(50/new GameEngine().speed);
						this.remove();
						new GameEngine().loading();
					}
				}
			},
			loading : function(){
				this.box.focus();
				this.autoCreateFontBlock();
			},
			autoCreateFontBlock : function(){
				setInterval(function(){
					var fb = new FontBlock()
					fb.init().move().del();
					new GameEngine().block.add(fb);
					// console.log(new GameEngine().block)
				},new GameEngine().fre)
			},
			showDeg : function(){
				this.board.innerHTML = add(this.degSum);
			},
			width : function(){
				return this.body.offsetWidth;
			},
			height : function(){
				return this.body.offsetHeight;
			},
		}
	}
	return GameEngine.instance;
}

function FontBlock(){
	this.speed = 50/new GameEngine().speed;
	this.words = ['function', 'var', 'if', 'else', 'document', 'getElementById', 'return', 'true', 'false', 'getElementsByTagName', 'offsetX', 'offsetY', 'clientX', 'clientY', 'pageX', 'pageY', 'offsetLeft', 'offsetTop', 'clientLeft', 'clientTop', 'offsetWidth', 'offserHeight', 'clientWidth', 'clientHeight', 'scrollLeft', 'scrollTop','children','childNodes','appendChild','removeChild','cloneNode','arguments','getAttribute','setAttribute','setInteval','setTimeout'];
	this.color = ['#9a00fa', '#f7072c', '#f7ad07', '#ee07f7','#040148', '#0cf727'];
	this.init = function(){
		this.body = create("div");
		this.body.className = "active";
		this.body.innerHTML = this.words[rand(0,this.words.length-1)];
		this.body.style.color = this.color[rand(0,this.color.length-1)]
		new GameEngine().body.appendChild(this.body);
		this.top( -this.height() );
		this.left( rand(0,new GameEngine().width() - this.width()) );
		return this;
	}
	this.move = function(){
		var moveTimer = setInterval(function(){
			this.top( this.top() + this.speed)
			if ( this.top() > new GameEngine().height()){
				clearInterval(moveTimer);
				this.destory();
				if ( new GameEngine().hp-- == 0 ){
					var res = confirm( `游戏已经结束!您的总得分为${new GameEngine().degSum},是否继续?`)
					if( res ){
						window.location.reload();
					}else{
						window.close();
					}
				}
				return;
			}
		}.bind(this),30)
		// console.log(new GameEngine().block)
		return this;
	}
	this.top = function( val ){
		if( val || val == 0 ){
			this.body.style.top = val + "px";

		}
		return this.body.offsetTop;
	}
	this.left = function(val){
		if ( val || val == 0 ){
			this.body.style.left = val + "px";
		}
		return this.body.style.offsetLeft;
	}
	this.width = function(){
		return this.body.offsetWidth;
	}
	this.height = function(){
		return this.body.offsetHeight;
	}
	this.destory = function(){
		this.body.remove();
		new GameEngine().block.delete(this);
	}
	this.del = function(){
		new GameEngine().box.onkeyup = function(e){
			var e = e || event;
			var keyCode = e.keyCode || e.which;
			for ( var val of new GameEngine().block ){
				if ( val.body.innerHTML == this.value ){
					val.destory();
					new GameEngine().block.delete(val);
					this.value = "";
					new GameEngine().degSum += parseInt(new GameEngine().deg)
					new GameEngine().showDeg();
				}
			}
		}
	}
}
