var app = angular.module('myApp', ['ionic']);
 
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html'
    });  
  $urlRouterProvider.otherwise('/');
});
 
app.factory('Movies', function($http) {
  var cachedData;
  
  function getData(moviename, callback) {
  
    var url = 'http://api.themoviedb.org/3/',
      mode = 'search/movie?query=',
      name = '&query=' + encodeURI(moviename),
      key = '&api_key=470fd2ec8853e25d2f8d86f685d2270e';
  
    $http.get(url + mode + key + name).success(function(data) {
  
      cachedData = data.results;
      callback(data.results);
    });
  }
  
  return {
    list: getData,
    find: function(name, callback) {
      console.log(name);
      var movie = cachedData.filter(function(entry) {
        return entry.id == name;
      })[0];
      callback(movie);
    }
  };
  
});
 
app.controller('HomeCtrl', function($scope, $ionicSideMenuDelegate, Movies) {
   
  $scope.sorting = [{score: 9, name : 'Score more then 9'}, 
                    {score: 8, name : 'Score more then 8'}, 
                    {score: 7, name : 'Score more then 7'}, 
                    {score: 6, name : 'Score more then 6'}, 
                    {score: 5, name : 'Score more then 5'}, 
                    {score: 4, name : 'Score more then 4'}, 
                    {score: 3, name : 'Score more then 3'}, 
                    {score: 2, name : 'Score more then 2'}, 
                    {score: 1, name : 'Score more then 1'},                     
                    {score: 0, name : 'Show me every movie'}];  
                     
  $scope.selected = {
    score : 0,
    movieName : 'Batman'
  }
                     
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
   
  $scope.greaterThan = function(fieldName){
      return function(item){
        return item[fieldName] > $scope.selected.score;
      }
  }  
   
  $scope.searchMovieDB = function() {
  
    Movies.list($scope.selected.movieName, function(movies) {
      $scope.movies = movies;
    });
      
  };
   
  $scope.searchMovieDB(); 
});