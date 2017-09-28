/*
    Notes:
    ajax arguments order (phpFunction, search params, container, htmlOperation, lastLoadedVehicleId, limit)
*/

var url = "http://192.168.1.12/Mccluskey_Car_App/app.php";
var imageUrl = "http://192.168.1.12/Mccluskey_Car_App/uploads/";;
var phpFunction = "";
var container = "";
var htmlOperation = "";
var lastLoadedVehicleId = "";

//Global car id
var id = 0;

//Global slider value
var compositeImage = "1";

//Global current instruction page
//This variable is used to set the current page used by the skip button
var currentInstructionPage = "";

//Global search parameters
var searchParams = "";

function buttonPressed(target)
{
    $(target).addClass("standard-button-pressed");
}

function buttonReleased(target)
{
    $(target).removeClass("standard-button-pressed");
}

function buttonTextPressed(target)
{
    $(target).addClass("btn-text-pressed");
}

function buttonTextReleased(target)
{
    $(target).removeClass("btn-text-pressed");
}

function directionalArrowPressed(target)
{
    $(target).addClass("directional-arrow-pressed");
}

function directionalArrowReleased(target)
{
    $(target).removeClass("directional-arrow-pressed");
}

function backPressed(target)
{
    $(target).addClass("description-text-pressed");
}

function backReleased(target)
{
    $(target).removeClass("description-text-pressed");
}

function rotateArrowPressed(target)
{
    $(target).addClass("rotate-arrow-pressed");
}

function rotateArrowReleased(target)
{
    $(target).removeClass("rotate-arrow-pressed");
}

//Enable the camera to take image
//imageData is passed into the src of userImage
$("#takeImage").on("touchstart", function ()
{
    buttonTextPressed(this);
});

$("#takeImage").on("touchend", function ()
{
    buttonTextReleased(this);

    navigator.camera.getPicture(onSuccess, onFail,
    {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true
    });

    //Show the loading div
    $("#loading").toggle();

    function onSuccess(imageData)
    {
        //Hide the sub options
        $("#subOptions").toggle();

        //Show the car selection page
        browseSelection();

        //Load image into image container background
        var image = "data:image/jpeg;base64," + imageData;
        $("#imageContainer").css("background-image", "url(" + image + ")");

        //Hide the loading div
        $("#loading").toggle();
    }

    function onFail(message)
    {
        //Hide the loading div
        $("#loading").toggle();

        alert('Failed because: ' + message);
    }
});

//Select an image from photo library
//imageData is passed into the src of userImage
$("#selectImage").on("touchstart", function ()
{
    buttonTextPressed(this);
});

$("#selectImage").on("touchend", function ()
{
    buttonTextReleased(this);

    navigator.camera.getPicture(onSuccess, onFail,
        {
            quality: 100,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL,
            correctOrientation: true
        });

    //Show the loading div
    $("#loading").toggle();

    function onSuccess(imageData)
    {
        //Hide the sub options
        $("#subOptions").toggle();


        //Show the car selection page
        browseSelection();

        //Load image into image container background
        var image = "data:image/jpeg;base64," + imageData;
        $("#imageContainer").css("background-image", "url(" + image + ")");

        //Hide the loading div
        $("#loading").toggle();
    }

    function onFail(message)
    {
        //Hide the loading div
        $("#loading").toggle();

        alert('Failed because: ' + message);
    }
});

//Load first the 3 cars
$("#goToSelection").on("touchstart", function ()
{
    buttonPressed(this);
});

$("#goToSelection").on("touchend", function ()
{
    buttonReleased(this);

    browseSelection();

    //Hide the image div
    $("#imageContainer").toggle();
});

function browseSelection()
{
    //Unhide the browse selection page
    $("#browseSelection").toggle();

    ajaxInvoke("displayVehicles", searchParams, "vehiclesContainer", "html", 0, 3);
}

//Gets the search paraments from the search text and assigns to global searchParams variable
$("#searchSend").on("click", function ()
{
    searchParams = $("#searchText").val();

    ajaxInvoke("displayVehicles", searchParams, "vehiclesContainer", "html", 0, 3);
});

//Load another few cars each time the carSelectionContainer is fully scrolled
$("#vehiclesContainer").scroll(function ()
{
    if (this.scrollHeight - this.scrollTop > this.clientHeight - 100)
    {
        var vehicleIdArray = [];
        $("[id*='vehicleId']").each(function ()
        {
            var currentId = this.id;
            var getIdFields = currentId.split("~");
            var id = getIdFields[1];

            vehicleIdArray.push(id);
        });

        lastLoadedVehicleId = Math.max.apply(null, vehicleIdArray)

        ajaxInvoke("displayVehicles", searchParams, "vehiclesContainer", "append", lastLoadedVehicleId, 1);
    }
});

//Send ajax requests to the server
function ajaxInvoke(phpFunction, searchParams, container, htmlOperation, lastLoadedVehicleId, limit)
{
    $.ajax({
        url: url,
        data: { phpFunction: phpFunction, searchParams: searchParams, lastLoadedVehicleId: lastLoadedVehicleId, limit: limit},
        type: "POST",
        dataType: "html"
    }).done(function (output)
    {
        if (htmlOperation === "html") {
            $("#" + container).html(output);
        }
        else if (htmlOperation === "append") {
            $("#" + container).append(output);
        }
    });
}

//Take screenshot of comped car
$(document).on("touchstart", "[id*='selectVehicle']", function ()
{
    buttonPressed(this);
});

//Selects the vehicle from the database and assigns the id to the global id variable
$(document).on("touchend", "[id*='selectVehicle']", function ()
{
    buttonReleased(this);

    var currentId = this.id;
    var getIdFields = currentId.split("~");
    id = getIdFields[1];

    //Show the image container
    $("#imageContainer").toggle();

    //Hide the browse selection page
    $("#browseSelection").toggle();

    //Hide the image while loading new ones
    $("#compositeImage").css("display", "none");

    //Show loading icon
    $("#loadingIcon").toggle();

    //Pre-load all the car images
    preloadImages([imageUrl + id + "/1.png",
    imageUrl + id + "/2.png",
    imageUrl + id + "/3.png",
    imageUrl + id + "/4.png",
    imageUrl + id + "/5.png",
    imageUrl + id + "/6.png",
    imageUrl + id + "/7.png",
    imageUrl + id + "/8.png"]);

    //Set image source
    $("#compositeImage").attr("src", imageUrl + id + "/" + compositeImage + ".png");

    //Once the image has loaded remove loading and display the image
    $("#compositeImage").one("load", function () {
        //Hide loading icon
        $("#loadingIcon").toggle();

        //Show the image once all loading is complete
        $("#compositeImage").css("display", "inline");
    });
});


//Brightness and contrast control
var brightnessSlider = document.getElementById("brightnessSlider");
var contrastSlider = document.getElementById("contrastSlider");

var brightness = brightnessSlider.value;
var contrast = contrastSlider.value;

$(brightnessSlider).on("input", function ()
{
    brightness = this.value;

    $("#compositeImage").css("-webkit-filter", "brightness(" + brightness + "%) contrast(" + contrast + "%)");

});

$(contrastSlider).on("input", function ()
{
    contrast = this.value;

    $("#compositeImage").css("-webkit-filter", "brightness(" + brightness + "%) contrast(" + contrast + "%)");
});

//Pre-load images function
function preloadImages(array)
{
    if (!preloadImages.list)
    {
        preloadImages.list = [];
    }

    var list = preloadImages.list;

    for (var i = 0; i < array.length; i++)
    {
        var img = new Image();

        img.onload = function ()
        {
            var index = list.indexOf(this);

            if (index !== -1)
            {
                //Remove image from the array once it's loaded
                //for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);

        img.src = array[i];
    }
}

//Make image draggable, resizable and rotatable
//Uses interact.js
var scale = 1;
var angle = 0,
    dragElement = document.getElementById('imageDraggable'),
    scaleElement = document.getElementById('compositeImage'),
    resetTimeout;

interact(dragElement)
    .gesturable({

        onmove: function (event)
        {
            scale = scale * (1 + event.ds);
            angle += event.da;

            scaleElement.style.webkitTransform =
                scaleElement.style.transform =
                'scale(' + scale + ')' + 'rotate(' + angle + 'deg)';;

            dragMoveListener(event);
        }
    }).draggable({

        onmove: dragMoveListener
    });

function reset()
{
    scale = 1;
    scaleElement.style.webkitTransform =
        scaleElement.style.transform =
        'scale(1)';
}

function dragMoveListener(event)
{
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

//On orientation change reset the position of the vehicle image
$(window).on("orientationchange", function ()
{
    $(dragElement).removeAttr("data-x");
    $(dragElement).removeAttr("data-y");
    $(dragElement).removeAttr("style");
});

$("#rotateRight").on("touchstart", function ()
{
    rotateArrowPressed(this);
});

$("#rotateRight").on("touchend", function ()
{
    rotateArrowReleased(this);

    setTimeout(function ()
    {
        compositeImage = parseInt(compositeImage) - 1;

        if (compositeImage === 0)
        {
            compositeImage = 8;
        }

        $("#compositeImage").attr("src", imageUrl + id + "/" + compositeImage + ".png");
    }, 50);
});

$("#rotateLeft").on("touchstart", function ()
{
    rotateArrowPressed(this);
});

$("#rotateLeft").on("touchend", function ()
{
    rotateArrowReleased(this);

    setTimeout(function ()
    {
        compositeImage = parseInt(compositeImage) + 1;

        if (compositeImage === 9) {
            compositeImage = 1;
        }

        $("#compositeImage").attr("src", imageUrl + id + "/" + compositeImage + ".png");
    }, 50);
});

//Take screenshot of comped car
$("#saveImage").on("touchstart", function ()
{
    buttonPressed(this);
});

$("#saveImage").on("touchend", function ()
{
    buttonReleased(this);

    //First toggles the buttons to be hidden
    $.when(toggleDiv()).done(function () {
        //Calls takeScreeshot function
        takeScreenshot();

    }).done(function () {
        //Show the after screenshot options
        $("#afterScreenShotOptions").toggle();
        //Hide the draggable image
        $("#imageDraggable").toggle();

    });
});

$("#scheduleTestDrive").on("touchstart", function ()
{
    buttonPressed(this);
});

$("#scheduleTestDrive").on("touchend", function ()
{
    buttonReleased(this);

    window.open("tel:11234567890", '_system');
});

$("#clickToCall").on("touchstart", function ()
{
    buttonPressed(this);
});

$("#clickToCall").on("touchend", function ()
{
    buttonReleased(this);

    window.open("tel:11234567890", '_system');
});

//Clicking the OK on the image saved alert
$("#imagedSavedOkSelect").on("click", function ()
{
    //Hide the imaged saved alert when ok is clicked
    $("#imageSavedAlert").toggle();

    enableInteraction();
});

// Enable the buttons and car composite
function enableInteraction()
{
    //Enable the buttons, slider, and car composite moving/scaling
    $("#saveImage").prop("disabled", false);
    $("#goToSelection").prop("disabled", false);

    var dragElement = document.getElementById('imageDraggable'),
        scaleElement = document.getElementById('compositeImage');

    interact(dragElement)
        .draggable(true);

    interact(scaleElement)
        .gesturable(true);
}

// Disable the buttons and car composite
function disableInteraction()
{
    //Disable the buttons, slider, and car composite moving/scaling
    $("#saveImage").prop("disabled", true);
    $("#goToSelection").prop("disabled", true);

    var dragElement = document.getElementById('imageDraggable'),
        scaleElement = document.getElementById('compositeImage');

    interact(dragElement)
        .draggable(false);

    interact(scaleElement)
        .gesturable(false); 
}

//Toggles the buttons for the screenshot
function toggleDiv()
{
    return $("#imageContainerOptions").toggle(0).delay(100);
}

//Saves the screenshot
function takeScreenshot()
{
    navigator.screenshot.save(function (error, res)
    {
        if (error)
        {
            console.error(error);
        }
        else
        {
            //Load screenshot into app img to view
            navigator.screenshot.URI(function (error, res)
            {
                $("#screenShot").attr("src", res.URI);
            }, 100);
        }
    }, 'jpg', 100);
}

//App navigation

//Continue to the main app
$("#goToApp").on("touchstart", function ()
{
    buttonTextPressed(this);
});

$("#goToApp").on("touchend", function ()
{
    buttonTextReleased(this);

    setTimeout(function ()
    {
        //Show the sub options
        $("#subOptions").toggle();

        //Hide the main options
        $("#mainOptions").toggle();
    }, 200);
});

//Go to the instructions
$("#goToInstructions").on("touchstart", function ()
{
    buttonTextPressed(this);
});

$("#goToInstructions").on("touchend", function ()
{
    buttonTextReleased(this);

    setTimeout(function ()
    {
        //Show the sub options
        $("#instructionsMain").toggle();

        currentInstructionPage = "instructionsMain";

        //Hide the main options
        $("#mainOptions").toggle();

        //Show the skip button
        $("#skip").toggle();
    }, 200);
});

//Back to main options
$("#goBackToMainOptions").on("touchstart", function ()
{
    backPressed(this);
});

$("#goBackToMainOptions").on("touchend", function ()
{
    backReleased(this);

    setTimeout(function ()
    {
        //Show the main options
        $("#mainOptions").toggle();

        //Hide the sub options
        $("#subOptions").toggle();
    }, 200);
});

//Back to sub options
$("#goBackToSubOptions").on("touchstart", function ()
{
    backPressed(this);
});

$("#goBackToSubOptions").on("touchend", function ()
{
    backReleased(this);

    setTimeout(function ()
    {
        //Show the sub options
        $("#subOptions").toggle();

        //Hide the image container
        $("#imageContainer").toggle();

        //Hide the image saved alert
        $("#imageSavedAlert").hide();

        enableInteraction();
    }, 200);
});

//Back to image container
$("#goBackToImageContainer").on("click", function ()
{
    backPressed(this);
});

$("#goBackToImageContainer").on("click", function ()
{
    backReleased(this);

    setTimeout(function ()
    {
        //Show the simage container
        $("#imageContainer").toggle();

        //Hide the vehicle selection container
        $("#browseSelection").toggle();
    }, 200);
});

$("#reset").on("touchstart", function ()
{
    backPressed(this);
});

$("#reset").on("click", function ()
{
    backReleased(this);

    setTimeout(function ()
    {
        //Show the simage container options
        $("#imageContainerOptions").toggle();

        //Hide the after screenshot options
        $("#afterScreenShotOptions").toggle();

        //Show the draggable image
        $("#imageDraggable").toggle();

        //Reset the screenshot img to empty
        $("#screenShot").attr("src", "");
    }, 200);
});

//All instructions navigation

//Skip the instructions and go back to the main options
$("#skip").on("touchstart", function ()
{
    backPressed(this);
});

$("#skip").on("touchend", function ()
{
    backReleased(this);

    setTimeout(function ()
    {
        //Show the main options
        $("#mainOptions").toggle();

        //Hide the skip button
        $("#skip").toggle();

        //Hide the current page
        $("#" + currentInstructionPage).toggle();
    }, 200);
});

//Instructions main page nav
//Go to instructions choose
$("#goToInstructionsChoose").on("touchstart", function ()
{
    directionalArrowPressed(this);    
});

$("#goToInstructionsChoose").on("touchend", function ()
{
    currentInstructionPage = "instructionsChoose";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions choose page
        $("#instructionsChoose").toggle();

        //Hide the instructions main page
        $("#instructionsMain").toggle();
    }, 200);
});

//Instructions choose page nav
//Go back to instructions main
$("#goBackToInstructionsMain").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goBackToInstructionsMain").on("touchend", function ()
{
    currentInstructionPage = "instructionsMain";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions main page
        $("#instructionsMain").toggle();

        //Hide the instructions choose page
        $("#instructionsChoose").toggle();
    }, 200);
});

//Go to instructions line up page
$("#goToInstructionsLineUp").on("touchstart", function ()
{
    buttonTextPressed(this);
});

$("#goToInstructionsLineUp").on("click", function ()
{
    currentInstructionPage = "instructionsLineUp";

    buttonTextReleased(this);

    setTimeout(function ()
    {
        //Show the instructions line up page
        $("#instructionsLineUp").toggle();

        //Hide the instructions choose page
        $("#instructionsChoose").toggle();
    }, 200);
});

//Go to instructions select photo page
$("#goToInstructionsSelectPhoto").on("touchstart", function ()
{
    buttonTextPressed(this);
});

$("#goToInstructionsSelectPhoto").on("click", function ()
{
    currentInstructionPage = "instructionsSelectPhoto";

    buttonTextReleased(this);

    setTimeout(function ()
    {
        //Show the instructions line up page
        $("#instructionsSelectPhoto").toggle();

        //Hide the instructions choose page
        $("#instructionsChoose").toggle();
    }, 200);

});

//Instructions line up page nav
//Go back to instructions choose
$("#goBackToInstructionsChoose1").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goBackToInstructionsChoose1").on("touchend", function ()
{
    currentInstructionPage = "instructionsChoose";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions choose page
        $("#instructionsChoose").toggle();

        //Hide the instructions line up page
        $("#instructionsLineUp").toggle();
    }, 200);
});

//Go to instructions orientation
$("#goToInstructionsOrientation").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goToInstructionsOrientation").on("touchend", function ()
{
    currentInstructionPage = "instructionsOrientation";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions choose page
        $("#instructionsOrientation").toggle();

        //Hide the instructions line up page
        $("#instructionsLineUp").toggle();
    }, 200);
});

//Instructions orientation page nav
//Go back to instructions line up
$("#goBackToinstructionsLineUp").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goBackToinstructionsLineUp").on("touchend", function ()
{
    currentInstructionPage = "instructionsLineUp";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions line up page
        $("#instructionsLineUp").toggle();

        //Hide the instructions orientation page
        $("#instructionsOrientation").toggle();
    }, 200);
});

//Go to instructions taken photo
$("#goToInstructionsTakenPhoto").on("touchstart", function ()
{
    directionalArrowPressed(this);
});
$("#goToInstructionsTakenPhoto").on("touchend", function ()
{
    currentInstructionPage = "instructionsTakenPhoto";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions line up page
        $("#instructionsTakenPhoto").toggle();

        //Hide the instructions orientation page
        $("#instructionsOrientation").toggle();
    }, 200);
});

//Instructions taken photo page nav
//Go back to instructions orientation
$("#goBackToInstructionsOrientation").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goBackToInstructionsOrientation").on("touchend", function ()
{
    currentInstructionPage = "instructionsOrientation";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions line up page
        $("#instructionsOrientation").toggle();

        //Hide the instructions orientation page
        $("#instructionsTakenPhoto").toggle();
    }, 200);
});

//Go to instructions select vehicle
$("#goToInstructionsSelectVehicle").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goToInstructionsSelectVehicle").on("touchend", function ()
{
    currentInstructionPage = "instructionsSelectVehicle";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions select vehicle page
        $("#instructionsSelectVehicle").toggle();

        //Hide the instructions taken photo page
        $("#instructionsTakenPhoto").toggle();
    }, 200);
});

//Instructions select vehicle page nav
//Go back to instructions taken photo
$("#goBackToInstructionsTakenPhoto").on("touchstart", function ()
{
    directionalArrowPressed(this);
});
$("#goBackToInstructionsTakenPhoto").on("touchend", function ()
{
    currentInstructionPage = "instructionsTakenPhoto";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions taken photo page
        $("#instructionsTakenPhoto").toggle();

        //Hide the instructions select vehicle page
        $("#instructionsSelectVehicle").toggle();
    }, 200);
});

//Go to instructions place vehicle
$("#goToInstructionsPlaceVehicle").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goToInstructionsPlaceVehicle").on("touchend", function ()
{
    currentInstructionPage = "instructionsPlaceVehicle";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions place vehicle page
        $("#instructionsPlaceVehicle").toggle();

        //Hide the instructions select vehicle page
        $("#instructionsSelectVehicle").toggle();
    }, 200);
});

//Instructions place vehicle page nav
//Go back to instructions select vehicle
$("#goBackToInstructionsSelectVehicle").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goBackToInstructionsSelectVehicle").on("touchend", function ()
{
    currentInstructionPage = "instructionsSelectVehicle";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions select vehicle page
        $("#instructionsSelectVehicle").toggle();

        //Hide the instructions place vehicle page
        $("#instructionsPlaceVehicle").toggle();
    }, 200);
});

//Go to instructions share
$("#goToInstructionsShare").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goToInstructionsShare").on("touchend", function ()
{
    currentInstructionPage = "instructionsShare";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions share page
        $("#instructionsShare").toggle();

        //Hide the instructions place vehicle page
        $("#instructionsPlaceVehicle").toggle();
    }, 200);
});

//Instructions share page nav
//Go back to instructions place vehicle
$("#goBackToInstructionsPlaceVehicle").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goBackToInstructionsPlaceVehicle").on("touchend", function ()
{
    currentInstructionPage = "instructionsPlaceVehicle";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions place vehicle page
        $("#instructionsPlaceVehicle").toggle();

        //Hide the instructions share page
        $("#instructionsShare").toggle();
    }, 200);
});

//Instructions select photo page nav
//Go back to instructions choose
$("#goBackToInstructionsChoose2").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goBackToInstructionsChoose2").on("touchend", function ()
{
    currentInstructionPage = "instructionsChoose";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions choose page
        $("#instructionsChoose").toggle();

        //Hide the instructions select photo page
        $("#instructionsSelectPhoto").toggle();
    }, 200);
});

//Go to instructions photo choice
$("#goToInstructionsPhotoChoice").on("touchstart", function ()
{
    directionalArrowPressed(this);
});

$("#goToInstructionsPhotoChoice").on("touchend", function ()
{
    currentInstructionPage = "instructionsPhotoChoice";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions photo choice page
        $("#instructionsPhotoChoice").toggle();

        //Hide the instructions select photo page
        $("#instructionsSelectPhoto").toggle();
    }, 200);
});

//Instructions photo choice page nav
//Go back to instructions select photo
$("#goBackToInstructionsSelectPhoto").on("touchstart", function ()
{
    directionalArrowPressed(this);           
});

$("#goBackToInstructionsSelectPhoto").on("touchend", function ()
{
    currentInstructionPage = "instructionsSelectPhoto";

    directionalArrowReleased(this);

    setTimeout(function ()
    {
        //Show the instructions select photo page
        $("#instructionsSelectPhoto").toggle();

        //Hide the instructions photo choice page
        $("#instructionsPhotoChoice").toggle();
    }, 200);
});