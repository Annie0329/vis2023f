window.addEventListener('load', function () {
  //讀csv
  d3.text("./csv/data.csv", function (data) {
    var parsedCSV = d3.csv.parseRows(data);
    var ele = d3.select('.d3Div').node();
    var w = ele.getBoundingClientRect().width;
    var h = ele.getBoundingClientRect().height;
    var zoomIdk = false;
    var x, y, s;
    var circleR;
    var mouseYes = false;
    var zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scaleExtent([1, 10])
      .scale(1)
      .on("zoom", zoomed);
    //按照序號排序
    function orderX(d) {
      return Math.floor((d[0] - 1) % 12) * 300
    }
    function orderY(d) {
      return Math.floor((d[0] - 1) / 12) * 250
    }
    //縮放功能
    function zoomed() {
      x = d3.event.translate[0];
      y = d3.event.translate[1];
      s = d3.event.scale;
      container.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    }
    //svg畫布大小
    var svg = d3.select('.d3Div')
      .append('svg')
      .attr({
        'width': "100%",
        'height': "100%"
      })
      .call(zoom);
    var container = svg.append('g');
    //隨機顏色
    var ramColor = []
    for (i = 0; i < 120; i++) {
      ramColor[i] = '#'
      for (j = 0; j < 6; j++)
        ramColor[i] = ramColor[i] + Math.floor(Math.random() * 12).toString(16)
    }

    //加大圈圈
    var cir = container.selectAll('circle')
      .data(parsedCSV)
      .enter()
    cir.append('circle')
      .attr({
        'cx': function (d, i) { if (i != 0) return parseInt(orderX(d)) + 100 },
        'cy': function (d, i) { if (i != 0) return parseInt(orderY(d)) + 70 },
        'r': function (d, i) { if (i != 0) return 90 },
        'class': 'cirZoom'
      })
      .style({
        'stroke': function (d, i) { if (i != 0) return ramColor[parseInt(d[0]) - 1]; },
        'fill': function (d, i) { if (i != 0) return ramColor[parseInt(d[0]) - 1]; },
        'fill-opacity': 0.2,
        'cursor': 'pointer'
      });
    //加小圈圈
    for (j = 0; j < 10; j++) {
      cir.append('circle')
        .attr({
          'cx': function (d, i) { if (i != 0) return parseInt(orderX(d)) + j * 20 },
          'cy': function (d, i) { if (i != 0) return parseInt(orderY(d)) + 100 + Math.random() * 50; },
          'r': function (d, i) { if (i != 0) return (parseInt(d[j + 5]) + 0.1 * j) + 5; },
          'class': 'gradeCircle'
        })
        .style({
          'stroke': function (d, i) { if (i != 0) return ramColor[parseInt(d[0]) - 1]; },
          'fill': function (d, i) { if (i != 0) return ramColor[parseInt(d[0]) - 1]; },
          'fill-opacity': function (d, i) { if (i != 0) return parseInt(d[j + 5]) * 0.1 },

        });
    }
    //加字
    var texts = container.selectAll('text')
      .data(parsedCSV)
      .enter()
    for (j = 0; j < 5; j++) {
      texts.append('text')
        .attr({
          'x': function (d, i) { if (i != 0) return parseInt(orderX(d)) + 70 },
          'y': function (d, i) { if (i != 0) return parseInt(orderY(d)) + j * 20; },
        })
        .text(
          function (d, i) { if (i != 0) return d[j] }
        )
    }
    //滑鼠移到圈圈就顯示成績
    container.selectAll('.gradeCircle').on('mouseover', function () {
      if (mouseYes == false) {
        var circleNow = d3.select(this);
        circleR = this.getAttribute('r');
        //拿數值
        var grade = Math.floor((this.getAttribute('r') - 5));
        var hwNum = Math.round(((this.getAttribute('r') - 5) - grade) * 10 + 1);
        var coordinates = d3.mouse(this);
        var mouseX = coordinates[0];
        var mouseY = coordinates[1];
        //成績的字
        container.append('text')
          .attr({
            'x': mouseX + 10,
            'y': mouseY + 10,
            'class': 'gradeText'
          })
          .text("作業" + hwNum + "：" + grade + "分")
          .style('font-weight', 'bold')
        //圈變大
        circleNow.attr({ 'r': circleR * 2 })
      }
    });
    //滑鼠離開
    container.selectAll('.gradeCircle').on('mouseout', function () {
      var circleNow = d3.select(this);
      d3.selectAll(".gradeText").remove();
      circleNow.attr({ 'r': circleR })
    });
    // 按姓名就縮放
    container.selectAll('.cirZoom').on('click', function () {
      var textName = d3.select(this);
      var tx = this.getAttribute('cx') * 1;
      var ty = this.getAttribute('cy') * 1;
      //縮
      if (zoomIdk == false) {
        zoomIdk = true;
        textName.transition().duration(500).tween("zoom", function () {
          var si = d3.interpolate(s, 2);
          var xi = d3.interpolate(x, w / 2 - 2 * tx);
          var yi = d3.interpolate(y, h / 2 - 2 * ty);
          return function (t) { svg.call(zoom.translate([xi(t), yi(t)]).scale(si(t)).event); }
        });
      }
      //放
      else {
        zoomIdk = false;
        var textName = d3.select(this);
        textName.transition().duration(500).tween("zoom", function () {
          var si = d3.interpolate(s, 1);
          var xi = d3.interpolate(x, w / 2 - tx);
          var yi = d3.interpolate(y, h / 2 - ty);
          return function (t) {
            svg.call(zoom.translate([xi(t), yi(t)]).scale(si(t)).event);
          }
        });
      }
    });
    svg.call(zoom.event);
  });

}, false);