import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HomePage } from '../home/home';

/**
 * Generated class for the CreatebarangPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-createbarang',
  templateUrl: 'createbarang.html',
})
export class CreatebarangPage {

  formgroup : FormGroup;
  barang : AbstractControl;
  tipe_barang : AbstractControl;
  harga : AbstractControl;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider, public formbuilder: FormBuilder) {
    this.formgroup = formbuilder.group({
      barang : ['',Validators.required],
      tipe_barang: ['',Validators.required],
      harga: ['',Validators.required],
    });

    this.barang = this.formgroup.controls['barang'];
    this.tipe_barang = this.formgroup.controls['tipe_barang'];
    this.harga = this.formgroup.controls['harga'];
  }

  // createBarang(){
  //   console.log(this.formgroup.value)
  // }

  createBarang(){
    let val = this.formgroup.value;
    this.database.createBarang(val.barang, val.tipe_barang, val.harga).then((data) => {
      this.formgroup.reset();
      this.navCtrl.push(HomePage);
      console.log(data);
    }, (error) => {
      console.log(error);
    })
  }

  goHome(){
    this.navCtrl.push(HomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatebarangPage');
  }

}
