function createMindmap(graph) {

	//Building the mindmap functions

	//create svg to put the mindmap
	var svg = d3.select("svg"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height");

	var color = d3.scaleOrdinal(d3.schemeCategory20);

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
	    .style("font-size", "20px");


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
	var svg = d3.select("svg");
	svg.remove();
}

function createScatterplot(plot_data) {

	//setup settings for scatterplot
	var canvas_width = 500;
	var canvas_height = 500;
	var padding = 25;

	var plot_data = [["fish", 1, 2, "ocean"], ["tiger", 5, 6, "forest"]];

	//create SVG element
	var svg = d3.select("svg")  // This is where we put our plot
        width = +svg.attr("width"),
	    height = +svg.attr("height");

    var xScale = d3.scale.linear()
                .domain([0, d3.max(data_scatter, function(d) {
                    return d[1];  // get the input domain as first column of array
                })])
                .range([padding, canvas_width - padding * 2])  // set the output range
                .nice();  // Make decimals round up nicely

	var yScale = d3.scale.linear()
			    .domain([0, d3.max(data_scatter, function(d) {
			        return d[2];  // gets the input domain as the second column of array
			    })])
			    .range([canvas_height - padding, padding])  // set the output range
			    .nice();  // Make decimals round up nicely

	// Add circles from data
    svg.selectAll("circle")
        .data(data_scatter)
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
            return xScale(d[1]);  // Returns scaled location of x
        })
        .attr("y", function(d) {
            return yScale(d[2]);  // Returns scaled circle y
        })
        .attr("font_family", "sans-serif")  // Font type
        .attr("font-size", "11px")  // Font size
        .attr("fill", "darkgreen");   // Font color

    // Define X axis and attach to graph
    var xAxis = d3.svg.axis()  // Create an x axis
        .scale(xScale)      // Scale x axis
        .orient("bottom")  // Put text on bottom of axis line
        .ticks(10);  // Set rough # of ticks (optional)

    svg.append("g")     // Append a group element (itself invisible, but helps 'group' elements)
        .attr("class", "axis")  // Assign the 'axis' CSS
        .attr("transform", "translate(0," + (canvas_height - padding) + ")")  // Place axis at bottom
        .call(xAxis);  // Call function to create axis

    // Define Y axis and attach to graph
    var yAxis = d3.svg.axis()  // Create a y axis
        .scale(yScale)  // Scale y axis
        .orient("left")
        .ticks(5);  // Set rough # of ticks (optional)

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

}
