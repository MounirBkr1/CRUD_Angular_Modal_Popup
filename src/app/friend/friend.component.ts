import {Component, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ModalDismissReasons,NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Friend} from "../friend";
import {FormBuilder, FormGroup,Validators } from "@angular/forms";





@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends : Friend[]=[];
  closeResult:String='';
  // @ts-ignore
  public editForm: FormGroup;
//nbre of champs deleted
  private deleteId: number=0;

  constructor(private httpClient:HttpClient,
              private modalService: NgbModal,
              private fb:FormBuilder) { }

  ngOnInit(): void {
    this.getFriends();
    this.editForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      department: [''],
      email: [''],
      country: ['']
    } );
  }

  getFriends(){
    this.httpClient.get<any>('http://localhost:8080/friends').subscribe(
        (response: Friend[]) => {
        console.log(response);
        //put response=list on friends in variable friends
        this.friends = response;
      }
    );
  }

  //display a popup
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //f: object in the form

  onSubmit(f: any) {
    const url = 'http://localhost:8080/friends/addNew';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openDetails(targetModal: any, friend: Friend) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    // @ts-ignore
    document.getElementById('fname').setAttribute('value', friend.firstName);
    // @ts-ignore
    document.getElementById('lname').setAttribute('value', friend.lastName);
    // @ts-ignore
    document.getElementById('dept').setAttribute('value', friend.department);
    // @ts-ignore
    document.getElementById('email2').setAttribute('value', friend.email);
    // @ts-ignore
    document.getElementById('cntry').setAttribute('value', friend.country);
  }

  openEdit(targetModal: any, friend: Friend) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });

    //update value in form
    this.editForm.patchValue( {
      id: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      department: friend.department,
      email: friend.email,
      country: friend.country
    });
  }



  onSaveChanges() {
    const editURL = 'http://localhost:8080/friends/' + this.editForm.value.id + '/edit';
    console.log(this.editForm.value);
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  // @ts-ignore
  openDelete(targetModal, friend: Friend) {
    this.deleteId = friend.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg',

    });
  }

  onDelete() {

      const deleteURL = 'http://localhost:8080/friends/' + this.deleteId + '/delete';
      this.httpClient.delete(deleteURL)
        .subscribe((results) => {
          this.ngOnInit();
          this.modalService.dismissAll();
        });

  }

  RegisterFriend() {

  }
}
