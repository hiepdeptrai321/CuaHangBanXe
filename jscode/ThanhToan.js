function renderOrderSummary(shippingCost = 0) {
    const orderItemsContainer = document.getElementById("orderItemsContainer");
    if (!orderItemsContainer) {
        console.error("Phần tử orderItemsContainer không tồn tại trong DOM.");
        return;
    }

    const orderSubtotal = document.getElementById("orderSubtotal");
    const orderShipping = document.getElementById("orderShipping");
    const orderTax = document.getElementById("orderTax");
    const orderTotalInclTax = document.getElementById("orderTotalInclTax");
    const orderTotalExclTax = document.getElementById("orderTotalExclTax");

    // Xóa nội dung cũ
    orderItemsContainer.innerHTML = "";

    // Kiểm tra nếu giỏ hàng trống
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length === 0) {
        orderItemsContainer.innerHTML = "<p>Cart is empty</p>";
        orderSubtotal.textContent = "€0.00";
        orderShipping.textContent = "Not yet calculated";
        orderTax.textContent = "€0.00";
        orderTotalInclTax.textContent = "€0.00";
        orderTotalExclTax.textContent = "€0.00";
        return;
    }

    // Hiển thị từng sản phẩm trong Order Summary
    cartItems.forEach(item => {
        const itemHTML = `
            <div class="d-flex justify-content-between">
                <span>${item.name}</span>
                <span>Qty: ${item.qty}</span>
            </div>
        `;
        orderItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    // Tính toán các giá trị
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.2; // Thuế 20%
    const totalInclTax = subtotal + shippingCost + tax;
    const totalExclTax = subtotal + shippingCost;

    // Cập nhật các giá trị vào HTML
    orderSubtotal.textContent = `€${subtotal.toFixed(2)}`;
    orderShipping.textContent = `€${shippingCost.toFixed(2)}`;
    orderTax.textContent = `€${tax.toFixed(2)}`;
    orderTotalInclTax.textContent = `€${totalInclTax.toFixed(2)}`;
    orderTotalExclTax.textContent = `€${totalExclTax.toFixed(2)}`;
}
document.addEventListener("DOMContentLoaded", function () {
    // Lắng nghe sự kiện thay đổi phương thức vận chuyển
    const shippingMethods = document.querySelectorAll("input[name='shippingMethod']");
    shippingMethods.forEach(method => {
        method.addEventListener("change", function () {
            let shippingCost = 0;

            // Lấy giá trị chi phí vận chuyển dựa trên phương thức được chọn
            if (this.id === "dpd") {
                shippingCost = 9.08; // Giá trị cho DPD
            } else if (this.id === "dhl") {
                shippingCost = 22.39; // Giá trị cho DHL
            }

            // Cập nhật Order Summary
            renderOrderSummary(shippingCost);
        });
    });

    // Gọi hàm hiển thị Order Summary khi trang load
    renderOrderSummary();
});