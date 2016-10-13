// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

  .factory('GoogleMaps', function ($cordovaGeolocation, $ionicLoading,
    $rootScope, $cordovaNetwork, Markers, ConnectivityMonitor, $compile) {
    var markers = [];
    var apiKey = 'AIzaSyASNMmluZa70_l31mSw7bLClQf4mbKjZrA';

    function initMap() {
      console.log("fonction initMap");
      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Création de la map 
        window.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Création de marqueur lors d'un clic et affichage des infos
        var clicInfoWindow = new google.maps.InfoWindow();
        map.addListener('click', function (event) {
          clearMarkers();
          var marker = new google.maps.Marker({
            position: event.latLng,
            map: map
          });
          // Ajout de marqueurs à la liste des marqueurs utilisateur
          markers.push(marker);
          clicInfoWindow.setContent('<div><strong>Position personnalisée</strong><br>' +
            'GPS: ' + event.latLng + '<br>');
          clicInfoWindow.open(map, marker);
        });

        var input = /** @type {HTMLInputElement} */ (
          document.getElementById('pac-input'));
        // Recherche de position et autocompletion
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', window.map);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map
        });

        // Détails de la position sélectionnée dans la recherche
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
          infowindow.close();
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          // Centre la map lors de la sélection d'une position proposée
          marker.setPlace(({
            placeId: place.place_id,
            location: place.geometry.location
          }));
          marker.setVisible(true);
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            'Place ID: ' + place.place_id + '<br>' +
            place.formatted_address + '</div>');
          infowindow.open(map, marker);
        });

        // Chargement de la map
        google.maps.event.addListenerOnce(map, 'idle', function () {
          // Chargement des marqueurs
          loadMarkers();
          enableMap();
          loadCurrentPosition();
        });

      }, function (error) {
        console.log("Impossible de détecter votre position");
        // Chargement des marqueurs
        loadMarkers();
        loadCurrentPosition();
      });

    }

    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    function clearMarkers() {
      setMapOnAll(null);
    }

    function enableMap() {
      $ionicLoading.hide();
    }

    function disableMap() {
      $ionicLoading.show({
        template: 'Vous devez vous connecter pour afficher la carte.'
      });
    }

    function loadGoogleMaps() {
      $ionicLoading.show({
        template: 'Chargement de la carte...'
      });
      // Appel de la fonction une fois que le sdk est chargé
      window.mapInit = function () {
        initMap();
      };

      // Script à insérer dans la page
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "googleMaps";

      // On ajoute un callback à l'url de chargement de la map
      if (apiKey) {
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey +
          '&libraries=places,geometry&callback=mapInit';
      } else {
        script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places,geometry&callback=mapInit';
      }

      document.body.appendChild(script);
    }

    function checkLoaded() {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        loadGoogleMaps();
      } else {
        enableMap();
      }
    }

    function addConnectivityListeners() {

      if (ionic.Platform.isWebView()) {

        // On vérifie si la map est déjà chargée
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
          checkLoaded();
        });

        // Désactivation de la map quand la connection est perdue
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
          disableMap();
        });

      } else {

        // Section pour téléphone, pareil qu'au dessus
        window.addEventListener("online", function (e) {
          checkLoaded();
        }, false);

        window.addEventListener("offline", function (e) {
          disableMap();
        }, false);
      }

    }

    return {
      init: function (key) {

        if (typeof key != "undefined") {
          apiKey = key;
        }

        if (typeof google == "undefined" || typeof google.maps == "undefined") {

          console.warn("Le SDK Google Maps doit être chargé");

          disableMap();

          if (ConnectivityMonitor.isOnline()) {
            loadGoogleMaps();
          }
        } else {
          if (ConnectivityMonitor.isOnline()) {
            initMap();
            enableMap();
          } else {
            disableMap();
          }
        }

        addConnectivityListeners();

      }
    }

    function loadMarkers() {
      console.log("fonction loadMarkers");
      // On récupère tout les marqueurs de la bdd
      Markers.getMarkers().then(function (markers) {
        console.log("Markers: ", markers);
        var records = markers.data.markers;
        for (var i = 0; i < records.length; i++) {
          var record = records[i];
          var markerPos = new google.maps.LatLng(record.lat, record.lng);

          // On les ajoute a la map
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
      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };
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
        // On centre la map
        map.panTo(new google.maps.LatLng(latitude, longitude));
      });
    }

  })

  .factory('ConnectivityMonitor', function ($rootScope, $cordovaNetwork) {
    return {
      isOnline: function () {

        if (ionic.Platform.isWebView()) {
          return $cordovaNetwork.isOnline();
        } else {
          return navigator.onLine;
        }

      },
      ifOffline: function () {

        if (ionic.Platform.isWebView()) {
          return !$cordovaNetwork.isOnline();
        } else {
          return !navigator.onLine;
        }

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

  .controller('MapCtrl', function ($scope, $ionicLoading, $cordovaGeolocation, $compile, $ionicPopover, $ionicSideMenuDelegate) {
    $scope.centerOnMe = function () {
      $scope.map = map;
      $ionicLoading.show({
        content: 'Recherche de la position actuelle',
        showBackdrop: false
      });

      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var positionActuelle = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });
        $scope.map.setCenter(latLng);
        $ionicLoading.hide();

        var infoWindow = new google.maps.InfoWindow({
          content: "test"
        });
        google.maps.event.addListener(positionActuelle, 'click', function (event) {
          infoWindow.open(map, positionActuelle);
        })
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    }

    // Controleur btn signalement
    $scope.signalement = function () {
      $scope.map = map;
      $ionicLoading.show({
        content: 'Recherche de la position actuelle',
        showBackdrop: false
      });

      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var image = 'img/alert.png';
        var signalAlerte = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: image
        });
        var infoWindow = new google.maps.InfoWindow({
          content: "Alerte signalée :" + latLng

        });
        google.maps.event.addListener(signalAlerte, 'click', function (event) {
          infoWindow.open(map, signalAlerte);
        })
        $scope.map.setCenter(latLng);
        $ionicLoading.hide();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    }

    // Menu signalement
    $scope.animation = 'slide-in-up';
    $ionicPopover.fromTemplateUrl('templates/menusignalement.html', {
      scope: $scope,
      animation: $scope.animation
    }).then(function (popover) {
      $scope.popover = popover;
    });

    // Side menu 
    $scope.openMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
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