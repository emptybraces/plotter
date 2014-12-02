//
// LoopProcess class
//
function LoopProcess(fps)
{
	this.t = $.now();
	this.fps = fps;
	this.currentProcessTime = 0;
}

LoopProcess.prototype.loop = function loop(mainProcess)
{
	var _this = this;
	(function loopProcess(){
		// update current time
		_this.t = $.now();
		// do main process
		mainProcess();

		// calculate overtime from processtime
		_this.currentProcessTime = $.now() - _this.t;
		var currentLeftOverTime = _this.fps - _this.currentProcessTime;
		// recursion
		setTimeout(loopProcess, currentLeftOverTime);
	})();
}