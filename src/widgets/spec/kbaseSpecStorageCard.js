(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecStorageCard", 
        parent: "kbaseAuthenticatedWidget", 
        version: "1.0.0",

        options: {
            id: '',
            width: 560,
            token: null
        },

        init: function(options) {
        	options.id = '';
            this._super(options);
            if (!this.options.token)
            	this.options.token = this.authToken();
            var self = this;
        	var pref = generateSpecPrefix();
            self.$elem.append('<p class="muted loader-table"><img src="assets/img/ajax-loader.gif"> loading...</p>');

            var kbws = new Workspace(newWorkspaceServiceUrlForSpec, {token: self.options.token});
            kbws.list_modules({}, function(data) {
                $('.loader-table').remove();

                var dataList = [];
            	for (var i = 0; i < data.length; i++)
            		dataList.push({module: '<a onclick="specClicks[\''+pref+'module-click\'](this,event); return false;" data-module="'+data[i]+'">'+data[i]+'</a>'});
                self.$elem.append('<table id="'+pref+'module-table" class="table table-striped table-bordered"></table>');
                var tableSettings = {
                        "sPaginationType": "bootstrap",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Module name", mData: "module"}],
                        "aaData": dataList,
                        "oLanguage": {
                            "sSearch": "Search module:",
                            "sEmptyTable": "No modules registered."
                        }
                    };
                var table = $('#'+pref+'module-table').dataTable(tableSettings);
                specClicks[pref+'module-click'] = function(elem,e) {
                	var module = $(elem).data('module');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "module", 
                    			id : module,
                    			token: self.options.token,
                    			event: e
                    		});
                };
            }, function(data) {
            	$('.loader-table').remove();
                self.$elem.append('<p>[Error] ' + data.error.message + '</p>');
                return;
            });
            
            return this;
        },
        
        getData: function() {
            return {
                type: "KBaseSpecStorageCard",
                id: this.options.id,
                workspace: 'specification',
                title: "Registered Module Objects"
            };
        }
    });
})( jQuery );
