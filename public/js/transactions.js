const transactionStatus = window.location.pathname.split("/").pop();
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

document.querySelector(".breadcrumb-item.active").innerText =
  transactionStatus.charAt(0).toUpperCase() + transactionStatus.slice(1);

const dt = $("#transactions-list").DataTable({
  processing: true,
  serverSide: true,
  ajax: {
    url: `/api/transactions-table/${transactionStatus}`,
    dataSrc: "data",
  },
  columns: [
    {
      data: null,
      render: (data) => {
        return `${data.transaction_id}`;
      },
    },
    {
      data: "total_price",
      render: (data) => {
        return `<span>₱${data}</span>`;
      },
    },
    {
      data: null,
      render: (data) => {
        const date = new Date(data.purchase_date);
        const formattedDate = date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        return formattedDate;
      },
    },
    {
      data: null,
      orderable: false,
      render: (data) => {
        return `
                    <a class="badge badge-light-primary text-start me-2" href="/invoice/${data.transaction_id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>`;
      },
      createdCell: (td) => {
        $(td).addClass("text-center");
      },
    },
  ],
  order: [[1, "asc"]],
  dom:
    "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3'f<'btn-delete-container align-self-center ms-2'>>>>" +
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
  destroy: true,
});
