const URL = 'https://api.discountapi.com/v2/deals';
const API_KEY = 'wGGxakRQ';

const btn_search = document.querySelector('#btn-search');
const search_text_box = document.querySelector('#search-text-box');
const main = document.querySelector('#main');
const loader = document.querySelector('.loader');
const filter_wrapper = document.querySelector('.filter-wrapper');
const container_data = document.querySelector('#container-data');
const table_wrapper = document.querySelector('.table-wrapper');
const btn_filter = document.querySelectorAll('.btn-filter');

let products = [];

class Product {
    constructor(title, description, discount, fine_print) {
        this.title = title;
        this.description = description;
        this.discount = discount * 100 + '%';
        this.fine_print = fine_print;
    }

    generateHTML() {
        return `<td>${this.title}</td><td>${this.description}</td><td>${this.discount}</td><td>${this.fine_print}</td>`;
    }
}

async function getProducts (searchParam) {
    let data = await fetch(`${URL}?api_key=${API_KEY}&query=${searchParam}`);
    let response = await data.json();
    products = response.deals;
    return products;
}

const getProductsByFilter = ((filterValue) => {
    return products.filter((product) => product.deal.discount_percentage > filterValue);
});

const createElement = ((element) => {
    return document.createElement(element);
});

const append = ((parent, child) => {
    return parent.appendChild(child);
});

const loadingData = () => {
    btn_search.disabled = true;
    loader.classList.remove('hidden');
    filter_wrapper.classList.add('hidden');
    main.classList.remove('main-consumer-background');
    container_data.innerHTML = '';
}

const dataLoaded = () => {
    btn_search.disabled = false;
    loader.classList.add('hidden');
    filter_wrapper.classList.remove('hidden');
    table_wrapper.classList.remove('hidden');
}

const renderPage = (products) => {
    let thead_el = createElement('thead');
    let tr_el = createElement('tr');
    tr_el.innerHTML = `<th class='row-name'>Shop Name</th><th class='row-desc'>Description</th><th class='row-offer'>Offer</th><th class='row-fine-print'>Fine Print</th>`
    append(thead_el, tr_el);
    append(container_data, thead_el);

    let tbody_el = createElement('tbody');
    
    products.forEach((p) => {
        const product = new Product(p.deal.title, p.deal.description, p.deal.discount_percentage, p.deal.fine_print);
        tr_el = createElement('tr');
        tr_el.innerHTML = product.generateHTML();
        append(tbody_el, tr_el);
    });

    append(container_data, tbody_el);
};

btn_search.onclick = function() {
    loadingData();

    getProducts(search_text_box.value.toLowerCase())
        .then((products) => {
            renderPage(products);
            dataLoaded();
        });
}

document.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn-filter')) {
        btn_filter.forEach((btn) => {
            btn.classList.remove('btn-filter-active');
        });
        e.target.classList.add('btn-filter-active');

        const newProducts = getProductsByFilter(e.target.value);

        loadingData();

        renderPage(newProducts);
        dataLoaded();
    }      
});

document.addEventListener('keypress', function (e) {
    if(e.which == 13)
        btn_search.click();
});