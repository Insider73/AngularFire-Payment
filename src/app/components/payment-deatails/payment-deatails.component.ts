import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-payment-deatails',
  templateUrl: './payment-deatails.component.html',
  styleUrls: ['./payment-deatails.component.scss']
})
export class PaymentDeatailsComponent implements OnInit {

  id: string;
  payment: firebase.firestore.DocumentData;
  authUserInfo: firebase.User; //авторизационные данные

  constructor(private auth: AuthService, private activateRoute: ActivatedRoute, private afs: AngularFirestore, private afAuth: AngularFireAuth){   
    activateRoute.params.subscribe(params =>
      this.id = params['id']
    );
  }

  ngOnInit() {
    this.auth.getUserState()
    .subscribe(user => {
      this.authUserInfo = user;
      console.log(this.authUserInfo);
    });

    this.afAuth.authState.subscribe(item => {
      if(item){

        this.afs.firestore.collection('Users').doc(item.uid).collection('posts').get().then(posts => {
          posts.forEach(doc =>{
            if(this.id === doc.id){
              this.payment = doc.data();
            }
          })
        });

      }
    });
  }

  logout() {
    this.auth.logout();
  }

}
