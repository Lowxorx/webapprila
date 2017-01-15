angular.module('starter', ['ionic', 'ngCordova'])

// Chargement de la carte depuis gmaps
.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading,
    $rootScope, $cordovaNetwork, Markers, ConnectivityMonitor, $compile, $ionicSideMenuDelegate, $window) {
    var markers = [];
    var apiKey = 'AIzaSyASNMmluZa70_l31mSw7bLClQf4mbKjZrA';

    function initMap() {
        console.log("fonction initMap");

        // Option pour la carte principale
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        console.log("initialisation de l'itinéraire")
            // Instance des objets pour le calcul d'itinéraire
        var directionsService;
        var directionsDisplay;
        $rootScope.directionsService = new google.maps.DirectionsService();
        $rootScope.directionsDisplay = new google.maps.DirectionsRenderer();

        // Affichage de la position actuelle
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mapOptions = {
                center: latLng,
                disableDefaultUI: true,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            // Création de la map 
            window.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            // Création de marqueur lors d'un clic et affichage des infos
            var clicInfoWindow = new google.maps.InfoWindow();
            map.addListener('click', function(event) {
                clearMarkers();
                var marker = new google.maps.Marker({
                    position: event.latLng,
                    map: map,
                    icon: "img/marker.png"
                });
                // Ajout de marqueurs à la liste des marqueurs utilisateur
                markers.push(marker);
                clicInfoWindow.setContent('<div><strong>Position personnalisée</strong><br>' +
                    'GPS : ' + event.latLng + '<br>');
                clicInfoWindow.open(map, marker);
            });
            var input = /** @type {HTMLInputElement} */ (
                document.getElementById('pac-input'));
            // Recherche de position et autocompletion
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', window.map);
            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map,
                icon: "img/marker.png"
            });
            var dest = /** @type {HTMLInputElement} */ (
                document.getElementById('destfield'));
            // Recherche de position et autocompletion
            var autocompletedest = new google.maps.places.Autocomplete(dest);

            var route = /** @type {HTMLInputElement} */ (
                document.getElementById('routefield'));
            // Recherche de position et autocompletion
            var autocompleteroute = new google.maps.places.Autocomplete(route);

            // Détails de la position sélectionnée dans la recherche
            google.maps.event.addListener(autocompleteroute, 'place_changed', function() {
                var place = autocompleteroute.getPlace();
                $window.localStorage.setItem("routeOrigine", place.name);
            });
            google.maps.event.addListener(autocompletedest, 'place_changed', function() {
                var place = autocompletedest.getPlace();
                $window.localStorage.setItem("routeDestination", place.name);
            });
            // Détails de la position sélectionnée dans la recherche
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
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
                    'Adresse : ' + place.formatted_address + '<br> </div>');
                infowindow.open(map, marker);
            });
            // Chargement de la map
            google.maps.event.addListenerOnce(map, 'idle', function() {
                // Chargement des marqueurs
                loadMarkers();
                enableMap();
                loadCurrentPosition();
            });
        }, function(error) {
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
            template: 'Vous devez vous connecter à internet pour afficher la carte.'
        });
    }

    function loadGoogleMaps() {
        $ionicLoading.show({
            template: 'Chargement de la carte...'
        });
        // Appel de la fonction une fois que le sdk est chargé
        window.mapInit = function() {
            initMap();
        };

        // Script à insérer dans la page
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "googleMaps";

        // On ajoute un callback à l'url de chargement de la map pour charger la page une fois le sdk google chargé
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
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                checkLoaded();
            });

            // Désactivation de la map quand la connection est perdue
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                disableMap();
            });

        } else {

            // Section pour téléphone, pareil qu'au dessus
            window.addEventListener("online", function(e) {
                checkLoaded();
            }, false);

            window.addEventListener("offline", function(e) {
                disableMap();
            }, false);
        }

    }

    return {
        init: function(key) {

            if (typeof key != "undefined") {
                apiKey = key;
            }

            if (typeof google == "undefined" || typeof google.maps == "undefined") {

                console.warn("Le SDK Google Maps doit être chargé...");
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
        Markers.getMarkers().then(function(markers) {
            console.log("Markers: ", markers);
            var records = markers.data.markers;
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                var image = record.icon;
                var markerPos = new google.maps.LatLng(record.lat, record.lng);

                // On les ajoute a la map
                var marker = new google.maps.Marker({
                    setMap : map,
                    icon: image,
                    animation: google.maps.Animation.DROP,
                    position: markerPos
                });

                var infoWindowContent = "<h4>" + record.name + "</h4><br><h5>Type d'alerte : " + record.typeAlerte + "</h5><br>" + "Signalé par " + record.user;
                addInfoWindow(marker, infoWindowContent);
            }
        });
    }

    function loadCurrentPosition() {
        console.log("fonction loadCurrentPosition");
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var positionActuelle = new google.maps.Marker({
                map: map,
                icon: "img/marker.png",
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            var infoWindow = new google.maps.InfoWindow({
                content: "Position Actuelle"
            });
            google.maps.event.addListener(positionActuelle, 'click', function(event) {
                infoWindow.open(map, positionActuelle);
            })
        })
    }

    function addInfoWindow(marker, message) {
        console.log("fonction addInfoWindow");
        var infoWindow = new google.maps.InfoWindow({
            content: message
        });
        google.maps.event.addListener(marker, 'click', function(event) {
            infoWindow.open(map, marker);
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            // On centre la map
            map.panTo(new google.maps.LatLng(latitude, longitude));
        });
    }

})

// Surveillance de la connexion à internet
.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork) {
    return {
        isOnline: function() {

            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }

        },
        ifOffline: function() {

            if (ionic.Platform.isWebView()) {
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }

        }
    }
})

// Factory récupération des marqueurs d'alerte depuis la bdd
.factory('Markers', function($http) {
    var markers = [];
    return {
        getMarkers: function() {
            return $http.get("http://localhost/projetwebrila/www/php/markers.php").then(function(response) {
                markers = response;
                return markers;
            });

        }
    }
})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

// Redirection vers les différentes pages
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('map', {
            url: '/',
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
        })
        .state('guestmap', {
            url: '/',
            templateUrl: 'templates/guestmap.html',
            controller: 'GuestMapCtrl'
        });
    $urlRouterProvider.otherwise("/");
})

.controller('loginCtrl', function($scope, $state, GoogleMaps, $http, $timeout, $window, $ionicPopup) {
    console.log("controleur login")
    if ($window.localStorage.getItem("loginStatus") == "true") {
        console.log("user déjà connecté");
        $state.go('map');
        GoogleMaps.init();
    } else {
        $scope.guestSignIn = function() {
            $state.go('guestmap');
            GoogleMaps.init();
        }
        $scope.login = function(data) {
            var request = $http({
                method: "post",
                url: "http://localhost/projetwebrila/www/php/connexion.php",
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    username: data.username,
                    password: data.password
                },
            });
            request.success(function(res) {
                if (res.success) {
                    $window.localStorage.setItem("loginStatus", "true");
                    $window.localStorage.setItem("loginUsr", data.username);
                    $timeout(function() {
                        $state.go('map');
                        GoogleMaps.init();
                    }, 2000)
                } else {
                    $ionicPopup.alert({
                        title: 'Information',
                        template: "Nom d'utilisateur ou mot de passe incorrect"
                    })
                }
            });
        }
    }
})

.controller('MapCtrl', function($scope, $rootScope, $document, $window, $ionicLoading, $cordovaGeolocation, $compile, $ionicPopover, $ionicSideMenuDelegate, $state, $timeout, $ionicHistory, $http) {
    console.log('ctrl map');

    // Afficher ou masquer le panel de choix d'itinéraire
    var initialState = false;
    $scope.routeDiv = initialState;

    $scope.showHideRoute = function() {
        $scope.routeDiv = !$scope.routeDiv;
    }

    // Préparation des item pour l'itinéraire
    $scope.getItineraire = function() {
        console.log("getItineraire");

        $rootScope.directionsDisplay.setMap(map);
        var destination = $window.localStorage.getItem("routeDestination");
        var depart = $window.localStorage.getItem("routeOrigine");
        calculateAndDisplayRoute($rootScope.directionsService, $rootScope.directionsDisplay, destination, depart);
    }

    // Calcul et affichage de l'itinéraire
    function calculateAndDisplayRoute(directionsService, directionsDisplay, destination, depart) {
        console.log("calcul itineraire");
        console.log(destination);
        console.log(depart);

        directionsService.route({
            origin: depart,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setPanel(document.getElementById('directionsList'));

            } else {
                window.alert('Erreur google map : ' + status);
            }
        });
    }

    $scope.centerOnMe = function() {
        $scope.map = map;
        $ionicLoading.show({
            content: 'Recherche de la position actuelle',
            showBackdrop: false
        });

        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var positionActuelle = new google.maps.Marker({
                map: map,
                icon: "img/marker.png",
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            $scope.map.setCenter(latLng);
            $ionicLoading.hide();

            var infoWindow = new google.maps.InfoWindow({
                content: "Position actuelle"
            });
            google.maps.event.addListener(positionActuelle, 'click', function(event) {
                infoWindow.open(map, positionActuelle);
            })
        }, function(error) {
            alert('Impossible de vous localiser !' + error.message);
        });
    }

    $scope.logout = function() {
        $ionicLoading.show({
            template: 'Déconnexion ...'
        });
        $timeout(function() {
            $window.localStorage.setItem("loginStatus", "false");
            $window.localStorage.setItem("loginUsr", "");
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });
            $state.go('login');
        }, 30);
    };

    // Menu signalement
    $scope.animation = 'slide-in-up';
    $ionicPopover.fromTemplateUrl('templates/menusignalement.html', {
        scope: $scope,
        animation: $scope.animation
    }).then(function(popover) {
        $scope.popover = popover;
    });

    // Requete signalement 
    function RequeteSignalement(type, nom, pathicon) {
        $scope.map = map;
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var signalAlerte = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: latLng,
                icon: pathicon
            });
            var infoWindow = new google.maps.InfoWindow({
                content: "Alerte signalée :" + latLng

            });
            google.maps.event.addListener(signalAlerte, 'click', function(event) {
                infoWindow.open(map, signalAlerte);
            })
            $scope.map.setCenter(latLng);
            var request = $http({
                method: "post",
                url: "http://localhost/projetwebrila/www/php/addalert.php",
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    name: nom,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    typeAlerte: type,
                    user: $window.localStorage.getItem("loginUsr"),
                    icon: pathicon
                },
            });
        });
        request.success(function(res) {
            if (res.success) {
                $ionicPopup.alert({
                    title: 'Information',
                    template: "Alerte signalée avec succès !"
                })
            } else {
                $ionicPopup.alert({
                    title: 'Erreur',
                    template: "Impossible de signaler l'alerte"
                })
            }
        });
    };

    // Signalement accident
    $scope.signalAccident = function() {
        icon = "img/accident.png";
        nom = "Accident de la route";
        type = "Accident";
        RequeteSignalement(type, nom, icon);
    };

    // Signalement radar
    $scope.signalRadar = function() {
        icon = "img/radar.png";
        nom = "Radar Fixe";
        type = "Radar";
        RequeteSignalement(type, nom, icon);
    };

    // Signalement trafic
    $scope.signalTrafic = function() {
        icon = "img/trafic.png";
        nom = "Trafic Important";
        type = "Trafic";
        RequeteSignalement(type, nom, icon);
    };

    // Signalement autre
    $scope.signalOther = function() {
        icon = "img/alert.png";
        nom = "Autre Alerte";
        type = "Autre";
        RequeteSignalement(type, nom, icon);
    };

    // Side menu (ouverture et fermeture)
    $scope.openMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    // Gestion liste autocompletion sur android
    $scope.disableTap = function() {
        var container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        var backdrop = document.getElementsByClassName('backdrop');
        angular.element(backdrop).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('pac-input').blur();
        });
    };
})

.controller('GuestMapCtrl', function($scope, $rootScope, $document, $window, $ionicLoading, $ionicPopup, $cordovaGeolocation, $compile, $ionicPopover, $ionicSideMenuDelegate, $state, $timeout, $ionicHistory, $http) {
    console.log('ctrl guestmap');

    // Afficher ou masquer le panel de choix d'itinéraire
    var initialState = false;
    $scope.routeDiv = initialState;

    $scope.showHideRoute = function() {
        $scope.routeDiv = !$scope.routeDiv;
    }

    // Préparation des item pour l'itinéraire
    $scope.getItineraire = function() {
        console.log("getItineraire");

        $rootScope.directionsDisplay.setMap(map);
        var destination = $window.localStorage.getItem("routeDestination");
        var depart = $window.localStorage.getItem("routeOrigine");
        calculateAndDisplayRoute($rootScope.directionsService, $rootScope.directionsDisplay, destination, depart);
    }

    // Calcul et affichage de l'itinéraire
    function calculateAndDisplayRoute(directionsService, directionsDisplay, destination, depart) {
        console.log("calcul itineraire");
        console.log(destination);
        console.log(depart);

        directionsService.route({
            origin: depart,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setPanel(document.getElementById('directionsList'));

            } else {
                window.alert('Erreur google map : ' + status);
            }
        });
    }

    $scope.centerOnMe = function() {
        $scope.map = map;
        $ionicLoading.show({
            content: 'Recherche de la position actuelle',
            showBackdrop: false
        });

        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var positionActuelle = new google.maps.Marker({
                map: map,
                icon: "img/marker.png",
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            $scope.map.setCenter(latLng);
            $ionicLoading.hide();

            var infoWindow = new google.maps.InfoWindow({
                content: "Position actuelle"
            });
            google.maps.event.addListener(positionActuelle, 'click', function(event) {
                infoWindow.open(map, positionActuelle);
            })
        }, function(error) {
            alert('Impossible de vous localiser !' + error.message);
        });
    }

    // Bouton signalement
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Information',
            template: 'Vous devez vous connecter pour signaler un évènement.'
        });
        alertPopup.then(function(res) {
            console.log('après popup');
        });
    }

    // Bouton connexion
    $scope.showLogin = function() {
        $state.go('login');
    }

    // Side menu (ouverture et fermeture)
    $scope.openMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    // Gestion liste autocompletion sur android
    $scope.disableTap = function() {
        var container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        var backdrop = document.getElementsByClassName('backdrop');
        angular.element(backdrop).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('pac-input').blur();
        });
    };
});