const API_KEY = 'wGGxakRQ';
const url = 'https://api.discountapi.com/v2/deals';

const btn_search = document.querySelector('#btn-search');
const search_text_box = document.querySelector('#search-text-box');
const main = document.querySelector('#main');
const loader = document.querySelector('.loader');
const filterWrapper = document.querySelector('.filterWrapper');
const container_data = document.querySelector('#container-data');
const wrapper = document.querySelector('.wrapper');
const btn_filter = document.querySelectorAll('.btn-filter');

const createElement = (element) => {
    return document.createElement(element);
};

const append = (parent, child) => {
    return parent.appendChild(child);
};

let deals = [];

const renderPage = (filteredBy) => {
    container_data.innerHTML = '';
    let new_deals = deals;

    if(filteredBy) {
        new_deals = deals.filter((deal) => deal.deal.discount_percentage > filteredBy);
    }

    let thead_el = createElement('thead');
    let tr_el = createElement('tr');
    tr_el.innerHTML = `<th class='row-name'>Shop Name</th><th class='row-desc'>Description</th><th class='row-offer'>Offer</th><th class='row-fine-print'>Fine Print</th>`
    append(thead_el, tr_el);

    let tbody_el = createElement('tbody');
    
    new_deals.forEach((deal) => {
        const dealDetails = deal.deal;

        tr_el = createElement('tr');
        
        let td_el = createElement('td');
        let text = document.createTextNode(dealDetails.title);
        append(td_el, text);
        append(tr_el, td_el);

        td_el = createElement('td');
        text = document.createTextNode(dealDetails.description);
        append(td_el, text);
        append(tr_el, td_el);

        td_el = createElement('td');
        let disc = dealDetails.discount_percentage * 100 + '%';
        text = document.createTextNode(disc);
        append(td_el, text);
        append(tr_el, td_el);

        td_el = createElement('td');
        text = document.createTextNode(dealDetails.fine_print);
        append(td_el, text);
        append(tr_el, td_el);

        append(tbody_el, tr_el);
    });

    append(container_data, thead_el);
    append(container_data, tbody_el);
    wrapper.classList.remove('hidden');
};

const getProducts = (param) => {
    return fetch(`${url}?api_key=${API_KEY}&query=${param}`)
        .then((data) => {
            return data.json();
        })
        .then((response) => {
            deals = response.deals;
            renderPage();
            btn_search.disabled = false;
            loader.classList.add('hidden');
            filterWrapper.classList.remove('hidden');
        });
}

btn_search.onclick = function() {
    btn_search.disabled = true;
    loader.classList.remove('hidden');
    filterWrapper.classList.add('hidden');
    main.classList.remove('main-consumer-background');
    console.log('search_text_box_value:', search_text_box.value);
    
    getProducts(search_text_box.value.toLowerCase());   
}

document.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn-filter')) {
        btn_filter.forEach((btn) => {
            btn.classList.remove('btn-filter-active');
        });
        e.target.classList.add('btn-filter-active');
        renderPage(e.target.value);
    }      
});

document.addEventListener('keypress', function (e) {
    if(e.which == 13)
        btn_search.click();
})