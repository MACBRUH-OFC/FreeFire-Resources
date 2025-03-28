document.addEventListener('DOMContentLoaded', function() {

    const itemsContainer = document.getElementById('items-container');

    const searchInput = document.getElementById('searchInput');

    const searchBtn = document.getElementById('searchBtn');

    const filterBtns = document.querySelectorAll('.filter-btn');

    

    let allItems = [];

    let filteredItems = [];

    

    // Fetch item data

    fetch('data/itemData.json')

        .then(response => response.json())

        .then(data => {

            allItems = data;

            filteredItems = [...allItems];

            renderItems(filteredItems);

        })

        .catch(error => console.error('Error loading data:', error));

    

    // Render items to the page

    function renderItems(items) {

        itemsContainer.innerHTML = '';

        

        items.forEach(item => {

            const commonPath = `assets/images/${item.itemID}.png`;

            const rarePath = `assets/Rare/${item.itemID}.png`;

            

            const itemCard = document.createElement('div');

            itemCard.className = 'item-card';

            itemCard.dataset.rarity = item.rarity || 'common';

            

            itemCard.innerHTML = `

                <img 

                    src="${commonPath}" 

                    onerror="this.src='${rarePath}'" 

                    alt="${item.name || item.itemID}" 

                    class="item-img"

                >

                <div class="item-name">${item.name || item.itemID}</div>

                <div class="item-desc">${item.description || ''}</div>

            `;

            

            itemsContainer.appendChild(itemCard);

        });

    }

    

    // Search functionality

    function handleSearch() {

        const searchTerm = searchInput.value.toLowerCase();

        filteredItems = allItems.filter(item => 

            (item.name && item.name.toLowerCase().includes(searchTerm)) ||

            (item.description && item.description.toLowerCase().includes(searchTerm)) ||

            item.itemID.toLowerCase().includes(searchTerm)

        );

        renderItems(filteredItems);

    }

    

    // Filter functionality

    function handleFilter(filter) {

        filterBtns.forEach(btn => btn.classList.remove('active'));

        event.target.classList.add('active');

        

        if (filter === 'all') {

            filteredItems = [...allItems];

        } else {

            filteredItems = allItems.filter(item => 

                (filter === 'rare') ? 

                (item.rarity === 'rare') : 

                (!item.rarity || item.rarity === 'common')

            );

        }

        renderItems(filteredItems);

    }

    

    // Event listeners

    searchBtn.addEventListener('click', handleSearch);

    searchInput.addEventListener('keyup', (e) => {

        if (e.key === 'Enter') handleSearch();

    });

    

    filterBtns.forEach(btn => {

        btn.addEventListener('click', () => handleFilter(btn.dataset.filter));

    });

});