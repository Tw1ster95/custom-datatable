Custom Vanilla Javascript DataTable.  
  
Usage:
```javascript
const newDataTable = new DataTable({
    id: 'dataTableID',
    dataFile: 'data-table.php',
    perPage: 5,
    sql_cols: [ 'cmod.cmodel_id', 'cmod.cmodel_name', 'cmake.cmake_name' ],
    sql_from: 'car_models as cmod',
    sql_join: 'INNER JOIN car_makes as cmake ON cmake.cmake_id = cmod.cmodel_make_id',
    sql_where: '',
    colFormat: (col_id, row_data) => {
        if(col_id == 1) return `<div style="color: red; text-align: center">${row_data[col_id]}</div>`;
    },
    rowCreated: (row, data) => {
        console.log('row created');
    },
    initComplete: (data) => {
        console.log(data);
    },
    error: (err) => {
        console.error(err);
    }
});
```
Warning! If building the sql in javascript instead of doing it in the PHP you should implement some sort of Authentication or someone could take advantage of it.
