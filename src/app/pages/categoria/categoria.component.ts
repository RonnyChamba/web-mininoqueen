import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit {
  validacionCategoria: FormGroup;
  categoria: any[]=[];
  constructor(
    private fb: FormBuilder,
    private CategoriaService: CategoriaService,
    private toastr: ToastrService
  ) {
    
  this.validacionCategoria = this.fb.group({
    categoria: ['', Validators.required],
  });
  }
  ngOnInit(): void {
    this.getCategoria();
  }


  user_validation_messages = {
    categoria: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
  };

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

  
  getCategoria() {
    this.CategoriaService.getCategoria().subscribe((data) => {
      this.categoria =[];
      data.forEach((element: any) => {
        // console.log(element.payload.doc.id)
        this.categoria.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      // console.log(this.categoria)
    });
  }


}
