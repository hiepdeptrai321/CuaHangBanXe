$(document).ready(function() {
    $('#plus-btn').click(function() {
        let val = parseInt($('#quantity').val()) || 1;
        $('#quantity').val(val + 1);
    });

    $('#minus-btn').click(function() {
        let val = parseInt($('#quantity').val()) || 1;
        if (val > 1) {
        $('#quantity').val(val - 1);
        }
    });
    // Khi carousel slide, update highlight thumbnail
    $('#productCarousel').on('slide.bs.carousel', function (e) {
        const index = $(e.relatedTarget).index();
        $('.thumbnail-img').removeClass('border border-dark active');
        $('.thumbnail-img').eq(index).addClass('border border-dark active');
    });

    // Khi click vào thumbnail, active highlight
    $('.thumbnail-img').on('click', function () {
        $('.thumbnail-img').removeClass('border border-dark active');
        $(this).addClass('border border-dark active');
    });

    // Lấy id sản phẩm và mảng sản phẩm từ localStorage
    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

    if (selectedProduct) {
        // Cập nhật thông tin sản phẩm
        $(".itemtitle").text(selectedProduct.name);
        $("#manufacturer").text(selectedProduct.manufacturer);
        $("#brand").text(selectedProduct.brand);
        $("#price").html(
            "€" + selectedProduct.price.toFixed(2) +
            "<br> <small class='text-muted'>(Excl. Tax: <b>€" +
            selectedProduct.tax.toFixed(2) +
            "</b>)</small>"
        );
        $(".product-condition").text(selectedProduct.condition);
        $(".product-warranty").text(selectedProduct.warranty);
        $(".product-detail-type").text(selectedProduct.details.type);
        $(".product-detail-description").text(selectedProduct.details.description);
        $(".product-detail-model").text(selectedProduct.details.model);
        $(".product-detail-engine").text(selectedProduct.details.engine);
        $(".product-detail-year").text(selectedProduct.details.year);
        
        // Cập nhật thông tin detail
        if (selectedProduct.details) {
            const details = selectedProduct.details;
            const detailTable = $("#detailTable");
            detailTable.empty(); // Xóa nội dung cũ nếu có

            // Duyệt qua các key-value trong details và thêm vào bảng
        
            Object.keys(details).forEach(key => {
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1); // Viết hoa chữ cái đầu
                detailTable.append(`
                    <tr>
                        <th class="fw-bold">${formattedKey}</th>
                        <td>${details[key]}</td>
                    </tr>
                `);
            });
        }
        // Cập nhật thông tin thay thế (replacing)
        if (Array.isArray(selectedProduct.replacing) && selectedProduct.replacing.length > 0) {
            const replacingData = selectedProduct.replacing;
            const replacingTable = $("#replacingTable");
            replacingTable.empty(); // Xóa nội dung cũ nếu có

            // Duyệt qua các phần tử trong mảng replacing và thêm vào bảng
            replacingData.forEach(item => {
                replacingTable.append(`
                    <tr>
                        <td>${item.brand}</td>
                        <td>${item.number}</td>
                    </tr>
                `);
            });
            $("#replacing-tab").show();
            $("#replacing").show();
        } 
        else {
            $("#replacing-tab").hide();
            $("#replacing").hide();
        }
        // Cập nhật phần hình ảnh
        const imageArray = selectedProduct.image;
        if (Array.isArray(imageArray) && imageArray.length > 1) {
            // Nếu có nhiều ảnh thì cập nhật carousel slide và thumbnails
            let carouselInner = "";
            let thumbnails = "";
            imageArray.forEach((img, index) => {
                carouselInner += `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <img src="${img}" class="d-block w-100" alt="Image ${index + 1}">
                    </div>
                `;
                thumbnails += `
                    <img src="${img}" class="thumbnail-img ${index === 0 ? "border border-dark active" : ""}" 
                        style="width: 80px; cursor: pointer;" data-bs-target="#productCarousel" data-bs-slide-to="${index}">
                `;
            });
            $("div.carousel-inner").html(carouselInner);
            $("#thumbnails").html(thumbnails);
        } else if (Array.isArray(imageArray) && imageArray.length === 1) {
            // Nếu chỉ có 1 ảnh thì hiển thị ảnh cố định, có thể ẩn phần thumbnails nếu cần
            const img = imageArray[0];
            const carouselInner = `
                <div class="carousel-item active">
                    <img src="${img}" class="d-block w-100" alt="Image">
                </div>
            `;
            $("div.carousel-inner").html(carouselInner);
            $("#thumbnails").html("");
        } else {
            // Trường hợp còn lại, để ảnh mặc định
            $("div.carousel-inner .carousel-item.active img").attr("src", "../img/placeholder.jpg");
        }
    }
});