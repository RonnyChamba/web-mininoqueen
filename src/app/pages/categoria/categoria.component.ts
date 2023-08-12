import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent {
  constructor(private fb: FormBuilder) {}

  public validacionCategoria = this.fb.group({
    categoria: ['', Validators.required]   
     
  });
  
  user_validation_messages = {
    categoria: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      }
    ],};

    
    get categoriaValido() {
      return (
        this.validacionCategoria.get('categoria')?.dirty &&
        this.validacionCategoria.get('categoria')?.touched
      );
    }
  
    get categoriaNoValido() {
      return (
        this.validacionCategoria.get('categoria')?.invalid &&
        this.validacionCategoria.get('categoria')?.touched
      );
    }
}
