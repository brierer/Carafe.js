define(["./eqobj"], function(eqobj) {

    var isCalculatingWaiting = false;

    var startTime = new Date().getTime();


    function eqEvaluation(fn) {
        $('#invisible-wrapper').css("visibility", "visible");
        startTime = new Date().getTime();
        var formData = $("form").serialize();
        isCalculatingWaiting = true;
        $.post('postCalcResult', formData, function() {
            initPollingGetCalcResult(fn);
        });
    };


    function initPollingGetCalcResult(fn) {
        setTimeout(function() {
            pollingServerCalcGetResult(0,fn);
        }, 10);
    }

    function pollingServerCalcGetResult(nbTry,fn) {
        if (nbTry < 5) {
            var id_form = $("#id_form_id").serialize();
            var id_book = $("#id_book_id").serialize();
            $.getJSON('getCalcResult/?' + id_form, function(r) {
                var now = new Date().getTime();
                var timesRun = nbTry;
                console.log('Action ' + (timesRun + 1) + ' started ' + (now - startTime) + 'ms after script start');
                if (r != null) {
                    eqobj.eqWrapper.setEQ(r.parse)
                    fn(r);
                    isCalculatingWaiting = false;
                } else {
                    setTimeout(function() {
                        pollingServerCalcGetResult(nbTry + 1)
                    }, 10);
                }
            });
        } else {
            console.log("Hummm, this is long , very long");
            isCalculatingWaiting = false;
        }
    }
    return {
        'initPollingGetCalcResult': initPollingGetCalcResult,
        'eqEvaluation': eqEvaluation
    };

});
