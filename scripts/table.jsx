function unique (_arr) {
    var o = {}, a = [], i, e;
    for (i = 0; e = _arr[i]; i++) {o[e] = 1};
    for (e in o) {a.push (e)};
    return a;
    }

function getCol(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
        column.push(matrix[i][col]);
    }
    return column;
    }

function read_table(txtFile) {

    // set to 'UTF8' or 'UTF-8'
    txtFile.encoding = 'UTF8';

    // start reading
    txtFile.open("r");

    // read column names
    var columns = txtFile.readln().split(',');

    // make sure columns in file are as expected
    expected_columns = ['filename', 'biomarker', 'hue', 'group'];
    if (columns.join(',') !== expected_columns.join(',')) {
        alert('script file must have columns:\n"filename" "biomarker" hue" "group"');
        throw new Error("Script columns don't match!");
    }

    // define variable for table
    var table = new Array();

    // push lines to the table
    while (!txtFile.eof) {
        var line = txtFile.readln().split(',');
        table.push(line);
    }

    // close file
    txtFile.close();

    // take the forth column (groups)
    var groups = getCol(table, 3);
    groups = unique(groups);

    return [table, columns, groups];
}
