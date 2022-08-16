import { LightningElement,track,api } from 'lwc';

export default class GenericPaginationLWC extends LightningElement {
    @track totalRecords;
    // number of records to show per page.
    recordSize=5;
    totalPages;
    visibleRecords;
    totalCount;
    disabledPrevious=true;
    disabledNext = false;
    showNext=true;
    pageButtons = [];
    currentPage=1;

    // we get the total records here. 
    @api records;

    connectedCallback() {
        if(this.records) {

            this.totalRecords = this.records;
            this.totalCount = this.records.length;
            // total Number of Pages.
            this.totalPages = Math.ceil(this.totalCount/this.recordSize);
            console.log('TOTAL PAGES >> '+JSON.stringify(this.totalRecords));
            // creating an array which consists of numbers from 1 to pagenumbers
            this.pageButtons = Array.from(Array(this.totalPages+1).keys());
            // popping out 0 from the front.
            if(this.pageButtons[0]==0)
                this.pageButtons.shift();
            // 
            if(this.pageButtons<=1) 
                this.disabledNext = true;
            
            // this function will slice the data as per the pageCount we set and send an CustomEvent to the parent.
            this.updateRecords();
        }
    }

    nextHandler() {
        this.disabledPrevious = false;
        if(this.currentPage<this.totalPages) {
           this.updateSelectedClass(true);
            if(++this.currentPage==this.totalPages)
                this.disabledNext = true;
            this.updateRecords();
        }
    }
    handleClick(event) {
        const pageVal = parseInt(event.currentTarget.dataset.label);
        const element=  this.template.querySelector('.selected');
        if(element!=null) 
            element.classList.remove('selected');

        let selectedLabel = this.template.querySelector(`[data-label="${pageVal}"]`);
        selectedLabel.classList.add('selected');
        
        this.currentPage = pageVal;
        this.updateRecords();
    }

    updateSelectedClass(flag) {
        // true for next and false for prev

        let currentStepLabel = this.template.querySelector(`[data-label="${this.currentPage}"]`);
        currentStepLabel.classList.remove('selected');
        let nextStepLabel=null,prevStepLabel=null;

        if(flag) {
            nextStepLabel = this.template.querySelector(`[data-label="${this.currentPage+1}"]`);
            nextStepLabel.classList.add('selected');

        } else {
            prevStepLabel = this.template.querySelector(`[data-label="${this.currentPage-1}"]`);
            prevStepLabel.classList.add('selected');
        }

    }

    prevHandler() {
        this.disabledNext = false;
        if(this.currentPage>1) {

           this.updateSelectedClass(false);

            if(--this.currentPage==1)
                this.disabledPrevious=true;
            this.updateRecords();
        }
    }

    updateRecords() {
        const startIdx = (this.currentPage-1)*this.recordSize;
        const endIdx = this.currentPage*this.recordSize;
        // slicing the total records. 
        this.visibleRecords = this.records.slice(startIdx,Math.min(this.totalCount,endIdx));

        this.dispatchEvent(new CustomEvent('update',{
            detail:{
                records:this.visibleRecords
            }
        }));
    }
}