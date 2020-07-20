var PointCalibrate = 0;
var CalibrationPoints = {};

$(".Calibration").click(function () {
  var id = $(this).attr('id');
  if (!CalibrationPoints[id]) CalibrationPoints[id] = 1;
  CalibrationPoints[id]++;

  if (CalibrationPoints[id] == 6) {
    $(this).css('background-color', 'lightgreen');
    $(this).prop('disabled', true);
    PointCalibrate++;
  } else if (CalibrationPoints[id] < 6) {
    $(this).css('opacity', 0.2 * CalibrationPoints[id]);
  }

  //Show the middle calibration point after all other points have been clicked.
  if (PointCalibrate == 8) $("#Pt5").show();

  if (PointCalibrate >= 9) { // last point is calibrated
    hideCalibrationButtons()
    calibrationMessage2()
  }
});

function measureCalibration(){
  hideCalibrationButtons()
  $("#Pt5").show();
  store_points_variable();  
  console.log('a')
  setTimeout(() => {
    console.log('b')
    stop_storing_points_variable(); // stop storing the prediction points
    var past50 = get_points() // retrieve the stored points
    var precision_measurement = calculatePrecision(past50);
    hideCalibrationButtons()
    calibrationMessage3(precision_measurement)
  }, 5000);
}




function resetCalibrationPoints() {
  $(".Calibration").css('background-color', 'magenta');
  $(".Calibration").css('opacity', 0.2);
  $(".Calibration").prop('disabled', false);
  $(".Calibration").hide();
  CalibrationPoints = {};
  PointCalibrate = 0;
}
function hideCalibrationButtons() {
  $(".Calibration").hide();
}
function ShowCalibrationPoint() {
  $(".Calibration").show();
  $("#Pt5").hide();
}