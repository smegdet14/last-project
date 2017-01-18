var appModule = angular.module("mainApp");

appModule.controller("mainCtrl", function($scope, $http) {
    $scope.categories = [];
    $scope.categoriesSlider = [];
    $scope.currentCategory;
    $scope.currentScroll;
    $scope.currentTarget;
    $scope.currentProduct;
    $scope.allProducts = [];
    $scope.productList = [];
    $scope.shops = [];
    $scope.timeOut = 500;
    $scope.stateSlider = 1;
    $scope.pathToBasketImage;
    $scope.nameFilter;
    $scope.brandFilter;
    $scope.yearFilter;
    
    
    
    jQuery(window).scroll( function() {
 
        if(jQuery(this).scrollTop() != 0) {
            jQuery(".to-top").fadeIn();
        } else {
            jQuery('.to-top').fadeOut();
        }

    });
    
    jQuery(".to-top").click( function() {
        jQuery("body, html").animate(  { scrollTop: 0 } , 800);
    });
    
    jQuery("#modal-close").click( function() {
        jQuery("body, html").animate(  { scrollTop: $scope.currentScroll } , 800);
        jQuery(".opacity").fadeOut();
        jQuery(".modal").fadeOut();
    });
    
    jQuery("#modal-close-2").click( function() {
        jQuery("body, html").animate(  { scrollTop: $scope.currentScroll } , 800);
        jQuery(".opacity").fadeOut();
        jQuery(".basket-items").fadeOut();
    });
    
    $http.get("https://jsworkshop.000webhostapp.com/?model=category")
        .then(function (data, status, headers, config) {
            $scope.categories = data.data;
        
            $http.get("https://jsworkshop.000webhostapp.com/?model=product")
            .then(function (data, status, headers, config) {
                $scope.allProducts = data.data;
                for(var i = 0; i < $scope.allProducts.length; i++) {
                    
                    if($scope.allProducts[i].image.length === 0) {
                        $scope.allProducts[i].image.push("images/noPhoto.jpg");
                    }
                    
                }
                
                $http.get("https://jsworkshop.000webhostapp.com/?model=shop")
                .then(function (data, status, headers, config) {
                    $scope.shops = data.data;
                    
                    jQuery(".spinner").remove();
                })
                .catch(function (data, status, headers, config) {
                    alert("error: " + data);
                });
            })
            .catch(function (data, status, headers, config) {
                alert("error: " + data);
            });
        })
        .catch(function (data, status, headers, config) {
            alert("error: " + data);
        });
    
    $scope.clickListCategory = function(category) {
        $scope.currentCategory = category;
        
        jQuery(".slider").animate( { "height" : "80px" }, 500, function() {
            jQuery(".arrow").css({ "display" : "block" });
            setTimeout($scope.makeSliderList, $scope.timeOut);
        });
    };
    
    $scope.makeSliderList = function() {
        $scope.categoriesSlider.push($scope.categories[0]);
        $scope.categories.splice(0, 1);
        $scope.timeOut /= 1.2;
        $scope.$apply();
        if($scope.categories.length == 0) {
            jQuery(".categories-list").remove();
            jQuery(".content").animate( { "width" : "70%" }, 1000, function() {
                jQuery(".filters").animate( { "width" : "30%" }, 1000 );
            });
            
            $scope.makeListProducts();
            
            jQuery("div.category-slider:contains(\"" + $scope.currentCategory.name + "\")").css( { "color" : "green", "font-weight" : "bolder" } );
            $scope.currentTarget = jQuery("div.category-slider:contains(\"" + $scope.currentCategory.name + "\")");
            
            return;
        }
        setTimeout($scope.makeSliderList, $scope.timeOut);
    };
    
    $scope.chooseCategory = function(category, event) {
        jQuery($scope.currentTarget).removeAttr("style");
        
        $scope.currentCategory = category;
        $scope.currentTarget = event.currentTarget;
        
        jQuery(event.currentTarget).css( { "color" : "green", "font-weight" : "bolder" } );
        
        $scope.productList.length = 0;
        
        for(var i = 0; i < $scope.allProducts.length; i++) {
            
            for(var j = 0; j < $scope.allProducts[i].category.length; j++) {
                
                if($scope.allProducts[i].category[j].name === $scope.currentCategory.name) {
                    $scope.productList.push($scope.allProducts[i]);
                    break;
                }
                
            }
            
        }
    };
    
    $scope.chooseProduct = function(product, event) {
        $scope.currentScroll = jQuery(window).scrollTop();
        
        $scope.currentProduct = product;
        
        var data = { data : $scope.currentProduct };
        $scope.$broadcast("transferProductEvent", data);
        
        data = { data : $scope.shops };
        $scope.$broadcast("transferShopsEvent", data);
        
        jQuery("body, html").animate(  { scrollTop: 0 } , 800);
        jQuery(".opacity").fadeIn();
        jQuery(".modal").fadeIn();
    };
    
    $scope.showOrHideSlider = function() {
        switch($scope.stateSlider) {
            case 0:
                jQuery(".slider").animate( { "height" : "80px" }, 500, function() {
                    jQuery('.arrow').css('transform','rotate(0deg)');
                    $scope.stateSlider = 1;
                });
                break;
            case 1:
                jQuery(".slider").animate( { "height" : "0px" }, 500, function() {
                    jQuery('.arrow').css('transform','rotate(180deg)');
                    $scope.stateSlider = 0;
                });
                break;
        }
    };
    
    $scope.makeListProducts = function() {
        $scope.productList.length = 0;
        
        for(var i = 0; i < $scope.allProducts.length; i++) {
            
            for(var j = 0; j < $scope.allProducts[i].category.length; j++) {
                
                if($scope.allProducts[i].category[j].name === $scope.currentCategory.name) {
                    $scope.productList.push($scope.allProducts[i]);
                    $scope.$apply();
                    break;
                }
                
            }
            
        }
    };
    
    $scope.chooseBasket = function() {
        
        if(typeof(localStorage) == 'undefined' || !("basket" in localStorage)) {
            alert("Корзина пуста");
            
            return;
        }
        
        jQuery(".opacity").fadeIn();
        jQuery(".basket-items").fadeIn();
        jQuery(".basket-info").fadeOut();
        jQuery(".today").fadeOut();
        $scope.$broadcast("resetEvent", "data");
    };
    
    $scope.$on("setImagePathEvent", function() {
        $scope.setImagePath();
    });
    
    $scope.setImagePath = function() {
        
        if(typeof(localStorage) == 'undefined') {
            console.log("localStorage is undefined");
            $scope.pathToBasketImage = "images/basketEmpty.png";
            return;
        }
        
        if("basket" in localStorage) {
            $scope.pathToBasketImage = "images/basketNotEmpty.png";
        } else {
            $scope.pathToBasketImage = "images/basketEmpty.png";
        }
        
    };
    
    $scope.checkToday = function() {
        
        if(typeof(localStorage) == 'undefined') {
            console.log("localStorage is undefined");
            return;
        }
        
        if("basket" in localStorage) {
            var basket = JSON.parse(localStorage.getItem("basket"));
            var items = basket.array;
            localStorage.removeItem("basket");
            
            for(var i = 0; i < items.length; i++) {
                var currDate = new Date();
                var selectedDate = new Date(items[i].year, items[i].month, items[i].day, 23, 59, 59, 999);
                
                if((+selectedDate - +currDate) < 86400000) {
                    jQuery(".basket-info").fadeIn();
                    jQuery(".today").fadeIn();
                    
                    break;
                }
            }
            
            for(var i = 0; i < items.length; i++) {
                var currDate = new Date();
                var selectedDate = new Date(items[i].year, items[i].month, items[i].day, 23, 59, 59, 999);
                
                if((+selectedDate - +currDate) < 0) {
                    items.splice(items.indexOf(items[i]), 1);
                    i--;
                }
            }
            
            var basket = {
                array : items
            };
            
            var serialObj = JSON.stringify(basket);
            localStorage.setItem("basket", serialObj);
            
        } else {
            return;
        }
        
    };
    
    $scope.setImagePath();
    $scope.checkToday();
});