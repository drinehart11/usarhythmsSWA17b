import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridReadyEvent, CellClickedEvent, ColDef, GridApi } from 'ag-grid-community';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit, OnDestroy {
  leftnavExpanded: boolean = false;
  rowDataSubject$ = new BehaviorSubject<any[]>([]);
  private gridApi: GridApi | null = null;
  private routeSubscription: Subscription | null = null;
  pageSizeOptions: number[] = [];


  colDefs: ColDef[] = [
    { field: 'identifier', headerName: 'id', sortable: true, filter: true, flex: 1, minWidth: 25 },
    { field: 'draft_version.name', headerName: 'Dataset Name', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { field: 'created', headerName: 'Created', sortable: true, filter: true, flex: 1, minWidth: 100 },
    { field: 'contact_person', headerName: 'Owner/Contributor', sortable: true, filter: true, flex: 1, minWidth: 150 }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  public gridOptions: GridOptions = {
    columnDefs: this.colDefs,
    defaultColDef: this.defaultColDef,
    pagination: true,
    paginationPageSize: 12,
    paginationPageSizeSelector: [6, 12, 20, 25],
    domLayout: 'autoHeight',
    rowData: null, // This will be bound to rowDataSubject$ in the template
  };

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) { }

  private dataService = inject(DataService);

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  ngOnInit(): void {
    this.loadDatasets();
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.leftnavExpanded = params['leftnavExpanded'] === 'true';
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onLeftNavToggle(expanded: boolean) {
    this.leftnavExpanded = expanded;
    this.resizeGrid();
  }

  private resizeGrid(): void {
    setTimeout(() => {
      if (this.gridApi) {
        this.gridApi.sizeColumnsToFit();
      }
    }, 300); // Delay to allow for CSS transition
  }

  loadDatasets() {
    this.dataService.fetchDatasets().subscribe({
      next: (data: any) => {
        let processedData = [];
        if (Array.isArray(data)) {
          processedData = data.map((item: any) => {
            if (item.created) {
              item.created = removeTimezoneInfo(item.created);
            }
            return item;
          });
          this.rowDataSubject$.next(processedData);
          console.log('SUCCESS: DATA RECEIVED FROM API1');
        } else if (data.results && Array.isArray(data.results)) {
          processedData = data.results.map((item: any) => {
            if (item.created) {
              item.created = removeTimezoneInfo(item.created);
            }
            return item;
          });
          this.rowDataSubject$.next(processedData);
          console.log('SUCCESS: DATA RECEIVED FROM API2', processedData);
        } else {
          console.error('ERROR: DATA NOT PROPERLY FORMATTED', data);
          // Handle the case where data is not an array
        }
      },
      error: (error: any) => {
        console.log('ERROR: FAILED TO RECEIVE DATA FROM API', error);
        if (error.status === 401) {
          // Handle 401 error...
        }
      }
    });
  }
  OnGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.updateGridOptions({ paginationPageSize: this.gridOptions.paginationPageSize });
    this.gridApi.sizeColumnsToFit();
  }
  onPageSizeChanged(newPageSize: number): void {
    this.agGrid.api.updateGridOptions({ paginationPageSize: newPageSize });

    setTimeout(() => {
      this.agGrid.api.sizeColumnsToFit();
    }, 0);
  }

  onCellClicked(event: CellClickedEvent) {
    console.log(event);
  }

  clearSelection() {
    this.agGrid.api.deselectAll();
  }
}

function removeTimezoneInfo(dateTimeStr: string): string {
  const [date] = dateTimeStr.split('T');
  return date;
}
