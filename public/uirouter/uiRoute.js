var example = angular.module("example", ['ui.router']);
example.controller("mycontroller", function($scope, $state){
    $scope.go = function(){
        $state.go('settings.account')
    }
})
example.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('settings', {
            url: '/',
            templateUrl: 'settings.html',
            redirectTo: 'settings.profile'
        })
        .state('settings.profile', {
            url: '/profile',
            templateUrl: 'profile.html'        
        })
        .state('settings.account', {
            url: '/account',
            templateUrl: 'account.html'       
        });
//    $urlRouterProvider.otherwise('/404');
    $urlRouterProvider.when('', '/');
});