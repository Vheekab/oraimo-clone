let slideshowIndex = 0


function showSlideshow() {
    let slideshowDiv = document.getElementsByClassName('slideshow')
    for (i = 0; i < slideshowDiv.length; i++) {
        slideshowDiv[i].style.display = "none";
    }

    slideshowIndex++;
    if (slideshowIndex > slideshowDiv.length) {slideshowIndex = 1}

    slideshowDiv[slideshowIndex - 1].style.display = "block"
    setTimeout(showSlideshow, 4000);
}

showSlideshow()

let toggleProducts = document.getElementById("products-toggle")

function showToggle() {
    toggleProducts.style.display = "block"
}

function hideToggle() {
    toggleProducts.style.display = "none"
}

let showDrop1 = document.getElementById("footer-dropdown1")
let showDrop2 = document.getElementById("footer-dropdown2")
let showDrop3 = document.getElementById("footer-dropdown3")
let showDrop4 = document.getElementById("footer-dropdown4")

function showDropdown1() {
    if (showDrop1.style.display === "none") {
        showDrop1.style.display = "block"
    }

    else {
        showDrop1.style.display = "none"
    }
}

function showDropdown2() {
    if (showDrop2.style.display === "none") {
        showDrop2.style.display = "block"
    }

    else {
        showDrop2.style.display = "none"
    }
}

function showDropdown3() {
    if (showDrop3.style.display === "none") {
        showDrop3.style.display = "block"
    }

    else {
        showDrop3.style.display = "none"
    }
}

function showDropdown4() {
    if (showDrop4.style.display === "none") {
        showDrop4.style.display = "block"
    }

    else {
        showDrop4.style.display = "none"
    }
}

let hiddenMenu = document.getElementById('hidden-menu')

function hamburgerMenu() {
    if (hiddenMenu.style.display === "none") {
        hiddenMenu.style.display = "block"
    }

    else {
        hiddenMenu.style.display = "none"
    }    
}



const swipeProductsGrid = document.querySelector("#products-grid");
const firstImg = swipeProductsGrid.querySelectorAll(".products-arrivals-child")[0];
const arrowIcon = document.querySelectorAll(".arrow-icon");


let firstImgWidth = firstImg.clientWidth

arrowIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        swipeProductsGrid.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    })
})