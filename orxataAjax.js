/*!Orxata Ajax*/
/**
 * 
 * Version: 1.0.0
 * Requires: jQuery v1.7+
 *
 * Copyright (c) Orxata Guy
 * Under MIT License
 * 
 * Powered by SweetAlert2 and jQuery
 * 
 */

function OrxataAjax () {
	this._url = '';
    // GET request as default
  	this._type = 'GET';
  	this._data = {};
    // CSRF-TOKEN or similar is REQUIRED
	this._token = '';
  	this._dataSrc = '';
    this._loading = false;
    this._swal_b_opts = {
        title: 'Please wait...',
        text: 'We are working on this',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    };
    this._swal_e_opts = { 
        title: 'Done!',
        text: 'Everything is ready!',
        icon: 'success'
    };
    this._swal_err_opts = { 
        title: 'Oops!',
        text: 'Something went wrong...',
        icon: 'error'
    };
	this._success = function () {};
  	this._ajax = { type: this._type };
}

// Set the url of the Ajax request
OrxataAjax.prototype.url = function (text) {
	this._url = text;
  return this;
}

// Set the type of the Ajax request
OrxataAjax.prototype.type = function (text) {
	this._type = text.toUpperCase();
  return this;
}

// Set the data source of the Ajax request
OrxataAjax.prototype.src = function (text) {
	this._dataSrc = text;
  return this;
}

// Set the token of the Ajax request
OrxataAjax.prototype.token = function (text) {
	this._token = text;
  return this;
}

// Set the parameters of the Ajax request
OrxataAjax.prototype.data = function (obj) {
	this._data = obj;
  return this;
}

// True fires a message when the Ajax request starts, when ends, and when an error occurs
OrxataAjax.prototype.showLoading = function (bool) {
    this._loading = bool;
    return this;
}

// User friendly way to set the start message. Required showLoading = true.
OrxataAjax.prototype.startMessage = function (title, text) {
    return  this.swalLoadingStartMessage({
        title: title,
        text: text,
        didOpen: () => Swal.showLoading()
    });
}

// User friendly way to set the finish message. Required showLoading = true.
OrxataAjax.prototype.finishMessage = function (title, text) {
    return  this.swalLoadingFinishMessage({
        title: title,
        text: text,
        icon: 'success'
    })
}

// User friendly way to set the error message. Required showLoading = true.
OrxataAjax.prototype.errorMessage = function (title, text) {
    return this.swalLoadingErrorMessage({
        title: title,
        text: text,
        icon: 'error'
    });
    
}

// SweetAlert2 way to set the start message. Required showLoading = true.
OrxataAjax.prototype.swalLoadingStartMessage = function (swal) {
    this._swal_b_opts = swal;
    return this;
}

// SweetAlert2 way to set the start message. Required showLoading = true.
OrxataAjax.prototype.swalLoadingFinishMessage = function (swal) {
    this._swal_e_opts = swal;
    return this;
}

// SweetAlert2 way to set the start message. Required showLoading = true.
OrxataAjax.prototype.swalLoadingErrorMessage = function (swal) {
    this._swal_err_opts = swal;
    return this;
}

// Executes the Ajax request. Success and fail callback params will execute the callback functions
OrxataAjax.prototype.exec = function (success, fail) {
	if(!this._token) console.error("Token not found");
	else {
        if (this._loading) {
            let self = this;
            return $.getScript("https://cdn.jsdelivr.net/npm/sweetalert2@11", () => {
                if(!success)
                return $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': self._token
                    },
                    type: self._type,
                    beforeSend: () => Swal.fire(self._swal_b_opts),
                    complete: e => e.status == 200 ? Swal.fire(self._swal_e_opts) : Swal.fire(self._swal_err_opts),
                    url: self._url,
                    data: self._data
                });
                else {
                    const fcb = (fail) ? fail : (XMLHttpRequest, textStatus, errorThrown) => console.error(`Error in ${arguments.callee.name}:`, XMLHttpRequest.status, errorThrown);
                    $.ajax({
                        headers: {
                        'X-CSRF-TOKEN': self._token
                        },
                        type: self._type,
                        url: self._url,
                        beforeSend: () => Swal.fire(self._swal_b_opts),
                        complete: e => e.status == 200 ?  Swal.fire(self._swal_e_opts) : Swal.fire(self._swal_err_opts),
                        data: self._data,
                        success: success,
                        error: fcb
                    });
                }
            })
        } else {
            if(!success)
                return $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': this._token
                    },
                    type: this._type,
                    url: this._url,
                    data: this._data
                });
                else {
                    const fcb = (fail) ? fail : (XMLHttpRequest, textStatus, errorThrown) => console.error(`Error in ${arguments.callee.name}:`, XMLHttpRequest.status, errorThrown);
                    $.ajax({
                        headers: {
                        'X-CSRF-TOKEN': this._token
                        },
                        type: this._type,
                        url: this._url,
                        data: this._data,
                        success: success,
                        error: fcb
                    });
                }
        }
    }
}

// Ables to set up the Ajax request object with raw options
OrxataAjax.prototype.raw = function (_raw) {
	let raws = _raw.split(','),
	    params = [],
	    values = [];
	raws.forEach(r => {
		let raw_option = r.trim(),
		    opt = raw_option.split(':');
		params.push(opt[0].trim());
		values.push(opt[1].trim());
	});
	for(let x=0; x < params.length; x++) this._ajax[params[x]] = (values[x] == "true") ? true : (values[x] == "false") ? false : values[x];
	return this;
}

// Returns the ajax request as a data feeder (for DataTables for example) 
OrxataAjax.prototype.get = function () {
  if(!this._url) throw Error("Url not found!");
    if(this._loading) {
        let self = this;
        return $.getScript("https://cdn.jsdelivr.net/npm/sweetalert2@11", () => {
            self._ajax.beforeSend = () => Swal.fire(self._swal_b_opts);
            self._ajax.complete = e => e.status == 200 ?  Swal.fire(self._swal_e_opts) : Swal.fire(self._swal_err_opts);
            self._ajax.url = this._url;
            self._ajax.type = this._type;
            self._ajax.data = this._data;
            if(self._dataSrc) this._ajax.dataSrc = this._dataSrc;
            return self._ajax;
        });
    }else{
        this._ajax.url = this._url;
        this._ajax.type = this._type;
        this._ajax.data = this._data;
        if(this._dataSrc) this._ajax.dataSrc = this._dataSrc;
        return this._ajax;
    }
}
