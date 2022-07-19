
# Javascript/PHP/MySQL DataTable

Vanilla Javascript DataTable using PHP as back end to fetch data from MySQL.

## Usage/Examples

Javascript:
```javascript
const newDataTable = new DataTable({
    id: 'dataTableID',
    ajax: {
        url: 'data-random-users.php',
        method: 'POST'
    },
    perPage: {
        default: 20,
        selector: true,
        options: [ 5, 10, 20, 50, 100 ]
    },
    searchBox: {
        enable: true,
        timeout: 400
    },
    colVisibilitySelector: {
        enable: true,
        name: 'Select Columns'
    },
    colSelectFilter: [ 1, 2 ],
    tooManyUseInput: false,
    // Format column before append
    colFormat: (tr, col_id, row_data) => {
        if(col_id == 2) return `<a href="mailto:${row_data[col_id]}">${row_data[col_id]}</a>`;
        else if(col_id == 3) return `<div contenteditable="true">${row_data[col_id]}</div>`;
    },
    // Table Column is created
    colCreated: (tr, td, col_id, row_data) => {
        //
    },
    // Table Row is created
    rowCreated: (tr, data) => {
        // We get the div in the column that we have set the contenteditable to
        const el = tr.querySelector('[contenteditable="true"]');
        if(!el) return;
        // We add it some events
        el.addEventListener('focus', (e) => el.setAttribute('old-text', el.innerText));
        el.addEventListener('focusout', (e) => {
            if(e.currentTarget.innerText !== e.currentTarget.getAttribute('old-text')) console.log(e.currentTarget);
            e.currentTarget.setAttribute('old-text', '');
        });
    },
    // On table fully loaded
    initComplete: (data) => {
        //console.log(data);
    },
    // On error
    error: (err) => {
        console.error(err);
    }
});
```

PHP file:
```php
<?php
    $qColumns = [ "id", "name", "email", "random_num", "random_string" ];
    $qFrom = "test_table";
    $qJoin = "";
    $qWhere = "";
    
    include 'datatable-func.php';
?>
```
## Screenshots

![App Screenshot](https://gcdnb.pbrd.co/images/8Qj7Lz0xdl2o.png?o=1)

