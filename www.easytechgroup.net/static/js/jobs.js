(function () {
    "use strict";
    /**
    *  Saves jobs to a candidate's cookie via Ph.Modules/JobBoard/Controllers/SavedJobsApiController
    **/

    const debugMode = false; // to enable console debugging

    const apiBaseUrl = "/JobsApi/";

    const savedJobCountElement = document.getElementById("js-saved-job-count");
    const savedJobCountPageElement = document.getElementById("js-saved-job-page-count");
    const noSavedJobsElement = document.getElementById("js-no-saved-jobs");
    const savedJobsElement = document.getElementById("js-saved-jobs");
    const btnRemoveAllJobs = document.getElementById("btn-remove-all-jobs");
    const externalApplyButton = document.getElementById("js-apply-external");

    const addJobClass = "btn-add-job";
    const removeJobClass = "btn-remove-job";
    const deleteJobClass = "btn-delete-job";

    const hideCss = "d-none";
    const showCss = "d-block";

    // Hides an element
    const hide = function (el) {
        if (el) {
            el.classList.remove(showCss);
            el.classList.add(hideCss);
            el.setAttribute("hidden", "hidden");
        }
    }

    // Shows an element
    const show = function (el) {
        if (el) {
            el.classList.remove(hideCss);
            el.classList.add(showCss);
            el.removeAttribute("hidden");
        }
    }

    // Registers an on-click handler for elements with the css class that calls function func
    const registerClickHandlerForClass = function (css, func) {
        const elems = document.getElementsByClassName(css);

        if (elems.length > 0) {
            for (let i = 0; i < elems.length; i++) {
                elems[i].addEventListener('click', func, false);
            }
        }
    }

    // Gets the job elem closest to the passed elem
    const getClosestJobElem = function (elem) {
        return elem.closest(".js-job");
    };

    // Gets the job Id and title from the data attribute
    const getClosestJobId = function (elem) {
        const closestJob = getClosestJobElem(elem);

        if (closestJob) {
            return {
                "id": closestJob.getAttribute("data-id"),
                "title": closestJob.getAttribute("data-jobtitle")
            }
        }

        return null;
    };

    // Gets a promise which returns a list of saved jobs from the server
    const getSavedJobIdsPromise = function () {

        return new Promise(function (fulfill, reject) {
            const getJobsApiUrl = apiBaseUrl + "GetSavedJobs";
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', getJobsApiUrl, true);

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        const obj = JSON.parse(xmlhttp.responseText);
                        fulfill(obj);
                    }
                }
                else {
                    reject();
                }
            };

            xmlhttp.send();
        });
    };

    // Displays the saved job count from the server
    const displaySavedJobCount = function () {
        getSavedJobIdsPromise().then(function (jobs) {
            displayJobCount(jobs.length);
        });
    };

    // displays the passed job count number in the placeholder
    const displayJobCount = function (savedJobCount) {

        if (savedJobCountElement) {
            savedJobCountElement.innerText = savedJobCount;
        }

        if (savedJobCountPageElement) {
            savedJobCountPageElement.innerText = savedJobCount;
        }

        if (savedJobCount > 0) {
            hide(noSavedJobsElement);
            show(savedJobsElement);
            show(btnRemoveAllJobs);
        }
        else {
            show(noSavedJobsElement);
            hide(savedJobsElement);
            hide(btnRemoveAllJobs);
        }

        debugLog(savedJobCount, "Saved Job Count");
    };

    const configurePostRequest = function (name) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', apiBaseUrl + name, true);
        debugLog(apiBaseUrl + name);
        xhr.setRequestHeader("x-ph", "internal");
        return xhr;
    }

    // Saves a job by Id to the list of saved jobs
    const saveJobId = function (id, callback) {

        const xhr = configurePostRequest("SaveJob");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const data = xhr.responseText;
                displayJobCount(data);
                if (callback) {
                    callback(data);
                }
            }
        }

        const formData = new FormData();
        formData.append("id", id);
        xhr.send(formData);

        debugLog(id, "Save Job");
    };

    // Removes a job by Id from the list of saved jobs
    const removeJobId = function (id, callback) {

        const xhr = configurePostRequest("RemoveJob");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const data = xhr.responseText;
                displayJobCount(data);
                if (callback) {
                    callback(data);
                }
            }
        }

        const formData = new FormData();
        formData.append("id", id);
        xhr.send(formData);

        debugLog(id, "Remove Job");
    };

    // Adds the job from the clicked button element
    const addJob = function (elem) {

        const data = getClosestJobId(elem);

        if (data === null) {
            console.log("Could not get job Id when btn-add-job clicked!");
            return;
        }

        saveJobId(data.id);
        hide(elem);
        show(elem.nextElementSibling);

        dataLayerPush("job_save", data);

        debugLog(data, "Add Job");
    }

    // Adds the job associated with this button to the saved jobs list
    const addJobButtonClick = function (e) {
        e.stopPropagation();
        e.preventDefault();

        addJob(this);
    };

    // Registers add job the click handlers
    registerClickHandlerForClass(addJobClass, addJobButtonClick);

    // Removes the job
    const removeJob = function (elem) {
        const data = getClosestJobId(elem);

        if (data === null) {
            console.log("Could not get job Id when btn-add-job clicked!");
            return;
        }

        removeJobId(data.id);
        hide(elem);
        show(elem.previousElementSibling);

        dataLayerPush("job_unsave", data);

        debugLog(data, "Remove Job");
    };

    // Handles the remove job button click
    const removeJobButtonClick = function (e) {
        e.stopPropagation();
        e.preventDefault();

        removeJob(this);
    }

    // Registers the remove job click handlers
    registerClickHandlerForClass(removeJobClass, removeJobButtonClick);

    // Deletes a job from the saved jobs list page
    const deleteJobButtonClick = function (e) {
        e.stopPropagation();
        e.preventDefault();

        const job = getClosestJobElem(this);

        if (!job) {
            console.log("Could not get job when btn-remove-job clicked!");
            return;
        }

        const data = getClosestJobId(this);

        dataLayerPush("job_unsave", data);

        removeJobId(data.id, function (cnt) {
            if (cnt > 0) {
                hide(noSavedJobsElement);
            }
            else {
                show(savedJobsElement);
            }

            job.remove();
        });

        debugLog(data, "Delete Job");
    };

    // Registers the delete button clicks
    registerClickHandlerForClass(deleteJobClass, deleteJobButtonClick);

    // Deletes ALL jobs from the saved jobs list
    const deleteAllJobs = function () {

        const xhr = configurePostRequest("RemoveAllJobs");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                hide(document.getElementById("js-job-list"));
                displayJobCount(0);
            }
        }

        xhr.send();

        debugLog("Remove All Jobs");

        const removedCount = document.querySelectorAll('#js-job-list .js-job').length;

        dataLayerPush("job_remove_all", null, removedCount);
    };

    // Registers the delete all jobs button click
    if (btnRemoveAllJobs) {
        btnRemoveAllJobs.addEventListener('click', deleteAllJobs);
    }

    // Handles updating jobs which are dynamically added via AJAX, so we need to register the click event on the parent and then get the element that was clicked
    const containers = document.getElementsByClassName("js-live-job-results");

    if (containers) {
        addEventListener('click', function (e) {
            const button = e.target.closest("button");

            if (button) {
                if (button.classList.contains(addJobClass)) {
                    addJob(button);
                }
                else if (button.classList.contains(removeJobClass)) {
                    removeJob(button);
                }
            }

        }, false);
    }

    // GTM DataLayer

    function dataLayerPush(eventName, data, count) {
        if (typeof dataLayer !== 'undefined' && dataLayer) {

            const culture = document.getElementsByTagName("html")[0].getAttribute("lang");

            let model = {
                'culture': culture
            };

            if (data) {
                model['job_title'] = data.title;
                model['job_id'] = data.id;
            }

            if (count) {
                model['total_jobs'] = count;
            }

            dataLayer.push({
                'event': eventName,
                'event_model': model
            });

            debugLog(model, eventName);
        };
    }

    // Event Tracking

    if (externalApplyButton) {
        externalApplyButton.addEventListener('click', function () {

            const jobElem = document.getElementsByClassName("js-job")[0];

            console.log(jobElem);

            if (jobElem) {
                const jobId = jobElem.getAttribute("data-id")

                if (jobId) {
                    trackExternalApply(jobId);
                };
            };

        }, false);
    }

    function trackExternalApply(id) {

        const xhr = configurePostRequest("TrackApply");

        const formData = new FormData();
        formData.append("id", id);
        xhr.send(formData);

        debugLog(id, "Track Apply");
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

})();