import { Component, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {

  showAddressInputField = true;
  showSellerBuyerBtn = true;
  addressInputField = true;
  propertyData: any;
  tempPropertyData: any;
  filteredShowPropertyData: any;
  showNotFoundText = false;
  formattedDate: any;
  data: any;
  showNumberError = false;

  showFormGroup = new FormGroup({
    showProperty: new FormControl(),
  })

  addFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    propertyAddress: new FormControl('', Validators.required),
    propertyArea: new FormControl('', Validators.required),
    propertyCost: new FormControl('', Validators.required),
    propertyType: new FormControl('', Validators.required),
    dateOfApproach: new FormControl(new Date().toISOString().slice(0,10), Validators.required),
    whatToDo: new FormControl('', Validators.required),
  })

  constructor(private _snackBar: MatSnackBar, private apollo: Apollo) { 
  }

  getData = gql`
    query{
      propertyData{
        name
        number
        address
        propertyArea
        propertyCost
        propertyAddress
        propertyType
        whatToDo
        dateOfApproach
      }
    }
  `;

  ngOnInit(): void {
    this._getAllData();
    // this.addFormGroup.setValue({ownerName: "Abhishek"})
  }

  showSellerDetails(){
    this.showAddressInputField = true;
    this.tempPropertyData = this.propertyData
    this.tempPropertyData = this.tempPropertyData.filter((item: any) => item.propertyAddress != "")
    this.filteredShowPropertyData = this.tempPropertyData
  }

  showBuyerDetails(){
    this.showAddressInputField = false;
    this.tempPropertyData = this.propertyData
    this.tempPropertyData = this.tempPropertyData.filter((item: any) => item.propertyAddress == "")
    this.filteredShowPropertyData = this.tempPropertyData
    console.log(this.filteredShowPropertyData)
  }

  showProperty(){
    if(this.showFormGroup.value.showProperty){
      this.filteredShowPropertyData = this.tempPropertyData.filter((item: any) => item.name.toLowerCase().includes(this.showFormGroup.value.showProperty.toLowerCase()))
      if(!this.filteredShowPropertyData.length){
        this.showNotFoundText = true;
        this.showSellerBuyerBtn = false;
      }
      else{
        this.showNotFoundText = false;
        this.showSellerBuyerBtn = true;
      }
    }
    else{
      this.showNotFoundText = false;
      this.showSellerBuyerBtn = true;
      this.showSellerDetails()
    }
  }

  setNumber(){
    if(this.addFormGroup.value.number.toString().length != 10){
      this.showNumberError = true;
    }
    if(this.addFormGroup.value.number.toString().length == 10){
      this.showNumberError = false;
    }
  }
  
  addPropertyData() {
    this.formattedDate = moment(this.addFormGroup.value.dateOfApproach).format('DD/MM/YYYY')
    if(this.addFormGroup.controls.name.status == "VALID" && 
      this.addFormGroup.controls.address.status == "VALID" &&
      this.addFormGroup.controls.number.status == "VALID" &&
      ((this.addressInputField && this.addFormGroup.controls.propertyAddress.status == "VALID") || !this.addressInputField) &&
      this.addFormGroup.controls.propertyArea.status == "VALID" &&
      this.addFormGroup.controls.propertyCost.status == "VALID" &&
      this.addFormGroup.controls.propertyType.status == "VALID" &&
      this.addFormGroup.controls.dateOfApproach.status == "VALID" &&
      this.addFormGroup.controls.whatToDo.status == "VALID"){
        this._snackBar.open("Property Details Added Successfully!!!", "X", {
          duration: 2500,
          panelClass: ["snackBar"]
        })
      const sendData = gql`
        mutation insertData {
          insert_propertyData(objects: {address: "${this.addFormGroup.value.address}", name: "${this.addFormGroup.value.name}", number: "${this.addFormGroup.value.number}", propertyAddress: "${this.addFormGroup.value.propertyAddress}", propertyArea: "${this.addFormGroup.value.propertyArea}", propertyCost: "${this.addFormGroup.value.propertyCost}", propertyType: "${this.addFormGroup.value.propertyType}", whatToDo: "${this.addFormGroup.value.whatToDo}", dateOfApproach: "${this.formattedDate}"}){
            affected_rows
          }
        }
      `;

      this.apollo.mutate({mutation: sendData})
      .subscribe((data) => {
        window.location.reload()
      })
    }
    else{
      this._snackBar.open("Please Enter The Details!!!", "X", {
        duration: 2500,
        panelClass: ["snackBar"]
      })
    }
  } 

  addSellerDetails(){
    this.addressInputField = true;
  }

  addBuyerDetails(){
    this.addressInputField = false;
    this.addFormGroup.get('propertyAddress')?.clearValidators()
    console.log(this.addFormGroup)
  }

  _getAllData() {
    this.apollo.query({query: this.getData})
      .subscribe((data: any) => {
        this.propertyData = data['data']['propertyData']
        this.data = this.propertyData
      })
  }
}

