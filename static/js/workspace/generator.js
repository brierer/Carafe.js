define(["jquery", "validator"], function($, validator) {
    var clickedElement
    init = function() {
        $("#containment-wrapper").mouseup(function(event) {
            clickedElement = event.target;
        });

        $("#editor").mouseup(function(event) {
            clickedElement = null;
        });

        $("#hide-generator").click(function() {
            $("#generator").hide()
        })


        $("#create-generator").click(
            function() {
               
                if ($("#generator").valid()) {
                    //$("#generator").hide()
                }
                //addTable($('#generator').serializeObject())
                 $("#generator").find("input").slice(1).rules("remove")
            }
        )

        $("#generator").validate({

            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'help-block',
            errorPlacement: function(error, element) {
                if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });
    }

    update = function(f) {

        $("#generator").show()
        console.log($(clickedElement).html())
        $("#generator").show()
        var gen = $("#generator")
     
        gen.find('input').rules("remove");
        gen.children(".form-group:not(:first)").remove()

        gen.children("label").html("Add " + f.title)

        var rules = {}

        f.arg.forEach(function(arg, i) {
            var field = createField(arg.title, i)
            gen.children("button:first").before(field)
            field.find("input").rules("add", arg.validation)
        })



    }

    function createField(name, i) {
        var field = $(".form-group:first").clone()

        field.find(".input-group-addon").html(name)
        field.find("input").attr("name", "arg" + i)

        return field
    }

    return {
        update: update,
        init: init
    }
})
