import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {EstadosService} from './services/estados/estados.service';
import {PaisesService} from './services/paises/paises.service';
import {PersonaService} from './services/persona/persona.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  personaForm!: FormGroup;
  paises: any;
  estados: any;
  personas: any;


  constructor(
    public fb: FormBuilder,
    public estadosService: EstadosService,
    public paisesService: PaisesService,
    public personaService: PersonaService
  ) {

  }

  ngOnInit(): void {
    this.personaForm = new FormGroup({
      id:new FormControl(['']),
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      edad: new FormControl('', [Validators.required]),
      pais: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
    })

    this.paisesService.getAllPaises().subscribe(resp => {
        this.paises = resp;
      },
      error => {
        console.error(error)
      }
    );

    this.personaService.getAllPersonas().subscribe(resp => {
        this.personas = resp;
        console.log(resp);
      },
      error => {
        console.error(error)
      }
    );

    this.personaForm.get('pais')?.valueChanges.subscribe(value => {
      console.log('busca estados')
      console.log(value)
      if (value) {
        this.estadosService.getAllEstadosByPais(value.id).subscribe(resp => {
            this.estados = resp;
          },
          error => {
            console.error(error)
          }
        );
      }
    })

  }

  guardar(): void {
    const request = this.personaForm.value
    if (!request.estado) {
      alert('debe ingresar estado')
      return
    }
    this.personaService.savePersona(request).subscribe(resp => {
        this.personaForm.reset();
        this.personas=this.personas.filter((persona:any)=>resp.id!==persona.id);
        this.personas.push(resp);
      },
      error => {
        console.error(error)
      }
    )
  }

  eliminar(persona: any) {
    console.log(persona)
    console.log(this.personas)
    this.personaService.deletePersona(persona.id).subscribe(resp => {
      this.personas = this.personas.filter((e: any) => e.id != persona.id);
    })
  }

  editar(persona:any){
    this.personaForm.setValue({
      id:persona.id,
      nombre:persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad,
      pais:persona.pais ,
      estado: persona.estado,

    })
  }

}
