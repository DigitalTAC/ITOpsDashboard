(function ($) {
    function init(plot) {
        var debugLevel = 1;

        function checkDebugEnabled(plot, options) {
            if (options.debug) {
                debugLevel = options.debug;
                plot.hooks.processDatapoints.push(alertSeries);
            }
        }

        function alertSeries(plot, series, datapoints) {
            var msg = "series " + series.label;
            if (debugLevel > 1) {
                msg += " with " + series.data.length + " points";
                //console.log(msg);
								if (series.data.length) debugger;
                if(series.label === 'Raised') {
                	console.log(plot.pointOffset({ x: 1483245000, y: 16}));
                }
            }
        }

        plot.hooks.processOptions.push(checkDebugEnabled);
    }

    var options = { debug: 0 };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "simpledebug",
        version: "0.1"
    });
})(jQuery);