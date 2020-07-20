function calibrationMessage1() {
    showMsg({
        title:"Calibration",
        subtitle:"Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
        btn1:'OK',
        btn2:'SKIP',
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click',() => {
        hideMsg()
        ShowCalibrationPoint();
    })
    $('#msgBtn2').off('click')
    $('#msgBtn2').on('click',() => {
        hideMsg()
        hideCalibrationButtons();
        forgetAboutMeMessage()
    })
}

function forgetAboutMeMessage(){
    startGatheringData()
    showMsg({
        title:"Good",
        subtitle:"Now, forget about me, and go back to work. I will study you for a while.",
        btn1:'NICE'
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click',() => {
        hideMsg()
        setTimeout(startPlottingMessage,5000)
    })
}

function startPlottingMessage(){
    showMsg({
        title:"OK!",
        subtitle:"Now you are ready",
        btn1:'START'
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click',() => {
        hideMsg()
		startPlotting()
    })
}







function hideMsg() {
    $('#msg').hide()
}

function showMsg(context) {
    $('#msg').show()
    $('#msgTitle').hide()
    $('#msgsubtitle').hide()
    $('#msgBtn1').hide()
    $('#msgBtn2').hide()
    if ('title'     in context) showMsgTitle    (context.title)
    if ('subtitle'  in context) showMsgSubtitle (context.subtitle)
    if ('btn1'      in context) showMegButton1  ( context.btn1)
    if ('btn2'      in context) showMegButton2  ( context.btn2)
}

function showMsgTitle(txt) {
    $('#msgTitle').show()
    $('#msgTitle').text(txt)
}

function showMsgSubtitle(txt) {
    $('#msgsubtitle').show()
    $('#msgsubtitle').text(txt)
}

function showMegButton1(txt){
    $('#msgBtn1').show()
    $('#msgBtn1').text(txt)
}
function showMegButton2(txt){
    $('#msgBtn2').show()
    $('#msgBtn2').text(txt)
}