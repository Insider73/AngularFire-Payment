import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFirestore ,AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../../models/item';
import * as Tablesort from 'tablesort';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: .5,
    inDuration: 300,
    outDuration: 200
  };

  authUserInfo: firebase.User; //авторизационные данные
  currentUser; //текущий пользователь
  payment: AngularFirestoreCollection<Item>;
  paymentItems:any; //платежи
  term; // поиск
  paymentForm: FormGroup;
  submitted = false; //валидация
  visibleScore = false; // показывать или нет сообщение о балансе

  constructor(private auth: AuthService, private afs: AngularFirestore, private afAuth: AngularFireAuth, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.auth.getUserState()
      .subscribe(user => {
        this.authUserInfo = user;
      });

    this.auth.getUserState().subscribe(item => {
      if (item) {

        //Перенести в дальнейшем в отдельный сервис
        //Получаем акуальную информацию по текущему пользователю
        this.afs.firestore.collection('Users').where('uid', '==', item.uid).get().then(posts => {
          let postsCreatedByUser = posts.docs.map(e => {
            return {
              email: e.data()['email'],
              firstname: e.data()['firstname'],
              lastname: e.data()['lastname'],
              score: e.data()['score'],
              uid: e.data()['uid'],
            }
          })
          this.currentUser = postsCreatedByUser[0];
        });

        //Получаем платежи пользователя
        this.payment = this.afs.collection <Item>(`Users/${item.uid}/posts`);
        this.payment.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Item;
            const id = a.payload.doc.id;
            return {id,...data};
          }))
        ).subscribe(item => {
          this.paymentItems = item;
          sort();
        });
        
      }
    });
    
    this.paymentForm = this.formBuilder.group({
      name: ['', Validators.required],
      comment: ['', Validators.required],
      price: ['', Validators.required],
      requisites: ['', Validators.required]
    });
  }

  get f() {
    return this.paymentForm.controls;
  }

  addPayment(frm) {
    this.submitted = true;

    if (this.paymentForm.invalid) {
      return;
    }

    if(this.currentUser.score > frm.value.price) {
      this.payment.add({
        name: frm.value.name,
        comment: frm.value.comment,
        date: new Date().toLocaleDateString(),
        status: 'Ожидает проверки',
        price: frm.value.price,
        requisites: frm.value.requisites
      });

      let currentScore = this.currentUser.score - frm.value.price;

      this.afs.doc(`Users/${this.authUserInfo.uid}`).update({score:currentScore});

      this.currentUser.score = currentScore;
      
      this.visibleScore = false;
      this.paymentForm.reset();
      this.submitted = false;
  
      var event = document.createEvent("HTMLEvents");
      event.initEvent("click", true, true);
      var button = document.getElementsByClassName('modal_addPayment-close')[0];
      button.dispatchEvent(event);
    } else {
      this.visibleScore = true;
    }

  }

  logout() {
    this.auth.logout();
  }

}

function sort() {
  new Tablesort(document.getElementById('table-id'));
}
