function filterShopifyEvent(event, domElement, callback) {
    let executeCallback = false;
    if (event.type.includes('shopify:section')) {
        if (domElement.hasAttribute('data-section-id') && domElement.getAttribute('data-section-id') === event.detail.sectionId) executeCallback = true
    } else if (event.type.includes('shopify:block') && event.target === domElement) { 
        executeCallback = true 
    }
    if (executeCallback) callback(event)
}

// is in viewport
function inViewport(elem, callback, options = {}) {
    return new IntersectionObserver(entries => {
        entries.forEach(entry => callback(entry))
    }, options).observe(document.querySelector(elem));
}

/* How to inViewport
document.addEventListener("DOMContentLoaded", () => {
    inViewport('[data-inviewport]', element => {
        if (!element.isIntersecting) { document.querySelector('#add2cart-cta').classList.add('active') } 
        else { document.querySelector('#add2cart-cta').classList.remove('active') }
    });
});
*/

// Toggle Body Class
    let toggleBodyClass = function(arg) {
        document.body.classList.toggle(arg);
    }
// Get Element Height
function getElementHeight(targetElement,appendTo,cssVar) {
    let element = document.querySelector(targetElement);

    if (element) {
        let elementHeight = element.offsetHeight;
        document.querySelector(appendTo).style.setProperty(cssVar, `${elementHeight}px`);
    }
}

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
const getSetVh = () => document.body.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
window.addEventListener("resize", getSetVh);

// Toggle
    let toggleClass = function(qSelectors, bodyClass) {   
        document.querySelectorAll(qSelectors).forEach(e => e.addEventListener('click', () => toggleBodyClass(bodyClass)))
    }
// Menu
    let toggleMenu = function() { 
        toggleClass('.fire-menu, .shrink-menu', 'open-menu')
    }

// Cart
    let toggleCart = function() {
        toggleClass('.carto, .cartc', 'open-cart');
        document.querySelector('.cartc')?.addEventListener('click', () => document.body.classList.remove('hideheader'))
    }
// Dropdown menu header
function dropdownMenu() {
    const detailsElements = document.querySelectorAll("details.lv1");

    function handleClickOnDetails() {
      // close all details
      let detailsOpened = document.querySelectorAll("details[open].lv1");
      for (const item of detailsOpened) { if (this != item) item.removeAttribute("open") }
    }

    detailsElements.forEach(function (item) {
      item.addEventListener("click", handleClickOnDetails);
    });
}

// Close <details> when you click outside
const details = [...document.querySelectorAll('details.closex')];
document.addEventListener('click', function(e) {
    if (!details.some(f => f.contains(e.target))) {
        details.forEach(f => f.removeAttribute('open'));
        a11yDetails();
    } else { 
        details.forEach(f => !f.contains(e.target) ? f.removeAttribute('open') : '');
        a11yDetails();
    } 
});

// Details summary a11y
function a11yDetails() {
    document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
        summary.setAttribute('role', 'button');
        summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));

        if(summary.nextElementSibling.getAttribute('id')) {
            summary.setAttribute('aria-controls', summary.nextElementSibling.id);
        }

        summary.addEventListener('click', (event) => {
            event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
        });
    });
}

// update button price on variant change 
function updatePrice(obj,idd) {
    var uid = obj.options[obj.selectedIndex].getAttribute('data-price');
    var pb = document.querySelector('.uprice'+idd);
    pb.innerHTML = uid;
}

function selectOptions(obj,idd) { updatePrice(obj,idd) }

// Debug
if (window.location.href.indexOf("debug") > -1) {
    var OpenThinking = OpenThinking || {}; OpenThinking.theme = { "name":"Bullet", "version":`${window.BOOMR.themeVersion}` };
    console.log(`${OpenThinking.theme.name} v${OpenThinking.theme.version}`);
}

// AJAX cart.js
// AJAX cart init can be located in theme.liquid
function ajaxCart(obj) {
    // Show loading feedback
    obj.classList.add('loading');

    // on cart request success
    $(document).ajaxSuccess(function(event, jqxhr, settings) {
        if (settings.url == '/cart/add.js' || settings.url == '/cart/change.js') {
            // on cart request complete (just in case)
            $(document).on('cart.requestComplete', function(event, cart) {
                // Update # of items in cart
                document.getElementById('counter').setAttribute('data-count', cart.item_count);
                // Open cart
                document.body.classList.add('open-cart');
                document.body.classList.add('hideheader');
                // Remove loading feedback
                obj.classList.remove('loading');
            });
        }
    });

    // on cart request error
    $(document).ajaxError(function(event, jqxhr, settings) {
        if (settings.url == '/cart/add.js' || settings.url == '/cart/change.js') {
            obj.classList.remove('loading'); // Remove loading feedback
            console.log(jqxhr.responseJSON);
            alert(jqxhr.responseJSON.description);
            event.stopImmediatePropagation();
        }
    });
}

// Update # of items in cart
document.addEventListener("cart.requestComplete", function(event) {
    const cart = event.detail;
    document.getElementById('counter').setAttribute('data-count', cart.item_count);
});

/*** init app */
function app() {
    getSetVh(); // get Viewport Height
    dropdownMenu(); // Dropdown menu
    toggleMenu(); // toggle Menu
    toggleCart(); // toggle Cart
    a11yDetails(); // a11y for details summary
}

/*** on DOM ready **/
document.addEventListener("DOMContentLoaded", () => { app() })

