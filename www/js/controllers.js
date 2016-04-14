/**
 * @ngdoc overview
 * @name controllers
 * @description
 * # controllers
 * Hier geschieht die ganze Logik der Applikation.
 * In diesem Modul sind alle Controller implementiert
 *
 */
angular.module('quakewatch.controllers', ['quakewatch.resources'])
    .controller('AppCtrl', function (JsonData,$scope) {
        $scope.isOnline = JsonData.isOnline();
    })

    /**
     * @ngdoc controller
     * @name controllers.controller:HomeCtrl
     * @description
     * Das ist der Controller für die home.html View
     */
    .controller('HomeCtrl', function ($scope, $ionicModal, $window, JsonData, $state, $ionicSlideBoxDelegate, $ionicPopup, $cordovaGeolocation, QuakeReport,$ionicLoading) {
        $scope.isOnline = JsonData.isOnline();
        if(!$scope.isOnline){
            $scope.getOnline = function () {
                document.location.href = 'index.html';
            };
        }
        if ($scope.isOnline) {
            var location = "";
            $scope.quakeAut = function () {
                $scope.quakeList = JsonData.getAut();
                location = "aut";
            };
            $scope.quakeAut();
            $scope.quakeWorld = function () {
                $scope.quakeList = JsonData.getWorld();
                location = "world";
            };
            $scope.quakeEu = function () {
                $scope.quakeList = JsonData.getEu();
                location = "eu";
            };
            $scope.loadMoreData = function () {
                JsonData.getMoreData(location).then(function (bebenAutArray) {
                    $scope.quakeList = $scope.quakeList.concat(bebenAutArray);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
            $scope.$on('$stateChangeSuccess', function () {
                $scope.loadMoreData();
            });

            //START BEBEN REPORT MODAL UND SEINE FUNKTIONEN
            $ionicModal.fromTemplateUrl('templates/lade_daten_modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectModal = modal;
                $scope.selectModalSlider = $ionicSlideBoxDelegate.$getByHandle('modalSlider');
                $scope.selectModalSlider.enableSlide(false);
            });
            $scope.closeSelectModal = function () {
                if ($scope.selectModalSlider.currentIndex() == 0)
                    $scope.selectModal.hide();
                else
                    $scope.selectModalSlider.previous();
            };
            $scope.openSelectModal = function () {
                $scope.selectModalSlider.slide(0);
                $scope.selectModal.show();
                document.getElementById("modalHome").style.top = $window.innerHeight - 290 + "px";
            };
            //Wird beim betaetigen von Button vor mehr al 30 Minuten aktiviert
            $scope.vorMehrAls30Min = function () {
                $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
                var beben = JsonData.getAut();
                var bebenObject = beben[0];
                var bebenObject2 = beben[1];
                var bebenObject3 = beben[2];
                $scope.letzteBeben = [bebenObject, bebenObject2, bebenObject3];
                //$scope.letzteBeben = [bebenObject, bebenObject2];
            };

            //Routing fuer den Button anderes Beben
            $scope.anderesBeben = function () {
                $state.go('app.bebenEintrag');
                $scope.selectModal.hide();
            };
            //Fuer das Button "Ja gerade jetzt" Standort bestimmen und Datum setzten
            $scope.geradeJetzt = function () {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner><br/>Lade Standortdaten',
                    hideOnStateChange: true
                });
                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        console.log(lat);
                        console.log(long);
                        var d1 = new Date();
                        //d1.toUTCString();
                        console.log(d1.toJSON());
                        QuakeReport.setLocLastUpdate(d1.toJSON());
                        QuakeReport.setDateTime(d1.toJSON());
                        QuakeReport.setLon(long);
                        QuakeReport.setLat(lat);
                        QuakeReport.setLocPrec(position.coords.accuracy);
                        $scope.selectModal.hide();
                        $state.go('app.bebenWahrnehmung');
                    }, function (err) {
                        $scope.selectModal.hide();
                        $state.go('app.bebenEintrag');
                    });
            };
            //Fuer die Buttons der 3 letzten spuerhbaren erdbeben (ID uebergeben)
            //TODO MIT DER ID WIEDER UMBAUEN
            $scope.recentQuakes = function () {
                //QuakeReport.setId(id);
                $scope.selectModal.hide();

                $state.go('app.bebenEintrag');
            };
            //END MODAL
        }
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenWahrnehmungCtrl
     * @description
     * Das ist der Controller für die beben_wahrnehmung.html View
     */
    .controller('BebenWahrnehmungCtrl', function ($scope, $state, QuakeReport) {
        $scope.continueToAdditional = function (magClass) {
            QuakeReport.setMagClass(magClass);
            $state.go('app.bebenZusatzfragen');
        };
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:ZusatzVerhaltenCtrl
     * @description
     * Das ist der Controller für die zusatz_verhalten_erdbeben.html View
     */
    .controller('ZusatzVerhaltenCtrl', function ($scope, $location, $anchorScroll, $ionicScrollDelegate) {
        $scope.scrollTop = function () {
            $location.hash(" ");
            $ionicScrollDelegate.scrollTop(true);
        };
        $scope.scrollToAnchor = function (anchorID) {
            $location.hash(anchorID);
            var handle = $ionicScrollDelegate.$getByHandle('verhaltenContent');
            handle.scrollBy(0,-8,true);
        };
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:ZusatzUebersichtCtrl
     * @description
     * Das ist der Controller für die zusatz_uebersicht.html View
     */
    .controller('ZusatzUebersichtCtrl', function ($scope) {

    })
    /**
     * @ngdoc controller
     * @name controllers.controller:ZusatzLexikonCtrl
     * @description
     * Das ist der Controller für die zusatz_lexikon.html View
     */
    .controller('ZusatzLexikonCtrl', function ($scope, $ionicScrollDelegate) {
        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop(true);
        };
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenZusatzfragenCtrl
     * @description
     * Das ist der Controller für die beben_zusatzfragen.html View
     */
    .controller('BebenZusatzfragenCtrl', function ($scope, QuakeReport,$state,$ionicPopup,$ionicHistory) {
        $scope.input = {
          floor: "",
            comment: null,
            contact: null,
            itemsDropped: null,
            ranAway: null,
            facade: null
        };
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.sendData = function (){
            QuakeReport.setFloor($scope.input.floor);
            QuakeReport.setComment($scope.input.comment);
            QuakeReport.sendData();
            console.log($scope.input.floor);
            var alertPopup = $ionicPopup.alert({
                title: 'Danke für ihre Meldung!',
                template: 'Danke für ihre Meldung!',
                okText: '', // String (default: 'OK'). The text of the OK button.
                okType: 'button-assertive' // String (default: 'button-positive'). The type of the OK button.
            });
            alertPopup.then(function(res) {
                //$location.path("/app/home");
                $state.go('app.home');
            });


        };

    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenDetailCtrl
     * @description
     * Das ist der Controller für die beben_detail.html View
     */
    .controller('BebenDetailCtrl', function ($scope,$ionicHistory, $ionicModal, JsonData, $stateParams, $state, $cordovaGeolocation, QuakeReport, $window,$ionicLoading,NgMap) {

        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.mapVisible=false;
        $scope.showMap = function(){
            $scope.mapVisible= !$scope.mapVisible;
            $scope.$broadcast('scroll.resize');
            // document.getElementById("scrollArea").offsetHeight;
        };

        function distance(lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295;    // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;
            var fullResult = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
            return Math.round(fullResult * 100) / 100;

        }
        $scope.quake = JsonData.getQuakefromIdWorld($stateParams.bebenId);
        switch ($scope.quake.classColor){
            case "item-balanced":
                $scope.detailHeaderClass = "balanced-bg";
                break;
            case "item-energized":
                $scope.detailHeaderClass = "energized-bg";
                break;
            case "item-assertive":
                $scope.detailHeaderClass = "assertive-bg";
                break;
        }

        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                $scope.quake.distanceFromPhoneToQuake = distance(
                        position.coords.latitude,
                        position.coords.longitude,
                        $scope.quake.locLat,
                        $scope.quake.locLon
                    ) + " km";
                $scope.$broadcast('scroll.resize');
            }, function (err) {
                $scope.$broadcast('scroll.resize');
                $scope.quake.distanceFromPhoneToQuake = "Bitte Ortungsdienste aktivieren";
            });
        //MODAL BEBENDETAIL
        $ionicModal.fromTemplateUrl('templates/beben_verspuert_modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.bebenmodal = modal;

        });
        $scope.openBebenModal = function () {
            $scope.bebenmodal.show();
            document.getElementById("modalDetail").style.top = $window.innerHeight - 170 + "px";
        };
        $scope.closeBebenModal = function () {
            $scope.bebenmodal.hide();
        };
        $scope.$on('$destroy', function () {
            $scope.bebenmodal.remove();
        });

        $scope.geradeJetzt = function () {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br/>Lade Standortdaten'
            });

            QuakeReport.setId($stateParams.bebenId);
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    var d1 = new Date(position.timestamp);
                    QuakeReport.setLocLastUpdate(d1.toJSON());
                    QuakeReport.setDateTime(d1.toJSON());
                    QuakeReport.setLon(long);
                    QuakeReport.setLat(lat);
                    QuakeReport.setLocPrec(position.coords.accuracy);
                    $scope.bebenmodal.hide();
                    $ionicLoading.hide();
                    $state.go('app.bebenWahrnehmung');
                }, function (err) {
                    $scope.bebenmodal.hide();
                    $ionicLoading.hide();
                    $state.go('app.bebenEintrag');
                });
        };
        $scope.vorMehrAls30Min = function () {
            QuakeReport.setId($stateParams.bebenId);
            $scope.bebenmodal.hide();
            $state.go('app.bebenEintrag');
        };
        //MODAL ENDE
    })
    /**
     * @ngdoc controller
     * @name controllers.controller:BebenEintragCtrl
     * @description
     * Das ist der Controller für die beben_eintrag.html View
     */
    .controller('BebenEintragCtrl', function ($scope, $ionicModal, JsonData, $stateParams, $state, QuakeReport) {
        $scope.input = {
            zipCode : null,
            place : null,
            date : new Date(),
            chosenTime : "",
            rawTime: new Date()
        };
        if($scope.input.rawTime.getUTCMinutes() < 10){
            $scope.input.chosenTime = $scope.input.rawTime.getHours() + ':0' + $scope.input.rawTime.getMinutes();
        }else {
            $scope.input.chosenTime = $scope.input.rawTime.getHours() + ':' + $scope.input.rawTime.getMinutes();
        }
        //Zeit wählen
        $scope.timePickerObject = {
            inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
            step: 5,  //Optional
            format: 24,  //Optional
            titleLabel: 'Zeit wählen',  //Optional
            setLabel: ' ',  //Optional
            closeLabel: ' ',  //Optional
            setButtonType: 'button-assertive icon ion-checkmark',  //Optional
            closeButtonType: 'button-assertive icon ion-close',  //Optional
            callback: function (val) {    //Mandatory
                timePickerCallback(val);
            }
        };
        function timePickerCallback(val) {
            if (typeof (val) === 'undefined') {
            } else {
                var selectedTime = new Date(val * 1000);
                console.log(selectedTime.toJSON());
                $scope.input.rawTime=selectedTime;
                if(selectedTime.getUTCMinutes() < 10){
                    $scope.input.chosenTime = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
                }else{
                    $scope.input.chosenTime = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
                }

            }
        }
        var dateForFrom = new Date();
        var weekDaysList = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
        var monthList = ["Jän", "Feb", "März", "April", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"];
        $scope.datepickerObject = {
            titleLabel: 'Datum setzen',  //Optional
            todayLabel: 'Heute',  //Optional
            closeLabel: ' ',  //Optional
            setLabel: ' ',  //Optional
            setButtonType : 'button-assertive icon ion-checkmark',  //Optional
            todayButtonType : 'button-assertive',  //Optional
            closeButtonType : 'button-assertive icon ion-close',  //Optional
            inputDate: new Date(),  //Optional
            mondayFirst: true,  //Optional
            weekDaysList: weekDaysList, //Optional
            monthList: monthList, //Optional
            templateType: 'popup', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-assertive', //Optional
            modalFooterColor: 'bar-assertive', //Optional
            from: new Date(dateForFrom.getFullYear(),dateForFrom.getMonth()-1 , dateForFrom.getDay()), //Optional
            to: new Date(),  //Optional
            callback: function (val) {  //Mandatory
                datePickerCallback(val);
            },
            dateFormat: 'dd.MM.yyyy', //Optional
            closeOnSelect: false //Optional
        };
        var datePickerCallback = function (val) {
            if (typeof(val) === 'undefined') {
            } else {
                $scope.input.date=val;
            }
        };

        //Zeit wählen ENDE

        $scope.goToComics = function () {
            QuakeReport.setPlace($scope.input.place);
            QuakeReport.setZIP($scope.input.zipCode);
			QuakeReport.setStrasse($scope.input.strasse);
            var datetime = new Date(
                $scope.input.date.getFullYear(),
                $scope.input.date.getMonth(),
                $scope.input.date.getDate(),
                $scope.input.rawTime.getHours()-1,
                $scope.input.rawTime.getMinutes(),
                $scope.input.rawTime.getSeconds()
            );
            QuakeReport.setDateTime(datetime.toJSON());
            console.log(datetime.toJSON());
            $state.go('app.bebenWahrnehmung');
        };
    });
