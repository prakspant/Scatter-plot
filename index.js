var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 920 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x).tickFormat(d3.format(".4"));
var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

var tooltip = d3.select("body").append("div").attr("class", "tooltip").attr("id", "tooltip").style("opacity", 0);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Load your data here
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(function(data) {
    // Parse the data
    data.forEach(function(d) {
      d.Year = new Date(d.Year, 0, 1);
      var parsedTime = d.Time.split(':');
      d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    });

    // Define the x and y domains
    x.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain(d3.extent(data, function(d) { return d.Time; }));

    // Define the x and y axes
    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));
    var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
      .attr("class", "x axis")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .attr("id", "y-axis")
      .call(yAxis);

    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.Year); })
      .attr("cy", function(d) { return y(d.Time); })
      .attr("data-xvalue", function(d) { return d.Year.getUTCFullYear(); })
      .attr("data-yvalue", function(d) { return d.Time.toISOString(); })
      .on("mouseover", function(event, d) {
        tooltip.style("opacity", .9);
        tooltip.html(d.Name + ": " + d.Nationality + "<br/>Year: "  + d.Year.getFullYear() + ", Time: " + d.Time.getMinutes() + ":" + d.Time.getSeconds())
          .attr("data-year", d.Year.getUTCFullYear())
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("opacity", 0);
      });

    // Add a legend
    var legend = svg.append("g")
      .attr("id", "legend");

    legend.append("text")
      .attr("x", width - 20)
      .attr("y", height - 30)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Time - Year for 35 fastest riders");
  })
  .catch(function(error){
    console.log(error);
  });
