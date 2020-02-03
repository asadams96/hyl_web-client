import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {MustMatchPassword} from '../../shared/form-validators/sync/must-match-password.validator';
import {CheckCellPhoneControle} from '../../shared/form-validators/sync/cellphone-format.validator';
import {CharacterRepetition} from '../../shared/form-validators/sync/character-repetition.validator';
import {isString} from 'util';
import {SigninComponent} from '../signin/signin.component';
import {SignupForm} from './signup-form';
import {CheckAtomicEmail} from '../../shared/form-validators/async/atomic-email.async-validator';
import {CheckNoWiteSpace} from '../../shared/form-validators/sync/no-whitespace.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup = null;
  protected signupError: string;

  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private signinComponent: SigninComponent) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({

      email: ['', [Validators.required, CharacterRepetition(3),
                    Validators.pattern('^[a-z0-9._-]{3,99}@[a-z0-9._-]{3,99}\.[a-z]{2,}$')], [CheckAtomicEmail(this.authService)]],

      pseudo: ['', [Validators.required, CheckNoWiteSpace(), Validators.minLength(3), CharacterRepetition(3)]],

      surname: ['', [Validators.required, CheckNoWiteSpace(), CharacterRepetition(3),
                      Validators.pattern('[a-zA-Z -]*'), Validators.minLength(3)]],

      name: ['', [Validators.required, CheckNoWiteSpace(), CharacterRepetition(3),
                  Validators.pattern('[a-zA-Z-]*'), Validators.minLength(3)]],

      civility: ['', []],

      cellphone: ['', [CheckCellPhoneControle()]],

      password: ['', [Validators.required, Validators.minLength(8), MustMatchPassword()]],

      password2: ['', [Validators.required, MustMatchPassword()]],
    });

  }

  onSubmitForm() {
    const formValue = this.signupForm.value;
    const signupForm = new SignupForm(formValue.email, formValue.pseudo, formValue.surname,
                                      formValue.name, formValue.civility, formValue.cellphone, formValue.password);
    this.authService.signup(signupForm).subscribe(
      next => {
        if ( !isString(next) ) {
          this.router.navigate(['/error']);
        }
        this.signinComponent.manualySignin( String(next) );
      },
      error => {
        if (error && String(error.status)[0] === '4') {
          this.signupError = 'Une erreur s\'est produite...';
        } else if (error && String(error.status[0]) === '5') {
          this.router.navigate(['/error']);
        }
      }
    );
  }
}
