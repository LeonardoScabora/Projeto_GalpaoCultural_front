import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VisualizarEmpDTO } from '../model/VisualizarEmpDTO';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmService {
  private listarTodos = 'https://projeto-galpaocultural-back.onrender.com/adm/pendentes'
  private listarAtrasados = 'https://projeto-galpaocultural-back.onrender.com/adm/atrasados'

  constructor(private router: Router, private http: HttpClient) { }

  async todosEmprestimos(): Promise<VisualizarEmpDTO[]> {
    
    const token = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return await firstValueFrom(
      this.http.get<VisualizarEmpDTO[]>(this.listarTodos, { headers })
    );
  }

  async todosEmprestimosAtrasados(): Promise<VisualizarEmpDTO[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return await firstValueFrom(this.http.get<VisualizarEmpDTO[]>(this.listarAtrasados, { headers }));
  }
}
