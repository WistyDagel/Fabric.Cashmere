import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as searchJson from '../../../dist/user-guide/assets/docs/search/search.json';
import MiniSearch from "minisearch";

@Component({
    selector: 'hc-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})

export class SearchResultsComponent implements AfterViewInit {
    searchBar: FormControl = new FormControl("");
    searchResultsData;
    searchDisplay;
    length;
    categories = new FormGroup({
        styles: new FormControl(true),
        components: new FormControl(true),
        guides: new FormControl(true),
        bits: new FormControl(true)
    });

    // Functions to get the current page
    pageNumberControl = new FormControl(1);

    miniSearch = new MiniSearch({
        fields: ['title', 'type'],
        storeFields: ['title', 'content', 'link', 'category'],
        searchOptions: {
            prefix: true,
            boost: { type: 20 }
        }
    });

    ngAfterViewInit() {
        let filterValues: string[] = ["styles", "components", "guides", "bits"];

        this.categories.valueChanges.subscribe(categoryValues => {
            filterValues = [];
            console.log(categoryValues);
            for (const prop in categoryValues) {
                if (categoryValues[prop]) {
                    filterValues.push(prop);
                }
            }
            this.displayResults(filterValues);
            console.log(filterValues);
        });

        this.displayResults(filterValues);
    }

    displayResults(filterValues) {
        this.miniSearch.addAll(searchJson);

        this.searchBar.valueChanges.subscribe((val) => {
            if (val !== '') {
                let res = this.miniSearch.search(val, {
                    filter: (result) => {
                        let res = false;
                        filterValues.forEach(element => {
                            if (result.category === element) {
                                res = true;
                            }
                        });
                        return res;
                    }
                });
                console.log(res);
                this.length = res.length;
                this.searchResultsData = res;
                console.log(this.searchResultsData);
                this.searchDisplay = this.searchResultsData.slice(0, 5);
            } else {
                this.searchResultsData = [];
            }
        });
    }


    get pageNumber() {
        return this.pageNumberControl.value;
    }

    set pageNumber(value: number) {
        this.pageNumberControl.setValue(value);
        let tempStartIndex = 5 * (value - 1);
        this.searchDisplay = this.searchResultsData.slice(tempStartIndex, tempStartIndex + 5);
    }
}
