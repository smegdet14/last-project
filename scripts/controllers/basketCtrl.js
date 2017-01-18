var appModule = angular.module("mainApp");

appModule.controller("basketCtrl", function($scope) {
    $scope.items = [];
    
    $scope.$on("resetEvent", function() {
        $scope.resetBasket();
    });
    
    $scope.resetBasket = function() {
        var basket = JSON.parse(localStorage.getItem("basket"));
        $scope.items = basket.array;
        
        for(var i = 0; i < $scope.items.length; i++) {
            var currDate = new Date();
            var selectedDate = new Date($scope.items[i].year, $scope.items[i].month, $scope.items[i].day, 23, 59, 59, 999);

            if((+selectedDate - +currDate) < 86400000) {
                $scope.items[i].today = true;
                continue;
            }
            
            $scope.items[i].today = false;
        }
    }
    
    $scope.setBackGround = function(item) {
        if(item.today) {
            return {
                "backgroundColor" : "rgba(0, 255, 0, 0.3)"
            }
        } else {
            return {
                "backgroundColor" : "rgba(255, 255, 255, 1)"
            }
        }
    }
});