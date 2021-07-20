const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = 500;

let context = canvas.getContext("2d");
let start_bg_color = "white";
context.fillStyle = start_bg_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

let restore_array = [];
let index = -1;

function change_color(element) {
    draw_color = element.style.background;
}

function pen_tool() {
    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("touchmove", draw, false);
    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("mousemove", draw, false);

    canvas.addEventListener("touchend", stop, false);
    canvas.addEventListener("mouseup", stop, false);
    canvas.addEventListener("mouseout", stop, false);
}

function start(event) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
    );
    event.preventDefault();
}

function draw(event) {
    if (is_drawing) {
        context.lineTo(
            event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop
        );
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event) {
    if (is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();

    if (event.type != "mouseout") {
        restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
    // restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
    // index += 1;

    console.log(restore_array);
}

function clear_canvas() {
    context.fillStyle = start_bg_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index = -1;
}

function undo_last() {
    if (index <= 0) {
        clear_canvas();
    } else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}

// Screenshot
const screenshotBtn = document.querySelector(".screenshot");
const takeScreenshot = function() {
    let capture = document.getElementById("capture");
    html2canvas(capture).then(function(canvas) {
        return Canvas2Image.saveAsImage(canvas);
    });
};
screenshotBtn.addEventListener("click", takeScreenshot);

// For dark mode

const chk = document.getElementById("chk");

chk.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

draw_rect = () => {
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    }

    var locA, locB;
    canvas.addEventListener("mousedown", function(e) {
        e.preventDefault();
        context.beginPath();
        locA = getMousePos(canvas, e);
        stop();
    });

    canvas.addEventListener("mouseup", function(e) {
        context.beginPath();
        e.preventDefault();
        locB = getMousePos(canvas, e);
        context.strokeStyle = draw_color;
        context.strokeRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y);
    });
};