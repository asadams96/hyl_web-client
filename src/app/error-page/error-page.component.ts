import {Component, OnInit} from '@angular/core';
import {ImgOperationService} from '../shared/services/img-operation/img-operation.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  private path = environment.apiUrl + '/' + environment.imgStaticFolder + '/error.png';
  errorLoad = false;

  constructor(private imgOperationService: ImgOperationService, private router: Router) { }

  ngOnInit() { }

  resize(img: HTMLImageElement, anchor: HTMLAnchorElement) {
    const size = anchor.parentElement.parentElement.offsetWidth;
    this.imgOperationService.setMaxSizeOfImage(img, size, size);

    const interval = setInterval(() => {
      const size2 = anchor.parentElement.parentElement.offsetWidth;
      if (size !== size2) {
        this.imgOperationService.setMaxSizeOfImage(img, size2, size2);
      }
      clearInterval(interval);
    }, 100);
  }

  redirect() {
    this.router.navigate(['/']);
    return false;
  }

  onError() {
    this.errorLoad = true;
  }
}
