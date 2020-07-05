
// default display
function init() {
    // Dropdown of people's ID #s
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    });

    // Default demographic info panel & gauge (ID 940)
    buildMetadata("940");

    // Default bar & bubble chart (ID 940)
    buildCharts("940");
};

// Activate default display function
init();

// Info panel & gauge according to dropdown selection
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0]; 

        // Info panel
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        PANEL.append("h6").text("ID: " + result.id);
        PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
        PANEL.append("h6").text("GENDER: " + result.gender);
        PANEL.append("h6").text("AGE: " + result.age);
        PANEL.append("h6").text("LOCATION: " + result.location);
        PANEL.append("h6").text("BBTYPE: " + result.bbtype);
        PANEL.append("h6").text("WFREQ: " + result.wfreq);

        // Gauge (washing frequency)
        var dataGauge = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            title: {text: "Belly Button Washing Frequency (Scrubs Per Week)", font: {size: 18}},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color: "rgb(229,92,92)"},
                    { range: [1, 2], color: "rgb(229,142,92)" },
                    { range: [2, 3], color: "rgb(229,192,92)" },
                    { range: [3, 4], color: "rgb(229,224,92)" },
                    { range: [4, 5], color: "rgb(197,229,92)" },
                    { range: [5, 6], color: "rgb(107,221,229)" },
                    { range: [6, 7], color: "rgb(92,197,229)" },
                    { range: [7, 8], color: "rgb(92,156,229)" },
                    { range: [8, 9], color: "rgb(92,105,229)" }
                ],
                bar: {color: "rgb(0,0,0)"}
            }
        }];
        var layoutGauge = {
            width: 500, 
            height: 350, 
            margin: { t: 0, b: 0 }
        };
                  
        Plotly.newPlot("gauge", dataGauge, layoutGauge);
    });
}

// Bar & bubble charts according to dropdown selection
function buildCharts(sample) {
    
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        // Filter so data is only selected person's data
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0]; 
        
        // Assign person's data to variables
        var sample_values = result.sample_values;
        var sample_values_ten = result.sample_values.slice(0,10);
        var otu_ids = result.otu_ids;
        var otu_ids_ten = result.otu_ids.slice(0,10).map(id => "OTU " + id.toString());
        var otu_labels = result.otu_labels;
        var otu_labels_ten = result.otu_labels.slice(0,10);
        
        // Horiz bar chart: sample_values as values, otu_ids as labels, otu_labels as hover text
        var dataBar = [{
            type: "bar",
            x: sample_values_ten,
            y: otu_ids_ten,
            text: otu_labels_ten,
            orientation: "h",
            marker: {
                color: ["rgb(229,92,92)", "rgb(229,142,92)", "rgb(229,192,92)", "rgb(229,224,92)", 
            "rgb(197,229,92)", "rgb(107,221,229)", "rgb(92,197,229)", "rgb(92,156,229)", 
            "rgb(92,105,229)", "rgb(62,79,225)"],
                opacity: 0.9
            }
        }];

        var layoutBar = {
            title: "Most Numerous Bacterial Species",
            xaxis: {title: "Quantity in Colony Forming Units (CFU)"},
            yaxis: {title: "Operational Taxonomic Unit (OTU) ID", autorange: "reversed"},
        };
        
        Plotly.newPlot("bar", dataBar, layoutBar);

        // Bubble chart: otu_ids as x-axis, sample_values as y-axis, sample_values as marker size, 
        // otu_ids as marker colors, otu_labels as text values.
        var dataBubble = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Portland"
            }
        }];
        
        var layoutBubble = {
            title: "Quantities Of All Bacterial Species",
            xaxis: {title: "Operational Taxonomic Unit (OTU) ID"},
            yaxis: {title: "Quantity in Colony Forming Units (CFU)"}
        };
        
        Plotly.newPlot("bubble", dataBubble, layoutBubble);
    });
};

// When user selects ID from dropdown, activate these functions
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
};