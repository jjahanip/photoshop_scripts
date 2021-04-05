function promptUI(){

    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
        dialog.text = "Load file from script"; 
        dialog.orientation = "column"; 
        dialog.alignChildren = ["left","top"]; 
        dialog.spacing = 10; 
        dialog.margins = 16; 

    // // inputGROUP
    // // ===========
    // var inputGroup = dialog.add("group", undefined, {name: "inputGroup"}); 
    //     inputGroup.orientation = "row"; 
    //     inputGroup.alignChildren = ["left","center"]; 
    //     inputGroup.spacing = 10; 
    //     inputGroup.margins = 0; 

    // var inputTxt = inputGroup.add("statictext", undefined, undefined, {name: "inputTxt"}); 
    //     inputTxt.text = "Input folder:"; 
    //     inputTxt.preferredSize.width = 60; 

    // var inputInput = inputGroup.add('edittext {properties: {name: "inputInput"}}'); 
    //     inputInput.preferredSize.width = 500; 

    // var inputBrowse = inputGroup.add("button", undefined, undefined, {name: "inputBrowse"}); 
    //     inputBrowse.text = "Browse"; 
    //     inputBrowse.justify = "right";
    //     inputBrowse.onClick = function () {inputInput.text =  Folder.selectDialog('Select input folder').fsName};

    // SCRIPTGROUP
    // ===========
    var scriptGroup = dialog.add("group", undefined, {name: "scriptGroup"}); 
        scriptGroup.orientation = "row"; 
        scriptGroup.alignChildren = ["left","center"]; 
        scriptGroup.spacing = 10; 
        scriptGroup.margins = 0; 

    var scriptTxt = scriptGroup.add("statictext", undefined, undefined, {name: "scriptTxt"}); 
        scriptTxt.text = "Script:"; 
        scriptTxt.preferredSize.width = 40; 

    var scriptInput = scriptGroup.add('edittext {properties: {name: "scriptInput"}}'); 
        scriptInput.preferredSize.width = 500; 

    var scriptBrowse = scriptGroup.add("button", undefined, undefined, {name: "scriptBrowse"}); 
        scriptBrowse.text = "Browse"; 
        scriptBrowse.justify = "right";
        scriptBrowse.onClick = function () {scriptInput.text = File.openDialog ("Select the script file", "Comma-separated values: *.csv, All Files: *.*").fsName};

    // SAVEGROUP
    // =========
    var saveGroup = dialog.add("group", undefined, {name: "saveGroup"}); 
        saveGroup.orientation = "row"; 
        saveGroup.alignChildren = ["left","center"]; 
        saveGroup.spacing = 10; 
        saveGroup.margins = 0; 

    var saveTxt = saveGroup.add("statictext", undefined, undefined, {name: "saveTxt"}); 
        saveTxt.text = "Save:"; 
        saveTxt.preferredSize.width = 40; 

    var saveInput = saveGroup.add('edittext {properties: {name: "saveInput"}}'); 
        saveInput.preferredSize.width = 500; 

    var saveBrowse = saveGroup.add("button", undefined, undefined, {name: "saveBrowse"}); 
        saveBrowse.text = "Browse"; 
        saveBrowse.onClick = function () {saveInput.text =  File.openDialog("Save file", "Large Document Format: *.psb, All Files: *.*").fsName};

    // BUTTONSGROUP
    // ============
    var buttonsGroup = dialog.add("group", undefined, {name: "buttonsGroup"}); 
        buttonsGroup.orientation = "row"; 
        buttonsGroup.alignChildren = ["left","bottom"]; 
        buttonsGroup.spacing = 10; 
        buttonsGroup.margins = 0; 
        buttonsGroup.alignment = ["right","top"]; 

    var okButton = buttonsGroup.add("button", undefined, undefined, {name: "ok"}); 
        okButton.text = "OK"; 
        okButton.alignment = ["left","center"];

    var cancelButton = buttonsGroup.add("button", undefined, undefined, {name: "cancel"}); 
        cancelButton.text = "Cancel"; 

    if (dialog.show() == 1){
        return [scriptInput.text, saveInput.text];
       }
}