// Defining angularjs module
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/templates/Owners.html",
            controller: 'OwnerCtrl'
        })
        .when("/Pets/:OwnerId/:OwnerName", {
            templateUrl: "/templates/Pets.html",
            controller: 'PetCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
});

// Defining angularjs Controller and injecting ProductsService
app.controller('OwnerCtrl', function ($scope, $http, OwnerService, AllPetService) {

    $scope.OwnersData = [];
    $scope.filteredOwnersData = [];
    $scope.totalOwners = null;
    $scope.itemsPerPage = 3;
    $scope.currentPage = 1;

    OwnerService.GetAllRecords()
        .then(function (d) {
            $scope.OwnersData = d.data; // Success
            refreshOwners($scope.OwnersData);
        }, function () {
        });


    function refreshOwners(OwnersD) {
        $scope.OwnersData = OwnersD;
        $scope.filteredOwnersData = $scope.OwnersData;
        $scope.totalOwners = $scope.OwnersData.length;
        $scope.numPages = function () {
            return Math.ceil($scope.OwnersData.length / $scope.itemsPerPage);
        };
        $scope.$watch('currentPage + itemsPerPage', function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
                , end = begin + $scope.itemsPerPage;

            $scope.filteredOwnersData = $scope.OwnersData.slice(begin, end);
        });
    };

    AllPetService.GetAllRecords()
        .then(function (d) {
            $scope.PetsData = d.data; // Success
        }, function () {
        });

    $scope.petsCount = function (OwnerId) {
        var total = 0;
        angular.forEach($scope.PetsData, function (item) {
            if (item.OwnerId === OwnerId) {
                total++;
            }
        })
        return total;
    };

    $scope.Owner = {
        Id: '',
        Name: ''
    };

    $scope.Ownerclear = function () {
        $scope.Owner.Name = ''
    }

    //Save Owner
    $scope.saveOwner = function () {
        $scope.Owner.Id = 0;

        if ($scope.Owner.Name !== "") {

            $http({
                method: 'POST',
                url: 'api/Owners',
                data: $scope.Owner
            }).then(function successCallback(response) {
                $scope.OwnersData.push(response.data);
                refreshOwners($scope.OwnersData);
                $scope.Ownerclear();
            }, function errorCallback(response) {
            });

        }
        else {
            alert('Please Enter All the Values !!');
        }
    };

    // Delete Owner
    $scope.deleteOwner = function (id) {
        $http({
            method: 'DELETE',
            url: 'api/Owners/' + id,
        }).then(function successCallback(response) {
            //$scope.OwnersData.splice(id, 1); эта хрень почему-то не работает, перечитываем
            OwnerService.GetAllRecords()
                .then(function (d) {
                    $scope.OwnersData = d.data; // Success
                    refreshOwners($scope.OwnersData);
                }, function () {
                });
            refreshOwners($scope.OwnersData);

        }, function errorCallback(response) {
            console.log(id)
        });
    };

});


// Defining angularjs Controller and injecting ProductsService
app.controller('PetCtrl', function ($scope, $http, PetService, $routeParams) {

    $scope.OwnerName = $routeParams.OwnerName;
    $scope.itemsPerPage = 3;
    $scope.currentPage = 1;

    $scope.PetsData = [];
    $scope.filteredPetsData = [];
    $scope.totalPets = null;

    PetService.GetAllRecords($routeParams.OwnerId)
        .then(function (d) {
            $scope.PetsData = d.data; // Success
            refreshPets($scope.PetsData);
        }, function () {
        });

    function refreshPets(PetsD) {
        $scope.PetsData = PetsD;
        $scope.filteredPetsData = $scope.PetsData;
        $scope.totalPets = $scope.PetsData.length;
        $scope.numPages = function () {
            return Math.ceil($scope.PetsData.length / $scope.itemsPerPage);
        };

        $scope.$watch('currentPage + itemsPerPage', function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
                , end = begin + $scope.itemsPerPage;

            $scope.filteredPetsData = $scope.PetsData.slice(begin, end);
        });
    };

    $scope.Pet = {
        Id: '',
        Name: '',
        OwnerId: ''
    };

    $scope.Petclear = function () {
        $scope.Pet.Name = ''
    }

    $scope.savePet = function () {
        $scope.Pet.Id = 0;
        $scope.Pet.OwnerId = $routeParams.OwnerId;

        if ($scope.Pet.Name !== "") {

            $http({
                method: 'POST',
                url: 'api/Pets',
                data: $scope.Pet
            }).then(function successCallback(response) {
                $scope.PetsData.push(response.data);

                refreshPets($scope.PetsData);

                $scope.Petclear();
            }, function errorCallback(response) {
            });

        }
        else {
            alert('Please Enter All the Values !!');
        }
    };

    $scope.deletePet = function (id) {
        $http({
            method: 'DELETE',
            url: 'api/Pets/' + id,
        }).then(function successCallback(response) {
            PetService.GetAllRecords($routeParams.OwnerId)
                .then(function (d) {
                    $scope.PetsData = d.data; // Success
                    refreshPets($scope.PetsData);
                    console.log($scope.PetsData);
                }, function () {
                    console.log('Error Occured !!!'); // Failed
                });

        }, function errorCallback(response) {
        });
    };

});

app.service('OwnerService', function ($http) {
    this.GetAllRecords = function () {
        return $http.get('api/Owners');
    }
});

app.service('PetService', function ($http) {
    this.GetAllRecords = function (OwnerId) {
        return $http.get('api/Pets/' + OwnerId);
    }
});

app.service('AllPetService', function ($http) {
    this.GetAllRecords = function () {
        return $http.get('api/Pets/');
    }
});
