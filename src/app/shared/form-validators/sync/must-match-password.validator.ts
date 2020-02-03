import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export function MustMatchPassword() {
  return (anchorControl: AbstractControl) => {

    if (anchorControl && anchorControl.value) {
      const password = anchorControl.parent.get('password');
      const password2 = anchorControl.parent.get('password2');

      if (password.value !== password2.value) {
        if (anchorControl === password) {
          if (password2.errors === null) {
            password2.setErrors({mustmatchpassword: true});
            return null;
          }
        } else if (anchorControl === password2) {
          return {mustmatchpassword: true};
        }
      } else {
        if (anchorControl === password) {
          password2.setErrors(null);
          return null;

        } else if (anchorControl === password2) {
          return null;
        }
      }
    }
    return null;
  };
}
