import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "commiteeState";
  movies: any;
  movies2: any;
  retrievedData: any;
  activityForm: FormGroup;
  result_array: Result[] = [];
  count: number = 0;

  //State Response
  websiteList: ResponseDatum;

  //divison response
  divisionlist: ResponseDatumDivison;

  //district response
  districtlist: ResponseDatumdistrict;

  //taluka Response
  talukalist: ResponseDatumTaluka;

  //village Response
  villagelist: ResponseDatumVillage;

  // Ng Model 
  selectedLevel: ResponseDatum;
  selecteddivison: ResponseDatumDivison;
  selectedDistrict: ResponseDatumdistrict;
  selectedTaluka: ResponseDatumTaluka;
  selectedvillage: ResponseDatumVillage;

  Supplier: string;
  product_id: string;
  Name: string;
  description: string;
  category: string;
  quantity:string;
  price:string;

  villagename:any;

  inventoryForm: FormGroup;

  profileForm: FormGroup;
  inventorySubmit: boolean = false;
  regexPattern = '/^-?(0|[1-9]\d*)?$/';
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }
  ngOnInit() {
    //this.setlocalStorage();
    this.createForm();
   
    // this.profileForm = new FormGroup({
    //   firstName: new FormControl(''),
    //   lastName: new FormControl(''),
    // });
  }

 
  createForm() {
    this.inventoryForm = this.formBuilder.group(
      {
        Supplier: ['', [Validators.required]],
        product_id: ['', [Validators.required]],
        Name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        product_category: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
        price: ['', [Validators.required]],
    
      },
    );
  }

 

  get inventoryFormControl() {
    return this.inventoryForm.controls;
  }
   //State API Call here Intially
  setlocalStorage() {
    this.http
      .get("http://awsmaster.mahamining.com/master/states/GetState")
      .subscribe((res: any) => {

        //Storing Response of State
        this.websiteList = res.responseData;
      });
  }

 

  //Add Element in Array
  addCommitee() {
    this.inventorySubmit = true;
    if(this.inventoryForm.invalid){
      //alert("Invalid Form");
      console.log(this.inventoryForm.controls); 
      //console.log("controls", this.newActivityForm.controls[el]);
      return;
    }else{

      this.count = this.count + 1
      this.result_array.push({
        id: this.count,
        Supplier: this.inventoryForm.controls['Supplier'].value,
        product_id: this.inventoryForm.controls['product_id'].value,
        Name: this.inventoryForm.controls['Name'].value,
        description: this.inventoryForm.controls['description'].value,
        category: this.inventoryForm.controls['product_category'].value,
        quantity: this.inventoryForm.controls['quantity'].value,
        price: this.inventoryForm.controls['price'].value     
      });
  
      localStorage.setItem('commitee', JSON.stringify(this.result_array));
      console.log("Local storage ", localStorage.getItem('commitee'));

      this.inventoryForm.reset();
      this.inventorySubmit = false;
    }


  }

//Delete Method 
  onDelete(idx){
    this.result_array.splice(idx,1);
    console.log("Result After Delete ",this.result_array);
    localStorage.setItem('commitee', JSON.stringify(this.result_array));
    console.log("Local storage After Delete : ", localStorage.getItem('commitee'));
  }

  onEdit(idx){
    console.log("id ",idx);
    // this.result_array[idx][0];
    // this.villagename = this.result_array[idx].village;

    this.Supplier = this.result_array[idx].Supplier
    this.product_id =  this.result_array[idx].product_id
    this.Name= this.result_array[idx].Name
    this.description = this.result_array[idx].description
    this.category= this.result_array[idx].category
    this.quantity= this.result_array[idx].quantity
    this.price= this.result_array[idx].price

  
  }

  //After Selecting State Divison API Call here
  onSelect() {

    console.log("State Name :", this.selectedLevel.state);
    this.http
      .get(
        "http://awsmaster.mahamining.com/master/divisions/" +
        this.selectedLevel.id
      )
      .subscribe((res: any) => {
        this.divisionlist = res.responseData;


      });
  }
  //After selecting Divison District will be called here
  ondivison() {
    console.log("Divison Name :", this.selecteddivison.division);
    this.http
      .get(
        "http://awsmaster.mahamining.com/master/districts/GetDistrictByDivisionId/" +
        this.selecteddivison.divCode
      )
      .subscribe((res: any) => {
        this.districtlist = res.responseData;
        // console.log("division : ",this.selectedDistrict.district);
      });
  }

  //After selecting District Taluka API will be called here
  ondistrict() {
    console.log("District Name :", this.selectedDistrict.district);
    this.http
      .get(
        "http://awsmaster.mahamining.com/master/talukas/GetTalukaByDistrictId/" +
        this.selectedDistrict.distCode
      )
      .subscribe((res: any) => {
        this.talukalist = res.responseData;

      });
  }

  //After selecting Taluka Get Village API will be called here
  ontaluka() {
    console.log("Taluka Name :", this.selectedTaluka.taluka);
    this.http
      .get(
        "http://awsmaster.mahamining.com/master/villages/GetVillagesByCriteria/" +
        this.selectedTaluka.talCode
      )
      .subscribe((res: any) => {
        this.villagelist = res.responseData;


      });
  }

  onvillage() {
    console.log("Village Name", this.selectedvillage.name);
  }
}


//State Response Class
//http://awsmaster.mahamining.com/master/states/GetState
export class ResponseDatum {
  id: string;
  state: string;
  stateCode: number;
  isDeleted: boolean;
  createdBy: number;
  trainingDate: string;
  trainingDateFormatdate: string;
}


//2nd API /divison/stateid
//http://awsmaster.mahamining.com/master/divisions/1
export class ResponseDatumDivison {
  id: number;
  division: string;
  stateId: number;
  divCode: number;
  isDeleted: boolean;
  createdBy: number;
  trainingDate: Date;
  trainingDateFormatdate: string;
}

//District Response Class 
//http://awsmaster.mahamining.com/master/districts/GetDistrictByDivisionId/divCode

export class ResponseDatumdistrict {
  id: number;
  district: string;
  divisionId: number;
  stateId: number;
  distCode: number;
  m_District: string;
  isDeleted: boolean;
  createdBy: number;
  trainingDate: Date;
  trainingDateFormatdate: string;
}

//Taluka Response Class
export class ResponseDatumTaluka {
  id: number;
  taluka: string;
  districtID: number;
  stateId: number;
  divisionId: number;
  talCode: number;
  talPreFix: number;
  tLatitude: number;
  tLongitude: number;
  m_Taluka: null;
  tDistance: number;
  subDivisionId: number;
  isDeleted: boolean;
  createdBy: number;
  trainingDate: Date;
  trainingDateFormatdate: string;
}

export class ResponseDatumVillage {
  id: number;
  stateId: number;
  districtId: number;
  talukaId: number;
  stCode: string;
  dtCode: string;
  dtName: string;
  sdtCode: string;
  sdtName: string;
  tvCode: string;
  name: string;
  isTown: boolean;
  latitude: number;
  longitude: number;
  createdBy: number;
  createdDate: Date;
  isDeleted: boolean;
  updatedDate: Date;
  extraInvoiceTime: number;
  createdDateFormatdate: string;
  updatedDateFormatdate: string;
}

export class Result {
  id: number;
  Supplier: string;
  product_id: string;
  Name: string;
  description: string;
  category: string;
  quantity:string;
  price:string;
}