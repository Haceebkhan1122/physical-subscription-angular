import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
declare var $: any;
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.css'
})
export class SubscriptionListComponent {


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
  unSuccSvg: string = 'assets/images/unSuccSvg.svg';
  vitals: string = 'assets/images/vitals.svg';
  health_insurance: string = 'assets/images/health-insurance.svg';
  consults: string = 'assets/images/consults.svg';
  loader: string = 'assets/images/loader_gif1.gif';
  csvIcon: string = 'assets/images/csv.png';
  cross: string = 'assets/images/cross.svg';
  editIcon: string = 'assets/images/editt.svg';
  deleteIcon: string = 'assets/images/delete.svg';
  private baseUrl = environment.BASE_URL;
  previousSubsObj: any;
  createSubsObj: CreateSubs;
  onBulkUpload: onBulkUpload;
  getAndUpdateSubscriptions: getAndUpdateSubscriptions;
  addSingleUser: addSingleUser;
  onSearch: onSearch;
  filteredData: any[] = [];
  filteredDataReadyToGo: any[] = [];
  filteredDataPending: any[] = [];
  selectAllChecked: boolean = false;
  selectAllCheckedReadyToGo: boolean = false;
  currentUrl: string = '';


  constructor(private cookieService: CookieService, private router: Router, private http: HttpClient) {
    this.createSubsObj = new CreateSubs();
    this.onBulkUpload = new onBulkUpload();
    this.getAndUpdateSubscriptions = new getAndUpdateSubscriptions();
    this.addSingleUser = new addSingleUser();
    this.onSearch = new onSearch();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });

    // Check if data is defined and if it's an array
    // Initialize filteredData based on the current tab
    if (this?.readyToGoData && Array.isArray(this?.readyToGoData) && this?.currentTabIsReadyToGo) {
      this.filteredDataReadyToGo = [...this.readyToGoData]; // Initialize with readyToGoData if current tab is ReadyToGo
    } else if (this?.pendingData && Array.isArray(this?.pendingData) && this?.currentTabIsPending) {
      this.filteredDataPending = [...this?.pendingData]; // Initialize with pendingData if current tab is not ReadyToGo
    } else if (this?.unsuccesfulData && Array.isArray(this?.unsuccesfulData) && this?.currentTabIsReadyUnsuccessful) {
      this.filteredData = [...this?.unsuccesfulData]; // Initialize with unsuccesfulData if current tab is Unsuccessful
    }
  }


  isInputTouched: boolean = false;
  isNumberTouched: boolean = false;
  userRole: string | undefined; // Add 'undefined' as a type
  nameContainsNumbers = false;
  phoneNumberError: string = '';
  phoneNumberVerifyError: string = '';
  isInputFocused: boolean = false;
  isInputFocusedNumber: boolean = false;
  isInputFocusedCity: boolean = false;
  isInputFocusedDuration: boolean = false;
  isInputFocusedSubs: boolean = false;
  nameError: string = '';
  cityError: string = '';
  durationError: string = '';
  subscriptionError: string = '';
  paidViaError: string = '';
  promocodeError: string = '';
  phoneNumberIsValid: boolean = true;
  durationHasValue: boolean = false;
  subsHasValue: boolean = false;
  packageDuration: string = '';
  packageDetailsStatus: boolean = false;
  promocodeShow: boolean = false;
  validDateError: string = '';
  hovered: boolean = false;
  readyToGoData: any;
  pendingData: any;
  unsuccesfulData: any;
  currentTabIsReadyToGo: boolean = false;
  currentTabIsReadyUnsuccessful: boolean = false;
  currentTabIsPending: boolean = false;
  selectedSubscriptionIds: string[] = [];
  selectedSubscriptionIdsReadytogo: string[] = [];
  overwriteInfoData: any;
  editSubscriptionModalData: any;
  searchTerm: string = '';
  dobError: string = '';
  validFromError: string = '';
  deleteApiPending: boolean = false;
  today: string = '';

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectAllChecked = true;
    }
    else {
      this.selectAllChecked = false;
    }
    // Loop through each item in filteredDataPending
    this.filteredDataPending.forEach(item => {
      // Update the checkbox state of the item
      item.checked = this.selectAllChecked;

      // If the item is checked, add its subscription ID to selectedSubscriptionIds
      if (this.selectAllChecked) {
        this.selectedSubscriptionIds.push(item.user_subscription.id);
      } else {
        const index = this.selectedSubscriptionIds.indexOf(item.user_subscription.id);
        if (index !== -1) {
          this.selectedSubscriptionIds.splice(index, 1);

        }
      }
    });
  }

  toggleSelectAllReadyToGo(event: any) {
    if (event.target.checked) {
      this.selectAllCheckedReadyToGo = true;
    }
    else {
      this.selectAllCheckedReadyToGo = false;
    }
    // Loop through each item in filteredDataPending
    this.filteredDataReadyToGo.forEach(item => {
      // Update the checkbox state of the item
      item.checked = this.selectAllCheckedReadyToGo;

      // If the item is checked, add its subscription ID to selectedSubscriptionIds
      if (this.selectAllCheckedReadyToGo) {
        this.selectedSubscriptionIdsReadytogo.push(item.user_subscription.id);
      } else {
        const index = this.selectedSubscriptionIdsReadytogo.indexOf(item.user_subscription.id);
        if (index !== -1) {
          this.selectedSubscriptionIdsReadytogo.splice(index, 1);
        }
      }
    });
  }


  filterData(searchTerm: string) {
    let dataToFilter: any[] = []; // Initialize dataToFilter with an empty array

    if ((this?.readyToGoData || this?.pendingData || this?.unsuccesfulData) && searchTerm.trim() !== '') {

      if (this?.currentTabIsReadyUnsuccessful) {
        dataToFilter = this?.unsuccesfulData || [];
      } else if (this?.currentTabIsReadyToGo) {
        dataToFilter = this?.readyToGoData || [];
      } else if (this.currentTabIsPending) {
        dataToFilter = this?.pendingData || [];
      }

      if (this.currentTabIsReadyUnsuccessful) {
        this.filteredData = dataToFilter?.filter((item: any) => {
          // Customize this condition based on your search requirements
          const lowerCaseSearchTerm = searchTerm?.toLowerCase();
          return (
            item?.name?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
            item?.id?.toString()?.toLowerCase()?.includes(lowerCaseSearchTerm)
          );
        });
      }
      else if (this.currentTabIsPending) {
        this.filteredDataPending = dataToFilter?.filter((item: any) => {
          // Customize this condition based on your search requirements
          const lowerCaseSearchTerm = searchTerm?.toLowerCase();
          return (
            item?.user_subscription?.user?.name?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
            item?.id?.toString()?.toLowerCase()?.includes(lowerCaseSearchTerm)
          );
        });
      }
      else if (this.currentTabIsReadyToGo) {
        this.filteredDataReadyToGo = dataToFilter?.filter((item: any) => {
          // Customize this condition based on your search requirements
          const lowerCaseSearchTerm = searchTerm?.toLowerCase();
          return (
            item?.user_subscription?.user?.name?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
            item?.id?.toString()?.toLowerCase()?.includes(lowerCaseSearchTerm)
          );
        });
      }
    } else {
      // If search term is empty, display the original data without filtering
      if (this?.currentTabIsReadyUnsuccessful) {
        this.filteredData = this?.unsuccesfulData ? [...this?.unsuccesfulData] : [];
      }
      else if (this.currentTabIsPending) {
        console.log(this.filteredDataPending, this.currentTabIsPending, "this.filteredDataPending")
        this.filteredDataPending = this?.pendingData ? [...this?.pendingData] : [];
      }
      else if (this.currentTabIsReadyToGo) {
        this.filteredDataReadyToGo = this?.readyToGoData ? [...this?.readyToGoData] : [];
      }
    }
  }

  // Call this function whenever input value changes
  onSearchInputChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchTerm = searchTerm; // Update searchTerm property
    this.filterData(searchTerm);
  }

  onInputCnic(event: any) {
    const inputElement: HTMLInputElement = event.target;
    const inputValue = inputElement.value;

    // Check if the input value starts with '0'
    if (inputValue.startsWith('0')) {
      inputElement.value = inputValue.substring(1);
    }

    this.createSubsObj.cnic = inputElement.value;
  }

  onReadyToGo() {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    const apiUrlFetchPaymentOptions = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`ReadyToGo`}&page=${`1`}`;
    this.http.get(apiUrlFetchPaymentOptions, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.selectAllCheckedReadyToGo = false
          this.currentTabIsReadyToGo = true;
          this.currentTabIsReadyUnsuccessful = false
          this.currentTabIsPending = false
          this.readyToGoData = res.data.data;
          this.filterData(this.searchTerm);
          this.searchTerm = ""
          this.onSearch.search_value = ""
        } else {
          // console.log(res);
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        // Swal.fire({
        //   icon: 'error',
        //   // title: 'Subscription Created Unsuccessfuly',
        //   text: error.error.message,
        // });
      }
    );
  }

  onPending() {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    const apiUrlFetchPaymentOptions = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`pending`}&page=${`1`}`;
    this.http.get(apiUrlFetchPaymentOptions, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.selectAllChecked = false
          this.pendingData = res.data.data;
          if (this.pendingData) {
            this.currentTabIsReadyToGo = false
            this.currentTabIsPending = true
            this.currentTabIsReadyUnsuccessful = false
            this.searchTerm = ""
          }
          this.filterData(this.searchTerm);
          this.onSearch.search_value = ""
        } else {
          // console.log(res);
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        // Swal.fire({
        //   icon: 'error',
        //   // title: 'Subscription Created Unsuccessfuly',
        //   text: error.error.message,
        // });
      }
    );
  }

  onUnsuccessful() {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    const apiUrlFetchPaymentOptions = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`unsuccessful`}&page=${`1`}`;
    this.http.get(apiUrlFetchPaymentOptions, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.currentTabIsReadyUnsuccessful = true
          this.currentTabIsPending = false
          this.currentTabIsReadyToGo = false
          this.unsuccesfulData = res.data.data;
          this.filterData(this.searchTerm);
          this.searchTerm = ""
          this.onSearch.search_value = ""
        } else {
          // console.log(res);
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        // Swal.fire({
        //   icon: 'error',
        //   // title: 'Subscription Created Unsuccessfuly',
        //   text: error.error.message,
        // });
      }
    );
  }

  goToSubscriptionPage() {
    window.location.href = '/subscription'
  }

  onInputFocus(): void {
    this.isInputFocused = true;
  }

  onInputBlur(): void {
    this.isInputFocused = false;
  }

  onInputFocusNumber(): void {
    this.isInputFocusedNumber = true;
  }

  onInputBlurNumber(): void {
    this.isInputFocusedNumber = false;
  }

  onInputFocusCity(): void {
    this.isInputFocusedCity = true;
  }

  onInputBlurCity(): void {
    this.isInputFocusedCity = false;
  }

  onInputFocusDuration(): void {
    this.isInputFocusedDuration = true;
  }

  onInputBlurDuration(): void {
    this.isInputFocusedDuration = false;
  }

  onInputFocusSubs(): void {
    this.isInputFocusedSubs = true;
  }

  onInputBlurSubs(): void {
    this.isInputFocusedSubs = false;
  }

  checkNameLength() {
    this.isInputTouched = true;
    const nameLength = this.createSubsObj.name.length;
  }

  checkNumberLength() {
    this.isNumberTouched = true;
    const nameLength = this.createSubsObj.phone.length;
  }

  restrictNumericInput(): void {
    // Remove numeric characters from the input
    this.createSubsObj.name = this.createSubsObj.name.replace(/[0-9]/g, '');
    this.isInputTouched = true;
    const nameLength = this.createSubsObj.name.length;

    // Check if the input contains numeric characters
    this.nameContainsNumbers = /\d/.test(this.createSubsObj.name);
  }

  validatePhoneNumber(event: any): void {
    this.isNumberTouched = true;
    const phoneNumber = this.createSubsObj.phone;

    // If the entered key violates the rule, prevent it and set the error message
    if (phoneNumber.length === 0 && event.key !== '3') {
      event.preventDefault();
      this.phoneNumberError = '* Please enter a valid number';
      this.phoneNumberIsValid = false;
      this.phoneNumberVerifyError = ''
    } else {
      // If the phone number is not valid, set the error message
      if (/^3/.test(phoneNumber)) {
        this.phoneNumberError = '';
        this.phoneNumberIsValid = false;
      }
      else {
        this.phoneNumberError = ''; // Reset the error message if the number is valid
        this.phoneNumberIsValid = true;
      }
    }
  }

  cities: any[] = [];
  paymentCards: any[] = [];
  packageDetails: any;
  durationSubs: any[] = [];
  subsTypes: any[] = [];
  subsHistory: any[] = [];
  subsHistoryManager: any[] = [];
  receiptData: any;
  showAnotherDiv: boolean = false;
  receiptApiError: boolean = false;
  acceptReject: boolean = false;
  rejectSign: boolean = false;
  acceptSign: boolean = false;
  numberVerify: boolean = false;
  numberVerifySuccess: boolean = false;
  loading: boolean = false;
  userNotExist: boolean = false;
  userDetail: any;
  promocodeVerifyDetails: any;
  publishReviewInformation: any;
  csvFileChecker: any;
  uploadedFileName: string | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.csv')) {
        this.uploadedFileName = file.name;
        this.onBulkUpload.file = file; // Set the file object
        // You can perform further actions here, like uploading the file
      } else {
        alert('Please upload a CSV file.');
      }
    }
  }

  removeFile() {
    this.uploadedFileName = null;
    this.onBulkUpload.file = null; // Clear the file object
    // Additional logic to remove the uploaded file
  }


  isCreateSubsValid(): boolean {
    return (
      this.createSubsObj.name.trim() !== '' &&
      this.phoneNumberError === '' && this.createSubsObj.phone.length === 10 &&
      this.createSubsObj.city !== '' &&
      this.createSubsObj.duration.trim() !== '' &&
      this.createSubsObj.subscription_id.trim() !== '' &&
      this.createSubsObj.paid_via.trim() !== ''

    );
  }

  onDoneClick(): void {
    // Validate each field
    if (!this.createSubsObj.name || this.createSubsObj.name.trim() === '') {
      this.nameError = '* Please enter full name';
    }

    if (!this.createSubsObj.phone || this.createSubsObj.phone.length < 10) {
      this.phoneNumberError = '* Please enter a valid number';
    }

    if (!this.createSubsObj.city) {
      this.cityError = '* Please select a city';
    }
    if (!this.createSubsObj.duration) {
      this.durationError = '* Please select duration';
    }

    if (!this.createSubsObj.subscription_id) {
      this.subscriptionError = '* Please select subscription type';
    }

    if (!this.createSubsObj.paid_via) {
      this.paidViaError = '* Please select paid type';
    }
  }

  promocodeCheck(): void {
    // Validate each field
    this.promocodeError = ""
    this.subscriptionError = ""
    this.durationError = ""
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-promo-code`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    if (this.createSubsObj.promocode.trim() === '') {
      this.promocodeError = '* Please Enter Promocode';
    } else if (!this.createSubsObj.subscription_id) {
      this.subscriptionError = '* Please select subscription type';
    } else if (!this.createSubsObj.duration) {
      this.durationError = '* Please select duration';
    }
    else {
      // Set the Authorization header
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`
      });

      const payload = {
        subscription_id: this.createSubsObj.subscription_id,
        promo_code: this.createSubsObj.promocode
      }
      this.loading = true
      this.http.post(apiUrl, payload, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.loading = false
            this.promocodeVerifyDetails = res.data;
            this.createSubsObj.promo_code_id = this.promocodeVerifyDetails.promo_code_id;
            $(document).ready(function () {
              $('#reviewmodal').modal('show');
            });
          }
        },
        (error) => {
          this.loading = false
          // console.log('Error in HTTP request:', error);
          // Handle error, show alert, etc.
        }
      );
    }
  }

  onCrossClick(): void {
    this.promocodeShow = false
    this.createSubsObj.paid_via = ""
    this.promocodeError = ""
  }

  onDeleteSubs(id: number): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-delete`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });

    const payload = {
      id: [id]
    };
    this.loading = true;
    this.http.post(apiUrl, payload, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.deleteApiPending = true
          // window.location.href = "/subscription-list"; 
          this.loading = false;

          const apiUrlPeding = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`pending`}&page=${`1`}`;
          this.http.get(apiUrlPeding, { headers: headers }).subscribe(
            (res: any) => {
              if (res.code == 200) {
                this.pendingData = res.data.data;
                if (this.pendingData) {
                  this.currentTabIsReadyToGo = false
                  this.currentTabIsPending = true
                  this.currentTabIsReadyUnsuccessful = false
                  this.searchTerm = ""
                }
                this.filterData(this.searchTerm);
                this.onSearch.search_value = ""

              } else {
                // console.log(res);
              }
            },
            (error) => {
              console.log('Error in HTTP request:', error);
              Swal.fire({
                icon: 'error',
                // title: 'Subscription Created Unsuccessfuly',
                text: error.error.message,
              });
              window.location.href = "/login"
            }
          );

          const apiUrlFetchPaymentOptions = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`ReadyToGo`}&page=${`1`}`;
          this.http.get(apiUrlFetchPaymentOptions, { headers: headers }).subscribe(
            (res: any) => {
              if (res.code == 200) {
                this.currentTabIsReadyToGo = true;
                this.currentTabIsReadyUnsuccessful = false
                this.currentTabIsPending = false
                this.readyToGoData = res.data.data;
                this.filterData(this.searchTerm);
                this.searchTerm = ""
                this.onSearch.search_value = ""
              } else {
                // console.log(res);
              }
            },
            (error) => {
              console.log('Error in HTTP request:', error);
              // Swal.fire({
              //   icon: 'error',
              //   // title: 'Subscription Created Unsuccessfuly',
              //   text: error.error.message,
              // });
            }
          );

        }
      },
      (error) => {
        this.loading = false;
        // console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  isValidEmail(): boolean {
    // Add your email validation logic here
    // You can use a regex or other validation methods
    return this.createSubsObj.email.trim() !== '';
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    const current = new Date();
    this.today = current.toISOString().split('T')[0];

    // Get the value of the 'access_token' cookie
    const accessToken = this.cookieService.get('access_token');
    // Initialize userRole when the component is created
    this.userRole = this.cookieService.get('user_role');


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });

    // Make HTTP GET request to fetch city data
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`ReadyToGo`}&page=${`1`}`;
    this.http.get(apiUrl, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.readyToGoData = res.data.data;
          this.currentTabIsReadyToGo = true
          this.filteredDataReadyToGo = [...this.readyToGoData];
        } else {
          // console.log(res);
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        Swal.fire({
          icon: 'error',
          // title: 'Subscription Created Unsuccessfuly',
          text: error.error.message,
        });
        window.location.href = "/login"
      }
    );


    const apiUrlPeding = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`pending`}&page=${`1`}`;
    this.http.get(apiUrlPeding, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.pendingData = res.data.data;

        } else {
          // console.log(res);
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        Swal.fire({
          icon: 'error',
          // title: 'Subscription Created Unsuccessfuly',
          text: error.error.message,
        });
        window.location.href = "/login"
      }
    );

    const apiUrlUnsucessful = `${this.baseUrl}/customer-support/bulk-direct-subscription?progress=${`unsuccessful`}&page=${`1`}`;
    this.http.get(apiUrlUnsucessful, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.unsuccesfulData = res.data.data;
        } else {
          // console.log(res);
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        Swal.fire({
          icon: 'error',
          // title: 'Subscription Created Unsuccessfuly',
          text: error.error.message,
        });
        window.location.href = "/login"
      }
    );

    const apiUrlDurationSubs = `${this.baseUrl}/customer-support/subscription-duration`;
    this.http.get(apiUrlDurationSubs, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.durationSubs = res.data.duration;
          this.subsTypes = res.data.name;
        } else {
          // title: 'Subscription Created Unsuccessfuly',
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        this.cookieService.delete('access_token');
        this.cookieService.delete('user_role');
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        Swal.fire({
          icon: 'error',
          // title: 'Subscription Created Unsuccessfuly',
          text: error.error.message,
        });
      }
    );

    if (this.deleteApiPending) {

    }
  }

  isActive(route: string): boolean {
    if (this.currentUrl == '/') {
      return true;
    }
    return this.currentUrl === route;
  }

  onCreateSubs(event: Event) {
    const apiUrl = `${this.baseUrl}/customer-support/direct-subscription`;

    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');

    // Ensure this.phone has a minimum length of 10 by prepending zeros
    while (this.createSubsObj.phone.length == 10) {
      this.createSubsObj.phone = '0' + this.createSubsObj.phone;
    }

    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    this.loading = true
    this.http.post(apiUrl, this.createSubsObj, { headers: headers }).pipe(
      switchMap((res: any) => {
        if (res.code == 200) {
          this.loading = false
          $(document).ready(function () {
            $('#reviewmodal').modal('hide');
          });
          // Make another GET API request if res.code is equal to 200
          const getRecieptData = `${this.baseUrl}/customer-support/direct-subscription-receipt`;
          return this.http.get(getRecieptData, { headers: headers });
        } else {
          this.loading = false
          return [];
        }
      })
    ).subscribe(
      (anotherRes: any) => {
        // Handle the response from the second API request
        if (anotherRes.status == true || anotherRes.status == false) {
          this.showAnotherDiv = true;
          this.receiptData = anotherRes.data
          setTimeout(() => {
            window.location.href = "/subscription";
          }, 5000);
          if (anotherRes.code !== 200) {
            this.receiptApiError = true;
          }
        }
      },
      (error) => {
        // console.log('Error in HTTP request:', error);
        this.loading = false
        Swal.fire({
          icon: 'error',
          // title: 'Subscription Created Unsuccessfuly',
          text: error.error.message,
        });
      }
    );
  }

  onNumberChecker(event: Event) {
    const apiUrl = `${this.baseUrl}/customer-support/check-phone`;

    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');

    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });

    const payload = {
      phone: `0${this.createSubsObj.phone}`
    }

    this.loading = true

    this.http.post(apiUrl, payload, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.userDetail = res.data;
          this.createSubsObj.name = this.userDetail.name !== null ? this.userDetail.name : ''
          this.createSubsObj.city = this.userDetail.city_id !== null ? this.userDetail.city_id : ''
          this.loading = false
          this.numberVerifySuccess = true
          this.userNotExist = true
          this.numberVerify = false
        } else {
          // console.log('error')
        }
      },
      (error) => {
        if (error.status == 400) {
          this.userNotExist = false
          this.numberVerify = true
          this.loading = false
          this.numberVerify = true
          this.numberVerifySuccess = false
        }
        if (error.status == 404) {
          this.userNotExist = true
          this.numberVerify = true
          this.loading = false
          this.numberVerifySuccess = false
          this.createSubsObj.name = ''
          this.createSubsObj.city = ''
        }
        if (error.status == 401) {
          this.cookieService.delete('access_token');
          this.cookieService.delete('user_role');
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
        this.loading = false
        this.numberVerifySuccess = false
        this.phoneNumberVerifyError = error.error.message
        // console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  rejectSubscription(subsId: string) {
    this.updateSubscriptionStatus(subsId, 0); // 0 for "Reject"
  }

  approveSubscription(subsId: string) {
    this.updateSubscriptionStatus(subsId, 1); // 1 for "Approved"
  }

  private updateSubscriptionStatus(subsId: string, progress: number) {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    const apiUrl = `${this.baseUrl}/manager/direct-subscription-list`;
    const payload = { id: subsId, progress };

    this.http.post(apiUrl, payload, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code === 200) {
          this.acceptReject = true
          if (payload.progress == 0) {
            this.rejectSign = true
            this.acceptSign = false
          } else if (payload.progress == 1) {
            this.acceptSign = true
            this.rejectSign = false
          }
          setTimeout(() => {
            this.acceptReject = false
          }, 2000)
          const historyManagerApi = `${this.baseUrl}/manager/direct-subscription-list`;
          this.http.get(historyManagerApi, { headers: headers }).subscribe(
            (res: any) => {
              if (res.code == 200) {
                this.subsHistoryManager = res.data;
              } else {
                // console.log(res);
              }
            },
            (error) => {
              // console.log('Error in HTTP request:', error);
              // Swal.fire({
              //   icon: 'error',
              //   // title: 'Subscription Created Unsuccessfuly',
              //   text: error.error.message,
              // });
            }
          );

          const historyApi = `${this.baseUrl}/customer-support/direct-subscription-history`;
          this.http.get(historyApi, { headers: headers }).subscribe(
            (res: any) => {
              if (res.code == 200) {
                this.subsHistory = res.data;
              } else {
                // console.log(res);
              }
            },
            (error) => {
              // console.log('Error in HTTP request:', error);
              // Swal.fire({
              //   icon: 'error',
              //   // title: 'Subscription Created Unsuccessfuly',
              //   text: error.error.message,
              // });
            }
          );

        } else {
          console.log(res); // Log error or handle as appropriate
        }
      },
      (error) => {
        console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  onChangeDuration(e: any) {
    this.durationHasValue = true;
    this.checkAndFetchPaymentOptions();
  }

  onChangeSubs(e: any) {
    this.subsHasValue = true;
    this.checkAndFetchPaymentOptions();
  }

  onChangeDob(e: any) {
    this.createSubsObj.dob = e.target.value
  }

  onChangeDobOriginal(e: any) {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      // Future date selected, you can handle this scenario here
      // For example, show an error message or reset the date
      this.dobError = "Please select a valid date."
      // You can reset the input value to empty string or the current date
      // e.target.value = ''; // Reset the input value
      // OR
      // e.target.value = currentDate.toISOString().substr(0, 10); // Set to current date
    } else {
      this.createSubsObj.dob = e.target.value;
      this.dobError = ""
    }
  }

  startFrom(event: any) {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();

    // Extract year, month, and day from the selected and current dates
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    // Compare year, month, and day
    if (selectedYear === currentYear && selectedMonth === currentMonth && selectedDay === currentDay) {
      this.addSingleUser.start_date = event.target.value;
      this.validFromError = "";
    } else {
      this.validFromError = "*Please select the current date.";
    }
  }

  onPaymentMethodChange(e: any) {
    if (this.createSubsObj.paid_via == "Apply Promo Code") {
      this.promocodeShow = true
    } else {
      this.promocodeShow = false
      this.promocodeError = ""
    }
  }

  checkAndFetchPaymentOptions(): void {
    if (this.durationHasValue && this.subsHasValue) {
      this.fetchPaymentOptions();
      this.fetchPaymentOptionsMultiple();
      if (this.createSubsObj.duration == 'monthly') {
        this.packageDuration = 'Monthly'
      } else if (this.createSubsObj.duration == 'yearly') {
        this.packageDuration = 'Yearly'
      }
    }
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

  onBulkFileUploader(event: Event) {
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription`;

    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');

    // Set the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `${accessToken}`
    });

    // Create FormData object

    const formData = new FormData();
    formData.append('subscription_id', this.createSubsObj.subscription_id);
    formData.append('duration', this.createSubsObj.duration);
    formData.append('promo_code', this.onBulkUpload.promo_code);
    formData.append('start_date', this.onBulkUpload.valid_from);
    if (this.onBulkUpload.file) {
      formData.append('file', this.onBulkUpload.file);
    }
    if (!this.onBulkUpload.valid_from) {
      this.validDateError = "*Please select valid from date"
    } else if (this.createSubsObj.duration == '') {
      this.durationError = "*Please select duration"
    } else if (!this.createSubsObj.subscription_id) {
      this.subscriptionError = "*Please select subscription type"
    } else {
      this.loading = true;
      this.http.post(apiUrl, formData, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.loading = false;
            window.location.href = "/subscription-list"
          }
        },
        (error) => {
          this.loading = false;
          $(document).ready(function () {
            $('#bulkModal').modal('hide');
          });
          Swal.fire({
            icon: 'error',
            // title: 'Subscription Created Unsuccessfuly',
            text: error.error.message,
          });
          // console.log('Error in HTTP request:', error);
          // Handle error, show alert, etc.
        }
      );
    }
  }

  onBulkUploadFileCheck(event: Event) {
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-file-check`;

    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');

    // Set the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `${accessToken}`
    });

    // Create FormData object

    const formData = new FormData();
    formData.append('subscription_id', this.createSubsObj.subscription_id);
    if (this.onBulkUpload.file) {
      formData.append('file', this.onBulkUpload.file);
    }

    if (!this.onBulkUpload.valid_from || this.validFromError !== "") {
      this.validFromError = "*Please select the current date"
    } else if (this.createSubsObj.duration == '') {
      this.durationError = "*Please select duration"
    } else if (!this.createSubsObj.subscription_id) {
      this.subscriptionError = "*Please select subscription type"
    } else {
      this.loading = true;
      this.http.post(apiUrl, formData, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.loading = false;
            this.csvFileChecker = res.data;
            $(document).ready(function () {
              $('#bulkModal').modal('show');
              $('#multipleUsersModal').modal('hide');
            });
          }
        },
        (error) => {
          this.loading = false;
          // console.log('Error in HTTP request:', error);
          // Handle error, show alert, etc.
        }
      );
    }
  }

  publishAsker(): void {
    $(document).ready(function () {
      $('#publishSmall').modal('show');
    });
  }

  showMultipleUserModal(): void {
    $(document).ready(function () {
      $('#multipleUsersModal').modal('show');
    });
    this.packageDetailsStatus = false
  }

  showSingleUserModal(): void {
    this.validFromError = ""
    $(document).ready(function () {
      $('#contactDetailSingleModal').modal('show');
    });
    this.packageDetailsStatus = false
  }

  publishReviewInfo(): void {
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-file-review`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    this.loading = true
    this.http.get(apiUrl, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.loading = false
          this.publishReviewInformation = res.data;
          if (this.publishReviewInformation) {
            $(document).ready(function () {
              $('#reviewPublishModal').modal('show');
              $('#publishSmall').modal('hide');
            });
          }
        }
      },
      (error) => {
        this.loading = false
        // console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  publishAnyway(): void {
    // Validate each field
    if (this.selectedSubscriptionIdsReadytogo.length > 0) {
      const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-selected-enabled`;
      // Get access_token from cookies
      const accessToken = this.cookieService.get('access_token');
      // Set the Authorization header
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`
      });
      const payload = {
        id: this.selectedSubscriptionIdsReadytogo.length == 1 ? [this.selectedSubscriptionIdsReadytogo[0]] : this.selectedSubscriptionIdsReadytogo
      };
      this.loading = true
      this.http.post(apiUrl, payload, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            window.location.href = "/subscription-list"
            this.loading = false
          }
        },
        (error) => {
          this.loading = false
          // console.log('Error in HTTP request:', error);
          // Handle error, show alert, etc.
        }
      );
    }
    else {
      const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-enabled`;
      // Get access_token from cookies
      const accessToken = this.cookieService.get('access_token');
      // Set the Authorization header
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`
      });
      const payload = {
        progress: this.currentTabIsReadyToGo == true ? 'ReadyToGo' : 'Pending',
      }
      this.loading = true
      this.http.post(apiUrl, payload, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.loading = false
            window.location.href = "/subscription-enabled"
          }
        },
        (error) => {
          $('#reviewPublishModal').modal('hide');
          this.loading = false
          // console.log('Error in HTTP request:', error);
          // Handle error, show alert, etc.
        }
      );
    }

  }

  deleteAllUnsucessful(): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-unsuccessful-delete`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    this.loading = true
    this.http.get(apiUrl, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          window.location.href = "/subscription-list"
          this.loading = false
        }
      },
      (error) => {
        this.loading = false
        // console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  downloadAllUnsucessful(): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-unsuccessful-download`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    this.http.get(apiUrl, { responseType: 'text', headers: headers }).subscribe(
      (res: any) => {
        if (res) {
          const data = res; // Assuming the response is already CSV data

          const blob = new Blob([data], { type: 'text/csv' });
          const downloadUrl = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'file.csv'; // Set the file name as CSV
          a.style.display = 'none'; // Make sure it's not visible
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL to free resources
          document.body.removeChild(a); // Clean up the anchor element
          this.loading = false;

        }
      },
      (error) => {
        this.loading = false;
        // Handle error, show alert, etc.
      }
    );
  }

  onCheckboxChangeReadytogo(event: any, subscriptionId: string) {
    if (event.target.checked) {
      // Add the subscription ID to the selectedSubscriptionIds array
      this.selectedSubscriptionIdsReadytogo.push(subscriptionId);
    } else {
      // Remove the subscription ID from the selectedSubscriptionIdsReadytogo array
      const index = this.selectedSubscriptionIdsReadytogo.indexOf(subscriptionId);
      if (index !== -1) {
        this.selectedSubscriptionIdsReadytogo.splice(index, 1)
      }
    }
  }


  onCheckboxChange(event: any, subscriptionId: string) {
    if (event.target.checked) {
      // Add the subscription ID to the selectedSubscriptionIds array
      this.selectedSubscriptionIds.push(subscriptionId);
    } else {
      // Remove the subscription ID from the selectedSubscriptionIds array
      const index = this.selectedSubscriptionIds.indexOf(subscriptionId);
      if (index !== -1) {
        this.selectedSubscriptionIds.splice(index, 1)
      }
    }
  }


  overwriteInfo(): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-pending-subscription/${this.selectedSubscriptionIds}`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    this.loading = true
    this.http.get(apiUrl, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.overwriteInfoData = res.data
          if (this.overwriteInfoData) {
            $(document).ready(function () {
              $('#overwriteModal').modal('show');
            });
          }
          this.loading = false
        }
      },
      (error) => {
        this.loading = false
        // console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  overwriteModalShow(): void {
    $(document).ready(function () {
      $('#overwriteSmall').modal('show');
    });
  }

  overwriteAnyways(): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-selected-enabled`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    const payload = {
      id: this.selectedSubscriptionIds.length === 1 ? [this.selectedSubscriptionIds[0]] : this.selectedSubscriptionIds,
      overwrite: true
    };
    this.loading = true
    this.http.post(apiUrl, payload, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          window.location.href = "/subscription-list"
          this.loading = false
        }
      },
      (error) => {
        this.loading = false
        // console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  editSubscriptionGet(id: number): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-edit/${id}`;
    let subscriptionId = `${id}`
    this.cookieService.delete('editsubsId');
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    this.loading = true
    this.http.get(apiUrl, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cookieService.set('editsubsId', subscriptionId);
          this.editSubscriptionModalData = res.data
          const phone = this.editSubscriptionModalData?.user?.phone;
          const phoneNumber = phone && phone.length > 0 ? phone.substring(1) : phone;
          if (this.editSubscriptionModalData) {
            this.getAndUpdateSubscriptions = {
              id: subscriptionId,
              subscription_id: this.editSubscriptionModalData?.subscription?.subscription_id,
              is_yearly: this.editSubscriptionModalData?.subscription?.is_yearly,
              company_name: this.editSubscriptionModalData?.user?.company_name,
              department: this.editSubscriptionModalData?.user?.department,
              employee_id: this.editSubscriptionModalData?.user?.empolyee_id,
              name: this.editSubscriptionModalData?.user?.name,
              number: phoneNumber,
              email: this.editSubscriptionModalData?.user?.email,
              gender: this.editSubscriptionModalData?.user?.gender,
              birth_date: this.editSubscriptionModalData?.user?.birth_date,
              cnic: this.editSubscriptionModalData?.user?.cnic,
            };
            console.log(this.getAndUpdateSubscriptions, "this.editSubscriptionModalData")
            if (this.getAndUpdateSubscriptions.subscription_id && this.getAndUpdateSubscriptions.is_yearly) {
              this.fetchPaymentOptions();
              $(document).ready(function () {
                $('#contactDetailsModal').modal('show');
              });
            }
          }
          this.loading = false
        }
      },
      (error) => {
        this.loading = false
        // console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  fetchPaymentOptions(): void {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });

    // Check if duration and subscription_id are available in getAndUpdateSubscriptions
    if (this.getAndUpdateSubscriptions.is_yearly || this.getAndUpdateSubscriptions.subscription_id) {
      const apiUrlFetchPaymentOptions = `${this.baseUrl}/customer-support/subscriptions-list?duration=${this.getAndUpdateSubscriptions.is_yearly}&id=${this.getAndUpdateSubscriptions.subscription_id}`;
      this.http.get(apiUrlFetchPaymentOptions, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.packageDetails = res.data; // Assign res.data to the payment cards property
            this.packageDetailsStatus = true;
          } else {
            // Handle other responses if needed
          }
        },
        (error) => {
          // console.log('Error in HTTP request:', error);
          Swal.fire({
            icon: 'error',
            // title: 'Subscription Created Unsuccessfuly',
            text: error.error.message,
          });
        }
      );
    } else {
      // console.log('Duration or subscription_id is missing in getAndUpdateSubscriptions');
    }
  }

  onChangeGender(e: any) {
    this.getAndUpdateSubscriptions.gender = e.target.value;
  }

  editSubscriptionUpdate(): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-edit`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    const getSubsId = this.cookieService.get('editsubsId');
    const payload = {
      id: getSubsId,
      cnic: this.getAndUpdateSubscriptions.cnic ? this.getAndUpdateSubscriptions.cnic : this.editSubscriptionModalData.user.cnic,
      gender: this.getAndUpdateSubscriptions.gender ? this.getAndUpdateSubscriptions.gender : this.editSubscriptionModalData.user.gender,
      name: this.getAndUpdateSubscriptions.name ? this.getAndUpdateSubscriptions.name : this.editSubscriptionModalData.user.name,
      email: this.getAndUpdateSubscriptions.email ? this.getAndUpdateSubscriptions.email : this.editSubscriptionModalData.user.email,
      company_name: this.getAndUpdateSubscriptions.company_name ? this.getAndUpdateSubscriptions.company_name : this.editSubscriptionModalData.user.company_name,
      empolyee_id: this.getAndUpdateSubscriptions.employee_id ? this.getAndUpdateSubscriptions.employee_id : this.editSubscriptionModalData.user.empolyee_id,
      department: this.getAndUpdateSubscriptions.department ? this.getAndUpdateSubscriptions.department : this.editSubscriptionModalData.user.department,
      subscription_id: this.getAndUpdateSubscriptions.subscription_id ? this.getAndUpdateSubscriptions.subscription_id : this.editSubscriptionModalData.subscription.subscription_id,
      is_yearly: this.getAndUpdateSubscriptions.is_yearly ? this.getAndUpdateSubscriptions.is_yearly : this.editSubscriptionModalData.subscription.is_yearly,
      birth_date: this.getAndUpdateSubscriptions.birth_date ? this.getAndUpdateSubscriptions.birth_date : this.editSubscriptionModalData.user.birth_date,
    };
    this.loading = true
    this.http.post(apiUrl, payload, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          Swal.fire({
            icon: 'success',
            title: 'Update Successfully',
            text: res.message,
            timer: 2000,
          }).then(() => {
            // Redirect to subscription page
            window.location.href = "/subscription-list"
          });
          this.loading = false
        }
      },
      (error) => {
        this.loading = false
        console.log('Error in HTTP request:', error);
        // Handle error, show alert, etc.
      }
    );
  }

  fetchPaymentOptionsMultiple(): void {
    const accessToken = this.cookieService.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    if (this.createSubsObj.duration && this.createSubsObj.subscription_id) {
      const apiUrlFetchPaymentOptions = `${this.baseUrl}/customer-support/subscriptions-list?duration=${this.createSubsObj['duration']}&id=${this.createSubsObj['subscription_id']}`;
      this.http.get(apiUrlFetchPaymentOptions, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.packageDetails = res.data; // Assign res.data to the payment cards property
            this.packageDetailsStatus = true
          } else {
            // console.log(res);
          }
        },
        (error) => {
          console.log('Error in HTTP request:', error);
          Swal.fire({
            icon: 'error',
            // title: 'Subscription Created Unsuccessfuly',
            text: error.error.message,
          });
        }
      );
    }

  }

  addSingleUserApi(): void {
    // Validate each field
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-single-corporate`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
    const payload = {
      cnic: this.addSingleUser.cnic,
      gender: this.addSingleUser.gender,
      name: this.addSingleUser.name,
      phone: `${this.createSubsObj.phone && `0`}${this.createSubsObj.phone}`,
      email: this.addSingleUser.email,
      company_name: this.addSingleUser.company_name,
      empolyee_id: this.addSingleUser.empolyee_id,
      department: this.addSingleUser.department,
      subscription_id: this.createSubsObj.subscription_id,
      duration: this.createSubsObj.duration,
      birth_date: this.addSingleUser.birth_date,
      start_date: this.validFromError === "" ? this.addSingleUser.start_date : '',
      promo_code: this.addSingleUser.promo_code,
    };

    this.loading = true
    this.http.post(apiUrl, payload, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          window.location.href = "/subscription-list"
          this.loading = false
        }
      },
      (error) => {
        this.loading = false
        // console.log('Error in HTTP request:', error);
        Swal.fire({
          icon: 'error',
          // title: 'Subscription Created Unsuccessfuly',
          text: error.error.message,
        });
        // Handle error, show alert, etc.
      }
    );
  }

  downloadTemplate(): void {
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-template-download`;
    // Get access_token from cookies
    const accessToken = this.cookieService.get('access_token');

    // Set the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`,
      'Access-Control-Allow-Origin': '*'
    });

    this.loading = true;

    this.http.get(apiUrl, { responseType: 'text', headers: headers }).subscribe(
      (res: any) => {
        if (res) {
          const data = res; // Assuming the response is already CSV data

          const blob = new Blob([data], { type: 'text/csv' });
          const downloadUrl = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'file.csv'; // Set the file name as CSV
          a.style.display = 'none'; // Make sure it's not visible
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL to free resources
          document.body.removeChild(a); // Clean up the anchor element
          this.loading = false;

        }
      },
      (error) => {
        this.loading = false;
        // Handle error, show alert, etc.
      }
    );
  }
}

export class CreateSubs {
  name: string;
  phone: string;
  email: string;
  city: string;
  cnic: string;
  dob: string;
  duration: string;
  subscription_id: string;
  paid_via: string;
  promocode: string;
  promo_code_id: string;

  constructor() {
    this.name = '';
    this.phone = '';
    this.email = '';
    this.city = '';
    this.cnic = '';
    this.dob = '';
    this.duration = '';
    this.subscription_id = '';
    this.paid_via = '';
    this.promocode = '';
    this.promo_code_id = '';
  }

}

export class onBulkUpload {
  valid_from: string;
  promo_code: string;
  file: File | null;

  constructor() {
    this.valid_from = '';
    this.promo_code = '';
    this.file = null;
  }

}

export class getAndUpdateSubscriptions {
  id: string;
  subscription_id: string;
  is_yearly: string;
  company_name: string;
  department: string;
  employee_id: string;
  name: string;
  number: string;
  email: string;
  gender: string;
  birth_date: string;
  cnic: string;


  constructor() {
    this.id = '';
    this.subscription_id = '';
    this.is_yearly = '';
    this.company_name = '';
    this.department = '';
    this.employee_id = '';
    this.name = '';
    this.number = '';
    this.email = '';
    this.gender = '';
    this.birth_date = '';
    this.cnic = '';
  }

}

export class addSingleUser {
  company_name: string;
  department: string;
  empolyee_id: string;
  name: string;
  email: string;
  gender: string;
  birth_date: string;
  cnic: string;
  start_date: string;
  promo_code: string;


  constructor() {
    this.company_name = '';
    this.department = '';
    this.empolyee_id = '';
    this.name = '';
    this.email = '';
    this.gender = '';
    this.birth_date = '';
    this.cnic = '';
    this.start_date = '';
    this.promo_code = '';

  }

}

export class onSearch {
  search_value: string;

  constructor() {
    this.search_value = '';
  }

}