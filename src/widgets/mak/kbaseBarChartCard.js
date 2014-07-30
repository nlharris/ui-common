kb_define('KBaseBarChartCard',
    [
        'jquery',
	'kbwidget'
    ],
    function ($) {
 
    $.KBWidget({ 
        name: "KBaseBarChartCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            id: null,
            workspaceID: null,
            loadingImage: "assets/img/ajax-loader.gif",
            title: "MAK Result Overview Bar Chart",
            isInCard: false,
            width: 750,
            height: 800
        },

		init: function(options) {
            this._super(options);
            if (this.options.terms === null) {
                //throw an error
                return;
            }

            this.$messagePane = $("<div/>")
                                .addClass("kbwidget-message-pane")
                                .addClass("kbwidget-hide-message");
            this.$elem.append(this.$messagePane);

//            this.workspaceClient = new workspaceService(this.workspaceURL);
            return this.render();
        },

        render: function(options) {
			
			self = this;
			
			self.tooltip = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
							 
			terms = self.options.terms
			
			var chartWidth = self.options.width-50
					
			var $sideChart = $("<div>").css({"width":chartWidth,"top":50,"position":"absolute"})
			var flat = []				
			for (termType in terms) {
				var termData = []
				
				for (term in terms[termType]) {
					termData.push({"term":term,"tiles":terms[termType][term]})
					flat.push(terms[termType][term].length)
				}
			}
			var x = d3.scale.linear().domain([0,d3.max(flat)]).range([0,chartWidth])
			console.log(flat)
			
			for (termType in terms) {
				var $barChartDiv = $("<div id='barchart'>"+termType+"</div>").css({"float":"right"})
				var $barChart = d3.select($barChartDiv.get(0))
					.selectAll("div")
					.data(termData)
						.enter()
					.append("div")
						.style({
							"font": "10px sans-serif",
							"background-color": "steelblue",
							"text-align": "right",
							"padding": "3px",
							"margin": "1px",
							"color": "white"
						})
						.style("width",function(d) {return x(d.tiles.length) + "px"})
						.text(function (d) {return d.term})
						.on("mouseover",							
							function(d) {                            
								if (!$(this).hasClass('selected')) {
									for (tile in d.tiles) {
										d3.select("#MAK_tile_"+tile).style("background", "#66FFFF")
									}
									d3.select(this).style("background-color", "#66FFFF"); 
								}							
								self.tooltip = self.tooltip.text("term: "+d.term+", hits: "+d.tiles.length);
								return self.tooltip.style("visibility", "visible");
							}
						)						 
                        .on("mouseout", 
                            function(d) { 
								if (!$(this).hasClass('selected')) {
									for (tile in d.tiles) {
										d3.select("#MAK_tile_"+tile).style("background", "steelblue")
									}
									d3.select(this).style("background-color", "steelblue"); 									
								}
								return self.tooltip.style("visibility", "hidden"); 
                            }
                        )
                        .on("mousemove", 
                            function() { 
                                return self.tooltip.style("top", (d3.event.pageY+15) + "px").style("left", (d3.event.pageX-10)+"px");
                            }
                        )
						// .on("click",
							// function(d) {
								// if ($(this).hasClass('selected')) {
									// for (tile in d.tiles) {
										// $("#MAK_tile_"+tile).removeClass('selected')
									// }
									// $(this).removeClass('selected')
								// }
								// else {
									// for (tile in d.tiles) {
										// $("#MAK_tile_"+tile).addClass('selected')
									// }
									// $(this).addClass('selected')
								// }
							// }
						// )
				
				$sideChart.append($barChartDiv)
				
			}
				
			self.$elem.append($sideChart)
			
			return this;
		},
		
        getData: function() {
            return {
                type: "MAKResult BarChart",
                id: this.options.id,
                workspaceID: this.options.workspaceID,
                title: "MAK Result Overview Bar Chart"
            };
        },

        showMessage: function(message) {
            var span = $("<span/>").append(message);

            this.$messagePane.append(span);
            this.$messagePane.removeClass("kbwidget-hide-message");
        },

        hideMessage: function() {
            this.$messagePane.addClass("kbwidget-hide-message");
            this.$messagePane.empty();
        },

        rpcError: function(error) {
            console.log("An error occurred: " + error);
        }
	
    });
});