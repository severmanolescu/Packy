var isAuthenticated = false;
var administrator = false;
var uid = "";

function checkForAuthenticatedMainMenu() {
    var newOrderNavItem = document.getElementById("newOrderNavItem");
    checkForStorage();

    console.log(administrator);

    if (isAuthenticated === true) {
        newOrderNavItem.style.display = "block";

        if (administrator === "true") {
            addDriver.style.display = "block";
            driverInfo.style.display = "block";
            editOrder.style.display = "block";

            index.style.display = "none";
            contact.style.display = "none";
        }
        else {
            addDriver.style.display = "none";
            driverInfo.style.display = "none";
            editOrder.style.display = "none";
        }
    } else {
        newOrderNavItem.style.display = "none";
        addDriver.style.display = "none";
        driverInfo.style.display = "none";
        editOrder.style.display = "none";
    }
}

function checkForAuthenticatedSecondMenu() {
    var login = document.getElementById("login");
    var signUp = document.getElementById("signUp");
    var userInfo = document.getElementById("userInfo");
    var logout = document.getElementById("logout");

    if (isAuthenticated === true) {
        login.style.display = "none";
        signUp.style.display = "none";

        logout.style.display = "block";

        if (administrator === true) {
            userInfo.style.display = "none";
        }
        else {
            userInfo.style.display = "block";
        }
    } else {
        login.style.display = "block";
        signUp.style.display = "block";
        userInfo.style.display = "none";
        logout.style.display = "none";
    }
}

function checkForStorage() {
    var checkForAuthenntificated = localStorage.getItem('isAuthenticated');
    var checkForDarkMode = localStorage.getItem('darkMode');
    var checkForUID = localStorage.getItem('uid');
    var admin = localStorage.getItem('administator');

    if (checkForAuthenntificated != null) {
        if (checkForAuthenntificated == "true") {
            isAuthenticated = true;
        }
        else {
            isAuthenticated = false;
        }
    }

    console.log(admin);

    if (admin != null) {
        administrator = admin;
    }

    if (checkForUID != null) {
        uid = checkForUID;
    }

    if (checkForDarkMode != null) {
        if (checkForDarkMode == "true") {
            document.getElementById('themeToggle').checked = true;

            document.body.classList.add('dark-theme');
        }
        else {
            document.getElementById('themeToggle').checked = false;

            document.body.classList.remove('dark-theme');
        }
    }
}

function toggleFields() {
    var selection = document.getElementById("userType").value;
    var personFields = document.getElementById("personFields");
    var firmFields = document.getElementById("firmFields");

    if (selection === "PhysicalPerson") {
        personFields.style.display = "block";
        firmFields.style.display = "none";
    } else {
        personFields.style.display = "none";
        firmFields.style.display = "block";
    }
}

function checkForDarkMode() {
    document.addEventListener("DOMContentLoaded", function () {
        var themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('change', function (event) {
            if (event.currentTarget.checked) {
                localStorage.setItem('darkMode', true);

                document.body.classList.add('dark-theme');
            } else {
                localStorage.setItem('darkMode', false);

                document.body.classList.remove('dark-theme');
            }
        });
    });
}

function logout() {
    localStorage.setItem('isAuthenticated', false);

    console.log("What?");

    window.location.href = "/Home/Index";
}

async function checkForAdministrator() {
    uidTemp = localStorage.getItem("uid");

    fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/users/${uidTemp}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.administrator);

            localStorage.setItem("administator", data.administrator);

            console.log(localStorage.getItem("administator"));

            window.location.href = "/Home/Index";
        })
        .catch(error => {
            localStorage.setItem("administator", false);

            console.error('There was a problem with the fetch operation:', error);

            error.textContent = "The AWB dowsn't exist!"
        });
}

async function logIn() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    try {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAg1PitDxVFLHWpeD-bTq24f4FK8yV-rpI", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Successfully logged in');

            console.log(data.localId);

            localStorage.setItem('uid', data.localId);
            localStorage.setItem('isAuthenticated', true);

            await checkForAdministrator();
        } else {
            error.textContent = "Wrong email or password"
        }
    } catch (error) {
        error.textContent = "There was an error while trying  to log in"
    }
}

async function createUserOnFirebase() {
    document.getElementById('error').textContent = ""
    document.getElementById('createdAccount').textContent = ""

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var firstName;
    var lastName;
    var phoneNumber = document.getElementById("phone").value;
    var country = document.getElementById("country").value;
    var county = document.getElementById("county").value;
    var zipCode = document.getElementById("zipCode").value;
    var address = document.getElementById("address").value;
    var email = document.getElementById("email").value;
    var type;

    var selection = document.getElementById("userType").value;

    if (selection === "PhysicalPerson") {
        firstName = document.getElementById("firstName").value;
        lastName = document.getElementById("lastName").value;

        type = "Physical Person";
    } else {
        firstName = document.getElementById("firmName").value;
        lastName = document.getElementById("firmWebsite").value;

        type = "Firm";
    }

    if (firstName.trim() === "" || lastName.trim() === "" || phoneNumber.trim() === "" || country.trim() === "" || county.trim() === "" || zipCode.trim() === "" || address.trim() === "") {
        error.textContent = "Please complete all the inputs!"
    }
    else {
        var userAccount = {
            email: email,
            password: password,
            returnSecureToken: true,
        };

        var userData = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            country: country,
            county: county,
            zipCode: zipCode,
            address: address,
            email: email,
            type: type,
        };

        try {
            var response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAg1PitDxVFLHWpeD-bTq24f4FK8yV-rpI', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userAccount),
            });

            if (response.ok) {
                var responseData = await response.json();
                await saveUserDataToDatabase(responseData.localId, userData);

                clearFormInputsCreateAccount();

                document.getElementById('createdAccount').textContent = "Account created!"
            } else {
                const errorResponse = JSON.parse(await response.text());
                const errorMessage = errorResponse.error.message || "An error occurred. Please try again.";

                if (errorMessage == "EMAIL_EXISTS") {
                    error.textContent = "Email already used"
                }
                else if (errorMessage == "MISSING_PASSWORD" && errorMessage == "INVALID_PASSWORD") {
                    error.textContent = "Enter a password"
                }
                else if (errorMessage == "WEAK_PASSWORD") {
                    error.textContent = "Try to use a stronger password"
                }
                else {
                    error.textContent = "Try enter your data correctly"
                }
            }
        } catch (error) {
            document.getElementById('error').textContent = error.message;
        }
    }
}

async function saveUserDataToDatabase(uid, userData) {
    try {
        await fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        console.log('User data saved to the database successfully');
    } catch (error) {
        console.error('Error saving user data to the database:', error);
    }
}

function clearFormInputsCreateAccount() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("repeatPassword").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("firmWebsite").value = "";
    document.getElementById("firmName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("country").value = "";
    document.getElementById("county").value = "";
    document.getElementById("zipCode").value = "";
    document.getElementById("address").value = "";
}

function clearFormInputsNewOrder() {
    document.getElementById("receiverName").value = "";
    document.getElementById("county").value = "";
    document.getElementById("zipCode").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("height").value = "";
    document.getElementById("width").value = "";
    document.getElementById("length").value = "";
    document.getElementById("weight").value = "";
    document.getElementById("price").value = "";
    document.getElementById("fragileYes").checked = false;
    document.getElementById("observations").value = "";
}

function addNewOrder() {
    var receiverName = document.getElementById("receiverName").value;
    var county = document.getElementById("county").value;
    var zipCode = document.getElementById("zipCode").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    var height = document.getElementById("height").value;
    var width = document.getElementById("width").value;
    var length = document.getElementById("length").value;
    var weight = document.getElementById("weight").value;
    var price = document.getElementById("price").value;
    var fragile = document.querySelector('input[name="fragile"]:checked').value;
    var observations = document.getElementById("observations").value;

    var uid = localStorage.getItem("uid");

    if (
        receiverName.trim() === "" ||
        county.trim() === "" ||
        zipCode.trim() === "" ||
        address.trim() === "" ||
        phone.trim() === "" ||
        height.trim() === "" ||
        width.trim() === "" ||
        length.trim() === "" ||
        weight.trim() === "" ||
        price.trim() === ""
    ) {
        error.textContent = "Please complete all the inputs!"
    }
    else {
        error.textContent = ""

        var orderData = {
            receiverName: receiverName,
            county: county,
            zipCode: zipCode,
            address: address,
            phone: phone,
            height: height,
            width: width,
            length: length,
            weight: weight,
            price: price,
            fragile: fragile,
            observations: observations,
            uid: uid,
            status: "Placed",
            driver: "None"
        };

        fetch("https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/orders.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
            .then(response => response.json())
            .then(data => {
                var awbDiv = document.getElementById("awb");
                awbDiv.innerText = data.name;

                console.log("Order created successfully:", data);

                clearFormInputsNewOrder();
            })
            .catch(error => {
                console.error("Error creating order:", error)
            });
    }
}

function viewOrder() {
    const awb = document.getElementById('awb').value;

    fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/orders/${awb}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            putDataToDiv(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);

            error.textContent = "The AWB dowsn't exist!"
        });
}

function putDataToDiv(data) {

    if (data.receiverName === undefined) {
        error.textContent = "The AWB dowsn't exist!"
    }
    else {
        error.textContent = ""

        document.getElementById("receiverName").innerText = data.receiverName;
        document.getElementById("county").innerText = data.county;
        document.getElementById("zipCode").innerText = data.zipCode;
        document.getElementById("address").innerText = data.address;
        document.getElementById("phone").innerText = data.phone;
        document.getElementById("height").innerText = data.height;
        document.getElementById("width").innerText = data.width;
        document.getElementById("length").v = data.length;
        document.getElementById("weight").innerText = data.weight;
        document.getElementById("price").innerText = data.price;
        document.getElementById("observations").innerText = data.observations;

        const fragileYes = document.getElementById('fragileYes');
        const fragileNo = document.getElementById('fragileNo');

        if (data.fragile === 'Yes') {
            fragileYes.checked = true;
            fragileNo.checked = false;
        } else {
            fragileYes.checked = false;
            fragileNo.checked = true;
        }
    } 
}

function clearContactInputs() {
    document.getElementById("description").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
}

function contactButton() {
    var description = document.getElementById("description").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;

    var uid = localStorage.getItem("uid");

    completed.textContent = ""
    error.textContent = ""

    if (
        description.trim() === "" ||
        phone.trim() === "" ||
        email.trim() === ""
    ) {
        error.textContent = "Please complete all the inputs!"
    }
    else {
        error.textContent = ""

        var orderData = {
            description: description,
            phone: phone,
            email: email,
            status: "placed"
        };

        fetch("https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/contact.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Order created successfully:", data);

                completed.textContent = "We will get to you soon!"

                clearContactInputs();
            })
            .catch(error => {
                console.error("Error creating order:", error)
            });
    }
}

function addRow(awb, receiver, status) {
    var table = document.getElementById("ordersTable").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

    cell1.innerHTML = awb;
    cell2.innerHTML = receiver;
    cell3.innerHTML = status;
}

function viewOrdersUser() {
    var checkForUID = localStorage.getItem('uid');

    if (checkForUID != null) {
        fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/orders.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                for (const orderId in data) {
                    if (data.hasOwnProperty(orderId)) {
                        const orderDetails = data[orderId];

                        if (orderDetails.uid === uid) {
                            addRow(orderId, orderDetails.receiverName, orderDetails.status);
                        }
                    }
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);

                error.textContent = "The UID dowsn't exist!"
            });
    }
}

function putUserDataToDiv() {
    var checkForUID = localStorage.getItem('uid');

    if (checkForUID != null) {
        fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/users/${checkForUID}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                document.getElementById("userType").innerText =     "Type: "    + data.type;
                document.getElementById("userName").innerText =     "Name: "    + data.firstName + " " +data.lastName;
                document.getElementById("userEmail").innerText =    "Email: "   + data.email;
                document.getElementById("userCountry").innerText =  "Country: " + data.country;

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);

                error.textContent = "The UID dowsn't exist!"
            });
    }
}

function clearFormInputsNewDriver() {
    document.getElementById("driverName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("email").value = "";
    document.getElementById("licenseNumber").value = "";
    document.getElementById("vehicleDetails").value = "";
}

function addNewDriver() {
    var driverName = document.getElementById("driverName").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var email = document.getElementById("email").value;
    var licenseNumber = document.getElementById("licenseNumber").value;
    var vehicleDetails = document.getElementById("vehicleDetails").value;
    var availability = document.getElementById("availability").value;

    error.textContent = "";
    info.textContent = "";

    if (
        driverName.trim() === "" ||
        phoneNumber.trim() === "" ||
        email.trim() === "" ||
        licenseNumber.trim() === "" ||
        vehicleDetails.trim() === ""
    ) {
        error.textContent = "Please complete all the inputs!"
    }
    else {
        var driverData = {
            driverName: driverName,
            phoneNumber: phoneNumber,
            email: email,
            licenseNumber: licenseNumber,
            vehicleDetails: vehicleDetails,
            availability: availability,
        };

        fetch("https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/drivers.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(driverData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Driver add with success", data);

                info.textContent = "Driver added with succes: " + data.name;

                clearFormInputsNewDriver();
            })
            .catch(error => {
                console.error("Error adding driver:", error)
            });
    }
}

async function searchForUserName(userID) {
    try {
        const response = await fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}.json`);

        console.log(userID);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data !== null) {
            var auxiliarName = "" + data.firstName + " " + data.lastName;

            return auxiliarName;
        } else {
            return "";
        }
    } catch (error) {
        return "";
    }
}

async function searchForOrdersForDriver(driverID) {
    if (driverID != null) {
        try {
            const response = await fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/orders.json`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            for (const ordersID in data) {
                if (data.hasOwnProperty(ordersID)) {
                    const orderDetails = data[ordersID];

                    if (orderDetails.driver === driverID) {
                        const newRow = document.createElement('tr');

                        const awbCell = document.createElement('td');
                        awbCell.textContent = ordersID;
                        newRow.appendChild(awbCell);

                        const senderCell = document.createElement('td');
                        var auxiliar = await searchForUserName(orderDetails.uid);
                        senderCell.textContent = auxiliar;
                        newRow.appendChild(senderCell);

                        const receiverCell = document.createElement('td');
                        receiverCell.textContent = orderDetails.receiverName;
                        newRow.appendChild(receiverCell);

                        ordersTableBody.appendChild(newRow);
                    }
                }
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Handle the error here
        }
    }
}

async function putDataToInputs(driverName, phoneNumber, ID) {
    const driverNameInput = document.getElementById('driverName');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const driverID = document.getElementById('driverID');

    const driverInfoForm = document.getElementById('driverInfoForm');

    driverNameInput.value = driverName;
    phoneNumberInput.value = phoneNumber;
    driverID.value = ID;

    driverInfoForm.style.display = "block";
}

async function checkIfSearchByName(driverName) {
    var checkForUID = localStorage.getItem('uid');

    if (checkForUID != null) {
        try {
            const response = await fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/drivers.json`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            for (const driversID in data) {
                if (data.hasOwnProperty(driversID)) {
                    const driverDetails = data[driversID];

                    if (driverDetails.driverName === driverName) {
                        await putDataToInputs(driverDetails.driverName, driverDetails.phoneNumber, driversID)

                        // Pass driver details to searchForOrdersForDriver
                        searchForOrdersForDriver(driversID);
                    }
                }
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Handle the error here
        }
    }
}


async function checkIfSearchByID(driverID) {
    try {
        const response = await fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/drivers/${driverID}.json`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data !== null) {
            await putDataToInputs(data.driverName, data.phoneNumber, driverID)

            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

async function searchDriver() {
    var searchFor = document.getElementById("driverSearch").value;

    if (searchFor != "") {
        const ordersTableBody = document.getElementById('ordersTableBody');

        while (ordersTableBody.firstChild) {
            ordersTableBody.removeChild(ordersTableBody.firstChild);
        }

        driverInfoForm.style.display = "none";

        var checkForID = await checkIfSearchByID(searchFor);

        if (checkForID === false) {
            checkIfSearchByName(searchFor);
        }
        else {
            searchForOrdersForDriver(searchFor)
        }
    }
}

function updateDriverData() {
    const driverNameInput = document.getElementById('driverName');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const driverID = document.getElementById('driverID');

    if (driverNameInput.value !== "" && phoneNumberInput.value !== "") {

        fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/drivers/${driverID.value}.json`)
            .then(response => response.json())
            .then(existingData => {
                existingData.driverName = driverNameInput.value;
                existingData.phoneNumber = phoneNumberInput.value;

                return fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/drivers/${driverID.value}.json`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(existingData)
                });
            })
            .then(response => response.json())
            .then(data => {
                console.log("Driver updated with success", data);
            })
            .catch(error => {
                console.error("Error updating driver:", error);
            });
    }
}

async function searchAWB() {
    const awbSearch = document.getElementById('awbSearch');

    document.getElementById('orderDetailsForm').style.display = "none";

    if (awbSearch.value != "") {
        try {
            const response = await fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/orders/${awbSearch.value}.json`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data !== null) {
                await populateFormFields(data);
            }
        }
        catch {

        }
    }
}

async function populateFormFields(data) {
    document.getElementById('orderDetailsForm').style.display = "block";

    document.getElementById('expeditorName').value = await searchForUserName(data.uid);
    document.getElementById('name').value = data.receiverName || "";
    document.getElementById('countyRegion').value = data.county || "";
    document.getElementById('zipCode').value = data.zipCode || "";
    document.getElementById('address').value = data.address || "";
    document.getElementById('phoneNumber').value = data.phone || "";
    document.getElementById('status').value = data.status || "";
    document.getElementById('height').value = data.height || "";
    document.getElementById('width').value = data.width || "";
    document.getElementById('length').value = data.length || "";
    document.getElementById('weight').value = data.weight || "";
    document.getElementById('price').value = data.price || "";
    document.getElementById('observations').value = data.observations || "";

    // Update Fragile radio buttons based on data
    const fragileYesRadio = document.getElementById('fragileYes');
    const fragileNoRadio = document.getElementById('fragileNo');
    if (data.fragile === "Yes") {
        fragileYesRadio.checked = true;
        fragileNoRadio.checked = false;
    } else {
        fragileYesRadio.checked = false;
        fragileNoRadio.checked = true;
    }
}

function updateOrderData() {
    const expeditorNameInput = document.getElementById('expeditorName');
    const nameInput = document.getElementById('name');
    const countyRegionInput = document.getElementById('countyRegion');
    const zipCodeInput = document.getElementById('zipCode');
    const addressInput = document.getElementById('address');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const statusInput = document.getElementById('status');
    const heightInput = document.getElementById('height');
    const widthInput = document.getElementById('width');
    const lengthInput = document.getElementById('length');
    const weightInput = document.getElementById('weight');
    const priceInput = document.getElementById('price');
    const fragileYesRadio = document.getElementById('fragileYes');
    const awbSearch = document.getElementById('awbSearch');
    const observationsInput = document.getElementById('observations');

    // Assuming the Fragile radio button group has an id of 'fragileYes' and 'fragileNo'
    const fragileInput = fragileYesRadio.checked ? fragileYesRadio.value : 'No';

    if (expeditorNameInput.value !== "" && nameInput.value !== "" && countyRegionInput.value !== "" &&
        zipCodeInput.value !== "" && addressInput.value !== "" && phoneNumberInput.value !== "" &&
        statusInput.value !== "" && heightInput.value !== "" && widthInput.value !== "" &&
        lengthInput.value !== "" && weightInput.value !== "" && priceInput.value !== "" &&
        observationsInput.value !== "") {

        fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/orders/${awbSearch.value}.json`)
            .then(response => response.json())
            .then(existingData => {
                const orderData = {
                    ...existingData, // Include existing data
                    receiverName: nameInput.value,
                    county: countyRegionInput.value,
                    zipCode: zipCodeInput.value,
                    address: addressInput.value,
                    phone: phoneNumberInput.value,
                    status: statusInput.value,
                    height: heightInput.value,
                    width: widthInput.value,
                    length: lengthInput.value,
                    weight: weightInput.value,
                    price: priceInput.value,
                    fragile: fragileInput,
                    observations: observationsInput.value,
                };

                return fetch(`https://packy-f3a62-default-rtdb.europe-west1.firebasedatabase.app/orders/${awbSearch.value}.json`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderData)
                });
            })
            .then(response => response.json())
            .then(data => {
                console.log("Order updated with success", data);
            })
            .catch(error => {
                console.error("Error updating order:", error);
            });
    }
}