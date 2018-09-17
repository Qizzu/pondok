import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database'
import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-tbarang',
  templateUrl: 'tbarang.html',
})
export class TbarangPage {

  public isSearch = false;
  public searching = false;
  public dataTipeBarang:any;
  public dataTemp:any;
  public dataTemp2:any;
  urlApi = "https://randomuser.me/api/?results=20";

  perPage = 10;
  page = 2;
  totalPage = 10;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private database: DatabaseProvider, 
              public platform: Platform,
              public alertCtrl: AlertController,
              private http:HttpClient) {

    // this.getAllBarang();
  }

  ionViewDidEnter(){
    this.database.getDatabaseState().subscribe ( open => {
      if (open) {
        this.getAllTipeBarang();
      }
    })
  }
  
  getAllTipeBarang(){
    this.database.getAllTipeBarang().then((data) => {
      this.dataTemp = data;
      console.log(data);
      this.initializeItems();
    }, (error) => {
      console.log(error);
    })
  }

  initializeItems() {
    this.dataTemp2 = this.dataTemp
    this.dataTipeBarang = this.dataTemp2.slice(0,(this.totalPage));
  }
  
  deleteTipeBarang(id){
    console.log(id);
    this.database.deleteTipeBarang(id).then((data) => {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }, (error) => {
      console.log(error);
    })
  }
  
  doRefresh(refresher) {
    setTimeout(() => {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      refresher.complete();
    }, 2000);
  }

  onSearch(ev: any) {
    this.searching = true;
    this.initializeItems();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.dataTemp2 = this.dataTemp.filter((item) => {
        return (item.tipe_barang.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    this.dataTipeBarang = this.dataTemp2.slice(0,(this.totalPage));
    this.searching = false;
  }

  doInfinite(infiniteScroll) {
    this.totalPage = this.page*this.perPage;
    setTimeout(() => {
      this.dataTipeBarang = this.dataTemp2.slice(0,(this.totalPage));
      this.page++;
      infiniteScroll.complete();
      for (var index = 0; index < this.totalPage; index++) {
        if (this.dataTipeBarang[index] == undefined) {
          infiniteScroll.enable(false);          
        }
      }
    }, 500);
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Tipe Barang',
      message: "Masukan nama tipe barang",
      inputs: [
        {
          name: 'TipeBarang',
          placeholder: 'Tipe Barang'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.database.createTipeBarang(data.TipeBarang).then((data) => {
              console.log(data);
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }, (error) => {
              console.log(error);
            })
          }
        }
      ]
    });
    prompt.present();
  }

  getAllBarang(){
    this.http.get(this.urlApi).subscribe(res => {
      this.dataTemp = res['results'];
      console.log(this.dataTemp);
      this.initializeItems();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TbarangPage');
  }

}
