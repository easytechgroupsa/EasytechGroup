(function () {
    "use strict";
    /**
    *  Used for populating dependent location select lists in job search from API controller (see Ph.Modules.JobsBoard.Controllers.LocationApiController)
    */
    window.addEventListener('DOMContentLoaded', function () {

        const countrySelect = document.getElementById("l-country");
        const regionSelect = document.getElementById("l-region");
        const locationSelect = document.getElementById("l-location");
        const culture = document.querySelector("html").getAttribute("lang");

        const apiBasePath = "/JobsApi/";

        // when country select list changes we update the region and location lists for that country

        if (countrySelect) {
            countrySelect.addEventListener("change", function () {
                const country = this.selectedOptions;

                populateSelectList(country, "GetRegionsForCountry/", regionSelect, culture);
                populateSelectList(country, "GetLocationsForCountry/", locationSelect, culture);

            }, false);
        }

        // when the region select list changes we update locations for that region (if reqion selected) otherwise we update locations for the selected country

        if (regionSelect) {
            regionSelect.addEventListener("change", function () {
                const region = this.selectedOptions;

                if (region.length > 0) {
                    populateSelectList(region, "GetLocationsForRegion/", locationSelect, culture);
                }
                else if (countrySelect) {
                    var country = countrySelect.selectedOptions;
                    populateSelectList(country, "GetLocationsForCountry/", locationSelect, culture);
                }
                else {
                    populateSelectList(region, "GetLocationsForRegion/", locationSelect, culture);
                }
            }, true);
        }

        // populates select list options

        function populateSelectList(locations, apiPath, selectList, culture) {

            const values = Array.from(locations).map(({ value }) => value);

            const data = {
                "Culture": culture,
                "Locations": values
            };

            fetch(apiBasePath + apiPath, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "x-ph": "internal"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then((options) => {
                    const instance = selectList.tomselect;

                    if (instance) {
                        instance.clearOptions();

                        options.forEach(function (opt) {
                            instance.addOption({
                                value: opt,
                                text: opt
                            });
                        });
                    }

                })
                .catch(error => console.error("Error updating locations: " + apiPath, error));
        };

    });

})();