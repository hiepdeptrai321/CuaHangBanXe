function renderProducts(productArray) {
    const container = $("#product-list");
    container.empty();
    productArray.forEach(product => {
      container.append(`
            <div class="col-md-4 mb-4 d-flex justify-content-center">
                <div class="card product-card" data-id="${product.id}" style="width: 300px; height: 450px; display: flex; flex-direction: column; cursor: pointer;">
                    <div class="card-img-container" style="height: 300px; display: flex; align-items: center; justify-content: center;">
                    <img src="${(product.image && product.image.length) ? product.image[0] : '../img/placeholder.jpg'}" 
                        class="card-img-top" alt="${product.name}" 
                        style="max-height: 100%; object-fit: cover; transition: transform 0.3s;">
                    </div>
                    <div class="card-body" style="height: 150px; display: flex; flex-direction: column; justify-content: space-between;">
                    <h6 class="card-title" style="height: 40px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.name}</h6>
                    <div>
                        <div class="card-text fw-bold" style="height: 30px; font-size:20px">€${product.price.toFixed(2)}</div>
                        <div class="text-muted" style="height: 20px;">Excl. Tax: €${product.tax.toFixed(2)}</div>
                    </div>
                    </div>
                </div>
            </div>
      `);
    });
}
  
$(document).ready(function() {
    let productCategory = localStorage.getItem("selectedCategory");
    // Sử dụng object để ánh xạ productCategory với fileName
    const categoryToFileMap = {
      "Air Conditioning Compressor": "Aircondition_Product",
      "Door Handle": "BodyParts_DoorHandle_Product",
      "Vacuumpump": "BrakeSystem_Vacuumpump_Product"
    };
    
    // Gán fileName dựa trên productCategory, nếu không khớp thì fileName là null
    let fileName = categoryToFileMap[productCategory] || null;

    
    $.getJSON(`../data/${fileName}.json`, function(data) {
        renderProducts(data);
        
        // Xử lý click xem chi tiết trên toàn bộ card
        $('#product-list').on('click', '.product-card', function() {
          const productId = $(this).data('id');
          localStorage.setItem('selectedProductId', productId);
          localStorage.setItem('products', JSON.stringify(data));
          window.location.href = 'ChiTietSanPham.html';
        });
        
        // Xử lý hiệu ứng hover: khi di chuột vào card, hình ảnh được đẩy lên và card được highlight
        $('#product-list').on('mouseenter', '.product-card', function() {
          $(this).css('box-shadow', '0 4px 8px rgba(0,0,0,0.2)');
          $(this).find('.card-img-container img').css('transform', 'translateY(-10px)');
        });
        
        $('#product-list').on('mouseleave', '.product-card', function() {
          $(this).css('box-shadow', 'none');
          $(this).find('.card-img-container img').css('transform', 'translateY(0)');
        });
    });
    
});
