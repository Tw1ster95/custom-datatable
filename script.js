class DataTable {
    constructor({
        id,
        dataFile = 'data-table.php',
        sql_cols = [],
        sql_from = '',
        sql_join = '',
        sql_where = '',
        perPageDefault = 20,
        perPageSelector = true,
        perPageSelectorContainer = null,
        perPageOptions = [ 5, 10, 20, 50, 100 ],
        searchBox = false,
        searchBoxContainer = null,
        columnSelector = null,
        tooManyUseInput = false,
        rowCreated = () => {},
        colFormat = () => {},
        initComplete = () => {},
        error = (err) => { console.error(err) }
    }) {
        if(!id) return;
        this.table = document.getElementById(id);
        if(!this.table) return;
        this.table.setAttribute('data-table', '');
        this.perPage = perPageDefault;
        this.perPageSelector = perPageSelector;
        this.perPageOptions = perPageOptions;
        this.tooManyUseInput = tooManyUseInput;
        this.columnSelector = columnSelector;
        this.columnSelected = new Array();
        this.dataFile = dataFile;
        this.searchBox = searchBox;
        this.searchTimeout = null;
        this.searchText = '';
        this.sql_cols = sql_cols;
        this.sql_from = sql_from;
        this.sql_join = sql_join;
        this.sql_where = sql_where;
        this.initComplete = initComplete;
        this.error = error;
        this.rowCreated = rowCreated;
        this.colFormat = colFormat;
        this.page = 0;
        this.orderby = 0;
        this.order_direction = 'ASC';
        this.columns_count = this.table.querySelectorAll('thead th')?.length;
        if(!this.columns_count) return;
        if(this.dataFile) this.getDataFromFile();
        this.addHeaderSortListeners();
        this.addColumnSelector();
        this.addSearchBox(searchBoxContainer);
        this.addPerPageSelector(perPageSelectorContainer);
    }

    getDataFromFile = async () => {
        const fd = new FormData();
        fd.append('page', this.page);
        fd.append('limit', this.perPage);
        fd.append('orderby', this.orderby);
        fd.append('order_direction', this.order_direction);
        if(this.sql_cols) this.sql_cols.forEach(c => fd.append('sql_cols[]', c));
        fd.append('sql_from', this.sql_from);
        fd.append('sql_join', this.sql_join);
        fd.append('sql_where', this.sql_where);
        fd.append('search_text', this.searchText);

        const response = await fetch(this.dataFile, {
            method: 'POST',
            body: fd
        });
        if(!response) return;
        try {
            const json = await response.json();
            this.totalRows = json[0].total_rows;
            if(!this.totalRows) this.noDataFound();
            else {
                this.replaceRows(json[0].data);
                this.addPagination();
            }
            this.initComplete({
                data: json[0].data,
                total_rows: json[0].total_rows,
                table: this.table
            });
        }
        catch(err) {
            this.error(err);
        }
    }

    getDefaultFiltersContainer = () => {
        let filtersContainer = this.table.closest('.data-table-container').querySelector('.data-table-filters');
        if(!filtersContainer) {
            filtersContainer = document.createElement('div');
            filtersContainer.classList.add('data-table-filters');
            filtersContainer.setAttribute('for-data-table', this.table.getAttribute('id'));
            this.table.before(filtersContainer);
        }
        return filtersContainer;
    }

    getDefaultSelectorsContainer = () => {
        let selectorsContainer = this.table.closest('.data-table-container').querySelector('.data-table-selectors');
        if(!selectorsContainer) {
            selectorsContainer = document.createElement('div');
            selectorsContainer.classList.add('data-table-selectors');
            selectorsContainer.setAttribute('for-data-table', this.table.getAttribute('id'));
            this.table.before(selectorsContainer);
        }
        return selectorsContainer;
    }

    addColumnSelector = () => {
        if(!this.columnSelector || !this.columnSelector.enable) return;
        if(this.columnSelector.container) this.columnSelector.container = document.querySelector(this.columnSelector.container);
        if(!this.columnSelector.container) this.columnSelector.container = this.getDefaultSelectorsContainer();
        const div = document.createElement('div');
        div.classList.add('columns-selector');
        const label = document.createElement('label');
        label.innerText = this.columnSelector.name || 'Column Selector';
        label.addEventListener('click', (e) => e.currentTarget.parentElement.classList.toggle('open'));
        const container = document.createElement('ul');
        const headers = this.table.querySelectorAll('thead th');
        let item;
        for(let i = 0; i < this.columns_count; i++) {
            this.columnSelected.push(i);
            item = document.createElement('li');
            item.classList.add('selected');
            item.innerText = headers[i].innerText;
            item.addEventListener('click', this.toggleSelectedColumn);
            container.append(item);
        }
        div.append(label);
        div.append(container);
        this.columnSelector.container.prepend(div);
    }

    toggleSelectedColumn = (e) => {
        const elIndex = Array.prototype.indexOf.call(e.currentTarget.parentNode.children, e.currentTarget);
        const colIndex = this.columnSelected.findIndex(c => c == elIndex);
        if(e.currentTarget.classList.contains('selected')) {
            e.currentTarget.classList.remove('selected');
            if(colIndex > -1) {
                this.columnSelected.splice(colIndex, 1);
                this.showColumn(elIndex);
            }
        }
        else {
            e.currentTarget.classList.add('selected');
            if(colIndex == -1) {
                this.columnSelected.push(elIndex);
                this.hideColumn(elIndex);
            }
        }
    }

    showColumn = (i) => {
        let children = this.table.querySelectorAll(`thead tr th:nth-child(${i+1})`);
        for(let a = 0; a < children.length; a++) {
            if(!children[a].classList.contains('hidden')) children[a].classList.add('hidden');
        }
        children = this.table.querySelectorAll(`tbody tr td:nth-child(${i+1})`);
        for(let a = 0; a < children.length; a++) {
            if(!children[a].classList.contains('hidden')) children[a].classList.add('hidden');
        }
    }

    hideColumn = (i) => {
        let children = this.table.querySelectorAll(`thead tr th:nth-child(${i+1})`);
        for(let a = 0; a < children.length; a++) {
            if(children[a].classList.contains('hidden')) children[a].classList.remove('hidden');
        }
        children = this.table.querySelectorAll(`tbody tr td:nth-child(${i+1})`);
        for(let a = 0; a < children.length; a++) {
            if(children[a].classList.contains('hidden')) children[a].classList.remove('hidden');
        }
    }

    addPerPageSelector = (perPageSelectorContainer) => {
        if(!this.perPageSelector || !this.perPageOptions?.length) return;
        if(perPageSelectorContainer) this.perPageSelectorContainer = document.querySelector(perPageSelectorContainer);
        if(!this.perPageSelectorContainer) this.perPageSelectorContainer = this.getDefaultFiltersContainer();
        const div = document.createElement('div');
        div.classList.add('entries-filter');
        const span = document.createElement('span');
        span.innerHTML = "Per Page:";
        const select = document.createElement('select');
        select.addEventListener('change', this.onPerPageChange);
        let option;
        this.perPageOptions.forEach(o => {
            option = document.createElement('option');
            option.value = o;
            option.innerHTML = o;
            if(o == this.perPage) option.selected = true;
            select.append(option);
        })
        div.append(span);
        div.append(select);
        this.perPageSelectorContainer.prepend(div);
    }

    addSearchBox = (searchBoxContainer) => {
        if(!this.searchBox) return;
        if(searchBoxContainer) this.searchBoxContainer = document.querySelector(searchBoxContainer);
        if(!this.searchBoxContainer) this.searchBoxContainer = this.getDefaultFiltersContainer();
        const div = document.createElement('div');
        div.classList.add('search-filter');
        const span = document.createElement('span');
        span.innerHTML = "Search:";
        const input = document.createElement('input');
        input.type = "text";
        input.addEventListener('keyup', this.onSearchInput);

        div.append(span);   
        div.append(input);
        this.searchBoxContainer.prepend(div);
    }

    onPerPageChange = (e) => {
        this.perPage = e.currentTarget.value;
        this.getDataFromFile();
    }

    onSearchInput = (e) => {
        if(this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(this.searchFilterTable, 500, e.currentTarget.value);
    }

    searchFilterTable = (text) => {
        this.searchText = text;
        this.getDataFromFile();
    }

    noDataFound = () => {
        if(this.page > 0) {
            this.page = 0;
            this.getDataFromFile();
            return;
        }
        const tbody = this.table.querySelector('tbody') || this.generateTBody();
        tbody.textContent = '';
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', this.columns_count);
        td.innerHTML = 'No data found.';
        tr.append(td);
        tbody.append(tr);
    }

    generateTBody = () => {
        const tbody = document.createElement('tbody');
        this.table.append(tbody);
        return tbody;
    }

    generateTFoot = () => {
        const tfoot = document.createElement('tfoot');
        this.table.append(tfoot);
        return tfoot;
    }

    replaceRows = (data) => {
        this.rows = new Array();
        const tbody = this.table.querySelector('tbody') || this.generateTBody();
        tbody.textContent = '';
        let tr, td, i, a, cols = data[0].length, formated;
        for(a = 0; a < this.perPage; a++) {
            tr = document.createElement('tr');
            tr.classList.add((a % 2 == 0) ? 'even' : 'odd');
            if(a < data.length) {
                for(i = 0; i < cols; i++) {
                    td = document.createElement('td');
                    formated = this.colFormat(i, data[a]);
                    td.innerHTML = (formated == undefined) ? data[a][i] : formated;
                    if(this.columnSelected.findIndex(c => c == i) == -1) td.classList.add('hidden');
                    tr.append(td);
                }
            }
            tbody.append(tr);
            this.rowCreated(tr, data[a]);
        }
    }

    addPagination = () => {
        let tfoot = this.table.querySelector('tfoot') || this.generateTFoot();
        let pagesCount = 0;
        pagesCount = tfoot.querySelectorAll('tr td .pages-container')?.length || 0;
        this.totalPages = Math.floor(this.totalRows / this.perPage) + ((this.totalRows % this.perPage) > 0 ? 1 : 0);
        let i, div, tr, td, input;
        if(!pagesCount) {
            tr = document.createElement('tr');
            td = document.createElement('td');
            td.setAttribute('colspan', this.columns_count);
            const pageInfoConatiner = document.createElement('div');
            const pageItemsStart = (this.page * this.perPage) + 1;
            pageInfoConatiner.innerText = `Showing ${pageItemsStart} to ${(pageItemsStart + this.perPage > this.totalRows ? this.totalRows : (pageItemsStart + this.perPage))} of ${this.totalRows} entries`;
            pageInfoConatiner.classList.add('page-info');
            td.append(pageInfoConatiner);
            tr.append(td);
            tfoot.append(tr);

            tr = document.createElement('tr');
            td = document.createElement('td');
            td.setAttribute('colspan', this.columns_count);
            const paginationConatiner = document.createElement('div');
            paginationConatiner.classList.add('pages-container');
            this.prevBtn = document.createElement('div');
            this.prevBtn.innerHTML = 'Previous';
            this.prevBtn.setAttribute('data-prev', '');
            this.prevBtn.classList.add('page_btn_prev');
            this.prevBtn.classList.add('disabled');
            this.prevBtn.addEventListener('click', this.prevClickEvent);
            paginationConatiner.append(this.prevBtn);
            const tooMany = (this.totalPages > 20);
            if(tooMany) {
                if(this.tooManyUseInput) {
                    for(i = 0; i < this.totalPages; i++) {
                        if(i == 6) {
                            input = document.createElement('input');
                            input.type = 'text';
                            input.addEventListener('change', this.pageNumberTypeEvent);
                            paginationConatiner.append(input);
                            i = this.totalPages - 6;
                        }
                        div = document.createElement('div');
                        div.innerHTML = i+1;
                        div.setAttribute('data-page', i);
                        div.classList.add('page_btn');
                        div.addEventListener('click', this.pageNumberClickEvent);
                        paginationConatiner.append(div);
                    }
                }
                else {
                    let diff = 0;
                    for(i = 0; i < this.totalPages; i++) {
                        diff = this.page - i;
                        if(i < 3 || i >= (this.totalPages - 3) || (diff < 2 && diff > -2)) {
                            div = document.createElement('div');
                            div.innerHTML = i+1;
                            div.setAttribute('data-page', i);
                            div.classList.add('page_btn');
                            div.addEventListener('click', this.pageNumberClickEvent);
                            paginationConatiner.append(div);
                        }
                        else {
                            div = document.createElement('div');
                            div.innerText = '...';
                            div.classList.add('btn_dots');
                            paginationConatiner.append(div);
                            i = (i > this.page-2) ? (this.totalPages - 4) : this.page-2;
                        }
                    }
                }
            }
            else {
                for(i = 0; i < this.totalPages; i++) {
                    div = document.createElement('div');
                    div.innerHTML = i+1;
                    div.setAttribute('data-page', i);
                    div.classList.add('page_btn');
                    div.addEventListener('click', this.pageNumberClickEvent);
                    paginationConatiner.append(div);
                }
            }
            paginationConatiner.querySelector('[data-page="0"]')?.classList.add('active');
            this.nextBtn = document.createElement('div');
            this.nextBtn.innerHTML = 'Next';
            this.nextBtn.setAttribute('data-next', '');
            this.nextBtn.classList.add('page_btn_next');
            this.nextBtn.addEventListener('click', this.nextClickEvent);
            paginationConatiner.append(this.nextBtn);
            td.append(paginationConatiner);
            tr.append(td);
            tfoot.append(tr);
        }
        else {
            if(this.page > 0) {
                if(this.prevBtn.classList.contains('disabled')) this.prevBtn.classList.remove('disabled');
                if(this.page+1 >= this.totalPages && !this.nextBtn.classList.contains('disabled')) this.nextBtn.classList.add('disabled');
                else if(this.page+1 < this.totalPages && this.nextBtn.classList.contains('disabled')) this.nextBtn.classList.remove('disabled');
            }
            else {
                if(!this.prevBtn.classList.contains('disabled')) this.prevBtn.classList.add('disabled');
                if(this.totalPages > 1 && this.nextBtn.classList.contains('disabled')) this.nextBtn.classList.remove('disabled');
            }
            tfoot.querySelectorAll('tr td .pages-container [data-page]').forEach(b => b.remove());
            tfoot.querySelectorAll('tr td .pages-container .btn_dots').forEach(d => d.remove());
            tfoot.querySelector('tr td .pages-container input')?.remove();
            const prevBtnElement = tfoot.querySelector('[data-next]');
            const tooMany = (this.totalPages > 20);
            if(tooMany) {
                if(this.tooManyUseInput) {
                    for(i = 0; i < this.totalPages; i++) {
                        if(i == 6) {
                            input = document.createElement('input');
                            input.type = 'text';
                            input.addEventListener('change', this.pageNumberTypeEvent);
                            prevBtnElement.before(input);
                            i = this.totalPages - 6;
                        }
                        div = document.createElement('div');
                        div.innerHTML = i+1;
                        div.setAttribute('data-page', i);
                        div.classList.add('page_btn');
                        div.addEventListener('click', this.pageNumberClickEvent);
                        prevBtnElement.before(div);
                    }
                }
                else {
                    let diff = 0;
                    for(i = 0; i < this.totalPages; i++) {
                        diff = this.page - i;
                        if(i < 3 || i >= (this.totalPages - 3) || (diff < 2 && diff > -2)) {
                            div = document.createElement('div');
                            div.innerHTML = i+1;
                            div.setAttribute('data-page', i);
                            div.classList.add('page_btn');
                            div.addEventListener('click', this.pageNumberClickEvent);
                            prevBtnElement.before(div);
                        }
                        else {
                            div = document.createElement('div');
                            div.innerText = '...';
                            div.classList.add('btn_dots');
                            prevBtnElement.before(div);
                            i = (i > this.page-2) ? (this.totalPages - 4) : this.page-2;
                        }
                    }
                }
            }
            else {
                for(i = 0; i < this.totalPages; i++) {
                    div = document.createElement('div');
                    div.innerHTML = i+1;
                    div.setAttribute('data-page', i);
                    div.classList.add('page_btn');
                    div.addEventListener('click', this.pageNumberClickEvent);
                    prevBtnElement.before(div);
                }
            }

            tfoot.querySelector(`.active`)?.classList.remove('active');
            tfoot.querySelector(`[data-page="${this.page}"]`)?.classList.add('active');
            const pageItemsStart = (this.page * this.perPage) + 1;
            tfoot.querySelector('.page-info').innerText = `Showing ${pageItemsStart} to ${(pageItemsStart + this.perPage > this.totalRows ? this.totalRows : (pageItemsStart + this.perPage))} of ${this.totalRows} entries`;
        }
    }

    pageNumberClickEvent = (e) => {
        const page = parseInt(e.currentTarget.getAttribute('data-page'));
        if(this.page != page) {
            this.page = page;
            this.getDataFromFile();
        }
    }

    pageNumberTypeEvent = (e) => {
        const page = parseInt(e.currentTarget.value);
        if(this.page != page && page < this.totalPages) {
            this.page = page-1;
            this.getDataFromFile();
        }
    }

    prevClickEvent = (e) => {
        if(this.page > 0) {
            this.page--;
            this.getDataFromFile();
        }
    }

    nextClickEvent = (e) => {
        if(this.totalPages > this.page+1) {
            this.page++;
            this.getDataFromFile();
        }
    }

    addHeaderSortListeners = () => {
        const thElements = this.table.querySelectorAll('thead th');
        for(let i = 0; i < thElements.length; i++) {
            thElements[i].addEventListener('click', this.sortHeader);
        }
    }

    sortHeader = (e) => {
        const index = Array.prototype.indexOf.call(e.currentTarget.parentNode.children, e.currentTarget);
        if(this.orderby == index) this.order_direction = (this.order_direction == 'ASC') ? 'DESC' : 'ASC';
        else {
            this.orderby = index;
            this.order_direction = 'ASC';
        }
        this.getDataFromFile();
    }
}