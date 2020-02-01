import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ItemService} from '../../item.service';
import {CategoryComponent} from '../category/category.component';
import {SubItemComponent} from './sub-item/sub-item.component';
import {CheckAtomicSubItemRef} from '../../../shared/form-validators/atomic-subitem-ref.async-validator';
import {CheckFilesUploadFormat} from '../../../shared/form-validators/file-upload-format.validator';
import {CheckFilesUploadSize} from '../../../shared/form-validators/file-upload-size.validator';

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
  @Input() subItems: SubItemComponent[];
  private maxlengthItemName = '15';
  private renameItemForm: FormGroup;
  private moveItemForm: FormGroup;
  private deleteItemForm: FormGroup;
  private createSubItemForm: FormGroup;
  private maxlengthSubItemReference = '15';

  filesToUpload: File[] = null;
  imgPreview: (string|ArrayBuffer)[] = null;
  private filesSizeMax = 1048576; // 1 mo
  private formatSupported = [
    {format: 'jpg', mime: 'image/jpeg'},
    {format: 'jpeg', mime: 'image/jpeg'},
    {format: 'png', mime: 'image/png'}
  ];
  private formatSupportedStr = 'jpg, jpeg, png';
  private formatUnsuppErrFile: File;
  private sizeMaxErrFile: File;


  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initRenameItemForm();
    this.initMoveItemForm();
    this.initDeleteItemForm();
    this.initCreateSubItemForm();
  }

  initRenameItemForm() {
    this.renameItemForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  initMoveItemForm() {
    this.moveItemForm = this.formBuilder.group({
      categoryMove: ['', [Validators.required]]
    });
  }

  initDeleteItemForm() {
    this.deleteItemForm = this.formBuilder.group({
      checkbox: [false, [Validators.pattern('true')]]
    });
  }

  initCreateSubItemForm() {
    this.createSubItemForm = this.formBuilder.group({
      reference: ['', [Validators.minLength(6)], [CheckAtomicSubItemRef(this.itemService)]],
      files: ['']
    });
  }

  onSubmitRenameItemForm() {
    this.itemService.renameItem(this, this.renameItemForm.controls.name.value).then(
        () => {
          this.initRenameItemForm();
        },
        () => {
          this.router.navigate(['/error']);
        }
    );
  }

  onSubmitMoveItemForm() {
    this.itemService.moveItem(this, this.moveItemForm.controls.categoryMove.value).then(
        () => {
          this.initMoveItemForm();
        },
        () => {
          this.router.navigate(['/error']);
        }
    );
  }

  getFullCategoriesInOneArray() {
    // Sert à supprimer un item dans la liste passé en paramètre où toutes les catégories sont classées sans hierarchie
    const removeInOneArray = (categories: CategoryComponent[], itemToRemove: bigint|number): CategoryComponent[] => {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        if (categories[i].items != null && categories[i].items.length > 0) {
          const index = categories[i].items.findIndex(pItem => {
            return Number(itemToRemove) === Number(pItem.id);
          });
          if (index !== -1) {
            categories.splice(i, 1);
            return categories;
          }
        }
      }
    };
    let categoryList = this.itemService.getFullCategoriesInOneArray(null);
    categoryList = removeInOneArray(categoryList, this.id);
    return categoryList;
  }

  onSubmitDeleteItemForm() {
    this.itemService.deleteItem(this).catch(
        () => {
          this.router.navigate(['error']);
        }
    );
  }

  onSubmitCreateSubItemForm() {
     const reference = this.createSubItemForm.controls.reference.value;
     this.itemService.createSubItem(this, reference, this.filesToUpload).then(
         value => {
           this.initCreateSubItemForm();
           this.imgPreview = [];
           this.filesToUpload = [];
         },
         reason => {
           this.router.navigate(['/error']);
         }
     );

  }

  // Appel lorsqu'un fichier à été choisi par grâce à la balise 'input' de type 'file'
  handleFileInput(files: FileList) {
    if (this.filesToUpload === null) { this.filesToUpload = []; }
    this.formatUnsuppErrFile = null;
    this.sizeMaxErrFile = null;

    const c = files.length;
    for (let i = 0; i < c; i++) {
      // Erreur -> Format non pris en charge
      // -> Ajout du fichier erreur à la variable 'this.formatUnsuppErrFile' pour afficher l'erreur dans la vue html
      if ( CheckFilesUploadFormat(files[i], this.formatSupported) !== null ) {
        this.formatUnsuppErrFile = files[i];

        // Erreur -> Taille max dépassé
        // -> Ajout du fichier erreur à la variable 'this.sizeMaxErrFile' pour afficher l'erreur dans la vue html
      } else if ( CheckFilesUploadSize(this.filesToUpload, files[i], this.filesSizeMax) !== null ) {
        this.sizeMaxErrFile = files[i];
        break;
        // Aucune erreur -> Ajout du fichier à l'array des 'fichiers à upload' et utilisation de la méthode
        // 'addToImgPreview' pour convertir le fichier et l'ajouter à l'array des 'images à prévisualiser'
      } else {
        this.filesToUpload.push(files[i]);
        this.addToImgPreview(files[i]);
      }
    }
  }
  /*  Converti le fichier passé en paramètre et l'ajoute sous format String à l'array des images à prévisualiser 'imgPreview'
      Les données extraite permette la prévisualisation de l'image dans le paramètre 'src' d'une balsie 'img'
   */
  addToImgPreview(file: File, rebuildFilesToUpload: boolean = false) {
    if (this.imgPreview === null) { this.imgPreview = []; }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (event => {
      this.imgPreview.push(fileReader.result);
      if (rebuildFilesToUpload) { this.filesToUpload.push(file); }
    }));
  }
  // Méthode étant appélé par les balises <img> sur l'évenement 'load'
  onLoadImg(htmlImageElement: HTMLImageElement, imgData: string) {
    this.setMaxSizeOfImage(htmlImageElement);
    this.removeDisplayNone(htmlImageElement);
    this.addClosingIconOnImage(htmlImageElement, imgData);
  }
  /* Défini les propriété de longueur et de largeur de l'image passé en paramètre, cette image possède la classe 'm-auto' qui attribut des
    marges automatiquement. Donc en ne définissant qu'un seul coté (height ou width), l'autre sera automatiquement défini.
    --> Cela permet, quel que soit l'orientation de l'image (portrait ou paysage) qu'elle soit toujours  contenu dans un carré
    qui ici a pour dimension 220x220 et sans être déformé -> Sorte de miniature.
   */
  setMaxSizeOfImage(htmlImageElement: HTMLImageElement) {
    if ( htmlImageElement.naturalHeight >= htmlImageElement.naturalWidth ) {
      htmlImageElement.height = 220;
    } else {
      htmlImageElement.width = 220;
    }
  }
  // Permet d'afficher l'image (Image caché -> Evite qu'elle soit brièvement affiché en taille réelle lors de son chargement)
  // Une fois chargé et que la taille a été défini (this.setMaxSizeOfImage), l'image peut être affiché
  removeDisplayNone(htmlImageElement: HTMLImageElement) {
    const classStr = htmlImageElement.className;
    const classToRemove = 'd-none';
    if ( classStr.includes( classToRemove ) ) {
      htmlImageElement.className = classStr.replace(classToRemove, '');
    }
  }
  // Ajoute une croix rouge en haut à droite de l'image en paramètre et ajoute à cette croix l'èvement permettant de supprimer l'image
  addClosingIconOnImage(htmlImageElement: HTMLImageElement, imgData: string) {
    const a = document.createElement('a');
    const i = document.createElement('i');
    a.className = 'position-relative text-decoration-none';
    i.className = 'position-absolute text-danger fas fa-window-close';
    i.style.right = '1px';
    i.style.fontSize = '20px';
    a.appendChild(i);

    a.addEventListener('click', () => {
      this.removeFileToUpload(imgData);
    });

    htmlImageElement.parentElement.insertBefore(a, htmlImageElement.nextElementSibling);
  }
  // Supprime l'image en paramètre de l'array 'imgPreview' et de l'array 'filesToUpload'
  removeFileToUpload(img: string | ArrayBuffer) {
    this.formatUnsuppErrFile = null;
    this.sizeMaxErrFile = null;

    const index = this.imgPreview.findIndex(value => {
      return img === value;
    });

    if (index !== -1) {
      this.imgPreview.splice(index, 1);
      this.filesToUpload.splice(index, 1);
    }
    // Désactive le lien <a> (la croix rouge)
    return false;
  }
  // Déclenchement -> Si le modal d'ajout d'exemplaire est fermé -> Vidage des images chargées
  onCancelCreateSubItemForm() {
    this.imgPreview = [];
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
  checkIfModalCreateSubItemAlreadyOpened() {
   if (this.filesToUpload !== null && this.filesToUpload.length > 0 && this.imgPreview.length === 0) {
     const c = this.filesToUpload.length;
     const filesToUpload = this.filesToUpload;
     this.filesToUpload = [];

     for (let i = 0; i < c; i++) {
       this.addToImgPreview(filesToUpload[i], true);
     }
   }
  }
  // Renvoi la taille (en octect) de l'array contenant les fichiers (images) 'this.filesToUpload'
  getFilesSize(): number {
    let size = 0;
    if (this.filesToUpload && this.filesToUpload.length > 0) {
      for (const file of this.filesToUpload) {
        size += file.size;
      }
    }
    return size;
  }

  getSizeRemaining(): number {
    return Number(this.filesSizeMax - this.getFilesSize());
  }
}
