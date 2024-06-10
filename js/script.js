document.addEventListener("DOMContentLoaded", function() {

    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuList = document.querySelector('.menu-list');

    hamburgerMenu.addEventListener('click', function () {
        menuList.classList.toggle('open');
    });

  loadDataJSON();

  let labelsMonth = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  let dataSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let labelsTime = ["Breakfast Time", "Lunch Time", "Dinner Time"];

  // Chart Sales Config
  const ctxSales = document.getElementById("salesChart").getContext("2d");

  const salesChart = new Chart(ctxSales, {
      type: "bar",
      data: {
          labels: labelsMonth,
          datasets: [{
              label: "Sales",
              data: dataSales,
              backgroundColor: "rgba(54, 162, 235, 1)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
          }, ],
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      callback: function(value) {
                          return "$" + value;
                      },
                  },
              },
          },
          plugins: {
              legend: {
                  display: false,
              },
          },
      },
  });

  // chart timeTaggingChart
  const ctxTimeTagging = document.getElementById("timeTaggingChart").getContext("2d");
  const timeTaggingChart = new Chart(ctxTimeTagging, {
      type: "doughnut",
      data: {
          labels: labelsTime,
          datasets: [{
              data: [0, 0, 0],
              backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
              hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
          }, ],
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: "right",
              },
          },
      },
  });

  // Chart Top 3 Pizza Types
  const ctxTopPizza = document.getElementById("topPizzaChart").getContext("2d");
  const topPizzaChart = new Chart(ctxTopPizza, {
      type: "bar",
      data: {
          labels: [], // Will be set dynamically
          datasets: [{
              label: "Top 3 Pizza Types",
              data: [],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderWidth: 1,
          }, ],
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return "$" + value;
                    },
                  },
              },
          },
          plugins: {
              legend: {
                  display: false,
              },
          },
      },
  });

  // Chart Average Pizza Size
  const ctxPizzaSize = document.getElementById("pizzaSizeChart").getContext("2d");
    const pizzaSizeChart = new Chart(ctxPizzaSize, {
        type: "bar",
        data: {
            labels: [], // Will be set dynamically
            datasets: [], // Will be set dynamically
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return "$" + value;
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    position: "right",
                },
            },
        },
    });

  function loadDataJSON() {
      fetch("../data/order_list.json")
          .then((response) => response.json())
          .then((response) => {
              let resultData = response;

              const categorySelected = document.getElementById("category").value;
              const quartalSelected = document.getElementById("quartal").value;

              if (categorySelected != "all" && quartalSelected != "all_quartal") {
                  const dataFilterByCategory = resultData.filter(
                      (item) =>
                      item.category == categorySelected &&
                      item.kuartal == quartalSelected
                  );

                  resultData = dataFilterByCategory;
              } else if (categorySelected == "all" && quartalSelected != "all_quartal") {
                  const dataFilterByCategory = resultData.filter(
                      (item) => item.kuartal == quartalSelected
                  );

                  resultData = dataFilterByCategory;
              } else if (quartalSelected == "all_quartal" && categorySelected != "all") {
                  const dataFilterByCategory = response.filter(
                      (item) => item.category == categorySelected
                  );

                  resultData = dataFilterByCategory;
                  console.log("quartalSelected", quartalSelected);
                  console.log("categorySelected", categorySelected != "all");

              }

              // Set data card
              setCardData(resultData);

              // load chart data sales
              loadDataChartSales(resultData);

              // load chart data timetag
              loadDataChartTimeTag(resultData);

              // load chart data top 3 pizza types
              loadDataChartTopPizza(resultData);

              // Load pizza size chart
              loadPizzaSizeChart(resultData);

              // Order list table
              orderList(resultData);

          })
          .catch((error) => {
              console.log(error);
              alert("Gagal memuat data!");
          });
  }

  function setCardData(resultData) {
      // get total recueipt
      const totalReceipt = resultData.length;

      // get total sales
      const totalSales = resultData.reduce(
          (acc, itemData) => acc + itemData.total,
          0
      );

      // get total qty
      const totalQty = resultData.reduce(
          (acc, itemData) => acc + itemData.quantity,
          0
      );

      //   get total type pizza

      const totalType = Object.groupBy(
          resultData,
          ({ pizza_type_id }) => pizza_type_id
      );
      const totalCategory = Object.entries(totalType).length;

      // set html el
      document.getElementById("total-receipt").textContent = totalReceipt;

      // set total sales
      document.getElementById("total-sales").textContent =
          currencyFormat(totalSales);

      // set total qty
      document.getElementById("total-qty").textContent = totalQty;

      // set total category
      document.getElementById("total-category").textContent = totalCategory;
  }

  function loadDataChartSales(resultData) {

      let newDataChart = [...Array(12).keys()];

      labelsMonth.map((item, index) => {
          const month = index + 1;
          const filterData = resultData
              .filter((itemData) => itemData.month == month)
              .reduce((acc, curr) => acc + curr.total, 0);

          newDataChart[index] = filterData;
      });

      // updateDataChart
      salesChart.data.datasets[0].data = newDataChart;
      salesChart.update();

  }

  function loadDataChartTimeTag(resultData) {

      let newDataChart = [...Array(3).keys()];

      labelsTime.map((item, index) => {

          const filterData = resultData
              .filter((itemData) => itemData.time_tag == item)
              .reduce((acc, curr) => acc + curr.total, 0);

          newDataChart[index] = filterData;

      });

      // update data chart
      timeTaggingChart.data.datasets[0].data = newDataChart;
      timeTaggingChart.update();

  }

  function loadDataChartTopPizza(resultData) {
      let pizzaTypes = {};

      resultData.forEach(item => {
          if (!pizzaTypes[item.pizza_name]) {
              pizzaTypes[item.pizza_name] = 0;
          }
          pizzaTypes[item.pizza_name] += item.total;
      });

      let sortedPizzaTypes = Object.entries(pizzaTypes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

      let labels = sortedPizzaTypes.map(item => item[0]);
      let data = sortedPizzaTypes.map(item => item[1]);

      // update data chart
      topPizzaChart.data.labels = labels;
      topPizzaChart.data.datasets[0].data = data;
      topPizzaChart.update();
  }

  function loadPizzaSizeChart(resultData) {
    let pizzaSalesBySize = {}; // Object to store total sales per pizza size and type

    // Collect data for each pizza size and type
    resultData.forEach(item => {
        const key = `${item.size}-${item.pizza_type_id}-${item.pizza_name}`;
        if (!pizzaSalesBySize[key]) {
            pizzaSalesBySize[key] = 0;
        }
        pizzaSalesBySize[key] += item.price * item.quantity;
    });

    // Group the data by pizza size
    let pizzaSalesBySizeGrouped = {};
    Object.entries(pizzaSalesBySize).forEach(([key, value]) => {
        const [size] = key.split("-"); // Extract pizza size from the key
        if (!pizzaSalesBySizeGrouped[size]) {
            pizzaSalesBySizeGrouped[size] = [];
        }
        pizzaSalesBySizeGrouped[size].push({ type: key, sales: value });
    });

    // Extract labels and data for the chart
    let labels = Object.keys(pizzaSalesBySizeGrouped);
    let datasets = Object.values(pizzaSalesBySizeGrouped).map(salesData => ({
        label: salesData[0].type.split("-")[1], // Extract pizza type from the first item's key
        data: salesData.map(item => item.sales),
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 1,
    }));

    // Create and update the chart
    pizzaSizeChart.data.labels = labels;
    pizzaSizeChart.data.datasets = datasets;
    pizzaSizeChart.update();
  }

  // Helper function to generate random colors
  function getRandomColor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  // Table order list
  function orderList(resultData) {

      const table = new DataTable("#order-list", {
            data: resultData,
            columns: [
                { data: "order_details_id" },
                { data: "order_id" },
                { data: "date_order" },
                { data: "pizza_name" },
                { data: "ingredients" },
                { data: "size" },
                { data: "price" },
            ],
            responsive: true,
            destroy: true,
            rowReorder: {
                selector: 'td:nth-child(2)'
            }
      });

      table.clear().rows.add(resultData).draw();
  }

  function currencyFormat(number) {
      return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
      }).format(number);
  }

  document.getElementById("btn-filter").addEventListener("click", function() {
      loadDataJSON();
  });

});
