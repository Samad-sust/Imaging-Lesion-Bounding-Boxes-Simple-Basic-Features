
function theTest(element, data) {                             // this function is being called from line 308 in loadstudy.js
  toolData = cornerstoneTools.getToolState(element, 'stack'); // this is a global variable scope
                                                              // tooldata provides all the data related to the active 
                                                              // image on the screen
}

function explain_assistant_rerult() { 
  var stack = toolData.data[0];
  var currentlyActiveImageURL = stack.imageIds[0];          // gives the active image of the system (not the json)
  var currentlyActiveImageId = currentlyActiveImageURL.slice(35, -5) // only the image id itself from the sys (not the json file)
  var modifiedImageURL = "wadouri://localhost:8048/instances/" + currentlyActiveImageId + "/file"; // Modify the URL according to the json file  
  
  var openPatient = $('#complete-tab > a').attr("href") ; // this will fetch the id of open patien with extra 2 latters before actual id
  var openPatientId = openPatient.slice(2) + '.json'      // slice '#x' and add ".json" at the end
  var openPatientUrl = '../../dataset/' + openPatientId;  // full URL of open patient
  
  $.getJSON( openPatientUrl, function(data) {             // getting the exact json file(dataset/...json) for the active image
    data.rawData.stacks.forEach(arrayOfStacks)            // getting all the stacked image for the patient
    function arrayOfStacks(item) {                        // checking which image is open of all stacked images
      
      var openImageId = item.imageIds[0].slice(35, -5);
      
      if (openImageId == currentlyActiveImageId ) {           // checking which image is open of all stacked images by condition modifiedImageURL---line:13
        
        var canvas = document.querySelector('.viewport > canvas:first-child');  // Make the canvas for freehand and probe-----
        var c = canvas.getContext('2d');                  // c (= context) for both freehand and probe
            c.strokeStyle = 'yellow';                     // this styles are valid for both freehand and probe.
            c.lineWidth = 4;
            c.beginPath();
            c.setLineDash([4]);

        var freehand = item.freehand;                     // freehand values of the open image by the image id freehand contains x-y values # freehand contains x-y values
        var probe = item.probe;                           // every probe of the associated image------
        if (typeof(probe) == 'undefined' && typeof(freehand) == 'undefined') {
          alert('I have no further information!');
        }
        if (typeof(probe) != 'undefined') {
          probe.forEach(singleProbe => {
            var singleProbe_x = singleProbe.handles.end.x;
            var singleProbe_y = singleProbe.handles.end.y;
            c.beginPath();
            c.arc(singleProbe_x,singleProbe_y,10,0, 2 * Math.PI);
            c.stroke();
          });
        }

        if ( typeof(freehand) != 'undefined') {            // check wheather freehand is null or not

              freehand.forEach(iterateFreehand);           // iterate for all 1st freehand of the freelands
              function iterateFreehand(freehandItem) {
                var handles = freehandItem.handles;
                if (handles[0]) {                          // check if this is the first item of the freehand
                  c.moveTo((handles[0].x),(handles[0].y)); // set the initial state of the line ## Move to-----
                }
     
            handles.forEach(getXYvalues)                  // for every freehand - get the x and y values.
            function getXYvalues(handleItem) {
              c.lineTo(handleItem.x, handleItem.y);
            }

            if(handles[handles.length - 1]) {          // check whether it is the last item of freehand
              c.lineTo((handles[0].x),(handles[0].y));
            }
          }
            c.stroke();
        }
      }
    }
  })
}
// 