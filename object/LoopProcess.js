function LoopProcess(fps)
{
	this.t = $.now();
	this.fps = fps;
	this.currentProcessTime = 0;
	this.currentFrameTime = 0;
	this.timerId = null;

}

LoopProcess.prototype.loop = function loop(mainProcess)
{
	var _this = this;
	(function f(){
		// update current time
		_this.t = $.now();
		// do main process
		mainProcess();

		// calculate overtime from processtime
		_this.currentProcessTime = $.now() - _this.t;
		_this.currentFrameTime = _this.fps - _this.currentProcessTime;
		// recursion
		setTimeout(f, _this.currentFrameTime);
	})();
}