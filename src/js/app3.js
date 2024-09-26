let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    LoginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let LoginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () => {
    LoginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    LoginForm.classList.remove('active');
}

window.onscroll = () => {
    searchForm.classList.remove('active');
    LoginForm.classList.remove('active');
    navbar.classList.remove('active');
}

//products
var swiper = new Swiper(".product-slider", {
  loop:true,
  spaceBetween: 20,
  autoplay:{
      delay: 7500,
      disableOnInteraction: false,
  },
  centeredSlide: true,
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
});

//review
var swiper = new Swiper(".review-slider", {
  loop:true,
  spaceBetween: 20,
  autoplay:{
      delay: 7500,
      disableOnInteraction: false,
  },
  centeredSlide: true,
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
}); 

//search form
const accessKey = "1xsFfX5UL-dJ5qHfLEAKub93PG5lWHkNsTGeyO2eZZQ";
let searchform = document.querySelector('search-form');
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword ="";
let page = 1;

async function searchImages(){
  keyword = searchBox.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=2`;

  const response = await fetch(url);
  const data = await response.json();

  const results = data.results;

  results.map((result)=>{
    const image = document.createElement("img");
    image.src = result.urls.small;
    const imageLink = document.createElement("a");
    imageLink.href = result.links.html;
    imageLink.target = "_blank";

    imageLink.appendChild(image);
    searchResult.appendChild(imageLink);
  })


}

document.getElementById("search").addEventListener("click", (e) =>{
  e.preventDefault();
  page = 1;
  searchImages();
})

