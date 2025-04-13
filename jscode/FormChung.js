$(document).ready(function () {
    // Lắng nghe sự kiện click trên các liên kết trong dropdown-content
    $(".dropdown-content a").click(function (e) {
        e.preventDefault();
        const selectedValue = $(this).data("value");
        localStorage.setItem("selectedCategory", selectedValue);
        startLoadingBar(() => {
            document.body.classList.add("fade-out"); // Thêm hiệu ứng fade-out
            setTimeout(() => {
                window.location.href = "DanhSachSanPham.html"; // Chuyển hướng sau khi fade-out hoàn tất
            }, 200); // Thời gian khớp với CSS transition
        });
    });

    // Lắng nghe sự kiện click trên tất cả các liên kết
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
    $("#searchbar").on("keydown", function (event) {
        const searchTerm = $(this).val().trim(); 
    
        // Kiểm tra nếu phím Enter được nhấn
        if (event.key === "Enter") {
            event.preventDefault(); // Ngăn chặn hành động mặc định (nếu cần)
    
            // Lưu productCategory là "All Products" vào localStorage
            localStorage.setItem("selectedCategory", "All Products");
    
            // Lưu nội dung tìm kiếm vào localStorage
            if (!searchTerm) {
                localStorage.removeItem("searchRegex");
                localStorage.removeItem("searchTerm");
            } else {
                const regex = new RegExp(searchTerm, "i");
                localStorage.setItem("searchRegex", regex.toString());
                localStorage.setItem("searchTerm", searchTerm); // Lưu nội dung tìm kiếm
            }
    
            // Chuyển hướng sang trang danh sách sản phẩm
            window.location.href = "DanhSachSanPham.html";
        }
    });
    $('#cartIcon').click(function (e) {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        $('#cartPopup').toggle(); // Hiển thị hoặc ẩn popup giỏ hàng
        renderCartUI(); // Cập nhật giao diện giỏ hàng
    });

    // Ẩn popup giỏ hàng khi click ra ngoài
    $(document).click(function () {
        $('#cartPopup').hide();
    });

    // Ngăn popup bị ẩn khi click vào bên trong popup
    $('#cartPopup').click(function (e) {
        e.stopPropagation();
    });

    // Hàm lấy dữ liệu giỏ hàng từ localStorage
    function getCartData() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let subtotal = 0;
        let totalItems = 0;

        cartItems.forEach(item => {
            subtotal += item.price * item.qty; // Tính tổng tiền
            totalItems += item.qty; // Tính tổng số lượng sản phẩm
        });

        return {
            cartItems,  // Danh sách sản phẩm
            subtotal,   // Tổng tiền
            totalItems  // Tổng số lượng sản phẩm
        };
    }

    // Hàm hiển thị giao diện giỏ hàng
    function renderCartUI() {
        const { cartItems, subtotal, totalItems } = getCartData();
        let cartList = $('#cartItemsContainer');
        cartList.empty();

        if (cartItems.length === 0) {
            cartList.append('<p>Giỏ hàng trống</p>');
        } else {
            cartItems.forEach(item => {
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
        }

        // Cập nhật subtotal và số lượng
        $('#cartSubtotal').text(`€${subtotal.toFixed(2)}`);
        $('#cartCount').text(totalItems);
        $('#cartItemCount').text(totalItems);

        // Gắn sự kiện cho các nút
        $('.remove-item').off('click').on('click', function () {
            let itemName = $(this).data('name');
            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${itemName}" khỏi giỏ hàng?`)) {
                removeItemFromCart(itemName);
            }
        });

        $('.decrement-item').off('click').on('click', function () {
            let itemName = $(this).data('name');
            decrementItemQuantity(itemName);
        });
    }

    // Hàm xóa sản phẩm khỏi giỏ hàng
    function removeItemFromCart(itemName) {
        let { cartItems } = getCartData();
        const index = cartItems.findIndex(item => item.name.trim().toLowerCase() === itemName.trim().toLowerCase());
        if (index > -1) {
            cartItems.splice(index, 1); // Xóa sản phẩm
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCartUI(); // Cập nhật giao diện
        }
    }

    // Hàm giảm số lượng sản phẩm
    function decrementItemQuantity(itemName) {
        let { cartItems } = getCartData();
        const index = cartItems.findIndex(item => item.name.trim().toLowerCase() === itemName.trim().toLowerCase());
        if (index > -1) {
            if (cartItems[index].qty > 1) {
                cartItems[index].qty -= 1; // Giảm số lượng
            } else {
                cartItems.splice(index, 1); // Xóa sản phẩm nếu số lượng bằng 1
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCartUI(); // Cập nhật giao diện
        }
    }

    // Gọi hàm để cập nhật giao diện khi trang load
    renderCartUI();
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