var {remote, webFrame, ipcRenderer } = require('electron');
var { app, BrowserWindow, globalShortcut, dialog } = remote;
var bwindow = remote.getCurrentWindow();
var fs = require('fs');
webFrame.setVisualZoomLevelLimits(1,1);
webFrame.setLayoutZoomLevelLimits(0,0);
webFrame.setZoomLevel(0);

// globalShortcut.register('Ctrl+R', () => {});

var currentNote = {
    id:null,
    note:0,
    closed:true
}

function sumAll(arr){
    let sumResult = 0;
    for(let x = 0; x < arr.length; x++){
        sumResult += arr[x];
    }
    return sumResult;
}

ipcRenderer.on('newNote', (event, value) => {
    currentNote.note = value[0];
    ipcRenderer.sendTo(value[1], 'close', [])
    currentNote.closed = true;
})

function createNoteButton(note){
    let newButton = $(`<button type="button" class="noteButton btn btn-secondary">${note}</button>`);
    newButton.on('click', (e) => {
        e.target.remove();
    });
    return newButton;
}

function addNote(buttonGroup){
    if(currentNote.id != null)
        return;
    currentNote.closed = false;
    let memberCard = buttonGroup.parents('.memberCard');
    currentNote.id = memberCard.attr('id');
    let win = new BrowserWindow({
        width:320, height:150,
        maximizable: false, transparent:true,
        frame:false, webPreferences:{nodeIntegration:true},
        resizable:false, parent:bwindow, show:false,
        icon:`${__dirname}/img/png/icon.png`
    })

    win.loadFile(`${__dirname}/addNotes.html`);
    win.webContents.on('dom-ready', e => {
        ipcRenderer.sendTo(win.webContents.id, 'parentWebcontents', bwindow.webContents.id);
    })
    win.once('ready-to-show', () => {
        win.show();
    })
    win.on('closed', () => {
        if(currentNote.closed){
            buttonGroup.append(createNoteButton(currentNote.note));            
        }
        currentNote.id = null;
        currentNote.note = 0;
        win = null;
    })
    // win.webContents.openDevTools({mode:'detach'})
}

function getCardInfo(cardId){
    let card = $($(`#${cardId}.memberCard`).get(0));
    let notes = card.find('.noteButton').toArray().map(n => {
        return parseInt($(n).text());
    })
    let name = card.find('.memberNameInput').val();
    return {
        id:cardId, name, notes
    }
}

function getAllCards(){
    let cards = $('.memberCard').toArray().map(c => getCardInfo(c.id));
    return cards;
}

$(() => {
    var cardHtml = undefined;
    $('#minimizeButton').on('click', () => {
        bwindow.minimize();
    })
    $('#closeButton').on('click', () => {
        let msgbx = dialog.showMessageBoxSync(bwindow, {
            type:'warning',
            message:"Deseja sair sem salvar?",
            buttons:['Sim', 'Não', 'Salvar'],
            defaultId:0,
            cancelId:1
        })
        switch(msgbx){
            case 0:
                app.quit();
                break;
            case 2:
                $('#saveProject').click();
                app.quit();
                break;
        }
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
            addNote(buttonGroup);
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
    function newId(cls){
        let clsq = Array.from(document.getElementsByClassName(cls));
        for(did = clsq.length;;did++){
            if(clsq.filter(x => x.id == did).length)
                continue
            else
                return did;
        }
    }
    function addCard(cardAttrs={}, cardText="", notes=[]){
        let newCard = $(cardHtml).clone(true, true)
        newCard
            .hide()
            .attr('id', newId('memberCard'))
            .attr(cardAttrs);
        newCard.find('.memberNameInput').val(cardText);
        if(notes.length > 0){
            let cardb = newCard.find('.cardButton');
            for(let x = 0; x < notes.length; x++){
                cardb.append(createNoteButton(notes[x]));
            }
        }
        $('#blocks').append(newCard);
        newCard.fadeIn();
    }
    $('#addButton').on('click', () => {addCard()})
    globalShortcut.register('CommandOrControl+K', () => {addCard()})
    // Menu Events //
    $('#saveProject').click(e => {
        let fileExtension = 'abpc'
        let diag = dialog.showSaveDialogSync(bwindow, {
            title:"Salvar Projeto",
            filters:[
                {name: 'Arquivo de Pontos', extensions:[fileExtension]}
            ]
        });
        if(diag){
            if(!diag.endsWith('.' + fileExtension)){
                diag += '.' + fileExtension;
            }
            fs.writeFileSync(diag, JSON.stringify({cards:getAllCards()}), {encoding:'utf-8'});
        }
    });
    $('#openProject').click(e => {
        let fileExtension = 'abpc'
        let diag = dialog.showOpenDialogSync(bwindow, {
            title:"Abrir Projeto",
            filters:[
                {name: 'Arquivo de Pontos', extensions:[fileExtension]}
            ]
        });
        if(diag){
            diag = diag[0];
            if(!diag.endsWith('.' + fileExtension)){
                diag += '.' + fileExtension;
            }
            let readedContent = fs.readFileSync(diag, {encoding:'utf-8'}).toString();
            let readedJson = JSON.parse(readedContent);
            let cardList = readedJson.cards;
            $('#blocks').empty();
            for(let x = 0; x < cardList.length; x++){
                addCard({id:cardList[x].id}, cardList[x].name, cardList[x].notes)
            }
        }
    })
    $('#exportProject').click(e => {
        let fileExtension = 'txt'
        let diag = dialog.showSaveDialogSync(bwindow, {
            title:"Exportar Projeto",
            filters:[
                {name: 'Arquivo de Texto', extensions:[fileExtension]}
            ]
        });
        if(diag){
            if(!diag.endsWith('.' + fileExtension)){
                diag += '.' + fileExtension;
            }
            let cards = getAllCards().filter(m => m.name);
            let cardRanking = [];
            for(let x = 0; x < cards.length; x++){
                let Card = cards[x];
                let myCard = {
                    name:Card.name,
                    note:sumAll(Card.notes) + (10 * Card.notes.length)
                }
                if(cardRanking.length == 0){
                    cardRanking.push(myCard);
                }
                else{
                    for(let y = 0; y < cardRanking.length; y++){
                        if(myCard.note > cardRanking[y].note){
                            cardRanking.splice(y, 0, myCard);
                            break;
                        }
                    }
                }
            }
            console.log(cardRanking)
            for(let z = 0; z < cardRanking.length; z++){
                cardRanking[z].position = z + 1;
            }
            let cardRankingStr = cardRanking.map(r => {
                return `${r.position} - ${r.name} | ${r.note}`
            }).join('\n');
            fs.writeFileSync(diag, cardRankingStr, {encoding:'utf-8'});
        }
    });
})