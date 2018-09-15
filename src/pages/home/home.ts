import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { DatabaseProvider } from '../../providers/database/database'
import { CreatebarangPage } from '../createbarang/createbarang';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public isSearch = false;
  public searching = false;
  public dataBarang:any;
  public dataTemp:any;
  public dataTemp2:any;
  urlApi = "https://randomuser.me/api/?results=20";

  perPage = 10;
  page = 2;
  totalPage;

  constructor(public navCtrl: NavController, private http:HttpClient, private database: DatabaseProvider, public platform: Platform) {
    // this.getAllBarang();
  }

  ionViewDidEnter(){
    this.database.getDatabaseState().subscribe ( open => {
      if (open) {
        this.getAllBarang();
      }
    })
  }

  createBook(){
    this.database.createBarang('BH','Odol', 3).then((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    })
  }

  getAllBarang(){
    this.database.getAllBarang().then((data) => {
      this.dataTemp = data;
      this.initializeItems();
    }, (error) => {
      console.log(error);
    })
  }

  initializeItems() {
    this.dataTemp2 = this.dataTemp
    this.dataBarang = this.dataTemp2.slice(0,(this.perPage));
  }
  
  // getAllBarang(){
  //   this.http.get(this.urlApi).subscribe(res => {
  //     this.dataTemp = res['results'];
  //     console.log(this.dataTemp);
  //     this.initializeItems();
  //   })
  // }

  deleteBarang(id){
    console.log(id);
    this.database.deleteBarang(id).then((data) => {
      console.log(data);
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
        return (item.barang.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    this.dataBarang = this.dataTemp2.slice(0,(this.perPage));
    this.searching = false;
  }

  doInfinite(infiniteScroll) {
    this.totalPage = this.page*this.perPage;
    setTimeout(() => {
      this.dataBarang = this.dataTemp2.slice(0,(this.totalPage));
      this.page++;
      infiniteScroll.complete();
      for (var index = 0; index < this.totalPage; index++) {
        if (this.dataBarang[index] == undefined) {
          infiniteScroll.enable(false);          
        }
      }
    }, 500);
  }

  createBarang(){
    this.navCtrl.setRoot(CreatebarangPage);
  }

}
