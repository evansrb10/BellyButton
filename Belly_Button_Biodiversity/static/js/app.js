function buildMetadata(sample) {

  var url = `/metadata/${sample}`;
  d3.json(url).then(function(data) {
    console.log(data);
  var panel = d3.select("#sample-metadata");

  panel.html("");
   
    Object.entries(data).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
