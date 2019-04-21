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



/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // clear any previous memory (e.g., name/place from intro):
    clearMemory('sentences.txt');

    /* --- Button Click Handlers --- */
    record_button.addEventListener("click", recordButtonClick);
    textFileBtn = document.getElementById('textFileBtn');
    textFileBtn.addEventListener('click', function () {
        makeTextFile('sentences.txt');


    });
});