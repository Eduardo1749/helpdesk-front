import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css']
})
export class ChamadoUpdateComponent implements OnInit {

  
  chamado: Chamado = {
    prioridade:  '',
    status:      '',
    titulo:      '',
    observacoes: '',
    tecnico:     '',
    cliente:     '',
    nomeCliente: '',
    nomeTecnico: ''
  }

  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];


  prioridade: FormControl = new FormControl(null, [Validators.required]);
  status:     FormControl = new FormControl(null, [Validators.required]);
  titulo:     FormControl = new FormControl(null, [Validators.required]);
  observacoes:FormControl = new FormControl(null, [Validators.required]);
  tecnico:    FormControl = new FormControl(null, [Validators.required]);
  cliente:    FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService:    ToastrService,
    private router:                 Router,
    private route:          ActivatedRoute,
  ) {}

  // Esse método será executado assim que a página for carregada
  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.findById();
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findById(): void{
    this.chamadoService.findById(this.chamado.id).subscribe(resposta => {
      this.chamado = resposta;
    }, ex => {
      this.toastService.error(ex.error.error);
    })
  }

  update(): void{
    this.chamadoService.update(this.chamado).subscribe(resposta => {
      this.toastService.success('Chamado atualizado com sucesso', 'Chamado atualizado');
      this.router.navigate(['chamados']);
    }, ex => {
      this.toastService.error(ex.error.error);
    })
  }

  // Esse método chama o método findAll que está no service e e coloca a resposta no array clientes
  findAllClientes(): void{
    this.clienteService.findAll().subscribe(resposta =>{
      this.clientes = resposta;
    })
  }

  // Esse método chama o método findAll que está no service e e coloca a resposta no array tecnicos
  findAllTecnicos(): void{
    this.tecnicoService.findAll().subscribe(resposta =>{
      this.tecnicos = resposta;
    })
  }

  // Esse método verifica se todos os campos preenchidos pelo usuario estão validos
  validaCampos(): boolean {
    return this.prioridade.valid && this.status.valid && this.titulo.valid 
       && this.observacoes.valid && this.tecnico.valid && this.cliente.valid
  }

  // Esse método não está legal pois tem valores literais o que não é muito legal
  retornaStatus(status: any): string{
    if(status == '0'){
      return 'Aberto'
    }else if(status == '1'){
      return 'Em andamento'
    }else{
      return 'Encerrado'
    }
  }

  // Esse método não está legal pois tem valores literais o que não é muito legal
  retornaPrioridade(prioridade: any): string{
    if(prioridade == '0'){
      return 'Baixa'
    }else if(prioridade == '1'){
      return 'Média'
    }else{
      return 'Alta'
    }
  }

}