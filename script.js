class DataTable {
    constructor({
        id,
        dataFile = 'data-table.php',
        sql_cols = [],
        sql_from = '',
        sql_join = '',
        sql_where = '',
        perPage = 20,
        rowCreated = null,
        initComplete = null,
        error = null
    }) {
        if(!id) return;
        this.table = document.getElementById(id);
        if(!this.table) return;
        this.table.setAttribute('data-table', '');
        this.perPage = perPage;
        this.dataFile = dataFile;
        this.sql_cols = sql_cols;
        this.sql_from = sql_from;
        this.sql_join = sql_join;
        this.sql_where = sql_where;
        this.initComplete = initComplete;
        this.error = error;
        this.rowCreated = rowCreated;
        this.page = 0;
        this.orderby = 0;
        this.order_direction = 'ASC';
        this.columns_count = this.table.querySelectorAll('thead th')?.length;
        if(!this.columns_count) return;
        if(this.dataFile) this.getDataFromFile();
        this.addHeaderSortListeners();
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

        const response = await fetch(this.dataFile, {
            method: 'POST',
            body: fd
        });
        if(!response) return;
        try {
            const json = await response.json();
            this.totalRows = json[0].total_rows;
            this.replaceRows(json[0].data);
            this.addPagination();
            if(typeof(this.initComplete) == 'function') this.initComplete({
                data: json[0].data,
                total_rows: json[0].total_rows,
                table: this.table
            });
        }
        catch(err) {
            if(typeof(this.error) == 'function') this.error(`[DataTable] Bad data object parsed from '${this.dataFile}' for table with ID '${this.table.getAttribute('id')}'.`);
        }
    }

    replaceRows = (data) => {
        this.rows = new Array();
        const tbody = this.table.querySelector('tbody');
        if(!tbody) return;
        tbody.textContent = '';
        let tr, td, i, a, cols = data[0].length;
        for(a = 0; a < this.perPage; a++) {
            tr = document.createElement('tr');
            tr.classList.add((a % 2 == 0) ? 'even' : 'odd');
            if(a < data.length) {
                for(i = 0; i < cols; i++) {
                    td = document.createElement('td');
                    td.innerHTML = data[a][i];
                    tr.append(td);
                }
            }
            tbody.append(tr);
            if(typeof(this.rowCreated) == 'function') this.rowCreated(tr, data[a]);
        }
    }

    addPagination = () => {
        let tfoot = this.table.querySelector('tfoot');
        let pagesCount = 0;
        if(!tfoot) {
            tfoot = document.createElement('tfoot');
            this.table.append(tfoot);
        }
        else pagesCount = tfoot.querySelectorAll('tr td .pages-container')?.length || 0;
        this.totalPages = Math.floor(this.totalRows / this.perPage) + ((this.totalRows % this.perPage) > 0 ? 1 : 0);
        let i, div, tr, td;
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
            for(i = 0; i < this.totalPages; i++) {
                div = document.createElement('div');
                div.innerHTML = i+1;
                div.setAttribute('data-page', i);
                div.classList.add('page_btn');
                div.addEventListener('click', this.pageNumberClickEvent);
                paginationConatiner.append(div);
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
            const prevBtnElement = tfoot.querySelector('[data-next]');
            for(i = 0; i < this.totalPages; i++) {
                div = document.createElement('div');
                div.innerHTML = i+1;
                div.setAttribute('data-page', i);
                div.classList.add('page_btn');
                div.addEventListener('click', this.pageNumberClickEvent);
                prevBtnElement.before(div);
            }
            tfoot.querySelector(`.active`)?.classList.remove('active');
            tfoot.querySelector(`[data-page="${this.page}"]`)?.classList.add('active');
            const pageItemsStart = (this.page * this.perPage) + 1;
            tfoot.querySelector('.page-info').innerText = `Showing ${pageItemsStart} to ${(pageItemsStart + this.perPage > this.totalRows ? this.totalRows : (pageItemsStart + this.perPage))} of ${this.totalRows} entries`;
        }
    }

    pageNumberClickEvent = (e) => {
        const page = e.currentTarget.getAttribute('data-page');
        if(this.page != page) {
            this.page = page;
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