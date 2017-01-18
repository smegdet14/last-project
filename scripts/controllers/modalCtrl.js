var appModule = angular.module("mainApp");

appModule.controller("modalCtrl", function($scope) {
    $scope.currentProduct;
    $scope.currentImage;
    $scope.currentShop;
    $scope.currentDate;
    $scope.shops;
    $scope.cost;
    $scope.count;
    $scope.trueCount = true;
    $scope.info;
    
    jQuery("#count").on( "input", function() {
        var value = jQuery("#count").val();
        
        if(value.length < 1) {
            jQuery("#count").css({ "outline": "2px solid red" });
            $scope.trueCount = false;
            return;
        }
        
        if(isNaN(+value)) 
        {
            jQuery("#count").css({ "outline": "2px solid red" });
            $scope.trueCount = false;
            return;
        }
        
        if(+value < 1 || +value > $scope.count)
        {
            jQuery("#count").css({ "outline": "2px solid red" });
            $scope.trueCount = false;
            return;
        }
        
        jQuery("#count").css({ "outline": "2px solid green" });
        $scope.trueCount = true;
    });
    
    $scope.$on("transferProductEvent", function(event, data) {
        $scope.currentProduct = data.data;
        $scope.currentImage = $scope.currentProduct.image[0];
    });
    
    $scope.$on("transferShopsEvent", function(event, data) {
        $scope.shops = data.data;
        $scope.currentShop = $scope.shops[0];
        
        for(var i = 0; i < $scope.currentShop.stock.length; i++) {
            
            if($scope.currentShop.stock[i].product.name === $scope.currentProduct.name) {
                $scope.cost = $scope.currentShop.stock[i].cost;
                $scope.count = $scope.currentShop.stock[i].count;
                break;
            }
            
        }
        
    });
    
    $scope.chooseImage = function(image) {
        $scope.currentImage = image;
    };
    
    $scope.chooseShop = function() {
        
        for(var i = 0; i < $scope.currentShop.stock.length; i++) {
            
            if($scope.currentShop.stock[i].product.name === $scope.currentProduct.name) {
                $scope.cost = $scope.currentShop.stock[i].cost;
                $scope.count = $scope.currentShop.stock[i].count;
                break;
            }
            
        }
        
    };
    
    $scope.buy = function() {
        
        if(!$scope.trueCount) {
            $scope.info = "Введено некорректное количество товара";
            jQuery(".info").fadeIn();
            return;
        }
        
        var value = jQuery("#date").val();
        
        if(value.length < 1) {
            $scope.info = "Вы не ввели дату доставки";
            jQuery(".info").fadeIn();
            return;
        }
        
        var day = value.substr(3, 2);
        var month = +value.substr(0, 2) - 1;
        var year = value.substr(6);
        
        var selectedDate = new Date(year, month, day, 23, 59, 59, 999);
        
        var nowDate = new Date();
        
        if(+selectedDate < +nowDate) {
            $scope.info = "Введена некорректная дата";
            jQuery(".info").fadeIn();
            return;
        }
        
        jQuery(".info").fadeOut();
        var basket = {
            array : []
        };
        
        if(typeof(localStorage) != 'undefined') {
            if("basket" in localStorage) {
                basket = JSON.parse(localStorage.getItem("basket"));
                localStorage.removeItem("basket");
            } else {
                jQuery(".basket-info").fadeIn();
                $scope.animateArrow(0);
            }
        } else {
            jQuery(".basket-info").fadeIn();
            $scope.animateArrow(0);
        }
        
        
        
        var selectedBuy = {
            name : $scope.currentProduct.name,
            price : $scope.cost * +jQuery("#count").val() * (1 - $scope.currentShop.sale),
            day : day,
            month : month,
            year : year
        }
        
        basket.array.push(selectedBuy);
        
        var serialObj = JSON.stringify(basket);
        localStorage.setItem("basket", serialObj);
        
        $scope.sendMessage();
        
        jQuery("body, html").animate(  { scrollTop: 0 } , 800);
        jQuery(".opacity").fadeOut();
        jQuery(".modal").fadeOut();
    };
    
    $scope.sendMessage = function() {
        $scope.$emit("setImagePathEvent", "hello");
    }
    
    $scope.animateArrow = function(count) {
        jQuery("#to-basket").animate( { "width" : "35%" } , 500, function() {
            jQuery("#to-basket").animate( { "width" : "48%" } , 500, function() {
                
                if(count > 5) {
                    return;
                }
                
                $scope.animateArrow(count + 1);
            });
        });
    };
});