var remote = require('electron').remote;
var { app, BrowserWindow } = remote;

$(() => {
    var cardHtml = undefined;

    $('#addButton').on('click', async () => {
        let newCard = $(cardHtml).clone(true, true)
        $('#blocks').append(newCard);
    })
    $('#minimizeButton').on('click', () => {
        remote.getCurrentWindow().minimize();
    })
    $('#closeButton').on('click', () => {
        app.quit();
    })
    $('.noteButton').on('click', (e) => {
        e.target.remove();
    })
    $("#blocks")
        .sortable({revert:true, axis:"y"})
        .disableSelection();

    $(".removeButton").on('click', (e) => {
        let button = $(e.target);
        button.parents('.memberCard').remove();
    })

    $('.editbutton').on('click', (e) => {
        let button = $(e.currentTarget);
        let pus = button.parents('.username');
        if(button.hasClass('bactive')){
            button.removeClass('bactive');
            button.children('img')
                .attr('src', 'img/svg/edit.svg')
            pus.children('input')
                .css({
                    border: "none",
                    "background-color": "transparent"
                })
                .attr('readonly', true);            
        }
        else{
            button.addClass('bactive');
            button.children('img')
                .attr('src', 'img/svg/check.svg')
            pus.children('input')
                .css({
                    border: "1px solid #0002",
                    "background-color": "white"
                })
                .removeAttr('readonly');
        }
    })
    cardHtml = $('.memberCard').clone(true, true);
    cardHtml.removeAttr('hidden');
    $('.memberCard').remove();
})