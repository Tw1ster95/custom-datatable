class DataTable {
    constructor({
        id,
        ajax = null,
        perPage = 20,
        searchBox = false,
        colVisibilitySelector = null,
        colSelectFilter = null,
        tooManyUseInput = false,
        rowCreated = null,
        colFormat = null,
        colCreated = null,
        initComplete = null,
        error = null
    }) {
        if(!id) return console.error(`No table id given.`);
        this.table = document.getElementById(id);
        if(!this.table) return console.error(`Invalid table id given.`);
        this.table.setAttribute('data-table', '');
        this.columns_count = this.table.querySelectorAll('thead th')?.length;
        if(!this.columns_count) return console.error('No column headers found on table.');
        if(!perPage) return console.error('Invalid number of items per page given.');
        if(typeof(perPage) == 'number') {
            this.perPage = perPage || 20;
            this.perPageSelector = true;
            this.perPageOptions = [ 5, 10, 20, 50, 100 ];
            this.perPageSelectorContainerSelector = null;
        }
        else {
            this.perPage = perPage.default || 20;
            this.perPageSelector = perPage.selector || true;
            this.perPageOptions = perPage.options || [ 5, 10, 20, 50, 100 ];
            this.perPageSelectorContainerSelector = perPage.container || null;
        }
        this.tooManyUseInput = tooManyUseInput;
        this.colVisibilitySelector = colVisibilitySelector;
        this.columnSelected = new Array();
        if(ajax) {
            if(typeof(ajax) == 'string') this.ajaxUrl = ajax;
            else {
                this.ajaxUrl = ajax.url || null;
                if(ajax.method && ajax.method != 'POST' && ajax.method != 'GET') return console.error(`Invalid ajax method given.`);
                this.ajaxMethod = ajax.method || 'POST';
                this.dataSrc = ajax.dataSrc || '';
            }
        }
        if(typeof(searchBox) == 'boolean') {
            this.searchBox = searchBox;
            this.searchBoxContainerSelector = null;
            this.searchBoxTimeout = 400;
        }
        else {
            this.searchBox = searchBox.enable || true;
            this.searchBoxContainerSelector = searchBox.container || null;
            this.searchBoxTimeout = searchBox.timeout || 400;
        }
        this.colSelectFilter = colSelectFilter || [];
        this.searchTimeout = null;
        this.searchText = '';
        this.initComplete = initComplete;
        this.error = error;
        this.rowCreated = rowCreated;
        this.colFormat = colFormat;
        this.colCreated = colCreated;
        this.page = 0;
        this.orderby = 0;
        this.order_direction = 'ASC';
        this.colUniqueFiltersSelected = new Array();
        this.loadTable();
    }

    loadTable = async () => {
        this.addHeaderSortListeners();
        this.addcolVisibilitySelector();
        if(this.ajaxUrl) await this.getDataFromFile(true);
        this.addSearchBox();
        this.addPerPageSelector();
        this.addColumnSelectFilters();
    }

    getDataFromFile = async (firstLoad = false) => {
        try {
            let response;
            if(!this.ajaxMethod || this.ajaxMethod == 'POST') {
                const fd = new FormData();
                fd.append('page', this.page);
                fd.append('limit', this.perPage);
                fd.append('orderby', this.orderby);
                fd.append('order_direction', this.order_direction);
                fd.append('search_text', this.searchText);
                if(firstLoad && this.colSelectFilter) this.colSelectFilter.forEach(s => fd.append('col_select_filter[]', s));
                Object.entries(this.colUniqueFiltersSelected).forEach(([key, value]) => {
                    fd.append('col_unique_filters_selected_keys[]', key);
                    fd.append('col_unique_filters_selected_values[]', value);
                });

                response = await fetch(this.ajaxUrl, {
                    method: 'POST',
                    body: fd
                });
            }
            else {
                response = await fetch(this.ajaxUrl + '?' + new URLSearchParams({
                    page: this.page,
                    limit: this.perPage,
                    orderby: this.orderby,
                    order_direction: this.order_direction,
                    searchText: this.searchText,
                    col_select_filter: (firstLoad) ? this.colSelectFilter : []
                }), {
                    method: 'GET'
                });
            }
            if(!response) throw 'No data recieved from request.';
            const json = await response.json();
            const data = (this.dataSrc && this.dataSrc.length > 0) ? json[0][this.dataSrc] : json[0];
            this.totalRows = data.total_rows;
            if(!this.totalRows) this.noDataFound();
            else {
                this.replaceRows(data.data);
                this.addPagination();
                if(data.unique) {
                    this.uniqueSelectsData = new Array();
                    Object.entries(data.unique).forEach(([key, value]) => {
                        this.uniqueSelectsData[key] = new Array();
                        value.split('|').forEach(u => this.uniqueSelectsData[key].push(u));
                    });
                }
            }
            if(this.initComplete && typeof(this.initComplete) == 'function') this.initComplete({
                data: data.data,
                total_rows: data.total_rows,
                table: this.table
            });
        }
        catch(err) {
            if(this.error && typeof(this.error) == 'function') this.error(err);
            else console.error(err);
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

    getDefaultUniqueSelectorsContainer = () => {
        let uniqueSelectorsContainer = this.table.closest('.data-table-container').querySelector('.data-table-unique-selectors');
        if(!uniqueSelectorsContainer) {
            uniqueSelectorsContainer = document.createElement('div');
            uniqueSelectorsContainer.classList.add('data-table-unique-selectors');
            uniqueSelectorsContainer.setAttribute('for-data-table', this.table.getAttribute('id'));
            this.table.before(uniqueSelectorsContainer);
        }
        return uniqueSelectorsContainer;
    }

    addcolVisibilitySelector = () => {
        if(!this.colVisibilitySelector || !this.colVisibilitySelector.enable) return;
        if(this.colVisibilitySelector.container) this.colVisibilitySelector.container = document.querySelector(this.colVisibilitySelector.container);
        if(!this.colVisibilitySelector.container) this.colVisibilitySelector.container = this.getDefaultSelectorsContainer();
        const div = document.createElement('div');
        div.classList.add('columns-selector');
        const label = document.createElement('label');
        label.innerText = this.colVisibilitySelector.name || 'Column Selector';
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
        this.colVisibilitySelector.container.prepend(div);
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

    addColumnSelectFilters = () => {
        if(this.colSelectFilter) {
            this.uniqueSelectorsContainer = this.getDefaultUniqueSelectorsContainer();
            let column, colIndex, select, option;
            for(let i = 0; i < this.colSelectFilter.length; i++) {
                column = this.colSelectFilter[i];
                if(this.uniqueSelectsData[column] && this.uniqueSelectsData[column].length) {
                    select = document.createElement('select');
                    select.setAttribute('data-filter-column', column);
                    option = document.createElement('option');
                    option.innerHTML = 'Filter ' + column;
                    option.value = '';
                    select.append(option);
                    this.uniqueSelectsData[column].forEach(o => {
                        option = document.createElement('option');
                        option.innerHTML = o;
                        option.value = o;
                        select.append(option);
                    });
                    select.addEventListener('change', this.uniqueSelectChangeEvent);
                    this.uniqueSelectorsContainer.append(select);
                }
            };
        }
    }

    addPerPageSelector = () => {
        if(!this.perPageSelector || !this.perPageOptions?.length) return;
        if(this.perPageSelectorContainerSelector) this.perPageSelectorContainer = document.querySelector(this.perPageSelectorContainerSelector);
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

    addSearchBox = () => {
        if(!this.searchBox) return;
        if(this.searchBoxContainerSelector) this.searchBoxContainer = document.querySelector(this.searchBoxContainerSelector);
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
        this.searchTimeout = setTimeout(this.searchFilterTable, this.searchBoxTimeout, e.currentTarget.value);
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
        let tr, td, i, a, cols = data[0].length, altered;
        for(a = 0; a < this.perPage; a++) {
            tr = document.createElement('tr');
            tr.classList.add((a % 2 == 0) ? 'even' : 'odd');
            if(a >= data.length) continue;
            for(i = 0; i < cols; i++) {
                td = document.createElement('td');
                altered = (this.colFormat && typeof(this.colFormat) == 'function') ? this.colFormat(tr, i, data[a]) : null;
                td.innerHTML = altered || data[a][i];
                if(this.colVisibilitySelector?.enable && this.columnSelected.findIndex(c => c == i) == -1) td.classList.add('hidden');
                tr.append(td);
                if(this.colCreated && typeof(this.colCreated) == 'function') this.colCreated(tr, td, i, data[a]);
            }
            tbody.append(tr);
            if(this.rowCreated && typeof(this.rowCreated) == 'function') this.rowCreated(tr, data[a]);
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

    uniqueSelectChangeEvent = (e) => {
        if(!e.currentTarget.value.length) delete this.colUniqueFiltersSelected[e.currentTarget.getAttribute('data-filter-column')];
        else this.colUniqueFiltersSelected[e.currentTarget.getAttribute('data-filter-column')] = e.currentTarget.value;
        this.getDataFromFile();
    }
}