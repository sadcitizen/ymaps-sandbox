(function ($, window, ymaps) {
    'use strict';
    var myMap,
        coordinates,
        $latitude = $('#latitude'),
        $longitude = $('#longitude'),
        $address = $('#address');

    function init() {
        myMap = new ymaps.Map('ymap', {
            center: [55.16032, 61.40102],
            zoom: 12,
            controls: []
        }, {
            balloonMaxWidth: 200
        });

        myMap.events.add('click', function (e) {
            if (myMap.balloon.isOpen()) {
                myMap.balloon.close();
            }

            coordinates = e.get('coords');

            ymaps.geocode(coordinates, {result: 1}).then(successHandler, errorHandler);
        });

        myMap.events.add('balloonopen', function () {
            myMap.hint.close();
        });
    }

    function successHandler(res) {
        var resObj = res.geoObjects.get(0),
            resBounds = resObj.properties.get('boundedBy'),
            resCoordinates = resObj.geometry.getCoordinates(),
            resName = parseName(resObj.properties.get('name'));

        myMap.setBounds(resBounds, {
            checkZoomRange: true
        });

        myMap.balloon.open(resCoordinates, {
            contentHeader: resName,
            contentBody: '<p><strong>Широта:</strong> ' + coordinates[0].toPrecision(6) + '<br />' +
                '<strong>Долгота:</strong> ' + coordinates[1].toPrecision(6) + '</p>'
        });

        $latitude.val(resCoordinates[0].toPrecision(10));
        $longitude.val(resCoordinates[1].toPrecision(10));
        $address.val(resName);
    }

    function errorHandler(err) {
        console.log(err);
    }

    function parseName(name) {
        return name
            .replace('улица', 'ул.')
            .replace('площадь', 'пл.')
            .replace('проспект', 'пр.');
    }

    ymaps.ready(init);

})(jQuery, this, this.ymaps);