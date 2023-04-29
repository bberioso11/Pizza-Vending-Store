const Modal = new bootstrap.Modal("#details");
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const viewProduct = () => {
  const btnsEdit = document.querySelectorAll("tbody .btn-edit");

  btnsEdit.forEach((btnEdit) => {
    btnEdit.addEventListener("click", async () => {
      const tableRow = btnEdit.closest("tr");
      const productID = tableRow.querySelectorAll("td")[0].innerText;
      const api = await fetch(`/admin/api/view-product/${productID}`, {
        method: "GET",
      });
      const res = await api.json();

      document.querySelector(".modal-title").innerText = `Details: ${res.name}`;
      document.querySelector("#productName").value = res.name;
      document.querySelector("#productID").value = res.id;
      document.querySelector("#productPrice").value = res.price;
      document.querySelector("#productQuantity").value = res.quantity;
      Modal.toggle();
    });
  });
};

const saveProduct = () => {
  const btnSave = document.querySelector("#save");

  btnSave.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const form = document.querySelector("#productForm");
      const formdata = new FormData(form);

      const api = await fetch("/admin/api/save-product", {
        method: "POST",
        body: formdata,
      });
      const res = await api.json();

      if (res.isSuccess) {
        Toast.fire({
          icon: "success",
          title: res.message,
        });
        dt.ajax.reload();
        Modal.toggle();
      }
    } catch (err) {
      console.log(err);
    }
  });
};
saveProduct();

const dt = $("#product-list").DataTable({
  ajax: {
    url: "/admin/api/inventory",
    dataSrc: "",
  },
  columns: [
    { data: "id", className: "d-none" },
    {
      data: null,
      render: (data, type) => {
        return `<div class="d-flex justify-content-left align-items-center">
                              <div class="avatar  me-3">
                                  <img src="/product-images/${data.image}" alt="Avatar" width="64"
                                      height="64">
                              </div>
                              <div class="d-flex flex-column">
                                  <span class="text-truncate fw-bold">${data.name}</span>
                              </div>
                          </div>`;
      },
    },
    { data: "quantity" },
    {
      data: "price",
      render: (data) => {
        return `₱${data}`;
      },
    },
    {
      data: null,
      render: (data, type) => {
        return `<button class="btn btn-info btn-edit" href="javascript:void(0);" >View</button>`;
      },
      createdCell: (td) => {
        $(td).addClass("text-center");
      },
    },
  ],
  drawCallback: () => {
    viewProduct();
  },
  dom:
    "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3'f>>>" +
    "<'table-responsive'tr>" +
    "<'dt--bottom-section d-sm-flex justify-content-sm-between text-center'<'dt--pages-count  mb-sm-0 mb-3'i><'dt--pagination'p>>",
  oLanguage: {
    oPaginate: {
      sPrevious:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
      sNext:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    },
    sInfo: "Showing page _PAGE_ of _PAGES_",
    sSearch:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    sSearchPlaceholder: "Search...",
    sLengthMenu: "Results :  _MENU_",
  },
  stripeClasses: [],
  lengthMenu: [7, 10, 20, 50],
  pageLength: 10,
});
