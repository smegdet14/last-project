(function (){
    
    var appModule = angular.module("mainApp", ['pascalprecht.translate', 'ngAnimate']);
    appModule.config( function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
        
        $translateProvider.translations("en", {
            
        });
        
        $translateProvider.translations("ru", {
            
        });
        
        $translateProvider.preferredLanguage( 'ru' );
    });
    
    
    
})();

jQuery(document).ready( function() {
    jQuery("#logo").click( function() {
       jQuery("#logo").animate( { "opacity" : "0" }, 500, function() {
           jQuery(".logo").animate( { "top" : "-100%", "opacity" : "0" }, 1500, function() {
               jQuery(".logo").remove();
           } );
       });
    }); 
});