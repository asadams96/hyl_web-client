import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ItemService} from '../../item.service';
import {CategoryComponent} from '../category/category.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.scss']
})
export class ItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() name: string;
  @Input() description: string;
  @Input() urlItem: string;

  constructor(private itemService: ItemService, private formBuilder: FormBuilder/*, private router: Router*/) { }

  ngOnInit() {
  }


}
