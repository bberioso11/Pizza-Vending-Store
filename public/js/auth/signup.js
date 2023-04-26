const form = document.querySelector("#signupForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
  } else {
    const formdata = new FormData(form);
    try {
      const api = await fetch("/authsignup", {
        method: "POST",
        body: formdata,
      });
      const response = await api.json();
      if (response.isSuccess) {
        Swal.fire({
          icon: "success",
          title: response.message,
          confirmButtonText: "Ok",
          allowOutsideClick: () => (window.location.href = "/login"),
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: response.message,
        });
        form.reset();
        form.classList.remove("was-validated");
      }
    } catch (err) {
      console.log(err);
    }
  }
});
