var months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

loadDropDownDates();
loadDropDownProducts("mostInterestProduct");
loadCustomerOrderReport();

document.getElementById("mostSalesButton").addEventListener("click", mostSalesAction);
document.getElementById("mostOrdersButton").addEventListener("click", mostOrdersAction);
document.getElementById("mostInterestButton").addEventListener("click", mostInterestAction);
document.getElementById("salesReportButton").addEventListener("click", salesReportAction);

function createXHR(method, url, onload) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = onload;
    xhr.send();
}

function loadYears(id, minYear, maxYear) {
    var html = `<option selected disabled value="-1">Select Year</option>`;
    for (var year = minYear; year <= maxYear; year++) {
        html += `<option value = "${year}">${year}</option>`;
    }
    document.getElementById(id).innerHTML = html;
}

function loadMonths(id) {
    var html = '<option selected disabled value="-1">Select Month</option>';
    for (var index in months) {
        html += `<option value = "${index}">${months[index]}</option>`;
    }
    document.getElementById(id).innerHTML = html;
}

function loadDropDownDates() {
    var maxYear = new Date().getFullYear();
    createXHR("GET", "processes.php?minYear=", function () {
        var minYear = parseInt(this.responseText);
        loadYears("mostSalesYear", minYear, maxYear);
        loadYears("mostOrdersYear", minYear, maxYear);
        loadYears("salesReportYear", minYear, maxYear);
    });
    loadMonths("mostSalesMonth");
    loadMonths("mostOrdersMonth");
}

function loadDropDownProducts(id) {
    createXHR("GET", "processes.php?products=", function () {
        var products = JSON.parse(this.responseText);
        var html = `<option value = '-1' selected disabled>Select Product</option>`;
        for (i in products) {
            html += `<option value = "${products[i].Product_ID}">${products[i].Title}</option>`;
        }
        document.getElementById(id).innerHTML = html;
    });
}

function loadCustomerOrderReport() {
    createXHR("GET", "processes.php?customerOrderReport=", function () {
        var records = JSON.parse(this.responseText);
        var html = ``;
        for (i in records) {
            html += `
                <tr>
                    <th>${records[i].Date_Of_Order}</th>
                    <th>${records[i].First_Name} ${records[i].Last_Name}</th>
                    <th>${records[i].Order_ID}</th>
                    <th>${records[i].Total_Value}</th>
                </tr>
            `;
        }
        document.getElementById("customerOrderTableBody").innerHTML = html;
    });
}

function mostSalesAction(e) {
    e.preventDefault();

    var output = document.getElementById("mostSalesOutput");
    var mostSalesYear = document.getElementById("mostSalesYear").value;
    var mostSalesMonth = document.getElementById("mostSalesMonth").value;

    if (!(mostSalesYear == -1 || mostSalesMonth == -1)) {
        createXHR("GET", `processes.php?mostSalesYear=${mostSalesYear}&&mostSalesMonth=${mostSalesMonth}`, function () {
            var response = JSON.parse(this.responseText);
            if (response != null) {
                output.innerHTML = `<span class='text-warning fw-bold'>${response.Title}<span>`;
            } else {
                output.innerHTML = "<span class='text-warning fw-bold'>No sales in the selected period!<span>";
            }
        });
    } else {
        output.innerHTML = "<span class='text-warning fw-bold'>Invalid Time!<span>";
    }
}

function mostOrdersAction(e) {
    e.preventDefault();

    var output = document.getElementById("mostOrdersOutput");
    var mostOrdersYear = document.getElementById("mostOrdersYear").value;
    var mostOrdersMonth = document.getElementById("mostOrdersMonth").value;

    if (!(mostOrdersYear == -1 || mostOrdersMonth == -1)) {
        createXHR("GET", `processes.php?mostOrdersYear=${mostOrdersYear}&&mostOrdersMonth=${mostOrdersMonth}`, function () {
            var response = JSON.parse(this.responseText);
            if (response != null) {
                output.innerHTML = `<span class='text-warning fw-bold'>${response.Category_Name}<span>`;
            } else {
                output.innerHTML = "<span class='text-warning fw-bold'>No orders in the selected period!<span>";
            }
        });
    } else {
        output.innerHTML = "<span class='text-warning fw-bold'>Invalid Time!<span>";
    }
}

function mostInterestAction(e) {
    e.preventDefault();

    var output = document.getElementById("mostInterestOutput");
    var mostInterestProduct = document.getElementById("mostInterestProduct").value;

    if (mostInterestProduct != -1) {
        createXHR("GET", `processes.php?mostInterestProduct=${mostInterestProduct}`, function () {
            var response = JSON.parse(this.responseText);
            if (response != null) {
                output.innerHTML = `<span class='text-warning fw-bold'>${months[response.month]} ${response.year}<span>`;
            } else {
                output.innerHTML = "<span class='text-warning fw-bold'>No interest for the selected product!<span>";
            }
        });
    } else {
        output.innerHTML = "<span class='text-warning fw-bold'>Invalid Product!<span>";
    }
}

function salesReportAction(e) {
    e.preventDefault();

    var output = document.getElementById("salesReportTable");
    var salesReportYear = document.getElementById("salesReportYear").value;
    var salesReportQuarter = document.getElementById("salesReportQuarter").value;

    if (!(salesReportYear == -1 || salesReportQuarter == -1)) {
        createXHR("GET", `processes.php?salesReportYear=${salesReportYear}&&salesReportQuarter=${salesReportQuarter}`, function () {
            var response = JSON.parse(this.responseText);
            if (response.length != 0) {
                var sumTotal = 0,sumProducts = 0;
                var html = `
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
               `;
                for (i in response) {
                    html += `
                        <tr>
                            <td>${response[i].Title}</td>
                            <td>${response[i].Quantity}</td>
                            <td>${response[i].Total}</td>
                        </tr>
                    `;
                    sumTotal += parseFloat(response[i].Total);
                    sumProducts += parseInt(response[i].Quantity);
                }
                sumTotal = sumTotal.toFixed(2);
                html += `
                        <tr>
                            <th>Total</th>
                            <th>${sumProducts}</th>
                            <th>${sumTotal}</th>
                        </tr>
                    </tbody>
                `;
                output.innerHTML = html;
            } else {
                output.innerHTML = "<span class='text-warning fw-bold'>No available data for the selected period!<span>";
            }
        });
    } else {
        output.innerHTML = "<span class='text-warning fw-bold'>Invalid Time!<span>";
    }
}