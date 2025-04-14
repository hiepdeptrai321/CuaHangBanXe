$(document).ready(function() {
    $(".dropdown-content a").click(function (e) {
        e.preventDefault(); 
        const selectedValue = $(this).data("value");
        localStorage.setItem("selectedCategory", selectedValue);
        window.location.href = "DanhSachSanPham.html";
    });
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
    $('#addToCartButton').on('click', function () {
        // Sử dụng thông tin từ selectedProduct
        if (!selectedProduct) {
            console.error("Không tìm thấy sản phẩm được chọn");
            return;
        }
        
        let name = selectedProduct.name;
        let price = parseFloat(selectedProduct.price);
        let quantity = parseInt($('#quantity').val()) || 1;
        
        // Lấy giỏ hàng hiện tại từ localStorage (nếu chưa có thì trả về mảng rỗng)
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa (so sánh theo tên, đã chuẩn hóa)
        let index = cartItems.findIndex(item => item.name.trim().toLowerCase() === name.toLowerCase());
        if (index !== -1) {
            cartItems[index].qty += quantity;
        } else {
            cartItems.push({ name, price, qty: quantity });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Cập nhật lại giao diện giỏ hàng
        updateCartUI();
    });
    // Cập nhật giao diện giỏ hàng
    function updateCartUI() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let cartList = $('#cartItemsContainer');
        let subtotal = 0;
        let totalItems = 0;
        let totalCartItems=0;
    
        cartList.empty();
    
        cartItems.forEach(item => {
            subtotal += item.price * item.qty;
            totalItems += item.qty;
            totalCartItems += 1;
    
            const cartItemHTML = `
                <div class="cart-item">
                    <span>${item.name}</span><br>
                    <span>€${item.price.toFixed(2)} x ${item.qty}</span>
                    <button class="btn btn-sm btn-secondary decrement-item" data-name="${item.name}">–</button>
                    <button class="btn btn-sm btn-danger remove-item" data-name="${item.name}">×</button>
                </div>
            `;
            cartList.append(cartItemHTML);
        });
    
        // Gắn sự kiện click trực tiếp sau khi render
        $('.remove-item').off('click').on('click', function () {
            let itemName = $(this).data('name');
            console.log("Remove button clicked for:", itemName);
        
            // Hiển thị hộp thoại xác nhận
            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${itemName}" khỏi giỏ hàng?`)) {
                removeItemFromCart(itemName); // Gọi hàm xóa sản phẩm nếu người dùng xác nhận
            } else {
                console.log("Hủy xóa sản phẩm:", itemName);
            }
        });
    
        $('.decrement-item').off('click').on('click', function () {
            let itemName = $(this).data('name');
            console.log("Decrement button clicked for:", itemName);
            decrementItemQuantity(itemName);
        });
    
        // Cập nhật subtotal và số lượng
        $('#cartSubtotal').text(`€${subtotal.toFixed(2)}`);
        $('#cartCount').text(totalCartItems);
        $('#cartItemCount').text(totalItems);
    }
    function decrementItemQuantity(itemName) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const index = cartItems.findIndex(item => item.name.trim().toLowerCase() === itemName.trim().toLowerCase());
        if (index > -1) {
            if (cartItems[index].qty > 1) {
                cartItems[index].qty -= 1;
                console.log("Giảm số lượng, qty mới:", cartItems[index].qty);
            } else {
                cartItems.splice(index, 1);
                console.log("Xóa sản phẩm khỏi giỏ hàng vì số lượng bằng 1.");
            }
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartUI();
    }
    function removeItemFromCart(itemName) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const index = cartItems.findIndex(item => item.name.trim().toLowerCase() === itemName.trim().toLowerCase());
        if (index > -1) {
            cartItems.splice(index, 1);
            console.log("Item removed:", itemName);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartUI();
    }

    // Toggle hiển thị giỏ hàng khi click icon
    $('#cartIcon').click(function (e) {
        e.stopPropagation();
        $('#cartPopup').toggle();
        updateCartUI();
    });

    // Ẩn giỏ hàng khi click ra ngoài
    $(document).click(function () {
        $('#cartPopup').hide();
    });

    // Ngăn sự kiện tắt giỏ khi click vào bên trong popup
    $('#cartPopup').click(function (e) {
        e.stopPropagation();
    });

    // Tải lại UI khi load trang
    updateCartUI();

    // // Lắng nghe sự kiện click trên tất cả các liên kết
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            // Kiểm tra nếu href không phải là "#" và không trống
            if (href && href !== "#") {
                event.preventDefault(); // Ngăn chặn hành động mặc định
                startLoadingBar(() => {
                    document.body.classList.add("fade-out"); // Thêm hiệu ứng fade-out
                    setTimeout(() => {
                        window.location.href = href; // Chuyển hướng sau khi fade-out hoàn tất
                    }, 200); // Thời gian khớp với CSS transition
                });
            }
        });
    });
    // Hàm điều khiển thanh tải
    function startLoadingBar(callback) {
        const loadingBar = document.getElementById("loading-bar");
        loadingBar.style.width = "0%"; // Đặt lại về 0%
        loadingBar.style.transition = "none"; // Loại bỏ hiệu ứng để reset
        setTimeout(() => {
            loadingBar.style.transition = "width 1s ease-out"; // Thêm lại hiệu ứng với thời gian 1 giây
            loadingBar.style.width = "100%"; // Tăng chiều rộng lên 100%
        }, 10);

        // Lắng nghe sự kiện khi hiệu ứng kết thúc
        loadingBar.addEventListener("transitionend", function handleTransitionEnd() {
            loadingBar.removeEventListener("transitionend", handleTransitionEnd); // Xóa sự kiện để tránh lặp lại
            if (typeof callback === "function") {
                callback(); // Gọi hàm callback sau khi hiệu ứng hoàn tất
            }
        });
    }

    //Load giao diện đăng nhập
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // cập nhật giao diện
        $('.navsignin').html(`
        <li>Welcome, ${loggedInUser.firstName} ${loggedInUser.lastName}</li>
        <li><a href="../html/LienHe.html">CONTACT US</a></li>
        <li><a href="#" id="logoutBtn">LOG OUT</a></li>
        `);

        $('#logoutBtn').on('click', function () {
        localStorage.removeItem('loggedInUser'); 
        location.reload(); 
        });
    } else {
        // chưa đăng nhập
        $('.navsignin').html(`
        <li><a href="../html/DangNhap.html">SIGN IN</a></li>
        <li><a href="../html/LienHe.html">CONTACT US</a></li>
        <li><a href="../html/DangKy.html">CREATE AN ACCOUNT</a></li>
        `);
    }
});