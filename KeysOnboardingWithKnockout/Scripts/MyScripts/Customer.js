jQuery.noConflict()(function ($) {
    $(document).ready(function () {
        getCustomers();
    });
});
function getCustomers() {
    var self = this;
    //Declare observable which will be bind with UI
    self.Id = ko.observable("");
    self.Name = ko.observable("").extend({
        required: {
            params: true,
            message: "Please enter name"
        } 
    });
    self.Address = ko.observable("").extend({
        required: {
            params: true,
            message: "Please enter address"
        }
    });
    self.Age = ko.observable("").extend({
        required: {
            params: true,
            message: "Please enter age"
        }
    });
    self.ContactNo = ko.observable("").extend({
        required: {
            params: true,
            message: "Please enter ContactNo"
        }
    });
    self.ModelErrors = ko.validation.group(self);
    self.Isvalid= ko.computed(function () {
        self.ModelErrors.showAllMessages();
        return self.ModelErrors().length === 0;
    });
    var Customer = {
        Id: self.Id,
        Name: self.Name,
        Address: self.Address,
        Age: self.Age,
        ContactNo: self.ContactNo
    };
    self.Customer = ko.observable();
    self.Customers = ko.observableArray();
    $.ajax({
        url: 'Customers/List/',
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {},
        success: function (data) {
            self.Customers(data); //Put the response in ObservableArray
        }
    });

    //Edit product details
    self.Edit = function (Customer) {
        self.Customer(Customer);
       };

    //updating records
    self.update = function () {
        var Customer = self.Customer();

        $.ajax({
            url: 'Customers/Edit',
            cache: false,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: ko.toJSON(Customer),
            success: function (data) {
                self.Customers.removeAll();
                self.Customers(data); //Put the response in ObservableArray
                self.Customer(null);
                location.reload();
                alert("Record Updated Successfully");
            }
        });
    };


    //Add button click
    self.add = function () { $("#btnUpdate").hide(); };

    //Save product
    self.save = function () {
        var Customer = { Name: $("#name").val(), Address: $("#address").val(), Age: $("#age").val(), ContactNo: $("#contact").val() };
        if (Customer.Name === "" || Customer.Address === "" || Customer.Age === "" || Customer.ContactNo === "") {
            alert("Please enter all fields");
        }
        else {
            $.ajax({
                url: 'Customers/Create/',
                cache: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: ko.toJSON(Customer),
                success: function (data) {
                    self.Customers.push(data);
                    self.Name("");
                    self.Address("");
                    self.Age("");
                    self.ContactNo("");
                    alert("Records added successfully");
                    location.reload();
                }
            });
        }

    };


    //Delete product
    self.Delete = function (Customer) {
        if (confirm('Are you sure to Delete "' + Customer.Name + '" product ??')) {
            var id = Customer.Id;
            $.ajax({
                url: 'Customers/Delete/' + id,
                cache: false,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                data: id,
                success: function (data) {
                    self.Customers.remove(Customer);
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

var a = new getCustomers();
ko.applyBindings(a);


