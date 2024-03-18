const urls = {
  aapl: "https://storage.googleapis.com/hiring-resources/aapl.json",
  goog: "https://storage.googleapis.com/hiring-resources/goog.json",
  msft: "https://storage.googleapis.com/hiring-resources/msft.json",
};

let chart = null;

document.getElementById("ticker").addEventListener("change", loadData);
document.getElementById("showVolume").addEventListener("change", loadData);

function loadData() {
  const ticker = document.getElementById("ticker").value;
  const showVolume = document.getElementById("showVolume").checked;
  console.log(urls[ticker]);
  axios.get(urls[ticker]).then((response) => {
    console.log(response.data.results);
    const stockData = response.data.results;
    const labels = stockData.map((item) =>
      new Date(item.t).toISOString().slice(0, 16).replace("T", " ")
    );
    const closePrices = stockData.map((item) => item.c);
    const volumes = stockData.map((item) => item.v);

    const datasets = [
      {
        label: "Close Price",
        data: closePrices,
        borderColor: "rgb(75, 192, 192)",
        yAxisID: "y",
      },
    ];

    if (showVolume) {
      datasets.push({
        label: "Volume",
        data: volumes,
        borderColor: "rgb(153, 102, 255)",
        yAxisID: "y1",
      });
    }

    updateChart(labels, datasets);
  });
}

function updateChart(labels, datasets) {
  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById("stockChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      scales: {
        y: {
          type: "linear",
          position: "left",
        },
        y1: {
          type: "linear",
          position: "right",
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  });
}

// Initial load
loadData();
