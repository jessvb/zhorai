function createMindmap(graph) {

	//Building the mindmap functions
	// graph = {"nodes": [{"id": "desert", "group": 3}, {"id": "lot", "group": 1}, {"id": "sand", "group": 1}, {"id": "very", "group": 1}, {"id": "dry", "group": 1}, {"id": "cactus", "group": 1}, {"id": "hot", "group": 1}, {"id": "sunny", "group": 1}, {"id": "much", "group": 1}, {"id": "water", "group": 1}, {"id": "people", "group": 2}, {"id": "flash", "group": 1}, {"id": "flood", "group": 1}, {"id": "dune", "group": 1}, {"id": "sandy", "group": 1}, {"id": "many", "group": 1}, {"id": "plant", "group": 1}, {"id": "vegetation", "group": 2}, {"id": "precipitation", "group": 2}, {"id": "also", "group": 1}, {"id": "dryland", "group": 1}, {"id": "harsh", "group": 1}, {"id": "environment", "group": 1}, {"id": "hard", "group": 1}, {"id": "animal", "group": 1}, {"id": "rare", "group": 1}, {"id": "way", "group": 1}, {"id": "cool", "group": 1}, {"id": "nocturnal", "group": 1}, {"id": "often", "group": 1}, {"id": "night", "group": 1}, {"id": "store", "group": 1}, {"id": "shrub", "group": 1}, {"id": "sun", "group": 1}, {"id": "cold", "group": 1}, {"id": "africa", "group": 1}], "links": [{"source": "lot", "target": "desert", "value": 3}, {"source": "sand", "target": "desert", "value": 2}, {"source": "very", "target": "desert", "value": 3}, {"source": "dry", "target": "desert", "value": 1}, {"source": "cactus", "target": "desert", "value": 2}, {"source": "hot", "target": "desert", "value": 3}, {"source": "sunny", "target": "desert", "value": 1}, {"source": "much", "target": "desert", "value": 1}, {"source": "water", "target": "desert", "value": 4}, {"source": "people", "target": "desert", "value": 1}, {"source": "flash", "target": "desert", "value": 1}, {"source": "flood", "target": "desert", "value": 1}, {"source": "dune", "target": "desert", "value": 1}, {"source": "sandy", "target": "desert", "value": 1}, {"source": "many", "target": "desert", "value": 2}, {"source": "plant", "target": "desert", "value": 2}, {"source": "vegetation", "target": "desert", "value": 1}, {"source": "precipitation", "target": "desert", "value": 1}, {"source": "also", "target": "desert", "value": 1}, {"source": "dryland", "target": "desert", "value": 1}, {"source": "harsh", "target": "desert", "value": 1}, {"source": "environment", "target": "desert", "value": 1}, {"source": "hard", "target": "desert", "value": 2}, {"source": "animal", "target": "desert", "value": 5}, {"source": "rare", "target": "desert", "value": 1}, {"source": "way", "target": "desert", "value": 1}, {"source": "cool", "target": "desert", "value": 1}, {"source": "nocturnal", "target": "desert", "value": 1}, {"source": "often", "target": "desert", "value": 1}, {"source": "night", "target": "desert", "value": 2}, {"source": "store", "target": "desert", "value": 1}, {"source": "shrub", "target": "desert", "value": 1}, {"source": "sun", "target": "desert", "value": 1}, {"source": "cold", "target": "desert", "value": 1}, {"source": "africa", "target": "desert", "value": 1}]}


	//create svg to put the mindmap
	var svg = d3.select("#mindmap"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height");

	var color = d3.scaleOrdinal().range(["#23B9BD", "#2D3B9F", "#FF5733"]); //purple, blue, red

	var nd;
	for (var i=0; i<graph.nodes.length; i++) {
	  nd = graph.nodes[i];
	  nd.rx = nd.id.length * 8.5; 
	  nd.ry = 20;
	  // console.log(nd);
	} 


	var node = svg.append("g")
	    .attr("class", "node")
	  .selectAll("ellipse")
	  .data(graph.nodes)
	  .enter().append("ellipse")  
	    .attr("rx", function(d) { return d.rx; })
	    .attr("ry", function(d) { return d.ry; })
	    .attr("fill", function(d) { return color(d.group); });
	    // .call(d3.drag()
	    //     .on("start", dragstarted)
	    //     .on("drag", dragged)
	    //     .on("end", dragended));

	var link_force = d3.forceLink()
		.distance(200)
		.id(function(d) {return d.id;});

	var simulation = d3.forceSimulation()
	    .force("link", link_force)
	    .force("collide", d3.ellipseForce(6, 0.5, 5))
	    .force("center", d3.forceCenter(width / 2, height / 2));

	var link = svg.append("g")
	  .attr("class", "link")
	  .selectAll("line")
	  .data(graph.links)
	  .enter().append("line")
	  .attr("stroke", "black")
	  .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

	var text = svg.append("g")
	    .attr("class", "labels")
	  .selectAll("text")
	  .data(graph.nodes)
	  .enter().append("text")  
	    .attr("dy", 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) {return d.id})
	    .attr("fill", "white")
	    .style("font-size", "20px")
	    .style("font_family", "monospace");


	simulation
	  .nodes(graph.nodes)
	  .on("tick", ticked);

	simulation.force("link")
	     .links(graph.links);

	function ticked() {
	  link
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	  text
	      .attr("x", function(d) { return d.x; })
	      .attr("y", function(d) { return d.y; });

	}

	function dragstarted(d) {
	  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	  d.fx = d.x;
	  d.fy = d.y;
	}

	function dragged(d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}

	function dragended(d) {
	  if (!d3.event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}


}

function deleteMindmap() {
	var svg = d3.selectAll("svg");
	svg.selectAll("*").remove();
}



function createScatterplot(plot_data) {

	//setup settings for scatterplot
	var canvas_width = 500;
	var canvas_height = 500;
	var padding = 25;

	// var plot_data = [["fish", 1, 2, "ocean"], ["tiger", 5, 6, "forest"]];

	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var symbols = d3.scaleOrdinal(d3.symbols);

	// creates a generator for symbols
	var symbol = d3.symbol().size(100);  

	//create SVG element
	var svg = d3.select("#scatterplot")  // This is where we put our plot
        width = +svg.attr("width"),
			height = +svg.attr("height");
			
	var withinPlotMargin = 1;

    var xScale = d3.scaleLinear()
                .domain([d3.min(plot_data, function(d) { return d[1] - withinPlotMargin; }), d3.max(plot_data, function(d) {
                    return d[1] + 2;  // get the input domain as first column of array
                })])
                .range([padding, canvas_width - padding * 2])  // set the output range
                .nice();  // Make decimals round up nicely

	var yScale = d3.scaleLinear()
			    .domain([d3.min(plot_data, function(d) { return d[2] - withinPlotMargin; }), d3.max(plot_data, function(d) {
			        return d[2]+withinPlotMargin;  // gets the input domain as the second column of array
			    })])
			    .range([canvas_height - padding, padding])  // set the output range
			    .nice();  // Make decimals round up nicely

	// Add circles from data
    svg.selectAll("circle")
        .data(plot_data)
        .enter()
        .append("circle")
        .attr("x", function(d) {
            return xScale(d[1]);  // Location of x
        })
        .attr("y", function(d) {
            return yScale(d[2]);  // Location of y
        })
        .attr("r", 4)  // Radius
        .attr("cx", function(d) {
            return xScale(d[1]);  // Returns scaled circle x
        })
        .attr("cy", function(d) {
            return yScale(d[2]);  // Returns scaled circle y
        })
        .style("fill", function(d) {
        	return color(d[3]);
        });

    // Add Text Labels
    svg.selectAll("text")
        .data(plot_data)
        .enter()
        .append("text")
        .text(function(d) {
            return d[0];
        })
        .attr("x", function(d) {
            return xScale(d[1])+8;  // Returns scaled location of x
        })
        .attr("y", function(d) {
            return yScale(d[2]);  // Returns scaled circle y
        })
        .attr("font_family", "sans-serif")  // Font type
        .attr("font-size", "18px")  // Font size
        .attr("fill", "black");   // Font color

    svg.selectAll(".symbol")
    .data(plot_data)
 	.enter().append("path")
    .attr("class", "symbol")
    .attr("d", function(d, i) { return symbol.type(symbols(d[3]))(); })
    .style("fill", function(d) { return color(d[3]); })
    .attr("transform", function(d) { 
      return "translate(" + xScale(d[1]) + "," + yScale(d[2]) +")"; 
    });
  
  var clicked = ""

    var legend = svg.selectAll(".legend")
	    .data(color.domain())
	  	.enter().append("g")
	    .attr("class", "legend")
	    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d) })
      .on("click", function(d) {
      	console.log("hi")
      	d3.selectAll(".symbol").style("opacity", 1)
      	if (clicked !== d) {
      		d3.selectAll(".symbol")
      			.filter(function(e) {
      				return e[3] !== d;
      				console.log(e[3])
      			})
      			.style("opacity", 0.1)
      		clicked = d
      	} else {
      		clicked = ""
      	}
      });
 
  legend.append("text")
      .attr("x", width - 30)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


    // Define X axis and attach to graph
    var xAxis = d3.axisBottom()  // Create an x axis
        .scale(xScale)      // Scale x axis
        .ticks(5);  // Set rough # of ticks (optional)

    svg.append("g")     // Append a group element (itself invisible, but helps 'group' elements)
        .attr("class", "axis")  // Assign the 'axis' CSS
        .attr("transform", "translate(0," + (canvas_height - padding) + ")")  // Place axis at bottom
        .call(xAxis);  // Call function to create axis

    // Define Y axis and attach to graph
    var yAxis = d3.axisLeft()  // Create a y axis
        .scale(yScale)  // Scale y axis
        .ticks(5);  // Set rough # of ticks (optional)

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

}

//var plot_data = {"desert": 0.2992, "rainforest": 0.2998, "tundra": 0.2440};
//createHistogram(plot_data);
function createHistogram(plot_data) {

	var data = [];
	for (var key in plot_data) {
		data.push({"ecosystem": key, "value": plot_data[key]});
	}
	//setup settings for histogram
	var canvas_width = 500;
	var canvas_height = 500;
	var margin = {top:10, right:10, bottom:90, left:10};

	

	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var symbols = d3.scaleOrdinal(d3.symbols);

	// creates a generator for symbols
	var symbol = d3.symbol().size(100);  

	//create SVG element
	var svg = d3.select("#histogram")  // This is where we put our plot
        width = +svg.attr("width"),
			height = +svg.attr("height");

	var xAxis = d3.scaleBand()
		.range([0, canvas_width])
		.padding(0.1);

	var yAxis = d3.scaleLinear()
		.range([canvas_height, 0]);

	svg.append("text")
		.attr("x", canvas_width/2)
		.attr("y", 20)
		.style("text-anchor", "middle")
		.style("font-size", "30px")
		.text("Where I think this animal lives");

	svg.append("g")
		.attr("transform", "translate(" +margin.left + "," + margin.top + ")");

	xAxis.domain(data.map(function(d) { return d.ecosystem; }));
	yAxis.domain([0, d3.max(data, function(d) { return d.value; })]);
	color.domain(data.map(function(d) { return d.ecosystem; }));

	// append the rectangles for the bar chart
	svg.selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return xAxis(d.ecosystem); })
	    .attr("width", xAxis.bandwidth())
	    .attr("y", function(d) { return yAxis(d.value)+30; })
	    .attr("height", function(d) { return canvas_height - yAxis(d.value)-30; })
	    .attr("fill", function(d) { return color(d.ecosystem); });


	  // add the x Axis
	svg.append("g")
		.style("font-size", "25px")
	    .attr("transform", "translate(0," + canvas_height + ")")
	    .call(d3.axisBottom(xAxis));

	  // add the y Axis
	svg.append("g")
	    .call(d3.axisLeft(yAxis));

}
