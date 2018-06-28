let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiZ29sZGVucmFwaHRpIiwiYSI6ImNqZDVzaGQ3dzFsYnAycW9xN25oa2VodmgifQ.AO002okeRrHyFgAhph-VMA',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    console.log(self.restaurant);
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    
    // Creation of the image, responsive and alt attribute
    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute('alt',`photo of restaurant ${restaurant.name}, ${restaurant.cuisine_type} food`);
    
//    const image = `<picture>
//                    <source
//                        srcset="https://picsum.photos/500/333?image=1060 1x , https://picsum.photos/1000/666?image=1060 2x">
//                    <img src="https://picsum.photos/250/166?image=1060" alt="Illustration of CoffeeTimer App">
//                </picture>`;
   
//   Creation of a cuisine type label, with icons and color depending of the cuisine type
    const cuisineTypeLabel = document.createElement('div');
    cuisineTypeLabel.setAttribute('id','cuisineTypeLabel');
    const restaurantContainer = document.getElementById('restaurant-container');
    var sp2 = document.getElementById('restaurant-address');
    restaurantContainer.insertBefore(cuisineTypeLabel, sp2);
    
//    Creation of the icon to insert in the label. The icon depends of the type of cuisine
    const iconCuisine = document.createElement('img');
    iconCuisine.setAttribute('id','iconCuisine');
    iconCuisine.setAttribute('alt','');
    if(restaurant.cuisine_type === 'Asian') {
        iconCuisine.setAttribute('src','../img/icons/asian-food.svg');
    } else if(restaurant.cuisine_type === 'American') {
        iconCuisine.setAttribute('src','../img/icons/bbq.svg');
    } else if(restaurant.cuisine_type === 'Pizza') {
        iconCuisine.setAttribute('src','../img/icons/pizza.svg');
    } else if(restaurant.cuisine_type === 'Mexican') {
        iconCuisine.setAttribute('src','../img/icons/mexican-tacos.svg');
    } 
    
    cuisineTypeLabel.appendChild(iconCuisine);

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;
    cuisineTypeLabel.appendChild(cuisine);

    // fill operating hours
    if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
    const li = document.createElement('li');
    const reviewHeader = document.createElement('div');
    reviewHeader.setAttribute('class','reviewHeader');
    li.appendChild(reviewHeader);

    const name = document.createElement('p');
    name.setAttribute('class','name');
    name.innerHTML = review.name;
    reviewHeader.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    reviewHeader.appendChild(date);


    const reviewBody = document.createElement('div');
    reviewBody.setAttribute('class','reviewBody');
    li.appendChild(reviewBody);

    const reviewRating = document.createElement('div');
    reviewRating.setAttribute('class','reviewRating');
    reviewBody.appendChild(reviewRating);
    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    reviewRating.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    reviewBody.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
