$(document).ready(function () {
    $(".dropdown-content a").click(function (e) {
        e.preventDefault(); 
        const selectedValue = $(this).data("value");
        localStorage.setItem("selectedCategory", selectedValue);
        window.location.href = "DanhSachSanPham.html";
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