var {remote, ipcRenderer } = require('electron');
var bwindow = remote.getCurrentWindow();
var parentwebContents = undefined;

ipcRenderer.on('close', e => {
    bwindow.close();
})

ipcRenderer.on('parentWebcontents', (event, wc) => {
    parentwebContents = wc;
    
    $(() => {
        $('#minimizeButton').on('click', () => {
            bwindow.minimize();
        })
        $('#closeButton').on('click', () => {
            bwindow.close();
        })
        $('#noteInput')
            .on('input propertychange', e => {
                let ni = $(e.currentTarget);
                ni.val(Array.from(ni.val()).filter(chr => !isNaN(chr) || chr == ',').join(''));
            })
            .focus();
        $('#formb').submit(e => {
            e.preventDefault();
            let noteValue = $("#noteInput").val();
            noteValue = noteValue.split(',')
                .map(rnb => {
                    let nb = parseInt(rnb);
                    return nb > 10 ? 10 : nb;
                })
                .filter(nn => !isNaN(nn));
            newNoteValue = 0;
            for(let x = 0; x < noteValue.length; x++){
                newNoteValue += noteValue[x];
            }
            newNoteValue = Math.floor(newNoteValue / noteValue.length);
            newNoteValue = newNoteValue != 0 && !newNoteValue ? 0 : newNoteValue;
            ipcRenderer.sendTo(parentwebContents, 'newNote', [newNoteValue, bwindow.webContents.id]);
        })
        $('#submitButton').click(e => {
            $('#formb').submit();
        })
    })
    
})
