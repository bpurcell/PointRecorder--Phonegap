var baseURL = "http://pointrecorder.com/";
var serviceURL = baseURL + "api/";


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1].replace("#", "");
    }
    return vars;
}

function getCategoriesList(id) {

    var full_url = serviceURL + 'get_cats/' + id + '?jsoncallback=?';
    $.getJSON(full_url,
    {
        format: "jsonp"
    },

    function(data) {

        categories = data;

        $.each(categories,
        function(index, categories) {
            $('#parse_category').append('<option value="' + categories.id + '">' + categories.name + '</option>');
        });

        cat_name = id + 'cat';
        localStorage.setItem(cat_name, JSON.stringify(categories));

    })
    .success(function() {
        $("select#parse_category").selectmenu('refresh');
    });
}

function getHeaderFooter(id) {

    var full_url = serviceURL + 'get_info_applet/' + id + '?jsoncallback=?';

    $.getJSON(full_url,
    {
        format: "jsonp"
    },

    function(data) {

        header = data[0];

        $('#applet_name').html(header.name);
        $('#applet_desc').html(header.desc);
        $('title').prepend(header.name);

        urls = $.cookie('urls')
        if (urls === null)
        {
            urls = [{
                url: id,
                name: header.name
            }]
            $.cookie('urls', urls, {
	            expires: 2592000000
	        })
        } else
        {
            exists = false;
            $.each(urls,
            function(index, value) {
                if (value.url == id) exists = true;
            });

            if (!exists)
            {
                urls.push({
                    url: id,
                    name: header.name
                })
                $.cookie('urls', urls, {
		            expires: 2592000000
		        })
            }
        }


        head_name = id + 'head';
        localStorage.setItem(head_name, JSON.stringify(header));


    });

}



// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
}
function getNearListing(position) {

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var full_url = serviceURL + 'get_nearby/' + lat + '/' + lng + '?jsoncallback=?';

    $.getJSON(full_url,
    {
        format: "jsonp"
    },

    function(data) {
        near_by = data;
        $('#public_listings').append('<li data-role="list-divider" role="heading">Nearby Listings</li>');

        $.each(near_by,
        function(index, near_by) {

            $('#public_listings').append('<li data-theme="c"><a href="applet.html?id=' + near_by.url + '" rel="external">' + near_by.name + '<span class="ui-li-count">' + near_by.locations + '</span></a></li>');

        });

    })
    .success(function() {
        $('#public_listings').listview('refresh');
		
    });

}
function getPublic()
{

    var full_url = serviceURL + 'get_public?jsoncallback=?';

    $.getJSON(full_url,
    {
        format: "jsonp"
    },

    function(data) {
        public_listing = data;
        $('#public_listings').append('<li data-role="list-divider" role="heading">Public Listings</li>');

        $.each(public_listing,
        function(index, public_listing) {
            $('#public_listings').append('<li data-theme="c"><a href="applet.html?id=' + public_listing.url + '" rel="external">' + public_listing.name + '<span class="ui-li-count">' + public_listing.locations + '</span></a></li>');
        });

    })
    .success(function() {
        $('#public_listings').listview('refresh');
    });
}

function getRecentListing(onoffline) {
    urls = $.cookie('urls');
    $.each(urls,
    function(index, url) {

        $('#recent_listings').append('<li data-theme="c"><a href="'+onoffline+'?id=' + url.url + '" rel="external">' + url.name + '</a></li>');

    });

    $('#recent_listings').listview('refresh');

}

function getMyListing(id) {

    var full_url = serviceURL + 'get_my_listing/' + id + '?jsoncallback=?';

    $.getJSON(full_url,
    {
        format: "jsonp"
    },

    function(data) {
        my_listing = data;

        $.each(my_listing,
        function(index, my_listing) {
            $('#my_listings').append('<li data-theme="c"><a href="applet.html?id=' + my_listing.url + '" rel="external">' + my_listing.name + '<span class="ui-li-count">' + my_listing.locations + '</span></a></li>');
        });

    })
    .success(function() {
        $('#my_listings').listview('refresh');
    });

}
// onSuccess Geolocation
//
function onSuccess(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    $("#lat").val(lat);
    $("#lng").val(lng);
}
// onSuccess Geolocation
//
function login_onSuccess(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    $("#login_lat").val(lat);
    $("#login_lng").val(lng);
}


function login() {

    user = $.cookie('user');

    if (user !== null)
    {
        getMyListing(user[0].user);

        $('#login_form').hide();
        $('#logged_in').show();
    }
    $('#logout').click(function() {
        $('#login_form').show();
        $('#logged_in').hide();
        $.cookie('user', null);
        $('#my_listings').html('<li data-role="list-divider" role="heading">My Applets</li>');

    });
    $('#back_link').click(function() {
        $('#login_form').show();
        $('#login_error_message').hide();
        $('#login_success_message').hide();

    });

    $('#login_submit').click(function() {

        var output = $().crypt({
            method: "md5",
            source: $('#password').val()
        });

        user = document.getElementById("username").value;
        pass = document.getElementById("password").value;
        var full_url = serviceURL + 'login?jsoncallback=?&name=' + user + '&pass_hash=' + output + '&pass=' + pass;

        $.getJSON(full_url,
        {
            format: "jsonp"
        },

        function(data) {

            if (data.is_true === true) {

                ids = [{
                    user: data.user_id,
                    user_active: data.is_true,
                    user_admin: data.is_admin
                }]
                $.cookie('user', ids, {
		            expires: 2592000000
		        });
		
				who_am_i = {
		            name: data.first_name + ' '+ data.last_name,
		            email: data.email
		        }

		        $.cookie('who', who_am_i, {
		            expires: 2592000000
		        });

                getMyListing(data.user_id);

                $('#login_form').hide();
                $('#logged_in').show();

            } else {
                $('#login_form').hide();
                $('#login_error_message').show();
            }

        });

        return false;
    });

}

function start_map(id)
 {

    $("#back_to_applet").attr("data-applet", id);
    // Create inital Google Map
    var latlng = new google.maps.LatLng(40.397, -72.644);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("content"), myOptions);

    var full_url = serviceURL + 'get_locations/' + id + '?jsoncallback=?';

    var bounds = new google.maps.LatLngBounds();

    var markers = new Array();

    $.getJSON(full_url,
    {
        format: "jsonp"
    },

    function(data) {

        public_listing = data;

        $.each(public_listing,
        function(index, public_listing) {


            if (public_listing.color == null)
            {
                var color_code = 'FE7569'
            } else {
                var color_code = public_listing.color
            }

            markerlatlong = new google.maps.LatLng(public_listing.lat, public_listing.lng);

            bounds.extend(markerlatlong);


            var marker = new google.maps.Marker({
                map: map,
                position: markerlatlong,
                index: index,
                html: "<h3>" + public_listing.location_name + "</h3><p>" + public_listing.comment + " - " + public_listing.cat_name + "</p>",
                icon: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + color_code

            });

            markers[index] = marker;

            google.maps.event.addListener(marker, 'click',
            function() {
                infowindow.setContent(this.html);
                infowindow.open(map, this);
            });


        });
        // end each for public listings
    })
    //end get json
    .complete(function() {
        map.fitBounds(bounds);
    });

}

function applet_actions(id)
 {

    //navigator.geolocation.getCurrentPosition(onSuccess, onError);

    getCategoriesList(id);
    getHeaderFooter(id);

    $("#applet_id").val(id);
    $("#submission_id").val(id);

    $("#map").attr("data-applet", id);


    var who = $.cookie('who');
    if (who) {
        $("#name").val(who.name);
        $("#email").val(who.email);
    }

    $("#large_icon").attr("href", serviceURL + "get_icon_images/" + id + "/114");
    $("#small_icon").attr("href", serviceURL + "get_icon_images/" + id + "/57");

    $("#icon_primary").attr("src", serviceURL + "get_icon_images/" + id + "/114");


    $('#form_submit').click(function() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        who_am_i = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value
        }

        $.cookie('who', who_am_i, {
            expires: 2592000000
        });

        var full_url = serviceURL + 'submit_from_phonegap?jsoncallback=?&' + $("#form_serial").serialize();

        //alert(full_url);
        $.getJSON(full_url, {
            format: "jsonp"
        },

        function(data) {

            $.each(data,
            function(index, data) {
                if (data == 'error') {
                    $('#form_serial').hide();
                    $('#error_message').show();
                } else {

                    document.getElementById("location_id").value = data.id;
                    $('#form_serial').hide();
                    $('#success_message').show();

                }

            });
            // end $.each
        });
        // end JSON function
        return false;

    });
    // end getJSON
}


$('#camera_image').click(function() {
                         getImage(0);
                         });
$('#lib_image').click(function() {
                      getImage(1);
                      });

function getImage(sourceType) {
    
    $.mobile.showPageLoadingMsg();
    
    if (sourceType == 1)
    {
        var options = {
        quality: 10,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        };
    } else
    {
        var options = {
        quality: 10,
        destinationType: navigator.camera.DestinationType.FILE_URI
        };
    }
    
    
    // Retrieve image file location from specified source
    navigator.camera.getPicture(uploadPhoto,
                                function(message) {
                                alert('get picture failed');
                                },
                                options
                                );
    
}
function uploadPhoto(imageURI) {
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    
    var params = new Object();
    params.location_id = document.getElementById("location_id").value;
    
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(imageURI, serviceURL + "upload_image", win, fail, options);
}

function win(r) {
$.mobile.hidePageLoadingMsg();
    alert(r.response);
    
    $('#image_successfully_uploaded').show();
    
}

function fail(error) {
    $.mobile.hidePageLoadingMsg();
    alert("An error has occurred: Code = " = error.code);
}
