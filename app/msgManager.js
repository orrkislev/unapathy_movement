function welcomeMessage() {
    showMsg({
        text: "welcome!<br/>please allow the use of your webcam<br/>for analyzing your movement and monitor<br/>your apathy.<br/>",
        btn1: "ok",
        btn1Click: () => {
            calibrationMessage1()
        }
    })
}

function calibrationMessage1() {
    showMsg({
        text: "Calibrate your eye gaze.<br/>Click on each of the 9 points on the screen<br/>5 times till each goes green. ",
        btn1: 'calibrate now',
        btnText: ' or ',
        btn2: 'skip',
        btn1Click: () => {
            ShowCalibrationPoint();
        },
        btn2Click: () => {
            // hideCalibrationButtons();
            resetTimers()
            startPlotting()
            startPlottingMessage();
        }
    })
}

function startPlottingMessage() {
    showMsg({
        text: "Now you are ready! Go back to work and let<br/>me monitor your apathy in the background. ",
        btn1: 'start',
        btn1Click: () => {
            hideMsg()
            stopLearning()
        },
        black: true
    })
}

function passiveTooLong() {
    showMsg({
        text: "You have been apathetic for 45 min!<br/>Now, take a moment to practice <span id='startVideoBtn' class='button'>3 ball juggling</span>",
        black: true
    })
    $('#startVideoBtn').on('click', () => {
        $('#msg').css('color', 'rgba(255,0,255,1)')
        hideMsg()
        stopPlotting()
        startVideoMessage1()
    })
}

function endVideoMessage(videoIndex) {
    if (videoIndex == 1) practiceOrSkip2Message()
    if (videoIndex == 2) practiceOrSkip3Message()
    if (videoIndex == 3) practiceMessage()
}

function practiceOrSkip2Message() {
    showMsg({
        text: "Now, practice as much as you need<br/>in order to feel activated",
        btn1: "Let’s practice",
        btnText: ' or ',
        btn2: 'skip to level 2',
        btn1Click: startPracticing,
        btn2Click: startVideoMessage2
    })
}

function practiceOrSkip3Message() {
    showMsg({
        text: "Now, practice as much as you need<br/>in order to feel activated",
        btn1: "Let’s practice",
        btnText: ' or ',
        btn2: 'skip to level 3',
        btn1Click: startPracticing,
        btn2Click: startVideoMessage3
    })
}

function practiceMessage() {
    showMsg({
        text: "Now, practice as much as you need<br/>in order to feel activated",
        btn1: "Let’s practice",
        btn1Click: () => {
            startPracticing()
        },
    })
}

function donePracticeMessage() {
    showMsg({
        btn1: 'continue working',
        btnText: ' or ',
        btn2: 'go home',
        btn1Click:()=>{
            resetTimers()
            startPlotting()
            flattenApathyLevelMessage()
        },
        btn2Click:()=>{
            done = true
        }
    })
}

function flattenApathyLevelMessage(){
    showMsg({
        text:'Great! You pushed apathy away.',
        btn1: 'continue working',
        btnText: ' or ',
        btn2: 'go home',
        btn1Click:()=>{
            resetTimers()
            startPlotting()
        },
        btn2Click:()=>{
            done = true
        },
        black:true
    })
}





function startVideoMessage1() {
    startVideo(1)
    $("#videoTitle").text("Three ball juggling training - level 1 (one ball)")
    $("#videoBtn1").text('skip to level 2 (two balls)')
    $("#videoBtn2").on('click', ()=>{
        stopVideo()
        startPracticing()
    })
    $("#videoBtn1").on('click', startVideoMessage2)
}

function startVideoMessage2() {
    startVideo(2)
    $("#videoTitle").text("Three ball juggling training - level 2 (two balls)")
    $("#videoBtn1").text('skip to level 3 (three balls)')
    $("#videoBtn1").off('click')
    $("#videoBtn1").on('click', startVideoMessage3)
}

function startVideoMessage3() {
    startVideo(3)
    $("#videoTitle").text("Three ball juggling training - level 3 (three balls)")
    $("#videoBtnText").hide()
    $("#videoBtn1").text('')
}







function hideMsg() {
    $('#msg').hide()
}

function showMsg(context) {
    if (context.black) $('#msg').css('color', 'black')
    $('#msg').show()
    $('#msgText').html(context.text ? context.text : '')
    $('#msgBtn1').html(context.btn1 ? context.btn1 : '')
    $('#msgButtonText').html(context.btnText ? context.btnText : '')
    $('#msgBtn2').html(context.btn2 ? context.btn2 : '')
    $('#msgBtn1').off('click')
    $('#msgBtn2').off('click')
    if (context.btn1Click) $('#msgBtn1').on('click', () => {
        if (context.black) $('#msg').css('color', 'rgba(255,0,255,1)')
        hideMsg()
        context.btn1Click()
    })
    if (context.btn2Click) $('#msgBtn2').on('click', () => {
        if (context.black) $('#msg').css('color', 'rgba(255,0,255,1)')
        hideMsg()
        context.btn2Click()
    })
}