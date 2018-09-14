import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public formbuilder: FormBuilder) {
    this.formgroup = formbuilder.group({
      barang : ['',Validators.required],
      tipe_barang: ['',Validators.required],
      harga: ['',Validators.required],
    });

    this.barang = this.formgroup.controls['barang'];
    this.tipe_barang = this.formgroup.controls['tipe_barang'];
    this.harga = this.formgroup.controls['harga'];
  }

  createBarang(){
    console.log(this.formgroup.value)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatebarangPage');
  }

}
