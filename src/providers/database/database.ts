import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/Rx';


@Injectable()
export class DatabaseProvider {
//START CLASS

  private db:SQLiteObject;
  // private isOpen:boolean;
  private isOpen: BehaviorSubject<boolean>;

  constructor(public http: Http, public storage:SQLite, private platform: Platform) {
    this.initiallizeDB();
  }

  initiallizeDB(){
    this.isOpen = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.storage.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.db = db;
        db.executeSql('CREATE TABLE IF NOT EXISTS barang( id INTEGER PRIMARY KEY AUTOINCREMENT, barang TEXT NOT NULL, tipe_barang TEXT, stok INTEGER)', [])
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));
        this.isOpen.next(true);
      })
      .catch(e => console.log(e));
    })
}

  createBarang(barang:string, tipe_barang:string, stok:number){
    return new Promise((resolve,reject) => {
      let sql = "INSERT INTO barang(barang, tipe_barang, stok) VALUES(?, ?, ?)";
      this.db.executeSql(sql,[barang, tipe_barang, stok]).then((data)=>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  getAllBarang(){
    return new Promise((resolve,reject) => {
      this.db.executeSql("SELECT * FROM barang",[]).then((data) => {
        let arrayBarang = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            arrayBarang.push({
              id: data.rows.item(i).id,
              barang: data.rows.item(i).barang,
              tipe_barang: data.rows.item(i).tipe_barang,
              stok: data.rows.item(i).stok
            });
          }
        }
        resolve(arrayBarang);
      }, (error) => {
        reject(error);
      })
    })
  }

  deleteBarang(id:number){
    return new Promise((resolve,reject) => {
      let sql = "DELETE FROM barang WHERE id  = ?";
      this.db.executeSql(sql,[id]).then((data)=>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  getDatabaseState() {
    return this.isOpen.asObservable();
  }

//END CLASS
}