function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    const page = document.getElementById(pageId);
    page.style.display = 'block';

    if (pageId === "main") { // Only re-initialize for the 'main' tab
        console.log("Reinitializing favourite buttons");
        initializeFavouriteButtons(); // Re-add event listeners for favourite buttons
    }
}

function initializeFavouriteButtons() {
    const favouriteButtons = document.querySelectorAll(".favouriteButton");

    favouriteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const itemBox = this.closest(".box");
            const title = itemBox.querySelector(".title").textContent;
            const price = itemBox.querySelector(".price").textContent;
            const imageSrc = itemBox.querySelector("img").src;

            const itemData = { title, price, imageSrc };

            if (button.classList.contains("selected")) {
                button.classList.remove("selected");
                favouriteItems = favouriteItems.filter(item => item.title !== title);
            } else {
                button.classList.add("selected");
                favouriteItems.push(itemData);
            }

            localStorage.setItem("favourites", JSON.stringify(favouriteItems));
            updateFavouritesDisplay();
        });
    });
}


document.addEventListener("DOMContentLoaded", function () {

    // Add listeners once DOM is fully loaded
    initializeFavouriteButtons(); // Call the initialization function here
    restoreFavouriteButtonState();
    updateBasketDisplay();
    updateFavouritesDisplay();
});

let basket = JSON.parse(localStorage.getItem("basket")) || [];
let favouriteItems = JSON.parse(localStorage.getItem("favourites")) || [];

function addToBasket(itemName, itemPrice, itemImage) {
    let item = { name: itemName, price: itemPrice, image: itemImage };
    basket.push(item);
    localStorage.setItem("basket", JSON.stringify(basket));
    updateBasketDisplay();
}

function updateBasketDisplay() {
    let basketList = document.getElementById("basket-list");
    if (!basketList) return; // Stops the function if the basket list doesn't exist

    let totalPrice = 0;
    basketList.innerHTML = "";

    basket.forEach((item, index) => {
        let listItem = document.createElement("li");
        listItem.classList.add("basket-item");

        let itemImage = document.createElement("img");
        itemImage.src = item.image;
        itemImage.alt = item.name;
        itemImage.classList.add("basket-item-image");

        let itemInfo = document.createElement("div");
        itemInfo.innerHTML = `<strong>${item.name}</strong> - £${item.price}`;

        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-btn");
        removeButton.onclick = () => removeFromBasket(index);

        listItem.appendChild(itemImage);
        listItem.appendChild(itemInfo);
        listItem.appendChild(removeButton);
        basketList.appendChild(listItem);

        totalPrice += item.price;
    });

    document.getElementById("total-price").textContent = `£${totalPrice.toFixed(2)}`;
}


function removeFromBasket(index) {
    basket.splice(index, 1);
    localStorage.setItem("basket", JSON.stringify(basket));
    updateBasketDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-basket").forEach(button => {
        button.addEventListener("click", function () {
            let box = this.parentElement;
            let itemName = box.querySelector(".title").textContent;
            let itemPrice = parseFloat(box.querySelector(".price").textContent.replace("£", ""));
            let itemImage = box.querySelector("img").src;

            addToBasket(itemName, itemPrice, itemImage);
        });
    });

    updateBasketDisplay();
    updateFavouritesDisplay();
    restoreFavouriteButtonState();
});

// Checkout functionality
document.getElementById("checkout-btn").addEventListener("click", function() {
    document.getElementById("checkout-popup").style.display = "flex";
});

function closePopup() {
    document.getElementById("checkout-popup").style.display = "none";
}

document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    basket = [];
    localStorage.setItem("basket", JSON.stringify(basket));
    updateBasketDisplay();
    closePopup();
});

// Favourite functionality
document.addEventListener("DOMContentLoaded", function () {

    // Ensure we can access the favourite buttons
    const favouriteButtons = document.querySelectorAll(".favouriteButton");

    // Directly add event listeners without checking length
    favouriteButtons.forEach(button => {
        console.log("Adding event listener to favourite button");

        button.addEventListener("click", function () {
            const itemBox = this.closest(".box");
            const title = itemBox.querySelector(".title").textContent;
            const price = itemBox.querySelector(".price").textContent;
            const imageSrc = itemBox.querySelector("img").src;

            const itemData = { title, price, imageSrc };

            // Handle favourite selection/deselection
            if (button.classList.contains("selected")) {
                console.log(`Removing ${title} from favourites`);
                button.classList.remove("selected");
                favouriteItems = favouriteItems.filter(item => item.title !== title);
            } else {
                console.log(`Adding ${title} to favourites`);
                button.classList.add("selected");
                favouriteItems.push(itemData);
            }

            // Save to localStorage and update the favourites display
            localStorage.setItem("favourites", JSON.stringify(favouriteItems));
            updateFavouritesDisplay();
        });
    });

    restoreFavouriteButtonState();

    if (document.getElementById("basket-list")) {
        updateBasketDisplay();
    }

    updateFavouritesDisplay();
});








function updateFavouritesDisplay() {
    const favouritesContainer = document.getElementById("favouritesList");
    if (!favouritesContainer) return;

    favouritesContainer.innerHTML = "";

    favouriteItems.forEach(item => {
        const favouriteItem = document.createElement("div");
        favouriteItem.classList.add("favourite-item");

        favouriteItem.innerHTML = `
            <img src="${item.imageSrc}" alt="${item.title}" class="fav-img">
            <div class="fav-details">
                <span class="fav-title">${item.title}</span>
                <span class="fav-price">${item.price}</span>
            </div>
        `;
        favouritesContainer.appendChild(favouriteItem);
    });
}

function restoreFavouriteButtonState() {
    document.querySelectorAll(".favouriteButton").forEach(button => {
        const itemBox = button.closest(".box");
        const title = itemBox.querySelector(".title").textContent;

        if (favouriteItems.some(item => item.title === title)) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    });
}
