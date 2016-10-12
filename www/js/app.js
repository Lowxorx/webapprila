// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

  .factory('GoogleMaps', function ($cordovaGeolocation, $compile, Markers) {

    var apiKey = false;


    function initMap() {
      console.log("fonction initMap");
      var options = { timeout: 10000, enableHighAccuracy: true };

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        window.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //Wait until the map is loaded
        google.maps.event.addListenerOnce(map, 'idle', function () {
          //Load the markers
          loadMarkers();
          loadCurrentPosition();
        });

      }, function (error) {
        console.log("Impossible de détecter votre position");
        //Load the markers
        loadMarkers();
        loadCurrentPosition();
      });

    }

    function loadMarkers() {
      console.log("fonction loadMarkers");
      //Get all of the markers from our Markers factory
      Markers.getMarkers().then(function (markers) {
        console.log("Markers: ", markers);
        var records = markers.data.markers;
        for (var i = 0; i < records.length; i++) {
          var record = records[i];
          var markerPos = new google.maps.LatLng(record.lat, record.lng);

          // Add the markerto the map
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: markerPos
          });

          var infoWindowContent = "<h4>" + record.name + "</h4>";
          addInfoWindow(marker, infoWindowContent, record);
        }
      });
    }

    function loadCurrentPosition() {
      console.log("fonction loadCurrentPosition");
      var options = { timeout: 10000, enableHighAccuracy: true };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var positionActuelle = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });
        var infoWindow = new google.maps.InfoWindow({
          content: "test"
        });
        google.maps.event.addListener(positionActuelle, 'click', function (event) {
          infoWindow.open(map, positionActuelle);
        })
      })
    }

    function addInfoWindow(marker, message, record) {
      console.log("fonction addInfoWindow");
      var infoWindow = new google.maps.InfoWindow({
        content: message
      });
      google.maps.event.addListener(marker, 'click', function (event) {
        infoWindow.open(map, marker);
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        console.log(latitude + ', ' + longitude);
        radius = new google.maps.Circle({
          map: map,
          radius: 100,
          center: event.latLng,
          fillColor: '#777',
          fillOpacity: 0.1,
          strokeColor: '#AA0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          draggable: true,    // Dragable
          editable: true      // Resizable
        });
        // Center of map
        map.panTo(new google.maps.LatLng(latitude, longitude));
      });
    }

    return {
      init: function () {
        initMap();
      }
    }

  })

  .run(function ($ionicPlatform, GoogleMaps) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      console.log("début init gmaps");
      GoogleMaps.init();
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('map', {
        url: '/',
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      });
    $urlRouterProvider.otherwise("/");

  })

  .controller('MapCtrl', function ($scope, $ionicLoading, $cordovaGeolocation, $compile) {
    $scope.centerOnMe = function () {
      $scope.map = map;
      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      var options = { timeout: 10000, enableHighAccuracy: true };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var positionActuelle = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });
        $scope.map.setCenter(latLng);
        $ionicLoading.hide();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    }

    $scope.signalement = function () {
      $scope.map = map;
      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      var options = { timeout: 10000, enableHighAccuracy: true };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var image = 'img/alert.png';
        var positionActuelle = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: image
        });
        var infoWindow = new google.maps.InfoWindow({
          content: "Alerte"
        });
        google.maps.event.addListener(positionActuelle, 'click', function (event) {
          infoWindow.open(map, positionActuelle);
        })
        $scope.map.setCenter(latLng);
        $ionicLoading.hide();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    }
  })

  .factory('Markers', function ($http) {
    var markers = [];
    return {
      getMarkers: function () {
        return $http.get("http://localhost/projetwebrila/www/markers.php").then(function (response) {
          markers = response;
          return markers;
        });

      }
    }
  });