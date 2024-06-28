(function () {
    "use strict";

    // This is used to make Ajax requests to a surface controller that returns HTML which is then appended to a specific element.
    // Add the request to the Array and then they are sent on load.

    // requests is an array of the element to be dynamically updated and the URL of the endpoint that returns the HTML to render.
    // You can add data attributes to the element and these are automatically parsed and passed in the querystring of the request URL.

    // If you need to update HTML of multiple elements then append target to the request eg. target: document.getElementsByClassName("js-latest-jobs") and this will update all those elements.
    // You can also add a callback to the request eg. callback: doSomething() which will then execute the function doSomething() after the request has finished.

    const culture = document.getElementsByTagName("html")[0].getAttribute("lang"); // gets current culture

    const requests = [
        { elem: document.getElementById("js-recently-viewed-jobs"), url: "/umbraco/jobboard/CandidateJobs/GetRecentJobs" },
        { elem: document.getElementById("js-latest-jobs-list"), url: "/umbraco/jobboard/LatestJobs/GetJobs" },
        { elem: document.getElementById("js-recommended-jobs"), url: "/umbraco/jobboard/LatestJobs/GetJobs" }
    ]

    // Sends the HTTP request
    const sendHttpRequest = function (method, url) {
        const promise = new Promise(function (resolve) {
            const xhr = new XMLHttpRequest();

            xhr.open(method, url);
            xhr.setRequestHeader("x-ph", "internal");

            xhr.onload = function () {
                resolve(xhr.response);
            };

            xhr.send();
        });

        return promise;
    };

    // gets the data attributes from an element and returns them as a querystring
    function getDataAttributesAsQueryString(elem) {

        if (!elem) {
            return "";
        }

        let params = new URLSearchParams();

        params.append("culture", culture); // adds culture

        if (elem.dataset.length === 0) {
            return params.toString();
        }

        Object.keys(elem.dataset).forEach(function (key) {
            params.append(key, elem.dataset[key]);
        });

        return params.toString();
    }

    // Displays an element that was hidden
    function revealElement(elem) {
        if (elem) {
            elem.removeAttribute("hidden");
            elem.classList.remove("d-none");
            elem.style.display = "block";
        }
    }

    // On document load trigger the requests
    window.addEventListener('load', function () {

        requests.forEach(function (request) {

            if (request.elem) {

                const query = getDataAttributesAsQueryString(request.elem);

                if (query.length > 0) {
                    request.url += "?" + query;
                }

                const elements = request.target || request.elem; // checks if there is a target

                if (elements) {

                    sendHttpRequest("GET", request.url).then(function (responseHTML) {

                        if (elements && responseHTML && responseHTML.trim().length > 0) {

                            if (elements.length) {
                                elements.forEach(function (element) {
                                    element.innerHTML += responseHTML;
                                    revealElement(element.parentNode);
                                });
                            }
                            else {
                                elements.innerHTML += responseHTML;
                                revealElement(elements.parentNode);
                            }

                            if (request.callback) {
                                callback;
                            }
                        }
                    });
                }
            }
        });
    });

})();