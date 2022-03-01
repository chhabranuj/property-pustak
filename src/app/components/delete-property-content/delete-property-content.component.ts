import { Component, Input, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-property-content',
  templateUrl: './delete-property-content.component.html',
  styleUrls: ['./delete-property-content.component.css']
})
export class DeletePropertyContentComponent implements OnInit {

  @Input() data: any;

  propertyData: any;
  tempPropertyData: any;
  showSellerBuyerBtn = true;
  showPropertyAddress = true;
  filteredDeletePropertyData: any;
  deleteNotFoundText = false;
  closePanel = false;
  deleteData: any;

  deleteFormGroup = new FormGroup({
    deleteProperty: new FormControl()
  })

  constructor(private _snackBar: MatSnackBar, private apollo: Apollo) { }

  ngOnInit(): void {
    console.log(this.data)
    this.propertyData = this.data
  }

  sellerDetails(){
    this.showPropertyAddress = true;
    this.tempPropertyData = this.propertyData
    this.tempPropertyData = this.tempPropertyData.filter((item: any) => item.propertyAddress != "")
    this.filteredDeletePropertyData = this.tempPropertyData
  }

  buyerDetails(){
    this.showPropertyAddress = false;
    this.tempPropertyData = this.propertyData
    this.tempPropertyData = this.tempPropertyData.filter((item: any) => item.propertyAddress == "")
    this.filteredDeletePropertyData = this.tempPropertyData
  }

  deleteProperty(){
    if(this.deleteFormGroup.value.deleteProperty){
      this.filteredDeletePropertyData = this.tempPropertyData.filter((item: any) => item.name.toLowerCase().includes(this.deleteFormGroup.value.deleteProperty.toLowerCase()))
      if(!this.filteredDeletePropertyData.length){
        this.deleteNotFoundText = true;
        this.showSellerBuyerBtn = false;
      }
      else{
        this.deleteNotFoundText = false;
        this.showSellerBuyerBtn = true;
      }
    }
    else{
      this.deleteNotFoundText = false;
      this.showSellerBuyerBtn = true;
      this.sellerDetails()
    }       
  }

  deletePropertyCard(name: any){
    const deleteData = gql`
      mutation delete_property_data {
        delete_propertyData(
          where: {name: {_eq:"${name}"}}){
            affected_rows
          }
        }
      `;

      this.apollo.mutate({mutation: deleteData})
      .subscribe((data: any) => {
        this._snackBar.open("Property Deleted Successfully!!!", "X", {
          duration: 2500,
          panelClass: ["snackBar"]
        })
        window.location.reload()
      })
  }

}
