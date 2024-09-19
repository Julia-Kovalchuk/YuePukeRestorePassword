var throbeProcess = {
	
	processes: [],
	throbberContainerId: 'throberContainer',
	processCounter: 0,
	
	addProcess: function (processId) {
		if (typeof processId == 'number' || typeof processId == 'string') {
			this.processes[this.processes.length] = processId;
		}
		this.showThrobber();
	},
	
	removeProcess: function (processId) {
		for (i in this.processes) {
			if (this.processes[i]) {
				this.processes.splice(i,1);
				break;
			}
		}
		if (this.processes.length == 0) {
			this.hideThrobber();
		}
	},
	
	initDialog: function () {
		if (typeof this.throbberDialog != 'undefined') {
			return;
		}
		dojo.require("dijit.Dialog");
		var throbberDialogDiv = dojo.query('#' + this.throbberContainerId);
		var throbberDialogArgs = {
			title: throbberDialogDiv.attr('title'),
			draggable: false,
			showTitle: false
		};
		this.throbberDialog = new dijit.Dialog(throbberDialogArgs, this.throbberContainerId);
		dojo.query(this.throbberDialog.titleBar).orphan();
		
	},
	
	showThrobber: function () {
		this.initDialog();
		this.throbberDialog.show();
		dojo.query('#' + this.throbberContainerId + '_underlay').orphan();
	},
	
	hideThrobber: function () {
		this.initDialog();
		this.throbberDialog.hide();
	},
	
	isProcessExists: function () {
		return this.processes.length != 0;
	},
	
	_generateRequestId: function () {
		return ++this.processCounter;
	},
	
	_prepareXhrArgsAndLanchProces: function (args) {
		var processId = this._generateRequestId();
		var load = function () {};
		var error = function () {};
		if (typeof args.load == 'function') {
			load = args.load;
		}
		if (typeof args.error == 'function') {
			error = args.error;
		}
		args.load = function (data) {
			throbeProcess.removeProcess(processId);
			load(data);
		};
		args.error = function (error) {
			throbeProcess.removeProcess(processId);
		};
		this.addProcess(processId);
		return args;
	},
	
	xhrPost: function (args) {
		dojo.xhrPost(this._prepareXhrArgsAndLanchProces(args));
	},
	
	xhrGet: function (args) {
		dojo.xhrGet(this._prepareXhrArgsAndLanchProces(args));
	}
	
};
