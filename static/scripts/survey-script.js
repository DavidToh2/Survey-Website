function highlightUnanswered() {

    let canSubmit = true;

    var inputs = $(".input--short, .input--textarea");
    $(inputs).each(function(index, element) {
        if ($(element).val() == '') {
            canSubmit = false;
            $(element).css('background-color', '#FFD0D0');
        }
    })

    $(".input--radio").each(function(index1, element1) {
        var radioOptions = $(element1).children(".radio-option");
        var radioSelected = false;
        $(radioOptions).each(function(index2, element2) {
            var radio = $(element2).children("input[type='radio']").eq(0);
            if ($(radio).is(":checked")) {
                radioSelected = true;
            }
        })
        
        if (!radioSelected) {
            canSubmit = false;
            $(element1).css('background-color', '#FFD0D0');
        }
    })

    return canSubmit;
    
}