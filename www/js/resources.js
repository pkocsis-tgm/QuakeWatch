/**
 * @ngdoc overview
 * @name resources
 * @description
 * # resources (resources.js)
 *  Hier wird jegliche Kommunikation/Datenabfragen für die App, welche über das "WWW" ausgeführt wird, implementiert.
 * # Wie implementiere ich meine eigene REST/... Schnittstelle?
 *  * Eine neue Factory zum quakewatch.resources Module hinzufügen <br>
 *      <pre>
 *      .factory('IhrFactoryName', function ($http) {
 *          //Eigener Code
 *          return {
 *              reloadData: function (location) {
 *              return //neu geladene Daten der location entsprechend(eu,aut,world)
 *              }
 *              AutPromise: // Österreichische Erdbebendaten Abfragen ($http bevorzugt),
 *              getAut: function () {
 *                   return // Ein array mit den österreichischen Erdbebendaten als quakeData Objekte
 *               },
 *              getQuakefromIdWorld: function (id) {
 *                  return // Ein Erdbeben( quakeData Objekt) aus den allen Erdbebendaten (entsprechend der ID)
 *              },
 *              getWorld: function () {
 *                  return // Ein array mit allen Erdbebendaten als quakeData Objekte
 *              },
 *              getEu: function(){
 *                  return // Ein array mit den europäischen Erdbebendaten als quakeData Objekte
 *              },
 *              getMoreData: function(location){
 *                  return // location = aut,world, eu Neue Erdbebendaten laden und als array von quakeData Objekten übergeben
 *              }
 *         }
 *      }
 *      </pre>
 *  * Änderung der von der App verwendeten Factory <br>
 *      In *JsonData* die neu erstellte Factory in den Parametern inkludieren und restEndpoint zuweisen
 *      <pre>
 *          .factory('JsonData', function (IhrFactoryName) {
 *          var restEndpoint=IhrFactoryName;
 *          // ...
 *          }
 *      </pre>
 *
 */
angular.module('quakewatch.resources', ['ngResource'])
    .constant('ApiEndpointZAMG', {
        url: 'http://geoweb.zamg.ac.at/fdsnws/app/1'
    })
    .constant('ApiEndpointSeismic', {
        url: 'http://localhost:8100/api'
    })
    .constant('ApiEndpointZAMGFiles', {
        url: 'http://geoweb.zamg.ac.at/eq_app'
    })
    .constant('GeowebEndpoint', {
        url: 'http://geoweb.zamg.ac.at'
    })
    /**
     * @ngdoc service
     * @name resources.service:JsonData
     * @description
     * # REST Interface
     * Diese Factory wird in der App verwendet um Erdbebendaten zu laden.
     * Es ist ein "Interface" welches den einfachen austausch der Endpunkte ermöglicht
     * Für nähere Informationen zur implementierung einer eigenen Factory bei der Dokumentation für {@link resources resources} nachschlagen
     */
    .factory('JsonData', function (DataGeoWebZAMG, DataSeismicPortal, DataGeoWebZAMGStaticFiles) {
        var restEndpoint = DataGeoWebZAMGStaticFiles;
        var isOnline = null;
        return {
            /**
             * @ngdoc method
             * @name resources.service#reloadData
             * @methodOf resources.service:JsonData
             *
             * @description
             * Mithilfe von dieser funktion werden alle Erdbebendaten neu geladen
             * @example
             * JsonData.reloadData('eu');
             * @param {[quakeData]} Erdbebendaten entsprechend der Lokation
             */
            reloadData: function (location) {
                return restEndpoint.reloadData(location);
            },
            /**
             * @ngdoc method
             * @name resources.service#setOnline
             * @methodOf resources.service:JsonData
             *
             * @description
             * Diese Funktion wird in der **app.js** aufgerufen um den Online-Status der App zu setzten.
             * @example
             * JsonData.setOnline(online)
             * @param {boolean} online status der App hängt von der AutPromise ab
             */
            setOnline: function (online) {
                isOnline = online;
            },
            /**
             * @ngdoc method
             * @name resources.service#isOnline
             * @methodOf resources.service:JsonData
             *
             * @description
             * Den Online-Status der App überprüfen
             * @example
             * JsonData.isOnline()
             * @returns {boolean} Liefert den Online-Status der App
             */
            isOnline: function () {
                return isOnline;
            },
            /**
             * @ngdoc object
             * @name resources.service#AutPromise
             * @methodOf resources.service:JsonData
             * @description
             * Wenn dieses Attribut die Aut Erdbebendaten zurückliefert dann wird die Applikation gestartet.
             *  -> Start der Applikation hängt von diesem Attribut ab
             * @example
             * var autData = JsonData.AutPromise;
             */
            AutPromise: restEndpoint.AutPromise,
            /**
             * @ngdoc method
             * @name resources.service#getAut
             * @methodOf resources.service:JsonData
             *
             * @description
             * Österreichische Erdbebendaten abfragen
             * @example
             * JsonData.getAut()
             * @returns {[quakeData]} Österreichische Erbebendaten
             */
            getAut: function () {
                return restEndpoint.getAut();
            },
            //Ein Erdbeben nach ID Abfragen (Welt)
            /**
             * @ngdoc method
             * @name resources.service#getQuakefromIdWorld
             * @methodOf resources.service:JsonData
             *
             * @description
             * Ein erdbeben nach id Abfragen wird bei der erdbeben detail Seite benötigt
             * @example
             * JsonData.getAut()
             * @returns {quakeData} Erdbeben der ID entprechend
             */
            getQuakefromIdWorld: function (id) {
                return restEndpoint.getQuakefromIdWorld(id);
            },
            /**
             * @ngdoc method
             * @name resources.service#getWorld
             * @methodOf resources.service:JsonData
             *
             * @description
             * Österreichische Erdbebendaten abfragen
             * @example
             * JsonData.getWorld()
             * @returns {[quakeData]} Alle Erdbebendaten inkl. Österrreichische
             */
            getWorld: function () {
                return restEndpoint.getWorld();
            },
            /**
             * @ngdoc method
             * @name resources.service#getEu
             * @methodOf resources.service:JsonData
             * @description
             * Europäische Erdbebendaten abfragen
             * @example
             * JsonData.getEu()
             * @returns {[quakeData]} Erdbebendaten nach EU gefiltert(Kontinent)
             */
            getEu: function () {
                return restEndpoint.getEu();
            },

            getMoreData: function (location) {
                return restEndpoint.getMoreData(location);
            }
        };
    })
    /**
     * @ngdoc service
     * @name resources.service:DataGeoWebZAMG
     * @description
     * # rest
     * Ein Service um Erdbebendaten von der REST Schnittstelle der [ZAMG] abzufragen
     * [ZAMG]: http://geoweb.zamg.ac.at/fdsnws/app/1/query
     */
    .factory('DataGeoWebZAMG', function ($http, $ionicLoading, ApiEndpointZAMG, $templateCache) {
        var atData = null;
        var atDataWithObjects = null;
        var atLastDate = null;
        var worldData = null;
        var worldDataWithObjects = null;
        var worldLastDate = null;
        var euData = null;
        var euDataWithObjects = null;
        var euLastDate = null;

        var AutPromise = $http({
            method: "GET",
            url: ApiEndpointZAMG.url + '/query?orderby=time;location=austria;limit=10',
            cache: $templateCache
        }).
        then(function (response) {
            atData = response.data;
            return true;
        }, function (response) {
            return false;
        });
        //Abfrage der aller Erdbeben
        var getWorldData = function () {
            $http.get(ApiEndpointZAMG.url + '/query?orderby=time;location=welt;limit=10').success(function (data) {
                worldData = data;
            });
        };
        var getEuData = function () {
            $http.get(ApiEndpointZAMG.url + '/query?orderby=time;location=europa;limit=10').success(function (data) {
                euData = data;
            });
        };
        /**
         * @ngdoc method
         * @name resources.service#quakeClasses
         * @methodOf resources.service:DataGeoWebZAMG
         *
         * @description
         * Funktion um die Farbe der Erdbeben in der home.html zu bestimmen
         * Sie wird in **convertFeatureToQuakeObject** verwendet.
         * @example
         * quakeClasses(feature.properties.mag),
         * @param {int} mag magnitude vom Erdbeben(Feature)
         * @returns {quakeData} Liefert ein formatiertes Object, welches in ein Array gepackt werden kann
         */
        var quakeClasses = function (mag) {
            if (mag < 5) {
                return "item-balanced";
            }
            if (mag >= 5 && mag < 6) {
                return "item-energized";
            }
            if (mag >= 6) {
                return "item-assertive";
            }
        };
        /**
         * @ngdoc method
         * @name resources.service#convertFeatureToQuakeObject
         * @methodOf resources.service:DataGeoWebZAMG
         *
         * @description
         * Funktion um JsonDaten in das vorgegebene Objekt umzuwandeln.
         * @example
         * convertFeatureToQuakeObject(atData.features[i]);
         * @param {Object} feature feature = ein Erdbeben
         * @returns {quakeData} Liefert ein formatiertes Object, welches in ein Array gepackt werden kann
         */
        var convertFeatureToQuakeObject = function (feature) {
            var distanceFromPhoneToQuake = "Bitte Ortungsdienste aktivieren";
            return new quakeData(
                feature.id,
                feature.properties.mag,
                feature.properties.time,
                feature.properties.lon,
                feature.properties.lat,
                feature.properties.maptitle.substring(13),
                distanceFromPhoneToQuake,
                quakeClasses(feature.properties.mag),
                feature.properties.ldate,
                feature.properties.ltime,
                feature.properties.tz
            );
        };


        return {
            /**
             * @ngdoc property
             * @name resources.service#AutPromise
             * @description
             * Dieses "Versprechen" wird in der **app.js** aufgerufen, nur wenn dieses Verpsrechen erfüllt ist wird die App gestartet
             * <pre>
             * var AutPromise = $http({method: "GET", url: ApiEndpointZAMG.url+'/query?orderby=time;location=austria;limit=10', cache: $templateCache}).
             * then(function(response) {
             *     atData = response.data;
             *     return true;
             * }, function(response) {
             *     return false;
             * });
             * </pre>
             * @propertyOf resources.service:DataGeoWebZAMG
             * @returns {boolean} true wenn die Daten erfolgreich abgefragt wurden
             */
            AutPromise: AutPromise,
            //Oesterrechische Erdbeben Daten abfragen
            //return: Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
            /**
             * @ngdoc method
             * @name resources.service#getAut
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Österrechische Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getAut();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getAut: function () {
                //alle Erdbebendaten im hintergrund Abfragen
                getEuData();
                getWorldData();
                var bebenAutArray = [];
                for (var i = 0; i < atData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(atData.features[i]));
                    if (i === atData.features.length - 1) {
                        atLastDate = atData.features[i].properties.time;
                    }
                }
                atDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getEu
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Europäische Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getEu();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getEu: function () {
                var bebenAutArray = [];
                for (var i = 0; i < euData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(euData.features[i]));
                    if (i == euData.features.length - 1) {
                        euLastDate = euData.features[i].properties.time;
                    }
                }
                euDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getWorld
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Alle Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getWorld();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getWorld: function () {
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(worldData.features[i]));
                    if (i == worldData.features.length - 1) {
                        worldLastDate = worldData.features[i].properties.time;
                    }
                }
                worldDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getMoreData
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Erdbebendaten entsprechend der location laden, fortlaufend zu bereits vorhandenen Erdbebendaten
             * @param {String} location aut,eu oder world
             * @example
             * JsonData.getMoreData(location);
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getMoreData: function (location) {
                switch (location) {
                    case "aut":
                        return $http.get(ApiEndpointZAMG.url + '/query?endtime=' + atLastDate + ';orderby=time;limit=10;location=austria').then(function (response) {
                            var bebenAutArray = [];
                            data = response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if (i == data.features.length - 1) {
                                    atLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0, 1);
                            atDataWithObjects = atDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                    case "world":
                        return $http.get(ApiEndpointZAMG.url + '/query?endtime=' + worldLastDate + ';orderby=time;limit=10;location=welt').then(function (response) {
                            var bebenAutArray = [];
                            data = response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if (i == data.features.length - 1) {
                                    worldLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0, 1);
                            worldDataWithObjects = worldDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                    case "eu":
                        return $http.get(ApiEndpointZAMG.url + '/query?endtime=' + euLastDate + ';orderby=time;limit=10;location=europa').then(function (response) {
                            var bebenAutArray = [];
                            data = response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if (i == data.features.length - 1) {
                                    euLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0, 1);
                            euDataWithObjects = euDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                }
            },
            /**
             * @ngdoc method
             * @name resources.service#getQuakefromIdWorld
             * @methodOf resources.service:DataGeoWebZAMG
             *
             * @description
             * Ein Erdbeben aus den bereits geholten Erdbebendaten bekommen
             * Wird verwendet um die Detailansicht der Erdbeben darzustellen
             * @param {int} id Erdbebenid
             * @example
             * JsonData.getQuakefromIdWorld(id);
             * @returns {quakeData} Ein Erdbebenobjekt, mit dem angeforderten Erdbeben
             */
            getQuakefromIdWorld: function (id) {
                if (atDataWithObjects != null) {
                    for (var i = 0; i < atDataWithObjects.length; i++) {
                        if (atDataWithObjects[i].id == id) {
                            return atDataWithObjects[i];
                        }
                    }
                }
                if (worldDataWithObjects != null) {
                    for (var i = 0; i < worldDataWithObjects.length; i++) {
                        if (worldDataWithObjects[i].id == id) {
                            return worldDataWithObjects[i];
                        }
                    }
                }
                if (euDataWithObjects != null) {
                    for (var i = 0; i < euDataWithObjects.length; i++) {
                        if (euDataWithObjects[i].id == id) {
                            return euDataWithObjects[i];
                        }
                    }
                }
            }

        };
    })

    /**
     * @ngdoc service
     * @name resources.service:QuakeReport
     * @description
     * Diese Factory wird zum sammeln/senden der neuen, vom User eingegebenen, Erdbebendaten verwendet.
     */
    .factory('QuakeReport', function ($http,AppInfo,GeowebEndpoint) {
        var quakeDataObj = new quakeReport(
            null,
            null,
            null,
            null,
            null,
            "",
            "",
            "",
            "",
            "",
            '',
            null,
            null
        );

        return {
            /**
             * @ngdoc method
             * @name resources.service#getQuakeDataObject
             * @methodOf resources.service:QuakeReport
             *
             * @description 
             * @example
             * quakedata = QuakeReport.getQuakeDataObject();
             */
            getQuakeDataObject: function () {
                return quakeDataObj;
            },
            /**
             * @ngdoc method
             * @name resources.service#setZusatzfragen
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {zusatzFragen} zusatfragen zusatzfragen
             * @example
             * zusatzFragen.f2 = ($scope.input.f2);
             * QuakeReport.setZusatzfragen(zusatzFragen);
             */
            setZusatzfragen:function (zusatzfragen){
                quakeDataObj.addquestions=zusatzfragen;
            },
            /**
             * @ngdoc method
             * @name resources.service#setId
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} id Erdbebenid
             * @example
             * QuakeReport.setId(1123458);
             */
            setId: function (id) {
                quakeDataObj.referenzID = id;
            },
            /**
             * @ngdoc method
             * @name resources.service#setLon
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {float} lon longtitude
             * @example
             * QuakeReport.setLon(-12.23);
             */
            setLon: function (lon) {
                quakeDataObj.locLon = lon;
            },
            /**
             * @ngdoc method
             * @name resources.service#setLat
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {float} lat latitude
             * @example
             * QuakeReport.setId(1123458);
             */
            setLat: function (lat) {
                quakeDataObj.locLat = lat;
            },
            /**
             * @ngdoc method
             * @name resources.service#setLocPrec
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} prec Genauigkeit der GPS-Lokationsdaten
             * @example
             * QuakeReport.setId(10);
             */
            setLocPrec: function (prec) {
                //1.2.2017
                // Erzwinge . falls die Precision nichts zurückliefert
                var precAsString = ""+prec;
                if(precAsString){
                    if(precAsString.includes(".")){
                        quakeDataObj.locPrecision = prec;
                    } else {
                        quakeDataObj.locPrecision = prec+".0";
                    }

                } else {
                    quakeDataObj.locPrecision = null;
                }

            },
            /**
             * @ngdoc method
             * @name resources.service#setLocLastUpdate
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} time JSON-String UTC-Timestamp
             * @example
             * QuakeReport.setLocLastUpdate("2016-01-11T18:02:04.151Z");
             */
            setLocLastUpdate: function (time) {
                if(time.includes(".")){
                    quakeDataObj.locLastUpdate = time.split(".")[0]+"Z"
                } else {
                    quakeDataObj.locLastUpdate = time;
                }
            },
            /**
             * @ngdoc method
             * @name resources.service#setZIP
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} zipData Postleitzahl
             * @example
             * QuakeReport.setZIP(1200);
             */
            setZIP: function (zipData) {
                quakeDataObj.mlocPLZ = zipData;
            },
            /**
             * @ngdoc method
             * @name resources.service#setPlace
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} place Ortangabe "Wien"
             * @example
             * QuakeReport.setPlace("Wien");
             */
            setPlace: function (place,strasse) {
                quakeDataObj.mlocOrtsname = place+", "+strasse;
            },
            /**
             * @ngdoc method
             * @name resources.service#setFloor
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} floor Stockwerk
             * @example
             * QuakeReport.setFloor(0);
             */
            setFloor: function (floor) {
                quakeDataObj.stockwerk = floor;
            },
            /**
             * @ngdoc method
             * @name resources.service#setMagClass
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {int} setMagClass Erdbebenstärke (Comics)
             * @example
             * QuakeReport.setMagClass(1);
             */
            setMagClass: function (mag) {
                quakeDataObj.klassifikation = mag;
            },
            /**
             * @ngdoc method
             * @name resources.service#setDateTime
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} time JSON-String UTC-Timestamp
             * @example
             * QuakeReport.setId("2016-01-11T18:02:04.151Z");
             */
            //Zeit und datum in utc
            setDateTime: function (time) {
                if(time.includes(".")){
                    quakeDataObj.verspuert = time.split(".")[0]+"Z"
                } else {
                    quakeDataObj.verspuert = time;
                }
            },
            /**
             * @ngdoc method
             * @name resources.service#setComment
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} comment Kommentar
             * @example
             * QuakeReport.setComment("Mein Kommentar");
             */
            //Die Bebenintensitaet setzten
            setComment: function (comment) {
                quakeDataObj.kommentar = comment;
            },
            /**
             * @ngdoc method
             * @name resources.service#setContact
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} contact Kontaktdaten
             * @example
             * QuakeReport.setContact("mail@mail.com 066012348");
             */
            setContact: function (contact) {
                quakeDataObj.kontakt = contact;
            },
            /**
             * @ngdoc method
             * @name resources.service#setStrasse
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * @param {String} strasse Strasse
             * @example
             * QuakeReport.setStrasse("Asdgasse 1");
             */
            setStrasse: function (strasse) {
                quakeDataObj.mlocStrasse = strasse;
            },
            /**
             *
             * @param callback
             */


            /**
             * @ngdoc method
             * @name resources.service#sendData
             * @methodOf resources.service:QuakeReport
             *
             * @description
             * Senden aller gesammelten Erdbebendaten
             * @example
             * QuakeReport.sendData();
             */
            sendData: function () {
                if(!quakeDataObj.mlocPLZ){
                    quakeDataObj.mlocPLZ = "unk"
                }
                console.log(JSON.stringify(quakeDataObj));

                    var req = {
                        method: 'POST',
                        url: GeowebEndpoint.url+'/quakeapi/v02/message',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': 'Basic cXVha2VhcGk6I3FrcCZtbGRuZyM=',
                            'X-QuakeAPIKey': AppInfo.getApiKey()
                        },
                        data: JSON.stringify(quakeDataObj) //JSON Objekt in String umwandeln
                    };
                    $http(req).then(function (response) {
                        //Check ob Response Code 200
                        console.log("response: "+response);
                    });
                console.log(JSON.stringify(quakeDataObj));
                return JSON.stringify(quakeDataObj);
            }
        };
    })

    /**
     * @ngdoc service
     * @name persistence.service:AppInfo
     * @description
     * Mithilfe dieser Factory werden alle Funktionen, welche ein zwischenspeichern benoetigen, Ausgefuehrt werden
     */
    .factory('AppInfo', function ($window,$http,GeowebEndpoint) {
        var firstTimeGpsPopup=true;
        return {
            //----- Ueberpruefung ob die App zum ersten mal ausgefuehrt wird -----
            setInitialRun: function (initial) {
                $window.localStorage["initialRun"] = (initial ? true : false);
            },
            isInitialRun: function () {
                return ($window.localStorage["initialRun"] === "false") ? false : true;
            },
            // ENDE
            //----- API Key verwaltung -----
            generateAPIKey: function () {
                var req2 = {
                    method: 'POST',
                    url: GeowebEndpoint.url+'/quakeapi/v02/getapikey',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Basic cXVha2VhcGk6I3FrcCZtbGRuZyM='
                    },
                    data: ''
                };
                $http(req2).then(function (response) {
                    $window.localStorage["apiKey"] = response.data.apikey;
                    console.log("api: "+response.data.apikey)
                });
            },
            getApiKey: function(){
                return $window.localStorage["apiKey"];
            },
            //ENDE
            //----- Offline Melden von Erdbeben -----
            cacheQuake: function(quakeReportJson){
                $window.localStorage["cachedQuake"]=quakeReportJson;
            },
            reportCachedQuake: function(){
                var quakeDataObj=$window.localStorage["cachedQuake"];
                var req = {
                    method: 'POST',
                    url: GeowebEndpoint.url+'/quakeapi/v02/message',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Basic cXVha2VhcGk6I3FrcCZtbGRuZyM=',
                        'X-QuakeAPIKey': $window.localStorage["apiKey"]
                    },
                    data: quakeDataObj //JSON Objekt in String umwandeln
                };
                $http(req).then(function (response) {
                    //Check ob Response Code 200
                    console.log("response: "+response);
                });
            },
            isCachedQuake: function () {
                //console.log("cache: "+$window.localStorage["cachedQuake"]);
                if($window.localStorage["cachedQuake"] === 'undefined' ){
                    return false;
                }else {
                    return true;
                }
            },
            removeCachedQuake: function () {
                $window.localStorage["cachedQuake"]= undefined;
            },
            //ENDE
            //----- GPS Popup nur einmal anzeigen -----
            firstTimeGPSPopup: function () {
                if(firstTimeGpsPopup){
                    firstTimeGpsPopup=false;
                    return true;
                } else {
                    return false;
                }
            }
            //ENDE
        }
    })
    /**
     * @ngdoc service
     * @name resources.service:DataGeoWebZAMGStaticFiles
     * @description
     * # rest
     * Ein Service um Erdbebendaten von der REST Schnittstelle der [ZAMG] abzufragen
     * [ZAMG]: http://geoweb.zamg.ac.at/fdsnws/app/1/query
     */
    .factory('DataGeoWebZAMGStaticFiles', function ($http, $ionicLoading, ApiEndpointZAMG, ApiEndpointZAMGFiles, $templateCache) {
        var atData = null;
        var atDataWithObjects = null;
        var atLastDate = null;
        var worldData = null;
        var worldDataWithObjects = null;
        var worldLastDate = null;
        var euData = null;
        var euDataWithObjects = null;
        var euLastDate = null;

        var AutPromise = $http({
            method: "GET",
            url: ApiEndpointZAMGFiles.url + '/at_latest.json',
            cache: $templateCache
        }).
        then(function (response) {
            atData = response.data;
            return true;
        }, function (response) {
            return false;
        });
        //Abfrage der aller Erdbeben
        var getWorldData = function () {
            $http.get(ApiEndpointZAMGFiles.url + '/web_latest.json').success(function (data) {
                worldData = data;
                return true;
            });
        };
        var getEuData = function () {
            $http.get(ApiEndpointZAMGFiles.url + '/eu_latest.json').success(function (data) {
                euData = data;
            });
        };
        /**
         * @ngdoc method
         * @name resources.service#quakeClasses
         * @methodOf resources.service:DataGeoWebZAMGStaticFiles
         *
         * @description
         * Funktion um die Farbe der Erdbeben in der home.html zu bestimmen
         * Sie wird in **convertFeatureToQuakeObject** verwendet.
         * @example
         * quakeClasses(feature.properties.mag),
         * @param {int} mag magnitude vom Erdbeben(Feature)
         * @returns {quakeData} Liefert ein formatiertes Object, welches in ein Array gepackt werden kann
         */
        var quakeClasses = function (mag) {
            if (mag < 5) {
                return "item-balanced";
            }
            if (mag >= 5 && mag < 6) {
                return "item-energized";
            }
            if (mag >= 6) {
                return "item-assertive";
            }
        };
        /**
         * @ngdoc method
         * @name resources.service#convertFeatureToQuakeObject
         * @methodOf resources.service:DataGeoWebZAMGStaticFiles
         *
         * @description
         * Funktion um JsonDaten in das vorgegebene Objekt umzuwandeln.
         * @example
         * convertFeatureToQuakeObject(atData.features[i]);
         * @param {Object} feature feature = ein Erdbeben
         * @returns {quakeData} Liefert ein formatiertes Object, welches in ein Array gepackt werden kann
         */
        var convertFeatureToQuakeObject = function (feature) {
            var timeFull = feature.properties.time;
            var dateAndTime = timeFull.split("T");
            var distanceFromPhoneToQuake = "Berechne...";
            return new quakeData(
                feature.id,
                Math.round(feature.properties.mag * 10) / 10,
                feature.properties.time,
                Math.round(feature.properties.lon * 100) / 100,
                Math.round(feature.properties.lat * 100) / 100,
                Math.round(feature.properties.depth),
                feature.properties.maptitle.substring(13),
                distanceFromPhoneToQuake,
                quakeClasses(feature.properties.mag),
                feature.properties.ldate,
                feature.properties.ltime,
                feature.properties.tz
            );
        };


        return {
            /**
             * @ngdoc property
             * @name resources.service#AutPromise
             * @description
             * Dieses "Versprechen" wird in der **app.js** aufgerufen, nur wenn dieses Verpsrechen erfüllt ist wird die App gestartet
             * <pre>
             * var AutPromise = $http({method: "GET", url: ApiEndpointZAMG.url+'/query?orderby=time;location=austria;limit=10', cache: $templateCache}).
             * then(function(response) {
             *     atData = response.data;
             *     return true;
             * }, function(response) {
             *     return false;
             * });
             * </pre>
             * @propertyOf resources.service:DataGeoWebZAMGStaticFiles
             * @returns {boolean} true wenn die Daten erfolgreich abgefragt wurden
             */
            AutPromise: AutPromise,

            reloadData: function (location) {
                switch (location) {
                    case "aut":
                        if (AutPromise) {
                            return this.getAut();
                        }
                        break;
                    case "world":
                        getWorldData();
                        return this.getWorld();
                        break;
                    case "eu":
                        getEuData();
                        return this.getEu();
                }
            },

            /**
             * @ngdoc method
             * @name resources.service#getAut
             * @methodOf resources.service:DataGeoWebZAMGStaticFiles
             *
             * @description
             * Österrechische Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getAut();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getAut: function () {
                //alle Erdbebendaten im hintergrund Abfragen
                getEuData();
                getWorldData();
                var bebenAutArray = [];
                for (var i = 0; i < atData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(atData.features[i]));
                    if (i === atData.features.length - 1) {
                        atLastDate = atData.features[i].properties.time;
                    }
                }
                atDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getEu
             * @methodOf resources.service:DataGeoWebZAMGStaticFiles
             *
             * @description
             * Europäische Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getEu();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getEu: function () {
                var bebenAutArray = [];
                for (var i = 0; i < euData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(euData.features[i]));
                    if (i == euData.features.length - 1) {
                        euLastDate = euData.features[i].properties.time;
                    }
                }
                euDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getWorld
             * @methodOf resources.service:DataGeoWebZAMGStaticFiles
             *
             * @description
             * Alle Erdbeben Daten abfragen, verwendung über JsonData
             * @example
             * JsonData.getWorld();
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getWorld: function () {
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(worldData.features[i]));
                    if (i == worldData.features.length - 1) {
                        worldLastDate = worldData.features[i].properties.time;
                    }
                }
                worldDataWithObjects = bebenAutArray;
                return bebenAutArray;
            },
            /**
             * @ngdoc method
             * @name resources.service#getMoreData
             * @methodOf resources.service:DataGeoWebZAMGStaticFiles
             *
             * @description
             * Erdbebendaten entsprechend der location laden, fortlaufend zu bereits vorhandenen Erdbebendaten
             * @param {String} location aut,eu oder world
             * @example
             * JsonData.getMoreData(location);
             * @returns {[quakeData]} Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
             */
            getMoreData: function (location) {
                switch (location) {
                    case "aut":
                        return $http.get(ApiEndpointZAMG.url + '/query?endtime=' + atLastDate + ';orderby=time;limit=10;location=austria').then(function (response) {
                            var bebenAutArray = [];
                            data = response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if (i == data.features.length - 1) {
                                    atLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0, 1);
                            atDataWithObjects = atDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                    case "world":
                        return $http.get(ApiEndpointZAMG.url + '/query?endtime=' + worldLastDate + ';orderby=time;limit=10;location=welt').then(function (response) {
                            var bebenAutArray = [];
                            data = response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if (i == data.features.length - 1) {
                                    worldLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0, 1);
                            worldDataWithObjects = worldDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                    case "eu":
                        return $http.get(ApiEndpointZAMG.url + '/query?endtime=' + euLastDate + ';orderby=time;limit=10;location=europa').then(function (response) {
                            var bebenAutArray = [];
                            data = response.data;
                            for (var i = 0; i < data.features.length; i++) {
                                bebenAutArray.push(convertFeatureToQuakeObject(data.features[i]));
                                if (i == data.features.length - 1) {
                                    euLastDate = data.features[i].properties.time;
                                }
                            }
                            bebenAutArray.splice(0, 1);
                            euDataWithObjects = euDataWithObjects.concat(bebenAutArray);
                            return bebenAutArray;
                        });
                        break;
                }
            },
            /**
             * @ngdoc method
             * @name resources.service#getQuakefromIdWorld
             * @methodOf resources.service:DataGeoWebZAMGStaticFiles
             *
             * @description
             * Ein Erdbeben aus den bereits geholten Erdbebendaten bekommen
             * Wird verwendet um die Detailansicht der Erdbeben darzustellen
             * @param {int} id Erdbebenid
             * @example
             * JsonData.getQuakefromIdWorld(id);
             * @returns {quakeData} Ein Erdbebenobjekt, mit dem angeforderten Erdbeben
             */
            getQuakefromIdWorld: function (id) {
                if (atDataWithObjects != null) {
                    for (var i = 0; i < atDataWithObjects.length; i++) {
                        if (atDataWithObjects[i].id == id) {
                            return atDataWithObjects[i];
                        }
                    }
                }
                if (worldDataWithObjects != null) {
                    for (var i = 0; i < worldDataWithObjects.length; i++) {
                        if (worldDataWithObjects[i].id == id) {
                            return worldDataWithObjects[i];
                        }
                    }
                }
                if (euDataWithObjects != null) {
                    for (var i = 0; i < euDataWithObjects.length; i++) {
                        if (euDataWithObjects[i].id == id) {
                            return euDataWithObjects[i];
                        }
                    }
                }
            }

        };
    })

    .factory('DataSeismicPortal', function ($http, $templateCache, ApiEndpointSeismic) {
        //Ergebnis der Abfrage von ca.(mit lat und long eingeschraenkt) Oesterreich
        var myData = null;
        //Ergebnis Abfrage aller Erdbeben
        var worldData = null;


        var AutPromise = $http({
            method: "GET",
            url: ApiEndpointSeismic.url + '/query?orderby=time&limit=50&minlat=46.3780&maxlat=49.0171&minlon=9.5359&maxlon=17.1627&format=json&nodata=404',
            cache: $templateCache
        }).
        then(function (response) {
            myData = response.data;
            return true;
        }, function (response) {
            return false;
        });

        //Abfrage der aller Erdbeben
        var getWorldData =
            $http.get(ApiEndpointSeismic.url + '/query?orderby=time&limit=50&format=json&nodata=404').success(function (data) {
                worldData = data;
            });

        //Hier wird die Farbe nach dem schweregrad des Erdbebens vergeben
        var quakeClasses = function (mag) {
            if (mag < 5) {
                return "item-balanced";
            }
            if (mag >= 5 && mag < 6) {
                return "item-energized";
            }
            if (mag >= 6) {
                return "item-assertive";
            }
        };

        var convertFeatureToQuakeObject = function (feature) {
            var timeFull = feature.properties.time;
            var dateAndTime = timeFull.split("T");
            var date = dateAndTime[0];
            var timeLocal = dateAndTime[1].substring(0, 8) + " UTC";
            var distanceFromPhoneToQuake = "";
            return new quakeData(
                feature.id,
                feature.properties.mag,
                feature.properties.time,
                feature.properties.lon,
                feature.properties.lat,
                feature.properties.flynn_region,
                distanceFromPhoneToQuake,
                quakeClasses(feature.properties.mag),
                "19.1.2016",
                "10:10",
                "MEZ"
            );

        };

        return {
            AutPromise: AutPromise,
            //Oesterrechische Erdbeben Daten abfragen
            //return: Ein Array mit Erdbeben Objekten welche die Daten formatiert beinhalten
            getAut: function () {
                //alle Erdbebendaten im hintergrund Abfragen
                getWorldData;
                var bebenAutArray = [];
                for (var i = 0; i < myData.features.length; i++) {
                    if (myData.features[i].properties.flynn_region === "AUSTRIA") {
                        bebenAutArray.push(convertFeatureToQuakeObject(myData.features[i]));
                    }
                }
                return bebenAutArray;
            },
            //Ein Erdbeben nach ID Abfragen (Welt)
            getQuakefromIdWorld: function (id) {
                for (var i = 0; i < worldData.features.length; i++) {
                    if (worldData.features[i].id === id) {
                        return convertFeatureToQuakeObject(worldData.features[i]);
                    }
                }
                for (var i = 0; i < myData.features.length; i++) {
                    if (myData.features[i].id === id) {
                        return convertFeatureToQuakeObject(myData.features[i]);
                    }
                }
            },
            //Alle Erdbebendaten abfragen
            //return: Erdbeben Objekte , daten formatiert
            getWorld: function () {
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    bebenAutArray.push(convertFeatureToQuakeObject(worldData.features[i]));
                }
                return bebenAutArray;
            },
            //Abfrage der Erdbeben in der EU
            //return : Erdbeben Objekte , daten formatiert und nach EU gefieltert(Kontinent)
            getEu: function () {
                var euStates = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City (Holy See)'];
                var bebenAutArray = [];
                for (var i = 0; i < worldData.features.length; i++) {
                    for (var o = 0; o < euStates.length; o++) {
                        if (worldData.features[i].properties.flynn_region.indexOf(euStates[o].toUpperCase()) != -1) {
                            bebenAutArray.push(convertFeatureToQuakeObject(worldData.features[i]));
                            break;
                        }
                    }
                }
                return bebenAutArray;
            }
        };
    });


