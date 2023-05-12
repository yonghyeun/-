<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Plotly Rubber Band Demo</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  </head>
  <body>
    <div id="plot"></div>
    <script>
      var data = {
        x: [1, 2, 3, 4, 5],
        y: [1, 3, 2, 4, 3],
        type: "scatter",
        mode: "lines",
        line: {
          width: 3,
          color: "blue",
        },
      };

      var layout = {
        margin: { t: 0 },
        xaxis: { range: [0, 6] },
        yaxis: { range: [0, 5] },
      };

      Plotly.newPlot("plot", [data], layout);

      var rubberBand = false;
      var pointsToMove = [];

      var plot = document.getElementById("plot");

      plot.onmousedown = function (event) {
        var curveNumber, pointNumber;
        var closestPoint = Plotly.d3.event.target.closest('.scatterlayer').closest('.trace').node();

        if(closestPoint) {
          curveNumber = closestPoint.getAttribute('data-i');
          var cd = closestPoint.calcdata;

          for (var i = 0; i < cd[0].length; i++) {
            var d = cd[0][i];
            var x = cd[0][i].xaxis.l2p(d.x);
            var y = cd[0][i].yaxis.l2p(d.y);

            if (Math.abs(x - Plotly.d3.event.x) < 5 && Math.abs(y - Plotly.d3.event.y) < 5) {
              pointNumber = i;
              break;
            }
          }
          if(pointNumber != undefined) {
            rubberBand = true;
            pointsToMove.push([curveNumber, pointNumber]);
          }
        }
      };

      plot.onmousemove = function (event) {
        if (rubberBand) {
          var x = Plotly.d3.event.x;
          var y = Plotly.d3.event.y;

          for (var i = 0; i < pointsToMove.length; i++) {
            var curveNumber = pointsToMove[i][0];
            var pointNumber = pointsToMove[i][1];

            var update = {
              x: [[1, 2, 3, 4, 5]],
              y: [[1, 3, 2, 4, 3]],
            };

            update.x[0][pointNumber] = Plotly.d3.event.xaxis.p2l(x);
            update.y[0][pointNumber] = Plotly.d3.event.yaxis.p2l(y);

            Plotly.update("plot", update);
          }
        }
      };

      plot.onmouseup = function () {
        rubberBand = false;
        pointsToMove = [];

        Plotly.animate(
          "plot",
          {
            data: [{ line: { color: "blue" } }],
          },
          { transition: { duration: 500 } }
        );
      };
    </script>
  </body>
</html>
