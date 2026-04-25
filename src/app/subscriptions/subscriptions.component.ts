import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
})
export class SubscriptionsComponent implements OnInit {
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
  private baseUrl = environment.BASE_URL;
  previousSubsObj: any;
  currentUrl: string = '';



  createSubsObj: CreateSubs;
  onBulkUpload: onBulkUpload;


  constructor(private cookieService: CookieService, private router: Router, private http: HttpClient) {
    this.createSubsObj = new CreateSubs();
    this.onBulkUpload = new onBulkUpload();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
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
  dobError: string = '';



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
  bulkErrorListener: boolean = false;
  userDetail: any;
  promocodeVerifyDetails: any;
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
        promo_code: this.createSubsObj.promocode,
        is_yearly: this.createSubsObj.duration == "monthly" ? 0 : 1
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

  onCrossClick(): void {
    this.promocodeShow = false
    this.createSubsObj.paid_via = ""
    this.promocodeError = ""
  }

  isValidEmail(): boolean {
    // Add your email validation logic here
    // You can use a regex or other validation methods
    return this.createSubsObj.email.trim() !== '';
  }

  ngOnInit(): void {

    this.currentUrl = this.router.url;
    // Get the value of the 'access_token' cookie
    const accessToken = this.cookieService.get('access_token');
    // Initialize userRole when the component is created
    this.userRole = this.cookieService.get('user_role');


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });

    // Make HTTP GET request to fetch city data
    const apiUrl = `${this.baseUrl}/cities`;
    this.http.get(apiUrl).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cities = res.data; // Assign res.data to the cities property
        } else {
          // console.log(res);
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
        // console.log('Error in HTTP request:', error);
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

    const apiUrlPaymentCards = `${this.baseUrl}/customer-support/payment-method-list`;
    this.http.get(apiUrlPaymentCards, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.paymentCards = res.data;
        } else {
          // title: 'Subscription Created Unsuccessfuly',
        }
      },
      (error) => {
        // console.log('Error in HTTP request:', error);
        // this.cookieService.delete('access_token');
        // this.cookieService.delete('user_role');
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
    if (this.userRole !== 'customer-support') {
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
    } else {
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
            title: 'Subscription Created Unsuccessfuly',
            text: error.error.message,
          });
        }
      );
    }
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
          this.createSubsObj.cnic = this.userDetail.cnic !== null ? this.userDetail.cnic : ''
          if (this.userDetail.birth_date !== null) {
            let birthDate = new Date(this.userDetail.birth_date);
            let day = birthDate.getDate().toString().padStart(2, '0');
            let month = (birthDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            let year = birthDate.getFullYear();
            this.createSubsObj.dob = `${day}/${month}/${year}`;
          } else {
            this.createSubsObj.dob = '';
          }
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
        setTimeout(() => {
          this.phoneNumberVerifyError = ""
        }, 3000);
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
    if (this.createSubsObj.duration && this.createSubsObj.subscription_id) {
      const apiUrlFetchPaymentOptions = `${this.baseUrl}/customer-support/subscriptions-list?duration=${this.createSubsObj['duration']}&id=${this.createSubsObj['subscription_id']}`;
      this.http.get(apiUrlFetchPaymentOptions, { headers: headers }).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.packageDetails = res.data;
            // Assign res.data to the payment cards property
            this.packageDetailsStatus = true
          } else {
            // console.log(res);
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
    }

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
      this.createSubsObj.dob = event.target.value;
      this.validDateError = "";
    } else {
      this.validDateError = "*Please select the current date.";
    }
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
            $(document).ready(function () {
              $('#bulkModal').modal('hide');
            });
            this.loading = true;
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
    this.bulkErrorListener = true
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

    if (!this.onBulkUpload.valid_from && this.createSubsObj.duration == '' && !this.createSubsObj.subscription_id) {
      this.validDateError = "*Please select valid from date"
      this.durationError = "*Please select duration"
      this.subscriptionError = "*Please select subscription type"
    }

    if (!this.onBulkUpload.valid_from || this.validDateError !== "") {
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
            this.csvFileChecker = res.data;
            $(document).ready(function () {
              $('#bulkModal').modal('show');
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