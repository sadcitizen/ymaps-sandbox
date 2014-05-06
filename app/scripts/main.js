(function ($, window, ymaps) {
    'use strict';
    var myMap,
        coordinates,
        $latitude = $('#latitude'),
        $longitude = $('#longitude'),
        $address = $('#address'),
        $search = $('#search'),
        $button = $('#search-btn');

    function init() {
        myMap = new ymaps.Map('ymap', {
            center: [55.16032, 61.40102],
            zoom: 12,
            controls: ['typeSelector', 'zoomControl']
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
            contentBody: '<p><strong>Широта:</strong> ' + resCoordinates[0].toPrecision(6) + '<br />' +
                '<strong>Долгота:</strong> ' + resCoordinates[1].toPrecision(6) + '</p>'
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

    $button.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        searchByAddress($search.val().replace(/\s*/ig, ''));
    });

    function searchByAddress(address) {
        ymaps.geocode('Челябинск, ' + address, {result: 1}).then(successHandler, errorHandler);
    }

    ymaps.ready(init);

})(jQuery, this, this.ymaps);

//http://2gis.ru/chelyabinsk/callout/61.42623300,55.16039100,16/center/61.42623300,55.16039100/zoom/16 - Формат для 2gis
//https://www.google.ru/maps/@55.1602799,61.4258922,16z - Формат для Google Maps