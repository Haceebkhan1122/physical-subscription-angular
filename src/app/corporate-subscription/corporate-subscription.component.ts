import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'
import { MatMenuTrigger } from '@angular/material/menu';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-corporate-subscription',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, HttpClientModule, CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './corporate-subscription.component.html',
  styleUrl: './corporate-subscription.component.css'
})
export class CorporateSubscriptionComponent implements OnInit {
  logoImage: string = 'assets/images/meri-sehat-logo.svg';
  call: string = 'assets/images/call.svg';
  arrowDown: string = 'assets/images/down-black.svg';
  checkicon: string = 'assets/images/check.svg';
  icon01: string = 'assets/images/icon01.svg';
  icon001: string = 'assets/images/icon001.svg';
  icon002: string = 'assets/images/icon002.svg';
  icon003: string = 'assets/images/icon003.svg';
  icon004: string = 'assets/images/icon004.svg';
  icon0011: string = 'assets/images/icon0011.svg';
  icon0012: string = 'assets/images/icon0012.svg';
  icon0013: string = 'assets/images/icon0013.svg';
  error: string = 'assets/images/error.svg';
  toasticon: string = 'assets/images/toasticon.svg';
  vitals: string = 'assets/images/vitals.svg';
  health_insurance: string = 'assets/images/health-insurance.svg';
  consults: string = 'assets/images/consults.svg';
  loader: string = 'assets/images/loader_gif1.gif';
  csvIcon: string = 'assets/images/csv.png';
  cross: string = 'assets/images/cross.svg';
  info__svg: string = 'assets/images/svg_info.svg';
  previousSubsObj: any;
  private baseUrl = environment.BASE_URL;
  searchTerm: string = '';
  invoiceNumber: string = '';
  totalPurchaseAmount: string = '';
  invoiceAmount: string = '';
  categoryType: string = '';
  onSearch: onSearch;
  onSearchInvoiceNumber: onSearchInvoiceNumber;
  onSearchPurchaseAmount: onSearchPurchaseAmount;
  onSearchInvoiceAmount: onSearchInvoiceAmount;
  UserByUserNumber: any;
  historyDataByIdLabs: any;
  historyDataByIdMedicine: any;
  invoiceData: any;
  selectedCategory: string = '';
  loading: boolean = false;
  currentUrl: string = '';

  @ViewChild(MatMenuTrigger, { static: true }) menuTrigger!: MatMenuTrigger;;

  private closeTimeout: any;

  constructor(private cookieService: CookieService, private router: Router, private http: HttpClient) {
    this.onSearch = new onSearch();
    this.onSearchInvoiceNumber = new onSearchInvoiceNumber();
    this.onSearchPurchaseAmount = new onSearchPurchaseAmount();
    this.onSearchInvoiceAmount = new onSearchInvoiceAmount();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  isModalVisible: boolean = false;

  onModalShow() {
    this.isModalVisible = true;
  }

  onModalHide() {
    this.isModalVisible = false;
    this.resetFormFields();
  }

  resetFormFields() {
    this.selectedCategory = '';
    this.invoiceNumber = '';
    this.totalPurchaseAmount = '';
    this.onSearchInvoiceAmount.invoice_amount = '';
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
  }

  isActive(route: string): boolean {
    if (this.currentUrl == '/') {
      return true;
    }
    return this.currentUrl === route;
  }

  openMenu() {
    this.menuTrigger.openMenu();
  }

  closeMenu() {
    this.closeTimeout = setTimeout(() => {
      this.menuTrigger.closeMenu();
    }, 200); // delay closing to avoid flickering
  }

  cancelCloseMenu() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  onSearchInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Enforce maximum length of 11 characters
    if (value.length > 11) {
      value = value.slice(0, 11);
      input.value = value;
    }

    this.searchTerm = value;
    this.onSearch.search_value = value;

    if (value.length === 11) {
      this.onEnterKeySearchUser()
    }

  }

  onSearchInputNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    this.invoiceNumber = value
    this.onSearchInvoiceNumber.invoice_number = value;

  }
  onSearchTotalPurchaseAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    this.totalPurchaseAmount = value
    this.onSearchPurchaseAmount.purchase_amount = value;
  }
  onSearchInvoiceAmountAfterDisc(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    this.invoiceAmount = value
    this.onSearchInvoiceAmount.invoice_amount = value;
  }

  onCategoryChange(category: string): void {
    this.categoryType = category
  }

  logout(): void {
    // Remove the 'access_token' cookie
    this.cookieService.delete('access_token');
    this.cookieService.delete('user_role');
    Swal.fire({
      icon: 'success',
      title: 'Logout successfully',
      timer: 1000,
    }).then(() => {
      // Redirect to subscription page
      window.location.href = '/login';
    });
  }

  onEnterKeySearchUser(): void {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    const searchUserByPhone = `${this.baseUrl}/search-user?phone=${this.searchTerm}`;
    this.loading = true
    this.http.get(searchUserByPhone, { headers: headers }).subscribe(
      (res: any) => {
        this.loading = false
        this.UserByUserNumber = res.data;
      },
      (error) => {
        this.loading = false;
        this.UserByUserNumber = [];
        console.log('Error in HTTP request:', error);
      }
    );
  }

  gettingHistoryData() {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    const historyById = `${this.baseUrl}/history?emp_id=${this.UserByUserNumber?.id}`;
    this.loading = true

    this.http.get(historyById, { headers: headers }).subscribe(
      (res: any) => {
        this.loading = false
        this.historyDataByIdLabs = res?.LabDiscount;
        this.historyDataByIdMedicine = res?.MedicineDiscount;
      },
      (error) => {
        this.loading = false
        console.log('Error in HTTP request:', error);
      }
    );
  }

  handleSaveInvoice(): void {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    const invoiceData = `${this.baseUrl}/add-invoice`;

    const payload = {
      invoice: this.invoiceNumber,
      invoice_amount: this.totalPurchaseAmount,
      discounted_amount: this.invoiceAmount,
      type: this.categoryType,
      emp_id: this.UserByUserNumber?.id
    }
    this.loading = true
    this.http.post(invoiceData, payload, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code === 200 || 201) {
          this.loading = false
          this.invoiceData = res;
          window.location.href = "/corporate-subscription";
          $(document).ready(function () {
            $('#invoiceModal').modal('hide');
          });
          this.onSearchInvoiceAmount.invoice_amount = ""
          this.onSearchPurchaseAmount.purchase_amount = ""
          this.onSearchInvoiceNumber.invoice_number = ""
          this.selectedCategory = ""
        }
      },
      (error) => {
        console.log(error, "error")
        this.loading = false
        Swal.fire({
          icon: 'error',
          title: error?.error?.message,
        });
        console.log('Error in HTTP request:', error);
      }
    );
  }

}


export class onSearch {
  search_value: string;

  constructor() {
    this.search_value = '';
  }
}
export class onSearchInvoiceNumber {
  invoice_number: string;

  constructor() {
    this.invoice_number = '';
  }
}
export class onSearchPurchaseAmount {
  purchase_amount: string;

  constructor() {
    this.purchase_amount = '';
  }
}
export class onSearchInvoiceAmount {
  invoice_amount: string;

  constructor() {
    this.invoice_amount = '';
  }
}