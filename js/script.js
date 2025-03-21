const imagesContainer = document.getElementById('images-container');
     const jsonUrl = 'https://raw.githubusercontent.com/MACBRUH-OFC/freefire-resources/main/data/itemData.json';

     fetch(jsonUrl)
         .then(response => response.json())
         .then(data => {
             data.forEach(item => {
                 const imageUrl = `https://raw.githubusercontent.com/MACBRUH-OFC/freefire-resources/main/images/${item.itemID}.png`;
                 const imageElement = document.createElement('div');
                 imageElement.className = 'image';
                 imageElement.innerHTML = `
                     <img src="${imageUrl}" alt="${item.description}" width="100" height="100">
                     <p>${item.description}</p>
                 `;
                 imagesContainer.appendChild(imageElement);
             });
         })
         .catch(error => console.error('Error fetching data:', error));
