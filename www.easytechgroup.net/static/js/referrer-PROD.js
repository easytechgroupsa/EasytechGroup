(function () {
    "use strict";

    /**
    *  Referrer tracking script (pure JS)
    *  Checks if the current address bar URL contains any of the query string params in sources array
    *  If it does it stores these in local session storage
    *  It then checks if any of the links on the current page contain any of the domains in the domains array whitelist
    *  If it does it appends the referrer query string parameters back to it
    *  You can also now optionally set a default value for a source if non provided
    *  Should work with IE11
    */

    const sources = [{ "source": "CWS-13082" }, { "utm_source": null }, { "utm_medium": null }, { "utm_campaign": null }, { "utm_term": null }, { "utm_content": null }]; // the query string referrer params to track with optional default value

    const domains = ["pages.beamery.com", "flows.beamery.com", ".taleo.net"] // the domains to apply the tracked referrers to

    const sessionKey = "ph.hd.referrers"; // key used for storing params in session

    const beameryCode = "CWS-13061"; // key used from beamery that we're looking to add

    const debugMode = false;

    // Gets the query string parameters cross browser
    function getUrlParam(name) {

        if (typeof URLSearchParams === "function") {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }
        else {
            const results = new RegExp('[\?&]' + name + '=([^&#]*)')
                .exec(window.location.search);

            return (results !== null) ? results[1] || 0 : false;
        }
    }

    // gets the current parameters stored as JSON in session storage and deserialises them to a hash array
    function getReferrerMap() {

        const data = sessionStorage.getItem(sessionKey);
        let map;

        if (data) {
            map = JSON.parse(data);
        }
        else {
            map = {};
        }

        debugLog(map, "Get Map");

        return map;
    };

    // stores the current hash map array as JSON in session storage
    function storeReferrerMap(map) {
        const json = JSON.stringify(map);
        sessionStorage.setItem(sessionKey, json);

        debugLog(json, "Store Map");
    };

    // gets the query params and checks if they match a desired source.
    // if so, it is added to an array hash map and then serialised and stored in session
    function trackReferrers(map) {

        let storeMap = false;

        for (let i = 0; i < sources.length; i++) {

            const source = sources[i];
            let param = getUrlParam(Object.keys(source));

            debugLog(source, "Source");
            debugLog(param, "Param");

            if (param) {

                if (Object.keys(source)[0] === "source" && param === "BeameryCRM") {
                    param = beameryCode;
                    debugLog(param, "Source param found here AND param is BeameryCRM");
                }

                map[Object.keys(source)] = param;
                storeMap = true;
                debugLog(param, "Storing source value");

            }
            else if (!map[Object.keys(source)] && Object.values(source).length > 0) {
                const defaultValue = Object.values(source)[0];
                if (defaultValue) {
                    map[Object.keys(source)] = defaultValue;
                    storeMap = true;
                    debugLog(defaultValue, "storing source default");
                }
            }
        }

        if (storeMap) {
            storeReferrerMap(map);
        }
    };

    // gets the current stored referrs and then iterates over all external a href links in page
    // if the domain should have tracking then the query string is appended to the URLs for those domains
    function appendReferrersToUrls(map) {

        if (Object.keys(map).length <= 0) {
            return;
        }

        let qs = "";
        let first = 0;

        for (let key in map) {
            qs += (first++ == 0 ? "" : "&") + key + "=" + encodeURIComponent(map[key]);

            if (key === "source") {
                qs += "&src=" + encodeURIComponent(map[key]);
            }
        }

        if (qs.length > 0) {
            appendToDomains(qs);
        }
    };

    // appends the query string to all domains in the whitelist
    function appendToDomains(qs) {

        const links = document.querySelectorAll("a[href^='http']");

        links.forEach(function (element) {

            const href = element.getAttribute("href");

            for (let i = 0; i < domains.length; i++) {
                if (href.indexOf(domains[i]) > -1) {

                    if (href.indexOf('?') > -1) {
                        element.setAttribute("href", href + "&" + qs);
                    }
                    else {
                        element.setAttribute("href", href + "?" + qs);
                    }

                    debugLog(href, "Appending");
                }
            }
        });
    }

    // Debugging
    function debugLog(data, title) {
        if (debugMode && data) {
            if (title) {
                console.log(title, data);
            } else {
                console.log(data);
            }
        }
    }

    // the fun starts here
    const map = getReferrerMap();

    trackReferrers(map);

    appendReferrersToUrls(map);

})();