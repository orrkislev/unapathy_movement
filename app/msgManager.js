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
        // btnText: ' or ',
        // btn2: 'skip',
        btn1Click: () => {
            ShowCalibrationPoint();
        },
        // btn2Click: () => {
            // hideCalibrationButtons();
            // startFollowMe()
        // }
    })
}

function startPlottingMessage() {
    showMsg({
        text: "Now you are ready! Go back to work and let<br/>me monitor your apathy in the background. ",
        btn1: 'start',
        btn1Click: () => {
            hideMsg()
        },
        black: true
    })
}

function passiveTooLong() {
    $('#msg').css('font-weight', '300')
    showMsg({
        text: "<b>You have been apathetic for "+parseInt(MINUTES_TO_VIDEO)+" min!</b><br/><b>Now, take a moment to practice </b><span id='startVideoBtn' class='button'><b>3 ball juggling</b></span><br/>Hula hoop or Slakeline (in the future).",
        black: true
    })
    $('#startVideoBtn').on('click', () => {
        $('#msg').css('color', 'rgba(255,0,255,1)')
        $('#msg').css('font-weight', '700')
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

function donePracticeMessage(){
    resetTimers()
    startPlotting()
    showMsg({
        text:'Great! You pushed apathy away.',
        btn1: 'continue working',
        btnText: ' or ',
        btn2: 'go home',
        btn1Click:()=>{
            
        },
        btn2Click:()=>{
            stopPlotting()
            reflectMessage()
        },
        black:true
    })
}

function parseTime(t){
    const seconds = int(t)
    if (seconds<120) return parseInt(t)+" seconds"
    const minutes = Math.floor(seconds/60)%60
    if (minutes<60) return parseInt(minutes) +" minutes"
    const hours = Math.floor(minutes/60)%60
    return parseInt(hours) +" hours and " + parseInt(minutes) +" minutes"
}
function reflectMessage(){
    resetTimers()
    done = true
    plotCaptureX = gutter
    $('#reflectContainer').show()
    $('#reflectContainer').css('top',plotCaptureY)
    let html = '<b> Now, Take the time to reflect upon your day...</b><br/><br/>'
    html += '<b>You have been '+parseTime(totalScreenTime)+' in front of your screen. you have been passive for '+parseTime(totalApathyTime)+'</b><br/><br/>'
    html += 'We are surrounded with volatility, uncertainty, complexity and ambiguity and sometimes, it makes us feel unmotivated and incapable. Whenever you reach <b>apathetic moments</b> throughout your day, try to remember this feeling of activation and <b>keep practicing</b>.<br/><br/>'
    html += 'Goodbye.'
    $('#reflectContainer').html(html)
}





function startVideoMessage1() {
    startVideo(1)
    $("#videoTitle").text("Three ball juggling training - level 1 (one ball)")
    $("#videoBtn2").text('skip to level 2 (two balls)')
    $("#videoBtnText").show()
    $("#videoBtn1").on('click', ()=>{
        stopVideo()
        startPracticing()
    })
    $("#videoBtn2").on('click', startVideoMessage2)
}

function startVideoMessage2() {
    startVideo(2)
    $("#videoTitle").text("Three ball juggling training - level 2 (two balls)")
    $("#videoBtn2").text('skip to level 3 (three balls)')
    $("#videoBtn2").off('click')
    $("#videoBtn2").on('click', startVideoMessage3)
}

function startVideoMessage3() {
    startVideo(3)
    $("#videoTitle").text("Three ball juggling training - level 3 (three balls)")
    $("#videoBtnText").hide()
    $("#videoBtn2").text('')
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