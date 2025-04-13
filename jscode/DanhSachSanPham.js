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
  
$(document).ready(function () {
    let productCategory = localStorage.getItem("selectedCategory");
    const categoryToFileMap = {
        "Air Conditioning Compressor": "Aircondition_Product",
        "Door Handle": "BodyParts_DoorHandle_Product",
        "Vacuumpump": "Vacuumpump_BrakeSystem_Product"
    };

    // Gán fileName dựa trên productCategory, nếu không khớp thì fileName là null
    let fileName = categoryToFileMap[productCategory] || null;

    // Biến cục bộ để lưu dữ liệu JSON hiện tại
    let currentData = [];

    $.getJSON(`../data/${fileName}.json`, function (data) {
        currentData = data; // Lưu dữ liệu JSON vào biến cục bộ

        // Áp dụng số lượng hiển thị ngay khi dữ liệu được tải
        const initialShowCount = parseInt($("#showCount").val());
        const initialLimitedProducts = currentData.slice(0, initialShowCount);
        renderProducts(initialLimitedProducts);

        // Xử lý click vào sản phẩm
        $('#product-list').on('click', '.product-card', function () {
          const productId = $(this).data('id');
          const selectedProduct = currentData.find(product => product.id === productId); 
          if (selectedProduct) {
              localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
              window.location.href = 'ChiTietSanPham.html';
          } else {
              console.error('Sản phẩm không tìm thấy!');
          }
        });

        // Xử lý hiệu ứng hover
        $('#product-list').on('mouseenter', '.product-card', function () {
            $(this).css('box-shadow', '0 4px 8px rgba(0,0,0,0.2)');
            $(this).find('.card-img-container img').css('transform', 'translateY(-10px)');
        });
        $('#product-list').on('mouseleave', '.product-card', function () {
            $(this).css('box-shadow', 'none');
            $(this).find('.card-img-container img').css('transform', 'translateY(0)');
        });

        // Sắp xếp danh sách sản phẩm
        $("#sortSelect").change(function () {
            const sortBy = $(this).val();
            let sortedProducts = [...currentData]; // Tạo bản sao của dữ liệu hiện tại
            if (sortBy === "Product Name") {
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === "Price (Low to High)") {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sortBy === "Price (High to Low)") {
                sortedProducts.sort((a, b) => b.price - a.price);
            }
            const showCount = parseInt($("#showCount").val());
            const limitedProducts = sortedProducts.slice(0, showCount);
            renderProducts(limitedProducts);
        });

        // Thay đổi số lượng hiển thị
        $("#showCount").change(function () {
            const showCount = parseInt($(this).val());
            const limitedProducts = currentData.slice(0, showCount);
            renderProducts(limitedProducts);
        });
    });

    const filterFileMap = {
        "Air Conditioning Compressor": "../data/filter_AirCondition.json",
        "Door Handle": "../data/filter_BodyParts.json",
        "Vacuumpump": "../data/filter_Vacuumpump.json"
    };

    // Gán fileName dựa trên productCategory
    let filterFile = filterFileMap[productCategory] || null;
    // Load bộ lọc manufacturer và car brand từ file JSON
    if (filterFile) {
        $.getJSON(filterFile, function (filterData) {
            // Xóa bộ lọc cũ
            $("#filters").empty();

            // Thêm bộ lọc Manufacturer
            if (filterData.manufacturers && filterData.manufacturers.length > 0) {
                $("#filters").append('<h5>Manufacturer</h5>');
                filterData.manufacturers.forEach(manufacturer => {
                    $("#filters").append(`
                        <div class="form-check">
                            <input class="form-check-input filter-checkbox" type="radio" name="manufacturer" value="${manufacturer}" id="${manufacturer}" data-filter="manufacturer">
                            <label class="form-check-label" for="${manufacturer}">${manufacturer}</label>
                        </div>
                    `);
                });
            }

            // Thêm bộ lọc Car Brand
            if (filterData.brands && filterData.brands.length > 0) {
                $("#filters").append('<hr><h5>Car Brand</h5>');
                filterData.brands.forEach(brand => {
                    $("#filters").append(`
                        <div class="form-check">
                            <input class="form-check-input filter-checkbox" type="radio" name="brand" value="${brand}" id="${brand}" data-filter="carbrand">
                            <label class="form-check-label" for="${brand}">${brand}</label>
                        </div>
                    `);
                });
            }
        });
    }
    // Xử lý sự kiện thay đổi bộ lọc
    $("#filters").on("change", ".filter-checkbox", function () {
      const selectedManufacturer = $("input[name='manufacturer']:checked").val();
      const selectedCarBrand = $("input[name='brand']:checked").val();

      // Lọc sản phẩm dựa trên manufacturer và car brand
      const filteredProducts = currentData.filter(product => {
          const matchesManufacturer = !selectedManufacturer || product.manufacturer === selectedManufacturer;
          const matchesCarBrand = !selectedCarBrand || product.brand === selectedCarBrand;
          return matchesManufacturer && matchesCarBrand;
      });

      // Hiển thị sản phẩm đã lọc
      const showCount = parseInt($("#showCount").val());
      const limitedProducts = filteredProducts.slice(0, showCount);
      renderProducts(limitedProducts);
  });

  // Thay đổi số lượng hiển thị
  $("#showCount").change(function () {
      const showCount = parseInt($(this).val());
      const selectedManufacturer = $("input[name='manufacturer']:checked").val();
      const selectedCarBrand = $("input[name='brand']:checked").val();

      // Lọc sản phẩm dựa trên manufacturer và car brand
      const filteredProducts = currentData.filter(product => {
          const matchesManufacturer = !selectedManufacturer || product.manufacturer === selectedManufacturer;
          const matchesCarBrand = !selectedCarBrand || product.brand === selectedCarBrand;
          return matchesManufacturer && matchesCarBrand;
      });

      const limitedProducts = filteredProducts.slice(0, showCount);
      renderProducts(limitedProducts);
  });
});