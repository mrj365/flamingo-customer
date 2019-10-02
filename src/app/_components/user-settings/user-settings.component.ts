import { UserSavedSearchAddressViewDTO } from './user-saved-search-address-view-dto';
import { EditUserFormDTO } from './edit-user-form-dto';
import { CropperOptions } from 'cropperjs';
import { ImageService } from './../../_services/image.service';
import { UserResultDTO } from './../../_models/dto/user-result-dto';
import { MapLocationDTO } from './../../_models/dto/map-location-dto';
import { GoogleMapsUtil } from './../../_util/google-maps-util';
import { LocationService } from './../../_services/location.service';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { UpdateUserDTO } from './../../_models/dto/update-user-dto';
import { NgForm, FormControl } from '@angular/forms';
import { UserService } from './../../_services/user.service';
import { Component, OnInit, ViewChild, NgZone, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as Cropper from "cropperjs";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'
    ]
})
export class UserSettingsComponent implements OnInit {

  public user: UserResultDTO = new UserResultDTO();
  public userBackup: UserResultDTO = new UserResultDTO();

  public editUserFormDTO: EditUserFormDTO = new EditUserFormDTO();
  editUserNGForm: NgForm;
  @ViewChild('editUserNGForm') currentForm: NgForm;

  public editUserMobileFormDTO: EditUserFormDTO = new EditUserFormDTO();
  editUserMobileNGForm: NgForm;
  @ViewChild('editUserMobileNGForm') currentMobileForm: NgForm;

  editMode: boolean = false;

  currentAddress: string = '';

  homeLocation: UserSavedSearchAddressViewDTO;
  workLocation: UserSavedSearchAddressViewDTO;
  selectedLocation: UserSavedSearchAddressViewDTO;
  locationCreateMode: boolean = false; //Are we creating or updating a saved search address

  @ViewChild('searchSavedAddress')
  public searchElementRef: ElementRef;

  @ViewChild('modalEditLocation')
  public locationModalComponent: ModalComponent;

  @ViewChild('modalEditPhoto')
  public photoModal: ModalComponent;

  @ViewChild('croppieImg')
  croppieImg: HTMLImageElement;

  @ViewChild('croppedDiv')
  croppedDiv: HTMLElement;

  @ViewChild('croppedImg')
  croppedImg: HTMLImageElement;

  imgUrl: string;

  cropper: Cropper;

  hideCroppieDiv: boolean = true;
  hideCroppedCanvasBtn = true;
  hideRotateBtn = true;
  hideCroppedDiv = false;
  hideUploadSpinner = true;

  spinner: Spinner = new Spinner();
  croppieSpinner: Spinner = new Spinner();

  constructor(private userService: UserService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private locationService: LocationService,
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private imageService: ImageService) {

    this.userService.getUser()
      .subscribe(user =>
        {
          this.user.email = user.email;
          this.user.firstName = user.firstName;
          this.user.lastName = user.lastName;
          this.user.phone = user.phone;
          this.user.imgUrl = user.imgUrl;

          this.editUserFormDTO.email = user.email;
          this.editUserFormDTO.firstName = user.firstName;
          this.editUserFormDTO.lastName = user.lastName;
          this.editUserFormDTO.phone = user.phone;

          this.editUserMobileFormDTO.email = user.email;
          this.editUserMobileFormDTO.firstName = user.firstName;
          this.editUserMobileFormDTO.lastName = user.lastName;
          this.editUserMobileFormDTO.phone = user.phone;

          this.userBackup.email = user.email;
          this.userBackup.firstName = user.firstName;
          this.userBackup.lastName = user.lastName;
          this.userBackup.phone = user.phone;

          if(user.savedSearchAddresses && user.savedSearchAddresses.length > 0) {
            for(let userSavedSearchAddressDTO of user.savedSearchAddresses) {
              if (userSavedSearchAddressDTO.name === 'Home') {
                this.homeLocation = new UserSavedSearchAddressViewDTO(userSavedSearchAddressDTO);

              } else {
                this.workLocation = new UserSavedSearchAddressViewDTO(userSavedSearchAddressDTO);
              }

            }
          }
          

        });

        this.spinner = new Spinner({
					  lines: 13 // The number of lines to draw
					, length: 28 // The length of each line
					, width: 14 // The line thickness
					, radius: 42 // The radius of the inner circle
					, scale: 1 // Scales overall size of the spinner
					, corners: 1 // Corner roundness (0..1)
					, color: '#000' // #rgb or #rrggbb or array of colors
					, opacity: 0.25 // Opacity of the lines
					, rotate: 0 // The rotation offset
					, direction: 1 // 1: clockwise, -1: counterclockwise
					, speed: 1 // Rounds per second
					, trail: 60 // Afterglow percentage
					, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
					, zIndex: 2e9 // The z-index (defaults to 2000000000)
					, className: 'spinner' // The CSS class to assign to the spinner
					, top: '50%' // Top position relative to parent
					, left: '50%' // Left position relative to parent
					, shadow: false // Whether to render a shadow
					, hwaccel: false // Whether to use hardware acceleration
					, position: 'absolute' // Element positioning
        });
        
        this.croppieSpinner = new Spinner({
					  lines: 13 // The number of lines to draw
					, length: 28 // The length of each line
					, width: 14 // The line thickness
					, radius: 42 // The radius of the inner circle
					, scale: 1 // Scales overall size of the spinner
					, corners: 1 // Corner roundness (0..1)
					, color: '#000' // #rgb or #rrggbb or array of colors
					, opacity: 0.25 // Opacity of the lines
					, rotate: 0 // The rotation offset
					, direction: 1 // 1: clockwise, -1: counterclockwise
					, speed: 1 // Rounds per second
					, trail: 60 // Afterglow percentage
					, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
					, zIndex: 2e9 // The z-index (defaults to 2000000000)
					, className: 'spinner' // The CSS class to assign to the spinner
					, top: '50%' // Top position relative to parent
					, left: '50%' // Left position relative to parent
					, shadow: false // Whether to render a shadow
					, hwaccel: false // Whether to use hardware acceleration
					, position: 'absolute' // Element positioning
        });
  }

  ngOnInit() {
    
  }
  
  ngAfterViewInit() {
    setTimeout(_ => 
      { 
        this.loadGooglePlaces();
      });

      window.scrollTo(0, 0);
  }

  enableEditing() {
    this.editMode = true;
  }

  cancelUpdateUser() {
    this.editUserMobileFormDTO.email = this.userBackup.email;
    this.editUserMobileFormDTO.firstName = this.userBackup.firstName;
    this.editUserMobileFormDTO.lastName = this.userBackup.lastName;
    this.editUserMobileFormDTO.phone = this.userBackup.phone;

    this.editMode = false;
  }

  updateUserMobile() {

    this.userService.updateUser(this.editUserMobileFormDTO.getUpdateUserDTO()).subscribe(() =>
      {
        this.editMode = false;

        this.userBackup.email = this.editUserMobileFormDTO.email;
        this.userBackup.firstName = this.editUserMobileFormDTO.firstName;
        this.userBackup.lastName = this.editUserMobileFormDTO.lastName;
        this.userBackup.phone = this.editUserMobileFormDTO.phone;
      });
  }

  updateUser() {
    this.userService.updateUser(this.editUserFormDTO.getUpdateUserDTO()).subscribe(() => 
      {
        this.user.email = this.editUserFormDTO.email;
        this.user.firstName = this.editUserFormDTO.firstName;
        this.user.lastName = this.editUserFormDTO.lastName;
        this.user.phone = this.editUserFormDTO.phone;
      });
  }

  onSubmit2(valid, event: Event){
    //event.preventDefault();
      if (valid) {
        this.updateUser();
      } else {
        this.validateForm();
      }
    }

  validateForm() {
    this.editUserNGForm = this.currentForm;

    const form = this.editUserNGForm.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && !control.valid) {
        const messages = this.formErrorsvalidationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key];
        }
      }
    }
  }

  formErrors = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'phone': ''
  };

  formErrorsvalidationMessages = {
    'firstName': {
      'required':      'First name is required.'
    },
    'lastName': {
      'required':      'Last name is required.'
    },
    'email': {
      'required':      'Email is required.',
      'email': 'Email invalid'
    },
    'phone': {
      'required':      'Phone number is required.',
      'minlength':      'Please enter the 3 digit area code followed by the 7 digit phone number.',
      'maxlength':      'Please enter the 3 digit area code followed by the 7 digit phone number.',
      'phone': 'Invalid phone number.'
    }
  };

  onSubmitMobile(valid, event: Event){
    //event.preventDefault();

    
      if (valid) {
        this.updateUserMobile();
        //Get rid of error messages
        this.validateFormMobile();
      } else {
        this.validateFormMobile();
      }
    }

  validateFormMobile() {
    this.editUserMobileNGForm = this.currentMobileForm;

    const form = this.editUserMobileNGForm.form;

    for (const field in this.formErrorsMobile) {
      // clear previous error message (if any)
      this.formErrorsMobile[field] = '';
      const control = form.get(field);

      if (control && !control.valid) {
        const messages = this.formErrorsvalidationMessagesMobile[field];

        for (const key in control.errors) {
          this.formErrorsMobile[field] += messages[key];
        }
      }
    }
  }

    formErrorsMobile = {
      'firstName': '',
      'lastName': '',
      'email': '',
      'phone': ''
    };

    formErrorsvalidationMessagesMobile = {
    'firstName': {
      'required':      'First name is required.'
    },
    'lastName': {
      'required':      'Last name is required.'
    },
    'email': {
      'required':      'Email is required.',
      'email': 'Email invalid'
    },
    'phone': {
      'required':      'Phone number is required.',
      'minlength':      'Please enter the 3 digit area code followed by the 7 digit phone number.',
      'maxlength':      'Please enter the 3 digit area code followed by the 7 digit phone number.',
      'phone': 'Invalid phone number.'
    }
  };

    private loadGooglePlaces() {
      // set current position
      this.setCurrentPosition();

          // load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        if(this.searchElementRef){ //Don't add auto complete when auto complete is not shown
  
        
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"]
          });

          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {

              // get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();

              // verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }

              //if locationCreateMode is set to true, create a new location. Otherwise, update a location
              if (!this.locationCreateMode) {
                this.userService.updateUserSavedSearchAddress(place, this.selectedLocation.id, this.selectedLocation.name).subscribe(() =>
                  {
                    //Update the address in the view
                    let mapLocationDTO: MapLocationDTO = GoogleMapsUtil.parsePlaceToMapLocation(place);
                    this.selectedLocation.address1 = mapLocationDTO.address1;
                    this.selectedLocation.address2 = mapLocationDTO.address2;
                    this.selectedLocation.city = mapLocationDTO.city;
                    this.selectedLocation.state = mapLocationDTO.state;
                    this.selectedLocation.zip = mapLocationDTO.zip;
                    this.selectedLocation.latitude = mapLocationDTO.latitude;
                    this.selectedLocation.longitude = mapLocationDTO.longitude;

                    this.userService.setLocalUser();
                    this.locationModalComponent.close();
                  });
              } else {
                this.userService.createUserSavedSearchAddress(place, this.selectedLocation.name).subscribe(newLocationId =>
                  {
                    //Update the address in the view
                    let mapLocationDTO: MapLocationDTO = GoogleMapsUtil.parsePlaceToMapLocation(place);

                    if ('Home' === this.selectedLocation.name) {
                      this.homeLocation = new UserSavedSearchAddressViewDTO();
                      this.homeLocation.address1 = mapLocationDTO.address1;
                      this.homeLocation.address2 = mapLocationDTO.address2;
                      this.homeLocation.city = mapLocationDTO.city;
                      this.homeLocation.state = mapLocationDTO.state;
                      this.homeLocation.zip = mapLocationDTO.zip;
                      this.homeLocation.latitude = mapLocationDTO.latitude;
                      this.homeLocation.longitude = mapLocationDTO.longitude;
                      this.homeLocation.name = this.selectedLocation.name;
                      this.homeLocation.id = newLocationId;
                    } else {
                      this.workLocation = new UserSavedSearchAddressViewDTO();
                      this.workLocation.address1 = mapLocationDTO.address1;
                      this.workLocation.address2 = mapLocationDTO.address2;
                      this.workLocation.city = mapLocationDTO.city;
                      this.workLocation.state = mapLocationDTO.state;
                      this.workLocation.zip = mapLocationDTO.zip;
                      this.workLocation.latitude = mapLocationDTO.latitude;
                      this.workLocation.longitude = mapLocationDTO.longitude;
                      this.workLocation.name = this.selectedLocation.name;
                      this.workLocation.id = newLocationId;
                    }

                    
                    this.userService.setLocalUser();
                    this.locationModalComponent.close();
                  });
              }

              

            });
          });
        } else {
          bootbox.alert('There was a problem loading maps.');
        }
    });
  }



  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // this.latitude = position.coords.latitude;
        // this.longitude = position.coords.longitude;
        // this.zoom = 12;
      });
    }
  }

  updateSavedSearchLocation(userSavedSearchAddressViewDTO: UserSavedSearchAddressViewDTO) {
    this.selectedLocation = userSavedSearchAddressViewDTO;

    this.currentAddress = userSavedSearchAddressViewDTO.address1;

    if (userSavedSearchAddressViewDTO.address2) {
      this.currentAddress += ' ' + userSavedSearchAddressViewDTO.address2;
    }

    this. currentAddress += ' ' + userSavedSearchAddressViewDTO.city + ' ' + userSavedSearchAddressViewDTO.state + ' ' + userSavedSearchAddressViewDTO.zip

    this.locationCreateMode = false;
    this.locationModalComponent.open();
  }

  openCreateSavedSearchLocationModal(name: string) {
    this.currentAddress = null;
    this.selectedLocation = new UserSavedSearchAddressViewDTO();
    this.selectedLocation.name = name;
    
    this.locationCreateMode = true;
    this.locationModalComponent.open();
  }

  updateSavedSearchWorkLocation(userSavedSearchAddressViewDTO: UserSavedSearchAddressViewDTO) {
    bootbox.confirm('Are you sure you would like to delete this location?',
        result =>
        {
          if(result){
            this.userService.deleteUserSavedSearchAddress(userSavedSearchAddressViewDTO.id).subscribe(
              () => {
                if('Home' === userSavedSearchAddressViewDTO.name) {
                  this.homeLocation = null;
                } else {
                  this.workLocation = null;
                }
                this.userService.setLocalUser();
              }
            )
          }
        }
      );
  }

  readURL(event) {
    let fileList: FileList = event.target.files;
    let user = this.user;
    
    if (fileList.length > 0) {

      //Display spinner while photo loads
      //let croppedDiv = this.elementRef.nativeElement.querySelector('#croppedDiv');
      let croppedDiv = document.getElementsByClassName('cropped-div')[0];
			this.spinner.spin(<HTMLElement>croppedDiv);
      
      let reader = new FileReader();

      this.hideUploadSpinner = false;
      reader.onload = (e: FileReaderEvent) => {
        this.croppieImg.src = e.target.result;

        //Initialize the cropper on the image
        // https://stackoverflow.com/questions/6504835/why-is-element-tagname-undefined
        //create a new HTMLElement from nativeElement
        let hElement: HTMLElement = this.elementRef.nativeElement;
        //now you can simply get your elements with their class name
        let image = document.getElementsByClassName('croppie-div-img')[0];
        //  let image = this.elementRef.nativeElement.querySelector('#croppieImg');
        
        this.hideCroppedDiv = true;
        this.hideCroppieDiv = false;
        this.cropper = new Cropper(<HTMLImageElement>image, this.getCropperOptions());

        this.cropper.replace(e.target.result);
      };

      reader.readAsDataURL(event.target.files[0]);

      this.hideCroppedCanvasBtn = false;
      this.hideRotateBtn = false;
    }
  }

    getCropperOptions(): CropperOptions {
      const cropperOptions: CropperOptions = {
                    
        aspectRatio: 1/1,
        autoCropArea: .8,
        background: false,
        center: false,
        cropBoxResizable: false,
        cropBoxMovable: false,
        guides: false,
        //cropBoxResizable: true,
        //zoomable: false,
        
        //movable: false,
        //zoomOnTouch: false,
        //zoomOnWheel: false,
        toggleDragModeOnDblclick: false,
        //movable: false,
        viewMode: 1,
        dragMode: 'move',
        checkOrientation: false,
        build: () => {
          //Need this check because this event fires more than once for some reason
          // if(!photoUploadSpinnerSpinning){
          // 	photoUploadSpinnerSpinning = true;
          // }
          return true;
        },
        ready: () => {
          // if(photoUploadSpinnerSpinning){
          
          this.hideUploadSpinner = true;

          // Hide the other image
          this.hideCroppedDiv = true;

          //Show the cropping div
          this.hideCroppieDiv = false;


          //Stop the spinner
          this.spinner.stop();
        
          //Hide the cropped picture div
          
          // photoUploadSpinnerSpinning = false;

          // } // photoUploadSpinner if
          return true;
        }
      };

      return cropperOptions;
    }

    rotateCropper() {
      this.cropper.rotate(90);
    }

    uploadImg() {
        // let croppieImg = this.elementRef.nativeElement.querySelector('.cropper-wrap-box');
        let croppieImg = document.getElementsByClassName('cropper-wrap-box')[0];
			  this.croppieSpinner.spin(<HTMLElement> croppieImg);

        // When the button to accept the cropped image is clicked,
        // Hide the cropping div and display the new image
        let resultSrc = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');

        // //Hide the cropper and cropper options
        this.hideCroppedCanvasBtn = true;
        this.hideRotateBtn = true;

        let file = this.dataURItoBlob(resultSrc);
        let data = new FormData();

				// Binary image
        data.append('file', file, 'elfie.png');

        this.userService.uploadImg(data, file.type).subscribe(
            result => {
              this.imgUrl = result.imgUrl;
              this.croppedImg.src = result.imageBaseUrl + result.imgUrl;
              this.user.imgUrl = result.imageBaseUrl + result.imgUrl;
              
              this.hideCroppedDiv = false;
              this.hideCroppieDiv = true;
              this.croppieSpinner.stop();
              this.spinner.stop();
              this.cropper.destroy();
              this.photoModal.close();
            },
            error => {
              this.imgUrl = '';
              this.spinner.stop();
              this.hideCroppedDiv = false;
              this.hideCroppieDiv = true;
              bootbox.alert('There was an error uploading your image.');
              this.cropper.destroy();
            });
    }

    dataURItoBlob(dataURI) {
		    // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(dataURI.split(',')[1]);
        } else {
          byteString = decodeURI(dataURI.split(',')[1]);
        }

        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

         // write the bytes of the string to a typed array
        let ia = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }

    resetCropper() {
      if(this.cropper) {
        this.cropper.destroy();

        let fileInput: HTMLInputElement = <HTMLInputElement>document.getElementById('upload');
        fileInput.value = '';

        this.hideCroppieDiv = true;
        this.hideCroppedCanvasBtn = true;
        this.hideRotateBtn = true;
        this.hideCroppedDiv = false;
        this.hideUploadSpinner = true;
      }
    }
}