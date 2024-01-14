const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.createCourse = function (params) {
  var course = new Object();

  var min = params.min;
  var max = params.max;
  var minSegmentLength = params.minSegmentLength;
  var maxSegmentLength = params.maxSegmentLength;
  var curviness = params.curviness;
  var maxAngle = (params.maxAngle / 360) * Math.PI;

  course.data = new Array();
  course.points = Math.floor((max - min) * Math.random()) + min;

  course.minX = 0;
  course.minY = 0;
  course.maxX = 0;
  course.maxY = 0;

  course.data[0] = { x: 400, y: 400 };
  direction = 0;

  for (i = 1; i < course.points; i++) {
    var len = Math.floor((maxSegmentLength - minSegmentLength) * Math.random()) + minSegmentLength;
    var dx = Math.sin(direction) * len;
    var dy = Math.cos(direction) * len;
    var x = course.data[i - 1].x + dx;
    var y = course.data[i - 1].y + dy;
    course.data[i] = { x: x, y: y };
    turn = Math.pow(Math.random(), 1 / curviness);
    //turn = 1
    
    if (Math.random() < 0.5) turn = -turn;
    direction += turn * maxAngle;
  }

  if (params.layout != "sprint") {
  // In the last quarter of the track, force the points progressively closer to the start.
  q = Math.floor(course.points * 0.75);
  c = course.points - q;
  var x0 = course.data[0].x;
  var y0 = course.data[0].y;

  for (i = q; i < course.points; i++) {
    var x = course.data[i].x;
    var y = course.data[i].y;
    var a = i - q;
    course.data[i].x = (x0 * a) / c + x * (1 - a / c);
    course.data[i].y = (y0 * a) / c + y * (1 - a / c);
  }

  }

  for (i = 1; i < course.points; i++) {
    x = course.data[i].x;
    y = course.data[i].y;
    if (x < course.minX) course.minX = x;
    if (y < course.minY) course.minY = y;
    if (x > course.maxX) course.maxX = x;
    if (y > course.maxY) course.maxY = y;

    course.minSize = Math.min(course.minX, course.minY);
    course.maxSize = Math.max(course.maxX, course.maxY);
  }

  course.layout = params.layout;
  course.location = params.location
  course.surface = params.surface
  if (typeof params.name === "undefined") {
    course.name = "Generic Course " + "#" + gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString()
  }
 if (typeof params.roadWidth === 'undefined') {
    course.roadWidth = 4
  } else {
   course.roadWidth = params.roadWidth
  }
  if (typeof params.scale === 'undefined') {
    course.scale = 1
  } else {
   course.scale = params.scale
  }
  return course;
};

module.exports.displayCourse = async function (course, callback) {
  var rint = 1
  //var rint = gtf_MATH.randomInt(1,2)
    if (course.location == "Black") {
  var url = './gtfbot2unleahsed/images/coursemaker/backgrounds' + '/black' + rint.toString() + '.png'
  } else if (course.location == "Asphalt") {
  var url = './gtfbot2unleahsed/images/coursemaker/backgrounds' + '/asphalt' + rint.toString() + '.png'
  } else if (course.location == "Grass") {
  var url = './gtfbot2unleahsed/images/coursemaker/backgrounds' + '/grass' + rint.toString() + '.png'
  } else if (course.location == "Forest") {
  var url = './gtfbot2unleahsed/images/coursemaker/backgrounds' + '/forest' + rint.toString() + '.png'
  } else if (course.location == "Desert") {
  var url = './gtfbot2unleahsed/images/coursemaker/backgrounds' +  '/desert' + rint.toString() + '.png'
  } else if (course.location == "Mountain") {
  var url = './gtfbot2unleahsed/images/coursemaker/backgrounds' +  '/mountain' + rint.toString() + '.png'
  } else if (course.location == "Snow") {
  var url = './gtfbot2unleahsed/images/coursemaker/backgrounds' +  '/snow' + rint.toString() + '.png'
  } else {
    var url = ""
  }

  var Canvas = require("@napi-rs/canvas");
  if (url.length != 0) {
  var background = await Canvas.loadImage(url)
  }

  var canvas = Canvas.createCanvas(2000, 2000);
  var ctx = canvas.getContext("2d");

  var total = 0;

  var x = 0;
  var y = 0;
  var scale = 500 / (course.maxSize - course.minSize);
  ctx.setTransform(scale, 0, 0, scale, -course.minSize, -course.minSize);
  ctx.strokeStyle = "#000000";

  ctx.lineWidth = 0;
  ctx.globalCompositeOperation = "xor";

  if (course.layout != "sprint") {
    ctx.moveTo(course.data[0].x, course.data[0].y);
    for (i = 1; i <= course.points; i++) {
      var p = i % course.points;
      ctx.lineTo(course.data[p].x, course.data[p].y);
    }

    ctx.stroke();
  }
  // To draw the actual track, we need to bisect each line segment and use the center as the curve
  // endpoint, then use the original line endpoints as the control points
  ctx.beginPath();

  if (course.location != "Blank") {
    ctx.strokeStyle = "#414954";
  } else {
  ctx.strokeStyle = "#FFFFFF";
  }
  if (course.surface == "Dirt") {
     ctx.strokeStyle = "#9B7653";
  }
  if (course.surface == "Snow") {
     ctx.strokeStyle = "#A1C2F2";
  }
  ctx.lineWidth = course.roadWidth;

  ctx.globalCompositeOperation = "source-over";

  x_prev = 0;
  y_prev = 0;
  var distance = [];

  var p1 = 0;
  var p2 = 0;

  for (i = 0; i <= course.points; i++) {
    if (course.layout == "sprint") {
      p1 = i % course.points;
      p2 = (i + 1) % course.points;
      if (gtf_MATH.betweenInt(p1, 0, 20) || gtf_MATH.betweenInt(p2, 0, 20)) {
        continue;
      }
    } else {
      p1 = i % course.points;
      p2 = (i + 1) % course.points;
    }
    x = (course.data[p1].x + course.data[p2].x) / 2;
    y = (course.data[p1].y + course.data[p2].y) / 2;

    if (i == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.quadraticCurveTo(course.data[p1].x, course.data[p1].y, x, y);
    }

    var dist = Math.sqrt(Math.pow(x_prev - x, 2) + Math.pow(y_prev - y, 2));
    distance.push(dist);
    x_prev = x;
    y_prev = y;
  }
  distance = distance.slice(1);
  total = distance.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  total = Math.round(((total * 10) / 1609) * 100) / 100;
  total = total * course.scale

  ctx.stroke();
  ctx.closePath();

  if (course.layout == "sprint") {
    var i = 21;
  } else {
    var i = gtf_MATH.randomInt(2, course.points - 5);
  }
  var p1 = i % course.points;
  var p2 = (i + 1) % course.points;
  x = (course.data[p1].x + course.data[p2].x) / 2;
  y = (course.data[p1].y + course.data[p2].y) / 2;

  ctx.fillStyle = "#c82124"; //red
  ctx.beginPath();
  ctx.arc(course.data[p1].x, course.data[p1].y, 5, 0.5 * Math.PI, 2.5 * Math.PI);
  ctx.closePath();
  ctx.fill();

  var trimmedcanvas = await trimCanvas(canvas);

  async function trimCanvas(c) {
    var ctx = c.getContext("2d")
    pixels = ctx.getImageData(0, 0, c.width, c.height)

      l = pixels.data.length
      i;
      bound = {
        top: null,
        left: null,
        right: null,
        bottom: null,
      };
      x;
      y;

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        x = (i / 4) % c.width;
        y = ~~(i / 4 / c.width);

        if (bound.top === null) {
          bound.top = y;
        }

        if (bound.left === null) {
          bound.left = x;
        } else if (x < bound.left) {
          bound.left = x;
        }

        if (bound.right === null) {
          bound.right = x;
        } else if (bound.right < x) {
          bound.right = x;
        }

        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }

    // Calculate the height and width of the content
    var trimHeight = bound.bottom - bound.top;
    trimWidth = bound.right - bound.left;

    ctx.globalCompositeOperation='destination-over';
  
      if (url.length != 0) {
      ctx.drawImage(background, 0, 0, 2000, 2000);
 
    }
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth + 10, trimHeight + 10);
    trimmed.width = trimWidth;
    trimmed.height = trimHeight;
    copy = Canvas.createCanvas(trimWidth, trimHeight)
    copy2 = copy.getContext("2d")

    copy2.putImageData(trimmed, 0, 0);

    // Return trimmed canvas
    return copy;
  }

   var image = await trimmedcanvas.encode("png")


  var course = { ...course, image: image, type: "Course Maker - " + course.surface, length: total, lengthkm: Math.round(total * 1.609 * 100) / 100 };
  course["name"] = course["name"].replace(/_/g, " ");
  callback(course)
};

