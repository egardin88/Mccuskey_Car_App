// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        //Lock the screen to portrait on splash screen
        screen.orientation.lock('portrait');

        //Unhide and then rehide all the divs under the splash screen
        //to cache all of the images
        setTimeout(function () {
            $("#loading").toggle();
            $("#mainOptions").toggle();
            $("#subOptions").toggle();
            $("#imageContainer").toggle();
            $("#browseSelection").toggle();
            $("#imageSavedAlert").toggle();
            $("#instructionsMain").toggle();
            $("#instructionsChoose").toggle();
            $("#instructionsLineUp").toggle();
            $("#instructionsOrientation").toggle();
            $("#instructionsTakenPhoto").toggle();
            $("#instructionsSelectVehicle").toggle();
            $("#instructionsPlaceVehicle").toggle();
            $("#instructionsShare").toggle();
            $("#instructionsSelectPhoto").toggle();
            $("#instructionsPhotoChoice").toggle();
            $("#skip").toggle();
        }, 500);

        setTimeout(function () {
            $("#loading").toggle();
            $("#mainOptions").toggle();
            $("#subOptions").toggle();
            $("#imageContainer").toggle();
            $("#browseSelection").toggle();
            $("#imageSavedAlert").toggle();
            $("#instructionsMain").toggle();
            $("#instructionsChoose").toggle();
            $("#instructionsLineUp").toggle();
            $("#instructionsOrientation").toggle();
            $("#instructionsTakenPhoto").toggle();
            $("#instructionsSelectVehicle").toggle();
            $("#instructionsPlaceVehicle").toggle();
            $("#instructionsShare").toggle();
            $("#instructionsSelectPhoto").toggle();
            $("#instructionsPhotoChoice").toggle();
            $("#skip").toggle();
        }, 1500);

        //After 3 seconds show the main options and hide the splash screen
        setTimeout(function () {

            $("#mainOptions").toggle();

            $("#splashScreen").toggle();

            //Unlock the screen after initial load
            screen.orientation.unlock();
        }, 2000);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();