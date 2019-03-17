function buildMetadata(sample) {

  var url = `/metadata/${sample}`;
  d3.json(url).then(function(data) {
    console.log(data);
  var panel = d3.select("#sample-metadata");

  panel.html("");
   
    Object.entries(data).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  })
} 

//     // BONUS: Build the Gauge Chart
//     // buildGauge(data.WFREQ);
//     // Enter a speed between 0 and 180

function buildGauge(sample) {

  var gaugeurl = `/wfreq/${sample}`;
  d3.json(gaugeurl).then(function(data2) {


  var level = data2.WFREQ;

// Trig to calc meter point
  var degrees = 175 - level * 18.8, radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'washes',
    text: level,
    hoverinfo: 'text+name'},
  { values: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 50],
  rotation: 90,
  text: ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].reverse(),
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['#00131a', '#00394d', '#006080', '#0086b3', '#00bfff', '#33ccff', '#66d9ff','#99e6ff','#ccf2ff', '#e6f9ff', 'rgba(255, 255, 255, 0)']},
  labels: ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',].reverse(),
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
  }];

  var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Scrubs per week',
  height: 800,
  width: 800,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);
  });
}




function buildCharts(sample) {

  var chartURL = `/samples/${sample}`;
  d3.json(chartURL).then(function(data) {

  // Bubble Chart
  var trace1 = {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: "markers",
    marker: {
      color: data.otu_ids,
      size: data.sample_values,
      colorscale: "Earth"
    }
  };

  var trace1 = [trace1];

  var layout = {
    showlegend: false,
    height: 600,
    width: 1500
  };

  Plotly.newPlot("bubble", trace1, layout);

  // Pie Chart
  var data = [{
    labels: data.otu_ids.slice(0, 10),
    values:  data.sample_values.slice(0, 10),
    hovertext: data.otu_labels.slice(0, 10),
    colors: ('#ff6666', '#ffb366', '#ffff66', '#b3ff6', '#66ff66', '#66ffd9', '#66b3ff', '#6666ff', '#b366ff', '#ff66d9'),
    type: 'pie'
  }];

  var layout = {
  
  };

  Plotly.newPlot("pie", data, layout);

  })}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample)
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample)
}

// Initialize the dashboard
init();
