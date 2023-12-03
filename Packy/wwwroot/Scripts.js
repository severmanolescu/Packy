var isAuthenticated = false;
var uid = "";

function checkForAuthenticatedMainMenu() {
    var newOrderNavItem = document.getElementById("newOrderNavItem");
    checkForStorage();

    if (isAuthenticated === true) {
        newOrderNavItem.style.display = "block";
    } else {
        newOrderNavItem.style.display = "none";
    }
}

function checkForStorage() {
    var checkForAuthenntificated = localStorage.getItem('isAuthenticated');
    var checkForDarkMode = localStorage.getItem('darkMode');
    var checkForUID = localStorage.getItem('uid');

    if (checkForAuthenntificated != null) {
        if (checkForAuthenntificated == "true") {
            isAuthenticated = true;
        }
        else {
            isAuthenticated = false;
        }
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

function checkForAuthenticatedSecondMenu() {
    var login = document.getElementById("login");
    var signUp = document.getElementById("signUp");
    var userInfo = document.getElementById("userInfo");
    var logout = document.getElementById("logout");
    var orders = document.getElementById("orders");

    if (isAuthenticated === true) {
        login.style.display = "none";
        signUp.style.display = "none";
        userInfo.style.display = "block";
        logout.style.display = "block";
        orders.style.display = "block";
    } else {
        login.style.display = "block";
        signUp.style.display = "block";
        userInfo.style.display = "none";
        logout.style.display = "none";
        orders.style.display = "none";
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

            window.location.href = "/Home/Index";
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
            status: "Placed"
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

                        addRow(orderId, orderDetails.receiverName, orderDetails.status);
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