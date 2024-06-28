'use strict';

function scrollAnimation(selector, options = {}){
    let els = document.querySelectorAll(selector);
    els = Array.from(els);
    els.forEach(el => {
        addObserver(el, options)
    })
}

function addObserver(el, options){
    if(!('IntersectionObserver' in window)){
        if(options.cb){
            options.cb(el)
        }
        return
    }
    let observer = new IntersectionObserver((entries, observer) => { //this takes a callback function which receives two arguments: the elemts list and the observer instance
        entries.forEach(entry => {
            if(entry.isIntersecting){
                if(options.cb){
                    options.cb(el)
                }else{
                    entry.target.classList.add('js-animate')
                }
                observer.unobserve(entry.target)
            }
        })
    }, options)
    observer.observe(el)
}

// Example usages:
scrollAnimation('.fade-in-up');
scrollAnimation('.fade-in-down');
scrollAnimation('.fade-in-left');
scrollAnimation('.fade-in-right');
scrollAnimation('.fade-in');
scrollAnimation('.scale-in');
scrollAnimation('.card-timeline');
scrollAnimation('.swiper-carousel-half-width');
scrollAnimation('.blog-listing .card');
scrollAnimation('.accordion');
scrollAnimation('.section-jobs .job-listing');
scrollAnimation('#results .job-listing');
scrollAnimation('#js-job-list.job-listing');


//Stagger the animations
window.addEventListener('DOMContentLoaded', (event) => {
    //Set delay
    const transitionDelay = 0.2; // Change this value to the desired duration in seconds
    
    //
    // Common Staggering
    //
    //Half Width Carousels
    //Blog Listing (Block and Page)
    //Section Features
    //Pages List
    const featuresSections = document.querySelectorAll('.section-features, .section-pages-list, .swiper-carousel-half-width, .blog-listing');
    featuresSections.forEach((section) => {
        //.card
        const cards = section.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * transitionDelay}s`;
        });
    });

    //
    // Individual Staggering Styles
    //
    //Accordion Items
    const accordionSections = document.querySelectorAll('.accordion');
    accordionSections.forEach((section) => {
        //.card
        const cards = section.querySelectorAll('.accordion-item, .card');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * transitionDelay}s`;
        });
    });
    //Section Icons
    const IconSections = document.querySelectorAll('.section-icons');
    IconSections.forEach((section) => {
        //.card
        const cards = section.querySelectorAll('.card-image');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * transitionDelay}s`;
        });
    });
    //Job cards in job-section content blocks
    const jobsections = document.querySelectorAll('.section-jobs:not(.js-latest-jobs) .job-listing, #results .job-listing');
    jobsections.forEach((jobsection) => {
        //.card
        const cards = jobsection.querySelectorAll('.card');
        cards.forEach((card, index) => {
            if (index === 0) {
                card.style.transitionDelay = `0.5s`;
            } else {
                card.style.transitionDelay = `${(index * transitionDelay) + 0.5}s`;
            }
        });
    });
    //Job cards in AJAX loaded latest jobs section
    // MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Check if the added node has the desired type and class
            Array.from(mutation.addedNodes)
                .filter(node => node.nodeType === 1 && node.classList.contains('card-job'))
                .forEach((node, index) => {
                    if (index === 0) {
                        node.style.transitionDelay = `0.5s`;
                    } else {
                        node.style.transitionDelay = `${(index * transitionDelay) + 0.5}s`;
                    }
                });
        });
    });   
    // Start observing changes in the jobs wrapper
    const ajaxJobs = document.getElementById('js-latest-jobs-list');
    if (ajaxJobs) { 
        observer.observe(ajaxJobs, { childList: true, subtree: true });
    }

//END
});