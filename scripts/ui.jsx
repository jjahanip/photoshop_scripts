﻿function promptSingleDataset(){
    
    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
    dialog.text = "Load single dataset into stack from script"; 
    dialog.orientation = "column"; 
    dialog.alignChildren = ["left","top"]; 
    dialog.spacing = 10; 
    dialog.margins = 16;
    
    
    // SCRIPTGROUP
    // ===========
    var scriptGroup = dialog.add("group", undefined, {name: "scriptGroup"}); 
    scriptGroup.orientation = "row"; 
    scriptGroup.alignChildren = ["left","center"]; 
    scriptGroup.spacing = 10; 
    scriptGroup.margins = 0; 

    var scriptTxt = scriptGroup.add("statictext", undefined, undefined, {name: "scriptTxt"}); 
    scriptTxt.text = "Script:"; 
    scriptTxt.preferredSize.width = 60; 

    var scriptInput = scriptGroup.add('edittext {properties: {name: "scriptInput"}}'); 
    scriptInput.preferredSize.width = 500; 

    var scriptBrowse = scriptGroup.add("button", undefined, undefined, {name: "scriptBrowse"}); 
    scriptBrowse.text = "Browse"; 
    scriptBrowse.justify = "right";
    scriptBrowse.onClick = function () {scriptInput.text = File.openDialog ("Select the script file", "Comma-separated values: *.csv, All Files: *.*").fsName};
    
    
    // inputGROUP
    // ===========
    var inputGroup = dialog.add("group", undefined, {name: "inputGroup"}); 
    inputGroup.orientation = "row"; 
    inputGroup.alignChildren = ["left","center"]; 
    inputGroup.spacing = 10; 
    inputGroup.margins = 0; 

    var inputTxt = inputGroup.add("statictext", undefined, undefined, {name: "inputTxt"}); 
    inputTxt.text = "Input folder:"; 
    inputTxt.preferredSize.width = 60; 

    var inputInput = inputGroup.add('edittext {properties: {name: "inputInput"}}'); 
    inputInput.preferredSize.width = 500; 

    var inputBrowse = inputGroup.add("button", undefined, undefined, {name: "inputBrowse"}); 
    inputBrowse.text = "Browse"; 
    inputBrowse.justify = "right";
    inputBrowse.onClick = function () {
        var inputFolder =  Folder.selectDialog('Select input folder');
        inputInput.text = inputFolder.fsName;
        saveInput.text =  File(decodeURI(inputFolder.parent) + "/" + decodeURI(inputFolder.name) + ".psb").fsName;
    };


    // SAVEGROUP
    // =========
    var saveGroup = dialog.add("group", undefined, {name: "saveGroup"}); 
    saveGroup.orientation = "row"; 
    saveGroup.alignChildren = ["left","center"]; 
    saveGroup.spacing = 10; 
    saveGroup.margins = 0; 

    var saveTxt = saveGroup.add("statictext", undefined, undefined, {name: "saveTxt"}); 
    saveTxt.text = "Save:"; 
    saveTxt.preferredSize.width = 60; 

    var saveInput = saveGroup.add('edittext {properties: {name: "saveInput"}}'); 
    saveInput.preferredSize.width = 500; 
    
    var saveBrowse = saveGroup.add("button", undefined, undefined, {name: "saveBrowse"}); 
    saveBrowse.text = "Browse"; 
    saveBrowse.onClick = function (){saveInput.text =  File.openDialog("Save file", "Large Document Format: *.psb, All Files: *.*").fsName};


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
        return [scriptInput.text, inputInput.text, saveInput.text];
       }
}

function promptMultipleDatasets(){
    
    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
    dialog.text = "Load multiple datasets into stack from script"; 
    dialog.orientation = "column"; 
    dialog.alignChildren = ["left","top"]; 
    dialog.spacing = 10; 
    dialog.margins = 16;
    
    
    // SCRIPTGROUP
    // ===========
    var scriptGroup = dialog.add("group", undefined, {name: "scriptGroup"}); 
    scriptGroup.orientation = "row"; 
    scriptGroup.alignChildren = ["left","center"]; 
    scriptGroup.spacing = 10; 
    scriptGroup.margins = 0; 

    var scriptTxt = scriptGroup.add("statictext", undefined, undefined, {name: "scriptTxt"}); 
    scriptTxt.text = "Script:"; 
    scriptTxt.preferredSize.width = 60; 

    var scriptInput = scriptGroup.add('edittext {properties: {name: "scriptInput"}}'); 
    scriptInput.preferredSize.width = 500; 

    var scriptBrowse = scriptGroup.add("button", undefined, undefined, {name: "scriptBrowse"}); 
    scriptBrowse.text = "Browse"; 
    scriptBrowse.justify = "right";
    scriptBrowse.onClick = function () {scriptInput.text = File.openDialog ("Select the script file", "Comma-separated values: *.csv, All Files: *.*").fsName};
    
    
    // inputGROUP
    // ===========
    var inputGroup = dialog.add("group", undefined, {name: "inputGroup"}); 
    inputGroup.orientation = "row"; 
    inputGroup.alignChildren = ["left","center"]; 
    inputGroup.spacing = 10; 
    inputGroup.margins = 0; 

    var inputTxt = inputGroup.add("statictext", undefined, undefined, {name: "inputTxt"}); 
    inputTxt.text = "Parent folder:"; 
    inputTxt.preferredSize.width = 60; 

    var inputInput = inputGroup.add('edittext {properties: {name: "inputInput"}}'); 
    inputInput.preferredSize.width = 500; 

    var inputBrowse = inputGroup.add("button", undefined, undefined, {name: "inputBrowse"}); 
    inputBrowse.text = "Browse"; 
    inputBrowse.justify = "right";
    inputBrowse.onClick = function () {inputInput.text =  Folder.selectDialog('Select parent input folder').fsName};


    // SAVEGROUP
    // =========
    var subfolderGroup = dialog.add("group", undefined, {name: "saveGroup"}); 
    subfolderGroup.orientation = "row"; 
    subfolderGroup.alignChildren = ["left","center"]; 
    subfolderGroup.spacing = 10; 
    subfolderGroup.margins = 0; 

    var subfolderTxt = subfolderGroup.add("statictext", undefined, undefined, {name: "saveTxt"}); 
    subfolderTxt.text = "Subfolder:"; 
    subfolderTxt.preferredSize.width = 60; 

    var subfolderInput = subfolderGroup.add('edittext {properties: {name: "subfolderInput"}}'); 
    subfolderInput.preferredSize.width = 500; 
    
    var subfolderBrowse = subfolderGroup.add("button", undefined, undefined, {name: "saveBrowse"}); 
    subfolderBrowse.text = "Browse"; 
    subfolderBrowse.onClick = function (){subfolderInput.text =  Folder.selectDialog('Select subfolder').name};


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
        return [scriptInput.text, inputInput.text, subfolderInput.text];
       }
}