const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

$("input[name='quantity']").TouchSpin({
  min: 1,
  max: 99,
  step: 1,
  // decimals: 2,
  boostat: 5,
  maxboostedstep: 1,
  // postfix: '%',
  buttondown_class: "btn btn-secondary",
  buttonup_class: "btn btn-secondary",
});

const addtocart = document.querySelector("#addtocart");

addtocart.addEventListener("click", async () => {
  const productID = document.querySelector("#productID").value;
  const quantity = document.querySelector("#quantity").value;

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
  if (response.isSuccess) {
    Toast.fire({
      icon: "success",
      title: response.message,
    });
  } else {
    Toast.fire({
      icon: "error",
      title: response.message,
    });
  }
});
