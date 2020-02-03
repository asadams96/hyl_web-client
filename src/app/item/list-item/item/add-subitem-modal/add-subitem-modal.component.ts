import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckAtomicSubItemRef} from '../../../../shared/form-validators/async/atomic-subitem-ref.async-validator';
import {Subscription} from 'rxjs';
import {ItemService} from '../../../item.service';
import {ImgOperationService} from '../../../../shared/services/img-operation.service';
import {Router} from '@angular/router';
import {ItemComponent} from '../item.component';

@Component({
  selector: 'app-add-subitem-modal',
  templateUrl: './add-subitem-modal.component.html',
  styleUrls: ['./add-subitem-modal.component.scss']
})
export class AddSubitemModalComponent implements OnInit {

  @Input() item: ItemComponent;

  private createSubItemForm: FormGroup;
  private maxlengthSubItemReference = '15';

  private filesToUpload: File[] = null;
  private imgPreview: (string|ArrayBuffer)[] = null;
  private formatUnsuppErrFile: File;
  private sizeMaxErrFile: File;

  private filesToUploadSubscription: Subscription;
  private imgPreviewSubscription: Subscription;
  private formatUnsuppErrFileSubscription: Subscription;
  private sizeMaxErrFileSubscription: Subscription;

  private filesSizeMax = this.imgOperationService.filesSizeMax; // 1 mo
  private formatSupportedStr = this.imgOperationService.formatSupportedStr;

  constructor(private itemService: ItemService,
              private imgOperationService: ImgOperationService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.initSubscriptions();
    this.initCreateSubItemForm();
  }

  initSubscriptions() {
    this.initFilesToUploadSubscription();
    this.initImgPreviewSubscription();
    this.initFormatUnsuppErrFileSubscription();
    this.initSizeMaxErrFileSubscription();
  }
  initFilesToUploadSubscription() {
    this.filesToUploadSubscription = this.imgOperationService.filesToUploadSubject.subscribe(
        (files: File[]) => {
          this.filesToUpload = files;
        }
    );
  }
  initImgPreviewSubscription() {
    this.imgPreviewSubscription = this.imgOperationService.imgPreviewSubject.subscribe(
        (imgsExtract: (string|ArrayBuffer)[]) => {
          this.imgPreview = imgsExtract;
        }
    );
  }
  initFormatUnsuppErrFileSubscription() {
    this.formatUnsuppErrFileSubscription = this.imgOperationService.formatUnsuppErrFileSubject.subscribe(
        (file: File) => {
          this.formatUnsuppErrFile = file;
        }
    );
  }
  initSizeMaxErrFileSubscription() {
    this.sizeMaxErrFileSubscription = this.imgOperationService.sizeMaxErrFileSubject.subscribe(
        (file: File) => {
          this.sizeMaxErrFile = file;
        }
    );
  }

  initCreateSubItemForm() {
    this.createSubItemForm = this.formBuilder.group({
      reference: ['', [Validators.minLength(6)], [CheckAtomicSubItemRef(this.itemService)]],
      files: ['']
    });
  }

  onSubmitCreateSubItemForm() {
    const reference = this.createSubItemForm.controls.reference.value;
    this.itemService.createSubItem(this.item, reference, this.filesToUpload).then(
        value => {
          this.initCreateSubItemForm();
          this.imgOperationService.reset();
        },
        reason => {
          this.router.navigate(['/error']);
        }
    );

  }

  // Appel lorsqu'un fichier à été choisi par grâce à la balise 'input' de type 'file'
  handleFileInput(files: FileList) {
    this.imgOperationService.handleFileInput(files);
  }

  // Méthode étant appélé par les balises <img> sur l'évenement 'load'
  onLoadImg(htmlImageElement: HTMLImageElement, imgData: string) {
    this.imgOperationService.onLoadImg(htmlImageElement, imgData);
  }

  // Déclenchement -> Si le modal d'ajout d'exemplaire est fermé -> Vidage des images chargées
  onCancelCreateSubItemForm() {
    this.imgOperationService.onCancelCreateSubItemForm();
  }

  /* Déclenchement -> Lors de l'ouverture du modal -> Lors du déclanchement de l'évènement 'focus'
     Si des images avait été choisi avant une fermeture du modal (donc présente dans 'this.filesToUpload') ->
      Reconstruction des array 'this.imgPreview' (vider lors de la fermeture initial du modal) et de this.filesToUpload (tjrs pleins)
      Reconstruction de this.filesToUpload :
      Evite un décale entre les index de 'this.imgPreview et 'this.filesToUpload' car si l'objet FileReader utilisé dans la métohde
      'addToImgPreview' pour remplir this.imgPreview charge plus une image que la suivante une décalge sera crée
      -> l'objet fonctionne par évènement et avec une boucle For, plusieurs évènements font être crée d'un seul coup
     -> Asynchrone donc une image de 25ko chargera plus vite qu'une de 500ko quel que soit sa position -> Décalage entre les deux arrays
   */
  checkIfModalCreateSubItemAlreadyUsed() {
    this.imgOperationService.checkIfServiceHaveAlreadyUsed();
  }

  // Renvoi la taille (en octect) de l'array contenant les fichiers (images) 'this.filesToUpload'
  getFilesSize(): number {
    return this.imgOperationService.getFilesSize();
  }
}
