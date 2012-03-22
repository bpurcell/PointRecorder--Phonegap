

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