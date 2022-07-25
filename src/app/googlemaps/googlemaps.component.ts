import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GooglemapsService } from './googlemaps.service';
import {Plugins} from '@capacitor/core';
import { DOCUMENT } from '@angular/common';

declare let google: any;
const {Geolocation}= Plugins;

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss'],
})
export class GooglemapsComponent implements OnInit {

  @Input() position = {
    lat: 21.87960105,
    lng: -102.303282256171
  };

  label = {
    tittle: 'Location',
    subtittle: 'My shipping Location'
  };

  map: any;
  marker: any;
  infowindow: any;
  positionSet: any;

  @ViewChild('map') divMap: ElementRef;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document,
              private googlemapsService: GooglemapsService, public modalController: ModalController) { }

  ngOnInit() {
    this.init();
  }

  async init(){
    this.googlemapsService.init(this.renderer, this.document).then(()=>{
      this.initMap();
    }).catch((err) =>{
      console.log(err);
    });
  }

  initMap(){
    const position=this.position;
    const latLng= new google.maps.LatLng(position.lat, position.lng);
    const mapOptions={
      center: latLng,
      zoom: 15,
      disableDefaultUI:true,
      clickableIcons: false,
    };
    this.map= new google.maps.Map(this.divMap.nativeElement, mapOptions);
    this.marker= new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true,
    });
    this.clickHandleEvent();
    this.infowindow= new google.maps.InfoWindow();
    this.addMarker(position);
    this.setInfoWindow(this.marker, this.label.tittle, this.label.subtittle);

  }

  clickHandleEvent(){
    this.map.addListener('click', (event: any) =>{
      const position={
        lat:event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.addMarker(position);
    });
  }

  addMarker(position: any): void {
    const latLng= new google.maps.LatLng(position.lat, position.lng);
    this.marker.setPosition(latLng);
    this.map.panTo(position);
    this.positionSet= position;
  }

  setInfoWindow(marker: any, tittle: string, subtittle: any){
    const contentString = `<div id="contentInsideMap">
                              <div></div>
                              <p style= "font-weight:bold; margin-bottom:5px;>
                              </p>
                              <div id="bodyContent">
                                <p class="regular m-0"> ${subtittle}</p>
                              </div> 
                           </div>`;

    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker);
  }

  async mylocation(){
    console.log('mylocation click');
    Geolocation.getCurrentPosition().then((res)=>{
      console.log('mylocation() get', res);
      const position={
        lat: res.coords.latitude,
        lng: res.coords.longitude
      };
      this.addMarker(position);
    });
  }

  accept(){
    console.log('click aceptar', this.positionSet);
    this.modalController.dismiss({pos: this.positionSet});
  }
}
