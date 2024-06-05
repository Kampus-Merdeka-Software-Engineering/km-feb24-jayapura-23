loadDataJSON();

function loadDataJSON() {
    fetch("../js/order_list.json")
        .then(response => response.json())
        .then(response => {
            let resultData = response;

            const quartalSelected = document.getElementById("kuartal").value;

            if (quartalSelected != "all") {
                const dataFilterByQuartal = resultData.filter(
                    (item) => item.kuartal == quartalSelected
                );

                console.log(quartalSelected, dataFilterByQuartal);

                resultData = dataFilterByQuartal; // Gunakan data yang telah difilter
            }

            setCardData(resultData);
        })
        .catch(error => {
            console.log(error);
            alert("Gagal memuat data!");
        });
}

function setCardData(resultData) {
    // get total receipt
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

    // get total type pizza
    const totalType = Object.groupBy(resultData, ({ pizza_type_id }) => pizza_type_id);
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

function currencyFormat(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(number);
}

document.getElementById("btn-filter").addEventListener("click", function () {
    loadDataJSON();
});
