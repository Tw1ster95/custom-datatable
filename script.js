class DataTable {
    constructor({
        id,
        dataFile = 'data-table.php',
        sql_cols = [],
        sql_from = '',
        sql_join = '',
        sql_where = '',
        perPageDefault = 20,
        searchBox = false,
        searchBoxContainer = null,
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
        this.perPageDefault = perPageDefault;
        this.tooManyUseInput = tooManyUseInput;
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
        this.addSearchBox(searchBoxContainer);
    }

    getDataFromFile = async () => {
        const fd = new FormData();
        fd.append('page', this.page);
        fd.append('limit', this.perPageDefault);
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
        let filtersContainer = this.table.querySelector('.data-table-filters');
        if(!filtersContainer) {
            filtersContainer = document.createElement('div');
            filtersContainer.classList.add('data-table-filters');
            filtersContainer.setAttribute('for-data-table', this.table.getAttribute('id'));
        }
        return filtersContainer;
    }

    addSearchBox = (searchBoxContainer) => {
        if(!this.searchBox) return;

        if(searchBoxContainer) this.searchBoxContainer = document.querySelector(searchBoxContainer);
        if(!this.searchBoxContainer) this.searchBoxContainer = this.getDefaultFiltersContainer();
        const span = document.createElement('span');
        span.innerHTML = "Search:";
        const input = document.createElement('input');
        input.type = "text";
        input.addEventListener('keyup', this.onSearchInput);

        this.searchBoxContainer.append(span);   
        this.searchBoxContainer.append(input);
        this.table.before(this.searchBoxContainer);
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
        for(a = 0; a < this.perPageDefault; a++) {
            tr = document.createElement('tr');
            tr.classList.add((a % 2 == 0) ? 'even' : 'odd');
            if(a < data.length) {
                for(i = 0; i < cols; i++) {
                    td = document.createElement('td');
                    formated = this.colFormat(i, data[a]);
                    td.innerHTML = (formated == undefined) ? data[a][i] : formated;
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
        this.totalPages = Math.floor(this.totalRows / this.perPageDefault) + ((this.totalRows % this.perPageDefault) > 0 ? 1 : 0);
        let i, div, tr, td, input;
        if(!pagesCount) {
            tr = document.createElement('tr');
            td = document.createElement('td');
            td.setAttribute('colspan', this.columns_count);
            const pageInfoConatiner = document.createElement('div');
            const pageItemsStart = (this.page * this.perPageDefault) + 1;
            pageInfoConatiner.innerText = `Showing ${pageItemsStart} to ${(pageItemsStart + this.perPageDefault > this.totalRows ? this.totalRows : (pageItemsStart + this.perPageDefault))} of ${this.totalRows} entries`;
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
            const pageItemsStart = (this.page * this.perPageDefault) + 1;
            tfoot.querySelector('.page-info').innerText = `Showing ${pageItemsStart} to ${(pageItemsStart + this.perPageDefault > this.totalRows ? this.totalRows : (pageItemsStart + this.perPageDefault))} of ${this.totalRows} entries`;
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