jQuery.noConflict()(function ($) {
    $(document).ready(function () {
       getStores();
    });
});

var newStore = {Name:'',Address:'',ContactNo:''};
function getStores(data) {
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
    self.ContactNo = ko.observable("").extend({
        required: {
            params: true,
            message: "Please enter contact number"
        }
    });
    self.ModelErrors = ko.validation.group(self);
    self.Isvalid = ko.computed(function () {
        self.ModelErrors.showAllMessages();
        return self.ModelErrors().length === 0;
    });
    //var Store = {
    //    Id: self.Id,
    //    Name: self.Name,
    //    Address: self.Address,
    //    ContactNo: self.ContactNo
    //};
    self.Store = ko.observable();
    self.Stores = ko.observableArray();
    $.ajax({
        url: 'Stores/List',
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {},
        success: function (data) {
            self.Stores(data); //Put the response in ObservableArray
        }
    });

    //Edit product details
    self.Edit = function (Store) {
        self.Store(Store);
       };

    //updating records
    self.update = function () {
        var Store = self.Store();

        $.ajax({
            url: 'Stores/Edit',
            cache: false,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: ko.toJSON(Store),
            success: function (data) {
                self.Stores.removeAll();
                self.Stores(data); //Put the response in ObservableArray
                self.Store(null);
                location.reload();
                alert("Record Updated Successfully");
            }
        });
    };


    //Add button click
    self.add = function () {
        self.Store(newStore);
        $("#btnUpdate").hide();
    };

    //Save product
    self.save = function () {
        var Store = { Name: $("#name").val(), Address: $("#address").val(), ContactNo: $("#contact").val() };
        if (Store.Name === "" || Store.Address === "" || Store.ContactNo === "") {
            alert("Please enter all fields");
        }
        else {
            $.ajax({
                url: 'Stores/Create/',
                cache: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: ko.toJSON(Store),
                success: function (data) {
                    self.Stores.push(data);
                    self.Name("");
                    self.Address("");
                    self.ContactNo("");
                    alert("Records added successfully");
                    location.reload();
                }
            });
        }

    };


    //Delete product
    self.Delete = function (Store) {
        if (confirm('Are you sure to Delete "' + Store.Name + '" product ??')) {
            var id = Store.Id;
            $.ajax({
                url: 'Stores/Delete/' + id,
                cache: false,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                data: id,
                success: function (data) {
                    self.Stores.remove(Store);
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

var a = new getStores();
ko.applyBindings(a);


