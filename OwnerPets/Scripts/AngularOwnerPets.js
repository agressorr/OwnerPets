// Defining angularjs module
var app = angular.module('demoModule', []);

// Defining angularjs Controller and injecting ProductsService
app.controller('demoCtrl', function ($scope, $http, OwnersService) {

    $scope.OwnersData = null;
    // Fetching records from the factory created at the bottom of the script file
    OwnersService.GetAllOwners().then(function (d) {
        $scope.OwnersData = d.data; // Success
    }, function () {
        alert('Error Occured !!!'); // Failed
    });

    // Calculate Total Sum of Pets
    $scope.total = function () {
        var total = 0;
        angular.forEach($scope.OwnersData, function (Pet) {
            total += Pets.Count;
        })
        return total;
    }

    $scope.Owner = {
        Id: '',
        Name: ''
    };

    // Reset product details
    $scope.clear = function () {
        $scope.Owner.Id = '';
        $scope.Owner.Name = '';
    }

    //Add New Owner
    $scope.save = function () {
        if ($scope.Owner.Name != "") {
            $http({
                method: 'POST',
                url: 'api/Owner/PostOwner/',
                data: $scope.Owner
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.OwnerData.push(response.data);
                $scope.clear();
                alert("Owner Added Successfully !!!");
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("Error : " + response.data.ExceptionMessage);
            });
        }
        else {
            alert('Please Enter All the Values !!');
        }
    };

    // Edit product details
    $scope.edit = function (data) {
        $scope.Owner = { Id: Owner.Id, Name: Owner.Name};
    }

    // Cancel product details
    $scope.cancel = function () {
        $scope.clear();
    }

    // Update product details
    $scope.update = function () {
        if ($scope.Owner.Name != "") {
            $http({
                method: 'PUT',
                url: 'api/Owner/PutOwner/' + $scope.Owner.Id,
                data: $scope.Owner
            }).then(function successCallback(response) {
                $scope.OwnersData = response.data;
                $scope.clear();
                alert("Product Updated Successfully !!!");
            }, function errorCallback(response) {
                alert("Error : " + response.data.ExceptionMessage);
            });
        }
        else {
            alert('Please Enter All the Values !!');
        }
    };

    // Delete product details
    $scope.delete = function (index) {
        $http({
            method: 'DELETE',
            url: 'api/Owner/DeleteOwner/' + $scope.OwnersData[index].Id,
        }).then(function successCallback(response) {
            $scope.OwnersData.splice(index, 1);
            alert("Product Deleted Successfully !!!");
        }, function errorCallback(response) {
            alert("Error : " + response.data.ExceptionMessage);
        });
    };

});

// Here I have created a factory which is a popular way to create and configure services.
// You may also create the factories in another script file which is best practice.

app.factory('OwnersService', function ($http) {
    var fac = {};
    fac.GetAllRecords = function () {
        return $http.get('api/OwnerPets/GetAllOwners');
    }
    return fac;
});