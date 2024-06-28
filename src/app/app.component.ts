import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
interface DadosMusicais {
  id: number;
  artista: string;
  musica: string;
  link: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})

export class AppComponent implements OnInit {
  displayedColumns: string[] = ['artista', 'musica', 'link'];
  dataSource!: MatTableDataSource<any>;
  musicaNacional!: DadosMusicais[];
  @ViewChild('paginatorNacional') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  dataSourceInternacional!: MatTableDataSource<any>;
  musicaInternacional!: DadosMusicais[];
  @ViewChild('paginatorInternacional') paginatorInternacional!: MatPaginator;
  @ViewChild('sortInternacional') sortInternacional!: MatSort;
  url!: SafeResourceUrl;
  artista: any;
  musica: any;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer,iconRegistry: MatIconRegistry, ) {
    iconRegistry.addSvgIcon(
      'mic',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/microphone-with-cable-svgrepo-com.svg')
    );

   }


  ngOnInit(): void {
    this.http.get<any>("assets/json/musicaNacional.json").subscribe((resp: any) => {
      this.musicaNacional = resp.musicaNacional
      this.musicaNacional.sort((a, b) => a.artista.toLowerCase().localeCompare(b.artista))

      this.dataSource = new MatTableDataSource(this.musicaNacional);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.randomMusicaNacional();


    })
    this.http.get<any>("assets/json/musicaInternacional.json").subscribe((resp: any) => {
      this.musicaInternacional = resp.musicaInternacional;
      this.musicaInternacional.sort((a, b) => a.artista.toLowerCase().localeCompare(b.artista))

      this.dataSourceInternacional = new MatTableDataSource(this.musicaInternacional);
      this.dataSourceInternacional.paginator = this.paginatorInternacional;
      this.dataSourceInternacional.sort = this.sortInternacional;

    })
  }
  aleatorioTotal() {
    const randomIndex = Math.floor(Math.random() * 2);
    console.warn(randomIndex);
    if (randomIndex == 1) {
      this.randomMusicaInternacional()
    } else {
      this.randomMusicaNacional();
    }


  }
  randomMusicaNacional() {
    const randomIndex = Math.floor(Math.random() * this.musicaNacional.length);    
    this.tocar(this.musicaNacional[randomIndex])
  }
  randomMusicaInternacional() {
    const randomIndex = Math.floor(Math.random() * this.musicaInternacional.length);
    this.tocar(this.musicaInternacional[randomIndex])

  }
  getSafeUrl(url: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterInternacional(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInternacional.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceInternacional.paginator) {
      this.dataSourceInternacional.paginator.firstPage();
    }
  }

  tocar(dados: any) {
    this.artista = dados.artista
    this.musica = dados.musica
    const tocar = this.getSafeUrl(`${dados.link}?autoplay=1`);

    this.url = tocar;

    const element = document.getElementById('player');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    

  }
}
