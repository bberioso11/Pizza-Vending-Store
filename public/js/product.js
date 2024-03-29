const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const productStocks = document.querySelector(".stocks").innerText;
$("input[name='quantity']").TouchSpin({
  min: 1,
  max: productStocks,
  step: 1,
  // decimals: 2,
  boostat: 5,
  maxboostedstep: 1,
  // postfix: '%',
  buttondown_class: "btn btn-secondary",
  buttonup_class: "btn btn-secondary",
});

const buttons = document.querySelectorAll("#addtocart, #buynow");

const addCart = async (productID, quantity) => {
  const api = await fetch("/api/addtocart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productID: productID,
      quantity: quantity,
    }),
  });

  const response = await api.json();
  return response;
};

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const productID = document.querySelector("#productID").value;
    const quantity = document.querySelector("#quantity").value;
    const cart = await addCart(productID, quantity);
    if (cart.isSuccess) {
      Toast.fire({
        icon: "success",
        title: cart.message,
      });
    } else {
      Toast.fire({
        icon: "error",
        title: cart.message,
      });
    }
  });
});
