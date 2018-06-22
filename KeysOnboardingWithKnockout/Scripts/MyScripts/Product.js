jQuery.noConflict()(function ($) {
    $(document).ready(function () {
        getProducts();
    });
});

var prod = { Name: '', Price: '' };
function ProductViewModel(data) {
    var self = this;
    self.Id = ko.observable(data.Id);
    self.Name = ko.observable(data.Name).extend({
        required: {
            params: true,
            message:"Please enter name"
        }
    });
    self.Price = ko.observable(data.Price).extend({
        required: {
            params: true,
            message:"Please enter price"
        }
    });
    self.ModelErrors = ko.validation.group(self);
    self.Isvalid = ko.computed(function () {
        self.ModelErrors.showAllMessages();
        return self.ModelErrors.length === 0;
    });
}
function getProducts() {
    var self = this;
    //Declare observable which will be bind with UI    
    self.Product = ko.observable();
    self.Products = ko.observableArray();
    $.ajax({
        url: 'Products/List',
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {},
        success: function (data) {
            self.Products(data); //Put the response in ObservableArray
        }
    });

    //Edit product details
    self.Edit = function (Product) {
       //var product = ko.mapping.toJs(data);
        self.Product(new ProductViewModel(Product));
        $("#CreateModal").modal('show');
         };

    //updating records
    self.update = function () {
        var Product = self.Product();

        $.ajax({
            url: 'Products/Edit',
            cache: false,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: ko.toJSON(Product),
            success: function (data) {
                self.Products.removeAll();
                self.Products(data); //Put the response in ObservableArray
                self.Product(null);
                location.reload();
                alert("Record Updated Successfully");
            }
        });
    };

    
    //Add button click
    self.add = function () {
        //self.Product(new ProductViewModel(prod));
        $("#CreateModal").modal("show");
    };

    //Save product
    self.save = function () {
        var product = { Name: $("#name").val(), Price: $("#price").val() };
        if (Product.Name() === "" || Product.Price() === "") {
            alert("Please enter all fields");

        }
        else {
            $.ajax({
                url: 'Products/Create/',
                cache: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: ko.toJSON(product),
                success: function (data) {
                    self.Products.push(data);
                    self.Name("");
                    self.Price("");
                    alert("Records added successfully");
                    location.reload();
                }
            });
        }

    };

    
    //Delete product
    self.Delete = function (Product) {
        if (confirm('Are you sure to Delete "' + Product.Name + '" product ??')) {
            var id = Product.Id;
            $.ajax({
                url: 'Products/Delete/'+id,
                cache: false,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                data: id,
                success: function (data) {
                    self.Products.remove(Product);
                    alert("Deleted");
                }
            });
        }

    };
    
}


//closePage
function closePage() { location.reload(); }

//closePage
function closePage1() { location.reload(); }

var a = new getProducts();
ko.applyBindings(a);

    
