(function ($) {
    function init(plot) {


        function alertSeries(plot, ctx) {
					$.each(plot.getData(), function(ii, series) {

						//if (series.data.length) debugger;
						if(series.markMinMax) {

							if(series.data.length) {

								//console.log(JSON.stringify(series.datapoints.points));
								var yPoints = [];
								series.datapoints.points.forEach(function(point, i){
									if(i%2) {
										yPoints.push( point );
									}
								});

								console.log('ii', ii);

								ctx.strokeStyle='rgba(255, 0, 0, .6)';
								ctx.fillStyle = 'rgba(255, 255, 255, 0)'; //transparent
								ctx.lineWidth = 5;

								if(series.markMinMax && series.markMinMax.markMax === true){

									var maxValue = Math.max.apply(null, yPoints);
									var minIndices = []; // Will store all indices of maxValue as you search

									for (var i = 0; i < yPoints.length; i++) {

											if (yPoints[i] === maxValue) {
													minIndices.push(i);
											}
									}

									for (j = 0; j < minIndices.length; j++) {

											cx = series.xaxis.p2c(minIndices[j]) + plot.getPlotOffset().left;
											cy = series.yaxis.p2c(maxValue) + plot.getPlotOffset().top;
											//drawStar(ctx, cx, cy, 5, 4, 2);
											drawTriangle(ctx, cx, cy, 4);
									}



								}


							}
						}
					});
        }

        plot.hooks.draw.push(alertSeries);


    }

    var options = { debug: 0 };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "indicateMax",
        version: "0.1"
    });
    function drawTriangle(ctx, cx, cy, radius){
			var side, x, y;
      ctx.beginPath();
      //ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
			//ctx.stroke();
      side = Math.sqrt(3) * radius;
      x = cx - side/2;
      y = cy + side / (2 * Math.sqrt(3));
      ctx.moveTo(x, y);

      x = cx + side/2;
      y = cy + side / (2 * Math.sqrt(3));
      ctx.lineTo(x,y);

      x = cx;
      y = cy - side / Math.sqrt(3);
      ctx.lineTo(x,y);

      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

    function drawStar(ctx, cx,cy,spikes, outerRadius,innerRadius){
      var rot=Math.PI/2*3;
      var x=cx;
      var y=cy;
      var step=Math.PI/spikes;

      ctx.beginPath();
      ctx.moveTo(cx,cy-outerRadius)
      for(i=0;i<spikes;i++){
        x=cx+Math.cos(rot)*outerRadius;
        y=cy+Math.sin(rot)*outerRadius;
        ctx.lineTo(x,y)
        rot+=step

        x=cx+Math.cos(rot)*innerRadius;
        y=cy+Math.sin(rot)*innerRadius;
        ctx.lineTo(x,y)
        rot+=step
      }
      ctx.lineTo(cx,cy-outerRadius);
      ctx.closePath();
      //ctx.strokeStyle='blue';
      ctx.stroke();
      //ctx.fillStyle='skyblue';
      ctx.fill();
    }
})(jQuery);