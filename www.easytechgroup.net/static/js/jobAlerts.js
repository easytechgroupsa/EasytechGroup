(function () {
    "use strict";
    /**
    *  Used to sign-up a user to job alerts
    **/

    const alertForm = document.getElementById("jobalert-form");

    if (!alertForm) {
        return;
    }

    // Creates a subscription request by posting form values as JSON to an endpoint
    function submitSubscription() {

        const modal = bootstrap.Modal.getInstance(document.getElementById("jobalert-modal"));
        modal.hide();

        const formData = {
            "Email": document.getElementById("alert-email").value.trim(),
            "Culture": document.getElementById("alert-culture").value.trim(),
            "Query": document.getElementById("alert-query").value.trim()
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', "/JobAlertsApi/SignUp", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader("x-ph", "internal");

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {

                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    displayMessage(response);
                    insertUrlParam('alert', true);

                    var holder = document.getElementById("jobalert-holder");
                    if (holder) {
                        holder.style.display = "none";
                    }

                    dataLayerPush("Job Alert Subscribe", "job_alert_subscribe", formData.Culture);
                }
                else {
                    console.error(xhr);
                    displayMessage({ "Success": false, "Message": "Sorry, an error occurred submitting your request: " + xhr.status });
                }
            }
        }

        xhr.send(JSON.stringify(formData));
    };

    // Displays an alert message
    function displayMessage(response) {
        const alertMessage = document.getElementById("jobalert-message");

        alertMessage.innerHTML = response.message;
        alertMessage.classList.add(response.success ? "alert-success" : "alert-danger");
        alertMessage.style.display = "block";
    }

    // Adds a parameter to querystring without reloading
    function insertUrlParam(key, value) {
        if (history.pushState && typeof URLSearchParams === "function") {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set(key, value);
            const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
            window.history.pushState({ path: newurl }, '', newurl);
        }
    }

    // Adds a listener to intercept form submissions
    alertForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitSubscription();
    });

    // GTM DataLayer
    function dataLayerPush(name, id, culture) {
        if (typeof dataLayer !== 'undefined' && dataLayer) {

            if (name) {
                const json = {
                    'event': "form_success",
                    'event_model': {
                        'form_name': name,
                        'form_id': id,
                        'culture': culture
                    }
                };

                dataLayer.push(json);
            }
        };
    }

})();