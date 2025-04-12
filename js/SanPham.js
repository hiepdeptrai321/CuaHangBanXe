
const products = [
  {
    id: 1,
    name: "ABS 9678416280 PSA",
    price: 199.99,
    tax: 165.28,
    image: "img/product1.jpg",
    brand: "PSA",
    manufacturer: "Bosch",
  },
  {
    id: 2,
    name: "ABS Controller Toyota 5WK8460 Ate",
    price: 99.98,
    tax: 82.63,
    image: "../img/i1_CoolantPump/media-catalog-product-a-2-a2542001300i.jpg",
    brand: "Toyota",
    manufacturer: "Ate",
  },
  // Add more products
];

function renderProducts(productArray) {
  const container = $("#product-list");
  container.empty();
  productArray.forEach(product => {
    container.append(`
      <div class="col-md-4 mb-4">
        <div class="card h-100 product-card" data-id="${product.id}">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h6 class="card-title">${product.name}</h6>
            <p class="card-text fw-bold">€${product.price.toFixed(2)}</p>
            <p class="text-muted">Excl. Tax: €${product.tax.toFixed(2)}</p>
            <button class="btn btn-outline-primary view-detail">Xem chi tiết</button>
          </div>
        </div>
      </div>
    `);
  });
}

$(document).ready(function() {
  renderProducts(products);

  // Xử lý click xem chi tiết
  $('#product-list').on('click', '.view-detail', function() {
    const productId = $(this).closest('.product-card').data('id');
    localStorage.setItem('selectedProductId', productId);
    localStorage.setItem('products', JSON.stringify(products));
    window.location.href = 'product-detail.html';
  });
});
