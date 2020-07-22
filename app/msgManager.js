function calibrationMessage1() {
    showMsg({
        title: "Calibration",
        subtitle: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
        btn1: 'OK',
        btn2: 'SKIP',
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click', () => {
        hideMsg()
        ShowCalibrationPoint();
    })
    $('#msgBtn2').off('click')
    $('#msgBtn2').on('click', () => {
        hideMsg()
        hideCalibrationButtons();
        forgetAboutMeMessage()
    })
}

function forgetAboutMeMessage() {
    startGatheringData()
    showMsg({
        title: "Good",
        subtitle: "Now, forget about me, and go back to work. I will study you for a while.",
        btn1: 'NICE'
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click', () => {
        hideMsg()
        setTimeout(startPlottingMessage, 3000)
    })
}

function startPlottingMessage() {
    showMsg({
        title: "OK!",
        subtitle: "Now you are ready",
        btn1: 'START'
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click', () => {
        hideMsg()
        learning = false
        startPlotting()
        goBackToWorkMessage()
    })
}

function goBackToWorkMessage() {
    $('#msg').css('color', 'black')
    showMsg({
        title: "",
        subtitle: "Go back to work and let me monitor your apathy in the background",
        btn1: 'OK'
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click', () => {
        hideMsg()
    })
}


function passiveTooLong() {
    showMsg({
        title: "You have been passive for " + str(MINUTES_TO_VIDEO) + " min, let’s move!",
        subtitle: "Take a moment to learn to juggle",
        btn1: 'PLAY THE VIDEO'
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click', () => {
        hideMsg()
        stopPlotting()
        startVideo(1)
        $('#msg').css('color', 'rgba(255,0,255,1)')
    })
}

function endVideoMessage(videoIndex) {
    if (videoIndex == 1) {
        showMsg({
            title: "Now, let's practice!",
            subtitle: "or learn to juggle with 2 balls",
            btn1: 'PRACTICE',
            btn2: 'LEARN MORE'
        })
        $('#msgBtn1').off('click')
        $('#msgBtn1').on('click', () => {
            hideMsg()
            endVideoMessage(3)
        })
        $('#msgBtn2').off('click')
        $('#msgBtn2').on('click', () => {
            hideMsg()
            startVideo(2)
        })
    } else if (videoIndex == 2) {
        showMsg({
            title: "Now, let's practice!",
            subtitle: "or learn to juggle with 3 balls!",
            btn1: 'PRACTICE',
            btn2: 'LEARN MORE'
        })
        $('#msgBtn1').off('click')
        $('#msgBtn1').on('click', () => {
            hideMsg()
            endVideoMessage(3)
        })
        $('#msgBtn2').off('click')
        $('#msgBtn2').on('click', () => {
            hideMsg()
            startVideo(3)
        })
    } else if (videoIndex == 3) {
        startPracticing()
        showMsg({
            title: "Great",
            subtitle: "practice as much as you need in order to feel activated",
            btn1: 'START PRACTICING',
        })
        $('#msgBtn1').off('click')
        $('#msgBtn1').on('click', () => {
            hideMsg()
            $('#donePractice').show()
        })
    }
}

function donePracticeMessage() {
    showMsg({
        title: "",
        subtitle: "",
        btn1: 'CONTINUE WORKING',
        btn1: 'GO HOME',
    })
    $('#msgBtn1').off('click')
    $('#msgBtn1').on('click', () => {
        hideMsg()
        resetTimers()
        startPlotting()
    })
    $('#msgBtn2').off('click')
    $('#msgBtn2').on('click', () => {
        hideMsg()
        resetTimers()
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
    if ('title' in context) showMsgTitle(context.title)
    if ('subtitle' in context) showMsgSubtitle(context.subtitle)
    if ('btn1' in context) showMegButton1(context.btn1)
    if ('btn2' in context) showMegButton2(context.btn2)
}

function showMsgTitle(txt) {
    $('#msgTitle').show()
    $('#msgTitle').text(txt)
}

function showMsgSubtitle(txt) {
    $('#msgsubtitle').show()
    $('#msgsubtitle').text(txt)
}

function showMegButton1(txt) {
    $('#msgBtn1').show()
    $('#msgBtn1').text(txt)
}
function showMegButton2(txt) {
    $('#msgBtn2').show()
    $('#msgBtn2').text(txt)
}