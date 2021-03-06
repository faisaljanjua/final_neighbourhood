var map, marker, infoWindow;
var markers = [];
var lastMarker;
var inited = false;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'),
        {
            zoom: 11,
            center: new google.maps.LatLng(24.4481884, 54.3803007),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    infowindow = new google.maps.InfoWindow();
}
function point(tag, name, location, id) {
    var self = this;
    this.tag = ko.observable(tag);
    this.name = ko.observable(name);
    this.id = ko.observable(id);
    this.lat = ko.observable(location.lat);
    this.lng = ko.observable(location.lng);
}
function setContent(id, marker) {
    if (lastMarker)
        lastMarker.setAnimation(null);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    lastMarker = marker;
    var url = 'https://api.foursquare.com/v2/venues/' + id + '?client_id=JTPVQE4CDRIR0DFXAKDLZ3LHNAOWFLUGMNL2UCHQOXU0VRUE&client_secret=OEYN0XBBIEGYWMDA0DVJZT0VMNYZC0C231IRW2OOTGSNY1SC&v=20130815';
    $.getJSON(url, function (data) {
        self.url = data.response.venue.url;
        if (!self.url) { self.url = ''; }
        self.phone = data.response.venue.contact.formattedPhone;
        if (!self.phone) { self.phone = ''; }
        self.twitter = data.response.venue.contact.twitter;
        if (!self.twitter) { self.twitter = ''; }
        self.facebook = data.response.venue.contact.facebook;
        if (!self.facebook) { self.facebook = ''; }
        self.name = data.response.venue.name; self.rating = data.response.venue.rating;
        if (!self.rating) { self.rating = ''; }
        self.timezone = data.response.venue.timeZone;
        if (!self.timezone) { self.timezone = ''; }
        self.photoPrefix = data.response.venue.bestPhoto.prefix;
        self.photoSuffix = data.response.venue.bestPhoto.suffix;
        this.contentString = ko.observable('');
        self.content = "<h5>" + self.name + "</h5>" +
            "<div id='iwpic'><img src=" + self.photoPrefix +
            "110x110" + self.photoSuffix + " alt=''> </div>" +
            "<h6 style='margin-bottom:0px;'> Rating </h6>" +
            self.rating + "<h6 style='margin-bottom:0px;'> TimeZone </h6>" +
            self.timezone + "<p><ul class='list-inline'><li><a href='https://www.twitter.com/" +
            self.twitter + "' target='_blank'><img src='img/twitter.png'></a></li>" +
            "<li><a href='http://www.facebook.com/" +
            self.facebook + "' target='_blank'><img src='img/facebook.png'></a></li></p>" +
            "<p><a href='" + self.url + "' target='_blank'>" + self.url + "</a></p>";
        infowindow.setContent(self.content);
    }
    ).fail(function (err) {
        self.content = "Getting error to fetch data from SquareFour API";
        infowindow.setContent(self.content);
    });
    infowindow.setContent(self.content);
    infowindow.open(map, marker);
}
function setPoints(arr, isListClick) {
    if (inited == false) {
        var points = vm.points();
        points.forEach(function (currentValue, index) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(currentValue.lat(), currentValue.lng()),
                map: map,
                animation: google.maps.Animation.DROP
            });
            google.maps.event.addListener(marker, 'click', function () {
                setContent(currentValue.id(), this);
            });
            markers.push(marker);
        });
        inited = true;
    }
    if (markers.length) {
        for (i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
        }
    }

    // creating marker
    arr.forEach(function (currentValue, index) {
        var j = 0;
        for (i = 0; i < markers.length; i++) {
            if (markers[i].position.lat().toFixed(7) == currentValue.lat().toFixed(7) && markers[i].position.lng().toFixed(7) == currentValue.lng().toFixed(7)) {
                markers[i].setAnimation(google.maps.Animation.DROP);
                markers[i].setVisible(true);
                j = i;
            }
        }
        if (isListClick) {
            setContent(arr[0].id(), markers[j]);
            markers[j].setVisible(true);
            markers[j].setAnimation(google.maps.Animation.BOUNCE);
        }
        else {
            if (infowindow) {
                infowindow.close();
            }
        }
    });
}
function viewModel() {
    var self = this; this.points = ko.observableArray([]);
    this.selectedPoint = ko.observable('');
    this.setSelected = function (item) {
        if (item !== "All") {
            self.selectedPoint(item);
            setPoints(vm.filteredNames());
        }
        else {
            self.selectedPoint(null);
            setPoints(vm.points());
        }
    };
    this.currentPoint = function (e) {
        setPoints([e], true);
    };
    this.justtags = ko.computed(function () {
        var tags = ko.utils.arrayMap(this.points(), function (item) {
            return item.tag();
        });
        tags.push("All");
        return tags.sort();
    }, this);
    this.uniquetags = ko.dependentObservable(function () {
        return ko.utils.arrayGetDistinctValues(self.justtags()).sort();
    }, this);
    this.filteredNames = ko.computed(function () {
        var filter = self.selectedPoint();
        return ko.utils.arrayFilter(this.points(), function (item) {
            if (filter) {
                if (item.tag() === filter) {
                    return item;
                }
            }
            else {
                return item;
            }
        });
    }, this);
}
var data = [
    { tag: "Malls", name: 'Al Wahda Mall', location: { lat: 24.4704059, lng: 54.3730044 }, id: "4b77f3f3f964a520f3af2ee3" },
    { tag: "Malls", name: 'WTC Mall', location: { lat: 24.4879306, lng: 54.3574792 }, id: "527d28b811d24b0b8db91153" },
    { tag: "Malls", name: 'Abu Dhabi Mall', location: { lat: 24.4957638, lng: 54.3828401 }, id: "4b6c1421f964a520b4222ce3" },
    { tag: "Malls", name: 'Mushrif Mall', location: { lat: 24.4343964, lng: 54.413177 }, id: "4e33fd7088772aabd8b21cc9" },
    { tag: "Malls", name: 'Khalidiyah Mall', location: { lat: 24.470316, lng: 54.3519809 }, id: "4b698711f964a52000a62be3" },
    { tag: "Malls", name: 'Marina Mall', location: { lat: 24.4757692, lng: 54.3220406 }, id: "4b518a1ff964a5203f4f27e3" },
    { tag: "Trending", name: 'Yas Marina Circuit', location: { lat: 24.470596, lng: 54.6061995 }, id: "4d33e591b5c78eec97344cbf" },
    { tag: "Trending", name: 'Umm Al Emarat Park', location: { lat: 24.4542925, lng: 54.3809231 }, id: "52958c2d11d2ce1a0539c550" },
    { tag: "Trending", name: 'Formula Rossa', location: { lat: 24.4845779, lng: 54.6090108 }, id: "4ce2a1de94c3b60cbe227dea" },
    { tag: "Trending", name: 'Vox Cinema', location: { lat: 24.4905375, lng: 54.6078702 }, id: "546df0a0498e8013596c413e" },
    { tag: "Trending", name: 'Yas Waterworld', location: { lat: 24.488862, lng: 54.6003309 }, id: "5084f6d9e4b0974e52a5c791" },
    { tag: "Trending", name: 'Al Forsan Wakeboarding Water Park', location: { lat: 24.4041368, lng: 54.5447345 }, id: "4f8029f6e4b085b99aa6fe07" },
    { tag: "Trending", name: 'Qasr Al Hosn', location: { lat: 24.4826733, lng: 54.3563314 }, id: "512f5060e4b0a28d8f1f9709" },
    { tag: "Trending", name: 'Manarat Al Saadiyat', location: { lat: 24.5338255, lng: 54.4189145 }, id: "4c10fc19b4aeef3b9965fc0f" },
    { tag: "Hospital", name: 'Burjeel Hospital', location: { lat: 24.47881, lng: 54.3810582 }, id: "4fb76104e4b0ef494134c6ac" },
];
var vm = new viewModel();
$(document).ready(function () {
    var ErrorHandlingBindingProvider = function () {
        var original = new ko.bindingProvider();

        //determine if an element has any bindings
        this.nodeHasBindings = original.nodeHasBindings;

        //return the bindings given a node and the bindingContext
        this.getBindings = function (node, bindingContext) {
            var result;
            try {
                result = original.getBindings(node, bindingContext);
            }
            catch (e) {
                if (console && console.log) {
                    console.log("Error in binding: " + e.message);
                }
            }

            return result;
        };
    };

    ko.bindingProvider.instance = new ErrorHandlingBindingProvider();
    ko.applyBindings(vm);
    $.each(data, function (i, item) {
        vm.points.push(new point(item.tag, item.name, item.location, item.id));
    });
    setPoints(vm.points());
});
