var remote = require('electron').remote;
var { app, BrowserWindow, globalShortcut } = remote;
var bwindow = remote.getCurrentWindow()


function addNote(buttonGroup){
    let win = new BrowserWindow({
        width:320, height:150,
        maximizable: false, transparent:true,
        frame:false, webPreferences:{nodeIntegration:true},
        resizable:false,
        icon:`${__dirname}/img/icon.png`
    })
    BrowserWindow.loadFile(`${__dirname}/front-end/addNotes.html`);
    // MainWindow.webContents.openDevTools({mode:'detach'})
}

$(() => {
    var cardHtml = undefined;
    $('#minimizeButton').on('click', () => {
        bwindow.minimize();
    })
    $('#closeButton').on('click', () => {
        app.quit();
    })
    $("#blocks")
        .sortable({revert:true, axis:"y"})
        .disableSelection();

    $(".removeButton").on('click', (e) => {
        let button = $(e.target);
        let mc = button.parents('.memberCard')
            .fadeOut(complete=() => {
                mc.remove();
            });
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
    $(".addNoteButton").on('click', (e) => {
        let button = $(e.currentTarget);
        let buttonGroup = button.parents('.cardButton');
        if(buttonGroup.children('.noteButton').length < 6){
            let newButton = $(`<button type="button" class="noteButton btn btn-secondary">10</button>`);
            newButton.on('click', (e) => {
                e.target.remove();
            });
            buttonGroup.append(newButton);
        }
    })

    $('.username input').on('keydown', (e) => {
        if(e.key == 'Enter'){
            let inp = $(e.target);
            let pus = inp.parents('.username');
            let button = pus.children('.editbutton');
            if(button.hasClass('bactive')){
                button.removeClass('bactive');
                button.children('img')
                    .attr('src', 'img/svg/edit.svg')
                inp.css({
                        border: "none",
                        "background-color": "transparent"
                    })
                    .attr('readonly', true);            
            }
            else{
                // return;
                button.addClass('bactive');
                button.children('img')
                    .attr('src', 'img/svg/check.svg')
                inp.css({
                        border: "1px solid #0002",
                        "background-color": "white"
                    })
                    .removeAttr('readonly');
            }
        }
    })
    // Card Body Def //
    cardHtml = $('.memberCard').clone(true, true);
    cardHtml.removeAttr('hidden');
    $('.memberCard').remove();
    function addCard(){
        let newCard = $(cardHtml).clone(true, true)
        newCard.hide();
        $('#blocks').append(newCard);
        newCard.fadeIn()
    }
    $('#addButton').on('click', addCard)
    globalShortcut.register('CommandOrControl+K', addCard)
})