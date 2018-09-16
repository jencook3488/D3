var svgWidth = 900;
var svgHeight = 500;

var margin = {
	top: 50,
	right: 50,
	bottom: 100,
	left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
 
var chart = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("assets/data/data.csv").then(data => {

	data.forEach(function(data) {
		data.healthcare = +data.healthcare;
		data.poverty = +data.poverty;
	})

	var xLinearScale = d3.scaleLinear().range([0, chartWidth]);
	var yLinearScale = d3.scaleLinear().range([chartHeight,0]);

	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);


	xLinearScale.domain([0, d3.max(healthData, function(data){
		return +data.poverty;
	})]);

	yLinearScale.domain([0, d3.max(healthData,function(data){
		return +data.healthStatus;
	})]);

	var toolTip = d3.tip()
	  .attr("class", "toolTip")
	  .offset([80, -60])
	  .html(function(data) {
	    var state = data.state;
	    var povertyRate = +data.poverty;
	    var healthStatus = +data.healthStatus;
	    return (state + "<br> Poverty Rate: " + povertyRate + "<br> Percentage of the population in fair or poor health: " + healthStatus);
	  });

	 chart.call(toolTip);

	let circlesGroup = chart.selectAll(".stateCircle")
	.data(data)
	.enter()
	.append("circle")
	.attr("class", "stateCircle")
	.attr("cx", d => xLinearScale(d.poverty))
	.attr("cy", d => yLinearScale(d.healthcare))
	.attr("r", "15")
	.attr("opacity", ".5")

	  chart.append("g")
	   .attr("transform", `translate(0, ${chartHeight})`)
	   .call(bottomAxis);

     chart.append("g")
       .call(leftAxis);

     chart.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (chartHeight))
       .attr("dy", "1em")
       .attr("class", "axisText")
       .text("Lacks Healthcare(%)");

    chart.append("text")
     .attr("transform", "translate(" + (chartWidth/3) + "," + (chartHeight + margin.top + 30) + ")") 
     .attr("class", "axisText")
     .text("In Poverty (%)");

});

