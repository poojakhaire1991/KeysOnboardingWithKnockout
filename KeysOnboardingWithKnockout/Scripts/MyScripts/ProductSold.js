    function ProductSold(data) {
       var self = this;
       self.Id = data.Id;
       self.Customer = ko.observable(data.Customer);
       self.CustomerId = ko.observable(data.CustomerId);
       self.Store = ko.observable(data.Store);
       self.StoreId = ko.observable(data.StoreId);
       self.Product = ko.observable(data.Product);
       self.ProductId = ko.observable(data.ProductId);
   }

   function ViewModel() {
       var self = this;
       self.Sales = ko.observableArray();
       self.SelectedSale = ko.observable();
       self.Customers = ko.observableArray();
       self.SelectedCustomer = ko.observable();
       self.Products = ko.observableArray();
       self.SelectedProduct = ko.observable();
       self.Stores = ko.observableArray();
       self.SelectedStore = ko.observable();

       self.showSaveModal = function (data) {
           $("#btnSave").show();
           self.SelectedSale(data);
       };
       self.closePage1 = function () { location.reload(); };
       self.closePage = function () {
           location.reload();
       };
       self.showEditModal = function (data) {
           self.SelectedSale(data);
           var cus = ko.utils.arrayFirst(self.Customers(), function (item) {
                              return item.Id === data.CustomerId();
                      });
           self.SelectedCustomer(cus);
           var prod1 = ko.utils.arrayFirst(self.Products(), function (item) {
               return item.Id === data.ProductId();
           });
           self.SelectedProduct(prod1);
           var store1 = ko.utils.arrayFirst(self.Stores(), function (item) {
               return item.Id === data.StoreId();
           });
           self.SelectedStore(store1);
                      //debugger;
                      $('#editModal').modal('show'); $("#btnUpdate").show();
       };

                     self.Save = function (data) {
                             //var saleId = data.Id;
                             var customerId = self.SelectedCustomer().Id;
                             //debugger;
                             var productId = self.SelectedProduct().Id;
                             var storeId = self.SelectedStore().Id;
                             $.ajax({
                                 url: '/ProductSold/Add',
                                 data: { customerId, productId, storeId,DateSold:$("#datesold").val() },
                                 type: 'GET',
                                 dataType: 'json',
                                 success: function (data) {
                                     alert("Records added successfully");
                                     $("#myModal").hide();
                                     location.reload();
                                 }
                             });
                             //now use ajax to save sale,
                    };

                     self.Update = function (data) {
                         var SaleId = data.Id;
                         var CustomerId = self.SelectedCustomer().Id;
                         var ProductId = self.SelectedProduct().Id;
                         var StoreId = self.SelectedStore().Id;
                         $.ajax({
                             url: '/ProductSold/Edit/' + SaleId,
                             data: { CustomerId: CustomerId, ProductId: ProductId, StoreId: StoreId, DateSold:$("#DateSold").val() },
                             type: 'GET',
                             dataType: 'json',
                             success: function (data) {
                                 alert("Records updated");
                                 $("#myModal").hide();
                                 location.reload();
                             }
                         });
                     };

                     self.Delete = function (data) {
                         var SaleId = data.Id;
                         if (confirm("Do you want to delete this", true)) {
                             $.ajax({
                                 url: '/ProductSold/Delete/' + SaleId,
                                 type: 'GET',
                                 dataType: 'json',
                                 success: function (data) {
                                     alert("Deleted");
                                     $("#myModal").hide();
                                     location.reload();
                                 }
                             });
                         }
                     };

       getSales();
       getCustomers();
       getProducts();
       getStores();
       function getSales() {
                   $.ajax({
                           url: '/ProductSold/List',
                           type: 'GET',
                           dataType: 'json',
                           success: function (response) {
                                   response.forEach(function (item) {
                                           self.Sales.push(new ProductSold(item));
                                   });

                           }
                   });
           }
       function getCustomers() {
                   $.ajax({
                           url: '/Customers/List',
                           type: 'GET',
                           dataType: 'json',
                           success: function (response) {
                                   self.Customers(response);
                           }
                   });
           }
       function getProducts() {
                   $.ajax({
                           url: '/Products/List',
                           type: 'GET',
                           dataType: 'json',
                           success: function (response) {
                                   self.Products(response);
                           }
                   });
           }
       function getStores() {
                   $.ajax({
                           url: '/Stores/List',
                           type: 'GET',
                           dataType: 'json',
                           success: function (response) {
                                   self.Stores(response);
                           }
                   });
           }
   }
   $(document).ready(function () {
           ko.applyBindings(new ViewModel());
       });
