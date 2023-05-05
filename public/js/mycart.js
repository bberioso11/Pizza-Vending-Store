$("input[name='quantity']").TouchSpin({
  min: 1,
  max: 99,
  step: 1,
  // decimals: 2,
  boostat: 5,
  maxboostedstep: 1,
  // postfix: '%',
  buttondown_class: "btn btn-primary btn-down",
  buttonup_class: "btn btn-primary btn-up",
});

const updateCart = async (productID, quantity) => {
  const api = await fetch(`/api/updatecart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productID: productID,
      quantity: quantity,
    }),
  });
};

const initUpdateCart = () => {
  const buttons = document.querySelectorAll(".btn-down, .btn-up");

  buttons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const parent = event.target.closest("tr");
      const productID = parent.querySelectorAll("td .productID")[0].value;
      const quantity = parent.querySelectorAll("td div>.quantity")[0].value;
      await updateCart(productID, quantity);
    });
  });
};

initUpdateCart();
